// safe to run
console.log("HELLO WORLD");

var React = require('react')
var ReactDOMServer = require('react-dom/server')
var div = React.createFactory('div');
var img = React.createFactory('img');
var style = {
        color: 'green',
        backgroundColor: 'blue',
        boxShadow: '0 0 16px green',
        height: 170,
        width: 200
};
var stars = [];
for (var i = 0; i < 6; i++)
    stars.push(img({src: '/Users/lukasz/atom-lupa/star.png'}));
var el = div({style: style}, ['kotek1', stars])
module.exports = ReactDOMServer.renderToStaticMarkup(el);
