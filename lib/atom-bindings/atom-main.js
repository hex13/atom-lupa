"use babel";

import {CompositeDisposable} from 'atom';

module.exports = {
    subscriptions: null,
    config: {
        autoRefresh: {
            type: 'boolean',
            default: true,
        },
        shouldShowBreadcrumbs: {
            type: 'boolean',
            default: 'true',
            description: '(Restart of Atom is required after changing)',
        }
    },

      activate(state) {
          alert('act');
      },

      deactivate() {
          alert('deact');
      }
};
