"use babel";
import React from 'react';

var ignored = ['rnd', 'providesModule'];

export function filterByPhrase({item, phrase}) {
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

function filterMetadata(state, metadata0, allMetadata = []) {

    let metadata;
    let phrase;


    if (state.phrase.indexOf('..') === 0) {
        metadata = allMetadata;
        phrase = state.phrase.substr('..'.length);
    } else {
        metadata = metadata0;
        phrase =  state.phrase;
    }
    return metadata
        .filter(item => ignored.indexOf(item.type) == -1)
        .filter(item => {
            return phrase
                .split(' ')
                .filter(a => a /*identity*/)
                .every(predicate => filterByPhrase({item, phrase: predicate}))
        });
}

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phrase: '',
        };
    }
    focus() {
        this.refs.search.focus();
    }
    render() {
        return <input
            type="text"
            style={{
                border: '1px solid grey',
                marginTop: '4px',
                width: '100%',
            }}
            placeholder="filter (e.g. foo, or type:function)"
            value={this.state.phrase}
            ref="search"
            className="lupa-search native-key-bindings"
            onChange={e => {
                const newState = {phrase: e.target.value};
                this.setState(newState);
                this.props.onChange({phrase: e.target.value, filter: filterMetadata.bind(null, newState)});
            }}
        />

    }
}
