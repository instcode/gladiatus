/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.core.handler;

import org.ddth.http.core.connection.Request;

public interface ConnectionListener {

	/**
	 * @param request
	 */
	public void notifyRequesting(Request request);
	
	/**
	 * @param request
	 */
	public void notifyFinished(Request request);
}