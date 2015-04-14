'use strict';

var CHART_COLORS = ['#cb6077', '#d28b71', '#f4bc87', '#beb55b', '#7bbda4', '#8ab3b5', '#a89bb9', '#bb9584', 
                    '#210b10', '#341a10', '#723d0a', '#131207', '#13261f', '#192727', '#292332', '#291c17'];

angular.module('healthsocialDevApp')
  .controller('AnalyticsCtrl', function ($scope, Auth) {
    $scope.selectedUsers = [];
    $scope.granularity = 'day';

    Auth.getAllUsers().then(function (data) {
      $scope.users = data;
      setTimeout(draw, 0);
    });

    $scope.$watchCollection('selectedUsers', function () {
        if (!$scope.selectedUsers) {
            return;
        }

        var index = 0;
        $scope.selectedUsers.forEach(function (user) {
            user.color = CHART_COLORS[index];
            index++;
        });

        updateCharts();        
    });

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
        var startDate = $scope.dateRange.split(' - ')[0];
        var endDate = $scope.dateRange.split(' - ')[1];
        draw($scope.selectedUsers, startDate, endDate, $scope.granularity);
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

    function draw (selectedUsers, startDate, endDate, granularity) {
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
            var chartData = {
                labels: selectedUsers[0][type + '_log'].slice(startIndex, endIndex+1).map(function (dataPoint) {
                    return dataPoint.date;
                }),
                datasets: []
            };

            selectedUsers.forEach(function (user) {
                var dataSet = user[type + '_log'].slice(startIndex, endIndex+1).map(function (dataPoint) {
                    return dataPoint[chartMapping[type].unit];
                });
                chartData.datasets.push({
                    fillColor: user.color,
                    strokeColor: user.color,
                    pointColor: user.color,
                    pointStrokeColor: '#fff',
                    data: dataSet
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
            var chart = chartMapping[type].chart;

            if (chart) {
                chart.destroy();
            }
            chartData.datasets.forEach(function (dataset) {
                dataset.fillColor = 'transparent';
            });
            chartMapping[type].chart = new Chart(document.getElementById(type + '-chart').getContext('2d')).Line(chartData);
        });

        var pieData = [
            {
                value: 30,
                color:"#E67A77"
            },
            {
                value : 50,
                color : "#D9DD81"
            },
            {
                value : 100,
                color : "#79D1CF"
            }

        ];

        var myPie = new Chart(document.getElementById("pie-chart-js").getContext("2d")).Pie(pieData);

        var donutData = [
            {
                value: 30,
                color:"#E67A77"
            },
            {
                value : 50,
                color : "#D9DD81"
            },
            {
                value : 100,
                color : "#79D1CF"
            },
            {
                value : 40,
                color : "#95D7BB"
            },
            {
                value : 120,
                color : "#4D5360"
            }

        ]
        var myDonut = new Chart(document.getElementById("donut-chart-js").getContext("2d")).Doughnut(donutData);
    }

});
