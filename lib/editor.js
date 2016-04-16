var Point = require('atom').Point;
console.log("PPPP", atom.packages);

exports.createTextEditor = function (path, line) {
    line = line || 0;
    buff = atom.project.bufferForPathSync(path)
    ed = atom.workspace.buildTextEditor({buffer: buff})

    setTimeout(function () {
        var pos = ed.screenPositionForBufferPosition([line, 0]);
        // var pos1 = ed.screenPositionForBufferPosition([line + 4, 0]);
        ed.scrollToBufferPosition([line + 16, 0], {center: false});
        //ed.scrollToScreenRange([[line, 0], [line+4, 0]]);

    }, 50);


    //atom.textEditors.add(ed)
    ed.element.autoHeight = false;
    classList = ed.element.classList;
    classList.add('lupa-editor');

    return ed;
}
