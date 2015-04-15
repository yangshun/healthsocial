'use strict';

var CHART_COLORS = ['#cb6077', '#d28b71', '#f4bc87', '#beb55b', '#7bbda4', '#8ab3b5', '#a89bb9', '#bb9584', 
                    '#210b10', '#341a10', '#723d0a', '#131207', '#13261f', '#192727', '#292332', '#291c17'];

angular.module('healthsocialDevApp')
  .controller('AnalyticsCtrl', function ($scope, Auth) {
    $scope.selectedUsers = [];
    $scope.granularity = 'day';
    $scope.chartType = 'line';

    Auth.getAllUsers().then(function (data) {
      $scope.users = data;
      setTimeout(draw, 0);
    });

    $scope.$watchCollection('selectedUsers', function () {
        updateCharts();        
    });

    $scope.granularityChange = function () {
        updateCharts();
    }

    $scope.chartTypeChange = function () {
        updateCharts();
    }

    $scope.dateRange = moment().subtract(14, 'days').format('DD/MM/YYYY') + ' - ' + moment().subtract(1, 'day').format('DD/MM/YYYY');
    setTimeout(function () {
        $('input[name="daterange"]').daterangepicker({
            format: 'DD/MM/YYYY',
            minDate: '01/01/2015',
            maxDate: moment().subtract(1, 'day').format('DD/MM/YYYY')
        });
        $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
            updateCharts();
        });
    }, 0);

    function updateCharts () {
        if (!$scope.selectedUsers) {
            return;
        }

        var index = 0;
        $scope.selectedUsers.forEach(function (user) {
            user.color = CHART_COLORS[index];
            index++;
        });
        var startDate = $scope.dateRange.split(' - ')[0];
        var endDate = $scope.dateRange.split(' - ')[1];
        draw($scope.selectedUsers, startDate, endDate, $scope.granularity, $scope.chartType);
    }

    var sleepChart;
    var activityChart;
    var weightChart;

    var chartMapping = {
        sleep: {
            unit: 'minutes',
            chart: sleepChart,
        },
        activity: {
            unit: 'calories',
            chart: activityChart
        },
        weight: {
            unit: 'kilograms',
            chart: weightChart
        }
    };

    function draw (selectedUsers, startDate, endDate, granularity, chartType) {
        if (!selectedUsers || selectedUsers.length === 0) {
            return;
        }

        var startDate = moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        var startIndex = 0;

        selectedUsers[0].sleep_log.every(function (item, index) {
            if (item.date === startDate) {
                startIndex = index;
                return false;    
            } else {
                return true;
            }
        });

        var endDate = moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        var endIndex = 0;
        selectedUsers[0].sleep_log.every(function (item, index) {
            if (item.date === endDate) {
                endIndex = index;
                return false;    
            } else {
                return true;
            }
        });

        ['sleep', 'activity', 'weight'].forEach(function (type) {
            var data = selectedUsers[0][type + '_log'].slice(startIndex, endIndex+1);
            
            if (granularity === 'week') {
                data = data.filter(function (dataPoint, index) {
                    return index % 7 === 0;
                });
            }

            var labels = data.map(function (dataPoint) {
                return dataPoint.date;
            });

            var chartData = {
                labels: labels,
                datasets: []
            };

            selectedUsers.forEach(function (user) {
                var dataSet = user[type + '_log'].slice(startIndex, endIndex+1).map(function (dataPoint) {
                    return dataPoint[chartMapping[type].unit];
                });

                var plottingData = dataSet;
                if (granularity === 'week') {
                    plottingData = dataSet.filter(function (dataPoint, index) {
                        return index % 7 === 0;
                    });
                }

                chartData.datasets.push({
                    fillColor: user.color,
                    strokeColor: user.color,
                    pointColor: user.color,
                    pointStrokeColor: '#fff',
                    data: plottingData
                });

                function median (values) {
                    var clone = values.slice();
                    clone.sort(function(a, b) { 
                        return a - b; 
                    });
                    var half = Math.floor(clone.length/2);
                    if (clone.length % 2) {
                        return clone[half];
                    } else {
                        return (clone[half-1] + clone[half]) / 2.0;
                    }
                }
                function mean (values) {
                    var total = values.reduce(function (previousValue, currentValue) {
                        return previousValue + currentValue;
                    });
                    return total/values.length;
                }
                function standardDev (values) {
                    var avg = mean(values);
                  
                    var squareDiffs = values.map(function(value){
                        var diff = value - avg;
                        var sqrDiff = diff * diff;
                        return sqrDiff;
                    });
                  
                    var avgSquareDiff = mean(squareDiffs);
                    return Math.sqrt(avgSquareDiff);
                }
                function round2dp (value) {
                    return parseInt(value * 100)/100;
                }

                var statsObj = {
                    mean: round2dp(mean(dataSet)),
                    median: round2dp(median(dataSet)),
                    min: round2dp(Math.min.apply(null, dataSet)),
                    max: round2dp(Math.max.apply(null, dataSet)),
                    standardDev: round2dp(standardDev(dataSet))
                };
                user[type + '_stats'] = statsObj;
            });

            var chartObj = chartMapping[type].chart;
            
            if (chartObj) {
                chartObj.destroy();
            }
            // if (chartType === 'radar') {
                chartData.datasets.forEach(function (dataset) {
                    dataset.fillColor = 'transparent';
                });
            // }
            
            var thisChart = new Chart(document.getElementById(type + '-chart').getContext('2d'));
            switch (chartType) {
                case 'bar':
                    chartObj = thisChart.Bar(chartData);
                    break;
                case 'line':
                    chartObj = thisChart.Line(chartData);
                    break;
                case 'radar':
                    chartObj = thisChart.Radar(chartData);
                    break;
            }
            chartMapping[type].chart = chartObj;
        });
    }
});
