package org.ddth.game.gladiatus.core;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.ddth.game.gladiatus.core.http.request.LoginRequest;
import org.ddth.http.core.connection.Session;

public class Game {

	private static Game instance = new Game();
	private Map<String, Session> sessions = new ConcurrentHashMap<String, Session>();

	private Game() {
		// Singleton
	}
	
	public static Game getInstance() {
		return instance;
	}
	
	public Session login(String serverAddress, String username, String password) {
		Session session = sessions.get(username);
		if (session == null) {
			session = new Session();
			session.start();
			sessions.put(username, session);
		}
		session.queueRequest(new LoginRequest(serverAddress));
		return session;
	}
	
	public int getMaxSkill(int level) {
		return 100;
	}
	
	public int getMaxStrength(int level) {
		return 100;
	}

	public int getMaxAgility(int level) {
		return 100;
	}

	public int getMaxConstitution(int level) {
		return 100;
	}

	public int getMaxCharisma(int level) {
		return 100;
	}
}
