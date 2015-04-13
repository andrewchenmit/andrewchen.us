var weekendfaresApp = angular.module('weekendfaresApp', ['weekendfaresFilters']);

weekendfaresApp.controller('FaresCtrl', function ($scope, $http) {
  function getPriceAndPriceText(price_text) {
    var price_text = price_text;
    var price = -1;
    if (price_text != 'n/a') {
      price = parseInt(price_text.substring(1, price_text.length).replace(',',''));
    }
    return [price, price_text];
  }
  function get_details_by_dest_itinerary(d) {
    result = {};
    for (var i=0;i<d.length;i++) {

      // Format price text and price.
      var price_data = getPriceAndPriceText(d[i].price);
      d[i].price = price_data[0];
      d[i].price_text = price_data[1];

      // Key by destination airport.
      var candidate1 = d[i].destination_airport;
      if (!(candidate1 in result)) {
        result[candidate1] = {};
      }

      // Key by itinerary dates.
      var candidate2 = d[i].there_date+d[i].back_date;
      if (!(candidate2 in result[candidate1])) {
        result[candidate1][candidate2] = {};
      }

      // Store flight details by itinerary dates.
      result[candidate1][candidate2] = d[i];

      // Store itinerary display text.
      result[candidate1][candidate2]['itinerary_text'] = d[i].there_date + ' to ' + d[i].back_date;
    }
    return result;
  }
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
  function sortNumber(a,b) {
    return a - b;
  }
  function get_prices_by_dest_itinerary_checkdate(data) {
    var result = {};
    for (var i=0;i<data.length;i++) {
      var ap = data[i]['destination_airport'];
      var price_data = getPriceAndPriceText(data[i]['price']);
      var price = price_data[0];
      var price_text = price_data[1];

      // Key by destination airport.
      if (!(ap in result)) {
        result[ap] = {};
      }

      // Key by itinerary.
      var itinerary = data[i]['there_date'] + data[i]['back_date'];
      if (!(itinerary in result[ap])) {
        result[ap][itinerary] = {};
      }

      // Key by check_date.
      var check_date = data[i]['check_date'];
      if (!(check_date in result[ap][itinerary])) {
        result[ap][itinerary][check_date] = {};
      }

      // Store price and itinerary text for each dest-itinerary combo.
      result[ap][itinerary][check_date]['price'] = price;
      result[ap][itinerary][check_date]['price_text'] = price_text;
      result[ap][itinerary][check_date]['itinerary_text'] = data[i]['there_date'] + ' to ' + data[i]['back_date'];;
    };
    return result;
  }
  function get_dests() {
    var result = [];
    angular.forEach($scope.prices, function(value, key) {
      if (!($.inArray(key, result) != -1)) {
        result.push(key);
      }
    });
    return result;
  }
  function get_prices_by_dest(prices_by_dest_itinerary_checkdate) {
    var result = {};
    angular.forEach(prices_by_dest_itinerary_checkdate, function(value0, dest) {
      var prices_list = [];
      angular.forEach(value0, function(value, key) {
        angular.forEach(value, function(value2, key2) {
          if (value2.price != -1) {
            prices_list.push(value2.price);
          }
        });
      });
      prices_list.sort(sortNumber);
      result[dest] = prices_list;
    });
    return result;
  }
  function get_medians_by_dest() {
    var prices_by_dest = $scope.prices_by_dest;

    var result = {};
    angular.forEach(prices_by_dest, function(value, dest) {
      var prices_list = value;
      var middle_index = Math.floor((prices_list.length - 1) / 2);
      result[dest] = prices_list[middle_index];
    });
    return result;
  }
  function get_checkdates(prices_by_dest_itinerary_checkdate) {
    var date_array = [];
    var result = [];
    angular.forEach(prices_by_dest_itinerary_checkdate, function(value, dest) {
      angular.forEach(value, function(value1, key1) {
        angular.forEach(value1, function(value2, check_date) {
          if ($.inArray(check_date, result) == -1) {
            result.push(check_date);
          }
        });
      });
    });
    result.sort().reverse();
    return result;
  }
  // Get prices by (dest,itinerary,checkdate), medians by destination, and list of dests.
  $http.get("pricesdb")
    .success(function(data){
      $scope.prices = get_prices_by_dest_itinerary_checkdate(data);
      $scope.dests = get_dests();
      $scope.dates = get_checkdates($scope.prices);
      $scope.prices_by_dest = get_prices_by_dest($scope.prices);
      $scope.medians = get_medians_by_dest();
      console.log("Destinations (dests): ");
      console.log($scope.dests);
      console.log("Prices by destination, itinerary, and check date (prices): ");
      console.log(get_prices_by_dest_itinerary_checkdate(data));
      console.log("Check dates (dates): ");
      console.log($scope.dates);
      console.log("Prices by destination (prices_by_dest): ");
      console.log(get_prices_by_dest($scope.prices));
      console.log("Medians by dest (medians): ");
      console.log(get_medians_by_dest(data));
    })
    .error(function() {
      console.log("FAIL");
    }
  );
  // Get latest flight details by destination, itinerary.
  $http.get("flightdetailsdb")
    .success(function(data){
      $scope.latest_details = get_details_by_dest_itinerary(data);
      console.log("Latest flight details by dest, itinerary (latest_details): ");
      console.log($scope.latest_details);
    })
    .error(function() {
      console.log("FAIL");
    }
  );
});
