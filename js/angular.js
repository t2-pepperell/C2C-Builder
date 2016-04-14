
var myApp = angular.module('myApp',[]);
var csvFile;
var lineChart = false;
var barChart = false;

      myApp.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function($scope, element, attrs,ngModel) {
					 var attrHandler=$parse(attrs.fileModel);
					 var modelSetter = attrHandler.assign;
					 //console.log(attrHandler);
                  element.bind('change', function(e){
                     $scope.$apply(function(){
                       // modelSetter(scope, element[0].files[0])
						                  modelSetter($scope,{$event:e,files:e.target.files});

                     });
                  });

               }
            };
         }]);
				 myApp.controller('MainCtrl', ['$scope', '$filter', function($scope,$filter){
				 			var string;
				 			var reader;
				       var chartType;
				       var obj;

				 			$scope.next = function(nextStage){
				 			    $scope.direction = 1;
				 					$scope.selection = nextStage;
									
								
									//update progress
	 								//var step = $(e.target).data('step');
	 							//	var percent = (parseInt(step) / 3) * 100;

	 								//$('.progress-bar').css({width: percent + '%'});
	 								//$('.progress-bar').text("Step " + step + " of 3");
				 			}
				 			$scope.backTo = function(stage) {
				 				$scope.direction = 0;
				 				$scope.selection = stage;
				 			};

				 			$scope.chartType = function(e,type){
				         chartType = e;
						 
						 if(chartType == "barChart"){
							 barChart = true;
							 lineChart = false;
						 }else{
							 barChart = false;
							 lineChart = true;
						 }
				       }

				       /*-- Main Upload File Scope --*/
				 			$scope.uploadFile = function(e,files){
				         var inputCSV = $('#inputCSV').val();
								 var csvUpload = $scope.$$childTail.myFile;

								 if(!csvUpload){
									 $(".alert").show();
								 }else{
									 		// gets the data from the file input
											csvFile = $scope.$$childTail.myFile.files[0];
											// Creates a file reader
							 				reader=new FileReader();
											// when the reader loads
							 				reader.onload=function(e){
												// get the results
							 				  string=reader.result;
												//converts JavaScript Object into Json string
							 					obj= $filter('json')(string);
												
												
												var lines=string.split("\n");
											 var result = [];
											 var empty = "";
											var headers=lines[0].split(",");
											headers[0] = "date";
											headers[1] = "value";
											var headerString = headers[0] + "," + headers[1];	
											lines[0] = headerString;
												empty += lines.join("\n");
											
											result = result.toString();
											//console.log(result);
											//console.log(string);
												
							           //  call load_dataset(), convert the json string string into csv
							           load_dataset( d3.csv.parse(empty));
							 				}
							 			  reader.readAsText(csvFile);
				             	// load_dataset(inputCSV);
											$scope.next('stage3');
									 }
				       };


				       }]);

// load dataset and create table

var primaryBarColour = "#122038";
var primaryAxisColour = "#ddd";
var AxisColor = "#222222";
var fontColor = "#ffffff";
var strokeWidth = "0.8px";
var default_title = "";
var default_width = 800;
var xAxis_label = "";
var yAxis_label = "";
var	default_height = 300;
var default_barWidth = 100;
var default_margin = {top: 50, right: 20, bottom: 85, left: 40};
	var chart = d3.select(".chart");
  var data;
	var csv;
	var xScale;
	var yScale;
	var   y;
	var   x;

 
function load_dataset(csv) {
	csv = csv;
	data = csv;
	var	parseDate = d3.time.format("%Y-%m").parse;
   
  data.forEach(function(d, i){
	 
	  
      d.date = parseDate(d.date);
      d.value = +d.value;
  });
  
  if(lineChart == true && barChart == false){
	  drawLineChart();
  }if(barChart == true && lineChart == false){
	  draw();
  }
}
function drawLineChart(){
	
				var x = d3.time.scale()
				.range([0, default_width]);

			var y = d3.scale.linear()
				.range([default_height, 0]);
				
				var formatDate = d3.time.format("%d-%b-%y");
				
				var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.ticks(10)
				.tickFormat(d3.time.format("%Y-%m"));

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left");
				
				var line = d3.svg.line()
				.x(function(d) { return x(d.date); })
				.y(function(d) { return y(d.value); });
				
				chart = d3.select("svg")
						.attr("width", default_width + default_margin.left + default_margin.right)
						.attr("height", default_height + default_margin.top + default_margin.bottom)
						.append("g")
						.attr("transform", "translate(" + default_margin.left + "," + default_margin.top + ")");
				
				x.domain(d3.extent(data, function(d) { return d.date; }));
			  y.domain(d3.extent(data, function(d) { return d.value; }));
			  
				chart.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + default_height + ")")
				  .style("fill", AxisColor)
				  .call(xAxis)
				  .selectAll("text")
					.attr("transform", "rotate(90)")
					.attr("x", 40)
					.attr("y", default_margin.left)
				 

			  chart.append("g")
				  .attr("class", "y axis")
				  .style("fill", AxisColor)
				  .call(yAxis)
				.append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text(yAxis_label);
				  
				  
			  chart.append("path")
				  .datum(data)
				  .attr("class", "line")
				  .style("stroke", primaryBarColour)
				  .style("fill","none")
				  .style("stroke-width","1.5px")
				  .attr("d", line);
				  
				  d3.selectAll("path.domain")
				  .style("stroke-width", "0.5px")
				  
 
				$("#line-warning").html("<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Warning!</strong> The editor toolbar has not been enabled for this chart type! </div>")
  
}


function draw(){

          chart = d3.select("svg")
            .attr("width", default_width + default_margin.left + default_margin.right)
            .attr("height", default_height + default_margin.top + default_margin.bottom)
            .append("g")
            .attr("transform", "translate(" + default_margin.left + "," + default_margin.top + ")");

            // setup x
            xScale = d3.scale.ordinal().rangeRoundBands([0, default_width], .05);
                xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom")
                .tickFormat(d3.time.format("%Y-%m"));
            // setup y
            yScale = d3.scale.linear().range([default_height, 0]),
                yAxis = d3.svg.axis().scale(yScale).orient("left");

            y = d3.scale.linear().range([default_height, 0]);
            x = d3.scale.ordinal().rangeRoundBands([0, default_width], .05);


            yScale.domain([0, d3.max(data, function(d) { return d.value; })]);
            xScale.domain(data.map(function(d) { return d.date; }));
            x.domain(data.map(function(d) { return d.date; }));
            y.domain([0, d3.max(data, function(d) { return d.value; })]);
            // x-axis
            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + default_height + ")")
                .style("fill", AxisColor)
                .call(xAxis)
                .selectAll("text")
                .attr("transform", "rotate(90)")
                .attr("x", 40)
              .append("text")
                .attr("class", "xlabel")
                .attr("x", default_width)
                .attr("y", -50)
                .style("text-anchor", "end")
                .text(xAxis_label);

            // y-axis
            chart.append("g")
                .attr("class", "y axis")
                .style("fill", AxisColor)
                .call(yAxis)
              .append("text")
                .attr("class", "ylabel")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(yAxis_label);
                   var barWidth = default_width / data.length;
									 chart.append("text")
									 .attr("class","chart-title")
        	 				.attr("x", (default_width / 2))
					        .attr("y", 0 - (default_margin.top / 2))
					        .attr("text-anchor", "middle")
					        .style("font-size", "22px")
									.style("font-weight","bold")
					        .text(default_title);

                   var bar = chart.selectAll("bar")
                       .data(data)
                     .enter().append("g")

                   bar.append("rect")
                      .attr("x", function(d) { return x(d.date); })
                       .attr("y", function(d) { return y(d.value); })
                       .attr("height", function(d) { return default_height - y(d.value); })
                        .attr("width", x.rangeBand())
                       .style("fill", primaryBarColour);

                   bar.append("text")
                      .attr("x", function(d) { return x(d.date) + 15; })
                       .attr("y", function(d) { return y(d.value) + 25; })
                       .text(function(d) { return d.value; })
                       .style("fill", fontColor);

                  var pathDomain = d3.selectAll("path.domain")
                      .style("stroke-width", "strokeWidth")
                      .style("fill", primaryAxisColour);

};

$(document).on('click', '#chart-update', function(d) {
	var chart_bar_colour = $('#chart-bar-colour').val();
	if(!chart_bar_colour){
		primaryBarColour = primaryBarColour;
	}else{
		primaryBarColour = chart_bar_colour;
	}
	d3.selectAll('rect')
		.style("fill", primaryBarColour);

		var chart_axis_colour = $('#chart-axis-colour').val();
		if(!chart_axis_colour){
			primaryAxisColour = primaryAxisColour;
		}else{
			primaryAxisColour = chart_axis_colour;
		}
		d3.selectAll('path.domain')
			.style("fill", primaryAxisColour);

	var chart_title = $('#chart-title').val();
	if(!chart_title){
		default_title = default_title;
	}else{
		default_title = chart_title;
	}
	d3.selectAll('text.chart-title')
		.text(default_title);

		var chart_xLabel = $('#chart-xLabel').val();
		if(!chart_xLabel){
			xAxis_label = xAxis_label;
		}else{
			xAxis_label = chart_xLabel;
		}
		d3.select('.xlabel')
		.text(xAxis_label);

		var chart_yLabel = $('#chart-yLabel').val();
		if(!chart_yLabel){
			yAxis_label = yAxis_label;
		}else{
			yAxis_label = chart_yLabel;
		}
		d3.select('.ylabel')
		.text(yAxis_label);


})

var toggle = false;
$(document).on('click', '#toggle-icon', function(d) {
    if(toggle == false){
      $('#toggle-icon span').removeClass('glyphicon-chevron-right');
      $('#toggle-icon span').addClass('glyphicon-chevron-left');

      $('#toggle-toolbar').animate({
      'marginLeft' : "+=275px"//moves Right
      });
      toggle = true;

    }
    else if (toggle == true) {
      $('#toggle-icon span').removeClass('glyphicon-chevron-left');
      $('#toggle-icon span').addClass('glyphicon-chevron-right');
      $('#toggle-toolbar').animate({
      'marginLeft' : "-=275px" //moves left
    });
    toggle = false;
    }
});

$(document).on('click', '.editor-option', function(d) {
      $(this).next('li').slideToggle('fast');

});


function downloadChart() {
        //select the SVG into a variable
        var html = d3.select("svg")
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .node().parentNode.innerHTML;
           //prepare the chart's css and insert it in to the data read from the svg.
          //var replacement = '2000/svg"><defs><style type="text/css"><![CDATA[' + document.getElementById('chart').innerText.replace(/[\n\r]/g, '') + ']]></style></defs>';
				  var replacement = '2000/svg"><defs><style type="text/css"><![CDATA[' + $('#chart').text().replace(/[\n\r]/g, '') + ']]></style></defs>';
        //insert the css into the variable containing the svg
          html =html.replace('2000/svg">',replacement);
        //convert the variable containing the svg into a data stream
          var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
        //convert the datastream into an html image
          var img = '<img src="'+imgsrc+'">';
        //attach the datastream to one of the hidden divs
          d3.select("#svgdataurl").html(img);
        //select the hidden canvas into a variable
          //var canvas = document.querySelector("canvas");
					var canvas = document.getElementsByTagName('canvas')[0];
						var  context = canvas.getContext("2d");
						canvas.width  = 900;
						canvas.height = 600;
          //clear the canvas in case it's already been used
          context.clearRect(0, 0, canvas.width, canvas.height);
        //create an image and draw the image into the canvas
          var image = new Image;
          image.src = imgsrc;

          image.onload = function() {
              context.drawImage(image, 0, 0);
          		var canvasdata = canvas.toDataURL("image/png");

        //create a PNG from the canvas
          var pngimg = '<img src="'+canvasdata+'">';
           d3.select("#pngdataurl").html(pngimg);
        //create an anchor tag in the html and attach the PNG stream to the anchor
          var a = document.createElement("a");
          a.download = "pias_report.png";   //name your download file here
          a.href = canvasdata;
          document.body.appendChild(a);
        //programmatically click the link to start the download.
          a.click();
  };

  //cancel the button click which was replaced with the anchor click
 return false;
};
