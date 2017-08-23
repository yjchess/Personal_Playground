var makeBubbleChart = function(data) {

    var allIssues= []; 
    data.forEach(x=>{x.issues.forEach(y=>{allIssues.push(y);})});   
    var fullAssigneesList=getDistinctAssigneesList(allIssues);

	var allOpenIssues = allIssues.filter(x=>x.state == "open");
    var addressedOpen = allOpenIssues.filter(x=>x.comments>0);

	var allBugIssues = allIssues.filter(x=>x.labels.filter(t=>t.name == "bug").length>0);
	var addressedBug = allBugIssues.filter(x=>x.comments>0);

    var	allEnhancementIssues = allIssues.filter(x=>x.labels.filter(t=>t.name == "enhancement").length>0);
	var addressedEnhancement = allEnhancementIssues.filter(x=>x.comments>0);

    var assigneeAllIssues = getAllItemsAssigneeCount(allIssues)
    , assigneeOpenIssues = getAllItemsAssigneeCount(allOpenIssues)
    , assigneeAddressedOpen = getAllItemsAssigneeCount(addressedOpen)
    , assigneeBugIssues = getAllItemsAssigneeCount(allBugIssues)
    , assigneeAddressedBug = getAllItemsAssigneeCount(addressedBug)
    , assigneeEnhancementIssues = getAllItemsAssigneeCount(allEnhancementIssues)
    , assigneeAddressedEnhancement = getAllItemsAssigneeCount(addressedEnhancement);

    var assigneesAllIssues = getAllItemsAssigneesCount(allIssues,fullAssigneesList)
    , assigneesOpenIssues = getAllItemsAssigneesCount(allOpenIssues,fullAssigneesList)
    , assigneesAddressedOpen = getAllItemsAssigneesCount(addressedOpen,fullAssigneesList)
    , assigneesBugIssues = getAllItemsAssigneesCount(allBugIssues,fullAssigneesList)
    , assigneesAddressedBug = getAllItemsAssigneesCount(addressedBug,fullAssigneesList)
    , assigneesEnhancementIssues = getAllItemsAssigneesCount(allEnhancementIssues,fullAssigneesList)
    , assigneesAddressedEnhancement = getAllItemsAssigneesCount(addressedEnhancement,fullAssigneesList);

    var assigneeAllIssuesDistinct= new Set(allIssues.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeOpenIssuesDistinct= new Set(allOpenIssues.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeAddressedOpenDistinct= new Set(addressedOpen.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeBugIssuesDistinct= new Set(allBugIssues.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeAddressedBugDistinct= new Set(addressedBug.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeEnhancementIssuesDistinct= new Set(allEnhancementIssues.map(x=>x.assignee!= null? x.assignee.login: null))
    , assigneeAddressedEnhancementDistinct= new Set(addressedEnhancement.map(x=>x.assignee!= null? x.assignee.login: null));

    var assigneesAllIssuesDistinct= getDistinctAssigneesList(allIssues)
    , assigneesOpenIssuesDistinct= getDistinctAssigneesList(allOpenIssues)
    , assigneesAddressedOpenDistinct= getDistinctAssigneesList(addressedOpen)
    , assigneesBugIssuesDistinct= getDistinctAssigneesList(allBugIssues)
    , assigneesAddressedBugDistinct= getDistinctAssigneesList(addressedBug)
    , assigneesEnhancementIssuesDistinct= getDistinctAssigneesList(allEnhancementIssues)
    , assigneesAddressedEnhancementDistinct= getDistinctAssigneesList(addressedEnhancement);
   
	/* Prepare data for bubble chart using data from Assignee */
    var bubbleChartObjDataAssignee = new Array();
    bubbleChartObjDataAssignee.push(buildBubbleChartData(
        "Open Issues",assigneeOpenIssues,assigneeOpenIssuesDistinct));
    bubbleChartObjDataAssignee.push(buildBubbleChartData(
        "Addressed Open",assigneeAddressedOpen,assigneeAddressedOpenDistinct));
    bubbleChartObjDataAssignee.push(buildBubbleChartData(
        "Bug Issues",assigneeBugIssues,assigneeBugIssuesDistinct));
    bubbleChartObjDataAssignee.push(buildBubbleChartData(
        "Addressed Bug",assigneeAddressedBug,assigneeAddressedBugDistinct));
    bubbleChartObjDataAssignee.push(buildBubbleChartData(
        "Enhancement Issues",assigneeEnhancementIssues,assigneeEnhancementIssuesDistinct));
    bubbleChartObjDataAssignee.push(buildBubbleChartData(
        "Addressed Enhancement",assigneeAddressedEnhancement,assigneeAddressedEnhancementDistinct));

    var bubbleChartDataAssignee = new Array();
    for (var ii=0; ii<bubbleChartObjDataAssignee.length;ii++){
        var objList = bubbleChartObjDataAssignee[ii];
        for (var jj=0; jj<objList.length; jj++){
            bubbleChartDataAssignee.push(objList[jj]);
        }
    }
    /* Add a bubble chart on tab1 */
    var bubbleChart4Issues = bubbleChart().width(300).height(250);
    d3.select('#bubbleChart').data(bubbleChartDataAssignee).call(bubbleChart4Issues);

	/* Prepare data for bubble chart on tab2 */
    var bubbleChartData4Assignee = new Array();
    assigneeAllIssuesDistinct.forEach(function(el){
        if (el != null) { var count=0;
            bubbleChartObjDataAssignee.forEach(b=>{
                if(b.length>0){b.forEach(c=>{
                    if(el==c.title){count +=c.views;}})
                }
            })
            if(count>0){ 
                bubbleChartData4Assignee.push({ category: el, title: "related issues assigned:", views: count });
            }
        }
    })
    
    var bubbleChart4Issues2 = bubbleChart().width(300).height(250).allIssues4AssigneeTable(allIssues);
    d3.select('#bubbleChart2').data(bubbleChartData4Assignee).call(bubbleChart4Issues2);

    // Prepare data for bubble chart using data from Assignees 
    var bubbleChartObjDataAssignees = new Array();
    bubbleChartObjDataAssignees.push(buildBubbleChartData(
        "Open Issues",assigneesOpenIssues,assigneesOpenIssuesDistinct));
    bubbleChartObjDataAssignees.push(buildBubbleChartData(
        "Addressed Open",assigneesAddressedOpen,assigneesAddressedOpenDistinct));
    bubbleChartObjDataAssignee.push(buildBubbleChartData(
        "Bug Issues",assigneesBugIssues,assigneesBugIssuesDistinct));
    bubbleChartObjDataAssignees.push(buildBubbleChartData(
        "Addressed Bug",assigneesAddressedBug,assigneesAddressedBugDistinct));
    bubbleChartObjDataAssignees.push(buildBubbleChartData(
        "Enhancement Issues",assigneesEnhancementIssues,assigneesEnhancementIssuesDistinct));
    bubbleChartObjDataAssignees.push(buildBubbleChartData(
        "Addressed Enhancement",assigneesAddressedEnhancement,assigneesAddressedEnhancementDistinct));
    
    var bubbleChartDataAssignees = new Array();
    for (var ii=0; ii<bubbleChartObjDataAssignees.length;ii++){
        var objList = bubbleChartObjDataAssignees[ii];
        for (var jj=0; jj<objList.length; jj++){
            bubbleChartDataAssignees.push(objList[jj]);
        }
    }

    var checkit=true;

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

var getDistinctAssigneesList=function(Issues){
    var distinctAssigneesList=[];
    distinctAssigneesList.push("NoLogin");
    Issues.forEach(x=>{ 
        if(x.assignees != undefined ) {
            x.assignees.forEach(y=>{
                var pushIt = true;
                distinctAssigneesList.forEach(t=>{
                    if(t==y.login){pushIt = false;}
                })
                if(pushIt){distinctAssigneesList.push(y.login);}
            })         
        }
    })
    distinctAssigneesList.splice(0,1);  //remove "NoLogin";
    return distinctAssigneesList;
}

var getAllItemsAssigneesCount=function(Issues,Assignees){
    var assigneesCounts = [];
    Assignees.forEach(q=>{ assigneesCounts[q]=0;});
    if (Issues.length>0) {
            Issues.forEach(i=>{
                if(i.assignees != undefined) { 
                    i.assignees.forEach(s=>{
                        Assignees.forEach(as=>{
                            if(as==s.login){
                                assigneesCounts[as] += 1; 
                            }
                        })
                    })    
                }          
            })
        }
    return assigneesCounts;
}


/* 
Code Used in Sample d3 Bubble Charting from Internet Below
*/
function bubbleChart() {
    var width = 960, height = 960, maxRadius = 6, forceStrength=-50,
        columnForColors = "category", columnForRadius = "views";
    var allIssues4AssigneeTable= []; 

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
            .style("width", "200px")
            .text("");


        var simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength([forceStrength]))
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
        .range([5, 30])

        var node = svg.selectAll("circle").data(data).enter().append("circle")
            .attr('r', function(d) { return scaleRadius(d[columnForRadius]);})
            .style("fill", function(d) { return colorCircles(d[columnForColors]);})
            .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
            .on("mouseover", function(d) {
                tooltip.html(d[columnForColors] + "<br>" + d.title + "<br>" + d[columnForRadius] + " counts");
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY - 10) + "px")
                              .style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                return tooltip.style("visibility", "hidden");
            })
            .on("click", function(d) {
                return makeTable4Assignee(d.category);
            });
    }

    var makeTable4Assignee= function(assignee){
        alert("make a table for : " + assignee)
        var all=allIssues4AssigneeTable;
        var check=true;
    }

    chart.allIssues4AssigneeTable = function(allIssues) {
        if (!arguments.length) {
            return [];
        }
        allIssues4AssigneeTable = allIssues;
        return chart;
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

    chart.forceStrength = function(value) {
        if (!arguments.forceStrength) {
            return forceStrength;
        }
        forceStrength = value;
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
