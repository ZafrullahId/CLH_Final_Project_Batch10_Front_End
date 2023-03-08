let myemail = location.href.split('=')[1]
let email = document.getElementById('mail')
email.value = myemail

const myform = document.querySelector('#complete-registration-form');
myform.addEventListener('submit', (x) => {
    x.preventDefault();
    console.log(myform);
    // let Token = localStorage.getItem("token");
    // console.log(Token);
    let sendForm = new FormData(myform);
    window.alert(sendForm.get("username"));
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
