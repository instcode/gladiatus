package org.ddth.game.gladiatus.core.arena;

import org.ddth.game.gladiatus.support.maths.Range;

public class Gladiator {

	private int health;
	private Range damage;
	private int chanceToHit;
	private int chanceToDoubleHit;

	public int getHealth() {
		return health;
	}
	
	public void setHealth(int health) {
		this.health = health;
	}
	
	public Range getDamage() {
		return damage;
	}

	public void setDamage(Range damage) {
		this.damage = damage;
	}

	public int getChanceToHit() {
		return chanceToHit;
	}

	public void setChanceToHit(int chanceToHit) {
		this.chanceToHit = chanceToHit;
	}

	public int getChanceToDoubleHit() {
		return chanceToDoubleHit;
	}

	public void setChanceToDoubleHit(int chanceToDoubleHit) {
		this.chanceToDoubleHit = chanceToDoubleHit;
	}
	
	@Override
	public String toString() {
		return "Dmg: " + damage + " | Chance To Hit: " + chanceToHit + "% | Chance To Double Hit: " + chanceToDoubleHit + "%";
	}
}
