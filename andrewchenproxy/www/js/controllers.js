var exampleControllers = angular.module('exampleControllers', []);

exampleControllers.controller('ExamplesCtrl', function ($scope, $http) {
	$http.get('/test').success(function(person){
		$scope.messages = [
			{content: 'Hello'},
			{content: 'Who are you?'}, 
			{content: 'What are you doing?'}, 
			{content: 'OK'},
			{content: 'Let\'s get it'}
		];
		$scope.person = person;
	});
});
