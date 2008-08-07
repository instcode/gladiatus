package org.ddth.game.gladiatus.core;

public class Game {

	private static Game instance = new Game();
	
	private Game() {
		// Singleton
	}
	
	public static Game getInstance() {
		return instance;
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
