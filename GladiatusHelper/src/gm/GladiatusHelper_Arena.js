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
const statsIndexHPCurrent    = 13;
const statsIndexHPMax        = 14;
const statsIndexExpCurrent   = 15;
const statsIndexExpMax       = 16;
const statsIndexAbsorbMin    = 17;
const statsIndexAbsorbMax    = 18;

var stats = new Array();

var divCharStats = document.getElementById('panelCharStats');
/*********** SETTING UP ***********/

function arenaDisplayMyStatsAndCheckOpponents() {
	arenaGetStats(urlOverview, 0, null);
}

function arenaGetStats(urlOverview, statsIndex, objOpponent) {
	GM_xmlhttpRequest({
		method: "GET",
		url: urlOverview,
		onload: function(responseDetails) {
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			stats[statsIndex] = new Array();
			stats[statsIndex][statsIndexCharname]     = getSpanContent(pulled, 'playername', 'class');
			stats[statsIndex][statsIndexLevel]        = parseInt(getSpanContent(pulled, 'char_level', 'id'));
			stats[statsIndex][statsIndexHP]           = getSpanContent(pulled, 'char_leben', 'id');
			stats[statsIndex][statsIndexExp]          = getSpanContent(pulled, 'char_exp', 'id');
			stats[statsIndex][statsIndexStrength]     = parseInt(getSpanContent(pulled, 'char_f0', 'id'));
			stats[statsIndex][statsIndexSkill]        = parseInt(getSpanContent(pulled, 'char_f1', 'id'));
			stats[statsIndex][statsIndexAgility]      = parseInt(getSpanContent(pulled, 'char_f2', 'id'));
			stats[statsIndex][statsIndexConstitution] = parseInt(getSpanContent(pulled, 'char_f3', 'id'));
			stats[statsIndex][statsIndexCharisma]     = parseInt(getSpanContent(pulled, 'char_f4', 'id'));
			//stats[statsIndex][statsIndexIntelligence] = parseInt(getSpanContent(pulled, 'char_f5'));
			stats[statsIndex][statsIndexArmour]       = parseInt(getSpanContent(pulled, 'char_panzer', 'id'));

			var armour = stats[statsIndex][statsIndexArmour];
			stats[statsIndex][statsIndexAbsorbMin] = Math.floor(armour/66) - Math.floor((armour-66)/660+1);
			stats[statsIndex][statsIndexAbsorbMax] = Math.floor(armour/66) + Math.floor(armour/660);

			var hpStr = getDivAttribute(pulled, 'char_leben_tt', 'id', 'onMouseOver');
			var regexp = /.*?(\d+)\s*\/\s*(\d+)/;
			var regexpResult = hpStr.match(regexp);
			stats[statsIndex][statsIndexHPCurrent] = parseInt(regexpResult[1]);
			stats[statsIndex][statsIndexHPMax]     = parseInt(regexpResult[2]);
			
			var expStr = getDivAttribute(pulled, 'char_exp_tt', 'id', 'onMouseOver');
			var regexp = /.*?(\d+)\s*\/\s*(\d+)/;
			var regexpResult = expStr.match(regexp);
			stats[statsIndex][statsIndexExpCurrent] = parseInt(regexpResult[1]);
			stats[statsIndex][statsIndexExpMax]     = parseInt(regexpResult[2]);

			dmg = getSpanContent(pulled, 'char_schaden');
			if ( dmg != '' ) {
				stats[statsIndex][statsIndexDamage1] = parseInt(dmg.split('-')[0].replace(/^\s+|\s+$/g, ''));
				stats[statsIndex][statsIndexDamage2] = parseInt(dmg.split('-')[1].replace(/^\s+|\s+$/g, ''));
			} else {
				debug('Error while getting damage stats for ['+stats[statsIndex][statsIndexCharname]+']!');
			}
			
			if ( statsIndex == 0 ) {
				//finish retrieving my stats
				arenaDisplayMyStats();
				arenaCheckOpponentsOnPage();
			} else {
				arenaSimulateFight(statsIndex, objOpponent);
			}
		}
	});
}

function diceAgainst(value) {
	var diceValue = 0.0;
	for ( var i = 0; i < 100; i++ ) {
		diceValue += Math.random();
	}
	return diceValue < value*100.0;
}

function arenaSimulateATurn(attacker, defender, doubleHit) {
	var chanceToHit = 0.0+attacker[statsIndexSkill];
	var chanceToHit = chanceToHit/(0.0+attacker[statsIndexSkill]+defender[statsIndexAgility]);
	
	if ( diceAgainst(chanceToHit) ) {
		//calculate real damage after subtracting armour absorption
		var damage = randomInt(attacker[statsIndexDamage1], attacker[statsIndexDamage2]);
		var reduced = randomInt(defender[statsIndexAbsorbMin], defender[statsIndexAbsorbMax]);
		var realDamage = Math.max(0, damage-reduced);
		defender[statsIndexHPCurrent] -= realDamage;
		
		//GM_log(attacker[statsIndexCharname]+' hit '+defender[statsIndexCharname]+' for '+realDamage);
		
		if ( defender[statsIndexHPCurrent] <= 0 ) {
			//defender dies!
			return;
		}
	} else {
		//GM_log(attacker[statsIndexCharname]+' missed '+defender[statsIndexCharname]);
	}
	
	var chanceDoubleHit = Math.max(0.0, (0.0+attacker[statsIndexCharisma]-defender[statsIndexCharisma])/100.0);
	if ( !doubleHit && diceAgainst(chanceDoubleHit) ) {
		arenaSimulateATurn(attacker, defender, true);
	}
}

function arenaSimulateAFight(attacker, defender) {
	var orgHpAttacker = attacker[statsIndexHPCurrent];
	var orgHpDefender = defender[statsIndexHPCurrent];
	var numTurnsMin = Math.max(3, Math.min(attacker[statsIndexLevel], defender[statsIndexLevel]));
	var numTurnsMax = Math.max(3, Math.max(attacker[statsIndexLevel], defender[statsIndexLevel]));
	var numTurns = randomInt(numTurnsMin, numTurnsMax);
	
	//GM_log(attacker[statsIndexCharname]+' vs '+defender[statsIndexCharname]+': '+numTurns+' turns');
	
	while ( numTurns > 0 ) {
		arenaSimulateATurn(attacker, defender, false);
		//GM_log('['+orgHpAttacker+'/'+attacker[statsIndexHPCurrent]+'] vs ['+orgHpDefender+'/'+defender[statsIndexHPCurrent]+']');
		if ( attacker[statsIndexHPCurrent] <= 0 ) {
			//GM_log(attacker[statsIndexCharname]+' died!');
			//lose
			return -1;
		}
		if ( defender[statsIndexHPCurrent] <= 0 ) {
			//GM_log(defender[statsIndexCharname]+' died!');
			//win
			return 1;
		}
		
		numTurns--;
		if ( numTurns > 0 ) {
			arenaSimulateATurn(defender, attacker, false);
			//GM_log('['+orgHpAttacker+'/'+attacker[statsIndexHPCurrent]+'] vs ['+orgHpDefender+'/'+defender[statsIndexHPCurrent]+']');
			if ( attacker[statsIndexHPCurrent] <= 0 ) {
				//GM_log(attacker[statsIndexCharname]+' died!');
				//lose
				return -1;
			}
			if ( defender[statsIndexHPCurrent] <= 0 ) {
				//GM_log(defender[statsIndexCharname]+' died!');
				//win
				return 1;
			}
		}
		
		numTurns--;
	}
	
	orgHpAttacker = orgHpAttacker - attacker[statsIndexHPCurrent];
	orgHpDefender = orgHpDefender - defender[statsIndexHPCurrent];
	if ( orgHpAttacker > orgHpDefender ) {
		//GM_log(defender[statsIndexCharname]+' losed!');
		//win
		return 1;
	}
	if ( orgHpAttacker < orgHpDefender ) {
		//GM_log(attacker[statsIndexCharname]+' losed!');
		//lose
		return -1;
	}
	//GM_log('EVEN!');
	return 0;
}

function arenaSimulateFight(index, objOpponent) {
	debug('Simulating fight against ['+stats[index][statsIndexCharname]+']');

	/* Using JavaScript simulator */
	/*
	var nSims = 100;
	var nWins = 0;
	
	var attacker = Array();
	var defender = Array();
	for ( var n = 0; n < nSims; n++ ) {
		for ( var i = 0; i < stats[0].length; i++ ) {
			attacker[i] = stats[0][i];
			defender[i] = stats[index][i];
		}
		var result = arenaSimulateAFight(attacker, defender);
		if ( result > 0 ) nWins++;
	}
	objOpponent.parentNode.appendChild(document.createTextNode(' '));

	var chanceToWin = nWins*100/nSims;
	var color = '#000000';
	if ( chanceToWin >= 90 ) {
		color = '#009010';
	} else if ( chanceToWin >= 75 ) {
		color = '#0000ff';
	} else if ( chanceToWin < 60 ) {
		color = '#ff0000';
	}
				
	var regexp = /p=(\d+)/;
	var result = objOpponent.href.match(regexp);
	var urlMucNo = siteUrl + 'mod=arena&pid='+result[1]+'&sh='+secureHash;
	var el = document.createElement('a');
	el.href = urlMucNo;
	el.innerHTML = '<small><font color='+color+'>(Lvl ' +stats[index][statsIndexLevel] + '/HP ' + stats[index][statsIndexHPCurrent] + '/' + chanceToWin+'%)</font></small>';
	objOpponent.parentNode.appendChild(el);
	*/

	/* Using server simulator */
	var nSims = 500;
	data = "count=" + nSims + "&";
	data += "&gladiator1=" + stats[0][statsIndexCharname]+"&gladiator2=" + stats[index][statsIndexCharname];
	data += "&hitpoint1=" + stats[0][statsIndexHPCurrent]+"&hitpoint2=" + stats[index][statsIndexHPCurrent];
	data += "&level1=" + stats[0][statsIndexLevel]+"&level2=" + stats[index][statsIndexLevel];
	data += "&skill1=" + stats[0][statsIndexSkill]+"&skill2=" + stats[index][statsIndexSkill];
	data += "&agility1=" + stats[0][statsIndexAgility]+"&agility2=" + stats[index][statsIndexAgility];
	data += "&charisma1=" + stats[0][statsIndexCharisma]+"&charisma2=" + stats[index][statsIndexCharisma];
	data += "&armour1=" + stats[0][statsIndexArmour]+"&armour2=" + stats[index][statsIndexArmour];
	data += "&damage11=" + stats[0][statsIndexDamage1]+"&damage12=" + stats[index][statsIndexDamage1];
	data += "&damage21=" + stats[0][statsIndexDamage2]+"&damage22=" + stats[index][statsIndexDamage2];
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
				objOpponent.parentNode.appendChild(document.createTextNode(' '));

				var chanceToWin = result[1]*100/nSims;
				var dmgDone = result[2];
				var dmgReceive = result[3];
				var color = '#000000';
				if ( chanceToWin >= 90 ) {
					color = '#009010';
				} else if ( chanceToWin >= 75 ) {
					color = '#0000ff';
				} else if ( chanceToWin < 60 ) {
					color = '#ff0000';
				}
				
				var regexp = /p=(\d+)/;
				var result = objOpponent.href.match(regexp);
				var urlMucNo = siteUrl + 'mod=arena&pid='+result[1]+'&sh='+secureHash;
				var el = document.createElement('a');
				el.href = urlMucNo;
				el.innerHTML = '<small><font color='+color+'>(Lvl ' +stats[index][statsIndexLevel] 
					+ '/HP ' + stats[index][statsIndexHPCurrent] + '/' 
					+ chanceToWin+'%|<font color="#0000ff">'+dmgDone+'</font>|<font color="#ff0000">'+dmgReceive+'</font>)</font></small>';
				objOpponent.parentNode.appendChild(el);
			}
		}
	});
}

function arenaCheckOpponentsOnPage() {
	var allLinks = document.getElementsByTagName('a');
	for ( var i = 0; i < allLinks.length; i++ ) {
		var url = allLinks[i].href;
		if ( url.search(/\?mod=player/) >= 0 ) {			
			arenaGetStats(url, i+1, allLinks[i]);
		}
	}
}

function arenaDisplayMyStats() {
	var str = '<table border="0" cellpadding="2" cellspacing="0" style="font-size:10px; border: 1px solid #c0c0c0;">';
	str += '<tr><td colspan="2" align="center" style="border-bottom: 1px solid #c0c0c0; background: #e0e0e0"><b>'
		+ stats[0][statsIndexCharname]+'</b></td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Level</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexLevel]+'</td></tr>';
	//str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">HP</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
	//	+ stats[0][statsIndexHP]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">HP</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexHPCurrent]+' / '+stats[0][statsIndexHPMax]+'</td></tr>';
	//str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Exp</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
	//	+ stats[0][statsIndexExp]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Exp</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[0][statsIndexExpCurrent]+' / '+stats[0][statsIndexExpMax]+'</td></tr>';
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
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Absorb</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+stats[0][statsIndexAbsorbMin]+'-'+stats[0][statsIndexAbsorbMax]+'</td></tr>';
	str += '<tr><td align="left">Damage</td><td align="right">'+stats[0][statsIndexDamage1]+'-'+stats[0][statsIndexDamage2]+'</td></tr>';
	str += '</table>';
	divCharStats.innerHTML = str;
}
