/**
 * Gladiatus Helper - Auction Module
 *
 * @copyright (C) 2008, DDTH.ORG
 * @history
 *   2008.09.10 - Backup
 *   2008.08.28
 */

 
const auctionStatusVeryShort = 'Very Short';
const auctionStatusShort     = 'Short';
const auctionStatusMedium    = 'Medium';
const auctionStatusLong      = 'Long';
const auctionStatusVeryLong  = 'Very Long';

const auctionStatusSearchVS = new Array(/>Very Short</i, /Rất ngắn/i);
const auctionStatusSearchS  = new Array(/>Short</i     , /Ngắn hạn/i);
const auctionStatusSearchM  = new Array(/>Medium</i    , /Trung hạn/i);
const auctionStatusSearchL  = new Array(/>Long</i      , /Dài hạn/i);
const auctionStatusSearchVL = new Array(/>Very Long</i , /Rất lâu/i);

const auctionTimeVS =  30*60;
const auctionTimeS  =  90*60 + auctionTimeVS;
const auctionTimeM  = 120*60 + auctionTimeS;
const auctionTimeL  = 120*60 + auctionTimeM;

/*********** AUCTION HELPER ***********/
function displayAuctionStatus() {
	var str = '<table border="0" cellpadding="2" cellspacing="0" style="font-size:10px; border: 1px solid #c0c0c0;">';
	str += '<tr><td colspan="2" align="center" style="border-bottom: 1px solid #c0c0c0; background: #e0e0e0"><b><a href="'
		+ urlAuction + '">Auction Status</a></b></td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Status</td>'
		+ '<td align="right" style="border-bottom: 1px solid #c0c0c0;" id="tdAuctionStatus">---</td></tr>';
	str += '<tr><td id="tdAuctionTimerUpper">---</td><td id="tdAuctionTimerLower">---</td></tr>';
	str += '</table>';
	divAuctionStatus.innerHTML = str;
	
	var auctionStatus = document.getElementById('tdAuctionStatus');

	GM_xmlhttpRequest({
		method: "GET",
		url: urlAuction,
		onload: function(responseDetails) {
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			var div = xpathQuery('.//span[@class="description_span_right"]', pulled);
			if ( div != null ) {
				auctionStatus.innerHTML = div.snapshotItem(0).innerHTML;
				for ( var i = 0; i < auctionStatusSearchVS.length; i++ ) {
					if ( auctionStatus.innerHTML.match(auctionStatusSearchVS[i]) ) {
						displayAuctionTimer(auctionStatusVeryShort);
						return;
					}
				}
				for ( var i = 0; i < auctionStatusSearchS.length; i++ ) {
					if ( auctionStatus.innerHTML.match(auctionStatusSearchS[i]) ) {
						displayAuctionTimer(auctionStatusShort);
						return;
					}
				}
				for ( var i = 0; i < auctionStatusSearchM.length; i++ ) {
					if ( auctionStatus.innerHTML.match(auctionStatusSearchM[i]) ) {
						displayAuctionTimer(auctionStatusMedium);
						return;
					}
				}
				for ( var i = 0; i < auctionStatusSearchL.length; i++ ) {
					if ( auctionStatus.innerHTML.match(auctionStatusSearchL[i]) ) {
						displayAuctionTimer(auctionStatusLong);
						return;
					}
				}
				for ( var i = 0; i < auctionStatusSearchVL.length; i++ ) {
					if ( auctionStatus.innerHTML.match(auctionStatusSearchVL[i]) ) {
						displayAuctionTimer(auctionStatusVeryLong);
						return;
					}
				}
			}
		}
	});
}

var auctionTimeUpper = 0;
var auctionTimeLower = 0;
var auctionTimeCode = null;

function displayAuctionTimer(auctionCode) {
	auctionTimeCode = auctionCode;
	if ( auctionCode == auctionStatusVeryShort ) {
		auctionTimeUpper = auctionTimeVS;
	} else if ( auctionCode == auctionStatusShort ) {
		auctionTimeUpper = auctionTimeS;
	} else if ( auctionCode == auctionStatusMedium ) {
		auctionTimeUpper = auctionTimeM;
	} else if ( auctionCode == auctionStatusLong ) {
		auctionTimeUpper = auctionTimeL;
	} else {
		//very long
		auctionTimeUpper = auctionTimeL + 60*60;
	}
	auctionTimeLower = Math.round(auctionTimeUpper/10);
	
	var keyLastUpdate = window.location.lost+"_auctionLastUpdate";
	var keyLastTimeUpper = window.location.lost+"_auctionLastTimeUpper";

	var lastUpdate = GMgetValue(keyLastUpdate, 999999999);
	if ( (currentTime.getTime()/1000. - lastUpdate > 2*60*60) || (currentTime.getTime()/1000. - lastUpdate > 5*auctionTimeLower) ) {
		//last update is so long ago, data is not reliable!
	} else {
		var lastTimerUpper = GMgetValue(keyLastTimeUpper, 999999999);
		if ( lastTimerUpper <= auctionTimeUpper ) {
			newAuctionTimeUpper = lastTimerUpper - Math.round(currentTime.getTime()/1000. - lastUpdate);
			if ( newAuctionTimeUpper > 0 ) {
				auctionTimeUpper = newAuctionTimeUpper;
			}
		}
		
	}
	GMsetValue(keyLastTimeUpper, auctionTimeUpper);
	if ( auctionCode == auctionStatusShort ) {
		auctionTimeLower = 60; //refresh every minute
	} else {
		auctionTimeLower = Math.round(auctionTimeUpper/10); //re-update lower time if needed
	}
	lastUpdate = Math.round(currentTime.getTime()/1000.);
	GMsetValue(keyLastUpdate, lastUpdate);
	
	timerAuction();
}

function GMgetValue(key, defaultValue) {
	var result = readCookie(key);
	return result != null ? result : defaultValue;
}

function GMsetValue(key, value) {
	createCookie(key, value, 24*60*60);
}

function timerAuction() {
	var divUpper = document.getElementById('tdAuctionTimerUpper');
	var divLower = document.getElementById('tdAuctionTimerLower');
	var r1 = updateTimer(divUpper, auctionTimeUpper);
	var r2 = updateTimer(divLower, auctionTimeLower);
	if ( r1 || r2 ) {
		setTimeout(timerAuction, 999);
	}
	//if ( !(r1 && r2) ) {
	//	displayAuctionStatus();
	//}
}
/*********** AUCTION HELPER ***********/