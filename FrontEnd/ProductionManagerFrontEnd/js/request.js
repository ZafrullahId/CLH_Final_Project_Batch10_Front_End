let myrequest = document.querySelector('#notify')

let MYREQUEST = `<div class="row single-notification-box unread">
<div class="col-1 profile-picture">
    <img class="rounded-circle" src="http://127.0.0.1:5502/wwwroot/Images/{{IMAGE}}"
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
            onclick="showMessage({{ID}})"><i class="fa fa-eye" aria-hidden="true" style="cursor: pointer;"></i></small>
    </div>
    <div
        style="display: flex;justify-content: space-around;align-items: baseline;" id="{{STATE}}">
        <p class="time">{{REQUEST-TIME}}</p>
        <small class="time">{{CREATED-TIME}}</small>
        <small><i class="fa {{ICON}}" aria-hidden="true" style="cursor: pointer;color: {{COLOR}}"></i></small>
        <small class="status">{{APPROVAL-STATUS}}</small>
    </div>
    <div id="id{{ID}}" hidden>

    </div>
</div>
</div>`

let myrequestmessage = `<div class="private-message" id="ids{{ID}}">
<ol type="A">
<li>QUANTITY REQUESTED: {{PRODUCTION-QUANTITY-REQUEST}} tonns</li>
<li>PRODUCTION QUANTITY: {{PRODUCTION-QUANTITY}} bags</li>
<h6 style="font-size: 14px !important;font-weight: 20 !important;">RAWMATERIALS REQUESTED</h6>
<div id="dis{{ID}}">
<ul>

</ul>
</div>
<li>ADDITIONAL MESSAGE: {{PRODUCTION-REQUEST-ADDITIONAL-MESSAGE}}</li>
</ol>
</div>`

let showMessage = (id) => {
    let notification_message = document.querySelector(`#id${id}`);
    fetch(`https://localhost:5001/api/Production/GetProduction/${id}`)
        .then(res => res.json())
        .then(function (response) {
            var btn1 = `<input type="submit" class="btn btn-success" value="Update" style="font-size: 12px;" name="" id="" onclick="updateRequest(${id})">`
            var btn2 = `<input type="submit" class="btn btn-danger" value="Delete" style="font-size: 12px;" name="" id="" onclick="deleteRequest(${id})">`
            const node = document.createElement("div")
            node.style.display = "flex"
            node.style.gap = "10px"
            node.innerHTML += btn1 + btn2
            notification_message.innerHTML = ""
            let request = myrequestmessage
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
            if (response.data.approvalStatus == "Pending" || response.data.approvalStatus == "Rejected") {

                document.getElementById(`ids${id}`).appendChild(node)
            }
            notification_message.toggleAttribute("hidden")
        })
}

let displayMyRequest = () => {
    let jsonUrl = `https://localhost:5001/api/Production/GetAllProductions`
    fetch(jsonUrl)
        .then(res => res.json())
        .then(function (response) {
            fetchdata(jsonUrl)
            myrequest.innerHTML = ""
            response.data.forEach(e => {
                if (e.approvalStatus == "Approved") {

                    let request = MYREQUEST
                        .replace('{{IMAGE}}', e.admin.image)
                        .replace('{{USER-NAME}}', e.admin.userName)
                        .replace('{{ROLE}}', "ware house Manager")
                        .replace('{{REQUEST-TIME}}', e.postedTime)
                        .replace('{{CREATED-TIME}}', e.createdTime)
                        .replace('{{APPROVAL-STATUS}}', e.approvalStatus)
                        .replace('{{ICON}}', "fa-check")
                        .replace('{{COLOR}}', "green")
                        .replaceAll('{{ID}}', e.productionId)
                    myrequest.innerHTML += request
                }
                else if (e.approvalStatus == "Pending") {

                    let request = MYREQUEST
                        .replace('{{IMAGE}}', e.admin.image)
                        .replace('{{USER-NAME}}', e.admin.userName)
                        .replace('{{ROLE}}', "ware house Manager")
                        .replace('{{REQUEST-TIME}}', e.postedTime)
                        .replace('{{CREATED-TIME}}', e.createdTime)
                        .replace('{{APPROVAL-STATUS}}', e.approvalStatus)
                        .replace('{{ICON}}', "fa-clock-o")
                        .replace('{{COLOR}}', "#009CFF")
                        .replaceAll('{{ID}}', e.productionId)
                    myrequest.innerHTML += request
                }
                else if (e.approvalStatus == "Rejected") {

                    let request = MYREQUEST
                        .replace('{{IMAGE}}', e.admin.image)
                        .replace('{{USER-NAME}}', e.admin.userName)
                        .replace('{{ROLE}}', "ware house Manager")
                        .replace('{{REQUEST-TIME}}', e.postedTime)
                        .replace('{{CREATED-TIME}}', e.createdTime)
                        .replace('{{APPROVAL-STATUS}}', e.approvalStatus)
                        .replace('{{ICON}}', "fa-ban")
                        .replace('{{COLOR}}', "red")
                        .replaceAll('{{ID}}', e.productionId)
                    myrequest.innerHTML += request
                }
            });
        })
}

async function requestForm() {
    let form = document.createElement("div")

    form.innerHTML = `<div class="">
  <form action="" id="production-request-form">
      <div class="form_wrap">
          <div class="form_item">
              <select name="productName" id="productName" required class="form-control" placeholder="Product to produce">

              </select>
          </div>
      </div>
      </br>
      <div class="form_wrap">
          <div class="form_item">
              <input type="number" name="quantityRequest" min="0" id="quantityRequest" required class="form-control" placeholder="Request Quantity in tonns">
          </div>
      </div>
      </br>
      <div class="form_wrap">
          <div class="form_item">
          <div style="display: flex;">
               <input type="number" name="quantityProduced" min="0" id="quantityProduced" required class="form-control" placeholder="Proposed Production Quantity in bags">
               </div>
          </div>
          </div>
      </div>
      </br>
      <div style="display: flex; gap: 20px;width: 430px !important;flex-wrap: wrap;">
           
      </div>
      <div class="form_wrap">
          <div class="form_item">
              <textarea name="additionalMessage" id="additionalMessage" class="form-control" cols="30" rows="2" placeholder="Additional Info"></textarea>
          </div>
      </div>
      </br>
  </form>
</div>`
    let IsRemaining = true
    await fetch(`https://localhost:5001/api/RawMaterial/GetAvailableRawmaterails`)
        .then(res => res.json())
        .then(function (response) {
            if (response.data == null) {
                Swal.fire("Opps!", `No Available Raw Material`, "warning");
                IsRemaining = false
            }
            else{
                
                response.data.forEach(x => {
                    // console.log(form.children[2])
                    form.children[2].innerHTML += `<div>
            <input type="checkbox" id="ids" name="ids" value="${x.id}">
            <label for="ids"> ${x.name}</label><br>
        </div>`
                })
            }
        })

        if (IsRemaining == true) {
            
            await fetch('https://localhost:5001/api/Product/GetAll')
                .then(res => res.json())
                .then(function (response) {
                    response.data.forEach(x => {
                        form.children[0].children[0].children[0].children[0].children[0].innerHTML += `<option value="${x.name}">${x.name}</option>`
                    })
                })
    
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
                    let addinfo = document.getElementById("additionalMessage")
                    const request_form = document.querySelector('#production-request-form')
                    let sendForm = new FormData(request_form)
                    sendForm.set("additionalMessage", addinfo.value)
                    let url = `https://localhost:5001/api/Production/CreateProduction/${id}?`
                    let raw = document.querySelectorAll('#ids')
                    let count = 1
                    raw.forEach(x => {
                        if (count > 1) {
                            url += "&"
                        }
                        if (x.checked == true) {
                            url += `ids=${x.value}`
                        }
                        count++;
    
                    })
                    fetch(url,
                        {
                            method: "POST",
                            body: sendForm,
    
                        })
                        .then((res) => {
                            console.log(res);
                            return res.json();
                        })
                        .then(function (value) {
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
        }).then((result) => {
            const options = {
                method: 'DELETE',
                body: null,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            if (result.isConfirmed) {
                fetch(`https://localhost:5001/api/Production/Delete/${id}`, options)
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

async function updateRequest(id) {

    let form = document.createElement("div")
    let html = `<div class="">
    <form action="" id="update-production-request-form">
        <div class="form_wrap">
            <div class="form_item">
                <select name="productName" id="productName" value="{{productName}}" required class="form-control" placeholder="Product to produce">
  
                </select>
            </div>
        </div>
        </br>
        <div class="form_wrap">
            <div class="form_item">
                <input type="number" name="quantityRequest" value="{{quantityRequest}}" min="0" id="quantityRequest" required class="form-control" placeholder="Request Quantity in tonns">
            </div>
        </div>
        </br>
        <div class="form_wrap">
            <div class="form_item">
            <div style="display: flex;">
                 <input type="number" name="quantityProduced" value="{{quantityProduced}}" min="0" id="quantityProduced" required class="form-control" placeholder="Proposed Production Quantity in bags">
                 </div>
            </div>
            </div>
        </div>
        </br>
        <div style="display: flex; gap: 20px;width: 430px !important;flex-wrap: wrap;">
             
        </div>
        <div class="form_wrap">
            <div class="form_item">
                <textarea name="additionalMessage" id="additionalMessage" class="form-control" cols="30" rows="2" placeholder="Additional Info"></textarea>
            </div>
        </div>
        </br>
    </form>
  </div>`

    await fetch(`https://localhost:5001/api/Production/GetProduction/${id}`)
        .then(res => res.json())
        .then(function (response) {
            let myform = html
                .replace('{{productName}}', response.data.productDto.name)
                .replace('{{quantityRequest}}', response.data.quantityRequest)
                .replace('{{quantityProduced}}', response.data.quantityProduced)
                .replace('{{quantityProduced}}', response.data.quantityProduced)
            form.innerHTML = myform
        })
    await fetch('https://localhost:5001/api/Product/GetAll')
        .then(res => res.json())
        .then(function (response) {
            response.data.forEach(x => {
                form.children[0].children[0].children[0].children[0].children[0].innerHTML += `<option value="${x.name}">${x.name}</option>`
            })
        })
    await fetch(`https://localhost:5001/api/RawMaterial/GetAvailableRawmaterails`)
        .then(res => res.json())
        .then(function (response) {
            response.data.forEach(x => {
                console.log(form.children[2])
                form.children[2].innerHTML += `<div>
        <input type="checkbox" id="ids" name="ids" value="${x.id}">
        <label for="ids"> ${x.name}</label><br>
    </div>`
            })
        })

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
            let addinfo = document.getElementById("additionalMessage")
            const request_form = document.querySelector('#update-production-request-form')
            let sendForm = new FormData(request_form)
            sendForm.set("additionalMessage", addinfo.value)
            console.log(sendForm)
            let url = `https://localhost:5001/api/Production/UpdateProduction/${id}?`
            let raw = document.querySelectorAll('#ids')
            let count = 1
            raw.forEach(x => {
                if (count > 1) {
                    url += "&"
                }
                if (x.checked == true) {
                    url += `ids=${x.value}`
                }
                count++;

            })
            console.log(url)
            // window.alert(sendForm.get("ids"))
            fetch(url,
                {
                    method: "PUT",
                    body: sendForm,

                })
                .then((res) => {
                    console.log(res);
                    return res.json();
                })
                .then(function (value) {
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

}


displayMyRequest()

let production = []
let fetchdata = (endpoint) => {
    production = []
    fetch(endpoint)
        .then(res => res.json())
        .then(data => production.push(...data.data));
}

function findMatches(wordToMatch, rawMaterial) {
    return rawMaterial.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.approvalStatus.match(regex);
    })
}

function displayMatches() {
    let icon = ""
    let color = ""
    let count = 0;
    const matchObj = findMatches(this.value, production);
    const html = matchObj.map(x => {
        if (x.approvalStatus == "Approved") {
            icon = "fa-check"
            color = "green"
        }
        else if (x.approvalStatus == "Pending") {
            icon = "fa-clock-o"
            color = "#009CFF"
        }
        else {
            icon = "fa-ban"
            color = "red"
        }
        count++;
        return `<div class="row single-notification-box unread">
        <div class="col-1 profile-picture">
            <img class="rounded-circle" src="http://127.0.0.1:5502/wwwroot/Images/${x.admin.image}"
                alt="profile picture" class="img-fluid" style="width: 55px; height: 55px;">
        </div>
        <div class="col-11 notification-text" >
            <div style="display: flex;justify-content: space-between;">
                <p>
                    <a href="#" class="name">${x.admin.userName}</a>
                    <span class="description">you sent a request to the</span>
                    <a class="link group" href="http://">ware house Manager</a>
                    <span class="unread-symbol">•</span>
                </p>
                <small style="color: #009CFF;cursor: pointer;" id="show-message" 
                    onclick="showMessage(${x.productionId})"><i class="fa fa-eye" aria-hidden="true" style="cursor: pointer;"></i></small>
            </div>
            <div
                style="display: flex;justify-content: space-around;align-items: baseline;" id="{{STATE}}">
                <p class="time">${x.postedTime}</p>
                <small class="time">${x.createdTime}</small>
                <small><i class="fa ${icon}" aria-hidden="true" style="cursor: pointer;color: ${color}"></i></small>
                <small class="status">${x.approvalStatus}</small>
            </div>
            <div id="id${x.productionId}" hidden>
        
            </div>
        </div>
        </div>`
    }).join('')

    myrequest.innerHTML = html;
}



const searchInput = document.querySelector('#search');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
