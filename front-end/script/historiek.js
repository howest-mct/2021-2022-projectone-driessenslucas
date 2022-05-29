const lanIP = `${window.location.hostname}:5000`;


// #region ***  Callback-Visualisation - show___         ***********
const backToIndex = function () {
	window.location.href = './historiek.html';
};



const showHistoriek = function (jsonObject) {
	console.log(jsonObject);
	let html = '';
	html += `<tr class="c-row js-header">
	<th>volgnr</th>
	<th>datum</th>
	<th>waarde</th>
	<th>deviceid</th>
	<th>actieid</th>
	<th>status</th>
	  </tr>`
	for (let log of jsonObject.historiek) {
		
		html += `
		
		<tr class="c-row">
        <td class="c-cell">${log.volgnummer}</div>
        <td class="c-cell">${log.actiedatum}</div>
		<td class="c-cell">${log.Waarde}</div>
        <td class="c-cell">${log.deviceID}</div>
		<td class="c-cell">${log.actieID}</div>
		<td class="c-cell">${log.status}</div>

        </tr>`;
	}
	htmlTable.innerHTML = html;

};
// #endregion

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

//#endregion

// #region ***  Data Access - get___                     ***********

const gethistoriek = function () {
	const url = `http://192.168.168.169:5000/api/v1/historiek/`;
	handleData(url, showHistoriek, null, 'GET', null);
};
// #endregion

//#region ***  Event Listeners - listenTo___            ***********


const ListenToDelete = function () {
	htmlDeletebtn.addEventListener('click', function () {
		console.log('delete pressed');
		var today = new Date();
		var date =
			today.getFullYear() +
			'-0' +
			(today.getMonth() + 1) +
			'-' +
			today.getDate();
		CallbackDeleteProgress(date);
	});
};

//#endregion


// #region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  htmlTable = document.querySelector('.js-table');
  htmlDeletebtn = document.querySelector('.js-clear-amount-today');
  console.log('hello')
  ListenToDelete();
  gethistoriek();
};

document.addEventListener('DOMContentLoaded', init);
// #endregion