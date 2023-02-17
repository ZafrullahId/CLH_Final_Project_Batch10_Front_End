var id = localStorage.getItem("Id");
let profile_image = document.querySelector('#profile_image');
let profile_name = document.querySelector('#name');
let profile_email = document.querySelector('#emails');
var user_name = document.querySelector('#username');
var fullname = document.querySelector('#fullname');
var email = document.querySelector('#email');
var phone = document.querySelector('#phone');
let IMAAGETEMPLATE = `<div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="rounded-circle mt-5" width="150px" src="C:\\Users\\Zafrullah\\Desktop\\Project\\wwwroot\\Images\\{{PROFILE-IMAGE}}">
<span class="font-weight-bold" id="name">{{NAME}}</span>
<span class="text-black-50" id="emails">{{EMAIL}}</span><span> </span></div>`
let editprofile = () => {

    fetch(`https://localhost:5001/api/Admin/Get/${id}`)
    .then(response => response.json())
    .then(function(response){
        profile_image.innerHTML = "";
            user_name.value = response.data.username;
            fullname.value = response.data.fullName;
            email.value = response.data.email;
            phone.value = response.data.phoneNumber;
            let image = IMAAGETEMPLATE
            .replace('{{PROFILE-IMAGE}}',response.data.profileImage)
            .replace('{{NAME}}',response.data.fullName)
            .replace('{{EMAIL}}',response.data.email)
            profile_image.innerHTML = image;
            
    })
} 

editprofile();