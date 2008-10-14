/**
 * Gladiatus Helper - Common
 * Global variables and utility functions should be defined in this file.
 *
 * @copyright (C) 2008, DDTH.ORG
 * @history
 *   2008.08.28
 *     - First version
 */

/*********** SETTING UP ***********/
var STATUS = 'Gladiatus Helper v0.3.3.5<br>';
var divPanel = document.createElement('div');
divPanel.setAttribute('id', 'gladiatusPanel');
divPanel.setAttribute('style', 'font-size:10px; background:#d0d0ff; border:solid black 1px; padding:4px; position: absolute; top: 0px');
divPanel.innerHTML = STATUS +
	'<table id="tblCharacter" style="font-size:10px;" border="0" cellpadding="0" cellspacing="0">' +
		'<tr>' +
			'<td valign="top"><div id="panelCharStats"></div></td>' +
			'<td>&nbsp;</td>' +
			'<td valign="top">' +
				'<div id="panelWorkStatus"></div>' +
				'<div style="height: 4px"></div>' +
				'<div id="panelAuctionStatus"></div>' +
			'</td>' +
		'</tr>' +
		'<tr><td colspan="3">&nbsp;</td></tr>'+
		'<tr><td colspan="3" style="width: 100%"><div style="width: 100%" id="panelQuestStatus"></div></td></tr>'+
		'<tr><td colspan="3" align="left"><div id="panelDebug"></div></td></tr>'+
	'</table>';
document.body.insertBefore(divPanel, document.body.firstChild);

var divDebug = document.getElementById('panelDebug');

window.addEventListener("resize", alignStatus, false);
window.addEventListener("scroll", alignStatus, false);

//setting up
var siteUrl;
var siteMod;
var secureHash;
var urlOverview;
var urlTavern;
var urlWork;
var urlArena;
var urlAuction;
var urlSettings;

var currentTime = new Date();

var regexp = /^(.*\?)mod=(\w+).*sh=([0-9a-fA-F]+)/;
var result = document.location.href.match(regexp);
var siteUrl = result[1];
var siteMod = result[2];
var secureHash = result[3];

var urlOverview = siteUrl + 'mod=overview&sh='+secureHash;
var urlWork = siteUrl + 'mod=work&sh='+secureHash;
var urlTavern = siteUrl + 'mod=tavern&sh='+secureHash;
var urlArena = siteUrl + 'mod=arena&sh='+secureHash;
var urlAuction = siteUrl + 'mod=auction&sh='+secureHash;
var urlSettings = siteUrl + 'mod=settings&sh='+secureHash;
/*********** SETTING UP ***********/

/*********** COMMON FUNCTIONS ***********/
function createCookie(name, value, timeInMinute){
    if (timeInMinute) {
		var date = new Date();
		date.setTime(date.getTime() + (timeInMinute * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else {
		var expires = "";
	}
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length);
		}
    }
    return null;
}

function removeCookie(name) {
    createCookie(name, "", -1);
}

function randomInt(iMin, iMax) {
	return Math.floor((iMax-iMin+1)*Math.random()) + iMin;
	//return iMin + Math.round(Math.random()*(iMax-iMin));
}

function debug(msg) {
	divDebug.innerHTML = msg;
}

function alignStatus() {
	divPanel.style.top = window.pageYOffset+'px';
}

function updateTimer(div, timeRemaining) {
	var n = new Date();
	var s = timeRemaining - Math.round((n.getTime()-currentTime.getTime())/1000.);
	var m = 0;
	var h = 0;
	if ( s < 0 ) {
		div.innerHTML = '---';
		return false;
	} else {
		if ( s > 59 ) {
			m = Math.floor(s/60);
			s = s-m*60;
		}
		if ( m > 59 ) {
			h = Math.floor(m/60);
			m = m-h*60;
		}
		if ( s < 10 ) {
			s = '0'+s;
		}
		if ( m < 10 ) {
			m = '0'+m;
		}
		div.innerHTML = ' '+h+':'+m+':'+s+'';
		// For auction remaining time, display in window title
		if (div.id == "auctionRemainTime") {
			document.title = ' '+h+':'+m+':'+s+'';
		}
		return true;
	}
}

function getRemainingTimeObj(id, div) {
	var query = '//div[@id="'+id+'"]';
	return document.evaluate(
		query,
		div,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
}

function getRemainingTimeStr(id, div) {
	var obj  = getRemainingTimeObj(id, div);
	if ( obj.snapshotLength ) {
		return tag.snapshotItem(0).innerHTML;
	} else {
		return '';
	}
}

function xpathQuery(query, obj) {
	return document.evaluate(
		query,
		obj,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
}

function getSpanContent(htmlObj, name, method) {
	var query = method=='class' ? ".//span[@class='"+name+"']" : ".//span[@id='"+name+"']";
	var tag = xpathQuery(query, htmlObj);
	if ( tag.snapshotLength ) {
		return tag.snapshotItem(0).innerHTML;
	} else {
		return '';
	}
}

function getSpanAttribute(htmlObj, name, method, attrName) {
	var query = method=='class' ? ".//span[@class='"+name+"']" : ".//span[@id='"+name+"']";
	var tag = xpathQuery(query, htmlObj);
	if ( tag.snapshotLength ) {
		return tag.snapshotItem(0).getAttribute(attrName);
	} else {
		return '';
	}
}

function getDivContent(htmlObj, name, method) {
	var query = method=='class' ? ".//div[@class='"+name+"']" : ".//div[@id='"+name+"']";
	var tag = xpathQuery(query, htmlObj);
	if ( tag.snapshotLength ) {
		return tag.snapshotItem(0).innerHTML;
	} else {
		return '';
	}
}

function getDivAttribute(htmlObj, name, method, attrName) {
	var query = method=='class' ? ".//div[@class='"+name+"']" : ".//div[@id='"+name+"']";
	var tag = xpathQuery(query, htmlObj);
	if ( tag.snapshotLength ) {
		return tag.snapshotItem(0).getAttribute(attrName);
	} else {
		return '';
	}
}
/**
 * Remove all childNode from parentNode
 * @param {Node} parentNode
 * @param {String} childTagName
 * @return boolean
 */
function removeChildsByTagName(parentNode, childTagName) {
	childTags = xpathQuery(".//" + childTagName, parentNode);
	if (childTags.snapshotLength) {
		for (index = 0; index < childTags.snapshotLength; index++) {
			removeCurrentNode(childTags.snapshotItem(index));
		}
	}
}
/**
 * Remove childNode
 * @param {Node} childNode
 */
function removeCurrentNode(childNode) {
	childNode.parentNode.removeChild(childNode);
}

/*********** COMMON FUNCTIONS ***********/
