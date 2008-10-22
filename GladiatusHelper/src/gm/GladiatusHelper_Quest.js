/**
 * Gladiatus Helper - Quest Module
 * Display work status.
 *
 * @copyright (C) 2008, DDTH.ORG
 * @history
 *   2008.08.28
 *     - First version
 */

/*********** SETTING UP ***********/
var timeRemainingQuest = 0;
var timeInterval = 0;
var divQuestStatus = document.getElementById('panelQuestStatus');
/*********** SETTING UP ***********/

function questDisplayQuestStatus() {
	var str = '<table border="0" cellpadding="2" cellspacing="0" style="font-size:10px; border: 1px solid #c0c0c0; width: 100%;">';
	str += '<tr><td colspan="2" align="left" style="border-bottom: 1px solid #c0c0c0;"><a href="index.php?mod=location&loc=1&d=1&sh='+secureHash+'" title="Harpy (Nguoi dan ba la loi), Medusa (Nguoi ran), Cerberus (Cho 2 dau), Minotaur (Qui dau trau)">Mist Mountains</a></td></tr>' +
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
	str += '<tr><td colspan="2" id="tdQuestDesc" width="200">---</td></tr>';
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
			var remainingTime = getSpanContent(pulled, 'bx0', 'id');
			if ( remainingTime != '') {
				//must wait for next quest available
				questStatus.innerHTML = remainingTime;
				questDesc.innerHTML = '---';
				var regexp = /s=(\d+)\-Math/;
				var result = pulled.innerHTML.match(regexp);
				timeRemainingQuest = result[1];
				timerQuest();
				setAutoReceiveQuestTimer();
			} else if ( responseDetails.responseText.indexOf("cancel") >= 0 ) {
				//quest is undergoing
				questStatus.innerHTML = 'Undergoing';
				var tag = xpathQuery(".//div[@style='clear: both;']", pulled);
				if ( tag.snapshotLength ) {
					//ok we got quest information
					var divQuest = tag.snapshotItem(0);
					var questTitle = questGetTitle(divQuest);
					var currenStatus = questGetCurrentStatus(divQuest);
					var reward = questGetReward(divQuest);
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

function questGetCurrentStatus(divQuest) {
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

function questGetReward(divQuest) {
	var tag = xpathQuery(".//table", divQuest);
	if ( tag.snapshotLength ) {
		var table = tag.snapshotItem(2);
		tag = xpathQuery(".//td", table);
		var td = tag.snapshotItem(0);
		removeChildsByTagName(td, "script");
		removeChildsByTagName(td, "img");
		removeChildsByTagName(td, "div[@id='reward']");
		return td.innerHTML;
	} else {
		return '';
	}
}

function questGetTitle(divQuest) {
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

function setAutoReceiveQuestTimer() {
	timeInterval = 5 * 1000;
	setTimeout(checkQuestRecAvailable, timeInterval);
}

function checkQuestRecAvailable() {
	GM_xmlhttpRequest({
		method: "GET",
		url: urlTavern,
		onload: function(responseDetails) {
			var responseText responseDetails.responseText;
			var matchRegExp = /value="([^"]*)" name="dif3"/;
			var group = responseText.match(matchRegExp);
			if (group != null) {
				autoReceiveQuest(group[1]);
			} else {
				setTimeout(checkQuestRecAvailable, timeInterval);
			}
		}
	});
}

function autoReceiveQuest(quest) {
	strData = "dif3=" + quest;
	GM_xmlhttpRequest({
		method: "POST",
		url: urlTavern,
		headers: {'Content-type':'application/x-www-form-urlencoded'},
		data: encodeURI(strData),
		onload: function() {
			alert("Received quest");
			window.reload();
		}
	});
}