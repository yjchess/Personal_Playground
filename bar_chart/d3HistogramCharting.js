var makeHistogramChart = function(data) {
    //start charting once we have collected all the data
    console.log("data array size: " + data.length);
    var allIssuesList=[], allIssuesCount=[] ,loopId=-1;
    
    var data4Histogram=[];    
    var fullLabelNameList=[];
    fullLabelNameList.push("bug");
    data.forEach(x=>{ x.issues.forEach(y=>{
            if(y.labels.length>0){
                y.labels.forEach(z=>{
                    var pushIt=true;
                    fullLabelNameList.forEach(t=>{
                        if(t==z.name){pushIt=false;}
                    })
                    if(pushIt){fullLabelNameList.push(z.name);}
                })
            }
    })})

    var fullLabelList=["bug","duplicate","enhancement","help wanted",
        "invalid","question","wontfix","projectId","totalIssue","valuedLabel"];
    data.forEach(x=>{ var issueCount=0;  loopId++;
        var dataItem={};
        fullLabelList.forEach(q=>{ dataItem[q]=0;});
        dataItem["projectId"]= loopId;                 
        x.issues.forEach(t=>{ 
            issueCount++; t.Id=loopId; allIssuesList.push(t);
            var labelCount=t.labels.length;
            if(t.labels.length>0){
                t.labels.forEach(p=>{
                    fullLabelList.forEach(q=>{
                        if(q==p.name){dataItem[q] +=1;}                   
                    })
                })                
            }
        }) 
        allIssuesCount.push({Id:loopId,totalIssue:issueCount});
        dataItem["totalIssue"]= issueCount;                 
        data4Histogram.push(dataItem);
        //data4Histogram.filter(p=>p.projectId==loopId)
        //.forEach(q=>q.totalIssue=issueCount);
    })
    var check=true;

    var dataSample = [{"food":"bug","quantity":84}
    ,{"food":"duplicate","quantity":35}
    ,{"food":"enhancement","quantity":62}
    ,{"food":"help wanted","quantity":92}
    ,{"food":"invalid","quantity":30}
    ,{"food":"question","quantity":21}
    ,{"food":"wontfix","quantity":13}];

    var dataArray = [23, 13, 21, 14, 37, 15, 18, 34, 30];

    //plotSampleBarChart(dataArray);
    plotSampleBarChartv3(dataSample);
}


var plotSampleBarChart=function(data){
    // Create variable for the SVG
var svg = d3.select("#barChartID").append("svg")
          .attr("height","100%")
          .attr("width","100%");

// Select, append to SVG, and add attributes to rectangles for bar chart
svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
          .attr("class", "bar")
          .attr("height", function(d, i) {return (d * 10)})
          .attr("width","40")
          .attr("x", function(d, i) {return (i * 60) + 25})
          .attr("y", function(d, i) {return 400 - (d * 10)});

// Select, append to SVG, and add attributes to text
svg.selectAll("text")
    .data(dataArray)
    .enter().append("text")
    .text(function(d) {return d})
           .attr("class", "text")
           .attr("x", function(d, i) {return (i * 60) + 36})
           .attr("y", function(d, i) {return 415 - (d * 10)});
}


var plotSampleBarChartv3=function(data){
    var margin = {top:10, right:10, bottom:90, left:50};
    var width = 660 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;
    var color = d3.scaleOrdinal().range(d3.schemeCategory20);
    //var formatPercent = d3.format(".0%");
    
    var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.03);
    //d3.scaleOrdinal().range([0, width]).round( .03)
    var yScale = d3.scaleLinear().range([height, 0]);

    //var xAxis = d3.svg.axis().scale(xScale).orient("bottom");        
        
    //var yAxis = d3.svg.axis().scale(yScale).orient("left");

    $("#testID").text("This is a test!");

    var svgContainer = d3.select("#barChartID").append("svg")
            .attr("width", width+margin.left + margin.right)
            .attr("height",height+margin.top + margin.bottom)
            .append("g").attr("class", "container")
            .attr("transform", "translate("+ margin.left +","+ margin.top +")");

    xScale.domain(data.map(function(d) { return d.food; }));
    //yScale.domain([0, d3.max(data, function(d) { return d.quantity; })]);
    yScale.domain([0, 110]);

    var rangeBand=function(){ return (width+margin.left + margin.right);}
    xScale.rangeBand=rangeBand;

    //xAxis. To put on the top, swap "(height)" with "-5" in the translate() statement. Then you'll have to change the margins above and the x,y attributes in the svgContainer.select('.x.axis') statement inside resize() below.
    var xAxis_g = svgContainer.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-35)");
    /*
    vis.selectAll(".xaxis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
              return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
        });        
    */
    // Uncomment this block if you want the y axis
    var yAxis_g = svgContainer.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale))
            //.tickValues([20,40,60,80,100])
            //.tickFormat(formatPercent)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            //.style("text-anchor", "end").text("Number of Applicatons"); 
    


        svgContainer.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.food); })
//            .attr("width", width+margin.left + margin.right)
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) { return yScale(d.quantity); })
            .attr("height", function(d) { return height - yScale(d.quantity); });


// Controls the text labels at the top of each bar. Partially repeated in the resize() function below for responsiveness.
	svgContainer.selectAll(".text")  		
	  .data(data)
	  .enter()
	  .append("text")
	  .attr("class","label")
	  .attr("x", (function(d) { return xScale(d.food) + xScale.bandwidth() / 2 ; }  ))
	  .attr("y", function(d) { return yScale(d.quantity) + 1; })
	  .attr("dy", ".75em")
      .text(function(d) { return d.quantity; });  
        

      document.addEventListener("DOMContentLoaded", resize);
      d3.select(window).on('resize', resize); 
}

function resize() {
	console.log('----resize function----');
  // update width
  width = parseInt(d3.select('#barChartID').style('width'), 10);
  width = width - margin.left - margin.right;

  height = parseInt(d3.select("#barChartID").style("height"));
  height = height - margin.top - margin.bottom;
	console.log('----resiz width----'+width);
	console.log('----resiz height----'+height);
  // resize the chart
  
    xScale.range([0, width]);
    xScale.rangeRoundBands([0, width], .03);
    yScale.range([height, 0]);

    yAxis.ticks(Math.max(height/50, 2));
    xAxis.ticks(Math.max(width/50, 2));

    d3.select(svgContainer.node().parentNode)
        .style('width', (width + margin.left + margin.right) + 'px');

    svgContainer.selectAll('.bar')
    	.attr("x", function(d) { return xScale(d.food); })
      .attr("width", xScale.rangeBand());
      
   svgContainer.selectAll("text")  		
	 // .attr("x", function(d) { return xScale(d.food); })
	 .attr("x", (function(d) { return xScale(d.food	) + xScale.rangeBand() / 2 ; }  ))
      .attr("y", function(d) { return yScale(d.quantity) + 1; })
      .attr("dy", ".75em");   	      

    svgContainer.select('.x.axis').call(xAxis.orient('bottom')).selectAll("text").attr("y",10).call(wrap, xScale.rangeBand());
    // Swap the version below for the one above to disable rotating the titles
    // svgContainer.select('.x.axis').call(xAxis.orient('top')).selectAll("text").attr("x",55).attr("y",-25);
}      

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

