angular.module('example', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: '/www/partials/home.html'}).
      when('/example', {templateUrl: '/www/partials/example.html', controller: ExamplesCtrl}).
      otherwise({redirectTo: '/'});
}]);