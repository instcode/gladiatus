/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.core.connection;

import java.util.Map;

import org.ddth.http.core.handler.RequestHandler;


public class Request {
	public static final int GET_REQUEST = 0;
	public static final int POST_REQUEST = 1;
	
	private String link;
	private int type = GET_REQUEST;
	private RequestHandler handler;
	private Map<String, String> parameters;

	public Request(String link, RequestHandler handler) {
		this.link = link;
		this.handler = handler;
	}

	public String getURL() {
		return link;
	}
	
	public RequestHandler getHandler() {
		return handler;
	}
	
	public int getType() {
		return type;
	}
	
	public Map<String, String> getParameters() {
		return parameters;
	}
	
	public void setParamters(int type, Map<String, String> parameters) {
		this.type = type;
		this.parameters = parameters;
	}
}
