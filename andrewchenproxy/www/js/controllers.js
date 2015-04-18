function ExamplesCtrl($scope, $http) {
	$http.get('/test').success(function(person){
		console.log(person);
		
		$scope.messages = [
			{content: 'Hello'},
			{content: 'Who are you?'}, 
			{content: 'What are you doing?'}, 
			{content: 'OK'},
			{content: 'Let\'s get it'}
		];
		
		$scope.person = person;
	});
}
