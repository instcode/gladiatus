/**
 * Gladiatus Helper - Settings
 * Load/Save configuration of the helper.
 *
 * @copyright (C) 2008, DDTH.ORG
 * @history
 *   2008.10.14
 *     - First version
 */

/** ********* SETTING UP ********** */
var plugin = document.createElement("span");
plugin.setAttribute('class', 'topmenuitem');

plugin.innerHTML = "<a href='" + siteUrl + "mod=settings&plugin=1&sh=" + secureHash + "' title='Configuration'>Settings</a>";
document.getElementById('header').appendChild(plugin);
/** ********* SETTING UP ********** */

/** ********* COMMON FUNCTIONS ********** */
function showSettingsModule() {
	document.getElementById('contentBox').getElementsByTagName('td')[1].getElementsByTagName('span')[0].innerHTML = "Plugin Settings";
	document.getElementById('contentBox').getElementsByTagName('td')[1].getElementsByTagName('div')[1].setAttribute('class', 'tab');
	document.getElementById('contentBox').getElementsByTagName('td')[1].getElementsByTagName('div')[1].setAttribute('style', '');
	document.getElementById('contentBox').getElementsByTagName('td')[1].getElementsByTagName('div')[1].innerHTML = '<a href="index.php?mod=settings&plugin=2&' + sh + '" style="height:22px">Buddies</a>';
}
/*********** COMMON FUNCTIONS ***********/
