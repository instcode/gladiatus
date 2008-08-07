package org.ddth.game.gladiatus.ui;

import org.ddth.game.gladiatus.support.Constant;
import org.ddth.game.gladiatus.support.ResourceLoader;
import org.ddth.game.gladiatus.ui.widget.Picture;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.PaintEvent;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.GC;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.widgets.Composite;

public class NameBar extends Picture {

	private String name = "";
	
	public NameBar(Composite parent, int style) {
		super(parent, style);
		setImage(ResourceLoader.getInstance().loadImage(Constant.IMAGES_NAME_BAR_JPG));
	}

	@Override
	public void paintControl(PaintEvent event) {
		super.paintControl(event);
		GC gc = event.gc;
		Point size = gc.textExtent(name);
		int offsetY = Math.max(0, (event.height - size.y) / 2);
		int offsetX = Math.max(0, (event.width - size.x) / 2);
		
		Color foreground = gc.getForeground();
		gc.setForeground(getDisplay().getSystemColor(SWT.COLOR_WHITE));
		gc.drawText(name, event.x + offsetX, event.y + offsetY, true);
		gc.setForeground(foreground);
	}
	
	public void setName(String name) {
		this.name = name;
	}
}
