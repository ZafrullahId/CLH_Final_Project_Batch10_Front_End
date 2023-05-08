let notifications = document.querySelector('#notify')
let number_of_unread_notifications = document.querySelector('.unread-notifications-number')
let showmyrequest = true
let NOTIFICATIONTEMPLATE = `<div class="row single-notification-box unread">
<div class="col-1 profile-picture">
    <img class="rounded-circle" src="http://127.0.0.1:5501/wwwroot/Images/{{IMAGE}}"
        alt="profile picture" class="img-fluid" style="width: 55px; height: 55px;">
</div>
<div class="col-11 notification-text" >
    <div style="display: flex;justify-content: space-between;">
        <p>
            <a href="#" class="name">{{USER-NAME}}</a>
            <span class="description">has sent you a request</span>
            <a class="link group" href="http://">{{ROLE}}</a>
            <span class="unread-symbol">•</span>
        </p>
        <small style="color: #009CFF;cursor: pointer;" id="show-message"
            onclick="displayRequest({{ID}})"><i class="fa fa-eye" aria-hidden="true" style="cursor: pointer;"></i></small>
    </div>
    <div
        style="display: flex;justify-content: space-between;align-items: baseline;">
        <p class="time">{{REQUEST-TIME}}</p>
        <small class="time">{{CREATED-TIME}}</small>
        <small class="status">{{APPROVAL-STATUS}}</small>
        <div style="display: flex;gap: 10px;">
            <button type="button" class="btn btn-success"
                onclick="ApproveRequest(this.value)" value="{{ID}}">Approve</button>
            <button type="button" class="btn btn-danger"
                onclick="Reject(this.value)" value="{{ID}}">Reject</button>
        </div>
    </div>
    <div id="id{{ID}}">

    </div>
</div>
</div>`

let REQUEST = `<div class="private-message" hidden id="ids{{ID}}">
<ol type="A">
<li>QUANTITY REQUESTED: {{PRODUCTION-QUANTITY-REQUEST}} turns</li>
<li>PRODUCTION QUANTITY: {{PRODUCTION-QUANTITY}}</li>
<h6 style="font-size: 14px !important;font-weight: 20 !important;">RAWMATERIALS REQUESTED</h6>
<div id="dis{{ID}}">
<ul>

</ul>
</div>
<li>ADDITIONAL MESSAGE: {{PRODUCTION-REQUEST-ADDITIONAL-MESSAGE}}</li>
</ol>
</div>`

let RAWMATERIALS = `<li>{{RAWMATERIAL}}</li>`

let displayNotification = () => {
    showmyrequest = true
    fetch(`https://localhost:5001/api/Production/GetAllProductions`)
        .then(res => res.json())
        .then(function (response) {
            notifications.innerHTML = ""
            unread_notification_number = response.data.filter(x => x.approvalStatus == "Pending").length
            number_of_unread_notifications.innerText = unread_notification_number
            response.data.forEach(e => {
                let notify = NOTIFICATIONTEMPLATE
                    .replace('{{IMAGE}}', e.admin.image)
                    .replace('{{USER-NAME}}', e.admin.userName)
                    .replace('{{ROLE}}', "Production Manager")
                    .replace('{{REQUEST-TIME}}', e.postedTime)
                    .replace('{{CREATED-TIME}}', e.createdTime)
                    .replace('{{APPROVAL-STATUS}}', e.approvalStatus)
                    .replaceAll('{{ID}}', e.productionId)
                notifications.innerHTML += notify
                disabledbutton()

            });
        })
}

async function displayRequest(id) {
    let notification_message = document.querySelector(`#id${id}`);
    await fetch(`https://localhost:5001/api/Production/GetProduction/${id}`)
        .then(res => res.json())
        .then(function (response) {
            let request = REQUEST
                .replace('{{PRODUCTION-QUANTITY-REQUEST}}', response.data.quantityRequest)
                .replace('{{PRODUCTION-QUANTITY}}', response.data.quantityProduced)
                .replace('{{PRODUCTION-REQUEST-ADDITIONAL-MESSAGE}}', response.data.additionalMessage)
                .replaceAll('{{ID}}', id)
            notification_message.innerHTML += request

            let rawmaterials = document.querySelector(`#dis${id}`)
            rawmaterials.children[0].innerHTML = ""
            response.data.rawMaterialDto.forEach(x => {
                rawmaterials.children[0].innerHTML += `<li style="text-transform: capitalize;">${x.name}</li>`
            })

            document.getElementById(`ids${id}`).toggleAttribute("hidden")
        })
}

function disabledbutton() {
    let but = document.querySelectorAll('.status');
    but.forEach(x => {
        if (x.innerText == "Rejected" || x.innerText == "Approved") {
            x.nextElementSibling.children[0].disabled = true
            x.nextElementSibling.children[1].disabled = true
        }
    })
}

function requestForm() {
    let form = document.createElement("div")
    form.innerHTML = `<div class="">
  <form action="" id="request-form">
      <div class="form_wrap">
          <div class="form_item">
              <input type="text" name="name" id="name" required class="form-control" placeholder="Raw Material Name">
          </div>
      </div>
      </br>
      <div class="form_wrap">
          <div class="form_item">
              <input type="number" name="quantiityBought" min="0" id="quantiityBought" required class="form-control" placeholder="Quantity in tonns">

          </div>
      </div>
      </br>
      <div class="form_wrap">
          <div class="form_item">
          <div style="display: flex;">
               <span class="input-group-text" id="basic-addon1" style="border-radius: 5px 0px 0px 5px;">₦</span>
               <input type="number" name="cost" min="0" id="cost" required class="form-control" placeholder="Total Cost" style="border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;">
               </div>
          </div>
          </div>
      </div>
      </br>
      <div class="form_wrap">
          <div class="form_item">
              <textarea name="additionalMessage" id="additionalMessage" class="form-control" cols="30" rows="5" placeholder="Additional Info"></textarea>
          </div>
      </div>
  </form>
</div>`
    swal({
        title: 'Request Form',
        text: null,
        buttons: true,
        closeModal: false,
        content: form,
        buttons: {
            cancel: "Cancel",
            catch: {
                text: "Submit",
            },
        }
    }).then(function (isConfirm) {
        if (isConfirm == "catch") {
            const id = localStorage.getItem("Id")
            const request_form = document.querySelector('#request-form')
            let sendForm = new FormData(request_form)
            console.log(sendForm.get("name"))
            fetch(`https://localhost:5001/api/RawMaterial/CreateRawMaterial/${id}`,
                {
                    method: "POST",
                    body: sendForm,

                })
                .then((res) => {
                    console.log(res);
                    return res.json();
                })
                .then(function (value) {
                    console.log(value.success);
                    if (value.success == true) {
                        Swal.fire("", `Request Sent`, "success");
                    }
                    else {
                        Swal.fire("Opps!", `Something went wrong`, "warning");
                    }

                })
                .catch((res) => {
                    window.alert(res.message)


                })
        }
    }
    );

}



let ApproveRequest = (id) => {
    const options = {
        method: 'PUT',
        body: null,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch(`https://localhost:5001/api/Production/ApproveProduction/${id}`, options)
        .then(res => res.json())
        .then(function (response) {
            if (response.success == true) {
                swal("Approved!", "You've Approved the request", "success");
                displayNotification();
            }
            else if (response.success == false) {
                swal("Opps!", `${response.message}`, "warning");
                // window.alert(response.message)
            }
        })
}
let Reject = (id) => {
    
    Swal.fire({
        title: "An input!",
        text: "Give a reason to the Manager",
        input: 'text',
        showCancelButton: true
    }).then((result) => {
        if (result.value == null) {
            return false
        }
        if (result.value === "") {
            swal.showInputError("You need to write something!");
            return false
        }
        if (result.value) {
            console.log("Result: " + result.value);

            const message = {
                message: result.value
            }
            const options = {
                method: 'PUT',
                body: JSON.stringify(message),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            fetch(`https://localhost:5001/api/Production/RejectProduction/${id}`, options)
                .then(res => res.json())
                .then(function (res) {
                    if (res.success == true) {
                        swal("Successfully Rejected", "You've successfully rejected the request", "success");
                        displayNotification();
                    }
                    else {
                        window.alert(res.message);
                    }
                })
        }
    });
}


let production = [];

fetch('https://localhost:5001/api/Production/GetAllProductions')
    .then(res => res.json())
    .then(data => production.push(...data.data));

function findMatches(wordToMatch, production) {
    return production.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.createdTime.match(regex) || x.postedTime.match(regex) || x.approvalStatus.match(regex);
    })
}

function displayMatches() {
    const matchObj = findMatches(this.value, production);
    const html = matchObj.map(x => {

        let ht = `<div class="row single-notification-box unread">
                <div class="col-1 profile-picture">
                    <img class="rounded-circle" src="http://127.0.0.1:5501/wwwroot/Images/${x.admin.image}"
                        alt="profile picture" class="img-fluid" style="width: 55px; height: 55px;">
                </div>
                <div class="col-11 notification-text" >
                    <div style="display: flex;justify-content: space-between;">
                        <p>
                            <a href="#" class="name">${x.admin.userName}</a>
                            <span class="description">has sent you a request</span>
                            <a class="link group" href="http://">Production Manager</a>
                            <span class="unread-symbol">•</span>
                        </p>
                        <small style="color: #009CFF;cursor: pointer;" id="show-message"
                            onclick="displayRequest(${x.productionId})"><i class="fa fa-eye" aria-hidden="true" style="cursor: pointer;"></i></small>
                    </div>
                    <div
                        style="display: flex;justify-content: space-between;align-items: baseline;">
                        <p class="time">${x.postedTime}</p>
                        <small class="time">${x.createdTime}</small>
                        <small class="status">${x.approvalStatus}</small>
                        <div style="display: flex;gap: 10px;">
                            <button type="button" class="btn btn-success"
                                onclick="ApproveRequest(this.value)" value="${x.productionId}">Approve</button>
                            <button type="button" class="btn btn-danger"
                                onclick="Reject(this.value)" value="${x.productionId}">Reject</button>
                        </div>
                    </div>
                    <div id="id${x.productionId}">
                
                    </div>
                </div>
                </div>`
        return ht
    }).join('')

    notifications.innerHTML = html;
    disabledbutton()
}
const searchInput = document.querySelector('#search');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

displayNotification()

// My Request Start

let MYREQUESTTEMPLATE = `<div class="row single-notification-box unread">
<div class="col-1 profile-picture">
    <img class="rounded-circle" src="http://127.0.0.1:5501/wwwroot/Images/{{IMAGE}}"
        alt="profile picture" class="img-fluid" style="width: 55px; height: 55px;">
</div>
<div class="col-11 notification-text" >
    <div style="display: flex;justify-content: space-between;">
        <p>
            <a href="#" class="name">{{USER-NAME}}</a>
            <span class="description">you sent a request to the</span>
            <a class="link group" href="http://">{{ROLE}}</a>
            <span class="unread-symbol">•</span>
        </p>
        <small style="color: #009CFF;cursor: pointer;" id="show-message" 
            onclick="displayMyRequestMessage({{ID}})"><i class="fa fa-eye" aria-hidden="true" style="cursor: pointer;"></i></small>
    </div>
    <div
        style="display: flex;justify-content: space-around;align-items: baseline;" id="{{STATE}}">
        <p class="time">{{REQUEST-TIME}}</p>
        <small class="time">{{CREATED-TIME}}</small>
        <small><i class="fa {{ICON}}" aria-hidden="true" style="cursor: pointer;color: {{COLOR}}"></i></small>
        <small class="status">{{APPROVAL-STATUS}}</small>
    </div>
    <div id="id{{ID}}" hidden >

    </div>
</div>
</div>`

function toggleInnerHtml(id) {
    console.log(showmyrequest)
    var btn = document.querySelector(`#${id}`)
    btn.addEventListener('click',
        function () { showmyrequest ? displayMyRequest() : displayNotification() })
}

async function displayMyRequest() {
    showmyrequest = false
    await fetch(`https://localhost:5001/api/RawMaterial/GetAllRawMaterials`)
        .then(res => res.json())
        .then(function (response) {
            notifications.innerHTML = ""
            response.data.forEach(x => {
                if (x.enumApprovalStatus == 1) {

                    let myrequest = MYREQUESTTEMPLATE
                        .replace('{{IMAGE}}', x.managerImage)
                        .replace('{{USER-NAME}}', x.managerName)
                        .replace('{{ROLE}}', "Admin")
                        .replace('{{REQUEST-TIME}}', x.postedTime)
                        .replace('{{CREATED-TIME}}', x.createdTime)
                        .replace('{{APPROVAL-STATUS}}', x.stringApprovalStatus)
                        .replace('{{ICON}}', "fa-check")
                        .replace('{{COLOR}}', "green")
                        .replaceAll('{{ID}}', x.id)
                        .replaceAll('{{STATE}}', x.stringApprovalStatus)
                    notifications.innerHTML += myrequest
                }
                else if (x.enumApprovalStatus == 2) {
                    let myrequest = MYREQUESTTEMPLATE
                        .replace('{{IMAGE}}', x.managerImage)
                        .replace('{{USER-NAME}}', x.managerName)
                        .replace('{{ROLE}}', "Admin")
                        .replace('{{REQUEST-TIME}}', x.postedTime)
                        .replace('{{CREATED-TIME}}', x.createdTime)
                        .replace('{{APPROVAL-STATUS}}', x.stringApprovalStatus)
                        .replace('{{ICON}}', "fa-clock-o")
                        .replace('{{COLOR}}', "#009CFF")
                        .replaceAll('{{ID}}', x.id)
                        .replaceAll('{{STATE}}', x.stringApprovalStatus)
                    notifications.innerHTML += myrequest
                }
                else if (x.enumApprovalStatus == 3) {
                    let myrequest = MYREQUESTTEMPLATE
                        .replace('{{IMAGE}}', x.managerImage)
                        .replace('{{USER-NAME}}', x.managerName)
                        .replace('{{ROLE}}', "Admin")
                        .replace('{{REQUEST-TIME}}', x.postedTime)
                        .replace('{{CREATED-TIME}}', x.createdTime)
                        .replace('{{APPROVAL-STATUS}}', x.stringApprovalStatus)
                        .replace('{{ICON}}', "fa-ban")
                        .replace('{{COLOR}}', "red")
                        .replaceAll('{{ID}}', x.id)
                        .replaceAll('{{STATE}}', x.stringApprovalStatus)
                    notifications.innerHTML += myrequest
                }
            })
            // document.querySelectorAll('#Rejected, #Pending').forEach(x => {
            //     const node = document.createElement("input")
            //     node.type = "submit"
            //     node.value = "Update"
            //     node.classList = "btn btn-danger"
            //     node.style.fontSize = "12px"
            //     x.appendChild(node)
            //     console.log(x)
            // })
        })
}

let NOTIFICATIONREQUESTTEMPLATE = `<div class="private-message">
<ol type="A">
<li>NAME: {{RAWMATERIAL-NAME}}</li>
<li>QUANTITY: {{RAWMATERIAL-QUANTITY}}</li>
<li>COST: ₦{{RAWMATERIAL-COST}}</li>
<li>ADDITIONAL MESSAGE: {{RAWMATERIAL-ADDITIONAL-MESSAGE}}</li>
</ol>
</div>`


let displayMyRequestMessage = (id) => {
    let notification_message = document.querySelector("#id" + id);
    fetch(`https://localhost:5001/api/RawMaterial/GetRawAsync/${id}`)
        .then(res => res.json())
        .then(async function (response) {
            var btn1 = `<input type="submit" class="btn btn-success" value="Update" style="font-size: 12px;" name="" id="" onclick="updateRequest(${id})">`
            var btn2 = `<input type="submit" class="btn btn-danger" value="Delete" style="font-size: 12px;" name="" id="" onclick="deleteRequest(${id})">`
            const node = document.createElement("div")
            node.style.display = "flex"
            node.style.gap = "10px"
            node.innerHTML += btn1 + btn2

            notification_message.innerHTML = ""
            if (response.data.enumApprovalStatus == 3) {
                let nm = NOTIFICATIONREQUESTTEMPLATE
                    .replace('{{RAWMATERIAL-NAME}}', response.data.name)
                    .replace('{{RAWMATERIAL-QUANTITY}}', response.data.quantiityBought)
                    .replace('{{RAWMATERIAL-COST}}', response.data.cost)
                    .replace('{{RAWMATERIAL-ADDITIONAL-MESSAGE}}', response.data.additionalMessage)
                    .replace('ADDITIONAL MESSAGE', "REASON")
                    .replace('id', id)
                notification_message.innerHTML += nm;
                notification_message.appendChild(node)
            }
            else if (response.data.enumApprovalStatus == 2) {
                let nm = NOTIFICATIONREQUESTTEMPLATE
                    .replace('{{RAWMATERIAL-NAME}}', response.data.name)
                    .replace('{{RAWMATERIAL-QUANTITY}}', response.data.quantiityBought)
                    .replace('{{RAWMATERIAL-COST}}', response.data.cost)
                    .replace('{{RAWMATERIAL-ADDITIONAL-MESSAGE}}', response.data.additionalMessage)
                    .replace('id', id)
                notification_message.innerHTML += nm;
                notification_message.appendChild(node)
            }
            else {
                let nm = NOTIFICATIONREQUESTTEMPLATE
                    .replace('{{RAWMATERIAL-NAME}}', response.data.name)
                    .replace('{{RAWMATERIAL-QUANTITY}}', response.data.quantiityBought)
                    .replace('{{RAWMATERIAL-COST}}', response.data.cost)
                    .replace('{{RAWMATERIAL-ADDITIONAL-MESSAGE}}', response.data.additionalMessage)
                    .replace('id', id)
                notification_message.innerHTML += nm;
            }
            notification_message.toggleAttribute("hidden")
        })
}

function deleteRequest(id) {
    Swal.fire(

        {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
        .then((result) => {
            const options = {
                method: 'DELETE',
                body: null,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            if (result.isConfirmed) {
                fetch(`https://localhost:5001/api/RawMaterial/DeleteRequest/${id}`, options)
                    .then(res => res.json())
                    .then(function (response) {
                        if (response.success == true) {
                            Swal.fire("Request Deleted", "", "success");
                            displayMyRequest()
                        }
                        else {
                            Swal.fire("Opps!", `${response.message}`, "warning");
                        }

                    });
            }
        })
}

let updateRequest = (id) => {
    fetch(`https://localhost:5001/api/RawMaterial/GetRawAsync/${id}`)
        .then(res => res.json())
        .then(function (response) {
            let form = document.createElement("div")
            form.innerHTML = `<div class="">
  <form action="" id="update-request-form">
      <div class="form_wrap">
          <div class="form_item">
              <input type="text" name="name" id="name" value="${response.data.name}" required class="form-control" placeholder="Raw Material Name">
          </div>
      </div>
      </br>
      <div class="form_wrap">
          <div class="form_item">
              <input type="number" name="quantiityBought" value="${response.data.quantiityBought}" min="0" id="quantiityBought" required class="form-control" placeholder="Quantity in turns">

          </div>
      </div>
      </br>
      <div class="form_wrap">
          <div class="form_item">
          <div style="display: flex;">
               <span class="input-group-text" id="basic-addon1" style="border-radius: 5px 0px 0px 5px;">₦</span>
               <input type="number" name="cost" min="0" value="${response.data.cost}" id="cost" required class="form-control" placeholder="Total Cost" style="border-top-left-radius: 0px !important;border-bottom-left-radius: 0px !important;">
               </div>
          </div>
      </div>
      </br>
      <div class="form_wrap">
          <div class="form_item">
              <textarea name="additionalMessage" value="" required id="additionalMessage" class="form-control" cols="30" rows="5" placeholder="Additional Info"></textarea>
          </div>
      </div>
  </form>
</div>`
            swal({
                title: 'Update Request Form',
                text: null,
                buttons: true,
                closeModal: false,
                content: form,
                buttons: {
                    cancel: "Cancel",
                    catch: {
                        text: "Submit",
                    },
                }
            }).then(function (isConfirm) {
                if (isConfirm == "catch") {
                    const update_request_form = document.querySelector('#update-request-form')
                    let sendForm = new FormData(update_request_form)
                    console.log(sendForm.get("additionalMessage"))
                    if (sendForm.get("additionalMessage") == "") {
                        window.alert("Pls fill the Additional Message Field")
                        return
                    }
                    fetch(`https://localhost:5001/api/RawMaterial/UpdateRawMaterial/${id}`,
                        {
                            method: "PUT",
                            body: sendForm,

                        })
                        .then((res) => {
                            console.log(res);
                            return res.json();
                        })
                        .then(function (value) {
                            console.log(value.success);
                            if (value.success == true) {
                                Swal.fire("", `Request Updated`, "success");
                                displayMyRequest()
                            }
                            else {
                                Swal.fire("Opps!", `Something went wrong`, "warning");
                            }

                        })
                        .catch((res) => {
                            window.alert(res.message)


                        })
                }
            }
            );
        })

}