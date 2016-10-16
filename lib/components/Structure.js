"use babel";

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as Path from 'path';
import LineCount from './LineCount';
const get = require('lodash/get');
const _ = {get};


const defaultLoc = {
    start: {line:0, column:0},
    end: {line:0, column:0},
};
export class Entity extends React.Component {
    render() {
        const props = this.props;
        const entity = props.entity;
        const type = entity.type;
        // TODO this is temporary hack.
        const _components = window.__hex13__components || components;
        const C = _components.hasOwnProperty(type)? _components[type] : EntityName;

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


export class Class extends React.Component {
    render() {
        const entity = this.props.entity;
        const icons = <span style={{color: '#a74'}} className='icon icon-puzzle'></span>;
        const superClass = entity.superClass || {name: ''};
        return <span>
            <EntityName entity={entity} icons={icons}/>
            <em className='lupa-text'> {superClass.name? '(' + superClass.name + ')' : ''}</em>
            {
                !this.props.short &&
                <ul>
                {
                    entity.functions &&
                    entity.functions.map(
                        (meth,i) => {
                            const locEl = getLocPseudoElement(meth);
                            return <li class="lupa-entity" key={meth.name || i} {...locEl.props}><Function entity={meth} /></li>
                        }
                    )
                }
                </ul>
            }
        </span>;
    }
}

export function Import({entity}) {
    return <div className="lupa-text">
        <span className='icon icon-link-external'></span>
        <EntityName entity={entity} /> from
        <span className='lupa-entity lupa-file lupa-link' data-path={entity.source}> {entity.originalSource}</span>
    </div>;
}
export function Lines({entity}) {
    const loc = entity.data[0];
    return <LineCount lines={loc} />
}


var components = {
    'class': Class,
    'import': Import,
    'function': Function,
    'interface': Interface,
    lines: Lines,
    label: Ignored,
    rnd: Ignored,
    variableDeclaration: VariableDeclaration,
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


export function Interface({entity, short}) {
    const name = [
        <em>i </em>,
        <span style={{opacity: 0.5}} className='icon icon-puzzle'></span>,
        <em>{entity.name}</em>,
    ];
    const a = short? null : <ul>
    {
        entity.properties &&
        entity.properties.map(
            (meth,i) => {
                const locEl = getLocPseudoElement(meth);
                return <li class="lupa-entity" key={meth.name || i} {...locEl.props}><EntityName entity={meth} /></li>
            }
        )
    }
    </ul>


    return <span><EntityName
        entity={entity}
        name={name} />{a}</span>;
}

export function VariableDeclaration({entity}) {
    const init = entity.init && entity.init.length < 15? entity.init : '';
    const name = [
        entity.name,
        init && <em className="lupa-badge lupa-badge-variable-init" style={{marginLeft: 4}}>{init}</em>
    ];
    return <EntityName
        entity={entity}
        name={name} />;
}

export function JsxCustomElement({entity}) {
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

export function ObjectLiteral({entity}) {
    let props = trimArray(Object.keys(entity.props));
    const displayName = [
        //<span className="lupa-badge lupa-badge-object" title="object">{'{..}'}</span>,
        //<span style={{opacity: 0.6, color: '#a74'}} className='icon icon-puzzle'></span>,
        //'🍏',
        entity.name? <strong>{entity.name} </strong> : '',
        <span className='lupa-text'>{'{' + props.join(', ') + '}'}</span>
    ];
    return <span>
        <EntityName
            entity={entity}
            name={displayName}
        />
    </span>
}

export function Exports({entity}) {
    console.log("EXPORTS!", entity);
    return <div>
    {
        entity.data.map(item => <div>{item}</div>)
    }
    </div>;
}

export function Directive({entity}) {
    //const icons = <span style={{color: '#a74'}} className='icon icon-puzzle'></span>;
    const icons = <img src="atom://atom-lupa/assets/angular.png" />;
    return <EntityName entity={entity} icons={icons}/>
}

export function Controllers({entity}) {
    const icons = <span className='icon icon-keyboard'></span>
    return <div>
    {
        entity.data.map(
            e => <EntityName entity={{name: e}} icons={icons}/>
        )
    }
    </div>;
}

export function Services({entity}) {
    const icons = <span className='icon icon-gear'></span>
    return <div>
    {
        entity.data.map(
            e => <EntityName entity={{name: e}} icons={icons}/>
        )
    }
    </div>;
}


export function AngularModuleDependency({entity}) {
    const icons = <span className='icon icon-link-external'></span>
    return <EntityName entity={entity} icons={icons} />;
}

export function AngularModule({entity}) {
    const icons = <span className='icon icon-package'></span>;
    return <EntityName entity={entity} icons={icons} />;
}

export function Todo({entity}) {
    const icons = <span className='icon icon-comment'></span>;
    return <EntityName entity={entity} icons={icons} />

}

export function ModuleExports({entity}) {
    return <div>{entity.data.join(', ')}</div>
}

export function Function({entity, short}) {
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

    // if (entity.isMethod) {
    //     icons.push(<span className="lupa-badge lupa-badge-method" title="method">M</span>)
    // }

    if (entity.jsx) {
        //icons += ' <JSX />';
        icons.push(<span style={{sfontSize: 'small', color: '#61dafb'}}>{'<JSX />'}</span>);
    }

    const params = trimArray(entity.params || []).map(p => p.name || p).join(', ');
    // const name = <span>
    //     {entity.name}(<span style={{color: '#bb8'}}>{params}</span>)
    // </span>
    const name = [
        <span key="lambda" className="storage type function">λ </span>,
        <span style={entity.isMethod? {fontStyle: 'italic'} : null}>{entity.name}</span>,
        '(' , <span key="params" className="variable">{params}</span> , ')'];

    const parentFuncStyle = {opacity: 0.7};
    const callee = _.get(entity, 'argumentOf.name', '');
    return <div style={{display:'inline-block'}}>
        {
            !short && isLong &&
                <div style={locStyle} className='icon icon-alert'>{lineCount} lines</div>
        }
        {
            callee && <em style={parentFuncStyle}>{callee.split('.').pop()}(</em>
        }
        <EntityName entity={entity} name={name} icons={icons}/>
        { callee && <span style={parentFuncStyle}>)</span> }
    </div>
}


export function Log({entity}) {
    return <div>{JSON.stringify(entity)}</div>;
}

export function Preview({entity}) {
    if (entity.html)
        return <div dangerouslySetInnerHTML={{__html: entity.html}}></div>
    return entity.preview;
}

export function ImportedBy({entity}) {
    return <div>
        {
            // entity.files.map(file => <div
            //     className='lupa-file'
            //     data-path={file.path}>
            //         {Path.basename(file.path)}
            // </div>
            // )
        }
        {
            //entity.files.map(f => <EntityName entity={{type:'file', path: f.path}} />)
        }
        {
            <span className='icon icon-file-code'>{Path.basename(entity.file.path)}</span>
        }
    </div>
}
export function Ignored() {
    return <span></span>
}

export function Label({entity}) {
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
    let type = entity.type;
    // so we correct some things:
    if (type == 'interface') type = 'class';
    return ['entity', 'name', type].concat(initialClass).join(' ');
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



import {Search} from './Search';

export class Structure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phrase: '',
            activeEntity: null,
            filter: (md) => md
        };
    }
    changeActiveEntity(entity) {
        this.setState({activeEntity: entity});
        window.lupaActiveEntity = entity;
    }
    componentDidMount() {
        console.log("Zamontowano")
        this.search.focus();
    }
    componentDidUpdate() {

    }
    render() {
        const ignoredTypes = ['providesModule'];
        const metadataFilteredBySearchBox = this.state.filter(this.props.metadata, this.props.allMetadata);
        const finalMetadata = metadataFilteredBySearchBox.filter(item => ignoredTypes.indexOf(item.type) == -1);

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

            <div className="native-key-bindings">
                <Search
                    onChange={ ({phrase, filter} ) => this.setState({phrase, filter})}
                    ref={search => this.search = search}
                />
            </div>
            <div>
            <EntityList
                entities={finalMetadata}
                onClickEntity={this.props.onClickEntity}
                onFocusEntity={(entity) => this.changeActiveEntity(entity)}
                onBlurEntity={() => this.changeActiveEntity(null)}
                onToggleVisibility={() => this.forceUpdate()}
                />
            </div>
        </div>);
    }
}

const hiddenTypes = {
    $exports: true,
    $export: true
};

function getLocPseudoElement(entity) {
    const loc = entity.loc || defaultLoc;
    // this is JSX by accident. Legacy code. It is meant to be just JS object, not HTML.
    return <span
        key={ entity.type + ':' + entity.name + (entity.loc? entity.loc.start.line + ',' + entity.loc.start.column : '')  }
        className={"lupa-entity" + (entity.ui_active? ' lupa-entity-active' :'')}
        data-lupa-entity-type={entity.type}
        data-lupa-entity-name={entity.name}
        data-lupa-entity-id={entity.id}
        data-column={loc.start.column}
        data-column-end={loc.end.column}
        data-line-end={loc.end.line}
        data-line={loc.start.line}
        data-path={entity.file && entity.file.path}
        tabIndex="0"
         />
}

export function EntityList({entities, onClickEntity, onFocusEntity, onBlurEntity, onToggleVisibility}) {
    function renderEntity(entity, i, arr) {
        const prev = arr[i - 1];
        const locEl = getLocPseudoElement(entity);
        const shouldShowType = !window.lupaHideEntityTypes && (!prev || prev.type != entity.type);
        const $type = '$' + entity.type;
        //window.lupaActiveEntty
            return <div
            {...locEl.props}
            key={locEl.key}
            onClick={onClickEntity && onClickEntity.bind(null, entity)}
            a_onFocus={(e) => onFocusEntity(entity, e)}
            a_onBlur={(e) => onBlurEntity(entity, e)}
            tabIndex="0"
        >
                {
                    shouldShowType &&
                    <h3
                        className="lupa-entity-type"
                        onClick={
                            ()=> {
                                hiddenTypes[$type] =  !hiddenTypes[$type];
                                onToggleVisibility();
                            }
                        }
                    >
                        {entity.type}
                        &nbsp;
                        <span
                            style={{opacity: 0.6}}
                            className={"icon icon-chevron-" + (hiddenTypes[$type]? 'right' : 'down')}></span>
                    </h3>
                }
                {
                    hiddenTypes[$type] || <Entity entity={entity}/>
                }
        </div>;
    }

    return <div>
    {
        entities.map(renderEntity)
    }
    </div>;

}
