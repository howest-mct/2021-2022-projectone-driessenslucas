'use strict';

//#region ***  DOM references                           ***********

let htmlAddButton, htmlWave, htmlPercentage, htmlWelcome;
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
	if (data == 1) {
		document.querySelector('.js-coffeegif').classList.remove('c-hidden');
		var seconds = 10; //120 seconden na development
		var timer;
		function myFunction() {
			if (seconds < 10) {
				//(seconds < 120) na development
				document.querySelector(
					'.clockdiv'
				).innerHTML = `time remaining: ${seconds} seconds`;
			}
			if (seconds > 0) {
				seconds--;
			}
		}
		if (!timer) {
			timer = window.setInterval(function () {
				myFunction();
			}, 1000);
		}
		document.querySelector(
			'.clockdiv'
		).innerHTML = `time remaining: 10 seconds`;
	}
};

const updateTmp = function (value) {
	document.querySelector('.js-temp').innerHTML = `temp: ${value}`;
};

const backToIndex = function () {
	window.location.href = './waterlevel.html';
};

const updateCoffeePot = function (data) {
	statusFSR = data;
};

const updateView = function (value) {
	if ((value > 10) & (value < 98)) {
		statusWLS = 1;
	} else {
		statusWLS = 0;
	}
	htmlWave.style.transform = `translateY(${100 - value}%)`;
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***********

//#endregion

//#region ***  Data Access - get___                     ***********
const checkWelcomeMsg = function () {
	var today = new Date();
	var hour = today.getHours();

	if (hour < 12) {
		document.querySelector('.js-welcome').innerHTML = 'Good morning';
	} else if (hour < 18) {
		document.querySelector('.js-welcome').innerHTML = 'Good afternoon';
	} else {
		document.querySelector('.js-welcome').innerHTML = 'Good evening';
	}
};

//#endregion

//#region ***  Event Listeners - listenTo___            ***********

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
		updateView(data.current_waterlevel);
	});
	socketio.on('B2F_coffepot', function (data) {
		//console.log(data)
		updateCoffeePot(data.coffepot_status);
	});
	socketio.on('B2F_tmp', function (data) {
		updateTmp(data.current_tmp);
	});
	socketio.on('B2F_coffee', function (data) {
		console.log(data);
		showMakeCoffee(data.coffee_status);
	});
};

//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
	console.log('dom loaded');
	htmlWelcome = document.querySelector('.js-welcome');
	htmlWave = document.querySelector('.js-waves');
	htmlPercentage = document.querySelector('.js-percentage');
	listenToSocket();
	checkWelcomeMsg();
};
document.addEventListener('DOMContentLoaded', init);
//#endregion
