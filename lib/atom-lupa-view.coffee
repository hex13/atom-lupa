Metadata = require('lupa').Metadata
getMetadata = Metadata.getMetadata

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
    filesHtml = files.sort (a, b) ->
        getLines(b) - getLines(a)
    .map (f) ->
        "#{f.path}: #{getLines(f)}"
    .join('<br>')

    totalLoc = files.reduce (res, f) ->
        res + ~~getLines(f)
    ,0

    @message.innerHTML = "File count: #{files.length}<br> Total Lines: #{totalLoc} <br> #{filesHtml}"


  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @element.remove()

  getElement: ->
    @element
