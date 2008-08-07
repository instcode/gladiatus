/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.core.handler;

import org.ddth.http.core.connection.Session;
import org.ddth.http.core.connection.State;

public interface SessionListener<T extends State> {
	/**
	 * Notify session is started
	 */
	public void sessionStarted(Session<T> session);
	
	/**
	 * Notify session is stopped
	 */
	public void sessionStopped(Session<T> session);
}