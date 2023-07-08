# Create React UI Lib

[![npm version](https://badge.fury.io/js/create-react-ui-lib.svg)](https://www.npmjs.com/package/create-react-ui-lib)

A CLI tool that bootstraps simple [Vite](https://vitejs.dev/) template for painless [React](https://reactjs.org/) UI library development.

- Unopinionated: no default styling, mandatory ESLint, pre-commit hooks — bring your own stuff if you need it.
- Type definitions are extracted using [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts).
- Bundles to ES and UMD modules, generates sourcemaps.
- Uses [Storybook](https://storybook.js.org/) or [Ladle](https://ladle.dev/) for docs which are easily deployed as GitHub pages.
- Optional ESLint with recommended settings for each of these plugins: [typescript](https://typescript-eslint.io/), [prettier](https://github.com/prettier/eslint-plugin-prettier), [react](https://github.com/jsx-eslint/eslint-plugin-react), [react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks), [jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y).

## Getting started

Run the command:

```shell
npm create react-ui-lib@latest
```

## Publishing the library

1. Build the package: `npm run build`
2. Open `package.json`, update package description, author, repository, remove `"private": true`.
3. Run `npm publish`

## Publishing Storybook to GitHub pages

Storybook static is built to `docs` directory which is under git. To publish it to GitHub Pages do this:

- Publish this repo to GitHub.
- Run `npm run build-storybook`, commit `docs` folder and push.
- [Create a separate GitHub Pages repo](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-a-repository-for-your-site) if you haven't yet.
- [Set up GitHub pages for this project](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site) to build from `docs` folder from `main` branch.
  - To do this go to this repo's settings and open `Pages` section (menu on the left side). Select `Source` -> `Deploy from a branch`, select `Branch` -> `main` and `/docs` folder.

## Contributing

Feel free to [open an issue](https://github.com/mlshv/create-react-ui-lib/issues/new) or create a PR if you'd like to contribute 🙌

## License

The project is available as open source under the terms of the [MIT License](LICENSE).
