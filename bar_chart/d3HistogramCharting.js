var makeHistogramChart = function(data) {
    //start charting once we have collected all the data
    //console.log("data array size: " + data.length);
    //find what values are in name property inside label objects
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
    // define what name values are required to be counted and plot in the histogram
    //var fullLabelList=["bug","enhancement","question","projectId","totalIssue","name"];
    var fullLabelList=["bug","enhancement","duplicate","help wanted",
        "invalid","question","wontfix","projectId","totalIssue","name"];
    // get the required data into data4Histogram array
    var data4Histogram=[], loopId=-1;    
    data.forEach(x=>{ var issueCount=0;  loopId++;
        var dataItem={};
        fullLabelList.forEach(q=>{ dataItem[q]=0;});
        dataItem["name"]=x.repo.name;
        dataItem["projectId"]= loopId;                 
        x.issues.forEach(t=>{ 
            issueCount++; t.Id=loopId;
            if(t.labels.length>0){
                t.labels.forEach(p=>{
                    fullLabelList.forEach(q=>{
                        if(q==p.name){dataItem[q] +=1;}                   
                    })
                })                
            }
        }) 
        dataItem["totalIssue"]= issueCount; 
        if(issueCount>0){
            fullLabelList.forEach(t=>{
                if(t != "projectId" && t != "totalIssue" && t != "name"){
                    dataItem[t]=Math.round(dataItem[t]/issueCount*100);
                }
            })
        }                
        data4Histogram.push(dataItem);
    })

    var data4HistogramChart=[];
    fullLabelList.forEach(t=>{
        if(t != "projectId" && t != "totalIssue" && t !="name"){
            data4Histogram.forEach(p=>{
                var label="", quantity=0, projectId=0;
                label=t; quantity=Math.round(p[t]); projectId=p["projectId"];
                data4HistogramChart.push({
                    "label":label, "quantity":quantity, "projectId":projectId
                })
            })
        }
    })

    var data4GroupedBarChart=[],columns=[],projId=0;
    columns[0]="label";
    data.forEach(x=>{ columns[projId+1]=x.repo.name; projId++;});
    var data4GroupedBarChart=[];
    var iLabel=0;
    data4GroupedBarChart['columns']=columns;
    fullLabelList.forEach(t=>{
        if(t != "projectId" && t != "totalIssue" && t != "name"){
            var dataItem=[];
            dataItem["label"]=t;
            for (var ii=1; ii<columns.length;ii++) {
                dataItem[columns[ii]]=1;
            }
            data4HistogramChart.forEach(p=>{
                if(t==p.label){
                    dataItem["label"]=p.label;
                    dataItem[columns[p.projectId+1]]=p.quantity==0?1:p.quantity;
                }
            })
            data4GroupedBarChart.push(dataItem);
        }
    })

    var check=true;

    plotHistogramBarChart(data4HistogramChart);
    plotGroupedBarChart(data4GroupedBarChart);
}

var plotAreaHeight=400;
var plotAreaWidth=700;

var plotGroupedBarChart=function(data){
    var svg = d3.select("#groupedBarChart").append("svg").attr("width",plotAreaWidth).attr("height",plotAreaHeight);
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var x1 = d3.scaleBand()
        .padding(0.05);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"]);
        .range(d3.schemeCategory20);
    /*
    d3.csv("./groupedBarChartData.csv", function(d, i, columns) {
    for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
    return d;
    }, function(error, data) {
    if (error) throw error;
    });
    */
    var keys = data.columns.slice(1);
    var extraYPercentage=10;
    x0.domain(data.map(function(d) { return d.label; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { 
        return d3.max(keys, function(key) { return d[key]; })+extraYPercentage; })]).nice();
    
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.label) + ",0)"; })
        .selectAll("rect").attr("class", "bar")
        .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); })
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.key) + "<br>" + (d.value) + " %");
        })
    	.on("mouseout", function(d){ 
            tooltip.style("display", "none");
        });
;

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Percentage");

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
}

var plotHistogramBarChart=function(data){
    var margin = {top:10, right:10, bottom:90, left:50};
    var width = plotAreaWidth - margin.left - margin.right;
    var height = plotAreaHeight - margin.top - margin.bottom;
    var color = d3.scaleOrdinal().range(d3.schemeCategory20);
    var extraYPercentage=10;
    //var formatPercent = d3.format(".0%");
    
    var xScale = d3.scaleBand().range([0, width]).padding(0.03);
    //d3.scaleOrdinal().range([0, width]).round( .03)
    var yScale = d3.scaleLinear().range([height, 0]);

    //var xAxis = d3.svg.axis().scale(xScale).orient("bottom");        
        
    //var yAxis = d3.svg.axis().scale(yScale).orient("left");


    var svgContainer = d3.select("#barChartID").append("svg")
            .attr("width", width+margin.left + margin.right)
            .attr("height",height+margin.top + margin.bottom)
            .append("g").attr("class", "container")
            .attr("transform", "translate("+ margin.left +","+ margin.top +")");

    xScale.domain(data.map(function(d) { return d.label+d.projectId; }));
    yScale.domain([0, d3.max(data, function(d) { return d.quantity; })+extraYPercentage]);
    //yScale.domain([0, 110]);

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
            .attr("x", function(d) { return xScale(d.label+d.projectId); })
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) { return yScale(d.quantity); })
            .attr("height", function(d) { return height - yScale(d.quantity); });


// Controls the text labels at the top of each bar. Partially repeated in the resize() function below for responsiveness.
    /*
    svgContainer.selectAll(".text")  		
	  .data(data)
	  .enter()
	  .append("text")
	  .attr("class","label")
	  .attr("x", (function(d) { return xScale(d.label+d.projectId) + xScale.bandwidth() / 2 ; }  ))
	  .attr("y", function(d) { return yScale(d.quantity) + 1; })
	  .attr("dy", ".75em")
      .text(function(d) { return d.quantity; });  
       

      document.addEventListener("DOMContentLoaded", resize);
      d3.select(window).on('resize', resize); 
      */
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
    	.attr("x", function(d) { return xScale(d.label); })
      .attr("width", xScale.rangeBand());
      
   svgContainer.selectAll("text")  		
	 // .attr("x", function(d) { return xScale(d.label); })
	 .attr("x", (function(d) { return xScale(d.label	) + xScale.rangeBand() / 2 ; }  ))
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

