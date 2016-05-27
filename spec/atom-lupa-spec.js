const cheerio = require('cheerio');

describe("Atom Lupa", function () {
    beforeEach(function () {
        const workspaceElement = atom.views.getView(atom.workspace);
        this.el = workspaceElement;
        //jasmine.attachToDOM(workspaceElement)
        waitsForPromise(() => {
            return atom.workspace.open(__dirname + '/../index.js').then(editor => {
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

    });
});
