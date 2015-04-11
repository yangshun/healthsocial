'use strict';

angular.module('healthsocialDevApp')
  .controller('DashboardCtrl', function ($scope, $http, socket) {
 
    $scope.weatherData = [];
    var day = moment();

    $http.get('/weather').success(function (data) {
      
      var weatherDay = ['Today', 'Tomorrow', day.weekday(2).format('ddd'), day.weekday(3).format('ddd'), day.weekday(4).format('ddd'), day.weekday(5).format('ddd'), day.weekday(6).format('ddd')];
      var weatherColors = ['muted', 'primary', 'danger', 'info', 'success', 'warning', 'muted'];
      $scope.weatherData = data;

      $scope.weatherData.forEach(function (day, index) {
        day.color = weatherColors[index];
        day.dayName = weatherDay[index];
      }); 
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    setTimeout(function () {
      dashboard();
    }, 0);
  });


function dashboard () {
  (function ($) {
    "use strict";
    $(document).ready(function () {
      if ($.fn.plot) {

        var d1 = [
        [0, 10],
        [1, 20],
        [2, 33],
        [3, 24],
        [4, 45],
        [5, 96],
        [6, 47],
        [7, 18],
        [8, 11],
        [9, 13],
        [10, 21]];

        var data = ([{
          label: "Too",
          data: d1,
          lines: {
            show: true,
            fill: true,
            lineWidth: 2,
            fillColor: {
              colors: ["rgba(255,255,255,.1)", "rgba(160,220,220,.8)"]
            }
          }
        }]);

        var options = {
          grid: {
            backgroundColor: {
              colors: ["#fff", "#fff"]
            },
            borderWidth: 0,
            borderColor: "#f0f0f0",
            margin: 0,
            minBorderMargin: 0,
            labelMargin: 20,
            hoverable: true,
            clickable: true
          },
          // Tooltip
          tooltip: true,
          tooltipOpts: {
            content: "%s X: %x Y: %y",
            shifts: {
              x: -60,
              y: 25
            },
            defaultTheme: false
          },

          legend: {
            labelBoxBorderColor: "#ccc",
            show: false,
            noColumns: 0
          },
          series: {
            stack: true,
            shadowSize: 0,
            highlightColor: 'rgba(30,120,120,.5)'

          },
          xaxis: {
            tickLength: 0,
            tickDecimals: 0,
            show: true,
            min: 2,

            font: {

              style: "normal",


              color: "#666666"
            }
          },
          yaxis: {
            ticks: 3,
            tickDecimals: 0,
            show: true,
            tickColor: "#f0f0f0",
            font: {

              style: "normal",


              color: "#666666"
            }
          },
          //        lines: {
          //            show: true,
          //            fill: true
          //
          //        },
          points: {
            show: true,
            radius: 2,
            symbol: "circle"
          },
          colors: ["#87cfcb", "#48a9a7"]
        };
        // var plot = $.plot($("#daily-visit-chart"), data, options);

        // DONUT
        var dataPie = [{
          label: "Samsung",
          data: 50
        }, {
          label: "Nokia",
          data: 50
        }, {
          label: "Syphony",
          data: 100
        }];

        // $.plot($(".sm-pie"), dataPie, {
        //     series: {
        //         pie: {
        //             innerRadius: 0.7,
        //             show: true,
        //             stroke: {
        //                 width: 0.1,
        //                 color: '#ffffff'
        //             }
        //         }

        //     },

        //     legend: {
        //         show: true
        //     },
        //     grid: {
        //         hoverable: true,
        //         clickable: true
        //     },

        //     colors: ["#ffdf7c", "#b2def7", "#efb3e6"]
        // });
      }

      /*==Slim Scroll ==*/
      if ($.fn.slimScroll) {
        $('.event-list').slimscroll({
          height: '305px',
          wheelStep: 20
        });
        $('.conversation-list').slimscroll({
          height: '360px',
          wheelStep: 35
        });
        $('.to-do-list').slimscroll({
          height: '300px',
          wheelStep: 35
        });
      }

      /*==Easy Pie chart ==*/
      if ($.fn.easyPieChart) {
        $('.epie-chart').easyPieChart({
          onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: "#f8a20f",
          lineWidth: 5,
          size:80,
          trackColor: "#efefef",
          scaleColor:"#cccccc"

        });

      }

      if (Morris && Morris.EventEmitter) {
        // Use Morris.Area instead of Morris.Line
        Morris.Area({
          element: 'graph-area',
          padding: 10,
          behaveLikeLine: true,
          gridEnabled: false,
          gridLineColor: '#dddddd',
          axes: true,
          fillOpacity: .7,
          data: [{
            period: '2010 Q1',
            iphone: 10,
            ipad: 10,
            itouch: 10
          }, {
            period: '2010 Q2',
            iphone: 1778,
            ipad: 7294,
            itouch: 18441
          }, {
            period: '2010 Q3',
            iphone: 4912,
            ipad: 12969,
            itouch: 3501
          }, {
            period: '2010 Q4',
            iphone: 3767,
            ipad: 3597,
            itouch: 5689
          }, {
            period: '2011 Q1',
            iphone: 6810,
            ipad: 1914,
            itouch: 2293
          }, {
            period: '2011 Q2',
            iphone: 5670,
            ipad: 4293,
            itouch: 1881
          }, {
            period: '2011 Q3',
            iphone: 4820,
            ipad: 3795,
            itouch: 1588
          }, {
            period: '2011 Q4',
            iphone: 25073,
            ipad: 5967,
            itouch: 5175
          }, {
            period: '2012 Q1',
            iphone: 10687,
            ipad: 34460,
            itouch: 22028
          }, {
            period: '2012 Q2',
            iphone: 1000,
            ipad: 5713,
            itouch: 1791
          }


          ],
          lineColors: ['#ED5D5D', '#D6D23A', '#32D2C9'],
          xkey: 'period',
          ykeys: ['iphone', 'ipad', 'itouch'],
          labels: ['iPhone', 'iPad', 'iPod Touch'],
          pointSize: 0,
          lineWidth: 0,
          hideHover: 'auto'

        });
      }


      //Jquery vector map
      if ($.fn.vectorMap) {
        var cityAreaData = [
        500.70,
        410.16,
        210.69,
        120.17,
        64.31,
        150.35,
        130.22,
        120.71,
        300.32
        ]
        $('#world-map').vectorMap({
          map: 'us_lcc_en',
          scaleColors: ['#C8EEFF', '#0071A4'],
          normalizeFunction: 'polynomial',
          focusOn: {
            x: 5,
            y: 1,
            scale: 1
          },
          zoomOnScroll: false,
          zoomMin: 0.85,
          hoverColor: false,
          regionStyle: {
            initial: {
              fill: '#ededed',
              "fill-opacity": 1,
              stroke: '#a5ded9',
              "stroke-width": 0,
              "stroke-opacity": 0
            },
            hover: {
              "fill-opacity": 0.8
            }
          },
          markerStyle: {
            initial: {
              fill: '#e68c71',
              stroke: 'rgba(230,140,110,.8)',
              "fill-opacity": 1,
              "stroke-width": 9,
              "stroke-opacity": 0.5,
              r: 3
            },
            hover: {
              stroke: 'black',
              "stroke-width": 2
            },
            selected: {
              fill: 'blue'
            },
            selectedHover: {}
          },
          backgroundColor: '#ffffff',
          markers: [

          {
            latLng: [35.85, -77.88],
            name: 'Rocky Mt,NC'
          }, {
            latLng: [32.90, -97.03],
            name: 'Dallas/FW,TX'
          }, {
            latLng: [39.37, -75.07],
            name: 'Millville,NJ'
          }

          ],
          series: {
            markers: [{
              attribute: 'r',
              scale: [3, 7],
              values: cityAreaData
            }]
          }
        });
      }

      $(document).on('click', '.event-close', function () {
        $(this).closest("li").remove();
        return false;
      });

      $('.progress-stat-bar li').each(function () {
        $(this).find('.progress-stat-percent').animate({
          height: $(this).attr('data-percent')
        }, 1000);
      });

      $('.todo-check label').click(function () {
        $(this).parents('li').children('.todo-title').toggleClass('line-through');
      });


      $(document).on('click', '.todo-remove', function () {
        $(this).closest("li").remove();
        return false;
      });


      $('.stat-tab .stat-btn').click(function () {

        $(this).addClass('active');
        $(this).siblings('.btn').removeClass('active');

      });

      // $('select.styled').customSelect();
      // $("#sortable-todo").sortable();

      /*Calendar*/
      $(function () {
        $('.evnt-input').keypress(function (e) {
          var p = e.which;
          var inText = $('.evnt-input').val();
          if (p == 13) {
            if (inText == "") {
              alert('Empty Field');
            } else {
              $('<li>' + inText + '<a href="#" class="event-close"> <i class="ico-close2"></i> </a> </li>').appendTo('.event-list');
            }
            $(this).val('');
            $('.event-list').scrollTo('100%', '100%', {
              easing: 'swing'
            });
            return false;
            e.epreventDefault();
            e.stopPropagation();
          }
        });
      });


      /*Chat*/
      $(function () {
        $('.chat-input').keypress(function (ev) {
          var p = ev.which;
          var chatTime = moment().format("h:mm");
          var chatText = $('.chat-input').val();
          if (p == 13) {
            if (chatText == "") {
              alert('Empty Field');
            } else {
              $('<li class="clearfix"><div class="chat-avatar"><img src="images/chat-user-thumb.png" alt="male"><i>' + chatTime + '</i></div><div class="conversation-text"><div class="ctext-wrap"><i>John Carry</i><p>' + chatText + '</p></div></div></li>').appendTo('.conversation-list');
            }
            $(this).val('');
            $('.conversation-list').scrollTo('100%', '100%', {
              easing: 'swing'
            });
            return false;
            ev.epreventDefault();
            ev.stopPropagation();
          }
        });


        $('.chat-send .btn').click(function () {
          var chatTime = moment().format("h:mm");
          var chatText = $('.chat-input').val();
          if (chatText == "") {
            alert('Empty Field');
            $(".chat-input").focus();
          } else {
            $('<li class="clearfix"><div class="chat-avatar"><img src="images/chat-user-thumb.png" alt="male"><i>' + chatTime + '</i></div><div class="conversation-text"><div class="ctext-wrap"><i>John Carry</i><p>' + chatText + '</p></div></div></li>').appendTo('.conversation-list');
            $('.chat-input').val('');
            $(".chat-input").focus();
            $('.conversation-list').scrollTo('100%', '100%', {
              easing: 'swing'
            });
          }
        });
      });
    });
  })(jQuery);

  if (Gauge) {
    /*Knob*/
    var opts = {
        lines: 12, // The number of lines to draw
        angle: 0, // The length of each line
        lineWidth: 0.48, // The line thickness
        pointer: {
            length: 0.6, // The radius of the inner circle
            strokeWidth: 0.03, // The rotation offset
            color: '#464646' // Fill color
          },
        limitMax: 'true', // If true, the pointer will not go past the end of the gauge
        colorStart: '#fa8564', // Colors
        colorStop: '#fa8564', // just experiment with them
        strokeColor: '#F1F1F1', // to see which ones work best for you
        generateGradient: true
      };


    var target = document.getElementById('gauge'); // your canvas element
    var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    gauge.maxValue = 3000; // set max gauge value
    gauge.animationSpeed = 32; // set animation speed (32 is default value)
    gauge.set(1150); // set actual value
    gauge.setTextField(document.getElementById("gauge-textfield"));

  }

  if (Skycons) {
    /*==Weather==*/
    var skycons = new Skycons({
      "color": "#aec785"
    });
    // on Android, a nasty hack is needed: {"resizeClear": true}
    // you can add a canvas by it's ID...
    skycons.add("icon1", Skycons.RAIN);
    // start animation!
    skycons.play();
    // you can also halt animation with skycons.pause()
    // want to change the icon? no problem:
    skycons.set("icon1", Skycons.RAIN);

  }
  (function ($) {

    $(document).ready(function () {

      /*==Slim Scroll ==*/
      if ($.fn.slimScroll) {
        $('.event-list').slimscroll({
          height: '305px',
          wheelStep: 20
        });
        $('.conversation-list').slimscroll({
          height: '360px',
          wheelStep: 35
        });
        $('.to-do-list').slimscroll({
          height: '300px',
          wheelStep: 35
        });
      }
      

      /*==Easy Pie chart ==*/
      if ($.fn.easyPieChart) {

        $('.notification-pie-chart').easyPieChart({
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: "#39b6ac",
          lineWidth: 3,
          size: 50,
          trackColor: "#efefef",
          scaleColor: "#cccccc"

        });

        $('.pc-epie-chart').easyPieChart({
          onStep: function(from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: "#5bc6f0",
          lineWidth: 3,
          size:50,
          trackColor: "#32323a",
          scaleColor:"#cccccc"

        });

      }

      /*== SPARKLINE==*/
      if ($.fn.sparkline) {

        $(".d-pending").sparkline([3, 1], {
          type: 'pie',
          width: '40',
          height: '40',
          sliceColors: ['#e1e1e1', '#8175c9']
        });



        var sparkLine = function () {
          $(".sparkline").each(function () {
            var $data = $(this).data();
            ($data.type == 'pie') && $data.sliceColors && ($data.sliceColors = eval($data.sliceColors));
            ($data.type == 'bar') && $data.stackedBarColor && ($data.stackedBarColor = eval($data.stackedBarColor));

            $data.valueSpots = {
              '0:': $data.spotColor
            };
            $(this).sparkline($data.data || "html", $data);


            if ($(this).data("compositeData")) {
              $spdata.composite = true;
              $spdata.minSpotColor = false;
              $spdata.maxSpotColor = false;
              $spdata.valueSpots = {
                '0:': $spdata.spotColor
              };
              $(this).sparkline($(this).data("compositeData"), $spdata);
            };
          });
        };

        var sparkResize;
        $(window).resize(function (e) {
          clearTimeout(sparkResize);
          sparkResize = setTimeout(function () {
            sparkLine(true)
          }, 500);
        });
        sparkLine(false);
      }

      // if ($.fn.plot) {
      //     var datatPie = [30, 50];
      //     // DONUT
      //     $.plot($(".target-sell"), datatPie, {
      //         series: {
      //             pie: {
      //                 innerRadius: 0.6,
      //                 show: true,
      //                 label: {
      //                     show: false

      //                 },
      //                 stroke: {
      //                     width: .01,
      //                     color: '#fff'
      //                 }
      //             }
      //         },

      //         legend: {
      //             show: true
      //         },
      //         grid: {
      //             hoverable: true,
      //             clickable: true
      //         },

      //         colors: ["#ff6d60", "#cbcdd9"]
      //     });
      // }

      /*==Collapsible==*/
      $('.widget-head').click(function (e) {
        var widgetElem = $(this).children('.widget-collapse').children('i');

        $(this)
        .next('.widget-container')
        .slideToggle('slow');
        if ($(widgetElem).hasClass('ico-minus')) {
          $(widgetElem).removeClass('ico-minus');
          $(widgetElem).addClass('ico-plus');
        } else {
          $(widgetElem).removeClass('ico-plus');
          $(widgetElem).addClass('ico-minus');
        }
        e.preventDefault();
      });

      var calendars = {};

      // assuming you've got the appropriate language files,
      // clndr will respect whatever moment's language is set to.
      // moment.lang('ru');

      // here's some magic to make sure the dates are happening this month.
      var thisMonth = moment().format('YYYY-MM');

      var eventArray = [
      { startDate: thisMonth + '-10', endDate: thisMonth + '-14', title: 'Multi-Day Event' },
      { startDate: thisMonth + '-21', endDate: thisMonth + '-23', title: 'Another Multi-Day Event' }
      ];

      // the order of the click handlers is predictable.
      // direct click action callbacks come first: click, nextMonth, previousMonth, nextYear, previousYear, or today.
      // then onMonthChange (if the month changed).
      // finally onYearChange (if the year changed).

      calendars.clndr1 = $('.cal1').clndr({
        events: eventArray,
        // constraints: {
        //   startDate: '2013-11-01',
        //   endDate: '2013-11-15'
        // },
        clickEvents: {
          click: function(target) {
            console.log(target);
              // if you turn the `constraints` option on, try this out:
              // if($(target.element).hasClass('inactive')) {
              //   console.log('not a valid datepicker date.');
              // } else {
              //   console.log('VALID datepicker date.');
              // }
          },
          nextMonth: function() {
            console.log('next month.');
          },
          previousMonth: function() {
            console.log('previous month.');
          },
          onMonthChange: function() {
            console.log('month changed.');
          },
          nextYear: function() {
            console.log('next year.');
          },
          previousYear: function() {
            console.log('previous year.');
          },
          onYearChange: function() {
            console.log('year changed.');
          }
        },
        multiDayEvents: {
          startDate: 'startDate',
          endDate: 'endDate'
        },
        showAdjacentMonths: true,
        adjacentDaysChangeMonth: false
      });

      calendars.clndr2 = $('.cal2').clndr({
        template: $('#template-calendar').html(),
        events: eventArray,
        startWithMonth: moment().add('month', 1),
        clickEvents: {
          click: function(target) {
            console.log(target);
          }
        },
        forceSixRows: true
      });

      // bind both clndrs to the left and right arrow keys
      $(document).keydown( function(e) {
        if(e.keyCode == 37) {
          // left arrow
          calendars.clndr1.back();
          calendars.clndr2.back();
        }
        if(e.keyCode == 39) {
          // right arrow
          calendars.clndr1.forward();
          calendars.clndr2.forward();
        }
      });
    });


    var data7_1 = [
    [1354586000000, 253],
    [1354587000000, 465],
    [1354588000000, 498],
    [1354589000000, 383],
    [1354590000000, 280],
    [1354591000000, 108],
    [1354592000000, 120],
    [1354593000000, 474],
    [1354594000000, 623],
    [1354595000000, 479],
    [1354596000000, 788],
    [1354597000000, 836]
    ];

    var data7_2 = [
    [1354586000000, 253],
    [1354587000000, 465],
    [1354588000000, 498],
    [1354589000000, 383],
    [1354590000000, 280],
    [1354591000000, 108],
    [1354592000000, 120],
    [1354593000000, 474],
    [1354594000000, 623],
    [1354595000000, 479],
    [1354596000000, 788],
    [1354597000000, 836]
    ];
    // $(function() {
    //     $.plot($("#visitors-chart #visitors-container"), [{
    //         data: data7_1,
    //         label: "Page View",
    //         lines: {
    //             fill: true
    //         }
    //     }, {
    //         data: data7_2,
    //         label: "Online User",

    //         points: {
    //             show: true
    //         },
    //         lines: {
    //             show: true
    //         },
    //         yaxis: 2
    //     }
    //     ],
    //         {
    //             series: {
    //                 lines: {
    //                     show: true,
    //                     fill: false
    //                 },
    //                 points: {
    //                     show: true,
    //                     lineWidth: 2,
    //                     fill: true,
    //                     fillColor: "#ffffff",
    //                     symbol: "circle",
    //                     radius: 5
    //                 },
    //                 shadowSize: 0
    //             },
    //             grid: {
    //                 hoverable: true,
    //                 clickable: true,
    //                 tickColor: "#f9f9f9",
    //                 borderWidth: 1,
    //                 borderColor: "#eeeeee"
    //             },
    //             colors: ["#79D1CF", "#E67A77"],
    //             tooltip: true,
    //             tooltipOpts: {
    //                 defaultTheme: false
    //             },
    //             xaxis: {
    //                 mode: "time"


    //             },
    //             yaxes: [{
    //                 /* First y axis */
    //             }, {
    //                 /* Second y axis */
    //                 position: "right" /* left or right */
    //             }]
    //         }
    //     );
    // });

    $(function() {
      var data1 = [];
      var totalPoints = 300;
      function GetData() {
        data1.shift();
        while (data1.length < totalPoints) {
          var prev = data1.length > 0 ? data1[data1.length - 1] : 50;
          var y = prev + Math.random() * 10 - 5;
          y = y < 0 ? 0 : (y > 100 ? 100 : y);
          data1.push(y);
        }
        var result = [];
        for (var i = 0; i < data1.length; ++i) {
          result.push([i, data1[i]])
        }
        return result;
      }
      // var updateInterval = 100;
      // var plot = $.plot($("#reatltime-chart #reatltime-chartContainer"), [
      //         GetData()], {
      //         series: {
      //             lines: {
      //                 show: true,
      //                 fill: true
      //             },
      //             shadowSize: 0
      //         },
      //         yaxis: {
      //             min: 0,
      //             max: 100,
      //             ticks: 10
      //         },
      //         xaxis: {
      //             show: false
      //         },
      //         grid: {
      //             hoverable: true,
      //             clickable: true,
      //             tickColor: "#f9f9f9",
      //             borderWidth: 1,
      //             borderColor: "#eeeeee"
      //         },
      //         colors: ["#79D1CF"],
      //         tooltip: true,
      //         tooltipOpts: {
      //             defaultTheme: false
      //         }
      //     });
      //     function update() {
      //         plot.setData([GetData()]);
      //         plot.draw();
      //         setTimeout(update, updateInterval);
      //     }
      //     update();
      // });

      // $(function() {
      //     var data = [{
      //         label: "Paid Signup",
      //         data: 60
      //     }, {
      //         label: "Free Signup",
      //         data: 30
      //     }, {
      //         label: "Guest Signup",
      //         data: 10
      //     }];
      //     var options = {
      //         series: {
      //             pie: {
      //                 show: true
      //             }
      //         },
      //         legend: {
      //             show: true
      //         },
      //         grid: {
      //             hoverable: true,
      //             clickable: true
      //         },
      //         colors: ["#79D1CF", "#D9DD81", "#E67A77"],
      //         tooltip: true,
      //         tooltipOpts: {
      //             defaultTheme: false
      //         }
      //     };
      //     $.plot($("#pie-chart #pie-chartContainer"), data, options);
      // });

      // $(function() {
      //     var data = [{
      //         label: "Premium Member",
      //         data: 40
      //     }, {
      //         label: "Gold Member",
      //         data: 20
      //     }, {
      //         label: "Platinum Member",
      //         data: 10
      //     }, {
      //         label: "Silver Member",
      //         data: 30
      //     }];
      //     var options = {
      //         series: {
      //             pie: {
      //                 show: true,
      //                 innerRadius: 0.5
      //             }
      //         },
      //         legend: {
      //             show: true
      //         },
      //         grid: {
      //             hoverable: true,
      //             clickable: true
      //         },
      //         colors: ["#79D1CF", "#D9DD81", "#E67A77","#9972B5"],
      //         tooltip: true,
      //         tooltipOpts: {
      //             defaultTheme: false
      //         }
      //     };
      //     $.plot($("#pie-chart-donut #pie-donutContainer"), data, options);
      // });

      // $(function() {
      //     var data24Hours = [
      //         [0, 601],
      //         [1, 520],
      //         [2, 337],
      //         [3, 261],
      //         [4, 157],
      //         [5, 78],
      //         [6, 58],
      //         [7, 48],
      //         [8, 54],
      //         [9, 38],
      //         [10, 88],
      //         [11, 214],
      //         [12, 364],
      //         [13, 449],
      //         [14, 558],
      //         [15, 282],
      //         [16, 379],
      //         [17, 429],
      //         [18, 518],
      //         [19, 470],
      //         [20, 330],
      //         [21, 245],
      //         [22, 358],
      //         [23, 74]
      //     ];
      //     var data48Hours = [
      //         [0, 445],
      //         [1, 592],
      //         [2, 738],
      //         [3, 532],
      //         [4, 234],
      //         [5, 143],
      //         [6, 147],
      //         [7, 63],
      //         [8, 64],
      //         [9, 43],
      //         [10, 86],
      //         [11, 201],
      //         [12, 315],
      //         [13, 397],
      //         [14, 512],
      //         [15, 281],
      //         [16, 360],
      //         [17, 479],
      //         [18, 425],
      //         [19, 453],
      //         [20, 422],
      //         [21, 355],
      //         [22, 340],
      //         [23, 801]
      //     ];
      //     var dataDifference = [
      //         [23, 727],
      //         [22, 18],
      //         [21, 110],
      //         [20, 92],
      //         [19, 17],
      //         [18, 93],
      //         [17, 50],
      //         [16, 19],
      //         [15, 1],
      //         [14, 46],
      //         [13, 52],
      //         [12, 49],
      //         [11, 13],
      //         [10, 2],
      //         [9, 5],
      //         [8, 10],
      //         [7, 15],
      //         [6, 89],
      //         [5, 65],
      //         [4, 77],
      //         [3, 271],
      //         [2, 401],
      //         [1, 72],
      //         [0, 156]
      //     ];
      //     var ticks = [
      //         [0, "22h"],
      //         [1, ""],
      //         [2, "00h"],
      //         [3, ""],
      //         [4, "02h"],
      //         [5, ""],
      //         [6, "04h"],
      //         [7, ""],
      //         [8, "06h"],
      //         [9, ""],
      //         [10, "08h"],
      //         [11, ""],
      //         [12, "10h"],
      //         [13, ""],
      //         [14, "12h"],
      //         [15, ""],
      //         [16, "14h"],
      //         [17, ""],
      //         [18, "16h"],
      //         [19, ""],
      //         [20, "18h"],
      //         [21, ""],
      //         [22, "20h"],
      //         [23, ""]
      //     ];
      //     var data = [{
      //         label: "Last 24 Hours",
      //         data: data24Hours,
      //         lines: {
      //             show: true,
      //             fill: true
      //         },
      //         points: {
      //             show: true
      //         }
      //     }, {
      //         label: "Last 48 Hours",
      //         data: data48Hours,
      //         lines: {
      //             show: true
      //         },
      //         points: {
      //             show: true
      //         }
      //     }, {
      //         label: "Difference",
      //         data: dataDifference,
      //         bars: {
      //             show: true
      //         }
      //     }];
      //     var options = {
      //         xaxis: {
      //             ticks: ticks
      //         },
      //         series: {
      //             shadowSize: 0
      //         },
      //         grid: {
      //             hoverable: true,
      //             clickable: true,
      //             tickColor: "#f9f9f9",
      //             borderWidth: 1,
      //             borderColor: "#eeeeee"
      //         },
      //         colors: ["#79D1CF", "#E67A77"],
      //         tooltip: true,
      //         tooltipOpts: {
      //             defaultTheme: false
      //         },
      //         legend: {
      //             labelBoxBorderColor: "#000000",
      // container: $("#legendcontainer26"),
      //             noColumns: 0
      //         }
      //     };
      //     var plot = $.plot($("#combine-chart #combine-chartContainer"),
      //             data, options);
      // });

      $(function() {
          var data1 = GenerateSeries(0);
          var data2 = GenerateSeries(100);
          var data3 = GenerateSeries(200);
          var dataset = [data1, data2, data3];
          function GenerateSeries(added) {
              var data = [];
              var start = 100 + added;
              var end = 200 + added;
              for (var i = 1; i <= 100; i++) {
                  var d = Math.floor(Math.random() * (end - start + 1) + start);
                  data.push([i, d]);
                  start++;
                  end++;
              }
              return data;
          }

          var options = {
              series: {
                  stack: true,
                  shadowSize: 0
              },
              grid: {
                  hoverable: true,
                  clickable: true,
                  tickColor: "#f9f9f9",
                  borderWidth: 1,
                  borderColor: "#eeeeee"
              },
              legend: {
                  position: 'nw',
                  labelBoxBorderColor: "#000000",
          container: $("#bar-chart #legendPlaceholder20"),
                  noColumns: 0
              }
          };

          var plot;
          function ToggleSeries() {
            var d = [];
            $("#toggle-chart input[type='checkbox']").each(function() {
              if ($(this).is(":checked")) {
                var seqence = $(this).attr("id").replace("cbdata", "");
                d.push({
                  label: "data" + seqence,
                  data: dataset[seqence - 1]
                });
              }
            });
            options.series.lines = {};
            options.series.bars = {};
            $("#toggle-chart input[type='radio']").each(function() {
              if ($(this).is(":checked")) {
                if ($(this).val() == "line") {
                    options.series.lines = {
                      fill: true
                      };
                } else {
                    options.series.bars = {
                        show: true
                    };
                }
              }
            });
            // $.plot($("#toggle-chart #toggle-chartContainer"), d, options);
          }
          $("#toggle-chart input").change(function() {
              ToggleSeries();
          });
          ToggleSeries();
      });
    });
  })(jQuery);
}
