jest.disableAutomock();
const createStore = require('../createStore').default;
const assert = require('assert');
describe('domMiddleware', () => {
    it('should be triggered (it demands collaboration in domMiddleware.js)',() => {
        let actions = [];
        const store = createStore([store => dispatch => (action) => {
            actions.push(action);
        }]);
        store.dispatch({$$$test: 'test280617', type: 'goTo'});
        assert.deepEqual(actions, [{type: 'tested280617'}]);
    })
});
