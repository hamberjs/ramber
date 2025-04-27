---
title: Stores
---

The `page` and `session` values passed to `preload` functions are available to components as [stores](https://hamberjs.web.app/tutorial/writable-stores), along with `preloading`.

A component can retrieve the stores using the `stores` function:

```html
<script>
	import { stores } from '@ramber/app';
	const { preloading, page, session } = stores();
</script>
```

* `preloading` contains a read-only boolean value, indicating whether or not a navigation is pending
* `page` contains read-only information about the current route. See [preloading](docs#Arguments) for details.
* `session` can be used to pass data from the server related to the current request. It is a [writable store](https://hamberjs.web.app/tutorial/writable-stores), meaning you can update it with new data. If, for example, you populate the session with the current user on the server, you can update the store when the user logs in. Your components will refresh to reflect the new state


### Seeding session data

`session` is `undefined` by default. To populate it with data, implement a function that returns session data given an HTTP request. Pass it as an option to `ramber.middleware` when the server is started.

As an example, let's look at how to populate the session with the current user. First, add the `session` parameter to the Ramber middleware:

```js
// src/server.js
polka()
	.use(
		// ...
		ramber.middleware({
			// customize the session
			session: (req, res) => ({
				user: req.user
			})
		})
	)
```

`req` is an `http.ClientRequest` and `res` an `http.ServerResponse`.

The session data must be serializable. This means it must not contain functions or custom classes, just built-in JavaScript data types.

The `session` function may return a `Promise` (or, equivalently, be `async`).

> Note that if `session` returns a `Promise` (or is `async`), it will be re-awaited for on **every** server-rendered page route.
