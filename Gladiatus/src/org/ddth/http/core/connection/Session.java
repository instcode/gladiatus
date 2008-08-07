/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.core.connection;

import org.apache.http.client.CookieStore;
import org.apache.log4j.Logger;
import org.ddth.http.core.handler.SessionListener;
import org.ddth.http.impl.connection.ThreadConnectionModel;

public class Session<T extends State> implements Runnable {
	/**
	 * Make sure we don't flood the server continuously :D...
	 * We should appear as a "well-educated" grabber ;-) 
	 */
	private static final long DELAY_TIME_BETWEEN_TWO_REQUESTS = 2000;

	private Logger logger = Logger.getLogger(Session.class);

	private boolean isRunning;
	private Thread workerThread;
	
	private T state;
	private ConnectionModel connectionModel;
	private SessionListener<T> listener;

	public Session(String charsetEncoding, CookieStore cookieStore) {
		//FIXME
		this.connectionModel = new ThreadConnectionModel(null, 1);
	}

	public T getState() {
		return state;
	}

	/**
	 * Resume to the given state
	 * @param state
	 */
	public void setState(T state) {
		if (isRunning) {
			throw new IllegalStateException("You have to stop the current state first.");
		}
		this.state = state;
	}

	public Request queueRequest(String url, RequestHandler handler) {
		if (state == null) {
			throw new IllegalStateException("Unknown session state");
		}
		Request request = new Request(url, handler);
		state.queue(request);
		return request;
	}
	
	public void registerSessionListener(SessionListener<T> listener) {
		this.listener = listener;
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
			workerThread.setPriority(Thread.MIN_PRIORITY);
			workerThread.start();
		}
	}

	/**
	 * Stop the current worker thread without blocking...
	 * 
	 * @see #stop()
	 */
	public void pause() {
		isRunning = false;
	}
	
	/**
	 * Stop the current worker thread and block until
	 * it is completely exited
	 * 
	 * @see #pause()
	 */
	public void stop() {
		pause();
	}

	public void run() {
		if (listener != null) {
			listener.sessionStarted(this);
		}
		while (isRunning) {
			Request request = state.poll();
			if (request != null) {
				connectionModel.sendRequest(request);
			}
			else {
				logger.debug("Couldn't make '" + request + "' request");
				break;
			}
			try {
				Thread.sleep(DELAY_TIME_BETWEEN_TWO_REQUESTS);
			}
			catch (InterruptedException e) {
			}
		}
		isRunning = false;
		// Wake up all waiting threads on this thread
		if (workerThread != null) {
			workerThread.notifyAll();
			workerThread = null;
		}
		if (listener != null) {
			listener.sessionStopped(this);
		}
	}
}
