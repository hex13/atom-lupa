const cheerio = require('cheerio');
const TestUtils = require('react-addons-test-utils');

describe("Atom Lupa", function () {
    beforeEach(function () {
        const workspaceElement = atom.views.getView(atom.workspace);
        this.el = workspaceElement;
        //jasmine.attachToDOM(workspaceElement)
        waitsForPromise(() => {
            return atom.workspace.open(__dirname + '/../mock.js').then(editor => {
            });
        });

        waitsForPromise(() => {
            const prom = atom.packages.activatePackage('atom-lupa');
            atom.commands.dispatch(workspaceElement, 'atom-lupa:toggle');
            return prom;
        });

        //
    });

    it('should pass smoke test', function () {

        runs(() => {
            expect(atom.packages.isPackageActive('atom-lupa')).toBe(true);
            const $ = cheerio(this.el.innerHTML);
            expect($.find('.lupa-structure').length).toBe(1);
        });

        runs(() => {
            const turtle = this.el.querySelector('.lupa-entity[data-lupa-entity-name=turtle]');
            //turtle.click();
            TestUtils.Simulate.click(turtle);
        });

        //waits(1500);
        // it should navigate by clicking
        runs(() => {
            const editor = atom.workspace.getActiveTextEditor();
            const pos = editor.getCursorBufferPosition();
            expect(pos).toEqual({row: 54, column: 2});
        });


    });
});
