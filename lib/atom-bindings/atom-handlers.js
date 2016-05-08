const fs = require('fs');

module.exports = {
    goToPos: function () {
        alert("go to pos");
    },
    goToFile: function (path, line) {
        console.log("GO TO FILE", arguments);
        if (fs.existsSync(path)) {
            atom.workspace.open(path, {initialLine: line? line - 1 :0})
        } else
            alert('Can\'t open ' + path)

    },
    msg: function(s) {
        atom.notifications.addSuccess(s)        
    }
};
