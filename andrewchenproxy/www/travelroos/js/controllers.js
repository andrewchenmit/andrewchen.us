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
  function format_data(d) {
    result = {};
    for (var i=0;i<d.length;i++) {
      var candidate = 'SFO to ' + d[i].destination_airport;
      if (!(candidate in result)) {
        result[candidate] = {};
      }
      var candidate2 = d[i].there_date + " to " + d[i].back_date;
      if (!(candidate2 in result[candidate])) {
        result[candidate][candidate2] = {};
      }
      var candidate3 = d[i].check_date;
      if (!(candidate3 in result[candidate][candidate2])) {
        result[candidate][candidate2][candidate3] = d[i];
      }
    }
    return result;
  }
  console.log("SD");
  $http.get("weekendfaresdb")
    .success(function(data){
      //$scope.phones = format_data(data);
      $scope.phones = format_data(data);
      console.log("SUCCESS");
      console.log(format_data(data));
    })
    .error(function() {
      $scope.phones = "error in fetching data";
      console.log("FAIL");
    }
  );
  console.log("DFD");
});
