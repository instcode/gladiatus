package org.ddth.game.gladiatus.ui.widget;

import org.eclipse.swt.events.PaintEvent;
import org.eclipse.swt.events.PaintListener;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.graphics.Rectangle;
import org.eclipse.swt.widgets.Canvas;
import org.eclipse.swt.widgets.Composite;

public class Picture extends Canvas implements PaintListener {
	private Image image;
	
	public Picture(Composite parent, int style) {
		super(parent, style);
		addPaintListener(this);
	}
	
	public void paintControl(PaintEvent e) {
		if (image != null && !image.isDisposed()) {
			e.gc.drawImage(image, 0, 0);
		}
	}
	
	public void setImage(Image image) {
		this.image = image;
		Rectangle bounds = image.getBounds();
		setSize(bounds.width, bounds.height);
	}
}
