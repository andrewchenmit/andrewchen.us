var weekendfaresApp = angular.module('weekendfaresApp', ['weekendfaresFilters']);

weekendfaresApp.controller('FaresCtrl', function ($scope, $http) {
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
      result[candidate][candidate2]['latest_price'] = d[i].price;
      result[candidate][candidate2]['latest_book_url'] = d[i].book_url;
    }
    return result;
  }
  function extract_dates(d) {
    var date_array = [];
    for (var i=0; i<d.length; i++) {
      if ($.inArray(d[i]['check_date'], date_array) == -1) {
        date_array.push(d[i]['check_date']);
      }
    }
    date_array.sort().reverse();
    return date_array;
  }
  $scope.isNotPrice = function(price) {
    if (price.indexOf('$') == -1) {
      return true;
    }
    return false;
  }
  $scope.getDests = function(dests) {
    var result = [];
    angular.forEach(dests, function(value, key) {
      result.push(key);
    });
    return result;
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
    if (price == 'n/a') { return 'n/a'; }
    var price = parseInt(price.substring(1, price.length).replace(',', ''));
    var dest = dest.substring(dest.length - 3, dest.length);
    var prices = $scope.prices[dest];
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
    if (price == 'n/a') { return 'n/a'; }
    var price = parseInt(price.substring(1, price.length).replace(',', ''));
    var dest = dest.substring(dest.length - 3, dest.length);
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
  function format_prices(prices) {
    var result = {};
    for (var i=0;i<prices.length;i++) {
      var ap = prices[i]['destination_airport'];
      var price = prices[i]['price'];
      price = parseInt(price.substring(1, price.length).replace(',',''));
      if (!(ap in result)) {
        result[ap] = [];
      }
      result[ap].push(price);
      result[ap].sort(sortNumber);
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
  function get_medians() {
    var dests = $scope.dests;
    var prices = $scope.prices;

    var result = {};
    for (var i=0;i<dests.length;i++) {
      var middle_index = Math.floor((prices[dests[i]].length - 1) / 2);
      result[dests[i]] = prices[dests[i]][middle_index];
    }
    return result;
  }
  $http.get("pricesdb")
    .success(function(data){
      $scope.prices = format_prices(data);
      $scope.dests = get_dests();
      $scope.medians = get_medians();
      console.log(format_prices(data));
      console.log(get_dests());
      console.log(get_medians(data));
    })
    .error(function() {
      console.log("FAIL");
    }
  );
  $http.get("weekendfaresdb")
    .success(function(data){
      $scope.fares = format_data(data);
      $scope.dates = extract_dates(data);
      console.log(format_data(data));
      console.log(extract_dates(data));
    })
    .error(function() {
      console.log("FAIL");
    }
  );
});
