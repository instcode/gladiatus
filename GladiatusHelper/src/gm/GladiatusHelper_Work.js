/**
 * Gladiatus Helper - Work Module
 * Display work status.
 *
 * @copyright (C) 2008, DDTH.ORG
 * @history
 *   2008.08.28
 *     - First version
 */
 
/*********** SETTING UP ***********/
var timeRemainingArena = 0;
var timeRemainingWorld = 0;
var timeRemainingWork  = 0;

var divWorkStatus = document.getElementById('panelWorkStatus');
/*********** SETTING UP ***********/

function workDisplayWorkStatus() {
	var str = '<table border="0" cellpadding="2" cellspacing="0" style="font-size:10px; border: 1px solid #c0c0c0;">';
	str += '<tr><td colspan="2" align="center" style="border-bottom: 1px solid #c0c0c0; background: #e0e0e0"><b>Work Status</b></td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="'
		+ urlWork + '">Stable</a></td><td align="right" style="border-bottom: 1px solid #c0c0c0;" id="workStatusStable">---</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="' 
		+ urlArena + '">Arena</a></td><td align="right" style="border-bottom: 1px solid #c0c0c0;" id="workStatusArena">---</td></tr>';
	str += '<tr><td align="left">World</td><td align="right" id="workStatusWorld">---</td></tr>';
	str += '</table>';
	divWorkStatus.innerHTML = str;
	
	var workStatusStable=document.getElementById('workStatusStable');
	var workStatusArena=document.getElementById('workStatusArena');
	var workStatusWorld=document.getElementById('workStatusWorld');
	
	GM_xmlhttpRequest({
		method: "GET",
		url: urlWork,
		onload: function(responseDetails) {
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			
			var remainingTime = getSpanContent(pulled, 'bx0', 'id');
			if ( responseDetails.responseText.indexOf("?mod=work&cancel=1") > 0 ) {
				//100% sure that stable work is undergoing!
				if ( remainingTime != null && remainingTime != '' ) {
					workStatusStable.innerHTML = remainingTime;
					var regexp = /s=(\d+)\-Math/;
					var result = pulled.innerHTML.match(regexp);
					if ( result != null && result.length > 1 ) {
						timeRemainingWork = result[1];
						workTimerWork();
					} else {
						debug('Error while getting remaining time for [Stable Work]');
					}
				}
			} else {
				if ( remainingTime != null && remainingTime != '' ) {
					//ok, world travelling is undergoing
					workStatusWorld.innerHTML = remainingTime;
					var regexp = /s=(\d+)\-Math/;
					var result = pulled.innerHTML.match(regexp);
					if ( result != null && result.length > 1 ) {
						timeRemainingWorld = result[1];
						workTimerWorld();
					} else {
						debug('Error while getting remaining time for [World Travelling]');
					}
				}
			}			
		}
	});
	
	GM_xmlhttpRequest({
		method: "GET",
		url: urlArena,
		onload: function(responseDetails) {
			pulled = document.createElement('div'); 	
			pulled.innerHTML = responseDetails.responseText;
			
			var remainingTime = getSpanContent(pulled, 'bx0', 'id');
			if ( remainingTime != null && remainingTime != '' ) {
				workStatusArena.innerHTML = remainingTime;
				var regexp = /s=(\d+)\-Math/;
				var result = pulled.innerHTML.match(regexp);
				if ( result != null && result.length > 1 ) {
					timeRemainingArena = result[1];
					workTimerArena();
				} else {
					debug('Error while getting remaining time for [Arena]');
				}
			}
		}
	});
}

function workTimerArena() {
	var div = document.getElementById('workStatusArena');
	if ( updateTimer(div, timeRemainingArena) ) {
		setTimeout(workTimerArena, 999);
	}
}

function workTimerWorld() {
	var div = document.getElementById('workStatusWorld');
	if ( updateTimer(div, timeRemainingWorld) ) {
		setTimeout(workTimerWorld, 999);
	}
}

function workTimerWork() {
	var div = document.getElementById('workStatusStable');
	if ( updateTimer(div, timeRemainingWork) ) {
		setTimeout(workTimerWork, 999);
	}
}
