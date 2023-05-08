// let confirmpassword = document.querySelector('#confirm-password')
let password = document.querySelector('#password')
let error = document.querySelector('#error-message')

let mailInput = document.querySelector('#mail')
let token = location.href.split('=')[1]
fetch(`https://localhost:5001/api/User/GetUserByToken?token=${token}`)
    .then(res => res.json())
    .then(function (response) {
        mailInput.value = response.data.email
    })

const myform = document.querySelector('#complete-registration-form');
myform.addEventListener('submit', (x) => {
    x.preventDefault();
    console.log(myform);
    // let Token = localStorage.getItem("token");
    // console.log(Token);
    let sendForm = new FormData(myform);
    fetch(`https://localhost:5001/api/Admin/CompleteRegistration`,
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
                location.href = "signin.html"
            }
            else {
                window.alert(value.message);
            }

        })
        .catch((res) => {
            window.alert("UnAuthorized")

        })

})

let checkingForPassword = (confirmpassword) => {
    if (confirmpassword != password.value) {
        error.innerText = "Password not match"
    }
    else {
        error.innerText = ""
    }
}