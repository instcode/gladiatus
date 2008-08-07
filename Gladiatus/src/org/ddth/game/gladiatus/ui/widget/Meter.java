package org.ddth.game.gladiatus.ui.widget;

import org.eclipse.swt.SWT;
import org.eclipse.swt.events.PaintEvent;
import org.eclipse.swt.events.PaintListener;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.GC;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.graphics.Rectangle;
import org.eclipse.swt.widgets.Canvas;
import org.eclipse.swt.widgets.Composite;

public class Meter extends Canvas implements PaintListener {

	private int meter;

	/**
	 * Create the composite
	 * 
	 * @param parent
	 * @param style
	 */
	public Meter(Composite parent, int style) {
		super(parent, style);
		addPaintListener(this);
	}

	public void setMeter(int meter) {
		this.meter = meter;
	}

	public int getMeter() {
		return meter;
	}

	public void paintControl(PaintEvent event) {
		GC gc = event.gc;
		int percent = meter;
		Color foreground = gc.getForeground();
		Color background = gc.getBackground();
		gc.setForeground(getDisplay().getSystemColor(SWT.COLOR_RED));
		gc.setBackground(getDisplay().getSystemColor(SWT.COLOR_YELLOW));
		int width = (this.getSize().x - 1) * percent / 100;
		gc.fillGradientRectangle(event.x, event.y, width, event.height, true);
		Rectangle rect2 = new Rectangle(event.x, event.y, width - 1, event.height - 1);
		gc.drawRectangle(rect2);
		gc.setForeground(getDisplay().getSystemColor(SWT.COLOR_LIST_FOREGROUND));
		String text = percent + "%";
		Point size = event.gc.textExtent(text);
		int offsetY = Math.max(0, (event.height - size.y) / 2);
		int offsetX = Math.max(0, (width - size.x) / 2);
		gc.drawText(text, event.x + offsetX, event.y + offsetY, true);
		gc.setForeground(foreground);
		gc.setBackground(background);
	}
}
