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

var divCharStats = document.getElementById('panelCharStats');
var characterStats;
/*********** SETTING UP ***********/

function overviewDisplayCharacterStats() {
	getStats({url: urlOverview, handler: displayCharacterStats});
}

function getStats(params) {
	GM_xmlhttpRequest({
		method: "GET",
		url: params.url,
		onload: function(responseDetails) {
			pulled = document.createElement('div');
			pulled.innerHTML = responseDetails.responseText;
			var stats = new Array();
			stats[statsIndexCharname]     = getSpanContent(pulled, 'playername', 'class');
			stats[statsIndexLevel]        = parseInt(getSpanContent(pulled, 'char_level', 'id'));
			stats[statsIndexHP]           = getSpanContent(pulled, 'char_leben', 'id');
			stats[statsIndexExp]          = getSpanContent(pulled, 'char_exp', 'id');
			stats[statsIndexStrength]     = parseInt(getSpanContent(pulled, 'char_f0', 'id'));
			stats[statsIndexSkill]        = parseInt(getSpanContent(pulled, 'char_f1', 'id'));
			stats[statsIndexAgility]      = parseInt(getSpanContent(pulled, 'char_f2', 'id'));
			stats[statsIndexConstitution] = parseInt(getSpanContent(pulled, 'char_f3', 'id'));
			stats[statsIndexCharisma]     = parseInt(getSpanContent(pulled, 'char_f4', 'id'));
			//stats[statsIndexIntelligence] = parseInt(getSpanContent(pulled, 'char_f5'));
			stats[statsIndexArmour]       = parseInt(getSpanContent(pulled, 'char_panzer', 'id'));

			var armour = stats[statsIndexArmour];
			stats[statsIndexAbsorbMin] = Math.floor(armour/66) - Math.floor((armour-66)/660+1);
			stats[statsIndexAbsorbMax] = Math.floor(armour/66) + Math.floor(armour/660);

			var hpStr = getDivAttribute(pulled, 'char_leben_tt', 'id', 'onMouseOver');
			var regexp = /.*?(\d+)\s*\/\s*(\d+)/;
			var regexpResult = hpStr.match(regexp);
			stats[statsIndexHPCurrent] = parseInt(regexpResult[1]);
			stats[statsIndexHPMax]     = parseInt(regexpResult[2]);
			
			var expStr = getDivAttribute(pulled, 'char_exp_tt', 'id', 'onMouseOver');
			var regexp = /.*?(\d+)\s*\/\s*(\d+)/;
			var regexpResult = expStr.match(regexp);
			stats[statsIndexExpCurrent] = parseInt(regexpResult[1]);
			stats[statsIndexExpMax]     = parseInt(regexpResult[2]);

			dmg = getSpanContent(pulled, 'char_schaden');
			if ( dmg != '' ) {
				stats[statsIndexDamage1] = parseInt(dmg.split('-')[0].replace(/^\s+|\s+$/g, ''));
				stats[statsIndexDamage2] = parseInt(dmg.split('-')[1].replace(/^\s+|\s+$/g, ''));
			} else {
				debug('Error while getting damage stats for ['+stats[statsIndexCharname]+']!');
			}
			params.stats = stats;
			params.handler(params);
		}
	});
}

function displayCharacterStats(params) {
	characterStats = params.stats;
	var str = '<table border="0" cellpadding="2" cellspacing="0" style="font-size:10px; border: 1px solid #c0c0c0;">';
	str += '<tr><td colspan="2" align="center" style="border-bottom: 1px solid #c0c0c0; background: #e0e0e0"><b>'
		+ stats[statsIndexCharname]+'</b></td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Level</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[statsIndexLevel]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">HP</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[statsIndexHPCurrent]+' / '+stats[statsIndexHPMax]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Exp</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[statsIndexExpCurrent]+' / '+stats[statsIndexExpMax]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Strength</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[statsIndexStrength]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Skill</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[statsIndexSkill]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Agility</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[statsIndexAgility]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Constitution</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[statsIndexConstitution]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Charisma</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[statsIndexCharisma]+'</td></tr>';
	//str += '<tr><td align="left">Intelligence</td><td align="right">'+stats[statsIndexIntelligence]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Armour</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+ stats[statsIndexArmour]+'</td></tr>';
	str += '<tr><td align="left" style="border-bottom: 1px solid #c0c0c0;">Absorb</td><td align="right" style="border-bottom: 1px solid #c0c0c0;">'
		+stats[statsIndexAbsorbMin]+'-'+stats[statsIndexAbsorbMax]+'</td></tr>';
	str += '<tr><td align="left">Damage</td><td align="right">'+stats[statsIndexDamage1]+'-'+stats[statsIndexDamage2]+'</td></tr>';
	str += '</table>';
	divCharStats.innerHTML = str;
}