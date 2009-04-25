package org.ddth.game.gladiatus.core;

import org.ddth.game.gladiatus.model.Character;
import org.ddth.game.gladiatus.support.maths.Range;

public class GameHelper {

	private static GameHelper instance = new GameHelper();

	private GameHelper() {
		// Singleton
	}
	
	public static GameHelper getInstance() {
		return instance;
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
