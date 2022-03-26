window.addEventListener('resize',()=>{
	if(window.innerWidth < 768){
		makeOffCanvas();
	}else{
		removeOffCanvas();
	}
});

function makeOffCanvas(){
	const filterDiv=document.querySelector('#filter-parent');
	filterDiv.id='offcanvasExample';
	filterDiv.className='offcanvas offcanvas-start';
}

function removeOffCanvas(){
	const filterDiv=document.getElementById('offcanvasExample');
	filterDiv.id='filter-parent';
	filterDiv.className='col-md-3 col-sm-0';
	filterDiv.ariaHidden=false;
	filterDiv.style.visibility='visible';
}