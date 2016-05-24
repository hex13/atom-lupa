describe("Atom Lupa", function () {
    it('should fail', function () {
        waitsForPromise(() => {
            return atom.workspace.open('helloworld').then(editor => {
                expect(true).toBe(false);
            });
        });



    });
});
