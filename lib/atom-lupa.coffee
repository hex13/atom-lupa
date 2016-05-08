{CompositeDisposable, Range} = require 'atom'

module.exports = AtomLupa =
  atomLupaView: null
  modalPanel: null
  subscriptions: null
  config:
      autoRefresh:
          type: 'boolean'
          default: true
      shouldShowBreadcrumbs:
          type: 'boolean'
          default: 'true'
          description: '(Restart of Atom is required after changing)'

  activate: (state) ->



    # @subscriptions = new CompositeDisposable
    #
    # # Register command that toggles this view
    # @subscriptions.add atom.commands.add 'atom-workspace', 'atom-lupa:toggle': => @toggle()
    # sel = '.lupa-structure .lupa-entity'
    # @subscriptions.add atom.commands.add sel, 'atom-lupa:lupa-structure-enter': => @enter()

    # editor = atom.workspace.getActiveTextEditor()
    #
    #
    # plugin = require './init.coffee'
    #
    # activePane = atom.workspace.paneContainer.activePane
    # @atomLupaView = new AtomLupaView()
    # activePane.addItem(@atomLupaView)


  deactivate: ->
    # @modalPanel.destroy()
    # @subscriptions.dispose()
    # @atomLupaView.destroy()
