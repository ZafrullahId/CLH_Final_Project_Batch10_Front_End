// window.alert("welcome");
let password = document.querySelector('#password')
let error = document.querySelector('#error-message')

let code = "";
const myform = document.querySelector('#sign-up-form');
myform.addEventListener('submit', (x) => {
    x.preventDefault();
    console.log(myform);
    // let Token = localStorage.getItem("token");
    // console.log(Token);
    let sendForm = new FormData(myform);
    console.log(sendForm.get("username"));
    fetch(`https://localhost:5001/api/Customer/RegisterCustomer`,
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
                localStorage.setItem('registrationid',value.data.id);
                location.href = "vrification.html"
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
