
#plugin = require './plugin'
debug = false
shouldShowBreadcrumbs = atom.config.get('atom-lupa.shouldShowBreadcrumbs')

{Range} = require 'atom'
child_process = require('child_process')
File = require('vinyl')
lupa = require 'lupa'
Main = (require './components/main').Main

plugin = lupa.analysis;
Metadata = lupa.Metadata;
getMetadata = Metadata.getMetadata
getFileForModule = require('./getFileFor').getFileForModule
getFileForSymbol = require('./getFileFor').getFileForSymbol
getFileForRequire = require('./getFileFor').getFileForRequire
createTextEditor = require('./editor.js').createTextEditor
{Structure} = require './components/Structure'
{StatusBar} = require './components/StatusBar'
ReactDOM = require('react-dom')
React = require('react')
previewMarker = null
fs = require 'fs'
path_ = require 'path'
refreshStructure = require('./refresh').refreshStructure


el = document.createElement('div');
el.style.overflow = 'scroll'
doc = document

dashboard = null

defaultLoc = {
    start: {line:0, row:0},
    end: {line:0, row:0},
}

window.lupaGoToPos = (pos) ->
    atom.workspace.getActivePane().activate()
    editor.setCursorBufferPosition pos
    editor.scrollToBufferPosition pos, {center: true}
    wrapper = document.getElementById('lupa-editor-wrapper')
    wrapper.innerHTML = ''

window.lupaGoToFile = (path, line) ->
    if !fs.existsSync(path)
        path = getFileForRequire(allFiles, path).path
    if fs.existsSync(path)
        atom.workspace.open(path, {initialLine: if line then line - 1 else 0})
    else
        alert('Can\'t open ' + path)



module.exports = (aDashboard) ->
    dashboard = aDashboard
    update1()

el.style.paddingLeft = '8px'
ReactDOM.render(React.createElement(Main), el)
decorations = []
labelDecorations = []

addLabelDecoration = (editor, line, col, lineEnd, colEnd, list, cls) ->
    #line = line -= 2 # WTF?
    #line = line + 1
    pos = [~~line - 1, col]
    range =  new Range(pos, [~~lineEnd - 1, colEnd]) #editor.getSelectedBufferRange() #
    marker = editor.markBufferRange(range)
    item = document.createElement('span')
    item.style.position = 'relative'
    item.className = 'my-line-class'
    decoration = editor.decorateMarker(marker, {item, type: 'highlight', class: cls || 'my-line-class'})

    lastPos = editor.getCursorBufferPosition()
    editor.scrollToBufferPosition pos, {center: true}
    if list
        list.push(decoration)


el.addEventListener('mouseout',
    (e) ->
        if lastPos && editor
            editor.scrollToBufferPosition lastPos, {center: true}
        #return
        decorations.forEach (d) ->
            d.destroy()

        wrapper = document.getElementById('lupa-editor-wrapper')
        wrapper.innerHTML = ''

)



lastPos = null
previewEditor = null

handleDestroyDecorations = (e) ->
    if !editor
        return

    decorations.forEach (d) ->
        d.destroy()


handleEntityMouseOver = (entity, e) ->
        if !editor
            return
        target = e.target
        ed = null
        if target
            line = target.getAttribute('data-line') || 0
            col = ~~target.getAttribute('data-column') || 0
            colEnd = ~~target.getAttribute('data-column-end') || col
            lineEnd = target.getAttribute('data-line-end') || line
        else if entity
            line = entity.loc.start.line
            col = entity.loc.start.column
            colEnd = entity.loc.end.column
            lineEnd = entity.loc.end.line

        if line || target.getAttribute('data-path') #&& editor
            fileToPreview = target.getAttribute('data-path') || currentFile
            previewEditor = createTextEditor(fileToPreview, ~~line)
            if entity # show in main editor
                addLabelDecoration(editor, line, col, lineEnd, colEnd, decorations)
            else
                addLabelDecoration(previewEditor, line, col, lineEnd, colEnd, decorations)
                edEl = previewEditor.element
                wrapper = document.getElementById('lupa-editor-wrapper')
                wrapper.innerHTML = ''
                wrapper.appendChild(edEl)

el.addEventListener('mouseover', handleEntityMouseOver.bind(this, null))


el.addEventListener('click',
    (e) ->
        target = e.target

        if target.className.indexOf('lupa-label') != -1
            label = target.getAttribute('data-label')
            if editor && editor.buffer
                labelDecorations.forEach (d) ->
                    d.destroy()

                autolabels = plugin.getConfig().autolabels || []

                filter = (l) ->
                    l[0] == label
                pattern = ((autolabels.filter(filter)[0] || [])[1]) || label

                editor.buffer.lines.forEach (line, idx) ->
                    if line.match(new RegExp(pattern))
                        addLabelDecoration(editor, idx + 1, 0, idx + 2, 0, labelDecorations, 'label-decoration')
            plugin
                .filterFiles (f) ->
                    getMetadata(f).filter (item)->
                        item.type == 'label' && item.data == label
                    .length
                .toArray().subscribe (files) ->
                    paths = files.map (f) ->
                        "<div data-path='#{f.path}'> #{path_.basename(f.path)} </div>"
                    .join('')
                    doc.getElementById('lupa-info').innerHTML = "Files with this label '#{label}: #{paths}"
        line = target.getAttribute('data-line')
        path = e.target.getAttribute('data-path')
        if path
            console.log("lInIa", line)
            window.lupaGoToFile(path, line)
        else if line
            pos = [~~line - 1, 0]
            lastPos = pos
            window.lupaGoToPos(pos)


)


currentFile = ''

atom.workspace.addLeftPanel(item: el)

if shouldShowBreadcrumbs
    statusBar = document.createElement('div')
    statusBar.innerHTML = "<div id='lupa-statusbar'></div>"
    atom.workspace.addTopPanel(item: statusBar)


backgroundColors = ['#2b2b2c', '#21252b', 'inherit']
document.getElementById('lupa-change-colors').addEventListener 'click', () ->
    bck = backgroundColors.shift()
    backgroundColors.push(bck)
    document.getElementById('lupa-structure').style.background = bck;

document.getElementById('lupa-run').addEventListener 'click', () ->
    result = require(currentFile)
    alert(result)

document.getElementById('lupa-index-project').addEventListener('click', () ->
    alert "Click ok to start indexing (it can take a while)."
    try
        plugin.indexProject(path_.dirname(currentFile))
    catch e
        alert "Error: " + e.message
)

allFiles = []
editor = null

refresh = ->
    if !editor
        return

    if editor.metadata && shouldShowBreadcrumbs
        pos = editor.getCursorBufferPosition()
        pos.row += 1
        entitiesAtPos = editor.metadata.filter (item) ->
            item.loc &&
            item.loc.start.line <= pos.row &&
            item.loc.end.line >= pos.row
        # .map (item) ->
        #     item.name
        ReactDOM.render(React.createElement(StatusBar, {
            onMouseOver: handleEntityMouseOver,
            onMouseOut: handleDestroyDecorations,
            entities: entitiesAtPos
        }), statusBar)






    f = new File({
        path: currentFile,
        contents: new Buffer(editor.getBuffer().getText())
    })
    plugin.invalidate(f)
    plugin.process(f).subscribe(update1)

doc.getElementById('lupa-refresh').addEventListener('click', refresh)

update1 = ->
    # TODO this is copy pasted§
    if dashboard
        plugin.filterFiles((v) -> v).toArray().subscribe( (files)->
            #dashboard.setFiles(files, addLabelDecoration) # TODO remove addLabelDecoration from here. This is hack
        )

    identitity = (v) ->
        v
    plugin.filterFiles(identitity).toArray().subscribe (files) ->
        allFiles = files
    editor = atom.workspace.getActiveTextEditor()

    if (!editor)
        return
    if (!editor.buffer)
        return


    if editor.buffer.file
        filename = editor.buffer.file.path
    else
        filename = ''

    currentFile = filename;

    if !filename
        return


    update = (f)->
        refreshStructure plugin, f, (metadata) ->
            editor.metadata = metadata


    # assign to global variable
    onUpdate = update
    #plugin.on('message', update)
    if fs.existsSync(filename)
        plugin.process(new File({
            path: filename,
            contents: fs.readFileSync(filename)
        })).subscribe(update)


atom.workspace.onDidChangeActivePaneItem ->
    update1()

update1()

plugin.indexing.subscribe (files) ->
    window.lupaFiles = files
    window.lupaEntities = files.reduce (res,f) ->
        res.concat(f.metadata)
    ,[]
    if dashboard
        dashboard.setFiles(files, addLabelDecoration) # TODO remove addLabelDecoration from here. This is hack

    atom.notifications.addSuccess("#{files && files.length} files have been indexed.")
    document.getElementById('lupa-index-project-wrapper').style.display = 'none';

refreshInterval = null
updateAutoRefresh = (value) ->
    autoRefreshEl = document.getElementById('lupa-refresh')
    if value
        autoRefreshEl.style.display = 'none'
        refreshInterval = setInterval(refresh, 1800)
    else
        clearInterval(refreshInterval)
        autoRefreshEl.style.display = 'block'
        refreshInterval = null

atom.config.onDidChange 'atom-lupa.autoRefresh', ({newValue, oldValue}) ->
    updateAutoRefresh(newValue)
updateAutoRefresh(atom.config.get 'atom-lupa.autoRefresh')
