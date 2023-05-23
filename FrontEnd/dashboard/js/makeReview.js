const myform = document.querySelector("#review-form")
let review_input = document.querySelector('#text')
var id = localStorage.getItem("Id")
myform.addEventListener('submit', (x) => {
    x.preventDefault()
    let sendForm = new FormData(myform)
    console.log(sendForm.get("name"))
    fetch(`https://localhost:5001/api/Review/CreateReview/${id}`,
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
                review_input.value = ""
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