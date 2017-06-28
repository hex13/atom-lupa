"use babel";

class GoToTransformer {
    constructor(next) {
        this.next = next;
    }
    goTo(action) {
        const { next } = this;

        // used in tests
        if (action.$$$test == 'test280617') {
            return next({type: 'tested280617'});
        }

        if (action.type == 'goTo') {
            if (action.to) {
                let el;

                // Which type is `action.to` of? Duck typing detection.
                if (action.to.target) { // event
                    el = action.to.target.closest('.lupa-entity');
                } else if (action.to.getAttribute) { // dom element
                    el = action.to;
                }

                if (el) {
                    const loc = {start:{}, end:{}};
                    loc.start.line = ~~el.getAttribute('data-line');
                    loc.start.column = ~~el.getAttribute('data-column');
                    loc.end.line = ~~el.getAttribute('data-line-end');
                    loc.end.column = ~~el.getAttribute('data-column-end');

                    const path = el.getAttribute('data-path');
                    const newAction = Object.assign({}, action, {
                        type: 'goTo',
                        loc: loc,
                        path: path,
                    });
                    return next(newAction);
                }

                if (action.to.loc) {
                    return next(Object.assign({}, action, {
                      loc: action.to.loc
                    }));
                }

                return;
            }
        }
        next(action);
    }
    dispatch (action)  {
        const { next } = this;

        if (this.__proto__.hasOwnProperty(action.type)) {
            return this[action.type](action);
        }
        next(action);

    }
}


export default function domMiddleware() {
    return (next) => {
        const controller = new GoToTransformer(next);
        return action => controller.dispatch(action);
    }
}
