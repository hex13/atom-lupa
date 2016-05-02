"use babel";

import React from 'react';
import * as Path from 'path';
import LineCount from './LineCount';

const defaultLoc = {
    start: {line:0, column:0},
    end: {line:0, column:0},
};

export class Entity extends React.Component {
    render() {
        const props = this.props;
        const entity = props.entity;
        const type = entity.type;
        const C = components.hasOwnProperty(type)? components[type] : EntityName;

        return <span
                onMouseOver={this.props.onMouseOver}
                onMouseOut={this.props.onMouseOut}
            >
                <C {...props} onMouseOver={null}/>
        </span>;
    }
}

export function CssClass({entity}) {
    return <span >
        .<EntityName entity={entity} style={{color: '#5a4'}} />
    </span>
}


class Class extends React.Component {
    render() {
        const entity = this.props.entity;
        const icons = <span style={{color: '#a74'}} className='icon icon-puzzle'></span>;
        return <span>
            <EntityName entity={entity} icons={icons}/>
            {
                !this.props.short &&
                <ul>
                {
                    entity.functions.map(meth => <li><Function entity={meth} /></li>)
                }
                </ul>
            }
        </span>;
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
    cssClass: CssClass,
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
    objectLiteral: ObjectLiteral,
    jsxCustomElement: JsxCustomElement,
};

function JsxCustomElement({entity}) {
    return <EntityName
        style={{color: '#61dafb'}}
        entity={entity}
        name={'<' + entity.name + ' />'} />;

}

function trimArray(arr) {
    if (arr.length > 4) {
        return arr.slice(0, 3).concat('...');
    }
    return arr;
}

function ObjectLiteral({entity}) {
    let props = trimArray(Object.keys(entity.props));
    const displayName = [
        //<span className="lupa-badge lupa-badge-object" title="object">{'{..}'}</span>,
        //<span style={{opacity: 0.6, color: '#a74'}} className='icon icon-puzzle'></span>,
        '🍏',
        entity.name || '[object]',
        <span style={{color:"#666"}}> ({props.join(', ')})</span>
    ];
    return <span>
        <EntityName
            entity={entity}
            name={displayName}
        />
    </span>
}

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

function Function({entity, short}) {
    let icons = [];
    let lineCount = '?';
    if (entity.loc) {
        lineCount = entity.loc.end.line - entity.loc.start.line + 1;
    }
    let locStyle = {};
    let isLong = true;
    if (lineCount >= 100) {
        locStyle = {color: '#a60'}
    } else if (lineCount >= 50) {
        locStyle = {color: '#a93'}
    } else if (lineCount >= 25) {
        locStyle = {};
    } else
        isLong = false;
    locStyle.paddingTop = 8;
    locStyle.display = 'inline-block';

    if (entity.isMethod) {
        icons.push(<span className="lupa-badge lupa-badge-method" title="method">M</span>)
    }

    if (entity.jsx) {
        //icons += ' <JSX />';
        icons.push(<span style={{color: '#61dafb'}}>{'<JSX />'}</span>);
    }

    const params = trimArray(entity.params).map(p => p.name || p).join(', ');
    // const name = <span>
    //     {entity.name}(<span style={{color: '#bb8'}}>{params}</span>)
    // </span>
    const name = ['λ ', entity.name, '(' , <span style={{color:'#996'}}>{params}</span> , ')'];
    return <span>
        {
            !short && isLong &&
                <span style={locStyle} className='icon icon-alert'>{lineCount} lines</span>
        }
        <EntityName entity={entity} name={name} icons={icons}/>
    </span>
}


function Log({entity}) {
    return <div>{JSON.stringify(entity)}</div>;
}

function Preview({entity}) {
    if (entity.html)
        return <div dangerouslySetInnerHTML={{__html: entity.html}}></div>
    return entity.preview;
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
        style={{display: 'inline-block',
            textShadow: '1px 1px 2px black',
            color: '#eee',
            padding: 4, margin: 4, 'borderRadius': 4}}>
        {entity.data} </span>;


}

export function EntityName({name, entity, icons, style}) {
    const loc = entity.loc || defaultLoc;
    const finalName = name || entity.name || entity.data || '(no name)';
        return <span className="lupa-entity-name">
            {icons? <span>{icons} </span> : ''}
            <span
                style={style}
                data-column={loc.start.column}
                data-column-end={loc.end.column}
                data-line-end={loc.end.line}
                data-line={loc.start.line}
            >{finalName}</span></span>
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
    renderEntity(entity) {
            const onClick = this.props.onClickEntity;
            console.log("KLIK", onClick)
            return <div className="lupa-entity" onClick={onClick && onClick.bind(null, entity)}>
                <h3 className="lupa-entity-type">{entity.type}</h3>
             <Entity entity={entity}/>
        </div>;

    }
    render() {
        const arrays = split(item => item.type == 'label', this.props.metadata);
        const labels = arrays[0];
        function filterByPhrase(item) {
            const phrase = this.state.phrase;
            if (!phrase) {
                // no filter phrase, so show everything
                return true;
            }
            //const indexOfColon =
            const indexOfColon = phrase.indexOf(':');
            if (indexOfColon != -1) {
                const propName = phrase.substr(0, indexOfColon);
                const propValue = phrase.substr(indexOfColon + 1).toLowerCase();
                const finalPropName = propName == 't'? 'type': propName;
                return item.hasOwnProperty(finalPropName)?
                    (item[finalPropName] + '').toLowerCase().indexOf(propValue) != -1
                    : false;
            }
            if (item.name) {
                const nameToCompare = item.name.toLowerCase();
                const phraseToCompare = this.state.phrase.toLowerCase();
                return nameToCompare.indexOf(phraseToCompare) != -1;
            }
            return false;
        }
        const metadata = arrays[1]
            .filter(item => ignored.indexOf(item.type) == -1)
            .filter(filterByPhrase.bind(this));

        const prop = {whatever: () => <span>KURWEKI</span>}
        return <div>
            <div style={{width: 300}}>
            {
                labels.map(label => <Label entity={label} />)
            }
            </div>

            <div className="native-key-bindings">
                <input
                    type="text"
                    style={{
                        color: 'black',
                        border: '1px solid grey',
                        margin: '4px',
                        width: '100%',
                    }}
                    placeholder="filter (e.g. foo, or type:function)"
                    value={this.state.phrase}
                    onChange={e => this.setState({phrase: e.target.value})}
                />
            </div>
            {
                metadata.map(this.renderEntity.bind(this))
            }
        </div>;
    }
}
