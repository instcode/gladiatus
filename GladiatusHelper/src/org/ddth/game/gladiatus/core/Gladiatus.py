
class Character:
    id;
    level;
    name;
    strength;
    skill;
    agility;
    constitution;
    charisma;
    armor;
    intelligent;
    damage;
    
class Gladiator:
    health = 0;
    damage = [0, 0];
    chanceToHit = 0;
    chanceToDoubleHit = 0;

class Battle:

    gladiator1;
    gladiator2;
    
    def __init__(self, challenger, defender):
        this.gladiator1 = createGladiator(challenger, defender);
        this.gladiator2 = createGladiator(defender, challenger);

    def createGladiator(friend, opponent):
        skill = friend.getSkill();
        chanceToHit = (skill * 100) / (skill + opponent.getAgility());
        chanceToDoubleHit = friend.getCharisma() - opponent.getCharisma();
        
        gladiator = Gladiator();
        absorb = GameHelper.getInstance().getAbsorbableDamage(opponent.getArmor());
        damage = friend.getDamage();
        minDamage = damage.getMin() - absorb.getMax();
        maxDamage = damage.getMax() - absorb.getMin();
        # Update net damage
        gladiator.setDamage([Math.max(0, minDamage), Math.max(0, maxDamage)]);
        gladiator.setChanceToHit(Math.max(0, chanceToHit));
        gladiator.setChanceToDoubleHit(Math.max(0, chanceToDoubleHit));
        return gladiator;
