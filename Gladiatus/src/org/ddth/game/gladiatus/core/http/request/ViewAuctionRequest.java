package org.ddth.game.gladiatus.core.http.request;

import java.util.HashMap;
import java.util.Map;

import org.ddth.http.core.connection.Request;
import org.ddth.http.core.handler.RequestHandler;

public class ViewAuctionRequest extends Request {

	public ViewAuctionRequest(String link, RequestHandler handler) {
		super(link, handler);
		Map<String, String> parameters = new HashMap<String, String>();
		parameters.put("", "");
		setParamters(Request.POST_REQUEST, parameters);
	}

}
