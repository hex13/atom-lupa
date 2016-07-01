module.exports = function NavigationActions(dispatch, editorWrapper) {
    var last;
    var timeout;
    function restore(dispatch) {
        if (!last || last.type == 'error')
            return;
        const lc = {line: last.pos[0] + 1, column: last.pos[1]};
        dispatch({
            type: 'goTo',
            loc: {
                start: lc,
                end: lc,
            },
            scrollPos: last.scrollPos,
            selections: last.selections,
            restore: true,
        });
        last = null;
    }
    return {
        SetPreview(el) {
            this.GoTo(el, true);
        },
        GoTo(to, preview, extra) {
            clearTimeout(timeout);
            if (!preview || !last) {
                last = editorWrapper.RememberPosition();
            }
            dispatch(Object.assign({
                type: 'goTo',
                to: to,
                preview: preview
            }, extra || {}));
        },
        RemovePreview(force) {
            clearTimeout(timeout);
            if (force) {
                restore(dispatch);
            } else {
                timeout = setTimeout(restore.bind(null, dispatch), 250)
            }
        }
    };
};
