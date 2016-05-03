"use babel";

import React from 'react';
import {Entity, EntityName} from './Structure';

export class StatusBar extends React.Component {
    render() {
        const style = {borderRadius: 4, padding: 4, background: '#333050'};
        const entities = this.props.entities.slice(0);
        entities.sort(function (a, b) {
            var lineA = a.loc? a.loc.start.line : 0;
            var lineB = b.loc? b.loc.start.line : 0;
            return lineA - lineB;
        });
        return <div style={{padding: '6px 20px 0px'}}>{
            entities
                .map(ent => <span style={style}>
                    <Entity entity={ent} short={true}
                        onMouseOver={this.props.onMouseOver.bind(this, ent)}
                        onMouseOut={this.props.onMouseOut.bind(this, ent)}
                    />
                </span>)
                .reduce((res,el) => res.concat(res.length? [' / ', el] : el), [])
        }</div>;
    }
}
