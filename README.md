# dash-atom-docs

Generate docset for Kapeli's [Dash][1] Mac app from the [Atom.io][2] API docs

### Usage

API docs are scraped from [atom.io/docs/api][3] using [httrack][4] and then moved to the
`Atom.docset/Contents/Resources/Documents` folder. Do not directly modify any of the other files
under `Atom.docset`, they will be overwritten by the script.

```bash
$ npm install
$ node index
```

This will move the icon and Info.plist files into place and populate the sqlite3 database.

### Using httrack

I would like this to be automated, but for now use a command like this to scrape the API docs.

```bash
$ httrack https://atom.io/docs/api/ -O ~/Projects/atom-docs +https://atom.io/docs/api/* -v
```

To re-scrape, just run `httrack` inside `~/Projects/atom-docs` (or wherever you scraped to).

[1]: http://kapeli.com/dash
[2]: https://atom.io/
[3]: https://atom.io/docs/api
[4]: http://www.httrack.com/
