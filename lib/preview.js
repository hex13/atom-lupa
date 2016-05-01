"use babel";
import React from 'react';
import {CssClass} from './components/Structure';

module.exports = {
    getHtmlPreview: function (file) {
        var ast = file.ast;
        if (ast) {
            var root = ast.root;
            function visit(node) {
                if (!node.tag) return '';
                const classes = node.classes && node.classes.filter(v=>v).map(
                    cls => <CssClass entity={{name: cls}} />
                );
                const tag = <span style={{color: '#cc4'}}>{node.tag}</span>;
                const id = <span style={{color: '#f83'}}>{node.props &&  node.props.id && ('#' + node.props.id)}</span>;
                return <li><span>{tag}{id}{classes}</span>
                    <ul>
                    {
                        node.children && node.children.map(visit)
                    }
                    </ul>
                </li>;
            }
            return visit(root);
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
            return '<ul style="padding-left:0;list-style-type:none">'+s+'</ul>';
        }
    },
};
