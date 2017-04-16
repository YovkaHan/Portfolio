(function(){

	function Work(wData, parentBlock) {
		this._NAME = wData.name;
		this._PATH = wData.pathToIndex;
		this._IMG = wData.img;
		this._DESCRIPTION = wData.description;
		this._SOURCE = wData.source;
		
		$(parentBlock).append(formation());
		
		function formation(){
			var $workBlock = $('<div class="work-block"></div>'),
				$workBlockContent = $('<div class="work-block-content"></div>'),
				$workImg = $('<img src="'+this._PATH+'img/'+this._IMG+'" class="work-img" alt"'+this._IMG+'">'),
				$workText = $('<div class="work-text"><h4>'+this._NAME+'</h4></div>'),
				$onHoverBlock = $('<div class="mask">'  +
									'<p>'+ this._DESCRIPTION +'</p>' +
									'<a href="'+ this._PATH+'index.html" target="_blank" class="info">Demo</a>'  +
									'<a href="'+ this._SOURCE + '" target="_blank" class="info">Code</a>' +
								'</div>');
				
			$workBlockContent.append($workImg);
			$workBlockContent.append($workText);
			$workBlockContent.append($onHoverBlock);
			$workBlock.append($workBlockContent).hover(
													  function() {
														$( $onHoverBlock ).addClass( "show-mask" );
													  }, function() {
														$( $onHoverBlock ).removeClass( "show-mask" );
													  }
													);
			
			return $workBlock;
		}
	}
	
	function wrapper(container) {
		var $wrap = $('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-4"></div>');
		$(container).append($wrap);
		return $wrap;
	}
		
	WORKS_DATA.works.map(function(w){
		Work(w,wrapper('#works .row'));
	});
	
})();

