$(document).ready(function(){
	$('.slider').slick({
		slidesToShow: 4,
		arrows:true,
		dots:false,
		slidesToScroll: 1,
		speed:1000,
		cssEase:'ease',
		infinite: true,
		autoplay:true,
		autoplayspeed:500,
		pauseonfocus:true,
		pauseonhover: true,
		pauseOnDotsHover:true,
		draggable:false,
		waitForAnimate: false,
		responsive:[
			{
				breakpoint:1025,
				settings:{
					slidesToShow:3,
					arrows:false,
					dots:true,
					autoplay:false,
					infinite:false
				}
			},{
				breakpoint:769,
				settings:{
					slidesToShow:2,
					arrows:false,
					draggable:true,
					dots:true,
					autoplay:false,
					infinite:false,
				}
			},{
				breakpoint:361,
				settings:{
					slidesToShow:1,
					arrows:false,
					draggable:true,
					dots:true,
					autoplay:false,
					infinite:false,
				}
			}
		]
	
	});
});