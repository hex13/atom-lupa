# Lupa 🔍

- List of functions, classes, objects etc. on a sidebar 
- Full indexing of JS project
- Global searching: just prefix your search with 2 dots: ..foo)
- Semantic code search
- JavaScript/ES6 support

![atom screenshot](https://raw.githubusercontent.com/hex13/atom-lupa/master/screenshot-0-5-0.jpg)

Note:
--------

To allow full project indexing you have to create `lupaProject.json` in root directory of your project. Example file:
```
{
    "filePattern": "src/**/*.js"
}
```


This package shows structure of each JavaScript file, with clickable list of functions, imports etc. It allows you to navigate also between different files in project, shows what modules in project import particular file.

##### It allows you to filter entries by name or type, e.g.:

![atom screenshot](https://raw.githubusercontent.com/hex13/atom-lupa/master/screenshot-3.png)

##### You can also perform deep searching, e.g. you can find all functions that have their first parameter named `err`.

examples of semantic search (DSL can change in future versions).

type:objectLiteral

(space has meaning so this isn't gonna work:

type :   objectLiteral #doesn't gonna work

Example below finds functions which have foo in name:

type:function foo

type:class

type:todo

params.length:2

params[0].name:err

jsx:true

loc.start.column:7

loc.start.line:3

Example below finds external imports (i.e. these from node_modules):

source:node_modules

##### It has support for:

* ES5 (just plain old JavaScript)
* ES6 (e.g. it detects imports/exports, ES6 classes and arrow functions)
* JSX (so it can be helpful during development with React)
* CommonJS (it detects `require(...)`s )
* AngularJS (eg. it detects AngularJS directives)
* Python (basic support)
* CoffeeScript (basic support)

##### Breadcrumbs:

![atom screenshot](https://raw.githubusercontent.com/hex13/atom-lupa/master/screenshot-breadcrumbs.png)
Sidepanel:
![atom screenshot](https://raw.githubusercontent.com/hex13/atom-lupa/master/screenshot-1.jpg)
Project explorer:
![atom screenshot](https://raw.githubusercontent.com/hex13/atom-lupa/master/screenshot-2.png)

# CHANGELOG
# 2016-06-25
* go to class methods
* detect variables
* fix bug which ocurred during CSS editing

# 2016-06-23
* show names of parent functions for callbacks
* toggle visibility for entity types

# 2016-06-22
* detect function names in namespaces (eg. foo.bar.functionName = function () {}) 

# 2016-06-04
* highlighting import/require declaration
* clicking variable name from import now jumps to declaration; going to imported file is still possible by clicking on file name

# 2016-06-02
* `toggle` command now shows/hides sidepanel. Previous `toggle` command was renamed to `focus`

# 2016-05-29
* (for contributors) search box in styleguide

# 2016-05-26
* line count for all files
* basic Python support

# 2016-05-22
* restore selections after preview
* alt+click now selects entity

# 2016-05-17
* rewriting big parts of package
* panel is now resizable
* More integration with Atom color theme
* Better keyboard navigation
* ProjectExplorer is out (for now. It probably returns improved)
* Better preview (fixing scrolling issues)
* Global search (by two dots on the beginning e.g. ..something
* Other improvements

# 2016-05-06
* Keyboard support
* Complex searches (like type:function jsx:true render)

# 2016-05-04
* show type only before first entity of that type
* autohiding refresh button when autorefresh is enabled

# 2016-05-03
* better AngularJS support (jumping to definition/location information)

# 2016-05-02
* deep search (e.g. params[0].name )

# 2016-05-01
* support for object literals
* support for CSS class names in JSX

# 2016-04-30
* settings: autoRefresh(on/off)
* filter by type (e.g. type:function)
* breadcrumbs (you must enable it in settings)

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


LICENSES:
- Atom-Lupa: MIT

- The AngularJS logo design is licensed under a "[Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/)"
