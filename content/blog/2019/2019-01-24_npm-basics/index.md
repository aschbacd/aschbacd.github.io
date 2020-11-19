---
title: "NPM basics"
date: "2019-01-24"
---

NPM (short for Node Package Manager) is a well known package manager used in web development.
NPM provides a huge database of packages that can easily be installed using the command line application.

When installing Node.js, NPM will be installed automatically on your machine.
To get the current version of the installed instance you can run the following command:

```bash
# show version
npm -v
```

To initialize a package and to configure the default values for the initiation process the following commands can be used:

```bash
# init package
npm init
npm init -y # accept default values

# set default npm values
npm config set init-author-name
npm set init-license "MIT"

# get default npm values
npm get init-author-name

# delete default npm values
npm config delete init-author-name
```

NPM uses a configuration file to get all required dependencies for a project.
These dependencies are stored in a file called `package.json`, located at the root of the project.
The following commands can be used to install packages and save them to the required dependencies:

```bash
npm install lodash --save

# install from dependencies
npm install

# no dev-dependencies
npm install --production
```

To remove a package from a project the following commands can be used:

```bash
npm uninstall gulp-sass --save-dev
npm remove gulp --save-dev
```

NPM is also capable of installing a specific version of a particular package. Therefore the following commands can be used:

```bash
npm install lodash@4.17.3 --save

# update to latest
npm update lodash

# auto update minor
"lodash" : "^4.17.11"

# auto update patch
"lodash" : "~4.17.11"
```

A package can not only be installed into a project folder but also as a global package using the following command:

```bash
# install global package
npm install -g nodemon
```

Thanks to Brad Traversy for providing this [usefuly video](https://youtu.be/jHDhaSSKmB0) about the basics of NPM.
