# Contributing

If you want to submit a blog post just fork this repository and create a new folder in
`content/bog/<yyyy>/<mm>` with the name of your post. Make sure to only use lower case letters and
dashes `-`. The file containing the blog post is called `index.md` and resides in your newly
created directory. All images used in the blog post should reside in the same folder as the file
`index.md`.

At the beginning, the markdown file must include the following lines of configuration code:

```yaml
---
title: "<Post title>"           # e.g. "Signed Git commits"
date: "<yyyy-mm-dd>"            # e.g. "2020-01-01"
author: "<GitHub username>"     # e.g. "aschbacd"
---
```

All git commit messages and also the pull request title must follow the following scheme:

```bash
[BLOG|SRC] Abcd efgh ijkl mnop

# examles
[BLOG] Add post about pgp git signatures
[SRC] Fix footer text
```

The branch name must be called:

```bash
feature|bug|docs|blog/abcd-efgh-ijkl-mnop

# examples
feature/add-gitlint-action
docs/add-contribution-guidelines
blog/add-pgp-git-signatures
```
