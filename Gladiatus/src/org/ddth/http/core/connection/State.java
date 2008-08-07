/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 1, 2008 7:45:55 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.core.connection;

public interface State {
	/**
	 * @param request
	 * @return
	 */
	public boolean queue(Request request);
	
	/**
	 * @return
	 */
	public Request poll();
}
