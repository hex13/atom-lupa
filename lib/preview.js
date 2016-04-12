module.exports = {
    getHtmlPreview: function (file) {
        console.log("moved getHtmlPreview", file);
        var ast = file.ast;
        if (ast) {
            var root = ast.root;
            var s = '';
            function visit(node) {
                if (!node.tag) return '';
                s += '<li>';
                s += node.tag;
                s += '<ul>';
                node.children && node.children.forEach(visit);
                s += '</ul></li>';
            }
            visit(root);
            return '<ul>'+s+'</ul>';
        }
    },
    getCssPreview: function (file) {
        var ast = file.ast;
        console.log('css',ast.root);
        if (ast) {
            var root = ast.root;
            var s = '';
            function visit(node) {
                var line = node.source? node.source.start.line : -1;
                //var s = node.type == 'rule'? s : '';
                if (node.type == 'rule' || node.type=='@mixin') {
                    var attrs = 'data-line="'+ line + '" style="line-height:2"';
                    s += '<li ' + attrs + '>' + node.name + '</li>';
                }
                s += '<ul style="list-style-type:none">';
                node.children && node.children.forEach(visit);
                s += '</ul></li>';
            }
            visit(root);
            return '<ul style="list-style-type:none">'+s+'</ul>';
        }
    },
};
