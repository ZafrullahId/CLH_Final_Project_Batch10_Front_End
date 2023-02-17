var admin = document.querySelector('.manger')

let MANAGERSTEMPLATE = `<div class="col mb-3 man">
<div class="card">
    <img src="https://www.bootdey.com/image/340x120/FFB6C1/000000" alt="Cover" class="card-img-top">
    <div class="card-body text-center">
        <img src="C:\\Users\\Zafrullah\\Desktop\\Project\\wwwroot\\Images\\{{IMAGE}}"
            style="width:100px;margin-top:-65px" alt="User"
            class="img-fluid img-thumbnail rounded-circle border-0 mb-3">
        <h5 class="card-title">{{FULL-NAME}}</h5>
        <p class="text-secondary mb-1" style="text-transform: capitalize;">{{ROLE}}</p>
        <p class="text-muted font-size-sm" style="text-transform: capitalize;">{{DESCRIPTION}}</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-light btn-sm bg-white has-icon btn-block" type="button"><i
                class="material-icons">add</i>Follow</button>
        <button class="btn btn-light btn-sm bg-white has-icon ml-2" type="button"><svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" class="feather feather-message-circle">
                <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                </path>
            </svg></button>
    </div>
</div>
</div>`

fetch('https://localhost:5001/api/Admin/GetAllAdmins')
    .then(res => res.json())
    .then(function (response) {
        admin.innerHTML == ""
        response.data.forEach(x => {
            
            let manager = MANAGERSTEMPLATE
            .replace('{{IMAGE}}',x.profileImage)
            .replace('{{FULL-NAME}}',x.fullName)
            .replace('{{ROLE}}',x.role)
            .replace('{{DESCRIPTION}}',x.description)
            admin.innerHTML += manager

        });
    })