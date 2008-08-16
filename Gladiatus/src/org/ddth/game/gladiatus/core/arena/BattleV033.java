package org.ddth.game.gladiatus.core.arena;

import java.util.Random;

import org.ddth.game.gladiatus.model.Character;
import org.ddth.game.gladiatus.support.maths.Range;

public class BattleV033 extends Battle {
	private Random rand = new Random(System.currentTimeMillis());
	
	public BattleV033(Character challenger, Character defender) {
		super(challenger, defender);
	}

	@Override
	public void fight() {
		gladiator1.setHealth(1000);
		gladiator2.setHealth(1000);
		int round = 8 + rand.nextInt(6);
		while (round > 0) {
			round();
			round--;
		}
	}

	public void round() {
		turn(gladiator1, gladiator2);
		turn(gladiator2, gladiator1);
	}

	private void turn(Gladiator attacker, Gladiator defender) {
		attack(attacker, defender);
		// Probability to double hit
		int probability = 1 + rand.nextInt(100);
		if (probability <= attacker.getChanceToDoubleHit()) {
			attack(attacker, defender);
		}
	}

	private void attack(Gladiator attacker, Gladiator defender) {
		int probability = 1 + rand.nextInt(100);
		// Probability to hit
		if (probability <= attacker.getChanceToHit()) {
			Range damage = attacker.getDamage();
			int hitpoints = damage.getMin() + rand.nextInt(damage.getMax());
			defender.setHealth(defender.getHealth() - hitpoints);
		}
	}
}
