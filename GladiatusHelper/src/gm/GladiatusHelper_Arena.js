/**
 * Gladiatus Helper - Arena Module
 * Display character status and chance to win against other opponents.
 *
 * @copyright (C) 2008, DDTH.ORG
 * @history
 *   2008.08.28
 *     - Display HP in numbers (current/max)
 *     - Display Exp in numbers (current/max)
 */
 
/*********** SETTING UP ***********/
/*********** SETTING UP ***********/

function arenaSimulateFights() {
	var allLinks = document.getElementsByTagName('a');
	for ( var i = 0; i < allLinks.length; i++ ) {
		var url = allLinks[i].href;
		if ( url.search(/\?mod=player&p=(\d+)/) >= 0 ) {			
			getStats({url: url, handler: arenaSimulateFight, node: allLinks[i]});
		}
	}
}

function arenaSimulateFight(params) {
	var opponentStats = params.stats;
	debug('Simulating fight against ['+opponentStats[statsIndexCharname]+']');

	/* Using server simulator */
	var nSims = 200;
	data = "count=" + nSims + "&";
	data += "&gladiator1=" + characterStats[statsIndexCharname]+"&gladiator2=" + opponentStats[statsIndexCharname];
	data += "&hitpoint1=" + characterStats[statsIndexHPCurrent]+"&hitpoint2=" + opponentStats[statsIndexHPCurrent];
	data += "&level1=" + characterStats[statsIndexLevel]+"&level2=" + opponentStats[statsIndexLevel];
	data += "&skill1=" + characterStats[statsIndexSkill]+"&skill2=" + opponentStats[statsIndexSkill];
	data += "&agility1=" + characterStats[statsIndexAgility]+"&agility2=" + opponentStats[statsIndexAgility];
	data += "&charisma1=" + characterStats[statsIndexCharisma]+"&charisma2=" + opponentStats[statsIndexCharisma];
	data += "&armour1=" + characterStats[statsIndexArmour]+"&armour2=" + opponentStats[statsIndexArmour];
	data += "&damage11=" + characterStats[statsIndexDamage1]+"&damage12=" + opponentStats[statsIndexDamage1];
	data += "&damage21=" + characterStats[statsIndexDamage2]+"&damage22=" + opponentStats[statsIndexDamage2];
	data += "&submit=Simulate";

    GM_xmlhttpRequest({
		method: "POST",
		url: 'http://gladiatus-helper.appspot.com/simulate',
		headers: {'Content-type':'application/x-www-form-urlencoded'},
		data: encodeURI(data),
		onload: function(responseDetails) {
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			var regexp = /(\d+).*?(\d+).*?(\d+)/;
			var result = responseDetails.responseText.match(regexp);
			if ( result.length > 1 ) {
				var chanceToWin = result[1]*100/nSims;
				var dmgDone = result[2];
				var dmgReceived = result[3];
				displaySimulationResult(chanceToWin, dmgDone, dmgReceived);
				
				var color = '#000000';
				if ( chanceToWin >= 90 ) {
					color = '#009010';
				} else if ( chanceToWin >= 75 ) {
					color = '#0000ff';
				} else if ( chanceToWin < 60 ) {
					color = '#ff0000';
				}
				
				var objOpponent = params.node;
				objOpponent.parentNode.appendChild(document.createTextNode(' '));
				var regexp = /p=(\d+)/;
				var result = objOpponent.href.match(regexp);
				var urlMucNo = siteUrl + 'mod=arena&pid='+result[1]+'&sh='+secureHash;
				var el = document.createElement('a');
				el.href = urlMucNo;
				el.innerHTML = '<small><font color='+color+'>(Lvl ' +opponentStats[statsIndexLevel] 
					+ '/HP ' + opponentStats[statsIndexHPCurrent] + '/' 
					+ chanceToWin+'%|<font color="#0000ff">'+dmgDone+'</font>|<font color="#ff0000">'+dmgReceived+'</font>)</font></small>';
				objOpponent.parentNode.appendChild(el);
			}
		}
	});
}