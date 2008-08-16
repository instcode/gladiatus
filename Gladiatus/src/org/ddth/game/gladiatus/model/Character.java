package org.ddth.game.gladiatus.model;

import org.ddth.game.gladiatus.support.maths.Range;

public class Character {
	private String id;
	private int level;
	private String name;
	private int strength;
	private int skill;
	private int agility;
	private int constitution;
	private int charisma;
	private int armor;
	private int intelligent;
	private Range damage;
	
	public Character(String id) {
		this.id = id;
	}
	
	public String getId() {
		return id;
	}
	
	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getStrength() {
		return strength;
	}

	public void setStrength(int strength) {
		this.strength = strength;
	}

	public int getSkill() {
		return skill;
	}

	public void setSkill(int skill) {
		this.skill = skill;
	}

	public int getAgility() {
		return agility;
	}

	public void setAgility(int agility) {
		this.agility = agility;
	}

	public int getConstitution() {
		return constitution;
	}

	public void setConstitution(int constitution) {
		this.constitution = constitution;
	}

	public int getCharisma() {
		return charisma;
	}

	public void setCharisma(int charisma) {
		this.charisma = charisma;
	}

	public int getArmor() {
		return armor;
	}

	public void setArmor(int armor) {
		this.armor = armor;
	}

	public Range getDamage() {
		return damage;
	}

	public void setDamage(Range damage) {
		this.damage = damage;
	}

	public void setIntelligent(int intelligent) {
		this.intelligent = intelligent;
	}

	public int getIntelligent() {
		return intelligent;
	}
}
