var weekendfaresServices = angular.module('weekendfaresServices', []);

weekendfaresServices.service('dbProcessingSrvc', function() {
  function sortNumber(a,b) {
    return a - b;
  }
  function getPriceAndPriceText(price_text) {
    var price_text = price_text;
    var price = -1;
    if (price_text != 'n/a') {
      price = parseInt(price_text.substring(1, price_text.length).replace(',',''));
    }
    return [price, price_text];
  }
  this.get_details_by_dest_itinerary = function (d) {
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
      result[candidate1][candidate2]['itinerary_dates'] = d[i].there_date + ' to ' + d[i].back_date;
      result[candidate1][candidate2]['itinerary_text'] = d[i].there_date + ' ' + d[i].there_period + ' to ' + d[i].back_period;
    }
    return result;
  }
  this.get_prices_by_dest_itinerary_checkdate = function (data) {
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
      result[ap][itinerary][check_date]['itinerary_dates'] = data[i]['there_date'] + ' to ' + data[i]['back_date'];;
      result[ap][itinerary][check_date]['itinerary_text'] = data[i]['there_date'] + ' ' + data[i]['there_period'] + ' to ' + data[i]['back_period'];;
    };
    return result;
  }
  this.get_dests = function (prices) {
    var result = [];
    angular.forEach(prices, function(value, key) {
      if (!($.inArray(key, result) != -1)) {
        result.push(key);
      }
    });
    result.sort();
    return result;
  }
  this.get_prices_by_dest = function (prices_by_dest_itinerary_checkdate) {
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
  this.get_medians_by_dest = function (prices_by_dest) {
    var result = {};
    angular.forEach(prices_by_dest, function(value, dest) {
      var prices_list = value;
      var middle_index = Math.floor((prices_list.length - 1) / 2);
      result[dest] = prices_list[middle_index];
    });
    return result;
  }
  this.get_checkdates = function (prices_by_dest_itinerary_checkdate) {
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
  function getPercentile(price, prices) {
    if (price == -1) { return 'n/a'; }

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
  this.get_percentile = getPercentile;
  this.get_deals = function (latest_details, prices_by_dest) {
    var result = {};
    angular.forEach(latest_details, function(value0, dest) {
      result[dest] = {};
      var prices = prices_by_dest[dest];
      angular.forEach(value0, function(weekend_data, weekend_id) {
        if (getPercentile(weekend_data.price, prices) <= 10) {
          weekend_data['good_deal'] = true;
          result[dest][weekend_id] = weekend_data;
        }
      });
    });
    return result;
  }
});

weekendfaresServices.service('viewLogicSrvc', function() {
  this.getCheckdateClass = function(index) {
    if (index != 0) { return 'old_date'; }
    else { return ''; }
  }
  this.isNotPrice = function(price) {
    if (price == -1) {
      return true;
    }
    return false;
  }
  this.getPanelClass = function(percentile, median) {
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
  this.getMedianText = function(diff) {
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
  this.getMedianDiff = function(price, dest, medians) {
    if (price == -1) { return 'n/a'; }
    var diff = medians[dest] - price;
    return diff;
  }
  this.getMedianStatus = function(diff) {
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
  this.getPercentileStatus = function(diff) {
    if (diff <= 10) {
      return 'good';
    }
    else if (diff > 20) {
      return 'bad';
    }
    else {
      return 'neutral';
    }
  }
  this.updateOnlyDeals = function() {
  }
});
