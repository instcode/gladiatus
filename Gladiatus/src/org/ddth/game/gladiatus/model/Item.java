package org.ddth.game.gladiatus.model;

public class Item extends Equipment {
	private int width;
	private int height;
	private boolean isEquiped;

	public boolean isEquiped() {
		return isEquiped;
	}

	public void setEquiped(boolean isEquiped) {
		this.isEquiped = isEquiped;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}
}
