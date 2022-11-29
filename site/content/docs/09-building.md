---
title: Building
---

Up until now we've been using `ramber dev` to build our application and run a development server. But when it comes to production, we want to create a self-contained optimized build.

### ramber build

This command packages up your application into the `__ramber__/build` directory. (You can change this to a custom directory, as well as controlling various other options — do `ramber build --help` for more information.)

The output is a Node app that you can run from the project root:

```bash
node __ramber__/build
```