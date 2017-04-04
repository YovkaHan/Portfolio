(function($){
	$(document).on('ready', function(){
		
		var rw =  $('#rblock').width() - ($('h1 .name').width() / 2),
			lw =  $('#lblock').width() - ($('h1 .name').width() / 2);
		
		// TITLE APPEARING
		$.when($('.brackets').animate({
			opacity: 1.0
			}, 700)).done(function(){
			$('#n1').addClass('move-left');
			$('#n2').addClass('move-right');
			
			$.when(
				$('#rblock').animate({
						width: rw
					}, 5),
				$('#lblock').animate({
						width: lw
					}, 5)
			).done(function(){
				var start = Date.now();

				var timer = setInterval(function() {
					var timePassed = Date.now() - start;
					  if (timePassed > 750) {
						$('.hidden-block').css('display', 'none');
						pageAppearing();
						 clearInterval(timer); 
					  }
				}, 25);	
			});
		});
		
		function pageAppearing() {
			$.when(
			$('.white-block').css({
				borderColor: '#286090'
			}),
			$('body').css({
				background: 'rgba(228, 228, 228, 0.65)'
			})
			).done(function(){
				$('.work-block').animate({
					opacity: 1.0
				}, 1000)
				$('.footer-content').addClass('show');
			});
		}
		
	});
})(jQuery)
