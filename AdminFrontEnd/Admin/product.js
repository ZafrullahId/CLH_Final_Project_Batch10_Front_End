let categoryList = document.querySelector(".images");

const PRODUCTTEMPLATE = `<div class="post-image">
<div class="nav-item dropdown">
<a href="#" class="nav-link" data-bs-toggle="dropdown" style="padding:0px !important"><i class="fas fa-ellipsis-v" style="align-self: end;padding-right: 10px;padding-top: 10px;margin-left: 250px !important;"></i></a>
<div class="dropdown-menu bg-transparent border-0" style="margin-left: 170px !important;">
                            <a class="dropdown-item">Update</a>
                            <a class="dropdown-item" onclick="remove({{PRODUCT-ID}})">Delete</a>
                        </div>
</div>
<img src="http://127.0.0.1:5501/wwwroot/Images/{{PRODUCT-IMAGE}}" alt="">
<h6>{{PRODUCT-TYPE}}</h6>
<p>{{PRODUCT-DESCRIPTION}}</p>
<p>x{{PRODUCT-QUANTITY}}</p>
<p>{{PRODUCT-PRICE}}</p>
</div>`;

let remove = (id) => {
  let text = "are you sure you want to delete this product";
  if (confirm(text) == true) {
    removeConfirmed(id);
  } else {
    return;
  }
}

let removeConfirmed = (id) => {
  const options = {
    method : 'DELETE',
    body : null,
    headers : {
        'Content-Type' : 'application/json'
    }
}
  fetch(`https://localhost:5001/api/Product/Delete/${id}`,options)
  .then(res => res.json())
    .then(function (response) {
      console.log(response.status)
      console.log(response.message)
      // let product = document.querySelector(`#${id}`);
      if(response.success == true)
      {
        window.alert(response.message)
        displayProduct();
      }
      else{
        window.alert(response.message)
      }
    })
}

let displayProduct = () => {
  fetch('https://localhost:5001/api/Product/GetAll')
    .then(res => res.json())
    .then(function (response) {
      categoryList.innerHTML = "";
      response.data.forEach(x => {
        let product = PRODUCTTEMPLATE
          .replace('{{PRODUCT-IMAGE}}', x.imageUrl)
          .replace('{{PRODUCT-TYPE}}', x.name)
          .replace('{{PRODUCT-QUANTITY}}', x.quantityRemaining)
          .replace('{{PRODUCT-DESCRIPTION}}', x.description)
          .replace('{{PRODUCT-PRICE}}', x.price)
          .replace('{{PRODUCT-ID}}',x.productId)
        categoryList.innerHTML += product;
      })
    })
}

let update = (id) => {
  const myform = document.querySelector('#update-form');
  myform.addEventListener('submit', (x) => {
      x.preventDefault();
      // console.log(myform);
      // let Token = localStorage.getItem("token");
      // console.log(Token);
      let sendForm = new FormData(myform);
      console.log(sendForm.get("name"));
      fetch(`https://localhost:5001/api/Product/UpdateProduct/${id}`,
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
                  window.alert(value.message);
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
}

displayProduct();