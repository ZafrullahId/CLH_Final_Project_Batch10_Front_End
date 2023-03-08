
const myform = document.querySelector('#add-manager-form');
myform.addEventListener('submit', (x) => {
    x.preventDefault();
    console.log(myform);
    // let Token = localStorage.getItem("token");
    // console.log(Token);
    let sendForm = new FormData(myform);
    window.alert(sendForm.get("fullName"));
    fetch(`https://localhost:5001/api/Admin/RegisterAdmin`,
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
                window.alert(value.message);
            }
            else {
                window.alert(value.message);
            }

        })
        .catch((res) => {
            window.alert("UnAuthorized")

            // localStorage.clear();
            // location.href = "/Login/login.html"
        })

})