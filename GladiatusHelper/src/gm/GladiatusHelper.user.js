// ==UserScript==
// @name           Gladiatus Helper Extreme
// @namespace      http://www.ddth.org/
// @description    Find your Gladiatus experience more exciting with Gladiatus Helper
// @include        *.gladiatus.*
// @exclude        *.gladiatus.*market*
// @require        http://gladiatus-js.googlecode.com/svn/trunk/gmscripts/GladiatusHelper_Common.js
// @require        http://gladiatus-js.googlecode.com/svn/trunk/gmscripts/GladiatusHelper_Arena.js
// @require        http://gladiatus-js.googlecode.com/svn/trunk/gmscripts/GladiatusHelper_Work.js
// @require        http://gladiatus-js.googlecode.com/svn/trunk/gmscripts/GladiatusHelper_Quest.js
// @require        http://gladiatus-js.googlecode.com/svn/trunk/gmscripts/GladiatusHelper_Auction.js
// ==/UserScript==

/**
 * Based on script "Gladiatus Arena"  by m4rtini (http://userscripts.org/scripts/show/23065)
 * @version   v0.3.3.6 - 2008.09.10
 * @author    NGUYEN, Ba Thanh <btnguyen2k [at] gmail [dot] com>
 * @author    Tuan Duong <bacduong [at] gmail [dot] com>
 * @author    NGUYEN, Xuan Khoa <instcode [at] gmail [dot] com>
 * @author    DUONG, Thien Duc <duongthienduc [at] gmail [dot] com>
 * @copyright DDTH.ORG
 * @history
 * v3.3.6 2008.09.10
 * 	 - Move current Auction Helper into bak file for later implement
 * 	 - Restore Auction Helper (Beta)
 *   - Remove image and script tag in Quest Desc Panel if it have.
 * v3.3.5 2008.09.xx
 *   - GM scripts now officially move to gladiatus-js project space on Google Code
 *   - code clean-up: modular code structure
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

var $CHECK_STATUS = true;

if ( $CHECK_STATUS ) {
	main();
}

function main() {
	arenaDisplayMyStatsAndCheckOpponents();
	workDisplayWorkStatus();
	questDisplayQuestStatus();
	requestAuctionPage();
}
