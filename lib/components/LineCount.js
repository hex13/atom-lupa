const React = require('react');
const div = React.createFactory('div');
const span = React.createFactory('span');

module.exports = function LineCount(props) {
    const loc = props.lines;
    var color;
    if (loc < 100)
        color = '#00bb00';
    else if (loc < 150)
        color = '#99bb00';
    else if (loc < 300)
        color = '#cc9900';
    else if (loc < 500)
        color = '#dd8800';
    else if (loc < 1000)
        color = '#ee6600';
    else
        color = 'red';

    const style = {color: color};

    return span({style: style}, [props.lines, ' loc']);
}
