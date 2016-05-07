"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
const cheerio = require('cheerio');
// jest.unmock('../ProjectExplorer');
// jest.unmock('react');
jest.disableAutomock();
//jest.mock('../../getEntitiesByType');


var ProjectExplorer = require('../ProjectExplorer');
describe('<ProjectExplorer />', () => {
    beforeEach(function () {
        this.files = [
            {
                metadata: [
                    {type: 'something'},
                    {type: 'something'},
                    {type: 'foo'},
                ]
            },
            {
                metadata: [
                    {type: 'foo'},
                    {type: 'something'},
                    {type: 'foo'},
                    {type: 'blah'},
                ]
            },
            {
                metadata: [
                ]
            }
        ];
        this.reactElement = TestUtils.renderIntoDocument(<ProjectExplorer files={this.files}/>);
        this.html = ReactDOM.findDOMNode(this.reactElement).innerHTML;
        this.$ = cheerio(this.html);
    });

    it('should render buttons for all entity types', function() {
        const $ = this.$;

        console.log($.find('*[data-entity-name]').length);
        expect($.find('*[data-entity-name=something]').length).toEqual(1);
        expect($.find('*[data-entity-name=foo]').length).toEqual(1);
        expect($.find('*[data-entity-name=blah]').length).toEqual(1);
    });
});
