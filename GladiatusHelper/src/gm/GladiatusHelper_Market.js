/**
 * Gladiatus Helper - Market Module
 * Support for fast buying good price goods at the market
 *
 * @copyright (C) 2008, DDTH.ORG
 * @history
 *   2008.10.11
 *     - Display food hp/price ratio next to "Buy" button.
 */

/** ********* SETTING UP ********** */
const marketRegexp = /.ang s. d.ng: H.i ph.c (\d+) m.ng s.ng/;
/** ********* SETTING UP ********** */

function marketDisplayPriceRate() {
	var reports = document.getElementsByTagName('script')[4].innerHTML;
	var item = document.getElementById('market_table').getElementsByTagName('tr');
	var ratio = document.createElement('th');
	item[0].insertBefore(ratio, item[0].lastChild);
	ratio.title = 'The greater the value the more cost-effective';
	ratio.innerHTML = 'Ratio';
	
	var contents = new Array();
	var ids = new Array();
	var a, b;
	for ( var i = 0;; i++) {
		if (reports.indexOf('</tr></table>') == -1)
			break;
		a = reports.substring(reports.indexOf('AddCharDiv('), reports.indexOf('</tr></table>'));
		b = reports.substring(reports.indexOf('AddCharDiv(') + 12, reports.indexOf('\','));
		if (a.length > 300) {
			contents.push(a);
			ids.push(b);
		}
		reports = reports.substring(reports.indexOf('</tr></table>') + 14, reports.length);
	}

	for ( var i = 1; i < item.length; i++) {
		ratio = document.createElement('td');
		var id = item[i].getElementsByTagName('div')[0].getAttribute('id');
		var money = item[i].getElementsByTagName('td')[2].innerHTML;
		money = money.substring(0, money.indexOf(' '));
		money = money.replace('.', '');
		for ( var j = 0; j < contents.length; j++) {
			if (id == ids[j]) {
				var regexpResult = contents[j].match(marketRegexp);
				var ratioText = '*';
				if (regexpResult != null) {
					var hp = regexpResult[1];
					var ratios = (hp * 1) / (money * 1) + "";
					if (ratios * 1 > 0.35)
						ratioText = '<font color=red><b>' + ratios.substring(0, 5) + '</b></font>';
					else
						ratioText = ratios.substring(0, 5);
				}
				ratio.title = 'Life/Money';
				ratio.innerHTML = ratioText;
				break;
			}
		}
		item[i].insertBefore(ratio, item[i].lastChild);
	}
}
