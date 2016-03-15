module.exports = {
    getHtmlPreview: function (file) {
        console.log("moved getHtmlPreview");
        var md = file.metadata.filter(function (md) {
            return md.name == 'html-ast';
        })[0];
        if (md) {
            var root = md.data;
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
