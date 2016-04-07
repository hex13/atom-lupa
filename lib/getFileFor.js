module.exports.getFileForModule = function getFileForModule(state, name) {
    var files = state.files || [], f;
    for (var i = 0; i < files.length; i++) {
        f = files[i];
        for (var j = 0; j < f.metadata.length; j++) {
            if (f.metadata[j].name == 'modules' && f.metadata[j].data.indexOf(name) != -1) {
                return f;
            }
        }
    }
    return {
        path: ''
    }
}


module.exports.getFileForSymbol = function getFileForSymbol(files, name) {
    var f;
    for (var i = 0; i < files.length; i++) {
        f = files[i];
        var md = f.metadata || [];
        for (var j = 0; j < md.length; j++) {
            if (md[j].name == 'declaration' && md[j].data[0] ==  name) {
                return f;
            }
        }
    }
    return {
        path: ''
    }
}

module.exports.getFileForRequire = function getFileForRequire(files, name) {
    var f;
    for (var i = 0; i < files.length; i++) {
        f = files[i];
        var md = f.metadata || [];
        for (var j = 0; j < md.length; j++) {
            if (md[j].name == 'providesModule' && md[j].data[0] ==  name) {
                return f;
            }
        }
    }
    return {
        path: name
    }
}
