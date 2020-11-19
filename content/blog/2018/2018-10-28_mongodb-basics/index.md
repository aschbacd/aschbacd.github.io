---
title: MongoDB basics
date: "2018-10-28"
---

MongoDB is one of the leading NoSQL databases and is often used when dealing
with new technologies like NodeJS, React or Angular. To understand the basics
of MongoDB I created this post that shows a few queries to help you understand
the structure and functionality of the database.

In MongoDB we have so called collections which can be interpreted as tables, where
you can store documents. A document is basically like a row in an SQL database that
can have as many fields as you want. A field is a key – value pair stored in a document.

**Show and use databases:**

```bash
# show all databases
show dbs

# use a database
use <db_name>

# show the current database name
db
```

These documents can also have different amounts of fields, like in the following example:

```bash
db.customers.insert([
    {
        first_name:"Bryan",
        last_name:"Cranston"
    },
    {
        first_name:"Aaron",
        last_name:"Paul",
        gender:"male"
    }
]);
```

**Update documents in collection:**

Documents can be updated with all fields at once, but single fields can also change their value.

```bash
# update whole document
db.customers.update({first_name:"Bryan"},{
    first_name:"Bryan",
    last_name:"Cranston",
    gender:"male"
});

# change one field
db.customers.update({first_name:"Aaron"},{$set:{gender:"male"}});
db.customers.update({first_name:"Aaron"},{$set:{age:39}});

# increment field
db.customers.update({first_name:"Aaron"},{$inc:{age:5}});

# remove field
db.customers.update({first_name:"Aaron"},{$unset:{age:1}});

# insert when updating non existing documents
db.customers.update(
    {first_name:"Anna"},
    {first_name:"Anna", last_name:"Gunn"},
    {upsert: true}
);

# change key
db.customers.update({first_name:"Aaron"},{$rename:{"gender":"sex"}});
```

**Remove document:**

```bash
# remove all with name Aaron
db.customers.remove({first_name:"Aaron"});

# remove first one named Aaron
db.customers.remove({first_name:"Aaron"},{justOne:true});
```

**Find documents:**

```bash
# show all documents in collection
db.customers.find();

# where first name is Anna
db.customers.find({first_name:"Anna"});

# where first name is Anna or Jon
db.customers.find({$or:[{first_name:"Anna"},{first_name:"Jon"}]});

# greater than / less than (gt/lt/gte/lte)
db.customers.find({age:{$lt:40}});

# find by interleaved fields
db.customers.find({"address.city":"Los Angeles"});
```

**Sorting, count and foreach:**

```bash
# sorting
db.customers.find().sort({last_name: 1});   # ascending order
db.customers.find().sort({last_name: -1});  # descending order

# count
db.customers.find().sort({last_name: -1}).count();

# limit to 5 results
db.customers.find().sort({last_name: -1}).limit(5);

# print all customer names
db.customers.find().forEach(function(doc){
    print("Customer name: "+doc.first_name)
});
```

Thanks for the [great video](https://youtu.be/pWbMrx5rVBE) on MongoDB to Brad Traversy.
The video provides you with the same content listed above.
