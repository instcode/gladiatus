package org.ddth.game.gladiatus.model;

import java.util.ArrayList;
import java.util.List;

public class Inventory {
	private Character owner;
	private List<Slot> slots = new ArrayList<Slot>();
	
	public Inventory(Character owner) {
		this.owner = owner;
	}

	public Character getOwner() {
		return owner;
	}

	public void setOwner(Character owner) {
		this.owner = owner;
	}

	public List<Slot> getSlots() {
		return slots;
	}

	public void setSlots(List<Slot> slots) {
		this.slots = slots;
	}
}
