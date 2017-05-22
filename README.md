# dash-atom-docs

Generate docset for Kapeli's [Dash][1] Mac app from the [Atom.io][2] API docs


## Usage

API docs are scraped from [atom.io/docs/api][3] using [httrack][4] and then moved to the
`Atom.docset/Contents/Resources/Documents` folder. Do not directly modify any of the other files
under `Atom.docset`, they will be overwritten by the script.

```bash
$ git clone https://github.com/bkbooth/dash-atom-docs.git
$ cd dash-atom-docs
$ yarn
$ yarn build
```

This will scrape the [Atom.io API][4] docs into a local folder, copy and transform all of the HTML files, then parse the HTML files to get a list of classes, methods, events and properties to populate the docset database.

The scraper will attempt to download the version of the API docs specified by `atom_version` in _package.json_.

Prepare the docset for [Dash][1] by archiving after generating with this command: 

```bash
$ tar --exclude='.DS_Store' -cvzf Atom.tgz Atom.docset
```


## Prequisites

* [Node.js][5] >= v6.0.0
* [httrack][4]
* [Yarn][6] (preferred, can use `npm`)



[1]: https://kapeli.com/dash
[2]: https://atom.io/
[3]: https://atom.io/docs/api
[4]: https://www.httrack.com/
[5]: https://nodejs.org/
[6]: https://yarnpkg.com/
