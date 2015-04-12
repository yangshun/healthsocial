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

    $scope.dateRange = moment().subtract(28, 'days').format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY');
    setTimeout(function () {
        $('input[name="daterange"]').daterangepicker({
            format: 'DD/MM/YYYY',
            minDate: '01/01/2015',
            maxDate: moment()
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
    
});

var barChart;
var lineChart;

function draw (selectedUsers, startDate, endDate, granularity) {
    if (!selectedUsers || selectedUsers.length === 0) {
        return;
    }
    console.log(selectedUsers);
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

    var chartData = {
        labels: selectedUsers[0].sleep_log.slice(startIndex, endIndex+1).map(function (dataPoint) {
            return dataPoint.date;
        }),
        datasets: []
    };

    selectedUsers.forEach(function (user) {
        chartData.datasets.push({
            fillColor: user.color,
            strokeColor: user.color,
            pointColor: user.color,
            pointStrokeColor: '#fff',
            data: user.sleep_log.slice(startIndex, endIndex+1).map(function (dataPoint) {
                return dataPoint.minutes;
            })
        });
    });

    if (barChart) {
        barChart.destroy();
    }
    barChart = new Chart(document.getElementById("bar-chart-js").getContext("2d")).Bar(chartData);

    if (lineChart) {
        lineChart.destroy();
    }
    chartData.datasets.forEach(function (dataset) {
        dataset.fillColor = 'transparent';
    })
    lineChart = new Chart(document.getElementById("line-chart-js").getContext("2d")).Line(chartData);


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
