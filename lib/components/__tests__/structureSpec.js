"use strict";

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
const cheerio = require('cheerio');
// jest.unmock('../ProjectExplorer');
// jest.unmock('react');
jest.disableAutomock();
//jest.mock('../../getEntitiesByType');


var Component = require('../Structure').Structure;

describe('<Structure />', () => {
    beforeEach(function () {
        this.files = [
            {
                metadata: [
                    {type: 'something', name: 'something1'},
                    {type: 'something', name: 'something2'},
                    {type: 'foo', name: 'foo1'},
                    {type: 'function', name: 'doWhatever', params: []},
                    {type: 'class', name: 'Cat', superClass: {name: 'Animal'}},
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
        this.reactElement = TestUtils.renderIntoDocument(<Component
            metadata={this.files[0].metadata}
            />);
        this.html = ReactDOM.findDOMNode(this.reactElement).innerHTML;
        this.$ = cheerio(this.html);
    });

    it('should render all entities', function() {
        const $ = this.$;
        const entities = $.find('.lupa-entity');

        expect(entities.length).toBe(5);

        expect($.find(entities[0]).data('lupa-entity-type')).toBe('something');
        expect($.find(entities[0]).data('lupa-entity-name')).toBe('something1');

        expect($.find(entities[1]).data('lupa-entity-type')).toBe('something');
        expect($.find(entities[1]).data('lupa-entity-name')).toBe('something2');

        expect($.find(entities[2]).data('lupa-entity-type')).toBe('foo');
        expect($.find(entities[2]).data('lupa-entity-name')).toBe('foo1');

        expect($.find(entities[3]).text()).toMatch(/\bdoWhatever\b/);
        expect($.find(entities[4]).text()).toMatch(/\bCat\b/);
    });
});
