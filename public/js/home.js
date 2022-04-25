window.addEventListener('resize',()=>{
	console.log("urmom")
	if(window.innerWidth < 768){
		makeOffCanvas();
	}else{
		removeOffCanvas();
	}
});

const setJobs = async () => {
	const jobContainer = document.getElementsByClassName('job-box')[0];
	const body = document.querySelector('body');
	jobContainer.style.height += (window.innerHeight - body.height) + 'px';
}

window.addEventListener('load', () => {
	setJobs();
})

window.addEventListener('load',()=>{
	if(window.innerWidth < 768){
		makeOffCanvas();
	}
});
const filterDiv=document.querySelector('#filter-parent');
const filterBut=document.querySelector('#filter-close-button');

function makeOffCanvas(){
	filterDiv.id='offcanvasExample';
	filterDiv.className='offcanvas offcanvas-start';
	filterBut.style.display='block';
}

function removeOffCanvas(){
	const filterDiv=document.getElementById('offcanvasExample');
	filterDiv.id='filter-parent';
	filterDiv.className='col-md-3 col-sm-0';
	filterDiv.ariaHidden=false;
	filterDiv.style.visibility='visible';
	filterBut.style.display='none';
}