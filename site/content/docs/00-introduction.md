---
title: Introduction
---

### What is Ramber?

Ramber is a framework for building extremely high-performance web apps. You're looking at one right now! There are two basic concepts:

* Each page of your app is a [Hamber](https://hamberjs.web.app) component
* You create pages by adding files to the `src/routes` directory of your project. These will be server-rendered so that a user's first visit to your app is as fast as possible, then a client-side app takes over

Building an app with all the modern best practices — code-splitting, offline support, server-rendered views with client-side hydration — is fiendishly complicated. Ramber does all the boring stuff for you so that you can get on with the creative part.

You don't need to know Hamber to understand the rest of this guide, but it will help. In short, it's a UI framework that compiles your components to highly optimized vanilla JavaScript. Read the [introductory blog post](https://hamberjs.web.app/blog/hamber-3-rethinking-reactivity) and the [tutorial](https://hamberjs.web.app/tutorial) to learn more.


### Why the name?

In war, the soldiers who build bridges, repair roads, clear minefields and conduct demolitions — all under combat conditions — are known as *rambers*.

For web developers, the stakes are generally lower than for combat engineers. But we face our own hostile environment: underpowered devices, poor network connections, and the complexity inherent in front-end engineering. Ramber, which is short for <b>S</b>velte <b>app</b> mak<b>er</b>, is your courageous and dutiful ally.


### Comparison with Next.js

[Next.js](https://github.com/zeit/next.js) is a React framework from [Vercel (formerly ZEIT)](https://vercel.com), and is the inspiration for Ramber. There are a few notable differences, however:

* Ramber is powered by Hamber instead of React, so it's faster and your apps are smaller
* As well as *pages*, you can create *server routes* in your `src/routes` directory. This makes it very easy to, for example, add a JSON API such as the one powering this very page (try visiting [/docs.json](/docs.json))
* Links are just `<a>` elements, rather than framework-specific `<Link>` components. That means, for example, that [this link right here](/), despite being inside a blob of markdown, works with the router as you'd expect


### Getting started

The easiest way to start building a Ramber app is to clone the [ramber-template](https://github.com/hamberjs/ramber-template) repo with [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit "hamberjs/ramber-template#rollup" my-app
# or: npx degit "hamberjs/ramber-template#webpack" my-app
cd my-app
npm install
npm run dev
```

This will scaffold a new project in the `my-app` directory, install its dependencies, and start a server on [localhost:3000](http://localhost:3000). Try editing the files to get a feel for how everything works – you may not need to bother reading the rest of this guide!

#### TypeScript support

Ramber supports TypeScript. If you are using the template with Rollup as described in "Getting started" you can convert your project to TypeScript simply by running:

```bash
node scripts/setupTypeScript.js
```
