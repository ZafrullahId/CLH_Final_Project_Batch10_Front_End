var admin = document.querySelector('.manger')

let MANAGERSTEMPLATE = `<div class="col mb-3 man">
<div class="card">
    <img src="https://www.bootdey.com/image/340x120/FFB6C1/000000" alt="Cover" class="card-img-top">
    <div class="card-body text-center">
        <img src="http://127.0.0.1:5501/wwwroot/Images/{{IMAGE}}"
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

let displayManagers = () => {
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
        })
}


function removeManager(id) {
    swal(

        {
            title: "Are you sure?",
            text: "Once deleted, Manager will no have access to the system",
            type: "warning",
            allowEscapeKey: false,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            // showLoaderOnConfirm: true,
            closeOnConfirm: false
        },

        function (isConfirm) {
            const options = {
                method: 'DELETE',
                body: null,
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            if (isConfirm) {
                fetch(`https://localhost:5001/api/Admin/Delete/${id}`, options)
                    .then(res => res.json())
                    .then(function (response) {
                        if (response.success == true) {
                            swal("Manger Deleted", "Manger has been deleted and can no longer have access to the system", "success");
                            displayManagers()

                        }
                        else {
                            swal("Opps!", `${response.message}`, "warning");
                        }

                    });
            }

        }

    );
}
displayManagers()
