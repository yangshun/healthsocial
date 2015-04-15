'use strict';

var CHART_COLORS = ['#A9D86E', '#FF6C60', '#FCB322', '#cb6077', '#7bbda4', '#d28b71', '#8ab3b5', '#f4bc87', '#a89bb9', '#beb55b', '#bb9584', 
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

    function getCSVFormat (selectedUsers) {
        var csvData = [];
        var header = ['Name', 'Date', 'Sleep', 'Activity', 'Weight'];
        csvData.push(header);

        selectedUsers.forEach(function (user) {
            var len = user.sleep_log.length;
            for (var i = 0; i < len; i++) {
                var row = [user.name];
                row.push(user.sleep_log[i].date);
                row.push(user.sleep_log[i].minutes);
                row.push(user.activity_log[i].calories);
                row.push(user.weight_log[i].kilograms);
                csvData.push(row);
            }
        });

        var str = '';
     
        for (var i = 0; i < csvData.length; i++) {
            var line = '';
            for (var index in csvData[i]) {
                if (line != '') line += ','
                line += csvData[i][index];
            }
     
            str += line + '\r\n';
        }
        return str;
    }

    function getJSONFormat (selectedUsers) {
        selectedUsers.forEach(function (user) {
            ['sleep', 'activity', 'weight'].forEach(function (type) {
                user[type + '_log'].forEach(function (dataPoint) {
                    delete dataPoint._id;
                });
            });
        });
        return JSON.stringify(selectedUsers);
    }

    $scope.downloadData = function (format) {
        var data = $scope.selectedUsers.slice();
        switch (format) {
            case 'json':
                data = getJSONFormat(data);
                break;
            case 'csv':
            default:
                data = getCSVFormat(data);
                break;
        }
        var popup = window.open('data:text/json;charset=utf-8,' + encodeURIComponent(data));
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
    var sleepActivityChart;
    var activityWeightChart;
    var sleepWeightChart;

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
        },
        sleepactivity: {
            chart: sleepActivityChart
        },
        activityweight: {
            chart: activityWeightChart
        },
        sleepweight: {
            chart: sleepWeightChart
        }
    };

    var typeValueMapping = {
        sleep: {
            unit: 'minutes',
            color: '#A9D86E'
        },
        activity: {
            unit: 'calories',
            color: '#FF6C60'
        },
        weight: {
            unit: 'kilograms',
            color: '#FCB322'
        }
    };

    $scope.typeValueMapping = typeValueMapping;

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

        var data = selectedUsers[0]['sleep_log'].slice(startIndex, endIndex+1);
            
        if (granularity === 'week') {
            data = data.filter(function (dataPoint, index) {
                return index % 7 === 0;
            });
        }

        var labels = data.map(function (dataPoint) {
            return dataPoint.date;
        });

        ['sleep', 'activity', 'weight'].forEach(function (type) {

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

            chartData.datasets.forEach(function (dataset) {
                dataset.fillColor = 'transparent';
            });
            
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

        if (selectedUsers.length === 1) {
            [['sleep', 'activity'], 
            ['activity', 'weight'], 
            ['sleep', 'weight']].forEach(function (pairs) {

                var chartData = {
                    labels: labels,
                    datasets: []
                };

                pairs.forEach(function (type) {
                    var dataSet = selectedUsers[0][type + '_log'].slice(startIndex, endIndex+1).map(function (dataPoint) {
                        return dataPoint[chartMapping[type].unit];
                    });

                    var plottingData = dataSet;
                    if (granularity === 'week') {
                        plottingData = dataSet.filter(function (dataPoint, index) {
                            return index % 7 === 0;
                        });
                    }
                    var max = Math.max.apply(null, plottingData);
                    chartData.datasets.push({
                        fillColor: typeValueMapping[type].color,
                        strokeColor: typeValueMapping[type].color,
                        pointColor: typeValueMapping[type].color,
                        pointStrokeColor: '#fff',
                        data: plottingData.map(function (dataPoint) {
                            return parseInt(dataPoint/max * 100)/100;
                        })
                    });
                });
                
                var combinedType = pairs[0] + pairs[1];
                var chartObj = chartMapping[combinedType].chart;
            
                if (chartObj) {
                    chartObj.destroy();
                }

                chartData.datasets.forEach(function (dataset) {
                    dataset.fillColor = 'transparent';
                });
                
                var thisChart = new Chart(document.getElementById(combinedType + '-chart').getContext('2d'));
                var config = { scaleBeginAtZero: false };
                switch (chartType) {
                    case 'bar':
                        chartObj = thisChart.Bar(chartData, config);
                        break;
                    case 'line':
                        chartObj = thisChart.Line(chartData, config);
                        break;
                    case 'radar':
                        chartObj = thisChart.Radar(chartData, config);
                        break;
                }
                chartMapping[combinedType].chart = chartObj;

            });
        }
    }
});
