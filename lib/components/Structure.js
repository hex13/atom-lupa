"use babel";

import React from 'react';
import * as Path from 'path';
import LineCount from './LineCount';
var _ = require('lodash');

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
                <C {...props} />
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
        const superClass = entity.superClass;
        return <span>
            <EntityName entity={entity} icons={icons}/>
            <em style={{color: '#666'}}> {superClass.name? '(' + superClass.name + ')' : ''}</em>
            {
                !this.props.short &&
                <ul>
                {
                    entity.functions && entity.functions.map((meth,i) => <li key={meth.name || i}><Function entity={meth} /></li>)
                }
                </ul>
            }
        </span>;
    }
}

function Import({entity}) {
    return <div className="lupa-text">
        <span className='icon icon-link-external'></span>
        {entity.name} from
        <span className='lupa-file lupa-link' data-path={entity.source}> {entity.originalSource}</span>
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
    directive: Directive,
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
        <span style={{color:"#666"}}> {'{' + props.join(', ') + '}'}</span>
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

function Directive({entity}) {
    //const icons = <span style={{color: '#a74'}} className='icon icon-puzzle'></span>;
    const icons = <img src="atom://atom-lupa/assets/angular.png" />;
    return <EntityName entity={entity} icons={icons}/>
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
    locStyle.display = 'block';

    if (entity.isMethod) {
        icons.push(<span className="lupa-badge lupa-badge-method" title="method">M</span>)
    }

    if (entity.jsx) {
        //icons += ' <JSX />';
        icons.push(<span style={{sfontSize: 'small', color: '#61dafb'}}>{'<JSX />'}</span>);
    }

    const params = trimArray(entity.params).map(p => p.name || p).join(', ');
    // const name = <span>
    //     {entity.name}(<span style={{color: '#bb8'}}>{params}</span>)
    // </span>
    const name = [
        <span className="storage type function">λ </span>,
        entity.name, '(' , <span className="variable">{params}</span> , ')'];
    return <div style={{display:'inline-block'}}>
        {
            !short && isLong &&
                <div style={locStyle} className='icon icon-alert'>{lineCount} lines</div>
        }
        <EntityName entity={entity} name={name} icons={icons}/>
    </div>
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

function getClass(entity, initialClass) {
    // TODO this is naive. `entity.type` and classes uses in Atom don't always match
    // but it works with function and class
    return ['entity', 'name', entity.type].concat(initialClass).join(' ');
}
export function EntityName({name, entity, icons, style}) {
    const finalName = name || entity.name || entity.data || '(no name)';
    //TODO
        // something like that:
        //<span className={getClassName(entity, 'name')}
        // //<span className={getClassName(entity, 'params')}
        //
        return <span className="source js">
            <span
                className={getClass(entity, 'lupa-entity-name')}
            >
                {icons? <span>{icons} </span> : ''}
                <span
                    style={style}
                    title={entity.file && entity.file.path}
                >
                    {finalName}
                </span>
            </span>
        </span>;
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
            phrase: '',
            activeEntity: null,
        };
    }
    changeActiveEntity(entity) {
        this.setState({activeEntity: entity});
        window.lupaActiveEntity = entity;
    }
    componentDidMount() {
        console.log("Zamontowano")
        this.refs.search.focus();
    }
    componentDidUpdate() {

    }
    render() {
        const arrays = split(item => item.type == 'label', this.props.metadata);
        const labels = arrays[0];
        function filterByPhrase({item, phrase}) {
            if (!phrase) {
                // no filter phrase, so show everything
                return true;
            }
            const indexOfColon = phrase.indexOf(':');
            if (indexOfColon != -1) {
                const propValue = phrase.substr(indexOfColon + 1).toLowerCase();

                const propNames = phrase.substr(0, indexOfColon).split('.');
                if (propNames[0] == 't') {
                    propNames[0] = 'type';
                }
                const q = propNames.join('.');

                const foundValue = _.get(item, q);

                // there is defined property in object
                if (foundValue !== undefined) {
                    if (!propValue) { // if user entered only property name
                        return true;
                    }
                    if (!isNaN(propValue)) {
                        return (foundValue + '') == propValue;
                    } else
                        return (foundValue + '').toLowerCase().indexOf(propValue) != -1;
                }
                return false;

            }
            if (item.name) {
                if (!item.name.toLowerCase) {
                    //console.log('ERROR toLowerCase', item);
                }
                const nameToCompare = (item.name + '').toLowerCase();
                const phraseToCompare = phrase.toLowerCase();
                return nameToCompare.indexOf(phraseToCompare) != -1;
            }
            return false;
        }
        let metadata;
        let phrase;
        if (this.state.phrase.indexOf('..') === 0) {
            metadata = (this.props.allMetadata || []);
            phrase = this.state.phrase.substr('..'.length);
        } else {
            metadata = arrays[1];
            phrase = this.state.phrase;
        }
        const finalMetadata = metadata
            .filter(item => ignored.indexOf(item.type) == -1)
            .filter(item => {
                return phrase
                    .split(' ')
                    .filter(a => a /*identity*/)
                    .every(predicate => filterByPhrase({item, phrase: predicate}))
            });



        return (
        <div
            className="lupa-structure"
            onClick={this.props.onClick}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            onMouseOver={this.props.onMouseOver}
            onMouseOut={this.props.onMouseOut}
            onMouseLeave={this.props.onMouseLeave}
        >
            <div style={{width: 300}}>
            {
                labels.map(label => <Label entity={label} />)
            }
            </div>

            <div className="native-key-bindings">
                <input
                    type="text"
                    style={{
                        border: '1px solid grey',
                        margin: '4px',
                        width: '100%',
                    }}
                    placeholder="filter (e.g. foo, or type:function)"
                    value={this.state.phrase}
                    ref="search"
                    className="lupa-search"
                    onChange={e => this.setState({phrase: e.target.value})}
                />
                <div>Now you can navigate by `tab` and `enter`</div>
            </div>
            <div>
            <EntityList
                entities={finalMetadata}
                onClickEntity={this.props.onClickEntity}
                onFocusEntity={(entity) => this.changeActiveEntity(entity)}
                onBlurEntity={() => this.changeActiveEntity(null)}
                />
            </div>
        </div>);
    }
}

export function EntityList({entities, onClickEntity, onFocusEntity, onBlurEntity}) {
    function renderEntity(entity, i, arr) {
        const prev = arr[i - 1];
        const loc = entity.loc || defaultLoc;
        const shouldShowType = !prev || prev.type != entity.type;
        //window.lupaActiveEntty
            return <div
            key={ entity.loc? entity.loc.start.line + ',' + entity.loc.start.column : i  }
            className={"lupa-entity" + (entity.ui_active? ' lupa-entity-active' :'')}
            data-lupa-entity-type={entity.type}
            data-lupa-entity-name={entity.name}
            data-lupa-entity-id={entity.id}
            data-column={loc.start.column}
            data-column-end={loc.end.column}
            data-line-end={loc.end.line}
            data-line={loc.start.line}
            data-path={entity.file && entity.file.path}
            onClick={onClickEntity && onClickEntity.bind(null, entity)}
            a_onFocus={(e) => onFocusEntity(entity, e)}
            a_onBlur={(e) => onBlurEntity(entity, e)}
            tabIndex="0"
        >
                {shouldShowType && <h3 className="lupa-entity-type">{entity.type}</h3>}
                <Entity entity={entity}/>
        </div>;
    }

    return <div>
    {
        entities.map(renderEntity)
    }
    </div>;

}
