---
title: Exporting
---

Many sites are effectively *static*, which is to say they don't actually need an Express server backing them. Instead, they can be hosted and served as static files, which allows them to be deployed to more hosting environments (such as [Netlify](https://www.netlify.com/) or [GitHub Pages](https://pages.github.com/)). Static sites are generally cheaper to operate and have better performance characteristics.

Ramber allows you to *export* a static site with a single zero-config `ramber export` command. In fact, you're looking at an exported site right now!

Static doesn't mean non-interactive — your Hamber components work exactly as they do normally, and you still get all the benefits of client-side routing and prefetching.


### ramber export

Inside your Ramber project, try this:

```bash
# npx allows you to use locally-installed dependencies
npx ramber export
```

This will create a `__ramber__/export` folder with a production-ready build of your site. You can launch it like so:

```bash
npx serve __ramber__/export
```

Navigate to [localhost:5000](http://localhost:5000) (or whatever port `serve` picked), and verify that your site works as expected.

You can also add a script to your package.json...

```js
{
	"scripts": {
		...
		"export": "ramber export"
	}
}
```

...allowing you to `npm run export` your app.


### How it works

When you run `ramber export`, Ramber first builds a production version of your app, as though you had run `ramber build`, and copies the contents of your `static` folder to the destination. It then starts the server, and navigates to the root of your app. From there, it follows any `<a>`, `<img>`, `<link>` and `<source>` elements it finds pointing to local URLs, and captures any data served by the app.

Because of this, any pages you want to be included in the exported site must either be reachable by `<a>` elements or added to the `--entry` option of the `ramber export` command.

The `--entry` option expects a string of space-separated values. Examples:

```bash
ramber export --entry "some-page some-other-page"
```

Setting `--entry` overwrites any defaults. If you wish to add export entrypoints _in addition_ to `/` then make sure to add `/` as well or `ramber export` will not visit the index route.


### When not to export

The basic rule is this: for an app to be exportable, any two users hitting the same page of your app must get the same content from the server. In other words, any app that involves user sessions or authentication is *not* a candidate for `ramber export`.

Note that you can still export apps with dynamic routes, like our `src/routes/blog/[slug].hamber` example from earlier. `ramber export` will intercept `fetch` requests made inside `preload`, so the data served from `src/routes/blog/[slug].json.js` will also be captured.


### Route conflicts

Because `ramber export` writes to the filesystem, it isn't possible to have two server routes that would cause a directory and a file to have the same name. For example, `src/routes/foo/index.js` and `src/routes/foo/bar.js` would try to create `export/foo` and `export/foo/bar`, which is impossible.

The solution is to rename one of the routes to avoid conflict — for example, `src/routes/foo-bar.js`. (Note that you would also need to update any code that fetches data from `/foo/bar` to reference `/foo-bar` instead.)

For *pages*, we skirt around this problem by writing `export/foo/index.html` instead of `export/foo`.
