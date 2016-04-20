AtomLupaView = require './atom-lupa-view'
{CompositeDisposable, Range} = require 'atom'
plugin = require './init.coffee'

activePane = atom.workspace.paneContainer.activePane
@atomLupaView = new AtomLupaView()
activePane.addItem(@atomLupaView)
plugin(@atomLupaView)

console.log("lupa module")
module.exports = AtomLupa =
  atomLupaView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->

    #@atomLupaView.setContent '<h1>kotek</h1> na plotek i mruga!'


    # @modalPanel = atom.workspace.addModalPanel(item: @atomLupaView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-lupa:toggle': => @toggle()

    editor = atom.workspace.getActiveTextEditor()





  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @atomLupaView.destroy()

  serialize: ->
    atomLupaViewState: @atomLupaView.serialize()

  toggle: ->
    console.log 'AtomLupa was toggled!'

    # if @modalPanel.isVisible()
    #   @modalPanel.hide()
    # else
    #   @modalPanel.show()
  provide: ->
    require './autocomplete'
