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
};
