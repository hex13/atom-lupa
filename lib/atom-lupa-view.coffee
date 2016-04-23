React = require('react')
ReactDom = require('react-dom')
div = React.createFactory('div')
FileName = require('./components/FileName')
Metadata = require('lupa').Metadata
getMetadata = Metadata.getMetadata
{createTextEditor} = require('./editor')
ProjectExplorer = require('./components/ProjectExplorer')
getEntitiesByType = require('./getEntitiesByType')
getLines = (f) ->
    item = getMetadata(f).filter((item) -> item.name == 'lines')[0] || {}
    item.data || 0



module.exports =
class AtomLupaView
  constructor: (serializedState) ->
    # Create root element
    @element = document.createElement('div')
    @element.classList.add('atom-lupa')
    @element.style.overflow = 'scroll'

    @list = document.createElement('div')
    @list.style.height = '40%'
    @list.style.padding = '8px'
    @list.style.border = '1px solid grey'
    @list.style.overflow = 'scroll'
    @element.appendChild(@list)

    @preview = createTextEditor('', 0)
    grammar = atom.grammars.grammarForScopeName('source.js')
    @preview.setGrammar(grammar)
    @preview.element.style.position = 'static'
    @preview.element.style.height = '60%'
    @preview.element.style.width = '100%'
    @element.appendChild(@preview.element)


  getTitle: ->
      '🔍Lupa'
  setContent: (content)->
    @message.innerHTML = content

  setFiles: (files, addLabelDecoration)->
    console.log("AAAD", files.length, addLabelDecoration)
    onChange = (line) ->
        addLabelDecoration(preview, line + 1, 0, line + 2, 0, [], 'label-decoration')
    preview = @preview
    console.log("DBG T", preview)




    totalLoc = files.reduce (res, f) ->
        res + ~~getLines(f)
    ,0

    ReactDom.render(React.createElement(ProjectExplorer,
        {files: files, preview: preview, onChange: onChange},[
            div({}, '---')
        ]), @list)

    #@message.innerHTML = "File count: #{files.length}<br> Total Lines: #{totalLoc} <br> #{filesHtml}"



  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element
