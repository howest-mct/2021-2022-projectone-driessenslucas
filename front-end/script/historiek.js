const lanIP = `${window.location.hostname}:5000`;


// #region ***  Callback-Visualisation - show___         ***********


const showHistoriek = function (jsonObject) {
	console.log(jsonObject);
  let html = '';
	for (let log of jsonObject.historiek) {
		html += `<tr class="c-row">
        <td class="c-cell">${log.deviceID}</div>
        <td class="c-cell">${log.actiedatum}</div>
        <td class="c-cell">${log.Waarde}</div>
        </tr>`;
	}
	htmlTable.innerHTML = html;

};
// #endregion

// #region ***  Data Access - get___                     ***********

const gethistoriek = function () {
	const url = `http://192.168.168.169:5000/api/v1/historiek/`;
	handleData(url, showHistoriek, null, 'GET', null);
};
// #endregion


// #region ***  Init / DOMContentLoaded                  ***********
const init = function () {
  htmlTable = document.querySelector('.js-table');
  console.log('hello')
  
  gethistoriek();
};

document.addEventListener('DOMContentLoaded', init);
// #endregion