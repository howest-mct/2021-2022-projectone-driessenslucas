const lanIP = `${window.location.hostname}:5000`; //!!! PAS DIT AAN ZODAT DIT dynamisch wordt !!!
// !!
const socketio = io(lanIP);

let CoffeeData = [];
let weightData = [];
let WeightLabels = [];
let CoffeeLabels = [];
let CoffeeChart;
let weightChart;

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
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: 'Weight of coffee pot this week',
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
				label: 'coffee made',
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
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: 'coffee made per day this week',
				},
			},
		},
	};

	const ctx = document.querySelector('.coffee-made');
	CoffeeChart = new Chart(ctx, config);
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
	});
};
const listenToBtn = function () {
	document
		.querySelector('.js-prev-week-btn')
		.addEventListener('click', function () {
			weightData.length = 0;
			WeightLabels.length = 0;
			CoffeeData.length = 0;
			CoffeeLabels.length = 0;
			socketio.emit('F2B_getWeightLogs', { weeknr: 1 });
			socketio.emit('F2B_getCoffeeLogs', { weeknr: 1 });
		});
	document
		.querySelector('.js-next-week-btn')
		.addEventListener('click', function () {
			socketio.emit('F2B_getWeightLogs', { weeknr: 0 });
			socketio.emit('F2B_getCoffeeLogs', { weeknr: 0 });
		});
};

socketio.on('B2F_coffeeLogs', function (data) {
	updateCoffeMade(data.coffee_logs);
});
socketio.on('B2F_weightLogs', function (data) {
	updateWeightData(data.weight_logs);
});

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
	createCoffeeMadeChart();
	createWeightChart();
	getData();
	listenToMobileNav();
	listenToBtn();
};
document.addEventListener('DOMContentLoaded', init);
//#endregio
