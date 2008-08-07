package org.ddth.game.gladiatus.model.effect;

public class Effect {
	/**
	 * To which this effect applies (damage, armor, agility...) 
	 */
	int field;
	
	/**
	 * Timing constraint
	 */
	int effect;

	public int getField() {
		return field;
	}

	public void setField(int field) {
		this.field = field;
	}

	public int getEffect() {
		return effect;
	}

	public void setEffect(int effect) {
		this.effect = effect;
	}
}
