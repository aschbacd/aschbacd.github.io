---
title: Time saving Cisco IOS commands
date: "2018-08-05"
---

When viewing the configuration of implemented technologies you often get a huge list returned
with a bunch of useless entries that are simply not relevant in your case. Luckily there are
some time saving commands available in Cisco’s IOS operating system that can filter out irrelevant
information and only show those things you really care about.

**Include / Exclude:**

The include and exclude commands can be used to show only lines that contain a specific keyword or sort those that do.

```
# show only lines containing clock
Router#show run | inc clock

# exclude useless processes
Router#show processes cpu | exc 0.00

# exclude useless telephone entries
Router#show mac-address-table | exc SEP

# only show entries for mac address beginning with abcd
Router#show mac-address-table | inc abcd
```

**Selection:**

With section it is very easy to verify that your configuration of a specific technology is correct or if it is missing something.

```
# show only router configuration
Router#show run | section router

# show only ospf configuration
Router#show run | section ospf
```

**Do:**

This command you may already know, nevertheless it’s one of the most practical ones, because it allows you to run commands from any configuration path in IOS.

```
# show interfaces configuration inside router configuration mode
Router(config-router)#do show ip int brief
```

Thanks to Network Chuck for providing a very [useful video tutorial](https://youtu.be/9Vs56S95Mrs) on YouTube.
If you want to watch the full video do so, it’s great. For even more time saving cli
hacks check out the [free Udemy course by David Bombal](https://www.udemy.com/cool-cisco-ios-commands-master-cli-tips-cli-like-a-boss-time-saving).
