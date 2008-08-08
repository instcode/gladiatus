package org.ddth.http.core.handler;

import org.ddth.http.core.connection.Session;

public class SessionEvent {
	public static final int SESSION_STARTED_EVENT = 0;
	public static final int SESSION_ENDED_EVENT = 1;

	public SessionEvent(Session session, int eventType) {
		
	}
}
