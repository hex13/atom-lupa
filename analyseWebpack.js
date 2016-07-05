var o = require('./a.json');
var list = o.chunks[0].modules;
list.sort((a,b) => a.size - b.size);
var l = list.map(m => [m.name, m.size]);
console.log(l);
