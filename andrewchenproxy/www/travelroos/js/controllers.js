var weekendfaresControllers = angular.module('weekendfaresControllers', []);

weekendfaresControllers.controller('TwoDayCtrl', function ($scope, $http, dbProcessingSrvc, viewLogicSrvc) {
  $scope.getCheckdateClass = viewLogicSrvc.getCheckdateClass;
  $scope.isNotPrice = viewLogicSrvc.isNotPrice;
  $scope.getPercentile = viewLogicSrvc.getPercentile;
  $scope.getPanelClass = viewLogicSrvc.getPanelClass;
  $scope.getMedianText = viewLogicSrvc.getMedianText;
  $scope.getMedianDiff = viewLogicSrvc.getMedianDiff;
  $scope.getMedianStatus = viewLogicSrvc.getMedianStatus;
  $scope.getPercentileStatus = viewLogicSrvc.getPercentileStatus;

  // Get prices by (dest ,itinerary, checkdate), dests, dates, prices by dest, and medians by destination.
  $http.get("pricesdb")
    .success(function(data){
      $scope.prices = dbProcessingSrvc.get_prices_by_dest_itinerary_checkdate(data);
      $scope.dests = dbProcessingSrvc.get_dests($scope.prices);
      $scope.dates = dbProcessingSrvc.get_checkdates($scope.prices);
      $scope.prices_by_dest = dbProcessingSrvc.get_prices_by_dest($scope.prices);
      $scope.medians = dbProcessingSrvc.get_medians_by_dest($scope.prices_by_dest);
      console.log("Destinations (dests): ");
      console.log($scope.dests);
      console.log("Prices by destination, itinerary, and check date (prices): ");
      console.log($scope.prices);
      console.log("Check dates (dates): ");
      console.log($scope.dates);
      console.log("Prices by destination (prices_by_dest): ");
      console.log($scope.prices_by_dest);
      console.log("Medians by dest (medians): ");
      console.log($scope.medians);
    })
    .error(function() {
      console.log("FAIL");
    }
  );
  // Get latest flight details by destination, itinerary.
  $http.get("flightdetailsdb")
    .success(function(data){
      $scope.latest_details = dbProcessingSrvc.get_details_by_dest_itinerary(data);
      console.log("Latest flight details by dest, itinerary (latest_details): ");
      console.log($scope.latest_details);
    })
    .error(function() {
      console.log("FAIL");
    }
  );
});
