var weekendfaresControllers = angular.module('weekendfaresControllers', []);

weekendfaresControllers.controller('TwoDayCtrl', function ($scope, $http, $timeout, dbProcessingSrvc, viewLogicSrvc) {
  $scope.loading = true;
  $scope.getCheckdateClass = viewLogicSrvc.getCheckdateClass;
  $scope.isNotPrice = viewLogicSrvc.isNotPrice;
  $scope.getPercentile = dbProcessingSrvc.get_percentile;
  $scope.getPanelClass = viewLogicSrvc.getPanelClass;
  $scope.getMedianText = viewLogicSrvc.getMedianText;
  $scope.getMedianDiff = viewLogicSrvc.getMedianDiff;
  $scope.getMedianStatus = viewLogicSrvc.getMedianStatus;
  $scope.getPercentileStatus = viewLogicSrvc.getPercentileStatus;
  $scope.updateOnlyDeals = function(showOnlyDeals) {
    if (showOnlyDeals) {
      $scope.price_rows = $scope.deals;
    }
    else {
      $scope.price_rows = $scope.latest_details;
    }
  }

  // Get prices by (dest ,itinerary, checkdate), dests, dates, prices by dest, and medians by destination.
  // Get latest flight details by destination, itinerary.
  $http.get("pricesdb")
    .success(function(data){
      pricesdb = data[0]
      flightdetailsdb = data[1]
      $scope.prices = dbProcessingSrvc.get_prices_by_dest_itinerary_checkdate(pricesdb);
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

      $scope.latest_details = dbProcessingSrvc.get_details_by_dest_itinerary(flightdetailsdb);
      $scope.price_rows = $scope.latest_details;
      $scope.deals = dbProcessingSrvc.get_deals($scope.latest_details, $scope.prices_by_dest);
      console.log("Latest flight details by dest, itinerary (latest_details): ");
      console.log($scope.latest_details);
      console.log("Good deals (deals): ");
      console.log($scope.deals);
      var timestamp = Date.now();
      $timeout(function() {
        $scope.loading = false;
        console.log('LOADER JS time: ');
        console.log(Date.now() - timestamp);
      }, 500);
    })
    .error(function() {
      console.log("FAIL");
    }
  );
});

weekendfaresControllers.controller('ThreeDayCtrl', function ($scope, $http, $timeout, dbProcessingSrvc, viewLogicSrvc) {
  $scope.loading = true;
  $scope.getCheckdateClass = viewLogicSrvc.getCheckdateClass;
  $scope.isNotPrice = viewLogicSrvc.isNotPrice;
  $scope.getPercentile = dbProcessingSrvc.get_percentile;
  $scope.getPanelClass = viewLogicSrvc.getPanelClass;
  $scope.getMedianText = viewLogicSrvc.getMedianText;
  $scope.getMedianDiff = viewLogicSrvc.getMedianDiff;
  $scope.getMedianStatus = viewLogicSrvc.getMedianStatus;
  $scope.getPercentileStatus = viewLogicSrvc.getPercentileStatus;
  $scope.updateOnlyDeals = function(showOnlyDeals) {
    if (showOnlyDeals) {
      $scope.price_rows = $scope.deals;
    }
    else {
      $scope.price_rows = $scope.latest_details;
    }
  }

  // Get prices by (dest ,itinerary, checkdate), dests, dates, prices by dest, and medians by destination.
  // Get latest flight details by destination, itinerary.
  $http.get("threedaypricesdb")
    .success(function(data){
      pricesdb = data[0]
      flightdetailsdb = data[1]
      $scope.prices = dbProcessingSrvc.get_prices_by_dest_itinerary_checkdate(pricesdb);
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

      $scope.latest_details = dbProcessingSrvc.get_details_by_dest_itinerary(flightdetailsdb);
      $scope.price_rows = $scope.latest_details;
      $scope.deals = dbProcessingSrvc.get_deals($scope.latest_details, $scope.prices_by_dest);
      console.log("Latest flight details by dest, itinerary (latest_details): ");
      console.log($scope.latest_details);
      console.log("Good deals (deals): ");
      console.log($scope.deals);
      var timestamp = Date.now();
      $timeout(function() {
        $scope.loading = false;
        console.log('LOADER JS time: ');
        console.log(Date.now() - timestamp);
      }, 500);
    })
    .error(function() {
      console.log("FAIL");
    }
  );
});
