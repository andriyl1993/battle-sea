(function() {

// Global Constants
var CONST = {};
//доступні кораблі - по id
CONST.AVAILABLE_SHIPS = ['carrier1_4', 'battleship1_3', 'battleship2_3', 'destroyer1_2', 'destroyer2_2', 'destroyer3_2', 'patrolboat1_1', 'patrolboat2_1', 'patrolboat3_1', 'patrolboat4_1'];
// людина - 0, комп - 1, віртуальний гравець - посередник між ними - 2
CONST.HUMAN_PLAYER = 0;
CONST.COMPUTER_PLAYER = 1;
CONST.VIRTUAL_PLAYER = 2;
// Можливі значення для `type` (string)
CONST.CSS_TYPE_EMPTY = 'empty';
CONST.CSS_TYPE_SHIP = 'ship';
CONST.CSS_TYPE_MISS = 'miss';
CONST.CSS_TYPE_HIT = 'hit';
CONST.CSS_TYPE_SUNK = 'sunk';
// Коди grid :
CONST.TYPE_EMPTY = 0; // 0 = вода (пусто)
CONST.TYPE_SHIP = 1; // 1 = непошкоджений корабель
CONST.TYPE_MISS = 2; // 2 = вода (промах)
CONST.TYPE_HIT = 3; // 3 = пошкоджений корабль
CONST.TYPE_SUNK = 4; // 4 = розбитий корабель

// 0) 'carrier' 1) 'battleship' 2) 'destroyer' 3) 'submarine' 4) 'patrolboat'
// Використовувати лише коли DEBUG_MODE === true.
Game.usedShips = [CONST.UNUSED, CONST.UNUSED, CONST.UNUSED, CONST.UNUSED, CONST.UNUSED, CONST.UNUSED];
CONST.USED = 1;
CONST.UNUSED = 0;

// Статистика
function Stats(){
	this.shotsTaken = 0;
	this.shotsHit = 0;
	this.totalShots = parseInt(localStorage.getItem('totalShots'), 10) || 0;
	this.totalHits = parseInt(localStorage.getItem('totalHits'), 10) || 0;
	this.gamesPlayed = parseInt(localStorage.getItem('gamesPlayed'), 10) || 0;
	this.gamesWon = parseInt(localStorage.getItem('gamesWon'), 10) || 0;
	this.uuid = localStorage.getItem('uuid') || this.createUUID();
	// if (DEBUG_MODE) {
	// 	this.skipCurrentGame = true;
	//}
}
Stats.prototype.incrementShots = function() {
	this.shotsTaken++;
};
Stats.prototype.hitShot = function() {
	this.shotsHit++;
};
Stats.prototype.wonGame = function() {
	this.gamesPlayed++;
	this.gamesWon++;
};
Stats.prototype.lostGame = function() {
	this.gamesPlayed++;
};
// Зберігання статистики
Stats.prototype.syncStats = function() {
	if(!this.skipCurrentGame) {
		var totalShots = parseInt(localStorage.getItem('totalShots'), 10) || 0;
		totalShots += this.shotsTaken;
		var totalHits = parseInt(localStorage.getItem('totalHits'), 10) || 0;
		totalHits += this.shotsHit;
		localStorage.setItem('totalShots', totalShots);
		localStorage.setItem('totalHits', totalHits);
		localStorage.setItem('gamesPlayed', this.gamesPlayed);
		localStorage.setItem('gamesWon', this.gamesWon);
		localStorage.setItem('uuid', this.uuid);
	} else {
		this.skipCurrentGame = false;
	}
	
	var stringifiedGrid = '';
	for (var x = 0; x < Game.size; x++) {
		for (var y = 0; y < Game.size; y++) {
			stringifiedGrid += '(' + x + ',' + y + '):' + mainGame.humanGrid.cells[x][y] + ';\n';
		}
	}

};
// Оновлення представлення статистичних даних
Stats.prototype.updateStatsSidebar = function() {
	var elWinPercent = document.getElementById('stats-wins');
	var elAccuracy = document.getElementById('stats-accuracy');
	elWinPercent.innerHTML = this.gamesWon + " of " + this.gamesPlayed;
	elAccuracy.innerHTML = Math.round((100 * this.totalHits / this.totalShots) || 0) + "%";
};
// Обнелення статистики. Не оновлювати uuid.
Stats.prototype.resetStats = function(e) {
	Game.stats.skipCurrentGame = true;
	localStorage.setItem('totalShots', 0);
	localStorage.setItem('totalHits', 0);
	localStorage.setItem('gamesPlayed', 0);
	localStorage.setItem('gamesWon', 0);
	localStorage.setItem('showTutorial', true);
	Game.stats.shotsTaken = 0;
	Game.stats.shotsHit = 0;
	Game.stats.totalShots = 0;
	Game.stats.totalHits = 0;
	Game.stats.gamesPlayed = 0;
	Game.stats.gamesWon = 0;
	Game.stats.updateStatsSidebar();
};
Stats.prototype.createUUID = function(len, radix) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
	uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	} else {
		var r;

		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random()*16;
				uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}

	return uuid.join('');
};

// Конструктор об’єкта гри
function Game(size) {
	Game.size = size;
	this.shotsTaken = 0;
	this.createGrid();
	this.init();
}
Game.size = 10; // розмір ігрового поля
Game.gameOver = false;

// перевірка чи переміг гравець
Game.prototype.checkIfWon = function() {
	if (this.computerFleet.allShipsSunk()) {
		alert('Вітаємо, ви виграли!');
		Game.gameOver = true;
		Game.stats.wonGame();
		Game.stats.syncStats();
		Game.stats.updateStatsSidebar();
		this.showRestartSidebar();
		end_game(0, 1);
	} else if (this.humanFleet.allShipsSunk()) {
		alert('Ви програли(.');
		Game.gameOver = true;
		Game.stats.lostGame();
		Game.stats.syncStats();
		Game.stats.updateStatsSidebar();
		this.showRestartSidebar();
		end_game(0, 0);	
	}
};
// Вистріли по ігровому полю
// Повертає int, який в константах - тип
Game.prototype.shoot = function(x, y, targetPlayer) {
	var targetGrid;
	var targetFleet;

	if (targetPlayer === CONST.HUMAN_PLAYER) {
		targetGrid = this.humanGrid;
		targetFleet = this.humanFleet;
	} else if (targetPlayer === CONST.COMPUTER_PLAYER) {
		targetGrid = this.computerGrid;
		targetFleet = this.computerFleet;
	} else {
		console.log("There was an error trying to find the correct player to target");
	}

	if (targetGrid.isDamagedShip(x, y)) {
		return null;
	} else if (targetGrid.isMiss(x, y)) {
		return null;
	} else if (targetGrid.isUndamagedShip(x, y)) {
		
		var place = x * 10 + y;
		// оновлення поля
		targetGrid.updateCell(x, y, 'hit', targetPlayer);
		
		console.log("x = " + x);
		console.log("y = " + y);
		console.log("place = " + place);

		// рахуємо втрати і відображаємо їх
		targetFleet.findShipByCoords(x, y).incrementDamage();
		this.checkIfWon();
		$($($(".grid-container .grid")[targetPlayer]).find('.grid-cell')[place]).append('<div id="explosion1" class="explosion"></div>')
		setTimeout(function() {
			$("#explosion1").remove();
		}, 1000);
		return CONST.TYPE_HIT;
	} else {
		targetGrid.updateCell(x, y, 'miss', targetPlayer);
		this.checkIfWon();
		return CONST.TYPE_MISS;
	}
};
// Події на клік для кожного квадрата поля
Game.prototype.shootListener = function(e) {
	var self = e.target.self;
	// беремо координати з івента
	var x = parseInt(e.target.getAttribute('data-x'), 10);
	var y = parseInt(e.target.getAttribute('data-y'), 10);
	var result = null;
	if (self.readyToPlay) {
		result = self.shoot(x, y, CONST.COMPUTER_PLAYER);

		if (gameTutorial.showTutorial) {
			gameTutorial.nextStep();
		}
	}

	if (result !== null && !Game.gameOver) {
		Game.stats.incrementShots();
		if (result === CONST.TYPE_HIT) {
			Game.stats.hitShot();
		}
		self.robot.shoot();
	} else {
		Game.gameOver = false;
	}
};
// При кліку на корабель в списку робимо його активним
Game.prototype.rosterListener = function(e) {
	var self = e.target.self;
	var roster = document.querySelectorAll('.fleet-roster li');
	for (var i = 0; i < roster.length; i++) {
		var classes = roster[i].getAttribute('class') || '';
		classes = classes.replace('placing', '');
		roster[i].setAttribute('class', classes);
	}

	if (gameTutorial.currentStep === 1) {
		gameTutorial.nextStep();
	}
	
	Game.placeShipType = e.target.getAttribute('id');
	document.getElementById(Game.placeShipType).setAttribute('class', 'placing');
	Game.placeShipDirection = parseInt(document.getElementById('rotate-button').getAttribute('data-direction'), 10);
	self.placingOnGrid = true;
};
// Івент, що спрацьовує при розміщенні корабля
Game.prototype.placementListener = function(e) {
	var self = e.target.self;
	if (self.placingOnGrid) {
		var x = parseInt(e.target.getAttribute('data-x'), 10);
		var y = parseInt(e.target.getAttribute('data-y'), 10);
		
		var successful = self.humanFleet.placeShip(x, y, Game.placeShipDirection, Game.placeShipType);
		if (successful) {
			self.endPlacing(Game.placeShipType);

			if (gameTutorial.currentStep === 2) {
				gameTutorial.nextStep();
			}

			self.placingOnGrid = false;
			if (self.areAllShipsPlaced()) {
				var el = document.getElementById('rotate-button');
				el.addEventListener(transitionEndEventName(),(function(){
					el.setAttribute('class', 'hidden');
					if (gameTutorial.showTutorial) {
						document.getElementById('start-game').setAttribute('class', 'highlight');
					} else {
						document.getElementById('start-game').removeAttribute('class');	
					}
				}),false);
				el.setAttribute('class', 'invisible');
			}
		}
	}
};
// Івент, що спрацьовує при наведенні на свою клітинку
Game.prototype.placementMouseover = function(e) {
	var self = e.target.self;
	if (self.placingOnGrid) {
		var x = parseInt(e.target.getAttribute('data-x'), 10);
		var y = parseInt(e.target.getAttribute('data-y'), 10);
		var classes;
		var fleetRoster = self.humanFleet.fleetRoster;

		for (var i = 0; i < fleetRoster.length; i++) {
			var shipType = fleetRoster[i].type;

			if (Game.placeShipType === shipType &&
				fleetRoster[i].isLegal(x, y, Game.placeShipDirection)) {
				// Virtual ship
				fleetRoster[i].create(x, y, Game.placeShipDirection, true);
				Game.placeShipCoords = fleetRoster[i].getAllShipCells();

				for (var j = 0; j < Game.placeShipCoords.length; j++) {
					var el = document.querySelector('.grid-cell-' + Game.placeShipCoords[j].x + '-' + Game.placeShipCoords[j].y);
					classes = el.getAttribute('class');
					// Check if the substring ' grid-ship' already exists to avoid adding it twice
					if (classes.indexOf(' grid-ship') < 0) {
						classes += ' grid-ship';
						el.setAttribute('class', classes);
					}
				}
			}
		}
	}
};
// Івент, що спрацьовує при покиданні крусором клітинки
Game.prototype.placementMouseout = function(e) {
	var self = e.target.self;
	if (self.placingOnGrid) {
		for (var j = 0; j < Game.placeShipCoords.length; j++) {
			var el = document.querySelector('.grid-cell-' + Game.placeShipCoords[j].x + '-' + Game.placeShipCoords[j].y);
			classes = el.getAttribute('class');
			// Check if the substring ' grid-ship' already exists to avoid adding it twice
			if (classes.indexOf(' grid-ship') > -1) {
				classes = classes.replace(' grid-ship', '');
				el.setAttribute('class', classes);
			}
		}
	}
};
// Повернути коралель
Game.prototype.toggleRotation = function(e) {
	var direction = parseInt(e.target.getAttribute('data-direction'), 10);
	if (direction === Ship.DIRECTION_VERTICAL) {
		e.target.setAttribute('data-direction', '1');
		Game.placeShipDirection = Ship.DIRECTION_HORIZONTAL;
	} else if (direction === Ship.DIRECTION_HORIZONTAL) {
		e.target.setAttribute('data-direction', '0');
		Game.placeShipDirection = Ship.DIRECTION_VERTICAL;
	}
};
// Початок гри - івент натискання кнопки
Game.prototype.startGame = function(e) {
	var self = e.target.self;
	var el = document.getElementById('roster-sidebar');
	var fn = function() {el.setAttribute('class', 'hidden');};
	el.addEventListener(transitionEndEventName(),fn,false);
	el.setAttribute('class', 'invisible');
	self.readyToPlay = true;

	if (gameTutorial.currentStep === 3) {
		gameTutorial.nextStep();
	}
	el.removeEventListener(transitionEndEventName(),fn,false);
};
// Натискання рестарту
Game.prototype.restartGame = function(e) {
	e.target.removeEventListener(e.type, arguments.callee);
	var self = e.target.self;
	document.getElementById('restart-sidebar').setAttribute('class', 'hidden');
	self.resetFogOfWar();
	self.init();
};
// Функція для дебагу, щоб розмістить кораблі рандомно і почати гру
Game.prototype.placeRandomly = function(e){
	e.target.removeEventListener(e.type, arguments.callee);
	e.target.self.humanFleet.placeShipsRandomly();
	e.target.self.readyToPlay = true;
	document.getElementById('roster-sidebar').setAttribute('class', 'hidden');
	this.setAttribute('class', 'hidden');
};
// Завершення розміщення і початок гри
Game.prototype.endPlacing = function(shipType) {
	document.getElementById(shipType).setAttribute('class', 'placed');
	
	Game.usedShips[CONST.AVAILABLE_SHIPS.indexOf(shipType)] = CONST.USED;

	Game.placeShipDirection = null;
	Game.placeShipType = '';
	Game.placeShipCoords = [];
};
// перевірка чи всі кораблі розміщені
Game.prototype.areAllShipsPlaced = function() {
	var playerRoster = document.querySelectorAll('.fleet-roster li');
	for (var i = 0; i < playerRoster.length; i++) {
		if (playerRoster[i].getAttribute('class') === 'placed') {
			continue;
		} else {
			return false;
		}
	}
	Game.placeShipDirection = 0;
	Game.placeShipType = '';
	Game.placeShipCoords = [];
	return true;
};
// Скидати на початкові налаштування карту війни
Game.prototype.resetFogOfWar = function() {
	for (var i = 0; i < Game.size; i++) {
		for (var j = 0; j < Game.size; j++) {
			this.humanGrid.updateCell(i, j, 'empty', CONST.HUMAN_PLAYER);
			this.computerGrid.updateCell(i, j, 'empty', CONST.COMPUTER_PLAYER);
		}
	}
	// Скинути всі налаштування і почати гру знову
	Game.usedShips = Game.usedShips.map(function(){return CONST.UNUSED;});
};
// Скинути CSS на полі статистики
Game.prototype.resetRosterSidebar = function() {
	var els = document.querySelector('.fleet-roster').querySelectorAll('li');
	for (var i = 0; i < els.length; i++) {
		els[i].removeAttribute('class');
	}

	if (gameTutorial.showTutorial) {
		gameTutorial.nextStep();
	} else {
		document.getElementById('roster-sidebar').removeAttribute('class');
	}
	document.getElementById('rotate-button').removeAttribute('class');
	document.getElementById('start-game').setAttribute('class', 'hidden');
	// if (DEBUG_MODE) {
	// 	document.getElementById('place-randomly').removeAttribute('class');
	// }
};

// Відобразити дані для рестарту гри
Game.prototype.showRestartSidebar = function() {
	var sidebar = document.getElementById('restart-sidebar');
	sidebar.setAttribute('class', 'highlight');

	//знову повісити івенти
	var computerCells = document.querySelector('.computer-player').childNodes;
	for (var j = 0; j < computerCells.length; j++) {
		computerCells[j].removeEventListener('click', this.shootListener, false);
	}
	var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
	for (var i = 0; i < playerRoster.length; i++) {
		playerRoster[i].removeEventListener('click', this.rosterListener, false);
	}

	var restartButton = document.getElementById('restart-game');
	restartButton.addEventListener('click', this.restartGame, false);
	restartButton.self = this;
};
// Створення полів для битви для гравців
Game.prototype.createGrid = function() {
	var gridDiv = document.querySelectorAll('.grid');
	for (var grid = 0; grid < gridDiv.length; grid++) {
		gridDiv[grid].removeChild(gridDiv[grid].querySelector('.no-js'));
		for (var i = 0; i < Game.size; i++) {
			for (var j = 0; j < Game.size; j++) {
				var el = document.createElement('div');
				el.setAttribute('data-x', i);
				el.setAttribute('data-y', j);
				el.setAttribute('class', 'grid-cell grid-cell-' + i + '-' + j);
				gridDiv[grid].appendChild(el);
			}
		}
	}
};
// Ініціалізація гри. Перестворенні її, якщо вона вже була створена
Game.prototype.init = function() {
	this.humanGrid = new Grid(Game.size);
	this.computerGrid = new Grid(Game.size);
	this.humanFleet = new Fleet(this.humanGrid, CONST.HUMAN_PLAYER);
	this.computerFleet = new Fleet(this.computerGrid, CONST.COMPUTER_PLAYER);

	this.robot = new AI(this);
	Game.stats = new Stats();
	Game.stats.updateStatsSidebar();

	this.shotsTaken = 0;
	this.readyToPlay = false;
	this.placingOnGrid = false;
	Game.placeShipDirection = 0;
	Game.placeShipType = '';
	Game.placeShipCoords = [];

	this.resetRosterSidebar();

	var computerCells = document.querySelector('.computer-player').childNodes;
	for (var j = 0; j < computerCells.length; j++) {
		computerCells[j].self = this;
		computerCells[j].addEventListener('click', this.shootListener, false);
	}

	var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
	for (var i = 0; i < playerRoster.length; i++) {
		playerRoster[i].self = this;
		playerRoster[i].addEventListener('click', this.rosterListener, false);
	}

	var humanCells = document.querySelector('.human-player').childNodes;
	for (var k = 0; k < humanCells.length; k++) {
		humanCells[k].self = this;
		humanCells[k].addEventListener('click', this.placementListener, false);
		humanCells[k].addEventListener('mouseover', this.placementMouseover, false);
		humanCells[k].addEventListener('mouseout', this.placementMouseout, false);
	}

	var rotateButton = document.getElementById('rotate-button');
	rotateButton.addEventListener('click', this.toggleRotation, false);
	var startButton = document.getElementById('start-game');
	startButton.self = this;
	startButton.addEventListener('click', this.startGame, false);
	var resetButton = document.getElementById('reset-stats');
	resetButton.addEventListener('click', Game.stats.resetStats, false);
	var randomButton = document.getElementById('place-randomly');
	randomButton.self = this;
	randomButton.addEventListener('click', this.placeRandomly, false);
	this.computerFleet.placeShipsRandomly();
	start_game(1, null);
};

function start_game(is_computer, user) {
	var xhr = new XMLHttpRequest();

	xhr.open("POST", '/start_game/', true)
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.setRequestHeader("X-CSRFToken", document.getElementsByName('csrfmiddlewaretoken')[0].value);
	var body = {
		'is_computer': is_computer,
		'user': user,
	}
	xhr.send(JSON.stringify(body));
}


function end_game(is_computer, you_win)
{
	var xhr = new XMLHttpRequest();

	xhr.open("POST", '/end_game/', true)
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.setRequestHeader("X-CSRFToken", document.getElementsByName('csrfmiddlewaretoken')[0].value);
	var body = {
		'is_computer': is_computer,
		'you_win': you_win
	}
	xhr.send(JSON.stringify(body));
}


// Grid object
function Grid(size) {
	this.size = size;
	this.cells = [];
	this.init();
}

// Ініціалізація гріда
Grid.prototype.init = function() {
	for (var x = 0; x < this.size; x++) {
		var row = [];
		this.cells[x] = row;
		for (var y = 0; y < this.size; y++) {
			row.push(CONST.TYPE_EMPTY);
		}
	}
};

// оновлення CSS class якщо корабель знаходиться над ним
Grid.prototype.updateCell = function(x, y, type, targetPlayer) {
	var player;
	if (targetPlayer === CONST.HUMAN_PLAYER) {
		player = 'human-player';
	} else if (targetPlayer === CONST.COMPUTER_PLAYER) {
		player = 'computer-player';
	} else {
		// Should never be called
		console.log("There was an error trying to find the correct player's grid");
	}

	switch (type) {
		case CONST.CSS_TYPE_EMPTY:
			this.cells[x][y] = CONST.TYPE_EMPTY;
			break;
		case CONST.CSS_TYPE_SHIP:
			this.cells[x][y] = CONST.TYPE_SHIP;
			break;
		case CONST.CSS_TYPE_MISS:
			this.cells[x][y] = CONST.TYPE_MISS;
			break;
		case CONST.CSS_TYPE_HIT:
			this.cells[x][y] = CONST.TYPE_HIT;
			break;
		case CONST.CSS_TYPE_SUNK:
			this.cells[x][y] = CONST.TYPE_SUNK;
			break;
		default:
			this.cells[x][y] = CONST.TYPE_EMPTY;
			break;
	}
	var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
	document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
};
// Перевірка чи містьть клітинка неушкоджений корабель
Grid.prototype.isUndamagedShip = function(x, y) {
	return this.cells[x][y] === CONST.TYPE_SHIP;
};
// Перевірка чи було промазано під час пострілу
Grid.prototype.isMiss = function(x, y) {
	return this.cells[x][y] === CONST.TYPE_MISS;
};
// Перевірка чи міститься пошкоджений корабель
Grid.prototype.isDamagedShip = function(x, y) {
	return this.cells[x][y] === CONST.TYPE_HIT || this.cells[x][y] === CONST.TYPE_SUNK;
};

// Fleet object
// Записуються дані про флот гравця
function Fleet(playerGrid, player) {
	this.numShips = CONST.AVAILABLE_SHIPS.length;
	this.playerGrid = playerGrid;
	this.player = player;
	this.fleetRoster = [];
	this.populate();
}
// Заповнення флоту
Fleet.prototype.populate = function() {
	for (var i = 0; i < this.numShips; i++) {
		var j = i % CONST.AVAILABLE_SHIPS.length;
		this.fleetRoster.push(new Ship(CONST.AVAILABLE_SHIPS[j], this.playerGrid, this.player, parseInt(CONST.AVAILABLE_SHIPS[j].split("_")[1])));
	}
};
// Розміщення корабля і поверннення значення чи розміщений корабель чи ні
Fleet.prototype.placeShip = function(x, y, direction, shipType) {
	var shipCoords;
	for (var i = 0; i < this.fleetRoster.length; i++) {
		var shipTypes = this.fleetRoster[i].type;

	
		if (shipType === shipTypes && this.fleetRoster[i].isLegal(x, y, direction)) {
			this.fleetRoster[i].create(x, y, direction, false);
			shipCoords = this.fleetRoster[i].getAllShipCells();

			for (var j = 0; j < shipCoords.length; j++) {
				this.playerGrid.updateCell(shipCoords[j].x, shipCoords[j].y, 'ship', this.player);
			}
			return true;
		}
	}
	return false;
};
// Розміщення кораблів рандомно
Fleet.prototype.placeShipsRandomly = function() {
	var shipCoords;
	for (var i = 0; i < this.fleetRoster.length; i++) {
		var illegalPlacement = true;
	
		if(this.player === CONST.HUMAN_PLAYER && Game.usedShips[i] === CONST.USED) {
			continue;
		}
		while (illegalPlacement) {
			var randomX = Math.floor(10*Math.random());
			var randomY = Math.floor(10*Math.random());
			var randomDirection = Math.floor(2*Math.random());
			
			if (this.fleetRoster[i].isLegal(randomX, randomY, randomDirection)) {
				this.fleetRoster[i].create(randomX, randomY, randomDirection, false);
				shipCoords = this.fleetRoster[i].getAllShipCells();
				illegalPlacement = false;
			} else {
				continue;
			}
		}
		if (this.player === CONST.HUMAN_PLAYER && Game.usedShips[i] !== CONST.USED) {
			for (var j = 0; j < shipCoords.length; j++) {
				this.playerGrid.updateCell(shipCoords[j].x, shipCoords[j].y, 'ship', this.player);
				Game.usedShips[i] = CONST.USED;
			}
		}
	}
};
// Шукаємо кораблі
Fleet.prototype.findShipByCoords = function(x, y) {
	for (var i = 0; i < this.fleetRoster.length; i++) {
		var currentShip = this.fleetRoster[i];
		if (currentShip.direction === Ship.DIRECTION_VERTICAL) {
			if (y === currentShip.yPosition &&
				x >= currentShip.xPosition &&
				x < currentShip.xPosition + currentShip.shipLength) {
				return currentShip;
			} else {
				continue;
			}
		} else {
			if (x === currentShip.xPosition &&
				y >= currentShip.yPosition &&
				y < currentShip.yPosition + currentShip.shipLength) {
				return currentShip;
			} else {
				continue;
			}
		}
	}
	return null;
};
// Пошук корабля за його типом
Fleet.prototype.findShipByType = function(shipType) {
	for (var i = 0; i < this.fleetRoster.length; i++) {
		if (this.fleetRoster[i].type === shipType) {
			return this.fleetRoster[i];
		}
	}
	return null;
};
// Чи всі кораблі зруйновані
Fleet.prototype.allShipsSunk = function() {
	for (var i = 0; i < this.fleetRoster.length; i++) {
		if (this.fleetRoster[i].sunk === false) {
			return false;
		}
	}
	return true;
};

// Об’єкт корабля
function Ship(type, playerGrid, player, length) {
	this.damage = 0;
	this.type = type;
	this.playerGrid = playerGrid;
	this.player = player;

	this.shipLength = length;
	this.maxDamage = this.shipLength;
	this.sunk = false;
}
// Перевірка на те чи можливо розмістити корабель
Ship.prototype.isLegal = function(x, y, direction) {
	// перевірка чи корабель знаходиться в межах гріда
	if (this.withinBounds(x, y, direction)) {
		// перевірка чи корабель не на іншому кораблі
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === Ship.DIRECTION_VERTICAL) {
				if (this.playerGrid.cells[x + i][y] === CONST.TYPE_SHIP ||
					this.playerGrid.cells[x + i][y] === CONST.TYPE_MISS ||
					this.playerGrid.cells[x + i][y] === CONST.TYPE_SUNK) {
					return false;
				}
			} else {
				if (this.playerGrid.cells[x][y + i] === CONST.TYPE_SHIP ||
					this.playerGrid.cells[x][y + i] === CONST.TYPE_MISS ||
					this.playerGrid.cells[x][y + i] === CONST.TYPE_SUNK) {
					return false;
				}
			}
		}
		return true;
	} else {
		return false;
	}
};
// Метод перевірки чи знаходиться корабель в межах гріда
Ship.prototype.withinBounds = function(x, y, direction) {
	if (direction === Ship.DIRECTION_VERTICAL) {
		return x + this.shipLength <= Game.size;
	} else {
		return y + this.shipLength <= Game.size;
	}
};
// Інкремент пошкоджених кораблів
Ship.prototype.incrementDamage = function() {
	this.damage++;
	if (this.isSunk()) {
		this.sinkShip(false); // Sinks the ship
	}
};
// Перевірка чи корабель затонув
Ship.prototype.isSunk = function() {
	return this.damage >= this.maxDamage;
};
Ship.prototype.sinkShip = function(virtual) {
	this.damage = this.maxDamage;
	this.sunk = true;

	if (!virtual) {
		var allCells = this.getAllShipCells();
		for (var i = 0; i < this.shipLength; i++) {
			this.playerGrid.updateCell(allCells[i].x, allCells[i].y, 'sunk', this.player);
		}
	}
};

Ship.prototype.getAllShipCells = function() {
	var resultObject = [];
	for (var i = 0; i < this.shipLength; i++) {
		if (this.direction === Ship.DIRECTION_VERTICAL) {
			resultObject[i] = {'x': this.xPosition + i, 'y': this.yPosition};
		} else {
			resultObject[i] = {'x': this.xPosition, 'y': this.yPosition + i};
		}
	}
	return resultObject;
};
// Ініціалізація розміщення корабля, напрямку. Якщо корабель віртуальний,
// то він не буде розміщений на гріду
Ship.prototype.create = function(x, y, direction, virtual) {
	this.xPosition = x;
	this.yPosition = y;
	this.direction = direction;

	if (!virtual) {
		for (var i = 0; i < this.shipLength; i++) {
			if (this.direction === Ship.DIRECTION_VERTICAL) {
				this.playerGrid.cells[x + i][y] = CONST.TYPE_SHIP;
			} else {
				this.playerGrid.cells[x][y + i] = CONST.TYPE_SHIP;
			}
		}
	}
	
};
// напрямки розміщення кораблів
Ship.DIRECTION_VERTICAL = 0;
Ship.DIRECTION_HORIZONTAL = 1;

function Tutorial() {
	this.currentStep = 0;
	this.showTutorial = localStorage.getItem('showTutorial') !== 'false';
}

Tutorial.prototype.nextStep = function() {
	var humanGrid = document.querySelector('.human-player');
	var computerGrid = document.querySelector('.computer-player');
	switch (this.currentStep) {
		case 0:
			document.getElementById('roster-sidebar').setAttribute('class', 'highlight');
			document.getElementById('step1').setAttribute('class', 'current-step');
			this.currentStep++;
			break;
		case 1:
			document.getElementById('roster-sidebar').removeAttribute('class');
			document.getElementById('step1').removeAttribute('class');
			humanGrid.setAttribute('class', humanGrid.getAttribute('class') + ' highlight');
			document.getElementById('step2').setAttribute('class', 'current-step');
			this.currentStep++;
			break;
		case 2:
			document.getElementById('step2').removeAttribute('class');
			var humanClasses = humanGrid.getAttribute('class');
			humanClasses = humanClasses.replace(' highlight', '');
			humanGrid.setAttribute('class', humanClasses);
			this.currentStep++;
			break;
		case 3:
			computerGrid.setAttribute('class', computerGrid.getAttribute('class') + ' highlight');
			document.getElementById('step3').setAttribute('class', 'current-step');
			this.currentStep++;
			break;
		case 4:
			var computerClasses = computerGrid.getAttribute('class');
			document.getElementById('step3').removeAttribute('class');
			computerClasses = computerClasses.replace(' highlight', '');
			computerGrid.setAttribute('class', computerClasses);
			document.getElementById('step4').setAttribute('class', 'current-step');
			this.currentStep++;
			break;
		case 5:
			document.getElementById('step4').removeAttribute('class');
			this.currentStep = 6;
			this.showTutorial = false;
			localStorage.setItem('showTutorial', false);
			break;
		default:
			break;
	}
};

// Конструктор штучного інтелекту
function AI(gameObject) {
	this.gameObject = gameObject;
	this.virtualGrid = new Grid(Game.size);
	this.virtualFleet = new Fleet(this.virtualGrid, CONST.VIRTUAL_PLAYER);

	this.probGrid = [];
	this.initProbs();
	this.updateProbs();
}
AI.PROB_WEIGHT = 5000;
AI.OPEN_HIGH_MIN = 20;
AI.OPEN_HIGH_MAX = 30;
AI.OPEN_MED_MIN = 15;
AI.OPEN_MED_MAX = 25;
AI.OPEN_LOW_MIN = 10;
AI.OPEN_LOW_MAX = 20;
AI.RANDOMNESS = 0.1;

AI.OPENINGS = [
	{'x': 7, 'y': 3, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 6, 'y': 2, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 3, 'y': 7, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 2, 'y': 6, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 6, 'y': 6, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 3, 'y': 3, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 5, 'y': 5, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	{'x': 4, 'y': 4, 'weight': getRandom(AI.OPEN_LOW_MIN, AI.OPEN_LOW_MAX)},
	// {'x': 9, 'y': 5, 'weight': getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX)},
	// {'x': 0, 'y': 4, 'weight': getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX)},
	// {'x': 5, 'y': 9, 'weight': getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX)},
	// {'x': 4, 'y': 0, 'weight': getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX)},
	{'x': 0, 'y': 8, 'weight': getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX)},
	{'x': 1, 'y': 9, 'weight': getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX)},
	{'x': 8, 'y': 0, 'weight': getRandom(AI.OPEN_MED_MIN, AI.OPEN_MED_MAX)},
	{'x': 9, 'y': 1, 'weight': getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX)},
	{'x': 9, 'y': 9, 'weight': getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX)},
	{'x': 0, 'y': 0, 'weight': getRandom(AI.OPEN_HIGH_MIN, AI.OPEN_HIGH_MAX)}
];
// Перевірка місця, куди стрілятиме комп і постріл
AI.prototype.shoot = function() {
	var maxProbability = 0;
	var maxProbCoords;
	var maxProbs = [];
	
	for (var i = 0; i < AI.OPENINGS.length; i++) {
		var cell = AI.OPENINGS[i];
		if (this.probGrid[cell.x][cell.y] !== 0) {
			this.probGrid[cell.x][cell.y] += cell.weight;
		}
	}

	for (var x = 0; x < Game.size; x++) {
		for (var y = 0; y < Game.size; y++) {
			if (this.probGrid[x][y] > maxProbability) {
				maxProbability = this.probGrid[x][y];
				maxProbs = [{'x': x, 'y': y}];
			} else if (this.probGrid[x][y] === maxProbability) {
				maxProbs.push({'x': x, 'y': y});
			}
		}
	}

	maxProbCoords = Math.random() < AI.RANDOMNESS ?
	maxProbs[Math.floor(Math.random() * maxProbs.length)] :
	maxProbs[0];

	var result = this.gameObject.shoot(maxProbCoords.x, maxProbCoords.y, CONST.HUMAN_PLAYER);
	
	if (Game.gameOver) {

		Game.gameOver = false;
		return;
	}

	this.virtualGrid.cells[maxProbCoords.x][maxProbCoords.y] = result;

	if (result === CONST.TYPE_HIT) {
		var humanShip = this.findHumanShip(maxProbCoords.x, maxProbCoords.y);
		if (humanShip.isSunk()) {
			var shipTypes = [];
			for (var k = 0; k < this.virtualFleet.fleetRoster.length; k++) {
				shipTypes.push(this.virtualFleet.fleetRoster[k].type);
			}
			var index = shipTypes.indexOf(humanShip.type);
			this.virtualFleet.fleetRoster.splice(index, 1);

			var shipCells = humanShip.getAllShipCells();
			for (var _i = 0; _i < shipCells.length; _i++) {
				this.virtualGrid.cells[shipCells[_i].x][shipCells[_i].y] = CONST.TYPE_SUNK;
			}
		}
	}
	this.updateProbs();
};
// Оновлення гріда
AI.prototype.updateProbs = function() {
	var roster = this.virtualFleet.fleetRoster;
	var coords;
	this.resetProbs();
	for (var k = 0; k < roster.length; k++) {
		for (var x = 0; x < Game.size; x++) {
			for (var y = 0; y < Game.size; y++) {
				if (roster[k].isLegal(x, y, Ship.DIRECTION_VERTICAL)) {
					roster[k].create(x, y, Ship.DIRECTION_VERTICAL, true);
					coords = roster[k].getAllShipCells();
					if (this.passesThroughHitCell(coords)) {
						for (var i = 0; i < coords.length; i++) {
							this.probGrid[coords[i].x][coords[i].y] += AI.PROB_WEIGHT * this.numHitCellsCovered(coords);
						}
					} else {
						for (var _i = 0; _i < coords.length; _i++) {
							this.probGrid[coords[_i].x][coords[_i].y]++;
						}
					}
				}
				if (roster[k].isLegal(x, y, Ship.DIRECTION_HORIZONTAL)) {
					roster[k].create(x, y, Ship.DIRECTION_HORIZONTAL, true);
					coords = roster[k].getAllShipCells();
					if (this.passesThroughHitCell(coords)) {
						for (var j = 0; j < coords.length; j++) {
							this.probGrid[coords[j].x][coords[j].y] += AI.PROB_WEIGHT * this.numHitCellsCovered(coords);
						}
					} else {
						for (var _j = 0; _j < coords.length; _j++) {
							this.probGrid[coords[_j].x][coords[_j].y]++;
						}
					}
				}

				if (this.virtualGrid.cells[x][y] === CONST.TYPE_HIT) {
					this.probGrid[x][y] = 0;
				}
			}
		}
	}
};

AI.prototype.initProbs = function() {
	for (var x = 0; x < Game.size; x++) {
		var row = [];
		this.probGrid[x] = row;
		for (var y = 0; y < Game.size; y++) {
			row.push(0);
		}
	}
};

AI.prototype.resetProbs = function() {
	for (var x = 0; x < Game.size; x++) {
		for (var y = 0; y < Game.size; y++) {
			this.probGrid[x][y] = 0;
		}
	}
};
AI.prototype.metagame = function() {
	// Inputs:
	// Proximity of hit cells to edge
	// Proximity of hit cells to each other
	// Edit the probability grid by multiplying each cell with a new probability weight (e.g. 0.4, or 3). Set this as a CONST and make 1-CONST the inverse for decreasing, or 2*CONST for increasing
};
// Finds a human ship by coordinates
// Returns Ship
AI.prototype.findHumanShip = function(x, y) {
	return this.gameObject.humanFleet.findShipByCoords(x, y);
};
// Checks whether or not a given ship's cells passes through
// any cell that is hit.
// Returns boolean
AI.prototype.passesThroughHitCell = function(shipCells) {
	for (var i = 0; i < shipCells.length; i++) {
		if (this.virtualGrid.cells[shipCells[i].x][shipCells[i].y] === CONST.TYPE_HIT) {
			return true;
		}
	}
	return false;
};
// Gives the number of hit cells the ships passes through. The more
// cells this is, the more probable the ship exists in those coordinates
// Returns int
AI.prototype.numHitCellsCovered = function(shipCells) {
	var cells = 0;
	for (var i = 0; i < shipCells.length; i++) {
		if (this.virtualGrid.cells[shipCells[i].x][shipCells[i].y] === CONST.TYPE_HIT) {
			cells++;
		}
	}
	return cells;
};

// Global constant only initialized once
var gameTutorial = new Tutorial();

// Start the game
var mainGame = new Game(10);

})();

// Array.prototype.indexOf workaround for IE browsers that don't support it
// From MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement, fromIndex) {

		var k;

		// 1. Let O be the result of calling ToObject passing
		//    the this value as the argument.
		if (this === null || this === undefined) {
			throw new TypeError('"this" is null or not defined');
		}

		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get
		//    internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If len is 0, return -1.
		if (len === 0) {
			return -1;
		}

		// 5. If argument fromIndex was passed let n be
		//    ToInteger(fromIndex); else let n be 0.
		var n = +fromIndex || 0;

		if (Math.abs(n) === Infinity) {
			n = 0;
		}

		// 6. If n >= len, return -1.
		if (n >= len) {
			return -1;
		}

		// 7. If n >= 0, then Let k be n.
		// 8. Else, n<0, Let k be len - abs(n).
		//    If k is less than 0, then let k be 0.
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		// 9. Repeat, while k < len
		while (k < len) {
			var kValue;
			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the
			//    HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			//    i.  Let elementK be the result of calling the Get
			//        internal method of O with the argument ToString(k).
			//   ii.  Let same be the result of applying the
			//        Strict Equality Comparison Algorithm to
			//        searchElement and elementK.
			//  iii.  If same is true, return k.
			if (k in O && O[k] === searchElement) {
				return k;
			}
			k++;
		}
		return -1;
	};
}

// Array.prototype.map workaround for IE browsers that don't support it
// From MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

	Array.prototype.map = function(callback, thisArg) {

		var T, A, k;

		if (this == null) {
			throw new TypeError(" this is null or not defined");
		}

		// 1. Let O be the result of calling ToObject passing the |this| 
		//    value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal 
		//    method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if (typeof callback !== "function") {
			throw new TypeError(callback + " is not a function");
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (arguments.length > 1) {
			T = thisArg;
		}

		// 6. Let A be a new array created as if by the expression new Array(len) 
		//    where Array is the standard built-in constructor with that name and 
		//    len is the value of len.
		A = new Array(len);

		// 7. Let k be 0
		k = 0;

		// 8. Repeat, while k < len
		while (k < len) {

			var kValue, mappedValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal 
			//    method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if (k in O) {

				// i. Let kValue be the result of calling the Get internal 
				//    method of O with argument Pk.
				kValue = O[k];

				// ii. Let mappedValue be the result of calling the Call internal 
				//     method of callback with T as the this value and argument 
				//     list containing kValue, k, and O.
				mappedValue = callback.call(T, kValue, k, O);

				// iii. Call the DefineOwnProperty internal method of A with arguments
				// Pk, Property Descriptor 
				// { Value: mappedValue, 
				//   Writable: true, 
				//   Enumerable: true, 
				//   Configurable: true },
				// and false.

				// In browsers that support Object.defineProperty, use the following:
				// Object.defineProperty(A, k, { 
				//   value: mappedValue, 
				//   writable: true, 
				//   enumerable: true, 
				//   configurable: true 
				// });

				// For best browser support, use the following:
				A[k] = mappedValue;
			}
			// d. Increase k by 1.
			k++;
		}

		// 9. return A
		return A;
	};
}

// Browser compatability workaround for transition end event names.
// From modernizr: http://stackoverflow.com/a/9090128
function transitionEndEventName() {
	var i,
		undefined,
		el = document.createElement('div'),
		transitions = {
			'transition':'transitionend',
			'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		};

	for (i in transitions) {
		if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
			return transitions[i];
		}
	}
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

// Toggles on or off DEBUG_MODE
function setDebug(val) {
	// DEBUG_MODE = val;
	// localStorage.setItem('DEBUG_MODE', val);
	// localStorage.setItem('showTutorial', 'false');
	// window.location.reload();
}
