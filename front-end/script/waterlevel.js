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


const backToIndex = function () {
	window.location.href = './waterlevel.html';
};

const showStatus = function(jsonObject){
	console.log(jsonObject)
	
	for (const status of jsonObject.status) {
        if (status.deviceID == 1 & status.status == 1){
			statusWLS = 1
		}
		else if (status.deviceID == 3 & status.status == 0){
			statusWLS = 0
		}
		if(status.deviceID == 3 & status.status == 1){
			statusFSR = 1
		}
		else if(status.deviceID == 3 & status.status == 0){
			statusFSR = 0
		}
    }
	checkbtn()
}
const updateCoffeePot = function (data) {
	
	statusFSR = data	
	if (data == 1){
		document.querySelector('.js-CoffePot').classList.add("c-hidden");
	}
	else if (data == 0){
		document.querySelector('.js-CoffePot').classList.remove("c-hidden");
	}
	checkbtn()
}


const updateView = function (value) {
	console.log(value)
	htmlPercentage.innerHTML = `${value}`;
	htmlWave.style.transform = `translateY(${100-value}%)`;
	getStatus()
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********
const checkbtn = function () {
	if (statusWLS == 1 & statusFSR == 1){
		document.querySelector('.js-coffeebtn').classList.remove("c-hidden");
	}
	else{
		document.querySelector('.js-coffeebtn').classList.add("c-hidden");
	}
}



//#endregion

//#region ***  Data Access - get___                     ***********
const getStatus = function () {
	const url = `http://192.168.168.169:5000/api/v1/status/`;
	handleData(url, showStatus);
};


//#endregion

//#region ***  Event Listeners - listenTo___            ***********
const listenToUI = function () {
	
};
const listenToSocket = function () {
	socketio.on('connect', function () {
		console.log('verbonden met socket webserver');
	});
	socketio.on('B2F_connected', function (data) {
        console.log(data)
		updateView(data.current_waterlevel);
	});
	socketio.on('B2F_waterlevel', function (data) {
        console.log(data)
		updateView(data.current_waterlevel);
	});
	socketio.on('B2F_fsr', function (data) {
		updateCoffeePot(data.current_fsr)
	});
};

//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
	htmlWave = document.querySelector('.js-waves');
	htmlPercentage = document.querySelector('.js-percentage');

	listenToUI();
	listenToSocket();
};
document.addEventListener('DOMContentLoaded', init);
//#endregion
