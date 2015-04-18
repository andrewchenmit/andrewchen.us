var weekendfaresApp = angular.module('weekendfaresApp', [
  'ngRoute',
  'weekendfaresControllers',
  'weekendfaresFilters'
]);

weekendfaresApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: '/www/travelroos/partials/home.html'
      }).
      when('/2day', {
        templateUrl: '/www/travelroos/partials/2day.html',
        controller: 'TwoDayCtrl'
      }).
      when('/3day', {
        templateUrl: '/www/travelroos/partials/3day.html',
        controller: 'ThreeDayCtrl'
      }).
      otherwise({redirectTo: '/'});
}]);
