package org.ddth.game.gladiatus.core.http.request;

import org.ddth.http.core.connection.Request;
import org.ddth.http.core.connection.RequestContext;

public class GeneralRequest extends Request {

	protected RequestContext context;
	
	public GeneralRequest(RequestContext context) {
		super("", null);
		this.context = context;
	}

}
