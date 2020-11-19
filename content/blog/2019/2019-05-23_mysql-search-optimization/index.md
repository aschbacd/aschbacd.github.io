---
title: "MySQL search optimization"
date: "2019-05-23"
---

The goal of this post is to implement a search mechanism that searches for songs and artists in a playlist table,
that has about 11 million entries. All data has been gathered from a third party application that provides a history
of the songs played on Austrian radio stations. One entry consists of the play date, the title and the artist.
Unfortunately the data has to be downloaded as an html file that can be converted into SQL statements later on but
does not have any structure.

Thanks to [@davidkroell](https://github.com/davidkroell) for the help concerning the database optimization.

## Storing the data

At the beginning all the data had to be stored in a MySQL database. Therefore 2 tables were created: *radio_stations* and *songs*.

**Radio Stations:**

The table *radio_stations* was created using the following SQL statement. The radio stations were inserted manually
and contain and id, an abbreviation that is used when downloading new data from the third party application and a display name.

```sql
CREATE TABLE `radio_stations` (
    `id` INT AUTO_INCREMENT,
    `abbreviation` VARCHAR(20) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    CONSTRAINT pk_radio_stations PRIMARY KEY (id)
);
```

| id   | abbreviation | name                   |
| ---- | ------------ | ---------------------- |
| 1    | fm4          | FM4                    |
| 2    | oe3          | Hitradio Ö3            |
| 3    | radio_bgl    | Radio Burgenland       |
| 4    | radio_ktn    | Radio Kärnten          |
| 5    | radio_noe    | Radio Niederösterreich |
| 6    | radio_ooe    | Radio Oberösterreich   |
| 7    | radio_sbg    | Radio Salzburg         |
| 8    | radio_stmk   | Radio Steiermark       |
| 9    | radio_tirol  | Radio Tirol            |
| 10   | radio_vbg    | Radio Vorarlberg       |
| 11   | radio_wien   | Radio Wien             |

**Songs:**

During the first iteration the table *songs* had the following columns. This table has not been normalized
because of the sloppy input data and also for benchmarks. All data has been stored by using generated SQL
files from the downloaded HTML file. To convert the HTML into an SQL file a custom bash script was used that
replaced the HTML syntax with SQL syntax by using *sed*.

```sql
CREATE TABLE `songs` (
    `id` INT AUTO_INCREMENT,
    `radio_station_id` INT NOT NULL,
    `play_date` DATETIME NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `artist` VARCHAR(255) NOT NULL,
    constraint pk_songs primary key (id),
    constraint fk_songs_radio_stations foreign key (radio_station_id)
    references radio_stations(id)
);
```

| id   | radio_station_id | play_date           | title    | artist    |
| ---- | ---------------- | ------------------- | -------- | --------- |
| 1    | 1                | 2012-01-01 00:00:00 | Title 01 | Artist 01 |
| 2    | 1                | 2012-01-01 00:05:00 | Title 02 | Artist 02 |
| 3    | 1                | 2012-01-01 00:10:00 | Title 03 | Artist 03 |
| 4    | 1                | ...                 | ...      | ...       |
| 5    | 1                | ...                 | ...      | ...       |

## Search

The first search implementation only allowed searching for song titles and not for artists.
This has been realized using the following query (simple but inefficient).

```sql
SELECT title, artist, COUNT(*) as count FROM songs
WHERE radio_station_id = 1
AND title like "%test%"
GROUP BY title, artist, radio_station_id
ORDER BY count DESC;
```

| title                    | artist                    | count |
| ------------------------ | ------------------------- | ----- |
| Whitest Boy On The Beach | Fat White Family          | 95    |
| The Greatest View        | Flume / Isabelle Manfredi | 77    |
| Test                     | Little Dragon             | 60    |

**Benchmarks:**

| Search text | MySQL speed | Go API speed |
| ----------- | ----------- | ------------ |
| test        | 3094ms      | 3105ms       |
| a           | 3109ms      | 3055ms       |
| bc          | 2390ms      | 2491ms       |
| yellow      | 1391ms      | 1682ms       |
| monday      | 1329ms      | 1557ms       |

## Optimization 01 - Cached table

The first optimization was a cache table that stores all grouped songs per radio station. Therefore the
group by can be left away. To insert the grouped entries the following statement has been used:

```sql
-- CREATE TABLE
CREATE TABLE songs_per_radio_station (
    id INT AUTO_INCREMENT,
    title VARCHAR(255),
    artist VARCHAR(255),
    radio_station_id INT NOT NULL,
    count INT NOT NULL,
    CONSTRAINT pk_songs_per_radio_station PRIMARY KEY (id),
    CONSTRAINT fk_songs_per_radio_station_radio_station FOREIGN KEY (radio_station_id)
        REFERENCES radio_stations (id)
);

-- INSERT DATA
INSERT INTO songs_per_radio_station
SELECT null as id, title, artist, radio_station_id, count(*) as count
FROM songs
GROUP BY title, artist, radio_station_id
ORDER BY radio_station_id asc, count desc;
```

Afterwards the following statement can be used to search for a title:

```sql
SELECT * FROM songs_per_radio_station
WHERE radio_station_id = 1
AND title like "%test%"
ORDER BY count DESC;
```

| Search text | old MySQL speed | new MySQL speed | old Go API speed | new Go API speed |
| ----------- | --------------- | --------------- | ---------------- | ---------------- |
| test        | 3094ms          | 110ms           | 3105ms           | 721ms            |
| a           | 3109ms          | 141ms           | 3055ms           | 869ms            |
| bc          | 2390ms          | 94ms            | 2491ms           | 212ms            |
| yellow      | 1391ms          | 78ms            | 1682ms           | 181ms            |
| monday      | 1329ms          | 62ms            | 1557ms           | 188ms            |

## Optimization 02 - Fulltext Index

After creating a cache table a fulltext index has been used on the cached table. This allows
the user to search for songs and artists. The best matching case will be shown first and afterwards
the entries are sorted by count.

```sql
-- CREATE TABLE
CREATE TABLE songs_per_radio_station (
    id INT AUTO_INCREMENT,
    title VARCHAR(255),
    artist VARCHAR(255),
    radio_station_id INT NOT NULL,
    count INT NOT NULL,
    FULLTEXT (title, artist),
    CONSTRAINT pk_songs_per_radio_station PRIMARY KEY (id),
    CONSTRAINT fk_songs_per_radio_station_radio_station FOREIGN KEY (radio_station_id)
        REFERENCES radio_stations (id)
);

-- INSERT DATA
INSERT INTO songs_per_radio_station
SELECT null as id, title, artist, radio_station_id, count(*) as count
FROM songs
GROUP BY title, artist, radio_station_id
ORDER BY radio_station_id asc, count desc;
```

Songs and artists can be searched using the following query:

```sql
SELECT id, title, artist, count
FROM songs_per_radio_station
WHERE radio_station_id = 1
AND MATCH (title, artist) AGAINST ("test")
LIMIT 30
OFFSET 0;
```

| Search text | old MySQL speed | new MySQL speed | old Go API speed | new Go API speed |
| ----------- | --------------- | --------------- | ---------------- | ---------------- |
| test        | 110ms           | 31ms            | 721ms            | 164ms            |
| a           | 141ms           | 31ms            | 869ms            | 31ms             |
| bc          | 94ms            | 16ms            | 212ms            | 34ms             |
| yellow      | 78ms            | 31ms            | 181ms            | 32ms             |
| monday      | 62ms            | 32ms            | 188ms            | 34ms             |

These outcomes lead to the final result which is a performance improvement with a maximum request time
reduction of 1/100 of the original request duration.
