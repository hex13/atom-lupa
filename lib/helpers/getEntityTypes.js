const getMetadata = require('lupa').Metadata.getMetadata;
module.exports = function getEntityTypes(files) {
    var types = {};
    files.forEach(f => {
        const metadata = getMetadata(f);
        metadata.forEach(item => types[item.type || item.name] = true);
    });
    return Object.keys(types);
}
