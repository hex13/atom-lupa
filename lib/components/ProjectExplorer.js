"use babel";

const React = require('react');
const FileName = require('./FileName');
import {Entity, Structure} from './Structure';

const Metadata = require('lupa').Metadata
const getMetadata = Metadata.getMetadata

const getEntitiesByType = require('../getEntitiesByType');

const getLines = (f) => {
    const item = getMetadata(f).filter((item) => item.name == 'lines')[0] || {}
    return item.data || 0
};

function getEntityTypes(files) {
    var types = {};
    files.forEach(f => {
        const metadata = getMetadata(f);
        metadata.forEach(item => types[item.type || item.name] = true);
    });
    return Object.keys(types);
}



class ProjectExplorer extends React.Component {
    constructor() {
        super();
        this.state = {
            section: 'files',
            entityType: '@mixin'
        }
    }
    handleClickSection(e) {
        const newSection = e.target.getAttribute('data-item');
        const newEntityType = e.target.getAttribute('data-entity-name');
        this.setState({
            section: newSection,
            entityType: newEntityType
        });
    }
    render() {

        const entityTypes = getEntityTypes(this.props.files);
        console.log('entityTypes', entityTypes);

        const entities0 = this.props.files.reduce(
             (res, f) => res.concat(getEntitiesByType(f, this.state.entityType))
        , []);

        // TODO remove `entities`
        const entities = entities0.map( (entity) => {
            // TODO change lupa to not assign loc to entity.source
            const loc = entity.loc || (entity.source && entity.source.start? entity.source : null);
            const line = loc && loc.start && (loc.start.line - 1);
            return React.createElement(FileName, {desc: <Entity entity={entity} />, file: entity.file,
                line, preview: this.props.preview, onChange: this.props.onChange})
        })

        const fileElements = this.props.files.sort( (a, b) =>
            getLines(b) - getLines(a)
        )
        .map( (f) => (
            React.createElement(FileName, {file: f, preview: this.props.preview, onChange: this.props.onChange}))
        );

        var section = ({
            files: fileElements,
            entities: <Structure metadata={entities0} onClickEntity={(entity) => {
                    // TODO this is copy pasted
                    // if !fs.existsSync(path)
                    //     path = getFileForRequire(allFiles, path).path
                    const preview = this.props.preview;
                    preview && preview.getBuffer().setPath(entity.file.path)
                    preview && preview.setText(entity.file.contents + '');
                    const line = (entity.loc.start.line || 1) - 1;
                    this.props.onChange && this.props.onChange(line);
                    preview && preview.scrollToBufferPosition([line, 0]);
                    atom.workspace.open(entity.file.path, {initialLine: line});
            }}/>
        })[this.state.section] || 'section ' + this.state.section + ' not found.';

        return <div style={{height:'100%', overflow: 'hidden'}}>
            <h3>Project Explorer - <span style={{color: 'red'}}>BETA!</span></h3>
            <div style={{display: 'flex', height: '100%'}}>
                <div style={{flexBasis: '30%'}} className='inline-block btn-group' onClick={this.handleClickSection.bind(this)}>
                    <button data-item="files" className='btn'>Files</button>
                    <button data-entity-name="@mixin" data-item="entities" className='btn'>Mixins</button>
                    <button data-entity-name="modules" data-item="entities" className='btn'>Modules</button>
                    {
                        entityTypes.map(
                            type => <button data-entity-name={type} data-item="entities" className='btn'>{type}</button>
                        )
                    }
                    <input type="text" value={this.state.entityType} onChange={ e => this.setState({entityType: e.target.value}) }/>
                </div>
                <div style={{flexBasis: '70%', overflow: 'scroll'}}>
                    { section }
                </div>
            </div>
        </div>;
    }
}
module.exports = ProjectExplorer;
