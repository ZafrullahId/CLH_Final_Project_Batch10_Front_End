let role = document.querySelector('#admin_role');

function Submit() {  
    let inputemail = document.querySelector('#email');
    let inputpassword = document.querySelector('#password');
    let button = document.querySelector('#button');
    
    const user = {
        email : inputemail.value,
        password : inputpassword.value,
    }
    const options = {
        method : 'POST',
        body : JSON.stringify(user),
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    
    fetch('https://localhost:5001/api/User/Login',options)
    .then(res => res.json())
    .then(function (res){

        if(res.success == true && res.data.role == "customer")
        {         
            localStorage.setItem("Id", res.data.id);
            localStorage.setItem("Role", res.data.role);
            window.alert(res.message)
            
        }
        else if(res.success == true && res.data.role == "admin" || res.data.role == "ware house manager" || res.data.role == "production manager")
        {
            localStorage.setItem("Id", res.data.id);
            localStorage.setItem("Role", res.data.role);
            console.log(res.data.image)
            window.swal({
              title: "Checking...",
              text: "Please wait",
              imageUrl: "images/ajaxloader.gif",
              showConfirmButton: false,
              allowOutsideClick: false
            });
            
            //using setTimeout to simulate ajax request
            setTimeout(() => {
              window.swal({
                icon: "success",
                title: "Successfuly logged in!",
                showConfirmButton: false,
                timer: 2000
              });
            }, 2000);
            location.href = "index.html"
        }
        else if(res.data.role == "sales manager")
        {
            localStorage.setItem("Id", res.data.id);
            localStorage.setItem("Role", res.data.role);
            console.log(res.data.image)
            window.swal({
              title: "Checking...",
              text: "Please wait",
              imageUrl: "images/ajaxloader.gif",
              showConfirmButton: false,
              allowOutsideClick: false
            });
            
            //using setTimeout to simulate ajax request
            setTimeout(() => {
              window.swal({
                icon: "success",
                title: "Successfuly logged in!",
                showConfirmButton: false,
                timer: 2000
              });
            }, 2000);
            location.href = "../SalesManagerFrontEnd/dashboard.html"
        }
        else
        {
            window.alert(res.message)
            // localStorage.setItem("Id", res.data.id);
            // localStorage.setItem("Role", res.data.role);
            // location.href = "index.html"
            // location.reload();
        }
    })
    .catch((resp) => {

        window.alert(resp.error);
        location.reload()
    })
}


  