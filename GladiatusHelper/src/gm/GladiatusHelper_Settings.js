/**
 * Gladiatus Helper - Settings
 * Load/Save configuration of the helper.
 *
 * @copyright (C) 2008, DDTH.ORG
 * @history
 *   2008.10.14
 *     - First version
 */

/*********** SETTING UP ***********/
GM_addStyle(<><![CDATA[
.headerHighscore{left:145px;}
.headerHonor{left:280px; top:4px}
.headerRes,#rubies{left:440px;}
#txt_msg{position:absolute; width:100px; height:24px; left:590px; top:7px; margin-right:3px; color: #000; font-family:"Verdana", serif; font-weight: bold; font-size:0.6em;}
]]></>.toXMLString());

var plugin = document.createElement("span");
plugin.setAttribute('class','topmenuitem');
plugin.setAttribute('style','margin-top:8px; font-size:12px');
plugin.innerHTML = "<a href='http://" + gameServer + "/game/index.php?mod=settings&" + sh + "' title='Configuration'>Settings</a>";
document.getElementById('header').appendChild(plugin);
/*********** SETTING UP ***********/

/*********** COMMON FUNCTIONS ***********/

/*********** COMMON FUNCTIONS ***********/
