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
    };
    return result;
  }
  $http.get("pricesdb")
    .success(function(data){
      $scope.prices = format_prices(data);
      console.log("SUCCESS");
      console.log(format_prices(data));
    })
    .error(function() {
      $scope.phones = "error in fetching data";
      console.log("FAIL");
    }
  );
  $http.get("weekendfaresdb")
    .success(function(data){
      $scope.fares = format_data(data);
      $scope.dates = extract_dates(data);
      console.log("SUCCESS");
      console.log(format_data(data));
      console.log(extract_dates(data));
    })
    .error(function() {
      $scope.phones = "error in fetching data";
      console.log("FAIL");
    }
  );
});
