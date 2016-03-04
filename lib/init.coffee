# Your init script
#
# Atom will evaluate this file each time a new window is opened. It is run
# after packages are loaded/activated and after the previous editor state
# has been restored.
#
# An example hack to log to the console when each text editor is saved.
#
# atom.workspace.observeTextEditors (editor) ->
#   editor.onDidSave ->
#     console.log "Saved! #{editor.getPath()}"


plugin = require './plugin'
lupa = (require 'lupa').lupa

fs = require 'fs'
path_ = require 'path'


el = document.createElement('div');
el.style.overflow = 'scroll'
el.style.height = '100%'


el.innerHTML = "<div id='moje'
    style='padding: 10px; width:240px;overflow:scroll;'>sss <br> <br>
atom.workspace.addLeftPanel(item: el)


</div>"

getFileFor = (name) ->
    'not defined -' + name

atom.workspace.addLeftPanel(item: el)


update1 = ->
    editor = atom.workspace.getActivePaneItem()
    if (!editor)
        return
    if (!editor.buffer)
        return

    el = document.getElementById('moje')

    print = {
        classes: (entry) ->
            "<h3 style='color:grey'>#{entry.name}</h3>" +
                entry.data.map(
                    (cls) ->
                        "<h4>#{cls.name}</h4>" + cls.methods.join('<br>')
                ).join('<br>') +
                '<br>'
        default: (entry) ->
            if entry.data.length
                '<h3 style="color:grey">#{entry.name}</h3>' +
                    entry.data.map(
                        (n) -> "<div class='lupa-entry'>#{n} - #{getFileFor(n)}</div>"
                    ).join('<br>') +
                    '<br>'
            else
                '' #"<br><em style='color:grey'>no #{entry.name}</em>"

    }
    filename = editor.buffer.file.path

    update = (state)->
        found = state.files.filter( (f) -> f.path == filename)
        if (!found.length)
            console.log("error: !found.length")
            return

        html = '...'
        if path_.extname(found[0].path) == '.html'
            html = plugin.getHtmlPreview(found[0])
        else
            html = found[0].metadata.map (entry) ->
                render = print[entry.name] || print.default
                render(entry)
            .join('')
        el.innerHTML = html

    el.innerHTML = ''
    plugin.analyze(editor.buffer.file.path, update)

    path = editor.buffer.file.path

atom.workspace.onDidChangeActivePaneItem ->
    update1()

update1()
