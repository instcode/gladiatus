package org.ddth.game.gladiatus.ui;

import org.ddth.game.gladiatus.support.Constant;
import org.ddth.game.gladiatus.support.ResourceLoader;
import org.ddth.game.gladiatus.ui.widget.Picture;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.widgets.Composite;

public class Doll extends Picture {
	
	public Doll(Composite parent, int style) {
		super(parent, style);
		Image image = ResourceLoader.getInstance().loadImage(Constant.IMAGES_DOLL_JPG);
		setImage(image);
	}
}
