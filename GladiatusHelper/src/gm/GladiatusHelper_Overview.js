/**
 * Gladiatus Helper - Overview Module
 * Display character status.
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
			}
		}
	});
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
