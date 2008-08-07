package org.ddth.game.gladiatus.model;

import java.util.List;

import org.ddth.game.gladiatus.model.effect.Effect;

public class Equipment {
	private long id;
	private String name;
	private String description;
	private String type;
	
	/**
	 * Buying price 
	 */
	private long cost;
	
	/**
	 * Selling price
	 */
	private long price;
	
	private int level;
	
	/**
	 * Effects are supported by this equipment
	 */
	private List<Effect> effects;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public long getCost() {
		return cost;
	}

	public void setCost(long cost) {
		this.cost = cost;
	}

	public long getPrice() {
		return price;
	}

	public void setPrice(long price) {
		this.price = price;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public List<Effect> getEffects() {
		return effects;
	}

	public void setEffects(List<Effect> effects) {
		this.effects = effects;
	}
}
