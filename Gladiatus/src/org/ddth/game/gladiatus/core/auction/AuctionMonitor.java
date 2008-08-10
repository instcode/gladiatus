package org.ddth.game.gladiatus.core.auction;

import org.ddth.game.gladiatus.core.http.request.LoginRequest;
import org.ddth.http.core.connection.Session;
import org.ddth.http.impl.connection.RequestFuture;

public class AuctionMonitor {

	public static void main(String[] args) {
		Session session = new Session();
		RequestFuture future = session.queueRequest(new LoginRequest("s2.gladiatus.vn"));
		future.request();
	}
}
