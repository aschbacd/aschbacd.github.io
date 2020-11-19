---
title: "Minified Docker images for frontend applications"
date: "2019-06-06"
---

Nowadays many developers containerize their projects including json-apis and frontend applications.
In Go for example it is common to use multi-staged builds in docker where in the first step a binary is being compiled
from the source code and in the second step this file is being copied to an empty docker image that is build from scratch.

```docker
# Build
FROM golang:1.12-alpine AS base
COPY . /go/src/github.com/dev/project

WORKDIR /go/src/github.com/dev/project
RUN apk add git gcc

# Go modules
ENV GO111MODULE=on
RUN go mod download

# Compile
RUN go build -a -tags netgo -ldflags '-w' -o /go/bin/project /go/src/github.com/dev/project/main.go

# Package
FROM scratch
COPY --from=base /go/bin/project /project
ENTRYPOINT ["/project"]
```

Multi-staged builds have the advantage of being much smaller than single-staged builds, where dependencies
necessary for the compiling process are also contained within the actual image used in production. Unfortunately
many developers containerizing frontend applications written in JavaScript (React, Angular, VueJS) use the same
image to build and to serve their frontend application.

In this example I will use React to show you how to minify your Docker image to gain storage and also performance.
In React you can create a production build by using the following command:

```bash
npm run build
```

When the command finishes a new folder called `build` will appear in your project folder. This folder contains your
frontend application minified and ready to be executed. At this point you can manually execute the file `index.html`
and you will get the same response as in development.

Now we only need a web server that is capable of serving HTML-files
and their assets, so pretty much every web server you can think of. In this example I will use Nginx because it is a
very fast, reliable and small web server that is also available as a Docker image.

```docker
# Build
FROM node:11-slim AS base

# Workdir
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# Add environment path
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Compile static page
COPY . /usr/src/app
RUN npm install
RUN npm run build

# Package
FROM nginx:alpine
COPY --from=base /usr/src/app/build /usr/share/nginx/html
```

As you can see in the first stage the project is being build by using the official NPM Docker image
and in the second stage the `build` folder is being copied to the web root of the Nginx web server.
By removing the build image afterwards (about 100MB) you will be left with a production Docker image
with about 15 - 20MB (the production image can also get bigger if many image assets are used in the
project).
