package org.ddth.game.gladiatus.core.arena;

import org.ddth.game.gladiatus.model.Character;

public class BattleV040 extends Battle {

	public BattleV040(Character challenger, Character defender) {
		super(challenger, defender);
	}

	@Override
	public void fight() {
		round1();
		round2();
		round1();
	}

	public void round1() {
		
	}
	
	private void round2() {
		
	}
}
