let notification_box = document.querySelector("#notify");
let unread_notifications_number = document.querySelector(".unread-notifications-number");


let NOTIFICATIONTEMPLATE = `<div class="row single-notification-box unread">
<div class="col-1 profile-picture">
        <img class="rounded-circle" src="http://127.0.0.1:5501/wwwroot/Images/{{IMAGE}}" alt="profile picture"
        class="img-fluid" style="width: 55px; height: 55px;">
</div>
        <div class="col-11 notification-text" id="id{{ID4}}">
            <div style="display: flex;justify-content: space-between;">
                <p>
                    <a href="#" class="name">{{USER-NAME}}</a>
                    <span class="description">has sent you a request</span>
                    <a class="link group" href="http://">{{ROLE}}</a>
                    <span class="unread-symbol">•</span>
                </p>
                <small style="color: #009CFF;cursor: pointer;"
                id="show-message" onclick="displayRequest({{ID3}})">Expand</small>
                </div>
                <div style="display: flex;justify-content: space-between;align-items: baseline;">
                <p class="time">{{REQUEST-TIME}}</p>
                <small class="time">{{CREATED-TIME}}</small>
                <small class="status">{{APPROVAL-STATUS}}</small>
                    <div style="display: flex;gap: 10px;">
                        <button type="button" class="btn btn-success" id="id{{ID}}" onclick="ApproveRequest({{ID5}})">Approve</button>
                        <button type="button" class="btn btn-danger" id="id{{ID2}}" onclick="Reject({{ID6}})">Reject</button>
                    </div>
            </div>
            <div hidden>
        
            </div>                      
        </div>
</div>`

let NOTIFICATIONREQUESTTEMPLATE = `<div class="private-message">
<ol type="A">
<li>NAME: {{RAWMATERIAL-NAME}}</li>
<li>QUANTITY: {{RAWMATERIAL-QUANTITY}}</li>
<li>COST: {{RAWMATERIAL-COST}}</li>
<li>ADDITIONAL MESSAGE: {{RAWMATERIAL-ADDITIONAL-MESSAGE}}</li>
</ol>
</div>
<small style="color: #009CFF;cursor: pointer;"
 `;

let displayRequest = (id) => {
    let notification_message = document.querySelector("#id" + id);
    fetch(`https://localhost:5001/api/RawMaterial/GetRawAsync/${id}`)
        .then(res => res.json())
        .then(async function (response) {
            // let col = document.querySelector('#show-message')
            // col.innerText = ""
            // col.addEventListener('click', notificationPage)
            // notification_message.innerHTML = "";
            let nm = NOTIFICATIONREQUESTTEMPLATE
                .replace('{{RAWMATERIAL-NAME}}', response.data.name)
                .replace('{{RAWMATERIAL-QUANTITY}}', response.data.quantiityBought)
                .replace('{{RAWMATERIAL-COST}}', response.data.cost)
                .replace('{{RAWMATERIAL-ADDITIONAL-MESSAGE}}', response.data.additionalMessage)
            notification_message.lastElementChild.innerHTML = nm;
            notification_message.lastElementChild.toggleAttribute("hidden")
        })
}
async function displayNotificationMessage() {

    let notification = await fetch('https://localhost:5001/api/RawMaterial/GetAllRawMaterials')
    return notification.json();

}

async function notificationPage() {
    let request = await displayNotificationMessage();
    let unread_numbers = request.data.filter(x => x.enumApprovalStatus == 2)
    unread_notifications_number.innerText = unread_numbers.length
    notification_box.innerHTML = "";
    request.data.forEach(x => {

        // let manager = response.data[0];
        let n = NOTIFICATIONTEMPLATE
            .replace('{{IMAGE}}', x.managerImage)
            .replace('{{USER-NAME}}', x.managerName)
            .replace('{{ROLE}}', "Ware house manager")
            .replace('{{REQUEST-TIME}}', x.postedTime)
            .replace('{{ID3}}', x.id)
            .replace('{{ID}}', x.id)
            .replace('{{ID2}}', x.id)
            .replace('{{ID4}}', x.id)
            .replace('{{ID6}}', x.id)
            .replace('{{ID5}}', x.id)
            .replace('{{CREATED-TIME}}', x.createdTime)
            .replace('{{APPROVAL-STATUS}}', x.stringApprovalStatus)

        notification_box.innerHTML += n
        let ide = x.id
        if (x.enumApprovalStatus == 1 || x.enumApprovalStatus == 3) {
            document.querySelectorAll("#id" + ide).forEach(x => {
                x.disabled = true;
            })
        }
    })
}

function Reject(id) {


    swal({
        title: "An input!",
        text: "Give a reason to the Manager",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "Write something"
    },
        function (inputValue) {
            if (inputValue === null) return false;

            if (inputValue === "") {
                swal.showInputError("You need to write something!");
                return false
            }
            const message = {
                message: inputValue
            }
            const options = {
                method: 'PUT',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            fetch(`https://localhost:5001/api/RawMaterial/RejectRawMaterial/${id}`, options)
                .then(res => res.json())
                .then(function (res) {
                    if (res.success == true) {
                        swal("Successfully Rejected", "You've successfully rejected the request", "success");
                        notificationPage();
                    }
                    else {
                        // window.alert(res.message);
                    }
                })
        });
}

let ApproveRequest = (id) => {

    const options = {
        method: 'PUT',
        body: null,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch(`https://localhost:5001/api/RawMaterial/ApproveRawMaterial/${id}`, options)
        .then(res => res.json())
        .then(function (response) {
            if (response.success == true) {
                swal("Approved!", "You've Approved the request", "success");
                notificationPage();
            }
            else if (response.success == false) {
                swal("Opps!", `${response.message}`, "warning");
            }
        })
}

let expenses = [];

fetch('https://localhost:5001/api/RawMaterial/GetAllRawMaterials')
    .then(res => res.json())
    .then(data => expenses.push(...data.data));

function findMatches(wordToMatch, expenses) {
    return expenses.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.createdTime.match(regex) || x.postedTime.match(regex) || x.name.match(regex) || x.stringApprovalStatus.match(regex);
    })
}

function displayMatches() {
    const matchObj = findMatches(this.value, expenses);
    const html = matchObj.map(x => {

        let ht = `

<div class="row single-notification-box unread">
<div class="col-1 profile-picture">
        <img class="rounded-circle" src="http://127.0.0.1:5501/wwwroot/Images/${x.managerImage}" alt="profile picture"
        class="img-fluid" style="width: 55px; height: 55px;">
</div>
        <div class="col-11 notification-text" id="id${x.id}">
            <div style="display: flex;justify-content: space-between;">
                <p>
                    <a href="#" class="name">${x.managerName}</a>
                    <span class="description">has sent you a request</span>
                    <a class="link group" href="http://">Ware House Manager</a>
                    <span class="unread-symbol">•</span>
                </p>
                <small style="color: #009CFF;cursor: pointer;"
                id="show-message" onclick="displayRequest(${x.id})">Expand</small>
                </div>
                <div style="display: flex;justify-content: space-between;align-items: baseline;">
                <p class="time">${x.postedTime}</p>
                <small class="time">${x.createdTime}</small>
                <small class="status">${x.stringApprovalStatus}</small>
                    <div style="display: flex;gap: 10px;">
                        <button type="button" class="btn btn-success" id="id${x.id}" onclick="ApproveRequest(${x.id})">Approve</button>
                        <button type="button" class="btn btn-danger" id="id${x.id}" onclick="Reject(${x.id})">Reject</button>
                    </div>
            </div> 
            <div hidden>
        
            </div>                                      
        </div>
</div>`
        return ht
    }).join('')
    if (searchInput.value == '') {
        notificationPage();
    }
    else {
        notification_box.innerHTML = html;
        disabledbutton();
    }
}
const searchInput = document.querySelector('#search');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);


function disabledbutton() {
    let but = document.querySelectorAll('.status');
    but.forEach(x => {
        console.log(x.innerText)
        if (x.innerText == "Rejected" || x.innerText == "Approved") {
            x.nextElementSibling.children[0].disabled = true
            x.nextElementSibling.children[1].disabled = true
        }
    })
}

notificationPage()