queue()
    .defer(d3.json, "/api/data")
    .await(makeGraphs);

function makeGraphs(error, apiData) {
	
    //Start Transformations
	var dataSet = apiData;
	
	//Stored Date Format
	//"Date" : "09/25/2009 02:15:00 PM",
	//"%m/%d/%Y %H:%M:%S %p"
	
	 var dateFormat = d3.time.format("%m/%d/%Y %H:%M:%S %p");
	 var timeFormat = d3.time.format("%m/%d/%Y %H:%M:%S %p");
	 
	 console.log(dateFormat);
     console.log(timeFormat);

     dataSet.forEach(function(d) {
	
    //Parse Date	
	console.log(d.Date);
	console.log("Before Parse DateFormat");
    d.Date = dateFormat.parse(d.Date);
    d.Date.setHours(0);
	d.Date.setMinutes(0);
    d.Date.setSeconds(0);
	console.log("after Parse DateFormat");
	console.log(d.Date);
	
    //Parse Date_two : time
	console.log(d.Date_two);
	console.log("before Parse TimeFormat");
    d.Date_two = timeFormat.parse(d.Date_two);
	d.Date_two.setYear(0);
	d.Date_two.setMonth(0);
    d.Date_two.setDate(0);
	console.log("after Parse TimeFormat");
	console.log(d.Date_two);  
	
	//latitudes and longitudes
	//d["longitude"] = +d["longitude"];
	//d["latitude"] = +d["latitude"];
	
	d.Longitude = +d.Longitude;
	d.Latitude = +d.Latitude;
   
}); 


	//Create a Crossfilter instance
	var ndx = crossfilter(dataSet);

	//Define Dimensions
	var datePosted = ndx.dimension(function(d) { return d.Date; });
	var datePosted2 = ndx.dimension(function(d) { return d.Date_two; });
	var primaryType = ndx.dimension(function(d) { return d.PrimaryType; });
	var crimeDescription = ndx.dimension(function(d) { return d.Description; });
	var locationDescription = ndx.dimension(function(d) { return d.LocationDescription; });
	var domestic = ndx.dimension(function(d) { return d.Domestic; });
    var arrest = ndx.dimension(function(d) { return d.Arrest; });
	var crimeYear = ndx.dimension(function(d) { return d.Year; });
	var allDim = ndx.dimension(function(d) {return d;})
/*	var fundingStatus5 = ndx.dimension(function(d) { return d.CaseNumber; });
	var fundingStatus6 = ndx.dimension(function(d) { return d.PrimaryType; });
	var fundingStatus7 = ndx.dimension(function(d) { return d.FBICode; }); */
	


	//Calculate metrics
	var projectsByDate = datePosted.group();
	var projectsByDate2 = datePosted2.group();
	var crimesByPrimaryType = primaryType.group();
	var crimesByCrimeDescription = crimeDescription.group();
	var crimesByLocationDescription = locationDescription.group();
	var crimesByDomestic = domestic.group();
	var crimesByArrest = arrest.group();
	var crimesByYear = crimeYear.group();
  /*var projectsByFundingStatus5 = fundingStatus5.group();
	var projectsByFundingStatus6 = fundingStatus6.group();
	var projectsByFundingStatus7 = fundingStatus7.group();
	 */
	 
	//Calculate Groups
	/* var totalDonationsState = state.group().reduceSum(function(d) {
		return d.total_donations;
	});

	var totalDonationsGrade = gradeLevel.group().reduceSum(function(d) {
		return d.grade_level;
	});

	var totalDonationsFundingStatus = fundingStatus.group().reduceSum(function(d) {
		return d.funding_status;
	});



	var netTotalDonations = ndx.groupAll().reduceSum(function(d) {return d.total_donations;}); */

	var all = ndx.groupAll();

	 //Define threshold values for date
	var minDate = datePosted.bottom(1)[0].Date;
	var maxDate = datePosted.top(1)[0].Date;
	
	//Define threshold values for date two
	var minTime = datePosted2.bottom(1)[0].Date_two;
	var maxTime = datePosted2.top(1)[0].Date_two;
	
	//Define threshold values for date
	//var minYear = fundingStatus2.bottom(1)[0].Year;
	//var maxYear = fundingStatus2.top(1)[0].Year;

	console.log("minDate :" +minDate);
    //console.log(minDate);
    console.log("maxDate: " +maxDate);
    //console.log(); 
	
	
	 //TimeOfStop
	console.log("minTime");
    console.log(minTime);
    console.log("maxTime");
    console.log(maxTime); 

    //Charts
    //var dateChart = dc.lineChart("#date-chart");
	var dateChart = dc.barChart("#date-chart");
	var dateChart2 = dc.lineChart("#date-chart2");
	var dataTable = dc.dataTable("#dc-table-graph");
	var primaryTypeChart = dc.rowChart("#resource-chart");
	var crimeDescriptionChart = dc.pieChart("#crimesDesc-chart");
	var locationDescriptionChart = dc.pieChart("#locationDesc-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	var domesticChart = dc.pieChart("#crime-domestic"); 
	var arrestChart = dc.pieChart("#arrest-chart");
	var yearChart = dc.pieChart("#year-chart");
/*	var fundingStatusChart5 = dc.pieChart("#state-donations3");
	var fundingStatusChart6 = dc.pieChart("#state-donations4");
	//var fundingStatusChart7 = dc.pieChart("#state-donations5");
	var fundingStatusChart7 = dc.rowChart("#state-donations5"); */



    dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);


	totalProjects
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);
		
		
   dateChart
    .width(1100)
    .height(400)
    .margins({top: 10, right: 20, bottom: 20, left: 20})
    .dimension(datePosted)
    .group(projectsByDate)
    .transitionDuration(1500)
    .x(d3.time.scale().domain([minDate, maxDate]))
    .elasticY(true)
    .yAxis().ticks(4);

		
    /*  // Magnitide Bar Graph Counted
        dateChart
		.width(1000)
		.height(400)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(datePosted)
		.group(projectsByDate)
		.renderArea(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(5); */
		
		
		// Magnitide Bar Graph Counted
        dateChart2
		.width(1100)
		.height(400)
		.margins({top: 10, right: 10, bottom: 30, left: 10})
		.dimension(datePosted2)
		.group(projectsByDate2)
		.renderArea(true)
		.transitionDuration(1500)
		.x(d3.time.scale().domain([minTime, maxTime]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Year")
		.yAxis().ticks(5);

	
		
	//Crimes by primary type	
	primaryTypeChart
        .width(1100)
        .height(700)
        .dimension(primaryType)
        .group(crimesByPrimaryType)
        .elasticX(true)
        .xAxis().ticks(8);

	
	
	//Location Description Chart		
	 locationDescriptionChart
            .height(900)
            .width(800)
            .radius(350)
            .innerRadius(50)
			//.legend(dc.legend().x(10).y(10).itemHeight(13).gap(5))
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(locationDescription)
            .group(crimesByLocationDescription);
			
	//Crimes Description Chart		
	crimeDescriptionChart
            .height(900)
            .width(800)
            .radius(350)
            .innerRadius(50)
			//.legend(dc.legend().x(10).y(10).itemHeight(13).gap(5))
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(crimeDescription)
            .group(crimesByCrimeDescription);
			
		
		//Crimes by domestic	
		domesticChart
            .height(270)
            .width(400)
            .radius(100)
            .innerRadius(50)
			//.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(domestic)
            .group(crimesByDomestic);
			
		
		//Arrest chart
		arrestChart
            .height(270)
            .width(400)
            .radius(100)
            .innerRadius(50)
			.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(arrest)
            .group(crimesByArrest);
			
			
		//Crimes by year	
		yearChart
            .height(270)
            .width(400)
            .radius(100)
            .innerRadius(50)
			.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1500)
            .dimension(crimeYear)
            .group(crimesByYear);
			
			
	/*		fundingStatusChart5
            .height(250)
            .width(400)
            .radius(100)
            .innerRadius(50)
			.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1000)
            .dimension(fundingStatus5)
            .group(projectsByFundingStatus5);
			
			
			fundingStatusChart6
            .height(250)
            .width(400)
            .radius(100)
            .innerRadius(50)
			.legend(dc.legend())
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1000)
            .dimension(fundingStatus6)
            .group(projectsByFundingStatus6);
			
			/* fundingStatusChart7
            .height(250)
            .width(400)
            .radius(100)
            .innerRadius(5)
			//.externalLabels(50)
            //.externalRadiusPadding(50)
            //.drawPaths(true)
            .transitionDuration(1000)
            .dimension(fundingStatus7)
            .group(projectsByFundingStatus7); */
			
			
	/* 	fundingStatusChart7
        .width(350)
        .height(250)
        .dimension(fundingStatus7)
        .group(projectsByFundingStatus7)
        .elasticX(true)
        .xAxis().ticks(8);*/
		
		
   // Crimes data table
   dataTable
    .width(1000)
	.height(1000)
    .dimension(datePosted)
	.group(function(d) { return "Crime Incidents Table" })
	.size(25)
    .columns([
      function(d) { return d.Year; },
      function(d) { return d.PrimaryType; },
      function(d) { return d.Description; },
      function(d) { return d.LocationDescription; },
      function(d) { return d.Arrest; },
	  function(d) { return d.Domestic; },
	  function(d) { return '<a href=\"http://maps.google.com/maps?z=12&t=m&q=loc:' + d.Latitude + '+' + d.Longitude +"\" target=\"_blank\">Google Map</a>"},
	  function(d) { return '<a href=\"http://www.openstreetmap.org/?mlat=' + d.Latitude + '&mlon=' + d.Longitude +'&zoom=12'+ "\" target=\"_blank\"> OSM Map</a>"}
    ])
    .sortBy(function(d){ return d.Year; })
    .order(d3.ascending);
	
	
	//Map
	
	var map = L.map('map');

	var drawMap = function(){

	    map.setView([41.8781136, -87.62979819999998], 10);
		mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; ' + mapLink + ' Contributors',
				maxZoom: 25,
			}).addTo(map);

		 //HeatMap
		var geoData = [];
		_.each(allDim.top(Infinity), function (d) {
			geoData.push([d["Latitude"], d["Longitude"], 1]);
	      });
		var heat = L.heatLayer(geoData,{
			radius: 10,
			blur: 20, 
			maxZoom: 1,
		}).addTo(map);

	};

	//Draw Map
	drawMap();
	
	
	//Update the heatmap if any dc chart get filtered
	dcCharts = [dateChart, dateChart2, primaryTypeChart, crimeDescriptionChart, locationDescriptionChart,totalProjects,domesticChart,arrestChart,yearChart];

	_.each(dcCharts, function (dcChart) {
		dcChart.on("filtered", function (chart, filter) {
			map.eachLayer(function (layer) {
				map.removeLayer(layer)
			}); 
			drawMap();
		});
	}); 
	 




    dc.renderAll();

};