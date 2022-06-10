'use strict';

//#region ***  DOM references                           ***********

let htmlbrewButton,
	htmlBrewingPopUp,
	htmlOnSwitch,
	htmlTable,
	htmlDeletebtn,
	htmlWave,
	htmlPercentage,
	htmlWelcome,
	htmlFSRCheck,
	htmlWLSCheck,
	htmlStartbtn,
	specificDeviceID,
	meeteenheid,
	icon,
	htmlClosePopUp;
let statusWLS = 0;
let statusFSR = 0;

let currentProgress = 0; // in milliliter
let isTurnedOn = 0;
// !!
const lanIP = `http://${window.location.hostname}:5000`; //!!! PAS DIT AAN ZODAT DIT dynamisch wordt !!!
// !!
const socketio = io(lanIP);
//#endregion

//#region ***  Callback-Visualisation - show___         ***********
const showSpecificLogs = function (data) {
	console.log(data);
	let html = '';
	html += `<tr class="c-row js-header">
	<th>id</th>
	<th>datum</th>
	<th>waarde</th>
	<th>device</th>
	  </tr>`;
	for (let log of data.data) {
		icon = ``;
		meeteenheid = ``;
		if (specificDeviceID == 1) {
			meeteenheid = '%';
			icon = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20">
			<g id="water_drop_black_24dp" transform="translate(0 -0.238)">
			  <rect id="Rectangle_3" data-name="Rectangle 3" width="21" height="20" transform="translate(0 0.238)" fill="none"/>
			  <path id="Path_5" data-name="Path 5" d="M10.647,2Q4,7.671,4,11.8a6.649,6.649,0,1,0,13.294,0Q17.294,7.667,10.647,2ZM7.182,11.971a.624.624,0,0,1,.615.515,2.815,2.815,0,0,0,3.024,2.385.624.624,0,1,1,.058,1.246,4.049,4.049,0,0,1-4.312-3.423A.624.624,0,0,1,7.182,11.971Z" transform="translate(-0.676 -0.338)"/>
			</g>
		  </svg>
		  `;
		} else if (specificDeviceID == 2) {
			meeteenheid = '°C';
			icon = `<svg id="thermostat_black_24dp" xmlns="http://www.w3.org/2000/svg" width="20.636" height="20.636" viewBox="0 0 20.636 20.636">
			<g id="Group_8" data-name="Group 8">
			  <path id="Path_6" data-name="Path 6" d="M0,0H20.636V20.636H0Z" fill="none"/>
			</g>
			<g id="Group_9" data-name="Group 9" transform="translate(6.019 1.72)">
			  <path id="Path_7" data-name="Path 7" d="M13.879,11.458V4.58a2.58,2.58,0,1,0-5.159,0v6.879a4.3,4.3,0,1,0,5.159,0Zm-3.439-1.72V4.58a.86.86,0,1,1,1.72,0v.86H11.3V6.3h.86v1.72H11.3v.86h.86v.86Z" transform="translate(-7 -2)"/>
			</g>
		  </svg>
		  `;
		} else if (specificDeviceID == 3) {
			meeteenheid = 'g';
			icon = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
			<g id="scale_black_24dp" transform="translate(0 0.02)">
			  <g id="Group_12" data-name="Group 12" transform="translate(0 0)">
				<rect id="Rectangle_4" data-name="Rectangle 4" width="21" height="21" transform="translate(0 -0.02)" fill="none"/>
			  </g>
			  <g id="Group_13" data-name="Group 13" transform="translate(1.748 1.41)">
				<path id="Path_8" data-name="Path 8" d="M12.487,9.865V7.244C16.472,6.737,19.479,4.534,19.479,2H2C2,4.534,5.006,6.737,8.991,7.244V9.865C5.775,10.5,2,13.02,2,19.479H7.244V17.731H3.861a6.74,6.74,0,0,1,6.878-6.292,6.74,6.74,0,0,1,6.878,6.292H14.235v1.748h5.244C19.479,13.02,15.7,10.5,12.487,9.865Zm-1.748,9.613a1.753,1.753,0,0,1-1.748-1.748A1.709,1.709,0,0,1,9.507,16.5c.7-.7,4.728-2.263,4.728-2.263s-1.564,4.029-2.263,4.728A1.709,1.709,0,0,1,10.739,19.479Z" transform="translate(-2 -2)"/>
			  </g>
			</g>
		  </svg>
		  `;
		} else if (specificDeviceID == 4) {
			if (log.Waarde == 1) {
				log.Waarde = 'Aan';
			} else if (log.Waarde == 0) {
				log.Waarde = 'Uit';
			}
			icon = `
			<svg
				id='coffee_maker_black_24dp'
				xmlns='http://www.w3.org/2000/svg'
				width='31'
				height='31'
				viewBox='0 0 139.204 128.469'
			>
				<g id='Group_3' data-name='Group 3'>
					<path
						id='Path_1'
						data-name='Path 1'
						d='M0,0H139.2V128.469H0Z'
						fill='none'
					/>
				</g>
				<g
					id='Group_5'
					data-name='Group 5'
					transform='translate(23.201 10.706)'
				>
					<g id='Group_4' data-name='Group 4'>
						<path
							id='Path_2'
							data-name='Path 2'
							d='M85.2,23.412V12.706H96.8V2H15.6C9.22,2,4,6.818,4,12.706V98.352c0,5.888,5.22,10.706,11.6,10.706H96.8V98.352H73.428C80.562,93.481,85.2,85.719,85.2,76.94V50.176h-58V76.94c0,8.779,4.7,16.54,11.774,21.412H15.6V12.706H27.2V23.412A5.607,5.607,0,0,0,33,28.764H79.4A5.606,5.606,0,0,0,85.2,23.412Z'
							transform='translate(-4 -2)'
						/>
						<ellipse
							id='Ellipse_2'
							data-name='Ellipse 2'
							cx='5.536'
							cy='5.109'
							rx='5.536'
							ry='5.109'
							transform='translate(45.45 34.257)'
						/>
					</g>
				</g>
			</svg>`;
		} else {
			icon = specificDeviceID;
		}
		html += `
		<tr class="c-row">
        <td class="c-cell">${log.volgnummer}</div>
        <td class="c-cell">${log.actiedatum}</div>
		<td class="c-cell">${Math.round(log.Waarde, 2)} ${meeteenheid}</div>
        <td class="c-cell">${icon}</div>
        </tr>`;
	}
	htmlTable.innerHTML = html;
};

const showLogs = function (data) {
	console.log(data);
	let value = ``;
	let html = '';
	html += `<tr class="c-row js-header">
	<th>id</th>
	<th>datum</th>
	<th>waarde</th>
	<th>device</th>
	  </tr>`;
	for (let log of data.logs) {
		value = ``;
		icon = '';
		meeteenheid = '';
		if (log.deviceID == 1) {
			value = Math.round(log.Waarde, 2);
			meeteenheid = '%';
			icon = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20">
			<g id="water_drop_black_24dp" transform="translate(0 -0.238)">
			  <rect id="Rectangle_3" data-name="Rectangle 3" width="21" height="20" transform="translate(0 0.238)" fill="none"/>
			  <path id="Path_5" data-name="Path 5" d="M10.647,2Q4,7.671,4,11.8a6.649,6.649,0,1,0,13.294,0Q17.294,7.667,10.647,2ZM7.182,11.971a.624.624,0,0,1,.615.515,2.815,2.815,0,0,0,3.024,2.385.624.624,0,1,1,.058,1.246,4.049,4.049,0,0,1-4.312-3.423A.624.624,0,0,1,7.182,11.971Z" transform="translate(-0.676 -0.338)"/>
			</g>
		  </svg>
		  `;
		} else if (log.deviceID == 2) {
			value = Math.round(log.Waarde, 2);
			meeteenheid = '°C';
			icon = `<svg id="thermostat_black_24dp" xmlns="http://www.w3.org/2000/svg" width="20.636" height="20.636" viewBox="0 0 20.636 20.636">
			<g id="Group_8" data-name="Group 8">
			  <path id="Path_6" data-name="Path 6" d="M0,0H20.636V20.636H0Z" fill="none"/>
			</g>
			<g id="Group_9" data-name="Group 9" transform="translate(6.019 1.72)">
			  <path id="Path_7" data-name="Path 7" d="M13.879,11.458V4.58a2.58,2.58,0,1,0-5.159,0v6.879a4.3,4.3,0,1,0,5.159,0Zm-3.439-1.72V4.58a.86.86,0,1,1,1.72,0v.86H11.3V6.3h.86v1.72H11.3v.86h.86v.86Z" transform="translate(-7 -2)"/>
			</g>
		  </svg>
		  `;
		} else if (log.deviceID == 3) {
			value = Math.round(log.Waarde, 2);
			meeteenheid = 'g';
			icon = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
			<g id="scale_black_24dp" transform="translate(0 0.02)">
			  <g id="Group_12" data-name="Group 12" transform="translate(0 0)">
				<rect id="Rectangle_4" data-name="Rectangle 4" width="21" height="21" transform="translate(0 -0.02)" fill="none"/>
			  </g>
			  <g id="Group_13" data-name="Group 13" transform="translate(1.748 1.41)">
				<path id="Path_8" data-name="Path 8" d="M12.487,9.865V7.244C16.472,6.737,19.479,4.534,19.479,2H2C2,4.534,5.006,6.737,8.991,7.244V9.865C5.775,10.5,2,13.02,2,19.479H7.244V17.731H3.861a6.74,6.74,0,0,1,6.878-6.292,6.74,6.74,0,0,1,6.878,6.292H14.235v1.748h5.244C19.479,13.02,15.7,10.5,12.487,9.865Zm-1.748,9.613a1.753,1.753,0,0,1-1.748-1.748A1.709,1.709,0,0,1,9.507,16.5c.7-.7,4.728-2.263,4.728-2.263s-1.564,4.029-2.263,4.728A1.709,1.709,0,0,1,10.739,19.479Z" transform="translate(-2 -2)"/>
			  </g>
			</g>
		  </svg>
		  `;
		} else if (log.deviceID == 4) {
			if (log.Waarde == 1) {
				value = 'Aan';
			} else if (log.Waarde == 0) {
				value = 'Uit';
			}
			icon = `
			<svg
				id='coffee_maker_black_24dp'
				xmlns='http://www.w3.org/2000/svg'
				width='31'
				height='31'
				viewBox='0 0 139.204 128.469'
			>
				<g id='Group_3' data-name='Group 3'>
					<path
						id='Path_1'
						data-name='Path 1'
						d='M0,0H139.2V128.469H0Z'
						fill='none'
					/>
				</g>
				<g
					id='Group_5'
					data-name='Group 5'
					transform='translate(23.201 10.706)'
				>
					<g id='Group_4' data-name='Group 4'>
						<path
							id='Path_2'
							data-name='Path 2'
							d='M85.2,23.412V12.706H96.8V2H15.6C9.22,2,4,6.818,4,12.706V98.352c0,5.888,5.22,10.706,11.6,10.706H96.8V98.352H73.428C80.562,93.481,85.2,85.719,85.2,76.94V50.176h-58V76.94c0,8.779,4.7,16.54,11.774,21.412H15.6V12.706H27.2V23.412A5.607,5.607,0,0,0,33,28.764H79.4A5.606,5.606,0,0,0,85.2,23.412Z'
							transform='translate(-4 -2)'
						/>
						<ellipse
							id='Ellipse_2'
							data-name='Ellipse 2'
							cx='5.536'
							cy='5.109'
							rx='5.536'
							ry='5.109'
							transform='translate(45.45 34.257)'
						/>
					</g>
				</g>
			</svg>`;
		} else {
			icon = log.deviceID;
		}

		html += `=
		<tr class="c-row">
        <td class="c-cell">${log.volgnummer}</div>
        <td class="c-cell">${log.actiedatum}</div>
		<td class="c-cell">${value} ${meeteenheid}</div>
        <td class="c-cell">${icon}</div>
        </tr>`;
	}
	htmlTable.innerHTML = html;
};

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
const CallbackDeleteProgress = function (date) {
	let datum = String(date);
	console.log(datum);
	const url = `http://192.168.168.169:5000/api/v1/historiek/`;
	const body = JSON.stringify({
		datum: datum,
	});
	handleData(url, backToIndex, null, 'DELETE', body);
};

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
const getLogs = function () {
	const url = `${lanIP}/api/v1/logs/`;
	handleData(url, showLogs);
};

const getLogsFromDevice = function (deviceID) {
	const url = `${lanIP}/api/v1/logs/${deviceID}/`;
	specificDeviceID = deviceID;
	handleData(url, showSpecificLogs);
};

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
const ListenToDeviceIDPicker = function () {
	document
		.querySelector('.deviceID_picker')
		.addEventListener('change', function () {
			let deviceID = document.querySelector('.deviceID_picker').value;
			getLogsFromDevice(deviceID);
		});
};

const listenToMobileNav = function () {
	document.querySelector('.hamburger').addEventListener('click', function () {
		document.querySelector('.mobile-dropdown').classList.toggle('c-hidden');
	});
};

const ListenToDelete = function () {
	htmlDeletebtn.addEventListener('click', function () {
		console.log('delete pressed');
		var today = new Date();
		var date = '';
		if (today.getDate() < 10) {
			date =
				today.getFullYear() +
				'-0' +
				(today.getMonth() + 1) +
				'-0' +
				today.getDate();
		} else {
			date =
				today.getFullYear() +
				'-0' +
				(today.getMonth() + 1) +
				'-' +
				today.getDate();
		}
		CallbackDeleteProgress(date);
	});
};

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
	socketio.on('B2F_logs', function (data) {
		showHistoriek(data);
	});
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
	listenToMobileNav();
	if (document.querySelector('.log-page')) {
		console.log('getting logs...');
		htmlTable = document.querySelector('.js-table');
		htmlDeletebtn = document.querySelector('.js-clear-amount-today');
		getLogs();
		ListenToDelete();
		ListenToDeviceIDPicker();
	} else if (document.querySelector('.homepage')) {
		console.log('homepage');
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
	} else if (document.querySelector('.welcome')) {
		console.log('welcome');
		listenToContinue();
	}
};
document.addEventListener('DOMContentLoaded', init);
//#endregio
