'use strict';

//#region ***  DOM references                           ***********

let htmlAddButton, htmlWave, htmlPercentage;

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

const updateView = function (value) {
	
	htmlPercentage.innerHTML = `${value}%`;
	htmlWave.style.transform = `translateY(${value}%)`;
   
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********


//#endregion

//#region ***  Data Access - get___                     ***********

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
		currentProgress = 0;
		updateView(data.new_waterlevel);
        backToIndex()
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
