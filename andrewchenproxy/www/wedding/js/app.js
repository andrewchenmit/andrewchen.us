angular.module('example', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: '/www/partials/wedding/home.html'}).
      when('/story', {templateUrl: '/www/partials/wedding/story.html', controller: ExamplesCtrl}).
      when('/details', {templateUrl: '/www/partials/wedding/details.html'}).
      when('/party', {templateUrl: '/www/partials/wedding/party.html'}).
      when('/registry', {templateUrl: '/www/partials/wedding/registry.html'}).
      when('/rsvp', {templateUrl: '/www/partials/wedding/rsvp.html'}).
      otherwise({redirectTo: '/'});
}]);
