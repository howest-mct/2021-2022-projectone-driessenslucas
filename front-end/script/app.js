'use strict';

//#region ***  DOM references                           ***********

let htmlbrewButton,
	htmlBrewingPopUp,
	htmlOnSwitch,
	htmlWave,
	htmlPercentage,
	htmlWelcome,
	htmlFSRCheck,
	htmlWLSCheck,
	htmlStartbtn,
	htmlClosePopUp;
let statusWLS = 0;
let statusFSR = 0;

let currentProgress = 0; // in milliliter
let isTurnedOn = 0;
// !!
const lanIP = `${window.location.hostname}:5000`; //!!! PAS DIT AAN ZODAT DIT dynamisch wordt !!!
// !!
const socketio = io(lanIP);
//#endregion

//#region ***  Callback-Visualisation - show___         ***********
const ResetPopUpHtml = function () {
	document.querySelector('.c-coffeestatus').innerHTML = '';
	document.querySelector('.c-checkdiv').classList.remove('c-hidden');
	htmlStartbtn.disabled = false;
	htmlStartbtn.innerHTML = `Start`;
};

const showCoffeeStatus = function (status) {
	document.querySelector('.c-checkdiv').classList.add('c-hidden');
	if (status == 1) {
		document.querySelector(
			'.c-coffeestatus'
		).innerHTML = `<span>Coffee is brewing</span>`;
		htmlStartbtn.disabled = true;
		htmlStartbtn.innerHTML = `Brewing...`;
	} else if (status == 0) {
		document.querySelector(
			'.c-coffeestatus'
		).innerHTML = `<span>Coffee is done</span>`;
		htmlStartbtn.disabled = true;
		htmlStartbtn.innerHTML = `Enjoy!`;
	}
};

const RemoveTurnOnMsg = function () {
	document.querySelector('.js-turnonspan').innerHTML = '';
	updatePrerequisites();
};

// const showMakeCoffee = function (data) {
// 	if (data == 1) {
// 		var seconds = 10; //120 seconden na development
// 		var timer;
// 		function myFunction() {
// 			if (seconds < 10) {
// 				//(seconds < 120) na development
// 				document.querySelector(
// 					'.clockdiv'
// 				).innerHTML = `time remaining: ${seconds} seconds`;
// 			}
// 			if (seconds > 0) {
// 				seconds--;
// 			}
// 		}
// 		if (!timer) {
// 			timer = window.setInterval(function () {
// 				myFunction();
// 			}, 1000);
// 		}
// 		document.querySelector(
// 			'.clockdiv'
// 		).innerHTML = `time remaining: 10 seconds`;
// 	}
// };

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
const updatePrerequisites = function () {
	// console.log('checking sensors');
	if (statusWLS == 1) {
		htmlWLSCheck.checked = true;
	} else if (statusWLS == 0) {
		htmlWLSCheck.checked = false;
	}
	if (statusFSR == 1) {
		htmlFSRCheck.checked = true;
	} else if (statusFSR == 0) {
		htmlFSRCheck.checked = false;
	}
};

//#endregion

//#region ***  Data Access - get___                     ***********

//checks if there is water and if there is a coffee pot
const checkCoffeePrerequisites = function () {
	if (isTurnedOn == 1) {
		//RemoveTurnOnMsg();
		document.querySelector('.js-brewingpopup').classList.remove('c-hidden');
		htmlbrewButton.disabled = true;
		updatePrerequisites();
		htmlStartbtn.disabled = false;
		listenToStart();
	} else {
		document.querySelector(
			'.js-turnonspan'
		).innerHTML = `<span> Please turn on the coffee machine </span>`;
		htmlbrewButton.disabled = false;
	}
};

const checkWelcomeMsg = function () {
	var today = new Date();
	var hour = today.getHours();

	if (hour < 12) {
		htmlWelcome.innerHTML = `Good morning`;
		console.log('good morning');
	} else if (hour < 18) {
		htmlWelcome.innerHTML = `Good afternoon`;
		console.log('good afternoon');
	} else {
		htmlWelcome.innerHTML = `Good evening`;
		console.log('good evening');
	}
};

//#endregion

//#region ***  Event Listeners - listenTo___            ***********
const listenToContinue = function () {
	console.log('welcome');
};

const listenToStart = function () {
	htmlStartbtn.addEventListener('click', function () {
		socketio.emit('F2B_brew');
	});
};
const listenToUI = function () {
	// starts the brewing process
	htmlbrewButton.addEventListener('click', function () {
		console.log('brewing process started');
		checkCoffeePrerequisites();
	});
	htmlOnSwitch.addEventListener('change', function () {
		if (this.checked) {
			isTurnedOn = 1;
			RemoveTurnOnMsg();
			socketio.emit('F2B_turn_on');
		} else {
			isTurnedOn = 0;
			socketio.emit('F2B_turn_off');
		}
	});
	htmlClosePopUp.addEventListener('click', function () {
		document.querySelector('.js-brewingpopup').classList.add('c-hidden');
		htmlbrewButton.disabled = false;
		ResetPopUpHtml();
	});
};

const listenToSocket = function () {
	socketio.on('connect', function () {
		console.log('verbonden met socket webserver');
	});

	socketio.on('B2F_WLS', function (data) {
		//console.log(data)
		statusWLS = data.current_waterlevel;
		updatePrerequisites();
		updateView(data.current_waterlevel);
	});
	socketio.on('B2F_coffepot', function (data) {
		//console.log(data)
		statusFSR = data.coffepot_status;
		updatePrerequisites();
	});
	socketio.on('B2F_temp', function (data) {
		updateTemp(data.current_temp);
	});
	socketio.on('B2F_brewingStatus', function (data) {
		console.log(data.coffee_status);
		if (data.coffee_status == 0) {
			showCoffeeStatus(0);
		} else {
			showCoffeeStatus(1);
		}
	});
};

//#endregion

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
	console.log('dom loaded');
	if (document.querySelector('.homepage')) {
		htmlWelcome = document.querySelector('.js-welcome');
		htmlWave = document.querySelector('.js-waves');
		htmlPercentage = document.querySelector('.js-percentage');
		htmlbrewButton = document.querySelector('.js-brewbtn');
		htmlOnSwitch = document.querySelector('.js-onswitch');
		htmlBrewingPopUp = document.querySelector('.js-brewingpopup');
		htmlWLSCheck = document.querySelector('.js-wlscheck');
		htmlFSRCheck = document.querySelector('.js-fsrcheck');
		htmlStartbtn = document.querySelector('.js-startbtn');
		htmlClosePopUp = document.querySelector('.c-closepopup');
		listenToSocket();
		listenToUI();
		checkWelcomeMsg();
	}
	if (document.querySelector('.welcome')) {
		listenToContinue();
	}
};
document.addEventListener('DOMContentLoaded', init);
//#endregio
