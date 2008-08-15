package org.ddth.http.impl.connection;

public interface RequestFuture {
	/**
	 * Check if current request is completed or not
	 * 
	 * @return
	 */
	boolean isRequested();
	
	/**
	 * Cancel request in queue
	 */
	void cancel();
	
	/**
	 * Send request now
	 */
	void request();
}
