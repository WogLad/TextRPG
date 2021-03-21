function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const itemDb = {
	"wooden_axe": new Tool("Wooden Axe", "tool", 1, 0),
	"wooden_pickaxe": new Tool("Wooden Pickaxe", "tool", 0, 1),
	"wooden_sword": new Weapon("Wooden Sword", "weapon", 1, 0, 0)
}

var enemies = new Array();

function addToGameLogs(message) {
	document.getElementById("gameLogs").innerHTML = message + "<br>" + document.getElementById("gameLogs").innerHTML;
}

var player = new Player("WogLad");

// var saveData = '{"name":"WogLad","gold":0,"posX":0,"posY":8,"inventory":[{"name":"Wooden Axe","type":"tool","axePower":1,"pickaxePower":0}],"damage":2,"critRate":5,"critDamage":5,"defense":0,"kills":0,"currentHP":10,"maxHP":10,"movementSpeed":1,"canMove":true,"enemyEncounterRate":10,"equipment":{"head":null,"chest":null,"legs":null,"feet":null,"weapon":null,"tool":null}}'