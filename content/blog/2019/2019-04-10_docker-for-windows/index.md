---
title: "Docker for Windows - The better solution"
date: "2019-04-10"
---

Since the official Docker for Windows platform utilizes Hyper-V any other hypervisor won't work anymore.
After installing Docker for Windows, my VMWare virtual machines were not able to start.
But I still want to use Docker on my laptop without a VM.
I found out, that Docker has built-in [SSH support](https://medium.com/lucjuggery/docker-tips-access-the-docker-daemon-via-ssh-97cd6b44a53) since version 18.09.
This is made possible through the client-server architecture.

> Note: I also mentioned this in my [presentation about the Docker ecosystem](https://github.com/davidkroell/docker-deepdive)

## What we need

* A Linux server with Docker (18.09+) and SSH access
* A Windows machine (your device)

Every command issued on the windows machine will be executed on the linux server.

## Preparation

We are now going to prepare the environment.

A dollar sign (`$`) means, that this command should be executed on the linux server.
A greater than sign (`>`) means, that this command should be executed on the windows machine.

### Docker client

As far as I know, the standalone Docker client is not publicy available for Windows,
but it is built in Go and it's open source, so a binary may be built from source.

For this, we will use our linux server with Docker installed.

First, check if Docker version satisfies our needs.

```bash
$ docker -v
Docker version 18.09.4, build d14af54
```

If the Docker version is not at least 18.09, update your daemon.

```bash
$ git clone https://github.com/docker/cli
$ cd cli

# build the windows binary
$ make -f docker.Makefile binary-windows
```

The build runs inside a Docker container and therefore does not require any other dependencies.
The binary is then outputted in the `build` directory.
You can check the file type with the Linux `file` utility.

```bash
$ file build/docker-windows-amd64
build/docker-windows-amd64: PE32+ executable (console) x86-64, for MS Windows
```

Now, copy the file to your Windows machine and rename it to `docker`.

```bash
> scp johndoe@example.com:cli/build/docker-windows-amd64 docker
```

You may now execute it with `./docker`.
Copy this executeable to a location which is in your path environment variable.

```bash
> move docker C:\Windows\System32

# check version
> docker -v
Docker version 18.09.0-dev, build 51668a30
```

You may now try the client out.

```bash
> docker info
error during connect: Get http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.39/info: open //./pipe/docker_engine: Das System kann die angegebene Datei nicht finden. In the default daemon configuration on Windows, the docker client must be run elevated to connect. This error may also indicate that the docker daemon is not running.
```

As you can see, this does not work, because there is only the client installed, but not the daemon.

### DOCKER_HOST and SSH remotes

The Docker client wants to connect to a special file in the filesystem.
The daemon to connect to, can be specified in the CLI with the parameter `-H` (host).

```bash
> docker -H ssh://johndoe@example.com info
johndoe@example.com's password:
Containers: 17
 Running: 6
 Paused: 0
 Stopped: 11
Images: 117
[output truncated]
```

Type in your password and the Docker info prints out.
You may of course automate this with passwordless login, utilizing private keys.

As of now, you have to specify `-H ssh://...` in every call.
The environment variable `DOCKER_HOST` can be used to set this automatically.

```bash
> set DOCKER_HOST=ssh://johndoe@example.com
> docker info
johndoe@example.com's password:
Containers: 17
 Running: 6
 Paused: 0
 Stopped: 11
Images: 117
[output truncated]
```

This variable is only available in the current session.
To set this permanent, the Windows toolset can be used.
A guide for this is available [here](http://www.forbeslindesay.co.uk/post/42833119552/permanently-set-environment-variables-on-windows).

### Conclusion

Now, you are able to access a Docker daemon from your local windows device and your virtual machines are still working.
Additional software is not needed, just a simple binary.
