// safe to run
var React = require('react')
var ReactDOMServer = require('react-dom/server')
var div = React.createFactory('div');
var img = React.createFactory('img');
var h2 = React.createFactory('h2');

var style = {
        color: '#eee',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 30,
        padding: 10,
        boxShadow: '0 0 16px green',
        height: 170,
        width: 200,
        marginLeft: 20,
};
var stars = [];
var title = h2({style: {color: 'white'}}, 'Scarface');
for (var i = 0; i < 6; i++)
    stars.push(img({src: '/Users/lukasz/atom-lupa/star.png'}));
var el = div({style: style}, [title, 'rating:',stars])
module.exports = ReactDOMServer.renderToStaticMarkup(el);
