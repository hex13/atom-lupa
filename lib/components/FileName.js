"use strict";

const Metadata = require('lupa').Metadata;
const getMetadata = Metadata.getMetadata;

const getLines = (f) => {
    const item = getMetadata(f).filter((item) => item.name == 'lines')[0] || {}
    return item.data || 0;
}


const React = require('react');
const div = React.createFactory('div');
const span = React.createFactory('span');
const LineCount = require('./LineCount');


class FileName extends React.Component {
    render() {
        const f = this.props.file;
        const onClick = () => {
            // if !fs.existsSync(path)
            //     path = getFileForRequire(allFiles, path).path
            console.log("LIIINE INITIAL", f, this.props.line);
            atom.workspace.open(f.path, {initialLine: this.props.line || 0});
        };
        return div({className: 'lupa-file', onClick: onClick}, [
            this.props.desc? this.props.desc : f.path,
            ': ',
            React.createElement(LineCount, {lines: getLines(f)})
        ])
    }
}

module.exports = FileName;
