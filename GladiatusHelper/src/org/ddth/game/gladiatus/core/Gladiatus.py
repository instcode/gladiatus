from random import randint

class Character:
    def __init__(self, id, level, name, strength, skill, agility, constitution, charisma, armor, intelligent, damage):
        self.id = id
        self.level = level
        self.name = name
        self.strength = strength
        self.skill = skill
        self.agility = agility
        self.constitution = constitution
        self.charisma = charisma
        self.armor = armor
        self.intelligent = intelligent
        self.damage = damage
    
class Gladiator:
    def __init__(self):
        self.health = 0;
        self.damage = [0, 0];
        self.chanceToHit = 0;
        self.chanceToDoubleHit = 0;

class Battle:

    def __init__(self, challenger, defender):
        self.gladiator1 = self.createGladiator(challenger, defender);
        self.gladiator2 = self.createGladiator(defender, challenger);

    def getAbsorbableDamage(self, armor):
        min_damage = max(0, (armor / 66) - (armor / 660 + 1));
        max_damage = max(0, (armor / 66) + (armor / 660));
        return (min_damage, max_damage);
    
    def createGladiator(self, friend, opponent):
        skill = friend.skill;
        chanceToHit = (skill * 100) / (skill + opponent.agility);
        chanceToDoubleHit = friend.charisma - opponent.charisma;
        
        gladiator = Gladiator();
        absorb = self.getAbsorbableDamage(opponent.armor);
        damage = friend.damage;
        minDamage = damage[0] - absorb[1];
        maxDamage = damage[1] - absorb[0];
        # Update net damage
        gladiator.damage = [max(0, minDamage), max(0, maxDamage)];
        gladiator.chanceToHit = max(0, chanceToHit);
        gladiator.chanceToDoubleHit = max(0, chanceToDoubleHit);
        return gladiator;

class BattleV033(Battle):
    def fight(self):
        self.gladiator1.health = 10000;
        self.gladiator2.health = 10000;
        turn = 8 + randint(0, 6);
        while (turn > 0):
            self.turn(self.gladiator1, self.gladiator2);
            self.turn(self.gladiator2, self.gladiator1);
            turn -= 1;

    def turn(self, attacker, defender):
        self.attack(attacker, defender);
        # Probability to double hit
        probability = 1 + randint(0, 100);
        if (probability <= attacker.chanceToDoubleHit):
            self.attack(attacker, defender);

    def attack(self, attacker, defender):
        probability = 1 + randint(0, 100);
        # Probability to hit
        if (probability <= attacker.chanceToHit):
            damage = attacker.damage;
            hitpoints = damage[0] + randint(0, damage[1]);
            defender.health = defender.health - hitpoints;

def simulate(challenger, defender):
    win = 0;
    count = 1000;
    battle = BattleV033(challenger, defender);
    while (count > 0):
        battle.fight();
        if (battle.gladiator1.health > battle.gladiator2.health):
            win += 1;
        count -= 1;
    return win;

if __name__ == "__main__":
    challenger = Character("instcode", 17, "instcode", 40, 60, 50, 40, 45, 700, 0, [40, 45]);
    defender = Character("gladiator", 17, "gladiator", 40, 60, 50, 40, 45, 700, 0, [30, 35]);
    win = simulate(challenger, defender);
    print win;
