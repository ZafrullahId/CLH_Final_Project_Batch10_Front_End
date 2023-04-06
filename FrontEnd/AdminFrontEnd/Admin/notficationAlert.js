let aler = document.querySelector('#notification-alert');
async function displayNotificationAlert() {

    let notification = await fetch('https://localhost:5001/api/RawMaterial/GetAllPendingRawMaterial')
   .then(res => res.json())
   .then(function (response) {
    
    if (response.data.length > 0) {
        aler.innerHTML += `<div 
        class="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" style="margin-right: 99px !important;margin-bottom: 10px !important;background-color: red !important;">
    </div>`
    }
   })
}
displayNotificationAlert()