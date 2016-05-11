"use babel";
import React from 'react';
import ReactDOM from 'react-dom';
import {Structure} from './Structure';
const Path = require('path');

const lupa = require('lupa');
const analysis = lupa.analysis;
const File = require('vinyl');
const getMetadata = lupa.Metadata.getMetadata;
const d = document;
const _ = require('lodash');

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
            w: 220
        }
        this.handleDrag = this.handleDrag.bind(this);
    }
    componentDidMount() {

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
        const el = e.target;
        console.log("onFocus", e.target, el.classList);
        if (el.classList.contains('lupa-entity')) {
            const entity = getEntityFromElement(this.props.metadata, el);
            // if (entity) {
                this.props.dispatch({
                    type: 'setActiveEntity',
                    entity: entity
                })
            // }
            console.log("ENT FOC", el.getAttribute('data-lupa-entity-name'));


            this.props.dispatch({
                type: 'goTo',
                entityElement: el,
                // loc: loc,
                // path: path
            });


        }

    }
    handleStructureBlur(e) {
        console.log("onBlur", e.target);
        this.props.dispatch({
            type: 'goToLastPosition',
        });

    }
    handleStructureClick(e) {
        const el = e.target.closest('.lupa-entity');
        if (el) {
            const loc = {start:{}, end:{}};
            loc.start.line = ~~el.getAttribute('data-line');
            loc.start.column = ~~el.getAttribute('data-column');
            loc.end.line = ~~el.getAttribute('data-line-end');
            loc.end.column = ~~el.getAttribute('data-column-end');

            const path = el.getAttribute('data-path');
            this.props.dispatch({
                type: 'goTo',
                entityElement: el,
                // loc: loc,
                // path: path
            });
        }
    }

    render() {
        // TODO move resize logic to separate module/component
        return <div style={{position: 'relative', width: this.state.w}}>
            <div
                onMouseDown={this.handleMouseDown.bind(this)}
                style={resizeHandleStyle}>
            </div>
            <Structure
                onClick={this.handleStructureClick.bind(this)}
                onFocus={this.handleStructureFocus.bind(this)}
                onBlur={this.handleStructureBlur.bind(this)}
                metadata={this.props.metadata}
                />

        </div>
    }
}
