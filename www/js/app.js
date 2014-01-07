angular.module('App', ['ngRoute', 'App.services', 'App.controllers'])
// .config(['$compileProvider', function ($compileProvider) {
//     $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
// }])
.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'MainCtrl',
            templateUrl: 'partials/main.html'
        })
        .when('/player-com', {
            controller: 'OnePlayerCtrl',
            templateUrl: 'partials/oneplayer.html'
        })
        .when('/player-player', {
            controller: 'TwoPlayerCtrl',
            templateUrl: 'partials/twoplayer.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});
