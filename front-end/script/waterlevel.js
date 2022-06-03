'use strict';

//#region ***  DOM references                           ***********

let htmlAddButton, htmlWave, htmlPercentage;
let statusWLS = 0;
let statusFSR = 0;

let currentProgress = 0; // in milliliter
// !!
const lanIP = `${window.location.hostname}:5000`; //!!! PAS DIT AAN ZODAT DIT dynamisch wordt !!!
// !!

const socketio = io(lanIP);
//#endregion

//#region ***  Callback-Visualisation - show___         ***********
const showMakeCoffee = function (data) {
	if(data == 1){
		document.querySelector('.js-coffeegif').classList.remove("c-hidden");
		var seconds=10; //120 seconden na development
		var timer;
		function myFunction() {
		if(seconds < 10) { //(seconds < 120) na development
			document.querySelector(".clockdiv").innerHTML = `time remaining: ${seconds} seconds`;
		}
		if (seconds >0 ) {
			seconds--;
		}
		}
		if(!timer) {
			timer = window.setInterval(function() { 
			myFunction();
			}, 1000); 
		}
		document.querySelector(".clockdiv").innerHTML= `time remaining: 10 seconds`; 
	}
	else{
		
		document.querySelector('.js-coffeegif').classList.add("c-hidden");
	}	
}

const updateTmp = function (value) {
	if(value != null){
		document.querySelector('.js-tmp').classList.remove("c-hidden");
	}
	else{
		document.querySelector('.js-tmp').classList.add("c-hidden");
	}
	document.querySelector('.js-tmp').innerHTML = `temperature: ${value}`;
}

const backToIndex = function () {
	window.location.href = './waterlevel.html';
};


const updateCoffeePot = function (data) {
	statusFSR = data	
	if (data == 1){
		document.querySelector('.js-CoffePot').classList.add("c-hidden");
		
	}
	else if (data == 0){
		document.querySelector('.js-CoffePot').classList.remove("c-hidden");
	}
	
}


const updateView = function (value) {
	if (value > 10 & value < 98) {
		statusWLS = 1
	}
	else{
		statusWLS = 0
	}
	htmlPercentage.innerHTML = `${value}`;
	htmlWave.style.transform = `translateY(${100-value}%)`;

};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********
const checkbtn = function () {
	//console.log(`fsrval:${statusFSR}`)
	if (statusWLS == 1 & statusFSR == 1){
		document.querySelector('.js-coffeebtn').classList.remove("c-hidden");
		document.querySelector('.js-potdetected').classList.remove("c-hidden");
		
	}
	else{
		document.querySelector('.js-coffeebtn').classList.add("c-hidden");
		document.querySelector('.js-potdetected').classList.add("c-hidden");

	}
}
//#endregion

//#region ***  Data Access - get___                     ***********


//#endregion

//#region ***  Event Listeners - listenTo___            ***********
const listenToBtn = function(){
	document.querySelector('.js-coffeebtn').addEventListener('click', function(){
		console.log('coffee button clicked')
		socketio.emit('F2B_makecoffee')
	});
}
const listenToUI = function () {
	
};
const listenToSocket = function () {
	socketio.on('connect', function () {
		console.log('verbonden met socket webserver');
	});
	socketio.on('B2F_connected', function (data) {
        //console.log(data)
		updateView(data.current_waterlevel);
	});
	socketio.on('B2F_waterlevel', function (data) {
        //console.log(data)
		checkbtn()
		updateView(data.current_waterlevel);
	});
	socketio.on('B2F_coffepot', function (data) {
		//console.log(data)
		updateCoffeePot(data.coffepot_status)
	});
	socketio.on('B2F_tmp', function (data) {
		updateTmp(data.current_tmp)
	});
	socketio.on('B2F_coffee', function (data) {
		console.log(data)
		showMakeCoffee(data.coffee_status)
	});
};

//#endregion



//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
	console.log('dom loaded')
	htmlWave = document.querySelector('.js-waves');
	htmlPercentage = document.querySelector('.js-percentage');
	listenToSocket();
	listenToBtn();
	checkbtn();
};
document.addEventListener('DOMContentLoaded', init);
//#endregion
