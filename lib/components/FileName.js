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
        const preview = this.props.preview;
        const onClick = () => {
            // if !fs.existsSync(path)
            //     path = getFileForRequire(allFiles, path).path
            console.log("LIIINE INITIAL", f, this.props.line);

            console.log("aBCD", preview);
            preview.getBuffer().setPath(f.path)
            preview.setText(f.contents + '');
            this.props.onChange && this.props.onChange(this.props.line);
            preview.scrollToBufferPosition([this.props.line || 0, 0]);
            //atom.workspace.open(f.path, {initialLine: this.props.line || 0});
        };
        return div({className: 'lupa-file', onClick: onClick}, [
            this.props.desc? <span>
                {this.props.desc}
                <span style={{fontSize: 8}}>{f.path}</span>
            </span> : f.path,
            React.createElement(LineCount, {lines: getLines(f)})
        ])
    }
}

module.exports = FileName;
