"use babel";
import React from 'react';

var html = `<div id='lupa-editor-wrapper'></div>
<div id='lupa-info'></div>
<div style='height: 4px'></div>
<button style='display:none' id='lupa-run'>Run</button>
<button class='btn' id='lupa-refresh'><span class='icon icon-sync'></span>Refresh</button>
<button class='btn' id='lupa-change-colors'>Change colors</button>
<br>
<span id='lupa-index-project-wrapper'>
<button class='btn' id='lupa-index-project'>
<span class='icon icon-telescope'></span>
Index project</button>
(It requires lupaProject.json file.)
</span>
<div class='lupa-structure' id='lupa-structure'></div>"`
export function Main() {
    return <div dangerouslySetInnerHTML={{__html: html}}></div>
}
