package org.ddth.http.impl.connection;

import org.ddth.http.core.connection.Request;

public interface RequestFuture {

	Request getRequest();
	
	boolean isRequested();
	
	void cancel();
	
	void request();
}
