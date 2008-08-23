package org.ddth.game.gladiatus;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;

import org.ddth.game.gladiatus.model.Character;
import org.ddth.game.gladiatus.support.maths.Range;
import org.ddth.game.gladiatus.core.arena.BattleSimulator;

/**
 * Servlet implementation class ArenaAction
 */
public class SimulateAction extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public SimulateAction() {
    }

    @Override
    public void service(ServletRequest req, ServletResponse res)
    		throws ServletException, IOException {
    	// Request form format:
    	// simulate?count=#level1=#&agility1=#&armour1=#&charisma1=#&skill1=#&damage11=#&damage21=#level2=#&agility2=#&armour2=#&charisma2=#&skill2=#&damage12=#&damage22=#
    	Character player1 = createPlayer(req, 1);
    	Character player2 = createPlayer(req, 1);
    	try {
	    	int sims = Integer.parseInt(req.getParameter("count"));
	    	int win = BattleSimulator.simulate(player1, player2, sims);
	    	res.getWriter().print(win);
	    	res.flushBuffer();
    	}
    	catch (Exception e) {
		}
    	super.service(req, res);
    }
    
    private static Character createPlayer(ServletRequest req, int player) {
		Character character = new Character("Player" + player);
		character.setName("Player" + player);
		character.setStrength(0);
		character.setConstitution(0);
		try {
			character.setLevel(Integer.parseInt(req.getParameter("level" + player)));
			character.setAgility(Integer.parseInt(req.getParameter("agility" + player)));
			character.setArmor(Integer.parseInt(req.getParameter("armour" + player)));
			character.setCharisma(Integer.parseInt(req.getParameter("charisma" + player)));
			character.setSkill(Integer.parseInt(req.getParameter("skill" + player)));
			character.setDamage(new Range(
					Integer.parseInt(req.getParameter("damage1" + player)),
					Integer.parseInt(req.getParameter("damage2" + player))));
		}
		catch (NumberFormatException e) {
		}
		return character;
	}
}
