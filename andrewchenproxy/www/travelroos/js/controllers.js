var weekendfaresControllers = angular.module('weekendfaresControllers', []);

weekendfaresControllers.controller('TwoDayCtrl', function ($scope, $http, dbProcessingSrvc) {
  $scope.getCheckdateClass = function(index) {
    if (index != 0) { return 'old_date'; }
    else { return ''; }
  }
  $scope.isNotPrice = function(price) {
    if (price == -1) {
      return true;
    }
    return false;
  }
  $scope.filterLatestPrice = function(items) {
      var result = {};
      angular.forEach(items, function(value, key) {
        if (key.indexOf('latest') == -1 && key.indexOf('book') == -1) {
          result[key] = value;
        }
      });
      return result;
  }
  $scope.getPercentile = function(price, dest) {
    if (price == -1) { return 'n/a'; }
    var prices = $scope.prices_by_dest[dest];
    // Percentile = % of prices lower than given price.
    var lower_count = 0;
    for (var i=0;i<prices.length;i++) {
      if (prices[i] < price) {
        lower_count += 1;
      }
    };
    var result = Math.round(lower_count / prices.length * 100);
    return result;
  }
  $scope.getPanelClass = function(percentile, median) {
    if (percentile <= 1) {
      return 'panel-amazing';
    }
    else if (percentile <= 10) {
      return 'panel-success';
    }
    else {
      return 'panel-default';
    }
  }
  $scope.getMedianText = function(diff) {
    var result = '';
    if (diff < 0) {
      result = '$' + Math.abs(diff).toString() + ' higher';
    }
    else if (diff > 0) {
      result = '$' + Math.abs(diff).toString() + ' lower';
    }
    else if (diff == 0) {
      result = 'the same';
    }
    return result;
  }
  $scope.getMedianDiff = function(price, dest) {
    if (price == -1) { return 'n/a'; }
    var diff = $scope.medians[dest] - price;
    return diff;
  }
  $scope.getMedianStatus = function(diff) {
    if (diff > 50) {
      return 'good';
    }
    else if (diff < 0) {
      return 'bad';
    }
    else {
      return 'neutral';
    }
  }
  $scope.getPercentileStatus = function(diff) {
    if (diff < 10) {
      return 'good';
    }
    else if (diff > 20) {
      return 'bad';
    }
    else {
      return 'neutral';
    }
  }
  // Get prices by (dest,itinerary,checkdate), medians by destination, and list of dests.
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
