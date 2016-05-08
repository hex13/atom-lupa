"use babel";
import React from 'react';
import ReactDOM from 'react-dom';
import {Structure} from './Structure';
const Path = require('path');

const lupa = require('lupa');
const analysis = lupa.analysis;
const File = require('vinyl');
const getMetadata = lupa.Metadata.getMetadata;


export class Lupa extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: {
                metadata: []
            }
        }
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        console.log('compo will', nextProps)
    }
    render() {
        console.log("lupa render");
        return <div>
            <Structure metadata={this.props.metadata} />
        </div>
    }
}
