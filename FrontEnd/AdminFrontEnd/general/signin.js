let role = document.querySelector('#admin_role');

function Submit() {
  let inputemail = document.querySelector('#email');
  let inputpassword = document.querySelector('#password');
  let button = document.querySelector('#button');

  const user = {
    email: inputemail.value,
    password: inputpassword.value,
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch('https://localhost:5001/api/User/Login', options)
    .then(res => res.json())
    .then(function (res) {

      if (res.success == true) {
        localStorage.setItem("Id", res.data.id);
        localStorage.setItem("Role", res.data.role);
        localStorage.setItem("Token", res.data.token)

        window.swal({
          title: "Checking...",
          text: "Please wait",
          imageUrl: "images/ajaxloader.gif",
          showConfirmButton: false,
          allowOutsideClick: false
        });
  
        setTimeout(() => {
          window.swal({
            icon: "success",
            title: "Successfuly logged in!",
            showConfirmButton: false,
            timer: 2000
          });
        }, 2000);
      }
      if (res.success == true && res.data.role == "customer") {
        location.href = "http://127.0.0.1:5501/FrontEnd/dashboard/index.html"
      }
      else if (res.success == true && res.data.role == "admin") {

        location.href = "index.html"
      }
      else if (res.success == true && res.data.role == "sales manager") {
        location.href = "../SalesManagerFrontEnd/dashboard.html"
      }

      else if (res.success == true && res.data.role == "warehouse manager") {
        location.href = "../RawMaterialManagerFrontEnd/dashboard.html"
      }

      else if (res.success == true && res.data.role == "production manager") {
        location.href = "../ProductionManagerFrontEnd/dashboard.html"
      }
      else {
        window.alert(res.message)
      }
    })
    .catch((resp) => {

      console.log(resp.message);
      // location.reload()
    })
}
// localStorage.clear();

