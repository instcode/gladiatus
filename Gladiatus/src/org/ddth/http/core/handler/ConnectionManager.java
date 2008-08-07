/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.core.handler;

import java.util.ArrayList;
import java.util.List;

import org.ddth.http.core.connection.Request;

public class ConnectionManager implements ConnectionListener {
	private List<ConnectionListener> listeners;

	public ConnectionManager() {
		this.listeners = new ArrayList<ConnectionListener>();
	}
		
	public synchronized void registerConnectionListener(ConnectionListener listener) {
		listeners.add(listener);	
	}

	public synchronized void unregisterConnectionListener(ConnectionListener listener) {
		listeners.remove(listener);
	}
	
	@Override
	public synchronized void notifyFinished(Request request) {
		for (ConnectionListener listener : listeners) {
			listener.notifyFinished(request);
		}
	}

	@Override
	public synchronized void notifyRequesting(Request request) {
		for (ConnectionListener listener : listeners) {
			listener.notifyRequesting(request);
		}
	}
}