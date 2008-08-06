package org.ddth.game.gladiatus.ui;

import org.eclipse.swt.events.PaintEvent;
import org.eclipse.swt.events.PaintListener;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.widgets.Canvas;
import org.eclipse.swt.widgets.Composite;

public class Doll extends Canvas {

	private Image image;
	
	public Doll(Composite parent, int style) {
		super(parent, style);
		addPaintListener(new PaintListener() {
			public void paintControl(PaintEvent e) {
				if (image != null && !image.isDisposed()) {
					e.gc.drawImage(image, 0, 0);
				}
			}
		});
	}
}
