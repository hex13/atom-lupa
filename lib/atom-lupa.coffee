AtomLupaView = require './atom-lupa-view'
{CompositeDisposable, Range} = require 'atom'

console.log("lupa module")
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



    #@atomLupaView.setContent '<h1>kotek</h1> na plotek i mruga!'


    # @modalPanel = atom.workspace.addModalPanel(item: @atomLupaView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-lupa:toggle': => @toggle()
    sel = '.lupa-structure .lupa-entity'
    @subscriptions.add atom.commands.add sel, 'atom-lupa:lupa-structure-enter': => @enter()

    editor = atom.workspace.getActiveTextEditor()


    plugin = require './init.coffee'

    activePane = atom.workspace.paneContainer.activePane
    @atomLupaView = new AtomLupaView()
    activePane.addItem(@atomLupaView)
    plugin(@atomLupaView)



  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @atomLupaView.destroy()

  serialize: ->
    #atomLupaViewState: @atomLupaView.serialize()

  enter: (e)->
      entity = window.lupaActiveEntity
      loc = entity.loc
      if loc
          pos = [loc.start.line - 1, loc.start.column]
          if entity.file && entity.file.path
              window.lupaEmit('goToFile', [entity.file.path, loc.start.line])
          else
              window.lupaGoToPos(pos)
      else if entity.source
          window.lupaEmit('goToFile', [entity.source])


  toggle: ->
    console.log 'AtomLupa was toggled!'
    structure = document.getElementById('lupa-structure')
    if structure
        search = structure.querySelector('.lupa-search')
        if search
            search.focus()

    # if @modalPanel.isVisible()
    #   @modalPanel.hide()
    # else
    #   @modalPanel.show()
  provide: ->
    #require './autocomplete'
