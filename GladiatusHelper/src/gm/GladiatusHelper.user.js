// ==UserScript==
// @name           Gladiatus Helper
// @namespace      DDTH
// @description    Find your Gladiatus experience more exciting with Gladiatus Helper
// @include        *.gladiatus.*
// ==/UserScript==

/**
 * Based on script "Gladiatus Arena"  by m4rtini (http://userscripts.org/scripts/show/23065)
 * @version   v0.3.3.4 - 2008.08.11
 * @author    NGUYEN, Ba Thanh <btnguyen2k [at] gmail [dot] com>
 * @author    Tuan Duong
 * @author    NGUYEN, Xuan Khoa
 * @copyright DDTH.ORG
 * @history
 * v3.3.4 2008.08.11
 *   - code clean-up
 *   - new Auction Helper (beta)
 * v3.3.3 2008.08.10
 *   - timer on Arena
 *   - Auction Helper (beta)
 *   - Quest Helper: quest description, status and reward 
 * v3.3.2 2008.08.09
 *   - refined information panel
 *   - auto-scroll panel (thanks to duongminhduc)
 *   - timer on Stable work
 *   - timer on Travelling
 * v3.3.1 2008.08.08
 *   - first release, mostly for gladiatus.vn
 *   - check for links to another players on the page and display duel prediction against each
 *     (use simulation at http://www.gladiatustools.com/sim.php)
 *   - display a link next to each opponent to duel him directly
 */

/*********** SETTING UP ***********/
var STATUS = 'Gladiatus Helper v0.3.3.4<br>by NGUYEN, Ba Thanh';
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
				'<div id="panelAuctionStatus">panelAuctionStatus</div>' +
			'</td>' + 
		'</tr>' +
		'<tr><td colspan="3">&nbsp;</td></tr>'+
		'<tr><td colspan="3" style="width: 100%"><div style="width: 100%" id="panelQuestStatus"></div></td></tr>'+
		'<tr><td colspan="3" align="left"><div id="panelDebug"></div></td></tr>'+
	'</table>';
document.body.insertBefore(divPanel, document.body.firstChild);

var divCharStats = document.getElementById('panelCharStats');
var divWorkStatus = document.getElementById('panelWorkStatus');
var divAuctionStatus = document.getElementById('panelAuctionStatus');
var divQuestStatus = document.getElementById('panelQuestStatus');
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
var stats = new Array();

const statsIndexCharname     = 0;
const statsIndexLevel        = 1;
const statsIndexHP           = 2;
const statsIndexExp          = 3;
const statsIndexStrength     = 4;
const statsIndexSkill        = 5;
const statsIndexAgility      = 6;
const statsIndexConstitution = 7;
const statsIndexCharisma     = 8;
const statsIndexIntelligence = 9;
const statsIndexArmour       = 10;
const statsIndexDamage1      = 11;
const statsIndexDamage2      = 12;

currentTime = new Date();

/* module's setting up */
timeRemainingArena = 0;	//arena helper

timeRemainingWorld = 0; //work helper
timeRemainingWork  = 0; //work helper

timeRemainingQuest = 0; //quest helper
/* module's setting up */
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

var $CHECK_STATUS = true;

if ( $CHECK_STATUS ) {
	main();
}

function main() {
	var regexp = /^(.*\?)mod=(\w+).*sh=([0-9a-fA-F]+)/;
	var result = document.location.href.match(regexp);
	siteUrl = result[1];
	siteMod = result[2];
	secureHash = result[3];
	urlOverview = siteUrl + 'mod=overview&sh='+secureHash;
	urlWork = siteUrl + 'mod=work&sh='+secureHash;
	urlTavern = siteUrl + 'mod=tavern&sh='+secureHash;
	urlArena = siteUrl + 'mod=arena&sh='+secureHash;
	urlAuction = siteUrl + 'mod=auction&sh='+secureHash;
	getMyStatusAndCheckOpponentsOnPage();
	displayWorkStatus();
	displayQuestStatus();
	displayAuctionStatus();
}
/*********** COMMON FUNCTIONS ***********/

/*********** ARENA HELPER ***********/
function getStats(div, name, method) {
	var query = method=='class' ? ".//span[@class='"+name+"']" : ".//span[@id='"+name+"']";
	var tag = xpathQuery(query, div);
	if ( tag.snapshotLength ) {
		return tag.snapshotItem(0).innerHTML;
	} else {
		return '';
	}
}

function getMyStatusAndCheckOpponentsOnPage() {
	retrieveStats(urlOverview, 0, null);
}

function retrieveStats(url, statsIndex, objOpponent) {
	GM_xmlhttpRequest({
		method: "GET",
		url: url,
		onload: function(responseDetails) {
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			stats[statsIndex] = new Array();
			stats[statsIndex][statsIndexCharname]     = getStats(pulled, 'playername', 'class');
			stats[statsIndex][statsIndexLevel]        = getStats(pulled, 'char_level', 'id');
			stats[statsIndex][statsIndexHP]           = getStats(pulled, 'char_leben', 'id');
			stats[statsIndex][statsIndexExp]          = getStats(pulled, 'char_exp', 'id');
			stats[statsIndex][statsIndexStrength]     = getStats(pulled, 'char_f0', 'id');
			stats[statsIndex][statsIndexSkill]        = getStats(pulled, 'char_f1', 'id');
			stats[statsIndex][statsIndexAgility]      = getStats(pulled, 'char_f2', 'id');
			stats[statsIndex][statsIndexConstitution] = getStats(pulled, 'char_f3', 'id');
			stats[statsIndex][statsIndexCharisma]     = getStats(pulled, 'char_f4', 'id');
			//stats[statsIndex][statsIndexIntelligence] = getStats(pulled, 'char_f5');
			stats[statsIndex][statsIndexArmour]       = getStats(pulled, 'char_panzer', 'id');

			dmg = getStats(pulled, 'char_schaden');
			if ( dmg != '' ) {
				stats[statsIndex][statsIndexDamage1] = dmg.split('-')[0].replace(/^\s+|\s+$/g, ''); 
				stats[statsIndex][statsIndexDamage2] = dmg.split('-')[1].replace(/^\s+|\s+$/g, '');
			} else {
				debug('Error while getting damage stats for ['+stats[statsIndex][statsIndexCharname]+']!');
			}
			
			if ( statsIndex == 0 ) {
				//finish retrieving my stats
				displayMyStats();
				checkOpponentsOnPage();
			} else {
				simulate(statsIndex, objOpponent);
			}
		}
	});
}

function displayMyStats() {
	var str = '<table border="0" cellpadding="2" cellspacing="0" style="font-size:10px; border: 1px solid #c0c0c0;">';
	str += '<tr><td colspan="2" align="center" style="border-bottom: 1px solid #c0c0c0; background: #e0e0e0"><b>'
		+ stats[0][statsIndexCharname]+'</b></td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Level</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexLevel]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">HP</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexHP]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Exp</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexExp]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Strength</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexStrength]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Skill</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexSkill]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Agility</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexAgility]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Constitution</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexConstitution]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Charisma</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexCharisma]+'</td></tr>';
	//str += '<tr><td align="left">Intelligence</td><td align="right">'+stats[0][statsIndexIntelligence]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Armour</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexArmour]+'</td></tr>';
	str += '<tr><td align="left">Damage</td><td align="right">'+stats[0][statsIndexDamage1]+'-'+stats[0][statsIndexDamage2]+'</td></tr>';
	str += '</table>';
	divCharStats.innerHTML = str;
}

function checkOpponentsOnPage() {
	var allLinks = document.getElementsByTagName('a');
	for ( var i = 0; i < allLinks.length; i++ ) {
		var url = allLinks[i].href;
		if ( url.search(/mod=player/) >= 0 ) {			
			retrieveStats(url, i+1, allLinks[i]);
		}
	}
}

function simulate(index, objOpponent) {
	debug('Simulating fight against ['+stats[index][statsIndexCharname]+']');

	var nSims = 500;
	//*
	data = "count=" + nSims + "&";
	data += "&level1=" + stats[0][statsIndexLevel]+"&level2=" + stats[index][statsIndexLevel];
	data += "&skill1=" + stats[0][statsIndexSkill]+"&skill2=" + stats[index][statsIndexSkill];
	data += "&agility1=" + stats[0][statsIndexAgility]+"&agility2=" + stats[index][statsIndexAgility];
	data += "&charisma1=" + stats[0][statsIndexCharisma]+"&charisma2=" + stats[index][statsIndexCharisma];
	data += "&armour1=" + stats[0][statsIndexArmour]+"&armour2=" + stats[index][statsIndexArmour];
	data += "&damage11=" + stats[0][statsIndexDamage1]+"&damage12=" + stats[index][statsIndexDamage1];
	data += "&damage21=" + stats[0][statsIndexDamage2]+"&damage22=" + stats[index][statsIndexDamage2];
	data += "&submit=Simulate";
	//*/
	
	//*
    GM_xmlhttpRequest({
		method: "POST",
		url: 'http://gladiatus-helper.appspot.com/simulate',
		headers: {'Content-type':'application/x-www-form-urlencoded'},
		data: encodeURI(data),
		onload: function(responseDetails) {
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			var regexp = /Win: (\d+)/;
			var result = responseDetails.responseText.match(regexp);
			if ( result.length > 1 ) {
				objOpponent.parentNode.appendChild(document.createTextNode(' '));
			
				var chanceToWin = result[1]*100/nSims;
				var color = '#000000';
				if ( chanceToWin >= 90 ) {
					color = '#009010';
				} else if ( chanceToWin >= 75 ) {
					color = '#0000ff';
				} else if ( chanceToWin < 60 ) {
					color = '#ff0000';
				}
				regexp = /p=(\d+)/;
				result = objOpponent.href.match(regexp);
				var urlMucNo = siteUrl + 'mod=arena&pid='+result[1]+'&sh='+secureHash;
				var el = document.createElement('a');
				el.href = urlMucNo;
				el.innerHTML = '<small><font color='+color+'>(Lvl ' +stats[index][statsIndexLevel] + '/' + chanceToWin+'%)</font></small>';
				objOpponent.parentNode.appendChild(el);
			}
		}
	});
	//*/
	objOpponent.parentNode.appendChild(document.createTextNode(' '));
	var chanceToWin = '---';
	var color = '#000000';
	//*
	if ( chanceToWin >= 90 ) {
		color = '#009010';
	} else if ( chanceToWin >= 75 ) {
		color = '#0000ff';
	} else if ( chanceToWin < 60 ) {
		color = '#ff0000';
	}
	//*/
	regexp = /p=(\d+)/;
	result = objOpponent.href.match(regexp);
	var urlMucNo = siteUrl + 'mod=arena&pid='+result[1]+'&sh='+secureHash;
	var el = document.createElement('a');
	el.href = urlMucNo;
	el.innerHTML = '<small><font color='+color+'>(Lvl ' +stats[index][statsIndexLevel] + '/' + chanceToWin+'%)</font></small>';
	objOpponent.parentNode.appendChild(el);
}
/*********** ARENA HELPER ***********/

/*********** WORK HELPER ***********/
function displayWorkStatus() {
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
			
			var remainingTime = getStats(pulled, 'bx0', 'id');
			if ( responseDetails.responseText.indexOf("?mod=work&cancel=1") > 0 ) {
				//100% sure that stable work is undergoing!
				if ( remainingTime != null && remainingTime != '' ) {
					workStatusStable.innerHTML = remainingTime;
					var regexp = /s=(\d+)\-Math/;
					var result = pulled.innerHTML.match(regexp);
					if ( result != null && result.length > 1 ) {
						timeRemainingWork = result[1];
						timerWork();
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
						timerWorld();
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
			
			var remainingTime = getStats(pulled, 'bx0', 'id');
			if ( remainingTime != null && remainingTime != '' ) {
				workStatusArena.innerHTML = remainingTime;
				var regexp = /s=(\d+)\-Math/;
				var result = pulled.innerHTML.match(regexp);
				if ( result != null && result.length > 1 ) {
					timeRemainingArena = result[1];
					timerArena();
				} else {
					debug('Error while getting remaining time for [Arena]');
				}
			}
		}
	});
}

function timerArena() {
	var div = document.getElementById('workStatusArena');
	if ( updateTimer(div, timeRemainingArena) ) {
		setTimeout(timerArena, 999);
	}
}

function timerWorld() {
	var div = document.getElementById('workStatusWorld');
	if ( updateTimer(div, timeRemainingWorld) ) {
		setTimeout(timerWorld, 999);
	}
}

function timerWork() {
	var div = document.getElementById('workStatusStable');
	if ( updateTimer(div, timeRemainingWork) ) {
		setTimeout(timerWork, 999);
	}
}
/*********** WORK HELPER ***********/

/*********** QUEST HELPER ***********/
function displayQuestStatus() {
	var str = '<table border="0" cellpadding="2" cellspacing="0" style="font-size:10px; border: 1px solid #c0c0c0; width: 100%;">';
	str +=
        '<tr><td colspan="2" align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="index.php?mod=location&loc=1&d=1&sh='+secureHash+'" title="Harpy (Nguoi dan ba la loi), Medusa (Nguoi ran), Cerberus (Cho 2 dau), Minotaur (Qui dau trau)">Mist Mountains</a></td></tr>' +
        '<tr><td colspan="2" align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="index.php?mod=location&loc=2&d=1&sh='+secureHash+'" title="Harpy, Medusa, Cerberus, Minotaur, Hog (?), Leopard (Bao), Bear (Gau), Wolf (Soi), Deserter (Ke dao ngu), Traditor (?), Rebel (Ke phien loan), Heretic (?)">Dark Woods</a></td></tr>' +
        '<tr><td colspan="2" align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="index.php?mod=location&loc=3&d=1&sh='+secureHash+'" title="Barbarian (Ke man ro), Berserk (Ke dien loan), Vandal (Ke pha hoai), Deserter, Traditor, Rebel, Heretic">Barbarian Village</a></td></tr>' +
        '<tr><td colspan="2" align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="index.php?mod=location&loc=4&d=1&sh='+secureHash+'" title="Bandit (Tho phi), Fled Slave (No le bo tron), Robber (Ke cuop), Out Law (Ke ngoai vong phap luat), Deserter, Traditor, Rebel, Heretic">Bandit Camp</a></td></tr>' +
        '<tr><td colspan="2" align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="index.php?mod=location&loc=5&d=1&sh='+secureHash+'" title="Guard (Bao ve), Body Guard (Linh gac), Mercenary (?), Constable (?), Deserter, Traditor, Rebel, Heretic">Acient Temple</a></td></tr>' +
        '<tr><td colspan="2" align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="index.php?mod=location&loc=6&d=1&sh='+secureHash+'" title="Pirate (Cuop bien), Smuggler (Ke buon lau), Deserter, Traditor, Rebel, Heretic">Pirate Harbour</a></td></tr>' +
        '<tr><td colspan="2" align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="index.php?mod=location&loc=7&d=1&sh='+secureHash+'" title="Wolf, Deserter, Traditor, Rebel, Heretic">Wolf Cave</a></td></tr>';
	str += '<tr><td colspan="2" align="center" style="border-bottom: 1px solid #c0c0c0; background: #e0e0e0"><b><a href="'
		+ urlTavern + '">Quest Status</a></b></td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Status</td>'
		+ '<td align="right" style="border-bottom: 1px solid #c0c0c0;" id="tdQuestStatus">---</td></tr>';
	str += '<tr><td colspan="2" id="tdQuestDesc">---</td></tr>';
	str += '</table>';
	divQuestStatus.innerHTML = str;
	
	var questStatus = document.getElementById('tdQuestStatus');
	var questDesc = document.getElementById('tdQuestDesc');
	
	GM_xmlhttpRequest({
		method: "GET",
		url: urlTavern,
		onload: function(responseDetails) {
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			var remainingTime = getRemainingTimeStr('bx0', pulled);
			if ( remainingTime != '') {
				//must wait for next quest available
				questStatus.innerHTML = remainingTime;
				questDesc.innerHTML = '---';
				var regexp = /s=(\d+)\-Math/;
				var result = pulled.innerHTML.match(regexp);
				timeRemainingQuest = result[1];
				timerQuest();
			} else if ( responseDetails.responseText.indexOf("cancel") >= 0 ) {
				//quest is undergoing
				questStatus.innerHTML = 'Undergoing';
				var tag = xpathQuery(".//div[@style='clear: both;']", pulled);
				if ( tag.snapshotLength ) {
					//ok we got quest information
					var divQuest = tag.snapshotItem(0);
					var questTitle = getQuestTitle(divQuest);
					var currenStatus = getQuestCurrentStatus(divQuest);
					var reward = getQuestReward(divQuest);
					var str = questTitle + '<table border="0" cellpadding="4" cellspacing="0" style="font-size:10px;">'
						+ '<tr><td>' + currenStatus
						+ '</td><td>' + reward
						+ '</td></tr></table';
					questDesc.innerHTML = str;
				}
			} else {
				questStatus.innerHTML = 'Available';
				questDesc.innerHTML = '---';
			}
		}
	});
}

function getQuestCurrentStatus(divQuest) {
	var tag = xpathQuery(".//table", divQuest);
	if ( tag.snapshotLength ) {
		var table = tag.snapshotItem(1);
		tag = xpathQuery(".//td", table);
		var td = tag.snapshotItem(0);
		return td.innerHTML;
	} else {
		return '';
	}
}

function getQuestReward(divQuest) {
	var tag = xpathQuery(".//table", divQuest);
	if ( tag.snapshotLength ) {
		var table = tag.snapshotItem(2);
		tag = xpathQuery(".//td", table);
		var td = tag.snapshotItem(0);
		return td.innerHTML;
	} else {
		return '';
	}
}

function getQuestTitle(divQuest) {
	var ex = ".//h2";
	var tag = document.evaluate( 
		ex,
		divQuest,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
	if ( tag.snapshotLength ) {
		var title = tag.snapshotItem(0).innerHTML;
		var regexp = /<span.*?>(.*)<\/span>(.*)/;
		var result = tag.snapshotItem(0).innerHTML.match(regexp);
		return result[1] + ' (' + result[2] + ')';
	} else {
		return '';
	}
}

function timerQuest() {
	var div = document.getElementById('questStatus');
	if ( updateTimer(div, timeRemainingQuest) ) {
		setTimeout(timerQuest, 999);
	}
}
/*********** QUEST HELPER ***********/

const auctionStatusVeryShort = 'Very Short';
const auctionStatusShort     = 'Short';
const auctionStatusMedium    = 'Medium';
const auctionStatusLong      = 'Long';
const auctionStatusVeryLong  = 'Very Long';

const auctionStatusSearchVS = new Array(/>Very Short</i, /R?t ng?n/i);
const auctionStatusSearchS  = new Array(/>Short</i     , /Ng?n h?n/i);
const auctionStatusSearchM  = new Array(/>Medium</i    , /Trung h?n/i);
const auctionStatusSearchL  = new Array(/>Long</i      , /Dài h?n/i);
const auctionStatusSearchVL = new Array(/>Very Long</i , /R?t lâu/i);

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
