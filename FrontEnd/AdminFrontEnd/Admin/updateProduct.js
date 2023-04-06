const updateform = document.querySelector('#update-form')
updateform.addEventListener('submit', (x) => {
    let productId = localStorage.getItem("productId")
    x.preventDefault()
    var formData = new FormData(updateform)
    fetch(`https://localhost:5001/api/Product/UpdateProduct/${productId}`,
    {
        method: "PUT",
        body: formData,
        
    })
    .then((res) => {
        console.log(res);
        return res.json();
    })
    .then(function (value) {
        console.log(value.success);
        if (value.success == true) {
            swal("Success", `${value.message}`, "success");
            displayProduct();
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
