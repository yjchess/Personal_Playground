var makeTable = function(data, hdr, hdr_db, id) {

			//hdr = ['Repository' , 'Addressed issues 90 days' , 'bugs' , 'enhancements' , 'Max Priority'  , 'Mid Priority' , 'Low Priority', 'Commits' ,  'Contributors'];
			//hdr_db = ['repo_name' , 'issues' , 'issues_bug' , 'issues_enhancement' , ''  , ''  ,''  ,'commits' , 'contributors' ];
	    
			// sort data alphabetically on the first field
			data.sort((a,b) => {x=hdr_db[0];y=hdr_db[0]; return (x < y) ? -1 : (x > y) ? 1 : 0;})
			//svgContainer.selectAll("g");
			var sortAscending = true;
			var table = d3.select(id).append('table').attr('style' , 'font-size : 100%');
			var titles = d3.keys(hdr);
			var headers = table.append('thead').append('tr')
						   .selectAll('th')
						   .data(hdr).enter()
						   .append('th')
						   .text(x=> x)
						   .on('click', function (d,i) {
							   headers.attr('class', 'header');
							   
							   if (sortAscending) {
								 rows.sort(function(a, b) { 
									var column = hdr_db[i];
									if (column == 'issues' || column == 'issues_bug'|| column == 'issues_enhancement') {
										// sorts numerically on the percentage (v1 and v2)
										var tmp = b[hdr_db[i]].text.split(" / ");
										var v2 = -1;
										if (parseInt(tmp[1]) != 0) {
											v2 = 100 * parseFloat(tmp[0]) / parseFloat(tmp[1]);
										}
										var tmp = a[hdr_db[i]].text.split(" / ");
										var v1 = -1;
										if (parseInt(tmp[1]) != 0) {
											v1 = 100 * parseFloat(tmp[0]) / parseFloat(tmp[1]);
										}
										return (v2 < v1? -1 : (v2 > v1 ? 1: 0));
									} else {
										// sorts alphabetically on the content of the column
										return (b[hdr_db[i]].text < a[hdr_db[i]].text ? -1 : (b[hdr_db[i]].text > a[hdr_db[i]].text ? 1: 0)); 
									}
								 });
								 sortAscending = false;
								 this.className = 'aes';
							   } else {
								 rows.sort(function(a, b) { 
									var column = hdr_db[i];
									 if (column == 'issues' || column == 'issues_bug'|| column == 'issues_enhancement' ) {
									 // reverse sorts numerically on the percentage (v1 and v2)
										var tmp = b[hdr_db[i]].text.split(" / ");
										var v2 = -1;
										if (parseInt(tmp[1]) != 0) {
											v2 = 100 * parseFloat(tmp[0]) / parseFloat(tmp[1]);
										}
										var tmp = a[hdr_db[i]].text.split(" / ");
										var v1 = -1;
										if (parseInt(tmp[1]) != 0) {
											v1 = 100 * parseFloat(tmp[0]) / parseFloat(tmp[1]);
										}
										return (v2 > v1? -1 : (v2 < v1 ? 1: 0));
									} else {
										// sorts reverse-alphabetically on the content of the column
										return (b[hdr_db[i]].text > a[hdr_db[i]].text ? -1 : (b[hdr_db[i]].text < a[hdr_db[i]].text ? 1: 0)); 
									}
								});
								 sortAscending = true;
								 this.className = 'des';
							   }
							   
						   });

			var rows = table.append('tbody').selectAll('tr')
					   .data(data).enter()
					   .append('tr');
			rows.selectAll('td')
			.data(function (d, i) {
				return hdr_db.map(function (k) {
							return { 'value': d[k].text, 'name': k, 'html_url' : d[k].html_url, 'ctrnames' : d[k].ctrnames, 'id':d[k].id};
						});
			}).enter()
			.append('td')
			.attr('class', function (d) {
				if(d.name == 'owner' || d.name == 'repo_name') {
					return  "yjbc1";
				}
			})
			.attr('title', function (d) {
				if(d.name == 'contributors') {
					return d.ctrnames;
				}
			})
			.attr('data-th', function (d) {
				return d.name;
			})
			/*
			.text(function (d) {				
					return d.value;				
			})
			*/
			.html(function(d){
			if (d.name != 'selectBox'){
				return d.value;
			}
			else {
				return '<input type="checkbox" name="chkb' + d.id + '" value="'+d.value +'">';                
			}
			})
			.style('background-color' , function (d,i){ 
				var column = hdr_db[i];
				if (column == "issues"|| column == 'issues_bug'|| column == 'issues_enhancement' ) {
					var vals = d.value.split(" / ");
					var value = -1;
					if (parseInt(vals[1]) != 0) {
						value = 100 * parseFloat(vals[0]) / parseFloat(vals[1]);
					}
					
					if ( value >= 50 ) {/*addressed issues are more than half*/ 
						res = "green";
					} 
					else if (value == -1) {res = "lightgrey";}
					else {res = "red";}
					return res;
				}  else if (d.name == "contributors") {
					var res = "lightgrey";
					if (d.value > 1) {/*zero pull requests*/ res = "green";}
					return res; // must return the html or jquery element of the html for the contents of the cell;
				} else {
					return (d.value);
				}
			 
			})
			.on("click", function(d,i) { 
				if (d.html_url != undefined) {
					window.open(d.html_url, '_blank');
				}
			})   ;
			

		}
		var semaphore = function(what) {
		if (what.toLowerCase().startsWith("yes") )
				return "green ";
			else if (what.toLowerCase() == "no" || what == "?" || what == "??")
				return "red";
			else
				return "gold";
		}

		var semaphoreDevStatus = function(what){
			if (what.toLowerCase().startsWith("not") || what == "?" || what == "??")
				return "red"
			else
				return "green"
		}
