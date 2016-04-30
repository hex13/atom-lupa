"use babel";

import React from 'react';
import {Entity, EntityName} from './Structure';

export class StatusBar extends React.Component {
    render() {
        const style = {borderRadius: 4, padding: 4, background: '#333050'};
        return <div style={{padding: '6px 20px 0px'}}>{
            this.props.entities
                .map(ent => <span style={style}><Entity entity={ent} short={true}/></span>)
                .reduce((res,el) => res.concat(res.length? [' / ', el] : el), [])
        }</div>;
    }
}
