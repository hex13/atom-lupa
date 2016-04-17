React = require('react')
ReactDom = require('react-dom')
div = React.createFactory('div')
FileName = require('./components/FileName')
Metadata = require('lupa').Metadata
getMetadata = Metadata.getMetadata
{createTextEditor} = require('./editor')

getLines = (f) ->
    item = getMetadata(f).filter((item) -> item.name == 'lines')[0] || {}
    item.data || 0

getEntitiesByType = (f, type) ->
    item = getMetadata(f).filter((item) -> item.name == type)
        .reduce (res, item)->
            if Object.prototype.toString.call(item.data) == '[object Array]' && item.data.length > 1
                res.concat(item.data.map (entity) ->
                    {name: 'module', data: entity}
                )
            else
                res.concat(item)
        ,[]
        .map (item)->
            Object.assign({}, item, {path: f.path, file: f})




module.exports =
class AtomLupaView
  constructor: (serializedState) ->
    # Create root element
    @element = document.createElement('div')
    @element.classList.add('atom-lupa')
    @element.style.overflow = 'scroll'

    @list = document.createElement('div')
    @list.style.height = '300px'
    @list.style.padding = '8px'
    @list.style.border = '1px solid grey'
    @list.style.overflow = 'scroll'
    @element.appendChild(@list)

    @preview = createTextEditor('/Users/lukasz/sandbox/lupa/package.json', 0)
    grammar = atom.grammars.grammarForScopeName('source.js')
    @preview.setGrammar(grammar)
    @preview.element.style.position = 'static'
    @preview.element.style.height = '300px'
    @preview.element.style.width = '100%'
    @element.appendChild(@preview.element)


  getTitle: ->
      '🔍Lupa'
  setContent: (content)->
    @message.innerHTML = content

  setFiles: (files, addLabelDecoration)->
    console.log("AAAD", addLabelDecoration)
    onChange = (line) ->
        addLabelDecoration(preview, line + 1, 0, line + 2, 0, [], 'label-decoration')
    preview = @preview
    console.log("DBG T", preview)
    entities = files.reduce (res, f) ->
        res.concat(getEntitiesByType(f, '@mixin'))
    , []
    .map (entity) ->

        line = entity.source && (entity.source.start.line - 1)
        React.createElement(FileName, {desc: entity.data, file: entity.file, line, preview: preview, onChange})
        #entity.data + ', ' + entity.path



    fileElements = files.sort (a, b) ->
        getLines(b) - getLines(a)
    # .map (f) ->
    #     "#{f.path}: #{getLines(f)}"
    .map (f) ->
        React.createElement(FileName, {file: f, preview: preview, onChange})
        #div({}, [f.path, ':-)', getLines(f)])

    totalLoc = files.reduce (res, f) ->
        res + ~~getLines(f)
    ,0

    ReactDom.render(div({},[fileElements, div({}, '---'), entities]), @list)
    #@message.innerHTML = "File count: #{files.length}<br> Total Lines: #{totalLoc} <br> #{filesHtml}"



  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element
