package org.ddth.game.gladiatus.core.auction;

public class AuctionItem {

	public int index;
	public String id;
	public String type;

	public String username;
	public String session;
	public int currentPrice;
	public int maxPrice;
	
	public AuctionItem(String id, String username, String session, int maxPrice) {
		this.id = id;
		this.username = username;
		this.session = session;
		this.maxPrice = maxPrice;
	}
}
