package org.ddth.game.gladiatus.core;

public enum Stats {
	LEVEL("Level", 0, false),
	STRENGTH("Strength", 1, true),
	SKILL("Skill", 2, true),
	AGILITY("Agility", 3, true),
	CONSTITUTION("Constitution", 4, true),
	CHARISMA("Charisma", 5, true),
	ARMOR("Armor", 6, false),
	DAMAGE("Damage", 7, false),
	CHANCE_TO_HIT("Chance to Hit", 8, false),
	CHANCE_TO_DOUBLE_HIT("Chance to Double Hit", 9, false);

	private boolean isPrimary;
	private int index;
	private String name;

	private Stats(String name, int index, boolean isPrimary) {
		this.name = name;
		this.index = index;
		this.isPrimary = isPrimary;
	}

	public boolean isPrimary() {
		return isPrimary;
	}
	
	public int index() {
		return index;
	}
	
	public String value() {
		return name;
	}

	public String toString() {
		return name;
	}
}