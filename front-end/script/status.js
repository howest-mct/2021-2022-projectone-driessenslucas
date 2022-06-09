const lanIP = `${window.location.hostname}:5000`; //!!! PAS DIT AAN ZODAT DIT dynamisch wordt !!!
// !!
const socketio = io(lanIP);

let data1 = [];
let data2 = [];
let LabelsArr = [];

const createChart = function () {
	const labels = LabelsArr;
	const data = {
		labels: labels,
		datasets: [
			{
				label: 'Weight pot',
				data: data2,
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
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

	const ctx = document.getElementById('myChart');
	const myChart = new Chart(ctx, config);
};

const updateCoffeMade = function (data) {
	console.log(data);
	for (const log of data) {
		data1.push(log['Waarde']);
	}
	createChart();
};
const updateWeightData = function (data) {
	console.log(data);
	for (const log of data) {
		if (log['Waarde'] > 0) {
			data2.push(log['Waarde']);
			LabelsArr.push(log['day']);
		}
	}
	console.log(data2);
};

const getData = function () {
	socketio.emit('F2B_getWeightLogs', { weeknr: 0 });
	socketio.emit('F2B_getCoffeeLogs', { weeknr: 0 });
};
socketio.on('B2F_coffeeLogs', function (data) {
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
