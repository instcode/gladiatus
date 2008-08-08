package org.ddth.http.core.handler;

import java.io.InputStream;

import org.ddth.http.core.connection.Request;

public class ConnectionEvent {

	public Request request;
	public InputStream inputStream;
	
	public ConnectionEvent(Request request, InputStream inputStream) {
		this.request = request;
		this.inputStream = inputStream;
	}

	public ConnectionEvent(Request request) {
		this(request, null);
	}
}
