var qs = (function(a) {
  	    if (a == "") return {};
  	    var b = {};
  	    for (var i = 0; i < a.length; ++i)
  	    {
  	        var p=a[i].split('=');
  	        if (p.length != 2) continue;
  	        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
  	    }
  	    return b;
  	})(window.location.search.substr(1).split('&'));
var user;
var user_repos;
var mRepos;
var token ;
var json ;
var mIssues; var mPulls; var mCommits; var mReleases;
$(document).ready(function(){
		$("#email").val("vais-ral");
		$( "#progressbar" ).progressbar({
		  value: true,
		  optional_text : "",
		  disabled: false,
		  change: function() {
			$( ".progress-label" ).text( $( "#progressbar" ).progressbar( "value" ) + "%" );
      }
		})
		.hide();
		if (qs['access_token'] != undefined ) 
			token = qs['access_token'];
		
		$("#public_repos").click(getPublicRepositories).hide();
		$('#private_repos').click(getPrivateRepositories).hide();
		
		//create the UI without user intervention
		mRepos = []
		/*
		var pars = {'user' : 'CCPPETMR' , 'what_to_get' : 'repositories'  };
		fetchData( pars, 1 , data => { data.forEach(x=> {fillOptions(x); mRepos.push(x);});
										getPrivateRepositories(); 
									} );
		*/
		getPrivateRepositories();
		/* Add tabs control click events here */
		$('ul.tabs li').click(function(){ var tab_id = $(this).attr('data-tab');
		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');
		$(this).addClass('current');
		$("#"+tab_id).addClass('current');

		})
		
});




/*************** REPOSITORIES ********************/
var getPublicRepositories = function ( user ) {
	json = []
	var pars = {'user' : user , 'what_to_get' : 'repositories'  };
	fetchData( pars, 1 , storeRepos);
}
var storeRepos= function (data) {
	/**
	Creates the interface without user intervention. The buttons are not displayed
	**/

	// fill spinner and store to global variable;
	//mRepos = [];
	data.forEach(x=> {fillOptions(x); mRepos.push(x);});
	
	// add button to query Issues For repo
	$(".form").append("<input type=\"button\" id=\"fetch_issues\" value=\"Issues\"></input>");
	$("#fetch_issues").click(function (){ 
		getIssuesForRepo(
			$('#repos_selector').val(), 
			function(data){{mIssues = [];  data.forEach(x=> mIssues.push(x)); } }
			);
	})
	.hide();
	// add button to query Pulls For repo
	$(".form").append("<input type=\"button\" id=\"fetch_pulls\" value=\"Pull Requests\"></input>");
	$("#fetch_pulls").click(function (){ 
		getPullsForRepo(
			$('#repos_selector').val(),
			function(data){{mPulls = [];  data.forEach(x=> mPulls.push(x)); } }
			);
	})
	.hide();
	// add button to query COMMITS For repo
	$(".form").append("<input type=\"button\" id=\"fetch_commits\" value=\"Commits\"></input>");
	$("#fetch_commits").click(function (){ 
		getCommitsForRepo(
			$('#repos_selector').val(),
			function(data){{mCommits = [];  data.forEach(x=> mCommits.push(x)); } }
			);
	})
	.hide();
	// add button to query RELEASES For repo
	$(".form").append("<input type=\"button\" id=\"fetch_releases\" value=\"Releases\"></input>");
	$("#fetch_releases").click(function (){ 
		getReleasesForRepo(
			$('#repos_selector').val(),
			function(data){{mReleases = [];  data.forEach(x=> mReleases.push(x)); } }
			);
	})
	.hide();
	
	// add button to create the UI for all repositories
	$(".form").append("<input type=\"button\" id=\"create_ui\" value=\"Create UI\"></input>")
	.hide();
	$("#create_ui").click( createUI );
	//create the UI without user intervention
	createUI();
}





var getPrivateRepositories = function () {
	user = $("#email").val();
	json = [];
	var pars = {'what_to_get' : 'private_repositories' , 'user' : user, 'access_token' :token};
	$(".form").append("<select id=\"repos_selector\"></select>");
	
	fetchData( pars, 1 , storeRepos);
}


var fillOptions = function(el) {
	$("#repos_selector").append("<option " + 
		//"onselect=\"getBranches(\""+ el +"\");\" " + 
		" value=\""+ el.name +"\">"+ el.name +"</option>");
} 

/***********************************/

/*************** ISSUES ********************/
var getIssuesForRepo = function (repo_full_name, repo_name, callback) {
	json = [];
	user = $("#email").val();
	var i = mRepos.findIndex(x => x.full_name == repo_full_name) ;
	if (! mRepos[i].private) {
		user = mRepos[i].owner.login;
	}
	//YYYY-MM-DDTHH:MM:SSZ
	// one could add parameters from this list
	//milestone	integer or string	If an integer is passed, it should refer to a milestone by its number field. If the string * is passed, issues with any milestone are accepted. If the string none is passed, issues without milestones are returned.
	//state	    string	Indicates the state of the issues to return. Can be either open, closed, or all. Default: open
	//assignee	string	Can be the name of a user. Pass in none for issues with no assigned user, and * for issues assigned to any user.
	//creator	string	The user that created the issue.
	//mentioned	string	A user that's mentioned in the issue.
	//labels	string	A list of comma separated label names. Example: bug,ui,@high
	//sort	    string	What to sort results by. Can be either created, updated, comments. Default: created
	//direction	string	The direction of the sort. Can be either asc or desc. Default: desc
	//since	    string	Only issues updated at or after this time are returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	var pars = {'what_to_get': 'issues','user' : user, 'repo_name' : repo_name , 'state' : 'all' , 'access_token' :token};
	fetchData(pars, 1 , callback );
}
/******************************************/
/*************** PULLS ********************/
var getPullsForRepo = function (repo_name, callback) {
	json = [];
	user = $("#email").val();
	/**
	Additional query parameters
	state	    string	Either open, closed, or all to filter by state. Default: open
	head	    string	Filter pulls by head user and branch name in the format of user:ref-name. Example: github:new-script-format.
	base	    string	Filter pulls by base branch name. Example: gh-pages.
	sort	    string	What to sort results by. Can be either created, updated, popularity (comment count) or long-running (age, filtering by pulls updated in the last month). Default: created
	direction	string	The direction of the sort. Can be either asc or desc. Default: desc when sort is created or sort is not specified, otherwise asc.
	**/
	var pars = {'what_to_get': 'pulls','user' : user, 'repo_name' : repo_name , 'state' : 'all' , 'access_token' :token};
	fetchData( pars, 1 , callback);
}

/*************** COMMITS ********************/
var getCommitsForRepo = function (repo_full_name, repo_name, callback) {
	json = [];
	user = $("#email").val();
	var i = mRepos.findIndex(x => x.full_name == repo_full_name) ;
	if (! mRepos[i].private) {
		user = mRepos[i].owner.login;
	}
	/** api parameters
	sha		string	SHA or branch to start listing commits from. Default: the repository’s default branch (usually master).
	path	string	Only commits containing this file path will be returned.
	author	string	GitHub login or email address by which to filter by commit author.
	since	string	Only commits after this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	until	string	Only commits before this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	**/
	// limit to ONE_YEAR
	var last_ninetydays = Date.now() - NINETY_DAYS;
	console.log(new Date(last_ninetydays).toISOString());
	var pars = {'what_to_get': 'commits','user' : user, 'repo_full_name' : repo_full_name, 'repo_name' : repo_name , 'access_token' :token , 'since' : new Date(last_ninetydays).toISOString()};
	fetchData(pars, 1 , callback);
}

var getAllCommitsForRepo = function (repo_full_name, repo_name, callback) {
	json = [];
	user = $("#email").val();
	/** api parameters
	sha		string	SHA or branch to start listing commits from. Default: the repository’s default branch (usually master).
	path	string	Only commits containing this file path will be returned.
	author	string	GitHub login or email address by which to filter by commit author.
	since	string	Only commits after this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	until	string	Only commits before this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	**/
	// limit to ONE_YEAR
	var last_ninetydays = Date.now() - NINETY_DAYS;
	console.log(new Date(last_ninetydays).toISOString());
	mBranches = [];
	hCommits =[] ;
	getBranchesForRepo(repo_full_name, repo_name, x=>{
			if (x.length == 0) {
				getCommitsForRepo(repo_full_name, repo_name, callback);
			}
			else {
				var isDone = 0;
				xCommits = [];
				x.forEach(branch=>{
					console.log("Getting commits for branch " + branch.name + " on " + repo_name);
					mBranches.push(branch);
					var pars = {'what_to_get': 'commits','user' : user, 'repo_name' : repo_name , 'sha' : branch.name , 'access_token' :token , 'since' : new Date(last_ninetydays).toISOString()};
				
					fetchData(pars, 1 , y=>{
						console.log("Done branch " + branch.name + " on " + repo_name + " with " + y.length + " commits");
						isDone++; 
						if (isDone == x.length) {
							hCommits.push(y);
							ms = new Set(hCommits);
							ma = []; ms.forEach(x=>ma.push(x));
							callback.call (this , ma);
						} else {
							hCommits.push(y);
						}
						});
					
				}
				);
			}		
		}
	);
}

/******************************************/

/*************** RELEASES ********************/
var getReleasesForRepo = function (repo_full_name, repo_name, callback) {
	json = [];
	user = $("#email").val();
	/** api parameters
	sha		string	SHA or branch to start listing commits from. Default: the repository’s default branch (usually master).
	path	string	Only commits containing this file path will be returned.
	author	string	GitHub login or email address by which to filter by commit author.
	since	string	Only commits after this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	until	string	Only commits before this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	**/
	var pars = {'what_to_get': 'releases', 'user' : user, 'repo_full_name' : repo_full_name, 'repo_name' : repo_name , 'access_token' :token};
	fetchData(pars, 1 , callback);
}

/*************** BRANCHES ********************/
var getBranchesForRepo = function (repo_full_name, repo_name, callback) {
	json = [];
	user = $("#email").val();
	/** api parameters
	sha		string	SHA or branch to start listing commits from. Default: the repository’s default branch (usually master).
	path	string	Only commits containing this file path will be returned.
	author	string	GitHub login or email address by which to filter by commit author.
	since	string	Only commits after this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	until	string	Only commits before this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	**/
	var pars = {'what_to_get': 'branches', 'user' : user, 'repo_full_name' : repo_full_name, 'repo_name' : repo_name , 'access_token' :token};
	fetchData(pars, 1 , callback);
}

/******************************************/
/**
fetchData: 	performs an asynchronous AJAX call to a REST api. 
			It possibly makes recursive calls to the API when data are paginated. GitHub paginates with 30 result per page.
			
			pars: 	dict object containing the parameters for the query that are passed to the function getApiUrl
				pars contains the access_token for authenticated use of the API. This should be moved to getApiUrl.
			page:   int  used with paginated data. This is a hack. Github returns data paginated with 30 results per page. Data about paging is
						 given in the header of the HTTP response. We do not get it here with a AJAX call.
			per_page: int used to force 30 item pagination. Do not change unless development of correct pagination handling.
			callback: function  what to do when the data has come back? The array of objects are passed to a function (data)
			localresult: array  used with paginated data (still a hack)

**/
var pagination = [];
var fetchData = function (pars, page, callback, localresults){
	
	if (page == undefined) {
		page = 1;
		pagination = [];
	}
	
	dataPars = {access_token : token, 'page' : page , 'per_page' : 30};
	dataPars = $.extend(dataPars, pars);
	
	var ajaxPars = {
		url: getApiUrl(pars),
		type : "GET",
		data : dataPars,
		beforeSend: function(jqXHR, settings ) { 
			
			return true;
		} ,
		complete: function( jqXHR, textStatus ){
			
		} , 
		error: function(){
			if (callback) callback.call(this, []);
		}, 
		fail: function(err) { alert (err); },
		success: function (data, textStatus, jqXHR) {
			//json = data;
			
			pagination.push(jqXHR.getResponseHeader('Link'));
			
			// CONTINUE FROM HERE
			//rgx = new RegExp("/<([^>]+)>; rel=\"next\"/")
			//if (rgx.match()
			
			//console.log("pagination " + pagination);
			console.log("success");
			if (data.constructor === Array){
				if (data.length == 30) {
					// if the returned data are exactly 30: suspicious => may be paginated data
					// check if we have to do a recursive call: if we have already got the results we don't proceed.
					var allpresent = false;
					if (localresults == undefined ) {
						localresults = data;
					}
					else if (localresults.length == 0) {
						data.forEach(x=> localresults.push(x));
					} else {
						// use a temporary array to store data while iterating through the localresults array before adding them to localresults
						var loc = [];
						data.forEach(x=> { if (localresults.findIndex(y => y == x) == -1) { loc.push(x) ; } 
										   else {/*console.log("already found");*/}
										 });
						if (loc.length > 0) {loc.forEach(x=>localresults.push(x));}
						else {allpresent = true;}
						//console.log("added " +loc.length + " records")
						
					}
					// try with next page
					//console.log("try next page " + (page +1));
					if (!allpresent) fetchData(pars, page+1, callback, localresults);
					else {
						if (callback) callback.call (this , localresults);
					}
					
				} else {
					// get the data
					ret = data;
					if (localresults != undefined) {
						data.forEach(x=> localresults.push(x));
						ret = localresults;
					}
					if (callback) callback.call (this, ret);
				}
			
			} else { 
				// return empty data
				if (callback) callback.call(this, []);
			}
			
			
		} ,
		
	};
	console.log(ajaxPars.url);
	$.ajax(ajaxPars);

}

/**
getApiUrl: 	returns the URL to perform the query to the REST API. 
			//TODO should be made as a class able to return more than just the URL. 
			// i.e. getApiUrl() , getMethod() -> GET/POST etc
			
			Currently made for GitHub API, it is extensible easily to other API's.
			
			pars: 	dict object containing the parameters to build the query URL. It MUST contain:
				what_to_get:   string  defines what you want to get from the API
				It MAY contain:
				user:          string  a user (for Github is the owner of the repository)
				repo_name:     string  the name of the repository
				

**/
var getApiUrl =  function(pars){
		var what_to_get = pars.what_to_get;
		var base_url = "https://api.github.com/";
        var gotourl ; 
		switch(what_to_get){
			case "repositories":
			//GET /users/:username/repos
				gotourl = "users/" + pars.user + "/repos";
				break;
			case "private_repositories" :
				gotourl = "user/repos";
				break;
			case "repository":
				gotourl = "repos/"+pars.user+"/"+pars.repo_name;
				break;
			case "file":
				break;
			// per repository
			case "issues":
				gotourl = "repos/"+pars.user+"/"+pars.repo_name+"/issues";
				break;
			case "last commit":
				break;
			case "day of last release":
				break;
			case "merged pull requests":
				break;
			case "committers":
				break;
			case "commits pp":
				break;
			// Docker
			case "Docker tests":
				break;
			case "pulls":
				gotourl = "repos/"+pars.user+"/"+pars.repo_name+"/pulls";
				break;
			case "commits":
				gotourl = "repos/"+pars.user+"/"+pars.repo_name+"/commits";
				break;
			case "releases":
				gotourl = "repos/"+pars.user+"/"+pars.repo_name+"/releases";
				break;
			case "branches":
				gotourl = "repos/"+pars.user+"/"+pars.repo_name+"/branches";
				break;

		}
		return base_url + gotourl;
	}
	
var daysFromNow = function(iso8601str) {

	var past = Date.parse(iso8601str);
	var now = Date.now();
	var diff = now-past;
	var fDays = diff / (24 * 60 *60 *1000); // elapsed days float
	var nDays = Math.floor(fDays);
	var fHours = (fDays - nDays) * 24 ;
	var nHours = Math.floor(fHours);
	var fMins = (fHours - nHours) * 60;
	var nMins = Math.floor(fMins);
	var fSec = fMins - nMins;
	
	var rte = (nDays > 0? nDays + " days " : "") + 
			  (nHours< 10 ? "0" : "") + nHours + " hours " + 
			  (nMins < 10 ? "0" : "" ) +  nMins + " minutes";
	//console.log(rte);
	return rte;

}

var ONE_DAY = 24 * 60 * 60 * 1000;
var NINETY_DAYS = 90 * ONE_DAY;
var THIRTY_DAYS = 30 * ONE_DAY;
var SIX_MONTHS = 182 * ONE_DAY; // about half year
var RED = "#F2052D";
var ORANGE = "#FFA500";
var GREEN = "#00FF7F";
var GREY = "#CCCCCC";

var getTrafficLight = function(lastmillis, type){
	/** returns a color if a number is shorter than
	if intended to return a color if number is larger than you must pass negative numbers and negative thresholds , see type pull) 
	**/
	
	var THRESHOLD_LONG = NINETY_DAYS;
	var THRESHOLD_SHORT = THIRTY_DAYS;
	if (type == 'release') {
		THRESHOLD_LONG = SIX_MONTHS;
		THRESHOLD_SHORT = NINETY_DAYS;
	} else if (type == 'pull') {
		THRESHOLD_LONG = -0.5;
		THRESHOLD_SHORT = -0.1;
		if (lastmillis == -200) lastmillis = 0;
	}
	
	if ( lastmillis > THRESHOLD_LONG){
		color = RED;
	} else if (lastmillis > THRESHOLD_SHORT){ 
		color = ORANGE; 
	} else if (lastmillis == 0){
		color = GREY;
	} else {
		color = GREEN;
	} 
	return color;
}

var getColor = function(lastmillis, type){
	var colorstr = getTrafficLight(lastmillis, type);
	if (colorstr == RED) { return "red"; } 
	else if (colorstr == ORANGE) { return "orange"; }
	else if (colorstr == GREEN ) { return "green";  }
	else if (colorstr == GREY  ) { return "grey";   }
}

/******************** PAINT *************************************/
var createUI = function(){
	// give information to user that data is being downloaded
	$( "#progressbar" ).show();
	
	
	/** Repository	
	Addressed issues 90 days	
	Pull Requests merged	
	Pull Requests merged 90 days	
	Release	Commits in 90days	
	Contributors
	****/
	
	
	recursivePaint(0);
	
	
}


var recursivePaint = function(i){
    i = progress.fetched;
	if (i < mRepos.length) {
		var x = mRepos[i];
		progress = { issues: false, commits: false , fetched: i};
		fetchDataAndPaint(x);
	}
}

// pulls and releases are not interesting indicators for us
var progress = {issues: false, commits: false, fetched: 0};

var fetchDataAndPaint = function (repository){
	var i = mRepos.findIndex(x => x.full_name == repository.full_name) ;
	$( "#progressbar" ).progressbar( "value", Math.floor(progress.fetched / mRepos.length * 100) );
	
	if (i >= 0 && repository.name != 'test') {
		console.log("Fetching data " +i+ " name " + mRepos[i].name);
		// issues
		getIssuesForRepo(mRepos[i].full_name , mRepos[i].name , 
						function(data){
							console.log(progress);
							mIssues = [];  // store the issues in an array
							if (! ( data.constructor === Array )) data = [];
							data.forEach(x=> mIssues.push(x)); 
							// plot only when all data is fetched
							progress.issues = true;
							// get an array from the object
							var mp = Object.keys(progress).map(function (key) { return progress[key]; });
							mp.pop();
							if ( mp.reduce((a,b) => a&&b) ) {
								console.log(mRepos[i].name + " getIssues launches paint");
								
								// if all are true, we can plot
								//create the data for tabulator
								makeTabulatorData(i);
								collectData(i);
								// recursive call
								recursivePaint(i+1);
							}
						}
						);
		// commits
		getAllCommitsForRepo(mRepos[i].full_name , mRepos[i].name ,
						function(data){
							mCommits = [];  // store the issues in an array
							if (! ( data.constructor === Array )) data = [];
							data.forEach(x=> mCommits.push(x)); 
							// plot only when all data is fetched
							progress.commits = true;
							// get an array from the object
							var mp = Object.keys(progress).map(function (key) { return progress[key]; });
							mp.pop();
							if ( mp.reduce((a,b) => a&&b) ) {
								console.log(mRepos[i].name + "getAllCommits launches paint");
								// if all are true, we can plot
								//create the data for tabulator
								makeTabulatorData(i);
								collectData(i);
								// recursive call
								recursivePaint(i+1);
							}
						});
		
	}
	if (repository.name == 'test') {
		// recursive call
		recursivePaint(i+1);
	}
}

var dataset = []
var collectData = function (i){
	console.log("calling collectData for " + mRepos[i].full_name);
	repoid = mRepos[i].id ;
	dataset.push( {issues: mIssues , commits : mCommits, repo: mRepos[i]} );
	
}
var tabulatorData = []
var makeTabulatorData = function (i){
	progress.fetched = progress.fetched + 1;
	//repo_name issues merged_pulls merged_pulls90 releases commits contributors
	/** Issues **/
	
	/** Basic issues indicator is the total number/closed/addressed issues **/
	var all_issues = mIssues.length;
	var m_open = mIssues.filter(x=>x.state == "open");
	var open_issues = m_open.length;
	var closed_issues = all_issues - open_issues;
	if (open_issues > 0) {
	/* get the open issues that have not been updated in the last 90 days and which have been updated once!
	mIssues.filter(x=>x.state == "open")
	       .filter(x=>Date.now() < Date.parse(x.updated_at) < NINETY_DAYS)
		   .filter(x=>Date.parse(x.created_at) != Date.parse(x.updated_at) );
	*/
		// addressed issues have comments or are closed	   
		open_issues = mIssues.filter(x=>x.state == "open").filter(x=>x.comments > 0).length;
		
		open_issues_text = "" + (open_issues + closed_issues ) + " / " + all_issues;
	} else { 
		open_issues_text = "0 / " + all_issues ;
	}
	
	var theIssue = null;
	var j = 0;
	
	if ( mIssues.length>= j+1){
		console.log ("============ " + typeof mIssues[j]);
		if (typeof mIssues[j] != 'undefined'){
			while (mIssues[j].hasOwnProperty('pull_request')) {
				console.log ("============ " + typeof mIssues[j] + " " + j);
			
				j = j+1;
			}
			theIssue = mIssues[j];
		}
	}
	
	open_issues_object = {'text' : open_issues_text , 
						'html_url' : createHtmlUrlIssueList(theIssue, 'isOpen'),
						'open_issues' : open_issues,
						'all_issues' : all_issues}
	
	/** issues_bug
	Check the issues labeled as bug.
	**/
	var open_all = m_open.filter(x=>x.labels.filter(t=>t.name == "bug").length>0);
	var addressed = open_all.filter(x=>x.comments>0);
	var issues_bug = addressed.length + " / " + open_all.length;
	issues_bug_text =""+issues_bug
	issues_bug_object = {'text' : issues_bug_text ,
						'html_url' : createHtmlUrlIssueList(theIssue, 'bug'),
						'issues_bug': issues_bug,
						'all_bugs': open_all.length,
											}
	/** issues_enhancement
	Check the issues labeled as enhancement.
	**/
	open_all = m_open.filter(x=>x.labels.filter(t=>t.name == "enhancement").length>0);
	addressed = open_all.filter(x=>x.comments>0);
	var issues_enhancement = addressed.length + " / " + open_all.length;
	issues_enhancement_text= "" + issues_enhancement
	issues_enhancement_object = {'text' : issues_enhancement_text ,
						'html_url' : createHtmlUrlIssueList(theIssue, 'enhancement'),
						'issues_enhancements' : issues_enhancement,
						'all_enhancements': open_all.length,
											};
	
	
	/*********************** commits ********************************/
	// who's contributing to the code.
	var contributors, full_names ;
	var numcomm = 0;
	//if (mBranches.length == 1) {
	//	contributors = new Set(mCommits[0].map(x=>x.commit.author.name ));
	//	numcomm = mCommits[0].length;
	//} else {
		allCommits = mCommits.reduce((a,x)=> a.concat(x), []);
		numcomm = allCommits.length;
        contributors = new Set(allCommits.map(x=>x.commit.author.name ));
	//}
	var asList = []; contributors.forEach(x=> asList.push(x));
	var str = (asList.length > 0 ?  asList.reduce((a,b)=> a+", " + b) : "");
	

    // recursive call
	tabulatorData.push(
        {'id' : i,
		'selectBox' : {'text' : mRepos[i].full_name.split("/")[0], 'id':i},
        'owner' : {'text' : mRepos[i].full_name.split("/")[0] },
		'repo_name' : {'text' : mRepos[i].name ,'html_url' : mRepos[i].html_url},
		'issues' : open_issues_object,
		'issues_bug' : issues_bug_object,
		'issues_enhancement' : issues_enhancement_object,

		'commits' : {'text' : numcomm }, // sum the commits of the branches
		'contributors' : {'text' : contributors.size, 'ctrnames' : str } }
	);
	
	// test to see if we are finished
	if (progress.fetched == mRepos.length) {
		//$('#performance-table').tabulator('setData' , tabulatorData);
		$( "#progressbar" ).hide();
		// draw the table now
		hdr = ['selectBox','Owner','Repository' , 'Addressed issues 90 days' , 'bugs' , 'enhancements' , 'Commits' ,  'Contributors'];
		hdr_db = ['selectBox','owner' , 'repo_name' , 'issues' , 'issues_bug' , 'issues_enhancement' , 'commits' , 'contributors' ];
	    makeTable(tabulatorData, hdr, hdr_db, "#performance-table-d3");
		makeBubbleChart(dataset);
		makeHistogramChart(dataset);
		//makeDevTable(dataset);
	}
	
}

var createHtmlUrlIssueList =  function(repo_issue, objective) {
	if (repo_issue != null){
		//! creates the url to navigate to the proper GitHub issue 
		var base_url = repo_issue.html_url.substr(0,repo_issue.html_url.lastIndexOf('/'));
		var filter = "is%3Aopen+is%3Aissue+label%3A" + objective;
		if (objective == 'isOpen'){
			filter = "is%3Aopen+is%3Aissue";
		}
		return base_url + "?q=" + filter;
	} else {
		return "";
	}
}
