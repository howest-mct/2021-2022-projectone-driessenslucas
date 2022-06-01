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
		let icon = '';
		if(log.deviceID == 1){
			icon = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20">
			<g id="water_drop_black_24dp" transform="translate(0 -0.238)">
			  <rect id="Rectangle_3" data-name="Rectangle 3" width="21" height="20" transform="translate(0 0.238)" fill="none"/>
			  <path id="Path_5" data-name="Path 5" d="M10.647,2Q4,7.671,4,11.8a6.649,6.649,0,1,0,13.294,0Q17.294,7.667,10.647,2ZM7.182,11.971a.624.624,0,0,1,.615.515,2.815,2.815,0,0,0,3.024,2.385.624.624,0,1,1,.058,1.246,4.049,4.049,0,0,1-4.312-3.423A.624.624,0,0,1,7.182,11.971Z" transform="translate(-0.676 -0.338)"/>
			</g>
		  </svg>
		  `;
		}
		else if (log.deviceID == 2){
			icon = `<svg id="thermostat_black_24dp" xmlns="http://www.w3.org/2000/svg" width="20.636" height="20.636" viewBox="0 0 20.636 20.636">
			<g id="Group_8" data-name="Group 8">
			  <path id="Path_6" data-name="Path 6" d="M0,0H20.636V20.636H0Z" fill="none"/>
			</g>
			<g id="Group_9" data-name="Group 9" transform="translate(6.019 1.72)">
			  <path id="Path_7" data-name="Path 7" d="M13.879,11.458V4.58a2.58,2.58,0,1,0-5.159,0v6.879a4.3,4.3,0,1,0,5.159,0Zm-3.439-1.72V4.58a.86.86,0,1,1,1.72,0v.86H11.3V6.3h.86v1.72H11.3v.86h.86v.86Z" transform="translate(-7 -2)"/>
			</g>
		  </svg>
		  `;
		}
		else if (log.deviceID == 3){
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
		}
		else{
			icon = log.deviceID;
		}
		html += `=
		<tr class="c-row">
        <td class="c-cell">${log.volgnummer}</div>
        <td class="c-cell">${log.actiedatum}</div>
		<td class="c-cell">${log.Waarde}</div>
        <td class="c-cell">${icon}</div>
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
	handleData(url, showHistoriek);
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