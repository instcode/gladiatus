/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.core.connection;

import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.ddth.http.core.handler.SessionEvent;
import org.ddth.http.core.handler.SessionListener;
import org.ddth.http.impl.connection.RequestFuture;
import org.ddth.http.impl.connection.ThreadSafeConnectionModel;

public class Session implements Runnable {
	/**
	 * Make sure we don't flood the server continuously :D...
	 * We should appear as a "well-educated" grabber ;-) 
	 */
	private static final long DELAY_TIME_BETWEEN_TWO_REQUESTS = 2000;

	private boolean isRunning = false;
	private Thread workerThread = null;
	private Queue<RequestFuture> queue = new ConcurrentLinkedQueue<RequestFuture>();
	private ConnectionModel connectionModel = new ThreadSafeConnectionModel();
	private SessionListener listener;

	public void addSessionListener(SessionListener listener) {
		this.listener = listener;
	}

	public RequestFuture queueRequest(String url) {
		return queueRequest(new Request(url));
	}
	
	public RequestFuture queueRequest(Request request) {
		final Request innerRequest = request;
		
		RequestFuture requestFuture = new RequestFuture() {
			Request request = innerRequest;
			boolean isRequested = false;

			@Override
			public boolean isRequested() {
				return isRequested;
			}

			@Override
			public void cancel() {
				isRequested = true;
			}

			@Override
			public void request() {
				if (!isRequested) {
					connectionModel.sendRequest(request);
					isRequested = true;
				}
			}		
		};
		
		queue.offer(requestFuture);
		return requestFuture;
	}

	public boolean isRunning() {
		return isRunning;
	}
	
	/**
	 * Start the current worker thread
	 */
	public void start() {
		if (!isRunning && workerThread == null) {
			isRunning = true;
			workerThread = new Thread(this);
			workerThread.setDaemon(true);
			workerThread.setPriority(Thread.MIN_PRIORITY);
			workerThread.start();
		}
	}

	/**
	 * Stop the current worker thread without blocking. Caller should
	 * regularly check whether it is exited or not by invoking method
	 * {@link #isRunning()}.
	 * 
	 * @see #stop()
	 */
	public void pause() {
		isRunning = false;
	}
	
	/**
	 * Stop the current worker thread and block until
	 * it is completely exited.
	 * 
	 * @see #pause()
	 */
	public void stop() {
		pause();
		if (workerThread != null && workerThread.isAlive()) {
			synchronized (workerThread) {
				while (workerThread != null) {
					try {
						workerThread.wait(1000);
					}
					catch (InterruptedException e) {
					}
				}
			}
		}
	}

	public void run() {
		fireSessionChange(new SessionEvent(this, SessionEvent.SESSION_STARTED_EVENT));
		while (isRunning) {
			RequestFuture requestFuture = queue.poll();
			if (requestFuture != null) {
				requestFuture.request();
			}
			try {
				Thread.sleep(DELAY_TIME_BETWEEN_TWO_REQUESTS);
			}
			catch (InterruptedException e) {
			}
		}
		isRunning = false;
		fireSessionChange(new SessionEvent(this, SessionEvent.SESSION_ENDED_EVENT));
		
		// Make sure recent stop action stops waiting for this thread to exit
		workerThread.notifyAll();
		workerThread = null;
	}
	
	protected void fireSessionChange(SessionEvent event) {
		if (listener != null) {
			listener.sessionChanged(event);
		}
	}
}
