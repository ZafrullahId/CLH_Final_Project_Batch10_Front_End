var admin = document.querySelector('.manger')
var role = document.querySelector("#role")

let MANAGERSTEMPLATE = `<div class="col mb-3 man">
<div class="card">
    <img src="https://www.bootdey.com/image/340x120/FFB6C1/000000" alt="Cover" class="card-img-top">
    <div class="card-body text-center">
        <img src="http://127.0.0.1:5502/wwwroot/Images/{{IMAGE}}"
            style="width:100px;margin-top:-65px" alt="User"
            class="img-fluid img-thumbnail rounded-circle border-0 mb-3">
        <h5 class="card-title">{{FULL-NAME}}</h5>
        <p class="text-secondary mb-1" style="text-transform: capitalize;">{{ROLE}}</p>
        <p class="text-muted font-size-sm" style="text-transform: capitalize;">{{DESCRIPTION}}</p>
    </div>
    <div class="card-footer">
        <input type="submit" class="btn btn-danger" value="Remove" onclick="removeManager({{USER-ID}})">
        <button class="btn btn-light btn-sm bg-white has-icon ml-2" type="button"><svg
                xmlns="http://www.w3.org/2000/svg" width="84" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="feather feather-message-circle">
                <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                </path>
            </svg></button>
    </div>
</div>
</div>`

function fetchRoles() {
    fetch('https://localhost:5001/api/Role/GetAllRolesAsync')
        .then(res => res.json())
        .then(function (response) {
            role.innerHTML = ""
            response.data.forEach(x => {
                if (x.name == "customer") {
                    return
                }
                role.innerHTML += `<option value="${x.name}">${x.name}</option>`
            })
        })
}
let displayManagers = () => {
    var rol = localStorage.getItem("Role")
    console.log(rol)
    admin.innerHTML = ""
    fetch('https://localhost:5001/api/Admin/GetAllAdmins')
        .then(res => res.json())
        .then(function (response) {
            admin.innerHTML == ""
            response.data.forEach(x => {

                let manager = MANAGERSTEMPLATE
                    .replace('{{IMAGE}}', x.profileImage)
                    .replace('{{FULL-NAME}}', x.fullName)
                    .replace('{{ROLE}}', x.role)
                    .replace('{{DESCRIPTION}}', x.description)
                    .replace('{{USER-ID}}', x.id)
                admin.innerHTML += manager

            });
            if (rol != "admin") {
                // window.alert("hi")
                let r = document.querySelectorAll(".card-footer")
                r.forEach(x => {
                    console.log(x.children[0])
                    x.children[0].setAttribute("hidden", "")
                    x.children[1].setAttribute("hidden", "")
                })
            }
        })
}

let displayFormaddRole = () => {
    let form = document.createElement("div")
    form.innerHTML = `<div class="">
    <form action="" id="add-category">
        <div class="form_wrap">
            <div class="form_item">
                <input type="text" name="name" id="roleName" required class="form-control" placeholder="Role Name">
            </div>
        </div>
        </br>
        <div class="form_wrap">
            <div class="form_item">
                <input type="text" name="description" id="roleDescription" required class="form-control" placeholder="Role Description">
  
            </div>
        </div>
    </form>
  </div>`
    swal({
        title: 'Add Role',
        text: null,
        showCancelButton: true,
        closeOnConfirm: false,
        content: form,
        buttons: {
            cancel: "Cancel",
            catch: {
                text: "Submit",
            },
        }
    }).then(function (isConfirm) {
        let name = document.querySelector('#roleName')
        let description = document.querySelector('#roleDescription')
        if (isConfirm) {
            let values = {
                Name: name.value,
                Description: description.value
            }
            const options = {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            fetch(`https://localhost:5001/api/Role/Create`, options)
                .then((res) => {
                    console.log(res);
                    return res.json();
                })
                .then(function (value) {
                    console.log(value.success);
                    if (value.success == true) {
                        swal("Success", `${value.message}`, "success");
                    }
                    else {
                        swal("Opps!", `${value.message}`, "warning");
                    }

                })
                .catch((res) => {
                    window.alert("UnAuthorized")
                })
        }
    })
}

function removeManager(id) {
    let loginId = localStorage.getItem("Id")
    if (loginId == id) {
        Swal.fire(

            {
                title: 'Are you sure?',
                text: "This is your profile. Once deleted you would be logged out and won't have access to your account!!!",
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
                    fetch(`https://localhost:5001/api/Admin/Delete/${id}`, options)
                        .then(res => res.json())
                        .then(function (response) {
                            if (response.success == true) {
                                Swal.fire("Manger Deleted", "Manger has been deleted and can no longer have access to the system", "success");
                                
                                location.href = "http://127.0.0.1:5501/FrontEnd/AdminFrontEnd/signin.html"
                            }
                            else {
                                Swal.fire("Opps!", `${response.message}`, "warning");
                            }

                        });
                }
            })
    }
    else {

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
                    fetch(`https://localhost:5001/api/Admin/Delete/${id}`, options)
                        .then(res => res.json())
                        .then(function (response) {
                            if (response.success == true) {
                                Swal.fire("Manger Deleted", "Manger has been deleted and can no longer have access to the system", "success");
                                displayManagers()
                            }
                            else {
                                Swal.fire("Opps!", `${response.message}`, "warning");
                            }

                        });
                }
            })
    }

}
displayManagers()
fetchRoles()
