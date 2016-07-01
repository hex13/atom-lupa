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
const NavigationActions = require('../action-creators/NavigationActions');

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
        this.navigationActions = NavigationActions(dispatch, this.props.editorWrapper);
        const navigationActions = this.navigationActions;

        this.statusBarEvents = {
            onMouseLeave: () => navigationActions.RemovePreview(true),
            onMouseOut: () => navigationActions.RemovePreview(),
            onMouseOver: (entity) => navigationActions.SetPreview(entity),
            onClick: (e) => navigationActions.GoTo(e, false, {select: e.altKey})
        };
        this.structureEvents = {
            onMouseLeave: () => navigationActions.RemovePreview(true),
            onMouseOut: () => navigationActions.RemovePreview(),
            onMouseOver: (e) => navigationActions.SetPreview(e),
            onClick(e) {
                navigationActions.GoTo(e, false, {select: e.altKey});
            }
        };

        window.lupaNavigationActions = navigationActions;
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
                const el = <StatusBar {...this.statusBarEvents}
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
    getStructureEvents(dispatch, metadata) {
        const navigationActions = this.navigationActions;
        return Object.assign({
            onFocus(e) {
                const el = e.target;//.closest('.lupa-entity');

                if (el.classList.contains('lupa-entity')) {
                        navigationActions.SetPreview(el);

                        const entity = getEntityFromElement(metadata, el);
                        // if (entity) {
                        dispatch({
                            type: 'setActiveEntity',
                            entity: entity
                        })
                        // }
                        console.log("ENT FOC", el.getAttribute('data-lupa-entity-name'));
                }
            },
            onBlur(e) {
                navigationActions.RemovePreview(true);
            },
        }, this.structureEvents);
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
                  if (!this.props.indexed) {
                      this.props.dispatch({
                          type: 'indexProject'
                      })
                  }
                  //if (this.props.indexed)
                  this.setState({redButton: this.state.redButton + 1});
              }}
             className="btn cta lupa-index-project">
             {this.props.indexed == 1? <span>🚀 indexing... 🚀{/*Please do not press<br/> this button again.*/}</span> : 'Index project'}
             </button>
            <Structure
                metadata={this.props.metadata}
                allMetadata={this.props.allMetadata}
                showInfo={this.state.redButton < 2}
                {...this.getStructureEvents(this.props.dispatch, this.props.metadata)}
                />

        </div>
    }
}

Lupa.propTypes = {
    editorWrapper: React.PropTypes.shape({
        RememberPosition: React.PropTypes.func.isRequired
    }).isRequired
}
