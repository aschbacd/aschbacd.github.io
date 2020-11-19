---
title: Add locations in Nginx
date: "2018-03-07"
---

**What is an Nginx location?**

Example web uri: <https://domain/page2>

On the web server there could simply be a folder inside the root directory called page2 to make this link available.
There is also another possibility to create such links by using locations.
When using locations the content folder can be anywhere as long it can be accessed by the www-data user and appropriate permissions.

**Add a location:**

To add locations you have to edit the site configuration file.
In my case I just have the default site enabled, because I can only access my server by one domain so I have to edit it like so:

```bash
# edit default site configuration
sudo nano /etc/nginx/sites-enabled/default
```

```nginx
# add location (domain/blog)
location /blog {
    root /var/www/pages/;
    try_files $uri $uri/ /blog/index.php?args; # wordpress routes

    # include php
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_param SCRIPT_FILENAME $request_filename;
        fastcgi_pass unix:/var/run/php/php7.0-fpm.sock;
    }
}
```

**Difference between root and alias:**

When using root, the folder name has to be the same as the location name, because you just provide the path to the parent folder, not the full location.

**configuration path:** /var/www/pages/  
**points at:** /var/www/pages/blog  
**used by:** domain/blog

When using alias, you have to enter the full location path but therefore it doesn’t have to be named like the location name.

**configuration path:** /var/www/pages/test  
**used by:** domain/blog
