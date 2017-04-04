(function(exports){/*
	Minesweeper.js
	(Logic)
	
	Цель игры : раскрыть все ячейки не "наступив" на одну из мин.
		
		
	Классы 
		Cell {
			int 	id;
			string  data;
			
			public:
				Cell(id,data);
				getData();
		}
		
		Field {
			Cell[]  field;
			int  	N;
			
			public:
				Field(N);
				getCell(i,j);
		}
		
		Player {
			string  name
			string  time
			
			public: 
				Player(name, time);
				
				getTime();
				getName();
		}
		
		Game {
			string[] fieldToDisplay;
			
			public:
				Game();
			
			private: 
				check(i,j);
				setToField(i,j,data);
				wonGame();
				lostGame();
		}
*/

	/* Класс Ячейка - содержит информацию и свой идентификатор*/
	class Cell {
				//int 	  id;
				//string  data;

				constructor(id,data) {
					if(arguments.lenght < 1) {this.id = 'id';}
					else {
						this.id = id;
						}
					if(data === undefined ) {
						try{
							throw "Undefined \'DATA\'";
						}
						catch(e){
							console.log(e);
						}
					} else {
						this.data = data;
					}
					
				}
				getData() {
					return {id: this.id, data: this.data };
				}
			}

	/* Составной класс из Ячеек*/			
	class Field {
			//	Cell[]  field;
			//	int  	N;

				constructor(N,data) {
					this.N = N || 9;
					this.field = [];
					
					for(let i=0,j=0; i<this.N; j++) {
						let d = ' ';
						try{
							d = data[i][j];
						}
						catch(e){
							//console.log(e);
						}
						
						this.field.push(new Cell(i*this.N+j,d));
						
						if(j==(this.N-1)) {
							i++;
							j=-1;
						}
					}
				}
				getCell(i,j) {
					return this.field[i*this.N+j].getData().data;
				}
			}
			
	class Player {
			//	string  name
			//	string  time
			 
				constructor(name,time) {
					this.name = name || Player;
					this.time = time || '10.10.10';
				}
				
				getTime() {
					return `${this.time}`;
				}
				getName() {
					return `${this.name}`;
				}
		}
		
		// "B" - "Black (not checked)" ; "-" - "None" ; "1-8" - "Number of mines around"; "*" - "Mine" ; '!' - "Flag" 
	let _difficulty = new WeakMap();
	
	/*
		Класс Game
			Game(9,10) -- инициализация игры
			check(i,j)  -- проверка ячейки по координатам(i,j)	2 - meens mine
			setFlag(i,j)  --  установка вспомогающего флага по координатам(i,j)
			getDCell(i,j)  --  внешний вид ячейки по координатам(i,j)
			getDField()		--  внешний вид всего поля
			
			
	*/
	class Game {
			// string[] fieldToDisplay;
					//	Game(9,10) -- инициализация игры
				constructor(Dimention, minesCount){
																			// -------- Проверка вводимых условий 
					if(Dimention == null || Dimention == 0) {              
						_difficulty.set(this, 9);
					} else {
						_difficulty.set(this, Dimention);
					}
					this._mineCount = 0;
					if(minesCount >= (Dimention*Dimention)-4) {
						this._mineCount = 10;
					} else {
						this._mineCount = minesCount;
					}
																			//  -------
					
					this._fieldToDisplay = [[]];		// Поле для внешнего отображения
					this.logicField = null;				// Поле для внутренней логики
					
					let N = _difficulty.get(this);
					this.closedCells = N*N;
					let data = [[]];
					
					let minesIdexis = [];
						// create mines
					for (let i = 0; i < this._mineCount; i++) {
						let index = Math.random() * ((Math.pow(N,2)-1) - 0) + 1;
						
						if(minesIdexis.indexOf(index << 0)==-1) {
							minesIdexis.push(index << 0);
						} else {
							--i;
						}
					}
					/*	Заполнение буфера значениями и передача его в качестве аргумента "полю"*/
					for (let i = 0, j = 0, g = 0; ; j++) {
						let count = 0; 						// count of mines
						
						if(minesIdexis.indexOf(i*N+j) != -1) {
							data[i].push('*');
						} else {
						
							if(i>0) 		 						// Up
								count+= (minesIdexis.indexOf((i-1)*N+j) != -1 )? 1: 0;
								
							if(i>0 && j<N-1)				// Up Right
								count+= (minesIdexis.indexOf((i-1)*N+j+1) != -1 )? 1: 0;
								
							if(j<N-1)						// Right
								count+= (minesIdexis.indexOf(i*N+j+1) != -1 )? 1: 0;
								
							if(i<N-1 && j<N-1) 	// Right Down
								count+= (minesIdexis.indexOf((i+1)*N+j+1) != -1 )? 1: 0;
								
							if(i<N-1)						// Down
								count+= (minesIdexis.indexOf((i+1)*N+j) != -1 )? 1: 0;
								
							if(i<N-1 && j>0)				// Left Down 
								count+= (minesIdexis.indexOf((i+1)*N+j-1) != -1 )? 1: 0;
								
							if(j>0)									// Left 
								count+= (minesIdexis.indexOf(i*N+j-1) != -1 )? 1: 0;
							
							if(i>0 && j>0)							// Left 
								count+= (minesIdexis.indexOf((i-1)*N+j-1) != -1 )? 1: 0;
							
							if(!count) { data[i].push('-'); }   // set count of mines around or N
							else { data[i].push(''+count); }	
						}
						
						this._fieldToDisplay[i].push('B'); // Placing "Blank"
						
						// ROW and new line
						if(j==N-1) {
							j=-1;
							i++;
							if(i==N)
								break;
							this._fieldToDisplay.push([]);
							data.push([]);
						}
					}
					
					this.logicField = new Field(N, data);
				}
								
				getDifficulty() {
					return _difficulty.get(this);
				}
				
				/*Get cell from array to display*/
				getDCell(i,j) {
					let N = _difficulty.get(this);
					
					if(i>=N || j>=N) return;  // check input
					
					i = 1*i;
					j = 1*j;
					
					return this._fieldToDisplay[i][j];
				}
				
				getDField() {
					let str = '';
					let n = 0;
					let N = _difficulty.get(this);
					let nSq = N*N;
					while(n<nSq) {
						str+=' '+this._fieldToDisplay[parseInt(n/N)][n%N]+' ';
						if((n+1)%N==0)
							str+='\n';
						n++;
					}

					return 	str;
				}
	
					//		setFlag(i,j)  --  установка вспомогающего флага по координатам(i,j)
				setFlag(i,j){
					let N = _difficulty.get(this);
					if(i>=N || j>=N) return;	 // check input
					
					if(this._fieldToDisplay[i][j] == '!')  // Если уже отмечали флагом, тогда флаг снимается
					{ 
						this._fieldToDisplay[i][j] = 'B'; 
						return 1;
					} else if(this._fieldToDisplay[i][j] == 'B'){
						this._fieldToDisplay[i][j] = '!';
						return 0;
					} else if(/[1-8]-/.test(this._fieldToDisplay[i][j])) {
						return 2;
					}
				}
				
				checkWin(){
					let N = _difficulty.get(this);
					if(this._mineCount == this.closedCells) 
						return 1;
					return 0;
				}
				
				getMinesCount(){
					return (this._mineCount);
				}
					
					// 	check(i,j)  -- проверка ячейки по координатам(i,j)
				check(i,j){
					//console.log(this._mineCount+' '+this.closedCells);
					
					let N = _difficulty.get(this);
					
					if(i>=N || j>=N) return;		 // check input
					
					i = 1*i;
					j = 1*j;
					var self = this;
					
					let cell = this.logicField.getCell(i,j);
					if(cell == '-'){
						let indexO = {m:[], n:[]};
						searching(i,j,indexO, this);  		// searching all cells like '-' or '1-8'
						while(indexO.m.length) {
							let c = indexO.m.pop();
							if(this._fieldToDisplay[parseInt(c/N)][c%N] != '-') {
								this.closedCells--;
								this._fieldToDisplay[parseInt(c/N)][c%N] = '-';	
							}				
						}
						while(indexO.n.length) {
							let c = indexO.n.pop().split(',');
							if(this._fieldToDisplay[parseInt(c[0]/N)][c[0]%N] != c[1]) {
								this.closedCells--;
								this._fieldToDisplay[parseInt(c[0]/N)][c[0]%N] = c[1];	
							}
						}
					} else if(/[1-8]/.test(cell) == true) {
						this.closedCells--;
						this._fieldToDisplay[i][j] = cell;
					} else if(cell == '*') {
						return {'result': 2, 'field': getCoreField.call(self)};
					}
					if(this.checkWin()==1) {
						return {'result': 1, 'field': getCoreField.call(self)}
					}
							
					/*get LogicField*/
					function getCoreField(){
						let str = '';
						let n = 0;
						let N = _difficulty.get(this);
						let nSq = N*N;
						while(n<nSq) {
							str+=' '+this.logicField.getCell(parseInt(n/N, 10),n%N)+' ';
							if((n+1)%N==0)
								str+='\n';
							n++;
						}

						return 	str;
					}
					
					function searching(i,j,indexO, _self) {
						let N = _difficulty.get(_self);
						let cell = _self.logicField.getCell(i,j);
						if(cell=='-') {
							if(indexO.m.indexOf(i*N+j) == -1) {
								indexO.m.push(i*N+j);
								let four = 0;
									if(i-1 < 0 ) {

									} else {
										searching(i-1,j,indexO, _self);
									}
									if(i-1 < 0 || j+1 >= N) {

									} else {
										searching(i-1,j+1,indexO, _self);
									}
									if(j+1 >= N) {

									} else {
										searching(i,j+1,indexO, _self);
									}
									if(i+1 >= N || j+1 >= N) {

									} else {
										searching(i+1,j+1,indexO, _self);
									}
									if(i+1 >= N) {
	
									} else {
										searching(i+1,j,indexO, _self);
									}
									if(i+1 >= N || j-1 < 0) {

									} else {
										searching(i+1,j-1,indexO, _self);
									}
									if(j-1 < 0) {

									} else {
										searching(i,j-1,indexO, _self);
									}
									if(i-1 < 0 || j-1 < 0) {

									} else {
										searching(i-1,j-1,indexO, _self);
									}
							}	
						} else if(/[1-8]/.test(cell) == true) {
							if(indexO.n.indexOf(i*N+j+','+cell) == -1)
							indexO.n.push(i*N+j+','+cell);
						}
					}
				}
				
			}
			
			exports.Game = Game;
			exports.Player = Player;
}(this.Minesweeper = {}));	