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

export class Lupa extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {
                metadata: []
            },
            w: 100
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

    render() {
        // TODO move resize logic to separate module/component
        return <div style={{position: 'relative', width: this.state.w}}>
            <div
                onMouseDown={this.handleMouseDown.bind(this)}
                style={resizeHandleStyle}>
            </div>
            <Structure metadata={this.props.metadata} />

        </div>
    }
}
