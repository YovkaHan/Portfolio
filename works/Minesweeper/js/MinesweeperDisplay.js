(function($){
	/*
		MinesweeperDisplay.js
		(View)
		
	Описание : 
		Интерфейс - поле ячеек размерности NxN, 2 циферблата ( кол-во мин на поле; таймер ), кнопка "Начало игры".
		
	Условия :
		Можно нажимать правой и левой клавишой мишки при этом нажатие правой клавиши означает проверку
		ячейки, а нажатие левой размещение флажка на ячейке о наличии (или возможном наличии) в ней мины.
		
		Если в радиусе 1 ячеки от той что была проверена не находится мины : запускается реакция с нахождением 
		всех подобных ячеек (без цифр) и отображение рядом стоящих (соседей по горизонтали и вертикали) с ними 
		ячеек с цифрами (цифры обозначают кол-во мин в радиусе 1 ячейки)
		
		//	//	//
		
		Обработчик события "Нажате кнопки 'Новая игра'"
		На базе информации создать игровое поле
		Обнулить счетчик времени, указать количество мин на табло ("кол-во мин")
		При нажатии кнопки "Начало игры" начать отсчет времени
		При нажатии левой клавиши мышки на одной из ячеек (не открытой) запустить процесс проверки этой ячейки 
		При нажатии правой клавиши мышки на одной из ячеек (не открытой) запустить процесс установки флага (или его снятие) + обновить значения "кол-во мин"
		При получении известия о окончании игры показать игроку места размещения мин и сообщение "Игра окончена" + так же заблокировать доступ к ячейкам
		
		//	//	//
	*/
	
	//	** GLOBALS
		
	var newGame = $('#btnNewGame');
	var _difficultySets = {
					'easyD' : {'N' : 9, 'Mines' : 10, 'Proportion' : 20, 'FontSize' : 12},
					'mediumD' : {'N' : 15, 'Mines' : 40, 'Proportion' : 17, 'FontSize' : 10},
					'hardD' : {'N' : 22, 'Mines' : 99, 'Proportion' : 15, 'FontSize' : 9}
					};  
	var _setOfTimers = ['timer-0','timer-1','timer-2','timer-3','timer-4','timer-5','timer-6','timer-7','timer-8','timer-9'];
	var userData = {};
	var timerObject = {'t':null, 'time': 0};
	var firstClick = 0;
	var gameWasStarted = false;
	var gameStats = {'mines' : '000', 'timer': '000'};
	var flagsPlaced = 0;
	var game = null;
	var endGame = false;
	var events = [];
	
				//	**
	
	newGame.bind('click', pressedNewGame);   // <---- Starting point  (----1----)
	
	
	/*Обработчик события "Нажате кнопки 'Новая игра'"
	  - передать информацию от полей + флаг состояния для перезупуска игры с новыми условиями
	  - полкучить информацию и сохранить ее в удобном формате
	  (добавить действия при отсутствии некоторой информации)
	  (возможно всплывающее окно)
	*/
	function questionBeforeGame() {
		var answer = confirm('Do you want to start a new game ?');
		
		if(answer) {
			newGame.unbind('click', questionBeforeGame);    // when the first call of 'pressedNewGame' handler, this will prevent call this handler first (3) 
			pressedNewGame();
		}
	}
	
	function pressedNewGame() {
		var t = document.getElementById('field');
			// solution for 'static' variable
		if ( typeof pressedNewGame.counter == 'undefined' ) {
			pressedNewGame.counter = 0;
		}	
		pressedNewGame.counter++;
		if(pressedNewGame.counter == 1) {
			prepareToBuildGameField();
		}
		
			// protection from input incorrect data
		var difficulty = 'easyD';
		if(document.querySelector('input[name="difficulty"]:checked') != null) {
			difficulty = document.querySelector('input[name="difficulty"]:checked').id;
		}
		var playerName = 'Jack';
		if(document.querySelector('input[name="usrName"]') != null) {
			playerName = document.querySelector('input[name="usrName"]').value;
		}
		
			// Input data 
		userData['difficulty'] = difficulty;
		userData['playerName'] = playerName;
		newGame.unbind('click', pressedNewGame);			// when the first call of 'pressedNewGame' handler, this will prevent call this handler first (1)
		newGame.bind('click', questionBeforeGame);			// when the first call of 'pressedNewGame' handler, this will prevent call this handler first (2)
		
			// New game preparation
		if(gameWasStarted) eraseAllData();
		buildGameField();						//	(----2----)
	}
	
	function prepareToBuildGameField() {
		document.getElementById("gameName").style.display = 'none';          // Hide game title;
	}
	
	/*На базе информации создать игровое поле
	  - сконструировать игровое поле + счетчкики и кнопку "начать игру"
	  - создаю новый обьект  Minesweeper.Game (размероность, кол-во мин) 
	*/
	
	function buildGameField() {
		var _N = _difficultySets[userData.difficulty].N;
		var _Mines = _difficultySets[userData.difficulty].Mines;
		var _Proportion = _difficultySets[userData.difficulty].Proportion;
		var _FontSize = _difficultySets[userData.difficulty].FontSize;
		var _marginWidth = 2;				// margin-left of cell
		var _gameStartBtnWidth = 44;
		var _fieldWidth = (_N * _Proportion) + ((_N + 1) * _marginWidth);
		document.getElementById("game").style.display = 'inline-block';
		document.getElementById("field").style.width = _fieldWidth+'px';
		
		
												//	(----3----)
		createField();			
		createStatics();
		fitViewOnWindow();
			// Create game
		game = new Minesweeper.Game(_difficultySets[userData.difficulty].N, _difficultySets[userData.difficulty].Mines);
		checkMines();
		gameCicle();
		
		
		function fitViewOnWindow(){
			View.viewSet(true);
		}
		
		function createField() {
			for(var rowCount=0; rowCount < _N; rowCount++) {
				var gameRow = document.createElement("DIV");
				gameRow.className = 'game-row';
				if(rowCount==(_N-1)) gameRow.className += ' game-row-last';
				
				for(var i=0; i < _N; i++) {
					var cell = document.createElement("DIV");
					var textnode = document.createTextNode(" ");
					cell.appendChild(textnode);
					cell.setAttribute('oncontextmenu','return false;');
					cell.className = 'cell cell-coords-'+rowCount+'-'+i;
					if(i==0) cell.className += ' cell-first';
					cell.style.width = _Proportion+'px';
					cell.style.height = _Proportion+'px';
					cell.style.fontSize = _FontSize+'px';
					gameRow.appendChild(cell);
				}
				document.getElementById("field").appendChild(gameRow);
			}
		}
		
		/* Creating the minesCount, button and gameTime*/
		function createStatics() {
			var minesCount = document.createElement("DIV");
			minesCount.id = 'minesCount';
			var digits = [document.createElement("DIV"), document.createElement("DIV"), document.createElement("DIV")];
			for(var a in digits){
				digits[a].className = 'sprite timer-0';
				minesCount.appendChild(digits[a]);
			}

			document.getElementById("gameStats").appendChild(minesCount);
			
			var gameStartBtn = document.createElement("DIV");
			gameStartBtn.id = 'gameStart';
			gameStartBtn.style.width = _gameStartBtnWidth;
			var widthPadding = $('#game').width() + parseInt($("#game").css('padding-left').split('px')[0]);
			gameStartBtn.style.left = (( widthPadding / 2) - (_gameStartBtnWidth / 2)) +'px';
			var textnode = document.createTextNode("Start");
			gameStartBtn.appendChild(textnode);
			document.getElementById("gameStats").appendChild(gameStartBtn);
			
			var gameTime = document.createElement("DIV");
			gameTime.id = 'gameTime';
			var digits = [document.createElement("DIV"), document.createElement("DIV"), document.createElement("DIV")];
			for(var a in digits){
				digits[a].className = 'sprite timer-0';
				gameTime.appendChild(digits[a]);
			}

			document.getElementById("gameStats").appendChild(gameTime);
		}
	}	
	
	  
	/*Обнулить счетчик времени, указать количество мин на табло ("кол-во мин")
	  - создать новый обьект "табло с кол-вом мин"
	  - получить кол-во с объекта "игра"
	  - указать полученое кол-во в value фактическое 
	*/
	
	function checkMines() {
			// Set mines count
		var m = game.getMinesCount() - flagsPlaced;
		
		var minesText = (parseInt(m / 100) ? ''+m : parseInt(m / 10) ? '0'+m : '00'+m).split('');
		for(var n=0; n<3; n++) {
			var classStr = `timer-${minesText[n]}`;
			for(var c in _setOfTimers) {
				if($($("#minesCount .sprite")[n]).hasClass(_setOfTimers[c])){
					$($("#minesCount .sprite")[n]).removeClass(_setOfTimers[c]);
					break;
				}
			}
			$($("#minesCount .sprite")[n]).addClass(classStr);
		}
	}
	
	function gameCicle() {
		gameWasStarted = true;
		
		
		$('#gameStart').unbind('click', gameCicle);
		$('#gameStart').bind('click', questionBeforeGame);
		$('#field').bind('mousedown', clickOnField);						//	(----5----)
	}
	
	function clickOnField(e) {
		if(!firstClick++){
					
			//Timer tick
			timerObject = {'t':null, 'time': 0};
			setRTimeout(1000,timerObject,'t')
		}
		if(!endGame){
			e = e || window.event;
			e.preventDefault();

			if (e.target.className.indexOf('cell-coords') != -1) { 			// got it
			
				switch (e.which) {
					case 1:           
						var coords = getCoordsFromClassName(e.target,'cell-coords');
						var move = game.check(coords[0],coords[1]);
						if(typeof move == 'object') {
							if (move.result == 2) {
								endGame = true;
								alert('You lost'); 
								clearTimeout(timerObject['t']);
								timerObject = {};
							} else {
								endGame = true;
								clearTimeout(timerObject['t']);
								timerObject = {};
								alert('You Win!');	
							}
							showOnDisplay(move.field,[coords[0],coords[1]]);
						}
						break;
					case 2:
						alert('Middle Mouse button pressed.');
						break;
					case 3:
						var coords = getCoordsFromClassName(e.target,'cell-coords');
						setFlagOnField(coords[0],coords[1]);
						break;
					default:
						alert('You have a strange Mouse!');
				}
			}
			
			checkMines();
			showOnDisplay();
		}
	}
	
	function showOnDisplay(gameFieldStr, coords) {
		var _N = _difficultySets[userData.difficulty].N;
		if(arguments[0]){
			var rows = gameFieldStr.split('\n');
			var field = [];
			
			rows.pop();
			
			for(var r in rows)
			field.push(rows[r].split(' ').filter(function(e){if(e.length)return e}));
			
			for(var i = 0; i < _N; i++) {
				for(var j = 0; j < _N; j++) {
					if(field[i][j] == '*'){
						var proportion = _difficultySets[userData['difficulty']].Proportion;
						if(coords[0]==i && coords[1]==j){
							$(`#field .cell-coords-${i}-${j}`).addClass('mineshow-blowed');
						} else {
							$(`#field .cell-coords-${i}-${j}`).addClass('mineshow');
						}
						
						$( `#field .cell-coords-${i}-${j}` ).each(function () {
							this.style.setProperty( 'background-size', `${proportion-2}px ${proportion-2}px`, 'important' );
						});
						
						//$(`#field .mineshow`).css('background-size' , `${proportion}px ${proportion}px`);
					}
				}
			}
		} else {
			for(var i = 0; i < _N; i++) {
				for(var j = 0; j < _N; j++){
					var searchClassName = `.cell-coords-${i}-${j}`;
					var cell = game.getDCell(i,j);
					var nValue = null;
					var c = null;
					if (cell == '-'){
						nValue = ' ';
						c = ' cell-blank';
					} else if(cell == 'B') {
						nValue = ' ';
						c = ''
					} else if(/[1-8]/.test(cell)) {
						nValue = cell;
						c = ` number number-${nValue}`;
					} else if(cell == '!') {
						nValue = cell;
						c = ' flag';
					}
					$(searchClassName)[0].childNodes[0].nodeValue = nValue;
					$(searchClassName)[0].className += c;
				}
			}
			console.log(game.getDField());
			}
	}
	
	function setFlagOnField(i,j) {
		var answer = game.setFlag(i,j);
		if(answer==1){
			flagsPlaced--;
		} else if(answer==0) {
			flagsPlaced++;
		}
	}
	
	function pressedStart() {
		if(gameWasStarted) eraseAllData();
		buildGameField();
	}
	
	function eraseAllData() {
		var field = document.getElementById('field');
		var gameStats = document.getElementById('gameStats');
		
		if(timerObject['t']){
			clearTimeout(timerObject['t']);
			timerObject = {};
		}
		
		eraseChilds(field);
		eraseChilds(gameStats);

		// to Default
		game = null;
		flagsPlaced = 0;
		firstClick = 0;
		endGame = false;
		//
		
		// Switch Off the field
		$('#field').unbind('mousedown', clickOnField);
		
		// Erase all children nodes
		function eraseChilds(elem){
			var length = elem.childNodes.length;
			
			for (var i = length-1; i>=0; i--){
				elem.childNodes[i].remove()
			}
		}
	}
	
	//  get coords (i,j) from "className-i-j"
	function getCoordsFromClassName(target,className) {
		var begin = target.className.indexOf(className);
		var end = target.className.indexOf(' ', begin);
		
		if(end == -1) end = target.className.length;
		var cellClassNameSplit = target.className.slice(begin,end).split('-');
		
		return [parseInt(cellClassNameSplit[cellClassNameSplit.length-2]),parseInt(cellClassNameSplit[cellClassNameSplit.length-1])];
	}

	// Рекурсивный таймаут с выводом идентификатора таймаута через обьект
	function setRTimeout(timeout, tObject, index) {
		tObject[index] = setTimeout(function(){
				tObject.time += timeout/1000;
				var time = tObject.time;
				var v = $('#gameTime .sprite');
				
				var t = (parseInt(time / 100) ? ''+time : parseInt(time / 10) ? '0'+time : '00'+time).split('');
				for(var n=0; n<3; n++) {
					var classStr = `timer-${t[n]}`;
					for(var c in _setOfTimers) {
						if($(v[n]).hasClass(_setOfTimers[c])){
							$(v[n]).removeClass(_setOfTimers[c]);
							break;
						}
					}
					$(v[n]).addClass(classStr);
				}
				
				setRTimeout(timeout, tObject, index);			
		}, timeout);
	}
	
	/*При нажатии кнопки "Начало игры" начать отсчет времени
	  - создать событые "Нажатие кнопки 'Начало игры'" 
	  - обработчик события должен запускать полный цикл игры
	  - при повторном нажатии результаты должны быть сброшены и игровой цикл должен начатся заново
	*/
}(jQuery))