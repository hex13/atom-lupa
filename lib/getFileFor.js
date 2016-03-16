module.exports.getFileForModule = function getFileForModule(state, name) {
    var files = state.files || [], f;
    console.log('getFileForModule, files', files);
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
