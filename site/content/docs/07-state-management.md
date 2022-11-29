---
title: Stores
---

The `page` and `session` values passed to `preload` functions are available to components as [stores](https://hamberjs.web.app/tutorial/writable-stores), along with `preloading`.

Inside a component, get references to the stores like so:

```html
<script>
	import { stores } from '@ramber/app';
	const { preloading, page, session } = stores();
</script>
```

* `preloading` contains a readonly boolean value, indicating whether or not a navigation is pending
* `page` contains a readonly `{ path, params, query }` object, identical to that passed to `preload` functions
* `session` contains whatever data was seeded on the server. It is a [writable store](https://hamberjs.web.app/tutorial/writable-stores), meaning you can update it with new data (for example, after the user logs in) and your app will be refreshed


### Seeding session data

On the server, you can populate `session` by passing an option to `ramber.middleware`:

```js
// src/server.js
express() // or Polka, or a similar framework
	.use(
		serve('assets'),
		authenticationMiddleware(),
		ramber.middleware({
			session: (req, res) => ({
				user: req.user
			})
		})
	)
	.listen(process.env.PORT);
```

> Session data must be serializable — no functions or custom classes, just built-in JavaScript data types