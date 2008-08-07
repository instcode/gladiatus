package org.ddth.http.core.connection;

public interface RequestHandler {

	public void handleRequesting(Request request);
	
	public void handleResponsing(Request request);
}
