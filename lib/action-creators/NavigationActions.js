var RememberPosition = require('../atom-bindings/middleware').RememberPosition;

module.exports = function NavigationActions() {
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
            return this.GoTo(el, true);
        },
        GoTo(el, preview, extra) {
            return dispatch => {
                clearTimeout(timeout);
                if (!preview || !last) {
                    last = RememberPosition();
                }
                dispatch(Object.assign({
                    type: 'goTo',
                    entityElement: el,
                    preview: preview
                }, extra || {}));
            }
        },
        // TODO remove code duplication
        SetEntityPreview(entity) {
            return this.GoToEntity(entity, true);
        },
        // TODO remove code duplication
        GoToEntity(entity, preview, extra) {
            return dispatch => {
                clearTimeout(timeout);
                if (!preview || !last) {
                    last = RememberPosition();
                }
                dispatch(Object.assign({
                    type: 'goTo',
                    loc: entity.loc,
                    preview: preview
                }, extra || {}));
            }
        },
        RemovePreview(force) {
            return dispatch => {
                clearTimeout(timeout);
                if (force) {
                    restore(dispatch);
                } else {
                    timeout = setTimeout(restore.bind(null, dispatch), 250)
                }
            }
        }
    };
};
