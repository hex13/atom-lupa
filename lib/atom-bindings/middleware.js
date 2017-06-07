"use strict";

//----------------------------------------------
function atomSetPosition(editor, pos, scrollPos, preview) {
    const edEl = editor.editorElement;
    const presenter = edEl.component.presenter;
    let pixelPosition;
    if (!scrollPos) {
        // workaround of Atom scrolling bug
        // atom/atom#11429, atom/atom#3324
        // (normally we should use scrollToBufferPosition,
        // but it doesn't work in expected way).

        const visibleRowRange = editor.getVisibleRowRange() || [0, 0];
        const heightInLines = visibleRowRange[1] - visibleRowRange[0];
        const half = ~~(heightInLines / 2);

        pixelPosition = edEl.pixelPositionForBufferPosition([pos[0] - half, pos[1]]).top;
    } else {
        pixelPosition = edEl.pixelPositionForBufferPosition(scrollPos).top;
    }

    edEl.setScrollTop(pixelPosition);
    presenter.commitPendingScrollTopPosition();
    // TODO this condition is temporary disabled.
    // How is it better for user?
    // To set cursor on the line with entity? Maybe it would be easier to grasp visually
    //if (!preview) {
    editor.setCursorBufferPosition(pos, {autoscroll: false});
    //}

}
//------------
let lastMarker;
function removeLabelDecoration() {
    if (lastMarker) lastMarker.destroy();
    lastMarker = null;
}
function setLabelDecoration(editor, loc, list, cls) {
    if (lastMarker) lastMarker.destroy();

    var decoration, item, lastPos, marker, pos, range;
    pos = [~~loc.start.line - 1, loc.start.column];
    //range = new Range(pos, [~~loc.end.line - 1, loc.end.column]);
    range = [
        [~~loc.start.line - 1, loc.start.column],
        [~~loc.end.line - 1, loc.end.column]
    ];
    marker = editor.markBufferRange(range);
    item = document.createElement('span');
    item.style.position = 'relative';
    item.className = 'my-line-class';
    decoration = editor.decorateMarker(marker, {
        item: item,
        type: 'highlight',
        "class": cls || 'my-line-class'
    });

    lastMarker = marker;

    // if (list) {
    //     return list.push(decoration);
    // }
}

function atomMiddleware(store) {
    return (next) => (action) => {
        const state = store.getState();
        const editor = atom.workspace.getActiveTextEditor();
        if (!editor) {
            next({type: 'error', msg: 'no editor'});
            return;
        }
        const isGoTo = !action.preview && !action.restore;
        if (action.type == 'goTo') {
            const loc = action.loc;
            const pos = [loc.start.line - 1, loc.start.column];
            const endPos = [loc.end.line - 1, loc.end.column];

            const sameFile = !action.path || (action.path == editor.getPath());

            if (sameFile) {
                if (editor) {

                    atomSetPosition(editor, pos, action.scrollPos, !isGoTo);
                    if (isGoTo) {
                        editor.element.focus();
                    }
                    if (action.select) {
                        editor.addSelectionForBufferRange([pos, endPos]);
                    }
                    if (action.preview) {
                        setLabelDecoration(editor, loc);
                    }
                }
            } else if (isGoTo){
                atom.workspace.open(action.path, {
                    initialLine: pos[0],
                    initialRow: pos[1],
                })
            }

            if (action.restore) {
                removeLabelDecoration();
                editor.setSelectedBufferRanges(action.selections);
            }


        }
        next(action);
    }
}

module.exports = atomMiddleware;
