---
title: Deployment
---

Ramber apps run anywhere that supports Node 10 or higher.

### Deploying from ramber build

You will need the `__ramber__/build` and `static` directories as well as the production dependencies in `node_modules` to run the application. Node production dependencies can be generated with `npm ci --prod`, you can then start your app with:

```bash
node __ramber__/build
```

### Deploying service workers

Ramber makes the Service Worker file (`service-worker.js`) unique by including a timestamp in the source code
(calculated using `Date.now()`).

In environments where the app is deployed to multiple servers (such as [Vercel]), it is advisable to use a
consistent timestamp for all deployments. Otherwise, users may run into issues where the Service Worker
updates unexpectedly because the app hits server 1, then server 2, and they have slightly different timestamps.

To override Ramber's timestamp, you can use an environment variable (e.g. `RAMBER_TIMESTAMP`) and then modify
the `service-worker.js`:

```js
const timestamp = process.env.RAMBER_TIMESTAMP; // instead of `import { timestamp }`

const ASSETS = `cache${timestamp}`;

export default {
	/* ... */
	plugins: [
		/* ... */
		replace({
			/* ... */
			'process.env.RAMBER_TIMESTAMP': process.env.RAMBER_TIMESTAMP || Date.now()
		})
	]
}
```

Then you can set it using the environment variable, e.g.:

```bash
RAMBER_TIMESTAMP=$(date +%s%3N) npm run build
```

When deploying to [Vercel], you can pass the environment variable into the Vercel CLI tool itself:

```bash
vercel -e RAMBER_TIMESTAMP=$(date +%s%3N)
```

[Vercel]: https://vercel.com/home
