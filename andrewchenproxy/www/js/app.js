angular.module('example', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: '/www/partials/home.html'}).
      when('/bio', {templateUrl: '/www/partials/bio.html', controller: ExamplesCtrl}).
      otherwise({redirectTo: '/'});
}]);
