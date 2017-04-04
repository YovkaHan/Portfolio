(function(exports){
	var paddingTop = $('#mainBlock').css('padding-top').split('px');
	var isSmartphoneNow = false;  // Смарт ли сейчас
	var firstCircle = true;		 // Первый проход
	var btnHidden = false;
	var _isSmartphone = function(w) {return w <= 575};
	
	function setups(switchOffMainBlock) {
		if(_isSmartphone($(window).width())) {
			$('#leftBlock').height(parseInt($(window).height()*0.25));
			console.log($(window).width()+'  '+document.documentElement.clientWidth);
			$('#leftBlock').width($(window).width() - findScrollWidth());
		
			$('#mainBlock').height($(window).height());
		} else {
			if(switchOffMainBlock && $('#mainBlock').height() < $('#game').height()){
				$('#mainBlock').css('height', 'inherit');
			}else {
				$('#mainBlock').height($(window).height());
			}
			
			$('#leftBlock').height($(document).height());
			$('#leftBlock').width($(window).width()*0.25);
		}
	}
	
	function findScrollWidth(){
		// создадим элемент с прокруткой
		var div = document.createElement('div');

		div.style.overflowY = 'scroll';
		div.style.width = '50px';
		div.style.height = '50px';

		// при display:none размеры нельзя узнать
		// нужно, чтобы элемент был видим,
		// visibility:hidden - можно, т.к. сохраняет геометрию
		div.style.visibility = 'hidden';

		document.body.appendChild(div);
		var scrollWidth = div.offsetWidth - div.clientWidth;
		document.body.removeChild(div);
		return scrollWidth;
	}
	
	function changePosition(set) {
	/*	if ( typeof changePosition.temp == 'undefined') {
			changePosition.temp = {top: $('#showHideBtn').css('top'), left: $('#showHideBtn').css('left')};
		}	*/
		if(set == 1){
			/*if(!firstCircle){
				changePosition.temp.left = $('#showHideBtn').css('left');
				$('#showHideBtn').css('left', 'initial');
				$('#showHideBtn').css('top', 'changePosition.temp.top');
			}*/
			isSmartphoneNow = true;
			firstCircle = false;
			btnStyle('#showHideBtn');
			$('#showHideBtn').unbind('click', fLeft);
			$('#showHideBtn').bind('click', fUp);
		} else if(set == 2) {
			/*if(!firstCircle){
				changePosition.temp.top = $('#showHideBtn').css('top');
				$('#showHideBtn').css('top', 'initial');
				$('#showHideBtn').css('left', 'changePosition.temp.left');
			}*/
			isSmartphoneNow = false;
			firstCircle = false;
			btnStyle('#showHideBtn');
			$('#showHideBtn').unbind('click', fUp);
			$('#showHideBtn').bind('click', fLeft);
		}

	}
	
	function fLeft(){
		if(btnHidden == false) {
			$('#leftBlock').toggle('slide', {
				direction: 'left'
			}, 1000);
			$('#showHideBtn').animate({
				left: "+=50",
				opacity: 0.25
			  }, 1000, function() {
				// Animation complete.
			  });
			  
			btnHidden = true;
		}else {
			$('#leftBlock').toggle('slide', {
				direction: 'left'
			}, 1000);
			$('#showHideBtn').animate({
				left: "-=50",
				opacity: 1
			  }, 1000, function() {
				// Animation complete.
			  });
			  
			btnHidden = false;
		}
	}
	function fUp(){
		if(btnHidden == false) {
			$('#leftBlock').toggle('slide', {
				direction: 'up'
			}, 1000);
			$('#showHideBtn').animate({
				top: "+=20",
				opacity: 0.25
			  }, 1000, function() {
				// Animation complete.
			  });
			  
			btnHidden = true;
		}else {
			$('#leftBlock').toggle('slide', {
				direction: 'up'
			}, 1000);
			$('#showHideBtn').animate({
				top: "-=20",
				opacity: 1
			  }, 1000, function() {
				// Animation complete.
			  });
			  
			btnHidden = false;
		}
	}
	
	function btnStyle(id) {
		if(btnHidden) {
			if(isSmartphoneNow){
				$(id).css('top', '30px');
				$(id).css('left', 'initial')
			} else {
				$(id).css('top', '10px');
				$(id).css('left', '50px');
			}
		} else {
			if(isSmartphoneNow){
				$(id).css('top', '10px');
				$(id).css('left', 'initial')
			} else {
				$(id).css('top', '10px');
				$(id).css('left', '0px');
			}
		}
	}
	
	function viewSet(switchOffMainBlock) {
		
		switchOffMainBlock = (typeof switchOffMainBlock == 'object') ? false: switchOffMainBlock;
		
		setups(switchOffMainBlock);
		
		if(_isSmartphone($(window).width())){
			if(!isSmartphoneNow){
				changePosition(1);
			}
		} else {
			if(firstCircle || isSmartphoneNow){
				changePosition(2);
			}
		}
			
	}
	
	$(document).bind('ready', viewSet);
	$(window).bind('resize', viewSet);
	
	exports.viewSet = viewSet;
	//$('#showHideBtn').bind('resize', slideSet);

}(this.View = {}))