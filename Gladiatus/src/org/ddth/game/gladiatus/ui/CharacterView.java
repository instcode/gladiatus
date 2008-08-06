package org.ddth.game.gladiatus.ui;

import org.ddth.game.gladiatus.ui.widget.Meter;
import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;

public class CharacterView extends Composite {

	private String[] names = { "Strength", "Skill", "Agility", "Constitution", "Charisma", "Armour", "Damage" };
	
	/**
	 * Create the composite
	 * @param parent
	 * @param style
	 */
	public CharacterView(Composite parent, int style) {
		super(parent, style);
		final GridLayout gridLayout = new GridLayout();
		gridLayout.numColumns = 4;
		setLayout(gridLayout);
		addRow("Level", "7");
		for (int i = 0; i < 5; i++) {
			addRow(names[i], (i + 1)*20, 100);
		}
		addRow("Chance to Hit", "34%");
		addRow("Chance to Double Hit", "94%");
		//
	}

	public void setModel(Character character) {
		
	}
	
	protected void addRow(String name, String value) {
		Label lblName = new Label(this, SWT.NONE);
		lblName.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 2, 1));
		lblName.setText(name);

		Label lblValue = new Label(this, SWT.NONE);
		lblValue.setText(value);
	}
	
	protected int addRow(String name, int value, int max) {
		new Label(this, SWT.NONE);
		Label lblName = new Label(this, SWT.NONE);
		lblName.setText(name);

		Meter meter = new Meter(this, SWT.NONE);
		meter.setMeter(value * 100 / max);
		meter.setLayoutData(new GridData(200, 20));

		Label lblValue = new Label(this, SWT.CENTER);
		lblValue.setText(value + "/" + max);
		return 0;
	}
}
