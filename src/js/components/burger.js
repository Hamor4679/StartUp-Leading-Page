const menuToggle = document.querySelector('#burger');
const mobileNavContainer = document.querySelector('#mobile');
menuToggle.onclick = function(){
	menuToggle.classList.toggle('burger-menu_active');
	mobileNavContainer.classList.toggle('mobile-nav--active');
};
