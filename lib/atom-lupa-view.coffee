React = require('react')
ReactDom = require('react-dom')
div = React.createFactory('div')
FileName = require('./components/FileName')
Metadata = require('lupa').Metadata
getMetadata = Metadata.getMetadata

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

    # Create message element
    @message = document.createElement('div')
    @message.textContent = "The AtomLupa package is Alive! It's ALIVE!"
    @message.classList.add('message')
    @element.appendChild(@message)

  getTitle: ->
      '🔍Lupa'
  setContent: (content)->
    @message.innerHTML = content

  setFiles: (files)->
    entities = files.reduce (res, f) ->
        res.concat(getEntitiesByType(f, '@mixin'))
    , []
    .map (entity) ->

        line = entity.source && (entity.source.start.line - 1)
        React.createElement(FileName, {desc: entity.data, file: entity.file, line})
        #entity.data + ', ' + entity.path



    fileElements = files.sort (a, b) ->
        getLines(b) - getLines(a)
    # .map (f) ->
    #     "#{f.path}: #{getLines(f)}"
    .map (f) ->
        React.createElement(FileName, {file: f})
        #div({}, [f.path, ':-)', getLines(f)])

    totalLoc = files.reduce (res, f) ->
        res + ~~getLines(f)
    ,0

    ReactDom.render(div({},[fileElements, div({}, '---'), entities]), @element)
    #@message.innerHTML = "File count: #{files.length}<br> Total Lines: #{totalLoc} <br> #{filesHtml}"



  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element
