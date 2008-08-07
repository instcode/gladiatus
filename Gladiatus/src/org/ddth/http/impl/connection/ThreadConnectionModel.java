/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.impl.connection;

import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.ddth.http.core.connection.ConnectionModel;
import org.ddth.http.core.connection.Request;
import org.ddth.http.core.handler.ConnectionManager;

public class ThreadConnectionModel implements ConnectionModel {
	private ThreadPoolExecutor executor;
	private ConnectionModel connectionModel;

	public ThreadConnectionModel(ConnectionManager manager, int poolSize) {
		connectionModel = new ThreadSafeConnectionModel();
		
		int corePoolSize = 2;
		int keepToAlive = 10000;
		int maxPoolSize = (poolSize < corePoolSize) ? corePoolSize : poolSize;
		SynchronousQueue<Runnable> synchronousQueue = new SynchronousQueue<Runnable>();
		executor = new ThreadPoolExecutor(
				corePoolSize, maxPoolSize, keepToAlive, TimeUnit.MILLISECONDS, synchronousQueue,
				new ThreadPoolExecutor.AbortPolicy());
	}
	
	public void sendRequest(final Request request) {
		executor.execute(new Runnable() {
			public void run() {
				connectionModel.sendRequest(request);
			}
		});
	}
}