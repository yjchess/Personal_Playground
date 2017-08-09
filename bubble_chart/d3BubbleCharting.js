
var makeBubbleChart = function(data) {
    //start charting once we have collected all the data
    console.log("data array size: " + data.length); 
    var allIssues= [], jj=0;
    for (var kk=0; kk<data.length;kk++){
        var mI=data[kk].issues;
        if (data[kk].issues != 'undefined'){
            for (var ii=0; ii<data[kk].issues.length; ii++){
                allIssues[jj]=data[kk].issues[ii];
                jj++;
            }
        }
    }

	var allOpenIssues = allIssues.filter(x=>x.state == "open");
    var addressedOpen = allOpenIssues.filter(x=>x.comments>0);

	var allBugIssues = allIssues.filter(x=>x.labels.filter(t=>t.name == "bug").length>0);
	var addressedBug = allBugIssues.filter(x=>x.comments>0);

    var	allEnhancementIssues = allIssues.filter(x=>x.labels.filter(t=>t.name == "enhancement").length>0);
	var addressedEnhancement = allEnhancementIssues.filter(x=>x.comments>0);

    var assigneeOpenIssues = getAllItemsAssigneeCount(allOpenIssues)
    , assigneeAddressedOpen = getAllItemsAssigneeCount(addressedOpen)
    , assigneeBugIssues = getAllItemsAssigneeCount(allBugIssues)
    , assigneeAddressedBug = getAllItemsAssigneeCount(addressedBug)
    , assigneeEnhancementIssues = getAllItemsAssigneeCount(allEnhancementIssues)
    , assigneeAddressedEnhancement = getAllItemsAssigneeCount(addressedEnhancement);

    var assigneeOpenIssuesDistinct= new Set(allOpenIssues.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeAddressedOpenDistinct= new Set(addressedOpen.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeBugIssuesDistinct= new Set(allBugIssues.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeAddressedBugDistinct= new Set(addressedBug.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeEnhancementIssuesDistinct= new Set(allEnhancementIssues.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeAddressedEnhancementDistinct= new Set(addressedEnhancement.map(x=>x.assignee!= null? x.assignee.login: null));
    
	/* Prepare data for bubble chart on tab1 */
    var bubbleChartObjData = new Array();
    bubbleChartObjData.push(buildBubbleChartData(
        "Open Issues",assigneeOpenIssues,assigneeOpenIssuesDistinct));
    bubbleChartObjData.push(buildBubbleChartData(
        "Addressed Open",assigneeAddressedOpen,assigneeAddressedOpenDistinct));
    bubbleChartObjData.push(buildBubbleChartData(
        "Bug Issues",assigneeBugIssues,assigneeBugIssuesDistinct));
    bubbleChartObjData.push(buildBubbleChartData(
        "Addressed Bug",assigneeAddressedBug,assigneeAddressedBugDistinct));
    bubbleChartObjData.push(buildBubbleChartData(
        "Enhancement Issues",assigneeEnhancementIssues,assigneeEnhancementIssuesDistinct));
    bubbleChartObjData.push(buildBubbleChartData(
        "Addressed Enhancement",assigneeAddressedEnhancement,assigneeAddressedEnhancementDistinct));

    var bubbleChartData = new Array();
    for (var ii=0; ii<bubbleChartObjData.length;ii++){
        var objList = bubbleChartObjData[ii];
        for (var jj=0; jj<objList.length; jj++){
            bubbleChartData.push(objList[jj]);
        }
    }
    /* Add a bubble chart on tab1 */
    var bubbleChart4Issues = bubbleChart().width(600).height(400);
    d3.select('#bubbleChart').data(bubbleChartData).call(bubbleChart4Issues);
}

var buildBubbleChartData = function(theCategory,countData,assigneeData){
    var plotData = new Array();
        assigneeData.forEach(function(el){
            if (el != null) { 
                obj = { title: el, category: theCategory, views: countData[el] };
                plotData.push(obj);                
            }
        })
        return plotData;
}

var getAllItemsAssigneeCount = function(d){
    var assigneeAllItems = [];
    for (var ii = 0, jj = d.length; ii < jj; ii++) {
        if(d[ii].assignee != null){
            assigneeAllItems[d[ii].assignee.login] = 
            (assigneeAllItems[d[ii].assignee.login] || 0) + 1;
        }
    }
    return assigneeAllItems;
}

/* 
Code Used in Sample d3 Bubble Charting from Internet Below
*/
function bubbleChart() {
    var width = 960, height = 960, maxRadius = 6,
        columnForColors = "category", columnForRadius = "views";

    function chart(selection) {
        var data = selection.enter().data();
        var div = selection,
            svg = div.selectAll('svg');
        svg.attr('width', width).attr('height', height);

        var tooltip = selection
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "#626D71")
            .style("border-radius", "6px")
            .style("text-align", "center")
            .style("font-family", "monospace")
            .style("width", "400px")
            .text("");


        var simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength([-50]))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);

        function ticked(e) {
            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
        var scaleRadius = d3.scaleLinear()
        .domain(
            [d3.min(data, function(d) { return +d[columnForRadius];})
            ,d3.max(data, function(d) { return +d[columnForRadius];})])
        .range([5, 18])

        var node = svg.selectAll("circle").data(data).enter().append("circle")
            .attr('r', function(d) { return scaleRadius(d[columnForRadius]);})
            .style("fill", function(d) { return colorCircles(d[columnForColors]);})
            .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
            .on("mouseover", function(d) {
                tooltip.html(d[columnForColors] + "<br>" + d.title + "<br>" + d[columnForRadius] + " counts");
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
            .on("click", function() {
                return alert("You clicked me!");
            });
    }

    chart.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };


    chart.columnForColors = function(value) {
        if (!arguments.columnForColors) {
            return columnForColors;
        }
        columnForColors = value;
        return chart;
    };

    chart.columnForRadius = function(value) {
        if (!arguments.columnForRadius) {
            return columnForRadius;
        }
        columnForRadius = value;
        return chart;
    };

    return chart;
}