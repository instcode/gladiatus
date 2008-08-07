/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.core.connection;

import java.io.InputStream;

public class Request {
	
	private String link;
	private RequestHandler handler;
	private InputStream inputStream;

	public Request(String link, RequestHandler handler) {
		this.link = link;
		this.handler = handler;
	}

	/**
	 * @return
	 */
	public String getURL() {
		return link;
	}

	/**
	 * @param inputStream
	 */
	public void setResponseStream(InputStream inputStream) {
		this.inputStream = inputStream;
	}

	/**
	 * @return
	 */
	public InputStream getResponseStream() {
		return inputStream;
	}
}
