package org.ddth.game.gladiatus.model;

import java.util.List;

public class Slot {

	private String name;
	private int width, height;
	private long[] mask;
	
	private List<Item> items;
	
	public Slot(String name, int width, int height) {
		this.name = name;
		this.width = width;
		this.height = height;
		this.mask = new long[height * width];
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
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

	public boolean dropAt(Item item, int x, int y) {
		for (int i = 0; i < width; i++) {
			for (int j = 0; j < height; j++) {
				
			}
		}
		return true;
	}
	
	public Item pickUp(int x, int y) {
		long id = mask[x * height + y];
		for (Item item : items) {
			if (item.getId() == id) {
				return item;
			}
		}
		return null;
	}
	
	public boolean moveTo(Item item, int x, int y) {
		return true;
	}
}
