'use strict';

//#region ***  DOM references                           ***********

let htmlbrewButton,
	htmlBrewingPopUp,
	htmlOnSwitch,
	htmlWave,
	htmlPercentage,
	htmlWelcome;
let statusWLS = 0;
let statusFSR = 0;

let currentProgress = 0; // in milliliter
// !!
const lanIP = `${window.location.hostname}:5000`; //!!! PAS DIT AAN ZODAT DIT dynamisch wordt !!!
// !!

const socketio = io(lanIP);
//#endregion

//#region ***  Callback-Visualisation - show___         ***********
const showTurnOnMsg = function () {
	//htmlBrewingPopUp.classlist.add('c-hidden');
	document.querySelector(
		'.c-welcome'
	).innerHTML = `<span> Please turn on the coffee machine </span>`;
	if(getTurnOnValue() == 1){
		document.querySelector(
			'.c-welcome'
		).innerHTML = `<h1 clas>`;
		checkCoffeePrerequisites();
	};
};

const showMakeCoffee = function (data) {
	if (data == 1) {
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

const updateTemp = function (value) {
	document.querySelector('.js-temp').innerHTML = `temp: ${value}`;
};

const backToIndex = function () {
	window.location.href = './index.html';
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
//checks if there is water and if there is a coffee pot
const checkCoffeePrerequisites = function () {
	if (htmlOnSwitch.value == 1) {
		htmlBrewingPopUp.classlist.remove('c-hidden');
		if ((statusFSR == 1) & (statusWLS == 1)) {
		}
	} else {
		showTurnOnMsg();
	}
};

const checkWelcomeMsg = function () {
	var today = new Date();
	var hour = today.getHours();

	if (hour < 12) {
		htmlWelcome.innerHTML = 'Good morning';
	} else if (hour < 18) {
		htmlWelcome.innerHTML = 'Good afternoon';
	} else {
		htmlWelcome.innerHTML = 'Good evening';
	}
};

//#endregion

//#region ***  Event Listeners - listenTo___            ***********
const listenToUI = function () {
	// starts the brewing process
	htmlbrewButton.addEventListener('click', function () {
		console.log('brewing process started');
		checkCoffeePrerequisites();
	});
};

const listenToSocket = function () {
	socketio.on('connect', function () {
		console.log('verbonden met socket webserver');
	});

	socketio.on('B2F_WLS', function (data) {
		//console.log(data)
		updateView(data.current_waterlevel);
	});
	socketio.on('B2F_coffepot', function (data) {
		//console.log(data)
		updateCoffeePot(data.coffepot_status);
	});
	socketio.on('B2F_temp', function (data) {
		updateTemp(data.current_temp);
	});
	socketio.on('B2F_brewingStatus', function (data) {
		console.log(data);
	});
};

//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
	console.log('dom loaded');
	htmlWelcome = document.querySelector('.js-welcome');
	htmlWave = document.querySelector('.js-waves');
	htmlPercentage = document.querySelector('.js-percentage');
	htmlbrewButton = document.querySelector('.js-brewbtn');
	htmlOnSwitch = document.querySelector('.js-onswitch');
	htmlBrewingPopUp = document.querySelector('.js-brewingpopup');
	listenToSocket();
	listenToUI();
	checkWelcomeMsg();
};
document.addEventListener('DOMContentLoaded', init);
//#endregion
