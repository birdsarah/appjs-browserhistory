/*USER INPUTS*/
/*The number of individual history items you would like to aggregate*/
var number_of_hits = 3000;

/*Location of your firefox profile - this is where we will look to find you places.sqlite database */
var location_of_profile = '/home/bird/.mozilla/firefox/14i4gvbc.default/'

/*****END OF USER INPUTS******/

/******************************************************************/

/* SET UP VARIABLES */
var app = require('../index.js');
var fs = require('fs');
var spawn = require("child_process").spawn;
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database( location_of_profile + 'places.sqlite', sqlite3.OPEN_READONLY);
var sql = "SELECT datetime(moz_historyvisits.visit_date/1000000,'unixepoch', 'localtime') as datetime, moz_places.url FROM moz_places, moz_historyvisits WHERE moz_places.id = moz_historyvisits.place_id AND moz_historyvisits.visit_date>1342009619000000 ORDER BY moz_historyvisits.visit_date DESC";
var settings = {
	width : 1200,
	height : 1000,
	autoResize : false,
};
var window = "the window";
var i = number_of_hits;
var writeStream, textData;
var compareArray = [];
/*END OF VARIABLES*/

//specify static routing
app.use(app.staticRouter('./public'));

// Creates a new window. Its invisible until window.show() get called.
// http://appjs/ is a special url. It is home for your application!
window = app.createWindow("http://appjs/", settings);

// Called when page load finishes.
window.on("ready", function() {
	console.log("Event Ready called");

	// Show created window
	window.show();
	
	//setup a writefile for the db data
	writeStream = fs.createWriteStream(__dirname + "/dbOut.csv");
	
	db.each(sql,function(err, row){
		var timestamp = row.datetime.split(" "),
			theDay = timestamp[0].substring(5),
			theTime = timestamp[1].substring(0, 5),
			theURL = row.url.substring(0, 110);
		textData = theDay +"," +theTime +"," +theURL +"\n";
		writeStream.write(textData);
	}, function(){
	db.close();
	});
		
		
	//use a child_process tail to get at the data from the db - need to understand what this really is and does
	var data = spawn('tail',['-f','dbOut.csv'])
	var buffer = '';
	//i = 100;//get i from top of file
	
	data.stdout.on('data', function(data) {
	        
	    	var line = (buffer + data).split('\n');
	    	compareArray[1]=line;
	    	buffer = line.pop().trim();
	    	
	    	if(i > 0){
	    	displayData('rawdata', String(line));
			groupData(); 
			
			compareArray.shift(); //shift so there's only ever 2 items in the compareArray
			}
			i--;
		
	});
	
	
});

function displayData(id, data){
	var $ = window.window.$,
	data = data.split(","),
	theDay = data[0],
	theTime = data[1],
	theURL = data[2];
	$('#'+id +' tr:last').after('<tr>' 
	+ '<td>' + theDay + '</td>' 
	+ '<td>' + theTime + '</td>' 
	+ '<td>' + theURL + '</td>' 
	+ '</tr>'); 
}


function groupData(){
	
	var currentURL = String(compareArray[1]).split(",");
		currentURL = urlParser(currentURL[2]);

	var	prevURL = String(compareArray[0]).split(",");
		prevURL = urlParser(prevURL[2]);
		
		if (prevURL == undefined) {
			return;	
		} else {
		
		//if the first two pieces match e.g. www.google or mail.google or www.timeanddata etc then we do nothing
		//if they do not match then we push the nextURL onto the end of the GroupArray signallign the end of that
		//batch of work
		if( prevURL[0] == currentURL[0] && prevURL[1] == currentURL[1] ) {
			//console.log("Match is true"); // so do nothing
			return;
		} else {
			//console.log("Match is FALSE");
			data = String(compareArray[1]);//match is false so add as new data item into groupData
			displayData('groupdata', data);
			return;
		}	
	}
}


function urlParser(url){
	if (url == undefined) {
		return;
	} else {
	url = String(url.split("://",2)[1]); //we take the bit after http:// or https://
	url = String(url.split("/",1)); //we take the bit before /
	url = String(url.split(":",1)); //we remove any port
	url = url.split("."); //we keep the remaining array which could be 1, 2, 3+ length
	return url;
	}	
}
