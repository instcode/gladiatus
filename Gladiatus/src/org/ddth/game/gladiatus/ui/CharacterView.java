package org.ddth.game.gladiatus.ui;

import org.ddth.game.gladiatus.ui.widget.Meter;
import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Canvas;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;

public class CharacterView extends Composite {

	//private String[] names = { "Strength", "Skill", "Algrity", "Constitution", "Charisma", "Armour", "Damage" };
	private String[] names = { "Name", "Label", "Name", "label", "Name", "Label", "Damage" };
	/**
	 * Create the composite
	 * @param parent
	 * @param style
	 */
	public CharacterView(Composite parent, int style) {
		super(parent, style);
		final GridLayout gridLayout = new GridLayout();
		gridLayout.numColumns = 3;
		setLayout(gridLayout);
		addRow("Level", "7");
		for (int i = 0; i < 5; i++) {
			addRow(names[i], (i + 1)*20, 100);
		}
		addRow("ABC", "34%");
		addRow("DEF", "94%");
		//
	}

	public void setModel(Character character) {
		
	}
	
	protected void addRow(String name, String value) {
		Label lblName = new Label(this, SWT.NONE);
		lblName.setText(name);

		Canvas canvas = new Canvas(this, SWT.NONE);
		canvas.setLayoutData(new GridData(100, 20));

		Label lblValue = new Label(this, SWT.NONE);
		lblValue.setText(value);
	}
	
	protected int addRow(String name, int value, int max) {
		Label lblName = new Label(this, SWT.NONE);
		lblName.setText(name);

		Meter meter = new Meter(this, SWT.NONE);
		meter.setMeter(value * 100 / max);
		meter.setLayoutData(new GridData(200, 20));

		Label lblValue = new Label(this, SWT.NONE);
		lblValue.setText(value + "/" + max);
		return 0;
	}
}
