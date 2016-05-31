"use babel";
import React from 'react';
import ReactDOM from 'react-dom';
import {Structure} from './Structure';
const Path = require('path');

const lupa = require('lupa');
const analysis = lupa.analysis;
const File = require('vinyl');
const getMetadata = lupa.Metadata.getMetadata;
import {StatusBar} from './StatusBar';
const d = document;
const _ = require('lodash');
var RememberPosition = require('../atom-bindings/middleware').RememberPosition;
// TODO move resize logic to separate component/module
const pos = (e, prev) => {
    const curr = [e.clientX, e.clientY];
    if (!prev) return curr;
    return [curr[0] - prev[0], curr[1] - prev[1]];
}
const resizeHandleStyle = {
    position: 'absolute',
    width: '8px',
    right:'-5px',
    top: 0,
    bottom: 0,
    cursor: 'col-resize'
};
//---

function NavigationActions() {
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
}

const navigationActions = NavigationActions();
window.lupaNavigationActions = navigationActions;

function getEntityFromElement(entities, el) {

    const name = el.getAttribute('data-lupa-entity-name');
    const type = el.getAttribute('data-lupa-entity-type');
    const id = el.getAttribute('data-lupa-entity-id');
    const loc = {start:{}, end:{}};
    loc.start.line = ~~el.getAttribute('data-line');
    loc.start.column = ~~el.getAttribute('data-column');
    console.log("GET ENTITY", name, type, loc);
    return entities.find(ent => {
        return ent.id == id;
        return (
            ent.name == name &&
            ent.type == type &&
            _.get(ent, 'loc.start.line') == loc.start.line &&
            _.get(ent, 'loc.start.column') == loc.start.column
        );
    })
}

export class Lupa extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {
                metadata: []
            },
            w: 220,
            redButton: 0
        }
        this.handleDrag = this.handleDrag.bind(this);
    }
    componentDidMount() {
        // TODO move this from here
        const dispatch = this.props.dispatch;
        setInterval(() => {
            const pos = window.lupaStore.getState().activePosition;
            const metadata = this.props.metadata;
            if (pos) {
                const entitiesAtPos = metadata.filter((item) => (
                    item.loc &&
                    item.loc.start.line <= (pos.row + 1) &&
                    item.loc.end.line >= (pos.row + 1)
                ));

                const entities = entitiesAtPos;
                const el = <StatusBar
                    onMouseLeave={
                        () => dispatch(navigationActions.RemovePreview(true))
                    }
                    onMouseOut={
                        () => dispatch(navigationActions.RemovePreview())
                    }
                    onMouseOver={
                        (entity) => {
                            dispatch(navigationActions.SetEntityPreview(entity));
                        }
                    }
                    onClick={(entity, e)=> {
                        // TODO this doesn't work because of mouseOver and mouseLeave events
                        //dispatch(navigationActions.GoToEntity(entity, false, {select: e.altKey}));
                    }}
                    entities={entities}/>;
                ReactDOM.render(el, this.props.breadcrumbsElement);
            }
        }, 300)
    }
    componentWillReceiveProps(nextProps) {
        console.log('compo will', nextProps)
    }
    // TODO move resize logic to separate module/component
    handleMouseDown(e) {
        this.start = pos(e);
        this.w0 = this.state.w;
        d.addEventListener('mousemove', this.handleDrag)
        d.addEventListener('mouseup', this.handleMouseUp.bind(this))
    }
    handleMouseUp(e) {
        d.removeEventListener('mousemove', this.handleDrag)
    }
    handleDrag(e) {
        const delta = pos(e, this.start);
        this.setState({w: Math.max(delta[0] + this.w0, 10) })
    }
    //----
    handleStructureFocus(e) {
        const el = e.target;//.closest('.lupa-entity');

        if (el.classList.contains('lupa-entity')) {
                this.props.dispatch(navigationActions.SetPreview(el));

                const entity = getEntityFromElement(this.props.metadata, el);
                // if (entity) {
                this.props.dispatch({
                    type: 'setActiveEntity',
                    entity: entity
                })
                // }
                console.log("ENT FOC", el.getAttribute('data-lupa-entity-name'));
        }
    }
    handleStructureMouseLeave(e) {
        this.props.dispatch(navigationActions.RemovePreview(true));
    }
    // TODO https://jsfiddle.net/6s7tufL5/2/
    handleStructureMouseOut(e) {
        this.props.dispatch(navigationActions.RemovePreview());
    }

    handleStructureMouseOver(e) {
        const el = e.target.closest('.lupa-entity');
        if (el) {
            this.props.dispatch(navigationActions.SetPreview(el));
        }
    }

    handleStructureBlur(e) {
        this.props.dispatch(navigationActions.RemovePreview(true));
    }

    handleStructureClick(e) {
        const el = e.target.closest('.lupa-entity');
        if (el) {
            this.props.dispatch(navigationActions.GoTo(el, false, {select: e.altKey}));
        }
    }

    render() {
        // TODO move resize logic to separate module/component
        return <div style={{position: 'relative', width: this.state.w}}>
            <div
                onMouseDown={this.handleMouseDown.bind(this)}
                style={resizeHandleStyle}>
            </div>
            <button
             style={{background: '#b00',
                maxHeight: !this.props.indexed? '1000px': '0',
                boxShadow: !this.props.indexed? '0 0 3px yellow' : 'none',
                transition: '0.7s all',
                width: '60%',
                margin: '10px',
                border: 'none',
                overflow: 'hidden',
                lineHeight: 1,
                padding: !this.props.indexed? '12px 6px': 0,
                textTransform: 'none',
                textAlign: 'center',
                color: 'yellow', borderRadius: 10}}
              onClick={()=> {
                  if (this.state.redButton) {

                  } else {
                      this.props.dispatch({
                          type: 'indexProject'
                      })
                  }
                  //if (this.props.indexed)
                    this.setState({redButton: this.state.redButton + 1});
              }}
             className="btn cta">
             {this.state.redButton? <span>🚀 indexing... 🚀{/*Please do not press<br/> this button again.*/}</span> : 'Index project'}
             </button>
            <Structure
                onClick={this.handleStructureClick.bind(this)}
                onFocus={this.handleStructureFocus.bind(this)}
                onBlur={this.handleStructureBlur.bind(this)}
                onMouseOver={this.handleStructureMouseOver.bind(this)}
                onMouseOut={this.handleStructureMouseOut.bind(this)}
                onMouseLeave={this.handleStructureMouseLeave.bind(this)}
                metadata={this.props.metadata}
                allMetadata={this.props.allMetadata}
                showInfo={this.state.redButton < 2}
                />

        </div>
    }
}
