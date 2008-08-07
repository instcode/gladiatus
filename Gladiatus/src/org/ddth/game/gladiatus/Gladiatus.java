package org.ddth.game.gladiatus;

import org.ddth.game.gladiatus.model.Character;
import org.ddth.game.gladiatus.support.maths.Range;
import org.ddth.game.gladiatus.ui.CharacterView;
import org.eclipse.swt.SWT;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;

public class Gladiatus {

	/**
	 * Launch the application
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			Gladiatus window = new Gladiatus();
			window.open();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Open the window
	 */
	public void open() {
		final Display display = Display.getDefault();
		final Shell shell = new Shell();
		shell.setSize(280, 569);
		shell.setText("SWT Application");

		shell.open();

		final CharacterView characterView = new CharacterView(shell, SWT.NONE);
		Character character = new Character("instcode");
		character.setName("instcode");
		character.setLevel(7);
		character.setAgility(20);
		character.setArmor(203);
		character.setCharisma(20);
		character.setStrength(20);
		character.setConstitution(20);
		character.setSkill(100);
		character.setDamage(new Range(29, 30));
		
		characterView.setModel(character);
		characterView.setBounds(0, 0, 270, 543);
	
		shell.layout();
		while (!shell.isDisposed()) {
			if (!display.readAndDispatch())
				display.sleep();
		}
	}

}
