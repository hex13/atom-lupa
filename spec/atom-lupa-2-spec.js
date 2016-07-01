const cheerio = require('cheerio');
const TestUtils = require('react-addons-test-utils');


describe("Atom Lupa when Atom Settings are open", function () {
    beforeEach(function () {
        const workspaceElement = atom.views.getView(atom.workspace);
        this.el = workspaceElement;
        waitsForPromise(() => {
            const prom = atom.packages.activatePackage('settings-view');
            atom.commands.dispatch(workspaceElement, 'settings-view:open');
            return prom;
        });

        waitsForPromise(() => {
            const prom = atom.packages.activatePackage('atom-lupa');
            atom.commands.dispatch(workspaceElement, 'atom-lupa:toggle');
            return prom;
        });

    });

    it('should pass smoke te1st', function (done) {
        window.alert = () => {};
        let t = +new Date;
        let ip;
        runs(()=> {
            ip = this.el.querySelector('.lupa-index-project');
            TestUtils.Simulate.click(ip);
        });




    });
});
