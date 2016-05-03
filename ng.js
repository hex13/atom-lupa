(function () {
    angular.module('blah')

        .directive('Cat', function () {
            return {
                restrict: 'E',
                template: 'Hello Kitty'
            };
        })

        .directive('Dog', function () {
            return {
                restrict: 'E',
                template: 'Wow'
            };
        });

})();
