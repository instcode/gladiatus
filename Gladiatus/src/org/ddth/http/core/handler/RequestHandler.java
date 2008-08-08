package org.ddth.http.core.handler;


public interface RequestHandler {

	/**
	 * Handle response event
	 * 
	 * @param event
	 */
	void handleResponse(ConnectionEvent event);
	
	/**
	 * Handle requesting event
	 * 
	 * @param event
	 */
	void handleRequest(ConnectionEvent event);

	/**
	 * @param connectionEvent
	 */
	void handleClose(ConnectionEvent event);
}
