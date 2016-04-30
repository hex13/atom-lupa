"use babel";
const Path = require('path');
import React from 'react';
import ReactDOM from 'react-dom';
import {Structure} from './components/Structure';

const getHtmlPreview = require('./preview').getHtmlPreview
const getCssPreview = require('./preview').getCssPreview
const lupa = require('lupa');
const getMetadata = lupa.Metadata.getMetadata;

export function refreshStructure(analysis, f, callback) {
    analysis
        .findImporters(f.path)
        //.merge(importersOfModule)
        .toArray()
        .subscribe( (importers) => {
            const metadata = getMetadata(f);
            let finalMetadata;
            let preview;

            const ext = Path.extname(f.path);
            if (ext == '.html') {
                preview = getHtmlPreview(f)
                finalMetadata = metadata.concat({type: 'preview', html: preview})
            }
            else if (ext == '.scss' || ext == '.css') {
                preview = getCssPreview(f)
                finalMetadata = metadata.concat({type: 'preview', html: preview})
            } else
                finalMetadata = metadata;

            finalMetadata.push({
                type: 'imported by',
                data: importers
            })

            ReactDOM.render(
                React.createElement(Structure, {metadata: finalMetadata}),
                document.getElementById('lupa-structure')
            )
            callback(finalMetadata);
        });
}
