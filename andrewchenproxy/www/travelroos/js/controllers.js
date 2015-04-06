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
var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function ($scope, $http) {
  console.log("SD");
  $http.get("weekendfaresdb")
    .success(function(data){
      $scope.phones = data;
      console.log("SUCCESS");
      console.log(data);
    })
    .error(function() {
      $scope.phones = "error in fetching data";
      console.log("FAIL");
    }
  );
  console.log("DFD");
});
