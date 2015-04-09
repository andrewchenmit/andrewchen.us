angular.module('weekendfaresApp', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: '/www/travelroos/partials/home.html'}).
      otherwise({redirectTo: '/'});
}]);
