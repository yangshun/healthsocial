'use strict';

var CHART_COLORS = ['#cb6077', '#d28b71', '#f4bc87', '#beb55b', '#7bbda4', '#8ab3b5', '#a89bb9', '#bb9584', 
                    '#210b10', '#341a10', '#723d0a', '#131207', '#13261f', '#192727', '#292332', '#291c17'];

angular.module('healthsocialDevApp')
  .controller('AnalyticsCtrl', function ($scope, Auth) {
    $scope.selectedUsers = [];

    Auth.getAllUsers().then(function (data) {
      $scope.users = data;
      setTimeout(draw, 0);
    });

    Chart.defaults.global.responsive = true;

    $scope.$watchCollection('selectedUsers', function () {
        if (!$scope.selectedUsers) {
            return;
        }

        var index = 0;
        $scope.selectedUsers.forEach(function (user) {
            user.color = CHART_COLORS[index];
            index++;
        });

        draw($scope.selectedUsers);
    });
});

var myLine;

function draw (selectedUsers) {
    if (!selectedUsers) {
        return;
    }

    var barChartData = {
        labels: ["January", "February", "March", "April"],
        datasets: []
    };

    selectedUsers.forEach(function (user) {
        barChartData.datasets.push({
            fillColor: user.color,
            strokeColor: user.color,
            data: user.sleep_log.slice(0, 4).map(function (dataPoint) {
                return dataPoint.minutes;
            })
        });
    });

    var barChartCanvas = document.getElementById("bar-chart-js");
    barChartCanvas.getContext("2d").clearRect(0, 0, barChartCanvas.width, barChartCanvas.height);

    if (myLine) {
        myLine.destroy();
    }
    myLine = new Chart(barChartCanvas.getContext("2d")).Bar(barChartData);

    var Linedata = {
        labels : ["January","February","March","April","May","June","July"],
        datasets : [
            {
                fillColor : "#E67A77",
                strokeColor : "#E67A77",
                pointColor : "#E67A77",
                pointStrokeColor : "#fff",
                data : [100,159,190,281,156,155,140]
            },
            {
                fillColor : "#79D1CF",
                strokeColor : "#79D1CF",
                pointColor : "#79D1CF",
                pointStrokeColor : "#fff",
                data : [65,59,90,181,56,55,40]
            },
            {
                fillColor : "#D9DD81",
                strokeColor : "#D9DD81",
                pointColor : "#D9DD81",
                pointStrokeColor : "#fff",
                data : [28,48,40,19,96,27,100]
            }

        ]
    };
    var myLineChart = new Chart(document.getElementById("line-chart-js").getContext("2d")).Line(Linedata, {
        legendTemplate : '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
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
