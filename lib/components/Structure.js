"use babel";

import React from 'react';
import * as Path from 'path';
import LineCount from './LineCount';

const defaultLoc = {
    start: {line:0, column:0},
    end: {line:0, column:0},
};

class Entity extends React.Component {
    render() {
        const props = this.props;
        const entity = props.entity;
        const type = entity.type;
        const C = components.hasOwnProperty(type)? components[type] : EntityName;

        return <C entity={props.entity} />;
    }
}


class Class extends React.Component {
    render() {
        const entity = this.props.entity;
        const icons = <span style={{color: '#a74'}} className='icon icon-puzzle'></span>;
        return <div>
            <EntityName entity={entity} icons={icons}/>
            {
                entity.methods.map(meth => <div>{meth}</div>)
            }
        </div>;
    }
}

function Import({entity}) {
    return <div>
        <span className='icon icon-link-external'></span>
        {entity.name} from
        <span className='lupa-file' data-path={entity.source}> {entity.originalSource}</span>
    </div>;
}

function Lines({entity}) {
    const loc = entity.data[0];
    return <LineCount lines={loc} />
}


var components = {
    'class': Class,
    'import': Import,
    'function': Function,
    lines: Lines,
    label: Ignored,
    rnd: Ignored,
    providesModule: Ignored,
    'imported by': ImportedBy,
    'preview': Preview,
    'module.exports': ModuleExports,
    todo: Todo,

    angularModule: AngularModule,
    angularModuleDependency: AngularModuleDependency,
    directives: Directives,
    controllers: Controllers,
    services: Services,
    exports: Exports,
};

function Exports({entity}) {
    return <div>
    {
        entity.data.map(item => <div>{item}</div>)
    }
    </div>;
}

function Directives({entity}) {
    const icons = <span style={{color: '#a74'}} className='icon icon-puzzle'></span>;
    return <div>
    {
        entity.data.map(
            e => <EntityName entity={{name: e}} icons={icons}/>
        )
    }
    </div>;
}

function Controllers({entity}) {
    const icons = <span className='icon icon-keyboard'></span>
    return <div>
    {
        entity.data.map(
            e => <EntityName entity={{name: e}} icons={icons}/>
        )
    }
    </div>;
}

function Services({entity}) {
    const icons = <span className='icon icon-gear'></span>
    return <div>
    {
        entity.data.map(
            e => <EntityName entity={{name: e}} icons={icons}/>
        )
    }
    </div>;
}


function AngularModuleDependency({entity}) {
    const icons = <span className='icon icon-link-external'></span>
    return <EntityName entity={entity} icons={icons} />;
}

function AngularModule({entity}) {
    const icons = <span className='icon icon-package'></span>;
    return <EntityName entity={entity} icons={icons} />;
}

function Todo({entity}) {
    const icons = <span className='icon icon-comment'></span>;
    return <EntityName entity={entity} icons={icons} />

}

function ModuleExports({entity}) {
    return <div>{entity.data.join(', ')}</div>
}

function Function({entity}) {
    let icons = '';
    let lineCount = '?';
    if (entity.loc) {
        lineCount = entity.loc.end.line - entity.loc.start.line + 1;
    }
    let locStyle;
    let isLong = true;
    if (lineCount >= 100) {
        locStyle = {color: '#a60'}
    } else if (lineCount >= 50) {
        locStyle = {color: '#a93'}
    } else if (lineCount >= 25) {
        locStyle = {};
    } else
        isLong = false;

    if (entity.jsx) {
        //icons += ' <JSX />';
        icons = <span style={{color: '#61dafb'}}>{'<JSX />'}</span>
    }
    const params = entity.params.map(p => p.name).join(', ');
    // const name = <span>
    //     {entity.name}(<span style={{color: '#bb8'}}>{params}</span>)
    // </span>
    const name = ['𝑓 ', entity.name, '(' , <span style={{color:'#996'}}>{params}</span> , ')'];
    return <div>
        {isLong && <span style={locStyle} className='icon icon-alert'>{lineCount} lines</span> }
        <EntityName entity={entity} name={name} icons={icons}/>
    </div>
}


function Log({entity}) {
    return <div>{JSON.stringify(entity)}</div>;
}

function Preview({entity}) {
    return <div dangerouslySetInnerHTML={{__html: entity.html}}></div>
}

function ImportedBy({entity}) {
    return <div>
        {
            entity.data.map(file => <div
                className='lupa-file'
                data-path={file.path}>
                    {Path.basename(file.path)}
            </div>
            )
        }
    </div>
}
function Ignored() {
    return <span></span>
}

function Label({entity}) {
    return <span
        data-label={entity.data}
        className='lupa-label'
        style={{display: 'inline-block', textShadow: '1px 1px 2px black',
                color: '#eee',
                padding: 4, margin: 4, 'borderRadius': 4}}>
     {entity.data} </span>;


}

function EntityName({name, entity, icons}) {
    const loc = entity.loc || defaultLoc;
    const finalName = name || entity.name || entity.data || '(no name)';
    return <div className="lupa-entity-name">
        {icons? <span>{icons} </span> : ''}
        <span
        data-column={loc.start.column}
        data-column-end={loc.end.column}
        data-line-end={loc.end.line}
        data-line={loc.start.line}
    >{finalName}</span></div>
}

function split(filter, arr) {
    var yes = [], no = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        const item = arr[i];
        filter(item)? yes.push(item) : no.push(item);
    }
    return [yes, no];
}
var ignored = ['rnd', 'providesModule'];
export class Structure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phrase: ''
        };
    }
    renderMetadata(item) {
        return <div className="lupa-entity">
            <h3 className="lupa-entity-type">{item.type}</h3>
            <Entity entity={item}/>
        </div>;

    }
    render() {
        const arrays = split(item => item.type == 'label', this.props.metadata);
        const labels = arrays[0];
        function filterByPhrase(item) {
            if (item.name) {
                const nameToCompare = item.name.toLowerCase();
                const phraseToCompare = this.state.phrase.toLowerCase();
                return nameToCompare.indexOf(phraseToCompare) != -1;
            }
        }
        const metadata = arrays[1]
            .filter(item => ignored.indexOf(item.type) == -1)
            .filter(filterByPhrase.bind(this));

        return <div>
            <div style={{width: 300}}>
            {
                labels.map(label => <Label entity={label} />)
            }
            </div>
            <div className="native-key-bindings">
                <input
                    type="text"
                    style={{color: 'black', border: '1px solid grey', margin: '4px'}}
                    placeholder="filter"
                    value={this.state.phrase}
                    onChange={e => this.setState({phrase: e.target.value})}
                />
            </div>
            {
                metadata.map(this.renderMetadata)
            }
        </div>;
    }
}
