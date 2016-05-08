"use strict";

var Point = require('atom').Point;

exports.createTextEditor = function (path, line) {
    line = line || 0;
    var buff = atom.project.bufferForPathSync(path)
    var ed = atom.workspace.buildTextEditor({buffer: buff})

    setTimeout(function () {
        var pos = ed.screenPositionForBufferPosition([line, 0]);
        // var pos1 = ed.screenPositionForBufferPosition([line + 4, 0]);
        ed.scrollToBufferPosition([line + 16, 0], {center: false});
        //ed.scrollToScreenRange([[line, 0], [line+4, 0]]);

    }, 50);


    //atom.textEditors.add(ed)
    ed.element.autoHeight = false;
    var classList = ed.element.classList;
    classList.add('lupa-editor');

    return ed;
}
