angular.module('example', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: '/www/wedding/partials/home.html'}).
      when('/story', {templateUrl: '/www/wedding/partials/story.html', controller: ExamplesCtrl}).
      when('/details', {templateUrl: '/www/wedding/partials/details.html'}).
      when('/party', {templateUrl: '/www/wedding/partials/party.html'}).
      when('/registry', {templateUrl: '/www/wedding/partials/registry.html'}).
      when('/rsvp', {templateUrl: '/www/wedding/partials/rsvp.html'}).
      otherwise({redirectTo: '/'});
}]);
