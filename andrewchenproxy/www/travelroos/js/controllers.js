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
      if (!(d[i].destination_airport in result)) {
        result[d[i].destination_airport] = {};
      }
      if (!(d[i].there_date in result[d[i].destination_airport])) {
        result[d[i].destination_airport][d[i].there_date] = {};
      }
      if (!(d[i].check_date in result[d[i].destination_airport][d[i].there_date])) {
        result[d[i].destination_airport][d[i].there_date][d[i].check_date] = d[i];
      }
    }
    return result;
  }
  console.log("SD");
  $http.get("weekendfaresdb")
    .success(function(data){
      //$scope.phones = format_data(data);
      $scope.phones = data;
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
