package org.ddth.game.gladiatus.ui;

import org.ddth.game.gladiatus.core.Game;
import org.ddth.game.gladiatus.core.Stats;
import org.ddth.game.gladiatus.model.Character;
import org.ddth.game.gladiatus.ui.widget.Meter;
import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;

public class CharacterView extends Composite {
	private NameBar nameBar;
	private Doll doll;
	
	private Meter[] meters = new Meter[Stats.values().length];
	private Label[] statistics = new Label[Stats.values().length];
	
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
		createNameBar();
		createDoll();
		createGeneralView();
	}

	public void setModel(Character character) {
		int level = character.getLevel();
		setStat(Stats.LEVEL, String.valueOf(level));
		setStat(Stats.STRENGTH, character.getStrength(), Game.getInstance().getMaxStrength(level));
		setStat(Stats.SKILL, character.getSkill(), Game.getInstance().getMaxSkill(level));
		setStat(Stats.AGILITY, character.getAgility(), Game.getInstance().getMaxAgility(level));
		setStat(Stats.CONSTITUTION, character.getConstitution(), Game.getInstance().getMaxConstitution(level));
		setStat(Stats.CHARISMA, character.getCharisma(), Game.getInstance().getMaxCharisma(level));
		setStat(Stats.ARMOR, String.valueOf(character.getArmor()));
		setStat(Stats.DAMAGE, String.valueOf(character.getDamage()));
		setStat(Stats.CHANCE_TO_HIT, "0%");
		setStat(Stats.CHANCE_TO_DOUBLE_HIT, "0%");
		
		nameBar.setName(character.getName());
	}
	
	private void setStat(Stats stat, int value, int max) {
		setStat(stat, value + "/" + max);
		meters[stat.index()].setMeter(value * 100 / max);
	}
	
	private void setStat(Stats stat, String value) {
		statistics[stat.index()].setText(value);
	}

	private void createGeneralView() {
		addStat(Stats.LEVEL);
		addStat(Stats.STRENGTH);
		addStat(Stats.SKILL);
		addStat(Stats.AGILITY);
		addStat(Stats.CONSTITUTION);
		addStat(Stats.CHARISMA);
		addStat(Stats.ARMOR);
		addStat(Stats.DAMAGE);
		addStat(Stats.CHANCE_TO_HIT);
		addStat(Stats.CHANCE_TO_DOUBLE_HIT);
	}

	private void createNameBar() {
		nameBar = new NameBar(this, SWT.NONE);
		GridData nameBarLayoutData = new GridData(SWT.CENTER, SWT.CENTER, true, false, 3, 1);
		Point barSize = nameBar.getSize();
		nameBarLayoutData.widthHint = barSize.x;
		nameBarLayoutData.heightHint = barSize.y;
		nameBar.setLayoutData(nameBarLayoutData);
	}

	private void createDoll() {
		doll = new Doll(this, SWT.NONE);
		GridData dollLayoutData = new GridData(SWT.CENTER, SWT.CENTER, true, false, 3, 1);
		Point dollSize = doll.getSize();
		dollLayoutData.widthHint = dollSize.x;
		dollLayoutData.heightHint = dollSize.y;
		doll.setLayoutData(dollLayoutData);
	}

	private int addStat(Stats stat) {
		Label lblName = new Label(this, SWT.NONE);
		lblName.setText(stat.value());
		if (!stat.primary()) {
			lblName.setLayoutData(new GridData(SWT.LEFT, SWT.CENTER, false, false, 2, 1));
		}
		else {
			Meter meter = new Meter(this, SWT.NONE);
			meter.setLayoutData(new GridData(150, 20));
			meters[stat.index()] = meter;
		}

		Label lblValue = new Label(this, SWT.CENTER);
		statistics[stat.index()] = lblValue;
		return 0;
	}
}
