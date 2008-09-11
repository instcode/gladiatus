/*
http://isohunt.com Interface Javascript
by Gary Fung - email: gary{REPLACE_WITH_THE_AT_SIGN}isohunt.com

Feel free to use / mod this to your heart's content,
but keep these lines to acknowledge where this code originated.
Comments, mods or additions you'd like add to this script can be posted here:
http://isohunt.com/forum/viewforum.php?f=1

Tip popup functions adapted from AWStats: http://awstats.sourceforge.net/
 */
var smooth_timer;

function showTip(fArg) {
	var tooltipOBJ = (document.getElementById) ? document
			.getElementById('ih' + fArg) : eval("document.all['ih" + fArg
			+ "']");
	if (tooltipOBJ != null) {
		var tooltipLft = (document.body.offsetWidth ? document.body.offsetWidth
				: document.body.style.pixelWidth)
				- (tooltipOBJ.offsetWidth ? tooltipOBJ.offsetWidth
						: (tooltipOBJ.style.pixelWidth ? tooltipOBJ.style.pixelWidth
								: $TOOLTIPWIDTH)) - 5;
		var tooltipTop = 10;

		if (navigator.appName == 'Netscape') {
			if (parseFloat(navigator.appVersion) >= 5)
				tooltipTop = (document.body.scrollTop >= 0 ? document.body.scrollTop + 10
						: event.clientY + 10);
			tooltipOBJ.style.left = tooltipLft;
			tooltipOBJ.style.top = tooltipTop;
		} else {
			tooltipLft -= 30;
			tooltipTop = (document.body.scrollTop ? document.body.scrollTop
					: document.body.offsetTop)
					+ event.clientY
					- (tooltipOBJ.scrollHeight ? tooltipOBJ.scrollHeight
							: tooltipOBJ.style.pixelHeight) - 30;
			if (tooltipTop < (document.body.scrollTop ? document.body.scrollTop
					: document.body.offsetTop) + 10) {
				if (event.clientX > tooltipLft)
					tooltipTop = (document.body.scrollTop ? document.body.scrollTop
							: document.body.offsetTop)
							+ event.clientY + 30;
				else
					tooltipTop = (document.body.scrollTop ? document.body.scrollTop
							: document.body.offsetTop) + 10;
			}
			tooltipOBJ.style.pixelLeft = tooltipLft;
			tooltipOBJ.style.pixelTop = tooltipTop;
		}
		tooltipOBJ.style.visibility = "visible";
	}
}
function hideTip(fArg) {
	var tooltipOBJ = (document.getElementById) ? document
			.getElementById('ih' + fArg) : eval("document.all['ih" + fArg
			+ "']");
	if (tooltipOBJ != null)
		tooltipOBJ.style.visibility = "hidden";
}
function smoothHeight(id, curH, targetH, stepH, mode) {
	diff = targetH - curH;
	if (diff != 0) {
		newH = (diff > 0) ? curH + stepH : curH - stepH;
		((document.getElementById) ? document.getElementById(id)
				: eval("document.all['" + id + "']")).style.height = newH
				+ "px";
		if (smooth_timer)
			window.clearTimeout(smooth_timer);
		smooth_timer = window.setTimeout("smoothHeight('" + id + "'," + newH
				+ "," + targetH + "," + stepH + ",'" + mode + "')", 16);
	} else if (mode != "o")
		((document.getElementById) ? document.getElementById(mode)
				: eval("document.all['" + mode + "']")).style.display = "none";
}

function getBrowser() {
	var BrowserDetect = {
		init : function() {
			this.browser = this.searchString(this.dataBrowser)
					|| "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
					|| this.searchVersion(navigator.appVersion)
					|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
		},
		searchString : function(data) {
			for ( var i = 0; i < data.length; i++) {
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch
						|| data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				} else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion : function(dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1)
				return;
			return parseFloat(dataString.substring(index
					+ this.versionSearchString.length + 1));
		},
		dataBrowser : [ {
			string :navigator.userAgent,
			subString :"OmniWeb",
			versionSearch :"OmniWeb/",
			identity :"OmniWeb"
		}, {
			string :navigator.vendor,
			subString :"Apple",
			identity :"Safari"
		}, {
			prop :window.opera,
			identity :"Opera"
		}, {
			string :navigator.vendor,
			subString :"iCab",
			identity :"iCab"
		}, {
			string :navigator.vendor,
			subString :"KDE",
			identity :"Konqueror"
		}, {
			string :navigator.userAgent,
			subString :"Firefox",
			identity :"Firefox"
		}, {
			string :navigator.vendor,
			subString :"Camino",
			identity :"Camino"
		}, { // for newer Netscapes (6+)
					string :navigator.userAgent,
					subString :"Netscape",
					identity :"Netscape"
				}, {
					string :navigator.userAgent,
					subString :"MSIE",
					identity :"Explorer",
					versionSearch :"MSIE"
				}, {
					string :navigator.userAgent,
					subString :"Gecko",
					identity :"Mozilla",
					versionSearch :"rv"
				}, { // for older Netscapes (4-)
					string :navigator.userAgent,
					subString :"Mozilla",
					identity :"Netscape",
					versionSearch :"Mozilla"
				} ],
		dataOS : [ {
			string :navigator.platform,
			subString :"Win",
			identity :"Windows"
		}, {
			string :navigator.platform,
			subString :"Mac",
			identity :"Mac"
		}, {
			string :navigator.platform,
			subString :"Linux",
			identity :"Linux"
		} ]
	};
	BrowserDetect.init();
	return BrowserDetect.browser;
}

function rowOver(i, nColor) {
	if (!nColor)
		nColor = "#ECECD9";
	var nameObj = (document.getElementById) ? document
			.getElementById('event_' + i) : eval("document.all['event_" + i + "']");
	if (nameObj != null)
		nameObj.style.background = nColor;
}

function rowOut(i, nColor) {
	var trObj = (document.getElementById) ? document.getElementById('event_displacement_' + i)
			: eval("document.all['event_displacement_" + i + "']");
	var nameObj = (document.getElementById) ? document
			.getElementById('event_' + i) : eval("document.all['event_" + i + "']");
	if (trObj == null || trObj.style.display == "none")
		nameObj.style.background = nColor;
}

function toggleEventView(eventId) {
	var eventObj = (document.getElementById) ? document.getElementById('event_' + eventId)
			: eval("document.all['event_" + eventId + "']");
	var trObj = (document.getElementById) ? document.getElementById('event_displacement_' + eventId)
			: eval("document.all['event_displacement_" + eventId + "']");
	var ifObj = (document.getElementById) ? document.getElementById('event_detail_' + eventId)
			: eval("document.all['event_detail_" + eventId + "']");

	var browser = getBrowser();

	if (browser == "Firefox" || browser == "Mozilla" || browser == "Netscape"
			|| browser == "Gecko" || browser == "Seamonkey") {
		trObj.addEventListener("click", stopEvent, false);
		eventObj.addEventListener("click", stopEvent, false);
	}
	else {
		window.event.cancelBubble = true;
	}
	if (trObj != null) {
		if (trObj.style.display == "none") {
			ifObj.style.height = "0px";
			trObj.style.display = "";
			eventObj.style.background = "#ECECD9";
			smoothHeight('event_detail_' + eventId, 0, 210, 42, 'o');
		}
		else {
			smoothHeight('event_detail_' + eventId, 210, 0, 42, 'event_displacement_' + eventId);
		}
	}
}

function stopEvent(ev) {
	// this ought to keep t-daddy from getting the click.
	ev.stopPropagation();
}