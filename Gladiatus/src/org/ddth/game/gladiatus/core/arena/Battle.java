package org.ddth.game.gladiatus.core.arena;

import org.ddth.game.gladiatus.core.GameHelper;
import org.ddth.game.gladiatus.model.Character;
import org.ddth.game.gladiatus.support.maths.Range;

public abstract class Battle {

	protected Gladiator gladiator1;
	protected Gladiator gladiator2;
	
	public Battle(Character challenger, Character defender) {
		this.gladiator1 = createGladiator(challenger, defender);
		this.gladiator2 = createGladiator(defender, challenger);
	}

	private final Gladiator createGladiator(Character friend, Character opponent) {
		int skill = friend.getSkill();
		int chanceToHit = (skill * 100) / (skill + opponent.getAgility());
		int chanceToDoubleHit = friend.getCharisma() - opponent.getCharisma();
		
		Gladiator gladiator = new Gladiator();
		Range absorb = GameHelper.getInstance().getAbsorbableDamage(opponent.getArmor());
		Range damage = friend.getDamage();
		int minDamage = damage.getMin() - absorb.getMax();
		int maxDamage = damage.getMax() - absorb.getMin();
		// Update net damage
		gladiator.setDamage(new Range(Math.max(0, minDamage), Math.max(0, maxDamage)));
		gladiator.setChanceToHit(Math.max(0, chanceToHit));
		gladiator.setChanceToDoubleHit(Math.max(0, chanceToDoubleHit));
		return gladiator;
	}
	
	public Gladiator getGladiator1() {
		return gladiator1;
	}
	
	public Gladiator getGladiator2() {
		return gladiator2;
	}
	
	abstract public void fight();
}
