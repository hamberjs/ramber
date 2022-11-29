---
title: Base URLs
---

Ordinarily, the root of your Ramber app is served at `/`. But in some cases, your app may need to be served from a different base path — for example, if Ramber only controls part of your domain, or if you have multiple Ramber apps living side-by-side.

This can be done like so:

```js
// app/server.js

express() // or Polka, or a similar framework
	.use(
		'/my-base-path', // <!-- add this line
		compression({ threshold: 0 }),
		serve('assets'),
		ramber.middleware()
	)
	.listen(process.env.PORT);
```

Ramber will detect the base path and configure both the server-side and client-side routers accordingly.

If you're [exporting](docs#exporting) your app, you will need to tell the exporter where to begin crawling:

```bash
ramber export --basepath my-base-path
```
