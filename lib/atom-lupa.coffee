AtomLupaView = require './atom-lupa-view'
{CompositeDisposable} = require 'atom'
console.log("lupa module")
module.exports = AtomLupa =
  atomLupaView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    console.log("lupa activate")
    plugin = require './init.coffee'
    @atomLupaView = new AtomLupaView(state.atomLupaViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @atomLupaView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-lupa:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @atomLupaView.destroy()

  serialize: ->
    atomLupaViewState: @atomLupaView.serialize()

  toggle: ->
    console.log 'AtomLupa was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
