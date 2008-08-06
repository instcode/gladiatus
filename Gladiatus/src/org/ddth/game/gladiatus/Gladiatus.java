package org.ddth.game.gladiatus;

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
		shell.setSize(500, 298);
		shell.setText("SWT Application");
		//

		shell.open();

		final CharacterView characterView = new CharacterView(shell, SWT.NONE);
		characterView.setBounds(0, 0, 492, 271);
	
		shell.layout();
		while (!shell.isDisposed()) {
			if (!display.readAndDispatch())
				display.sleep();
		}
	}

}
