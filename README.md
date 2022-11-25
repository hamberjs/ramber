# Ramber


## What is Ramber?

Ramber is a framework for building high-performance universal web apps.


## Get started

Clone the [starter project template](https://github.com/hamberjs/ramber-template).
When cloning you have to choose between rollup or webpack:

```bash
npx degit "hamberjs/ramber-template#rollup" my-app
# or: npx degit "hamberjs/ramber-template#webpack" my-app
```

...then install dependencies and start the dev server...

```bash
cd my-app
npm install
npm run dev
```

...and navigate to [localhost:3000](http://localhost:3000). To build and run in production mode:

```bash
npm run build
npm start
```

## Development

Pull requests are encouraged and always welcome. [Pick an issue](https://github.com/hamberjs/ramber/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) and help us out!

To install and work on Ramber locally:

```bash
git clone git@github.com:hamberjs/ramber.git
cd ramber
npm install
npm run dev
```

### Linking to a Live Project

You can make changes locally to Ramber and test it against a local Ramber project. For a quick project that takes almost no setup, use the default [ramber-template](https://github.com/hamberjs/ramber-template) project. Instruction on setup are found in that project repository.

To link Ramber to your project, from the root of your local Ramber git checkout:

```bash
cd ramber
npm link
```

Then, to link from `ramber-template` (or any other given project):

```bash
cd ramber-template
npm link ramber
```

## License

[LIL](LICENSE)