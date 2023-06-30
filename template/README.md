# Create React UI Lib

A CLI tool that bootstraps simple [Vite](https://vitejs.dev/) template for instant [React](https://reactjs.org/) UI library development.

- Unopinionated: no default styling, ESLint, pre-commit hooks — bring your own stuff if you need it.
- Type definitions are extracted using [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts).
- Bundles to ES and UMD modules, generates sourcemaps.
- Offers [Storybook](https://storybook.js.org/) or [Ladle](https://ladle.dev/) for docs which are easily deployed as GitHub pages.

## Getting started

Run the command:

```shell
npm create react-ui-lib@latest
```

## Publishing the library

1. Build the package: `npm run build`
2. Open `package.json`, update package description, author, repository, remove `"private": true`.
3. Run `npm publish`

## Publishing docs to GitHub pages

Storybook or Ladle static is built to `docs` directory which is under git. To publish it to GitHub Pages do this:

- Publish this repo to GitHub.
- Run `npm run build-docs`, commit `docs` folder and push.
- [Create a separate GitHub Pages repo](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-a-repository-for-your-site) if you haven't yet.
- [Set up GitHub pages for this project](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site) to build from `docs` folder from `main` branch.
  - To do this go to this repo's settings and open `Pages` section (menu on the left side). Select `Source` -> `Deploy from a branch`, select `Branch` -> `main` and `/docs` folder.

## Feedback

[Tell me](https://github.com/mlshv/create-react-ui-lib/issues/new) about your experience with Create React UI Lib. [Support the project](https://github.com/mlshv/create-react-ui-lib) by giving it a start on GitHub.
