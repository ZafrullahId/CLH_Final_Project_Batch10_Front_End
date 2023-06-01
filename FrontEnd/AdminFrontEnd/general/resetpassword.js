const myform = document.querySelector("#reset-password")
myform.addEventListener('submit', (x) => {
    x.preventDefault()
    let sendForm = new FormData(myform)
    console.log(sendForm.get("name"))
    fetch(`https://localhost:5001/api/VerificationCode/ResetPassword`,
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
                localStorage.setItem("resetId", value.id)
                location.href = "resetpasswordverification.html"
            }
            else {
                window.alert(value.message);
            }

        })
        .catch((res) => {
            window.alert("UnAuthorized")
        })
})