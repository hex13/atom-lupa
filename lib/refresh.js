"use babel";
import React from 'react';
import ReactDOM from 'react-dom';
import {Structure} from './components/Structure';
const Path = require('path');

const getHtmlPreview = require('./preview').getHtmlPreview
const getCssPreview = require('./preview').getCssPreview
const lupa = require('lupa');
const getMetadata = lupa.Metadata.getMetadata;

//}(analysis, f, callback) {
export class RefreshStructure extends React.Component {
    render() {
        console.log("r1 ____")
        let {analysis, f, callback} = this.props;
        const ext = Path.extname(f.path);
        const metadata = f.metadata;
        let finalMetadata;
        let preview;
        if (ext == '.html') {
            preview = getHtmlPreview(f)
            finalMetadata = metadata.concat({type: 'preview', preview: preview})
        }
        else if (ext == '.scss' || ext == '.css') {
            preview = getCssPreview(f)
            finalMetadata = metadata.concat({type: 'preview', html: preview})
        } else
            finalMetadata = metadata;
            console.log("r2 ____" , finalMetadata)
        return <Structure metadata={finalMetadata} />;

        callback(finalMetadata);
    }
}
