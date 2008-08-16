package org.ddth.game.gladiatus.core;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.ddth.game.gladiatus.core.http.request.LoginRequest;
import org.ddth.game.gladiatus.support.maths.Range;
import org.ddth.http.core.connection.Session;
import org.ddth.game.gladiatus.model.Character;

public class GameHelper {

	private static GameHelper instance = new GameHelper();
	private Map<String, Session> sessions = new ConcurrentHashMap<String, Session>();

	private GameHelper() {
		// Singleton
	}
	
	public static GameHelper getInstance() {
		return instance;
	}
	
	public Session login(String serverAddress, String username, String password) {
		Session session = sessions.get(username);
		if (session == null) {
			session = new Session();
			session.start();
			sessions.put(username, session);
		}
		session.queueRequest(new LoginRequest(serverAddress, username, password));
		return session;
	}
	
	public Range getAbsorbableDamage(int armor) {
		int min = Math.max(0, (armor / 66) - (armor / 660 + 1));
		int max = Math.max(0, (armor / 66) + (armor / 660));
		return new Range(min, max);
	}
	
	private int getMaxStat(int level, int basic) {
		return (int) (level + 1.5 * basic);
	}
	
	public int getMaxSkill(Character character) {
		return getMaxStat(character.getLevel(), character.getSkill());
	}
	
	public int getMaxStrength(Character character) {
		return getMaxStat(character.getLevel(), character.getStrength());
	}

	public int getMaxAgility(Character character) {
		return getMaxStat(character.getLevel(), character.getAgility());
	}

	public int getMaxConstitution(Character character) {
		return getMaxStat(character.getLevel(), character.getConstitution());
	}

	public int getMaxCharisma(Character character) {
		return getMaxStat(character.getLevel(), character.getCharisma());
	}
}
