class EquipmentSlots {
	constructor() {
		this.head = null;
		this.chest = null;
		this.legs = null;
		this.feet = null;
		this.weapon = null;
		this.tool = null;
	}
}

class Player {
	constructor(name) {
		this.name = name;
		this.gold = 0;

		this.posX = 0;
		this.posY = 0;

		this.inventory = new Array();
		this.inventory.push(itemDb["wooden_axe"]);

		this.damage = 2;
		this.critRate = 5; // In percentage
		this.critDamage = 5; // In percentage
		this.defense = 0;

        this.kills = 0;

		this.currentHP = 10;
		this.maxHP = 10;

		this.movementSpeed = 1;
		this.canMove = true;
		this.enemyEncounterRate = 10;

		this.equipment = new EquipmentSlots();
	}

	updatePosText() {
		var posText = document.getElementById("posText");
		posText.innerHTML = "<b>x</b>: " + this.posX + "<br>" + "<b>y</b>: " + this.posY;
	}

	move(x, y) {
		if (this.canMove) {
			this.posX += (x * this.movementSpeed);
			this.posY += (y * this.movementSpeed);
			this.updatePosText();

			if (getRandomInt(0, 100) < this.enemyEncounterRate) {
				this.battle(new Enemy());
			}
		}
	}

	tpHome() {
		if (this.canMove) {
			this.posX = 0;
			this.posY = 0;
			this.updatePosText();
		}
	}

	addToInventory(item) {
		this.inventory.push(item);
	}

	attack(enemyToAttack) {
		var finalDamage = this.damage;
		if (getRandomInt(0, 100) < this.critRate) {
			finalDamage += (finalDamage * (this.critDamage/100));
		}
        finalDamage = Math.floor(finalDamage);
        addToGameLogs("You deal " + finalDamage.toString() + " damage to the enemy.");
		enemyToAttack.takeDamage(finalDamage);
	}

	die() {
		this.tpHome();
		this.currentHP = this.maxHP;
		addToGameLogs("<span style='color:red;'>You died!</span>");
	}

	takeDamage(damageToTake) {
		this.currentHP -= damageToTake;
        addToGameLogs("You lost " + damageToTake.toString() + " HP.");
		// if (this.currentHP <= 0) {
        //     this.canMove = true;
		// 	this.die();
		// }
	}

	battle(enemy) {
		this.canMove = false;
		addToGameLogs("You encountered an enemy!");
        var response = prompt("You encountered an enemy.\nDo you wish to fight it? (yes/no)");
        if (response.toLowerCase() == "no") {
            addToGameLogs("You escaped from the enemy.");
            this.canMove = true;
        }
        else {
            addToGameLogs("You begin to fight the enemy.");
            var turns = 0;
            var battleLoop = setInterval(() => {
                if (turns % 2 == 0) {
                    this.attack(enemy);
                    if (enemy.currentHP <= 0) {
                        this.canMove = true;
                        enemy.die();
                        this.kills++;
                        clearInterval(battleLoop);
                    }
                }
                else {
                    this.takeDamage(enemy.damage);
                    if (this.currentHP <= 0) {
                        this.canMove = true;
                    	this.die();
                        clearInterval(battleLoop);
                    }
                }
                turns++;
            }, 1000);
        }
	}

	equip(equipment) {
		switch (equipment.type) {
			case "head":
				this.equipment.head = equipment;
				break;
			case "chest":
				this.equipment.chest = equipment;
				break;
			case "legs":
				this.equipment.legs = equipment;
				break;
			case "feet":
				this.equipment.feet = equipment;
				break;
			case "tool":
				this.equipment.tool = equipment;
				break;
			case "weapon":
				this.equipment.weapon = equipment;
				break;
		}
	}

	askForLoadData() {
		var saveData = prompt("Paste your save data here.");
		this.loadSaveData(saveData);
	}

    loadSaveData(saveDataString) {
		var saveData = JSON.parse(saveDataString);
        this.name = saveData["name"];
        this.gold = saveData["gold"];
        this.posX = saveData["posX"];
        this.posY = saveData["posY"];
		this.updatePosText();

        // Inventory Loading
		saveData["inventory"].forEach(item => {
			switch (item["type"]) {
				case "tool":
					var tool = new Tool(item["name"], "tool", item["axePower"], item["pickaxePower"]);
					this.inventory.push(tool);
					break;
				case "weapon":
					var weapon = new Weapon(item["name"], "tool", item["weaponPower"], item["critRate"], item["critDamage"]);
					this.inventory.push(weapon);
					break;
			}
		});

        this.damage = saveData["damage"];
        this.critDamage = saveData["critDamage"];
        this.critRate = saveData["critRate"];
        this.defense = saveData["defense"];
        this.kills = saveData["kills"];
        this.currentHP = saveData["currentHP"];
        this.maxHP = saveData["maxHP"];
        this.movementSpeed = saveData["movementSpeed"];

        // Equipment Loading
		var headData = saveData["equipment"]["head"];
		if (headData != null) {
			this.equipment.head = new Equipment(headData["name"], headData["type"], headData["equipmentType"], headData["defenseBonus"]);
		}
		
		var chestData = saveData["equipment"]["chest"];
		if (chestData != null) {
			this.equipment.chest = new Equipment(chestData["name"], chestData["type"], chestData["equipmentType"], chestData["defenseBonus"]);
		}
		
		var legsData = saveData["equipment"]["legs"];
		if (legsData != null) {
			this.equipment.legs = new Equipment(legsData["name"], legsData["type"], legsData["equipmentType"], legsData["defenseBonus"]);
		}
		
		var feetData = saveData["equipment"]["feet"];
		if (feetData != null) {
			this.equipment.feet = new Equipment(feetData["name"], feetData["type"], feetData["equipmentType"], feetData["defenseBonus"]);
		}
		
		var weaponData = saveData["equipment"]["weapon"];
		if (weaponData != null) {
			this.equipment.weapon = new Weapon(weaponData["name"], weaponData["type"], weaponData["weaponPower"], weaponData["critRate"], weaponData["critDamage"]);
		}
		
		var toolData = saveData["equipment"]["tool"];
		if (toolData != null) {
			this.equipment.tool = new Tool(toolData["name"], toolData["type"], toolData["axePower"], toolData["pickaxePower"]);
		}
    }

	copySaveData() {
		const el = document.createElement('textarea');
		el.value = JSON.stringify(this);
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
		alert("Successfully copied the save data to the clipboard.")
	}
}