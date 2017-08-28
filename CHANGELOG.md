## 1.0.8 (29/08/2017)

* Build Atom docset v1.19.4

## 1.0.7 (23/08/2017)

* Build Atom docset v1.19.3

## 1.0.6 (17/08/2017)

* Build Atom docset v1.19.2

## 1.0.5 (15/08/2017)

* Build Atom docset v1.19.1

## 1.0.4 (09/08/2017)

* Build Atom docset v1.19.0
* Update npm dependencies

## 1.0.3 (16/06/2017)

* Build Atom docset v1.18.0

## 1.0.2 (26/05/2017)

* Improve style overrides to better position docs within [Dash](https://kapeli.com/dash) viewer
* Build Atom docset v1.17.2

## 1.0.1 (22/05/2017)

* Build Atom docset v1.17.0

## 1.0.0 (22/05/2017)

* Completely new scraper and parsing scripts
* Scraping is now handled by scripts but still requires [httrack](https://www.httrack.com/) to be installed first. Will fail if executable not in path.
* All HTML documents transformed and copied into docset along with some basic style overrides

## 0.1.0 (07/08/2014)

* Initial version
* Requires manually scraping [atom.io/docs/api](https://atom.io/docs/api) with httrack or similar
* Reads class_list.html, method_list.html and file_list.html to build the sqlite3 database
