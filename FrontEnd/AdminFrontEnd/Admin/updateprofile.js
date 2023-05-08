const myform = document.querySelector('#update-form');
myform.addEventListener('submit', (x) => {
    x.preventDefault();
    console.log(myform);
    // let Token = localStorage.getItem("token");
    // console.log(Token);
    // let pics = document.querySelector("#prodp")
    // console.log(pics.value)
    let sendForm = new FormData(myform);
    console.log(sendForm.get("username"));
    console.log(sendForm.get("imageUrl"));
    fetch(`https://localhost:5001/api/Admin/Update/${id}`,
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
                swal("Success", `${value.message}`, "success")
                // location.href = "./index.html"
                viewProfile();
            }
            else {
                swal("Opps!", `${value.message}`, "warning");
            }

        })
        .catch((res) => {
            window.alert("UnAuthorized")

            // localStorage.clear();
            // location.href = "/Login/login.html"
        })

})