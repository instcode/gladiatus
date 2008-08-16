package org.ddth.game.gladiatus.core.arena;

import org.ddth.game.gladiatus.model.Character;
import org.ddth.game.gladiatus.support.maths.Range;

public class BattleSimulator {

	public static void main(String[] args) {
		Character player1 = createPlayer1();
		Character player2 = createPlayer2();
		for (int i = 0; i < 10; i++) {
			simulate(player1, player2);
		}
	}

	private static void simulate(Character player1, Character player2) {
		Battle battle = new BattleV033(player1, player2);
		int win = 0;
		int draw = 0;
		for (int i = 0; i < 1000; i++) {
			battle.fight();
			int health1 = battle.getGladiator1().getHealth();
			int health2 = battle.getGladiator2().getHealth();
			if (health1 > health2) {
				win++;
			}
			else if (health1 == health2) {
				draw++;
			}
		}
		System.out.println("Player 1 [" + battle.getGladiator1() + "]");
		System.out.println("Player 2 [" + battle.getGladiator2() + "]");
		System.out.println("=> Player 1 won: " + win + " times - Draw: " + draw + " times");
	}

	private static Character createPlayer1() {
		Character character = new Character("instcode");
		character.setName("instcode");
		character.setLevel(7);
		character.setAgility(67);
		character.setArmor(650);
		character.setCharisma(30);
		character.setStrength(20);
		character.setConstitution(20);
		character.setSkill(53);
		character.setDamage(new Range(19, 23));
		return character;
	}
	
	private static Character createPlayer2() {
		Character character = new Character("wolf");
		character.setName("wolf");
		character.setLevel(7);
		character.setAgility(68);
		character.setArmor(782);
		character.setCharisma(37);
		character.setStrength(20);
		character.setConstitution(20);
		character.setSkill(50);
		character.setDamage(new Range(20, 30));
		return character;
	}
}
