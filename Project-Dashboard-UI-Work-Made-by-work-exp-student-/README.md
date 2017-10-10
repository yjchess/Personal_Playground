# Task list for Project-Dashboard

```last updated```: 11 April 2017

# Introduction  
Project-Dashboard is a web-based early warning system allowing everyone to identify problem hotspots and investigate precision software development and data system development targets.

The overall aim is to provide an information hub to present Key Performance Indicators (KPIs) across a range of software and data repositories. The main audience of this application is project manager in charge of complex projects that involve both software development and data repository/archive development. We set out with the following objectives:

1. It is a web-based system so that it can be accessed universally without installation.
*  It is a real-time systems so that KPIs are updated on real-time basis, so that a manager can leverage real-time information systematically made available by services, e.g. Github, for decision making.
* It is easily extensible in that the design of the application allows easy integration with any systems that provide KPIs
 using REST APIs
* It is a visual system catered for intuitive decision making.

# Documentation #

Project Dashboard consists of a web-app that queries the GitHub API to extract KPIs and present them
on the screen. So far it creates an interactive matrix (html table).

In the following figure you see the interface
![Dashboard Screenshot](/images/screenshot-3.png)

  * By clicking on the header of the table it gets sorted on that column. 
  * By clicking on the project name you are redirected to its GitHub page
  * By clicking on the issues cells you are redirected to the proper GitHub project issues page for in-depth analysis of the indicator.

## Architectural Description ##

 A simple javascript web app with D3 visualisation, with daily updates from github and related repositories. The data are 
 tabulated by D3 and the table can be sorted by clicking on the header.

 Unauthorized web-apps can query only public data at reduced API queries per minute.
 To query the group private repositories you need to use an
 [authorized web app](https://github.com/settings/applications/new), which
 must be authorized by the _vais-ral_ user (or your user if you are contributor to the _vais-ral_ repositories).


 The app queries the GitHub API via AJAX calls. The code is extensible to other API's.

 The app resides on a web server and consists of 3 files
 1. a html file to start the authorization procedure
 * a php file to handle the authorization procedure (needed because of the Same-Origin-Policy)
 * a html file with js code to query the data from the API

## Software dependency ##

The webapp is now hosted on [http://edosil.net/stfc/authenticate2.html](http://edosil.net/stfc/authenticate2.html) (23/03/2017) ~in a docker container running Debian 8.7 (28th February 2017)~.

 1. server with php (tested with 5.3, 5.6.30), Apache2 (2.4.10)
 * (almost) any browser (tested with Chrome 56.0.2924.87 (Official Build) (32-bit))
 * jquery (2.1.0 now it is present on the same server)
 * jQuery-UI (1.12.1)
 * [D3](http://d3js.org/) (4.7.3)

## Usage ##
1. go to the Project Dashboard [auth page](http://edosil.net/stfc/authenticate2.html) ~[http://vishighmem01.esc.rl.ac.uk:1337/Project-Dashboard/authenticate2.html](http://vishighmem01.esc.rl.ac.uk:1337/Project-Dashboard/authenticate2.html)~
* get authorized with vais-ral user/password (or your id if you are contributor to the _vais-ral_ projects)
* once logged in, you will be redirected to the app
* the app fetches the data and displays to screen

## TODO ##

The TODO list moved in the [Issues/Milestone](https://github.com/vais-ral/Project-Dashboard/milestone/1) page.

# Quick Developer Guide #

To add new REST API or add new functionality one should look at two functions: getApiUrl() and fetchData()

## How to add a new KPI from Github REST APIs
1. go to index.html
2. go to javascript function - getApiUrl()
3. add a new KPI in getApiUrl()

## How to add a new REST APIs

1. go to index.html
* modify (or add a new function similar to) fetchData()  -- currently, fetchData() tailors to the 30-item [Github pagination](https://developer.github.com/guides/traversing-with-pagination/) setting.
* modify (or add a new function similar to) getApiUrl()

### Future Enhancement - Student project?
* Implement a manager config file for the thresholds of the KPIs (instead of embedding them in the javascript)
* Add a database to store historical KPIs
*	~~Real time plots~~

## KPIs

### KPIs for software/design project

1. system diagram
* use case documents

### KPIs for software development project

1. Days from the last commit (e.g. > 30 days – Alarm, 5-10 days –OK)
* Percentage of responses to the most recent issues in the last three months (< 10% -- Alarm, > 30% ok)
* Days from the last released (> 6 months – Alarm, < 6 months - OK)
* Percentage of merged pull requests in the last three months (< 10% -- Alarm, > 10% OK)
*  of people committing to the code in the last month (<1 -- Alarm, >=2 – ok)
* Percentage of commitment per person per project (%50)

### KPIs for software testing project

1. Number of Docker successful tests (<80% -- Alarm, >90% --OK)

### KPIs for Data Ingest project

1. Number of datasets ingested
* Type of datasets

### KPIs for pre-production project
(i.e. completed software development project, so without commits)

1. days from deployment

### KPIs for production service project

1. Service availability
* Service average downtime


## Screenshots

![Dashboard Screenshot](/images/screenshot-3.png)
