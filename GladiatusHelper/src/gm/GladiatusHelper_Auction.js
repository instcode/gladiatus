/**
 * Gladiatus Helper - Auction Module
 *
 * @copyright (C) 2008, DDTH.ORG
 * @history
 *   2008.09.10 - Re-deploy Auction Helper (Beta)
 *   2008.08.28
 */
 
/*********** SETTING UP ***********/

var divAuctionStatus = document.getElementById('panelAuctionStatus');
/*********** SETTING UP ***********/

/* Phá sản: server check item này có được phép bid hay không --> bid item vượt lvl bất thành! */
/*
if ( siteMod == 'auction' ) {
	var str = '<form action="index.php?mod=auction&sh='+secureHash+'" method="POST">';
	str += '<table border="0" cellpadding="2" cellspacing="0" style="font-size:10px; border: 1px solid #c0c0c0;">';
	
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Auction Id:</td>';
	str += '<td style="border-bottom: 1px solid #c0c0c0;"><input type="text" name="auctionid" style="width: 32px"></td></tr>';
	
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Bid Amount:</td>';
	str += '<td style="border-bottom: 1px solid #c0c0c0;"><input type="text" name="bid_amount" style="width: 32px"></td></tr>';
	
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">F:</td>';
	str += '<td style="border-bottom: 1px solid #c0c0c0;"><input type="text" name="f" value="7" style="width: 32px"></td></tr>';
	
	str += '<tr><td colspan="2" style="border-bottom: 1px solid #c0c0c0;">';
	str += '<input type="submit" name="bid" value="Bid">';
	str += '<input type="submit" name="buyout" value="Buyout">';
	str += '<input type="hidden" name="qry" value="">';
	str += '</td></tr>';

	str += '</table></form>';
	divAuctionStatus.innerHTML = str;
}
*/


/*********** Auction Helper ***********/
var interval;
// Change this value for set request timer to check auction time
var auctionTimer = 2; //second
// Change this value for alert message to screen when auction status change to very short
var isAlert = 1; 

var currentAuctionStatus = "";
var previousAuctionStatus = "";

var veryLongTimeStr = "Rất lâu";
var longTimeStr = "Dài hạn";
var middleTimeStr = "Trung hạn";
var shortTimeStr = "Ngắn hạn";
var veryShortTimeStr = "Rất ngắn";

var timeRemainingAuction = 30 * 60;
/**
 * Get current status of Auction
 * @author: Tuan Duong
 */
function requestAuctionPage(){
	var url = siteUrl + "mod=auction&sh=" + secureHash;
	GM_xmlhttpRequest({
		method: "GET",
		url: url,
		onload: function(responseDetails) {
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			/* Gets quest description node */
			var ex = "//span[@class='description_span_right']";
			tag = document.evaluate( 
				ex,
				pulled,
				null,
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
				null
			);
			if ( tag.snapshotLength ) {
				statusNode = tag.snapshotItem(0).childNodes[0];
				currentAuctionStatus = statusNode.innerHTML;
				
				// Display auction status
				displayAuctionStatus();
				var divAuctionCurrentStatus = document.getElementById("auctionCurrentStatus");
				var divAuctionCurrentTime = document.getElementById("auctionRemainTime");
				divAuctionCurrentStatus.innerHTML = currentAuctionStatus;
				// Process auction
				result = processAuction();
				if (0 == result) {
					displayAuctionRemainingTime();
				}
				if (4 == result) {
					timeRemainingAuction = 30 * 60;
					timerAuction();
				}
			}
		}
	});
}

function isStoreAuctionStatus() {
	var cookieAutionTime = readCookie('auction_time');
	return null != cookieAutionTime;
}

function displayAuctionRemainingTime() {
	var cookieAuctionTime = readCookie("auction_time");
	if (null != cookieAuctionTime) {
		var newTime = new Date();
		timeRemainingAuction = calcRemainingTime(cookieAuctionTime, newTime.getTime());
		timerAuction();
	}
}

function calcRemainingTime(oldTime, newTime) {
	return 30 * 60 - Math.round((newTime - oldTime)/1000.);
}

function timerAuction() {
	var div = document.getElementById('auctionRemainTime');
	if ( updateTimer(div, timeRemainingAuction) ) {
		setTimeout(timerAuction, 999);
	}
}

function displayAuctionStatus() {
	var str = 
		'<table border="0" cellpadding="2" cellspacing="0" style="font-size:10px; border: 1px solid #c0c0c0;">' +
			'<tr><td colspan="2" align="center" style="border-bottom: 1px solid #c0c0c0; background: #e0e0e0"><b>Auction Status</b></td></tr>' +
			'<tr>' +
				'<td align="left" style="border-bottom: 1px solid #c0c0c0;">Status</td>' +
				'<td align="right" style="border-bottom: 1px solid #c0c0c0;" id="auctionCurrentStatus">---</td>' +
			'</tr>' +
			'<tr>' +
				'<td align="left" style="border-bottom: 1px solid #c0c0c0;">Time</td>' +
				'<td align="right" style="border-bottom: 1px solid #c0c0c0;" id="auctionRemainTime">---</td>' +
			'</tr>' +
		'</table>';
		divAuctionStatus.innerHTML = str;
}

/**
 * Process Auction
 */
function processAuction(){
	var result = -1;
	if (currentAuctionStatus == veryShortTimeStr) {
		setTimeout(requestAuctionPage, 30 * 60 * 1000);
		// Time change from short time to very sort time
	    if (previousAuctionStatus == shortTimeStr && !isStoreAuctionStatus()) {
			// Get current time and store in cookies
			var newTime = new Date();
			createCookie("auction_time", newTime.getTime(), 60);
			result = 4;
			if (1 == isAlert) {
				alert("Bid time remaining in 30s");
			}
			window.location.reload();
		} else {
			result = 0;
		}
    }
	
	// At the beginning, if auction time is short time, request with auction timer
    if (currentAuctionStatus == shortTimeStr) {
        setTimeout(requestAuctionPage, auctionTimer * 1000);
        result = 1;
    }
	
	if (currentAuctionStatus == middleTimeStr) {
        // Set timeout is 30 minutes
		setTimeout(requestAuctionPage, 30 * 60 * 1000);
        result = 2;
	}
	
    if (currentAuctionStatus == longTimeStr) {
        // Set timeout is 1 hour
		setTimeout(requestAuctionPage, 60 * 60 * 1000);
        result = 3;
    }

	previousAuctionStatus = currentAuctionStatus;
	// Still very long time to bid
	if (-1 == result) {
		setTimeout(requestAuctionPage, 60 * 60 * 1000);
	}
	return result;
}
