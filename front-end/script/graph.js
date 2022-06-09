const lanIP = `${window.location.hostname}:5000`; //!!! PAS DIT AAN ZODAT DIT dynamisch wordt !!!
// !!
const socketio = io(lanIP);

let CoffeeData = [];
let weightData = [];
let WeightLabels = [];
let CoffeeLabels = [];

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
	const myChart = new Chart(ctx, config);
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
	const myChart = new Chart(ctx, config);
};

const updateCoffeMade = function (data) {
	console.log(data);
	for (const log of data) {
		CoffeeData.push(log['Waarde']);
		CoffeeLabels.push(log['day']);
	}
	createCoffeeMadeChart();
};
const updateWeightData = function (data) {
	for (const log of data) {
		if (log['Waarde'] > 0) {
			weightData.push(log['Waarde']);
			WeightLabels.push(log['day']);
		}
	}
	createWeightChart();
};

const getData = function () {
	socketio.emit('F2B_getWeightLogs', { weeknr: 0 });
	socketio.emit('F2B_getCoffeeLogs', { weeknr: 0 });
};
socketio.on('B2F_coffeeLogs', function (data) {
	console.log(data);
	updateCoffeMade(data.coffee_logs);
});
socketio.on('B2F_weightLogs', function (data) {
	updateWeightData(data.weight_logs);
});

//#region ***  Init / DOMContentLoaded                  ***********
const init = function () {
	getData();
};
document.addEventListener('DOMContentLoaded', init);
//#endregio
