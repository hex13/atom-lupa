"use babel";

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
