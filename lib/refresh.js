"use babel";
import React from 'react';
import ReactDOM from 'react-dom';
import {Structure} from './components/Structure';
const Path = require('path');

const getHtmlPreview = require('./preview').getHtmlPreview
const getCssPreview = require('./preview').getCssPreview
const lupa = require('lupa');
const getMetadata = lupa.Metadata.getMetadata;


export function refreshStructure(analysis, f, callback) {

    const ext = Path.extname(f.path);
    const metadata = f.metadata;
    let finalMetadata;
    if (ext == '.html') {
        const preview = getHtmlPreview(f)
        finalMetadata = metadata.concat({type: 'preview', preview: preview})
    }
    else if (ext == '.scss' || ext == '.css') {
        preview = getCssPreview(f)
        finalMetadata = metadata.concat({type: 'preview', html: preview})
    } else
        finalMetadata = metadata;

    ReactDOM.render(
        <Structure metadata={finalMetadata} />,
        document.getElementById('lupa-structure')
    )
    callback(finalMetadata);
}
