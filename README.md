# Lupa 🔍

Navigation sidebar capable to perform full indexing of JavaScript project. It shows structure of each JavaScript file, with clickable list of functions, imports etc. It allows you to navigate also between different files in project, shows what modules in project import particular file.

It also allows you to filter entries by name or type, e.g.:

![atom screenshot](https://raw.githubusercontent.com/hex13/atom-lupa/master/screenshot-3.png)

It has support for:

* ES5 (just plain old JavaScript)
* ES6 (e.g. it detects imports/exports, ES6 classes and arrow functions)
* JSX  
* CommonJS (it detects `require(...)`s ) 
* AngularJS (partially)
* CoffeeScript (partially)


![atom screenshot](https://raw.githubusercontent.com/hex13/atom-lupa/master/screenshot-1.png)
![atom screenshot](https://raw.githubusercontent.com/hex13/atom-lupa/master/screenshot-2.png)

To allow full project indexing you have to create `lupaProject.json` in root directory of your project. Example file:
```
{
    "filePattern": "src/**/*.js",
    "autolabels": [
        ["angular", "angular"],
        ["foo", "foo"],
        ["numbers", "\\d+"],
    ]
}
```

# CHANGELOG
# 2016-04-30
* settings: autoRefresh(on/off)
* filter by type (e.g. type:function)

# 2016-04-29
* now it's possible to filter symbols by name
* better class preview in sidepanel
* project explorer now uses components from sidepanel
* changeColors button for users with light backgrounds 

# 2016-04-27
* better support for functions

# 2016-04-23
* redesign, rewrite, refactor
* support for TODOs
* fix bug with line highlighting in ProjectExplorer
* fix other bugs

# 2016-04-20
* Smalltalk-like project explorer

# 2016-04-16
* support for CoffeeScript

# 2016-04-15
* highlight labels

# 2016-04-12
* basic support for css/scss

# 2016-04-10
* fix bug when there is no node_modules in directory tree
* fix bug when there is no lupaProject.json in directory tree
* line count in color (green, yellow, orange, red)
* fix bug when user clicks on pane item which is not a text editor (e.g. settings)
* use react
* better list of files in dashboard (clickable and with loc colors)
# 2016-04-09

* list of files in separate pane item (dashboard)
* highlight function range in editor

# 2016-04-08

* support for @providesModule
* jump to function
* few other improvements

# 2016-04-03

* configurable indexing (config must be in lupaProject.json file)
* "autolabel" feature (define regexps in lupaProject.json file)
* feature: files that import current file
* bug: doesn't show imports like that import {aa} from 'aabc.js' (needed something like that  {from:'abc.js', name:'ss'} instead of strings)
* rewrite plugin to use new Lupa version
* fix bug that prevented pane to scroll (remove height: 100% from pane)
* regression: analysis is not done in separate process anymore

# 2016-03-17
* fix bug when switching to empty(non saved) file

# 2016-03-16
* experimental "go to definition" feature for angular modules

# 2016-03-16

* analyze files in separate process - to avoid freezing Atom.
