from random import randint
from org.ddth.game.gladiatus.core.GladiatusModel import Character
    
class Gladiator:
    def __init__(self):
        self.hp = 0;
        self.damage = [0, 0];
        self.chanceToHit = 0;
        self.chanceToDoubleHit = 0;

class Battle:

    def __init__(self, challenger, defender):
        self.challenger = challenger;
        self.defender = defender;
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
        self.gladiator1.hp = self.challenger.hp;
        self.gladiator2.hp = self.defender.hp;
        statistic = [0, 0, 0];
        # A battle might take 8-14 turns in 3 rounds :-)
        turn = 16 + randint(0, 12);
        attacker = self.gladiator1;
        defender = self.gladiator2;
        while (turn > 0):
            self.turn(attacker, defender);
            statistic[0] = self.check(attacker, defender);
            if (statistic[0] != 0):
                break;
            attacker, defender = defender, attacker;
            turn -= 1;

        statistic[1] = self.defender.hp - self.gladiator2.hp;
        statistic[2] = self.challenger.hp - self.gladiator1.hp;
        if (statistic[0] == 0):
            if (statistic[1] < statistic[2]):
                statistic[0] = -1;
            elif (statistic[1] > statistic[2]):
                statistic[0] = 1;

        return tuple(statistic);

    def check(self, attacker, defender):
        if (defender.hp < 25):
            if (attacker == self.gladiator1):
                return 1;
            return -1;
        return 0;

    def turn(self, attacker, defender):
        self.attack(attacker, defender);
        # Probability to double hit
        probability = randint(0, 100);
        if (probability <= attacker.chanceToDoubleHit):
            self.attack(attacker, defender);

    def attack(self, attacker, defender):
        probability = randint(0, 100);
        # Probability to hit
        if (probability <= attacker.chanceToHit):
            damage = attacker.damage;
            hitpoints = randint(damage[0], damage[1]);
            defender.hp = defender.hp - hitpoints;

class BattleV040(Battle):
    def fight(self):
        self.gladiator1.hp = self.challenger.hp;
        self.gladiator2.hp = self.defender.hp;
        statistic = [0, 0, 0];
        # A battle might take 8-14 turns in 3 rounds :-)
        turn = 16 + randint(0, 12);
        attacker = self.gladiator1;
        defender = self.gladiator2;
        while (turn > 0):
            self.turn(attacker, defender);
            statistic[0] = self.check(attacker, defender);
            if (statistic[0] != 0):
                break;
            attacker, defender = defender, attacker;
            turn -= 1;

        statistic[1] = self.defender.hp - self.gladiator2.hp;
        statistic[2] = self.challenger.hp - self.gladiator1.hp;
        if (statistic[0] == 0):
            if (statistic[1] < statistic[2]):
                statistic[0] = -1;
            elif (statistic[1] > statistic[2]):
                statistic[0] = 1;

        return tuple(statistic);

    def check(self, attacker, defender):
        '''
        Check whether hp is enough to go on next round
        '''
        if (defender.hp < 1):
            if (attacker == self.gladiator1):
                return 1;
            return -1;
        return 0;

    def turn(self, attacker, defender):
        self.attack(attacker, defender);
        # Probability to double hit
        probability = randint(0, 100);
        if (probability <= attacker.chanceToDoubleHit):
            self.attack(attacker, defender);

    def attack(self, attacker, defender):
        probability = randint(0, 100);
        # Probability to hit
        if (probability <= attacker.chanceToHit):
            damage = attacker.damage;
            hitpoints = damage[0] + randint(0, damage[1]);
            defender.hp = defender.hp - hitpoints;
            
def simulate(version, challenger, defender, count):
    if (version == "0.3.3"):
        battle = BattleV033(challenger, defender);
    elif (version == "0.4.0"):
        battle = BattleV040(challenger, defender);   
    win = 0;
    damage_dealt = 0;
    damage_received = 1;
    step = count;
    while (step > 0):
        statistic = battle.fight();
        if (statistic[0] > 0):
            win += 1;
        damage_dealt += statistic[1];
        damage_received += statistic[2];
        step -= 1;
    return (win, int(damage_dealt / count), int(damage_received / count));

if __name__ == "__main__":
    challenger = Character("instcode", "instcode", 17, 1000, 0, 40, 60, 50, 40, 45, 700, 0, [40, 45]);
    defender = Character("gladiator", "gladiator", 17, 1000, 0, 40, 60, 70, 40, 50, 1000, 0, [30, 35]);
    i = 0;
    while (i < 10):
        win = simulate(challenger, defender, 1000);
        print win;
        i += 1;
