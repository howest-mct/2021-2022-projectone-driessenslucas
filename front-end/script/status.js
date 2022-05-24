
const showStatus = function(jsonObject){
    console.log(jsonObject)
    
    for (const status of jsonObject.status) {
        console.log(status)
        console.log(status.deviceID)
        if (htmlWls.getAttribute('data-id') == status.deviceID){
            htmlWls.innerHTML = `<p>water level sensor status: ${status.status} </p>`
        }
        else if (htmlTemp.getAttribute('data-id') == status.deviceID){
            htmlTemp.innerHTML = `<p>temperatuur status: ${status.status} </p>`
        }
        else if (htmlFsr.getAttribute('data-id') == status.deviceID){
            htmlFsr.innerHTML = `<p>fsr status: ${status.status} </p>`
        }
    }
}


// #region ***  Data Access - get___                     ***********
const getStatus = function () {
	const url = `http://192.168.168.169:5000/api/v1/status/`;
	handleData(url, showStatus);
};

// #endregion

// #region ***  Init / DOMContentLoaded                  ***********
const init = function () {
    htmlTemp = document.querySelector('.js-temp')
    htmlFsr = document.querySelector('.js-fsr')
    htmlWls = document.querySelector('.js-wls')
    
    console.log('hello')
    
    getStatus();
  };
  
  document.addEventListener('DOMContentLoaded', init);
  // #endregion