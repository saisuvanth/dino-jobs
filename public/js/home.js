window.addEventListener('resize',()=>{
	if(window.innerWidth < 768){
		makeOffCanvas();
	}else{
		removeOffCanvas();
	}
});
window.addEventListener('load',()=>{
	if(window.innerWidth < 768){
		makeOffCanvas();
	}
});
const filterDiv=document.querySelector('#filter-parent');
const filterBut=document.querySelector('#filter-close-button');
// const filterHead=document.querySelector('#mycol-1');

function makeOffCanvas(){
	filterDiv.id='offcanvasExample';
	filterDiv.className='offcanvas offcanvas-start';
	filterBut.style.display='block';
	// filterHead.classList.add('offcanvas-header');
}

function removeOffCanvas(){
	const filterDiv=document.getElementById('offcanvasExample');
	filterDiv.id='filter-parent';
	filterDiv.className='col-md-3 col-sm-0';
	filterDiv.ariaHidden=false;
	filterDiv.style.visibility='visible';
	filterBut.style.display='none';
	// filterHead.classList.remove('offcanvas-header');
}