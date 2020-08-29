const filterBox = document.getElementById('#box');
document.getElementById('#menu').addEventListener('click', event=> {
	if(event.target.tagName !== 'li') return false;
	let filterClass = event.target.dataset['f'];
	filterBox.forEach( elem => {
		if(!elem.classList.contains(filterClass)){
			elem.classList.add('hide');
		}
	});
});