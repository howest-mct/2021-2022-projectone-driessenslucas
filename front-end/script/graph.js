const lanIP = `${window.location.hostname}:5000`; //!!! PAS DIT AAN ZODAT DIT dynamisch wordt !!!
// !!
const socketio = io(lanIP);

let CoffeeData = [];
let weightData = [];
let WeightLabels = [];
let CoffeeLabels = [];
let CoffeeChart;
let htmlShutdown;
let htmlHamburger;
let weightChart;
let weekIndex = 0;

const createWeightChart = function () {
	const labels = WeightLabels;
	const data = {
		labels: labels,
		datasets: [
			{
				label: 'Weight in grams',
				data: weightData,
				backgroundColor: '#357560',
				borderColor: '#357560',
			},
		],
	};

	const config = {
		type: 'line',
		data: data,
		options: {
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: false,
				},
			},
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
					labels: {
						font: { size: 14, family: "'Titillium Web', 'sans-serif'" },
					},
				},
				title: {
					display: true,
					text: 'Weight of coffee pot per week',
				},
			},
		},
	};

	const ctx = document.querySelector('.coffee-weight');
	weightChart = new Chart(ctx, config);
};

const createCoffeeMadeChart = function () {
	const labels = CoffeeLabels;
	const data = {
		labels: labels,
		datasets: [
			{
				label: 'times coffee brewed',
				data: CoffeeData,
				backgroundColor: '#357560',
				borderColor: '#357560',
				barThickness: 25,
			},
		],
	};

	const config = {
		type: 'bar',
		data: data,
		options: {
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
				},
			},
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
					labels: {
						font: { size: 14, family: "'Titillium Web', 'sans-serif'" },
					},
				},
				title: {
					display: true,
					text: 'coffee made per day in a week',
				},
			},
		},
	};

	const ctx = document.querySelector('.coffee-made');
	CoffeeChart = new Chart(ctx, config);
};

const updateHamburger = function () {
	if (
		document.querySelector('.mobile-dropdown').classList.contains('c-hidden')
	) {
		htmlHamburger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
		<g id="navbar_mobile" transform="translate(-745 -78.284)">
		  <rect id="rectangle" width="34" height="34" transform="translate(745 78.284)" fill="none"/>
		  <path id="path" d="M3,23.142H28.713V20.285H3v2.857ZM3,16H28.713V13.142H3V16ZM3,6V8.857H28.713V6Z" transform="translate(746.286 80.571)" fill="#3b4727" fill-rule="evenodd"/>
		</g>
	  </svg>
	  
	  `;
	} else {
		htmlHamburger.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="33.793" height="33.793" viewBox="0 0 33.793 33.793">
		<path id="close_FILL0_wght400_GRAD0_opsz48" d="M12.949,44.143l-2.6-2.6,14.3-14.3-14.3-14.3,2.6-2.6,14.3,14.3,14.3-14.3,2.6,2.6-14.3,14.3,14.3,14.3-2.6,2.6-14.3-14.3Z" transform="translate(-10.35 -10.35)" fill="#3b4727"/>
	  </svg>
	`;
	}
};

const updateCoffeMade = function (data) {
	for (const log of data) {
		CoffeeData.push(log['Waarde']);
		CoffeeLabels.push(log['day']);
	}
	// console.log(CoffeeData);
	CoffeeChart.update();
};
const updateWeightData = function (data) {
	for (const log of data) {
		if (log['Waarde'] > 0) {
			weightData.push(log['Waarde']);
			WeightLabels.push(log['day']);
		}
	}
	// console.log(weightData);
	weightChart.update();
};

const getData = function () {
	socketio.emit('F2B_getWeightLogs', { weeknr: 0 });
	socketio.emit('F2B_getCoffeeLogs', { weeknr: 0 });
};
const listenToMobileNav = function () {
	document.querySelector('.hamburger').addEventListener('click', function () {
		document.querySelector('.mobile-dropdown').classList.toggle('c-hidden');
		updateHamburger();
	});
};
const listenToBtn = function () {
	document
		.querySelector('.js-prev-week-btn')
		.addEventListener('click', function () {
			weekIndex++;
			socketio.emit('F2B_getWeightLogs', { weeknr: weekIndex });
			socketio.emit('F2B_getCoffeeLogs', { weeknr: weekIndex });
		});
	document
		.querySelector('.js-next-week-btn')
		.addEventListener('click', function () {
			weekIndex--;
			socketio.emit('F2B_getWeightLogs', { weeknr: weekIndex });
			socketio.emit('F2B_getCoffeeLogs', { weeknr: weekIndex });
		});
	document
		.querySelector('.js-current-week-btn')
		.addEventListener('click', function () {
			weightData.length = 0;
			WeightLabels.length = 0;
			CoffeeData.length = 0;
			CoffeeLabels.length = 0;
			weekIndex = 0;
			socketio.emit('F2B_getWeightLogs', { weeknr: weekIndex });
			socketio.emit('F2B_getCoffeeLogs', { weeknr: weekIndex });
		});
};

socketio.on('B2F_coffeeLogs', function (data) {
	weightData.length = 0;
	WeightLabels.length = 0;
	CoffeeData.length = 0;
	CoffeeLabels.length = 0;
	updateCoffeMade(data.coffee_logs);
});
socketio.on('B2F_weightLogs', function (data) {
	weightData.length = 0;
	WeightLabels.length = 0;
	CoffeeData.length = 0;
	CoffeeLabels.length = 0;
	updateWeightData(data.weight_logs);
});

const listenToShutDown2 = function () {
	htmlShutdown.addEventListener('click', function () {
		console.log('shutting down');
		socketio.emit('F2B_shutdown');
	});
	document
		.querySelector('.js-shutdown_mobile')
		.addEventListener('click', function () {
			console.log('shutting down');
			socketio.emit('F2B_shutdown');
		});
};

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
	htmlHamburger = document.querySelector('.hamburger');
	createCoffeeMadeChart();
	createWeightChart();
	getData();
	listenToMobileNav();
	listenToBtn();

	htmlShutdown = document.querySelector('.js-shutdown');
	listenToShutDown2();
};
document.addEventListener('DOMContentLoaded', init);
//#endregio
