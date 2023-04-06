let pname = document.querySelector("#Name")
let price = document.querySelector("#Price")
let description = document.querySelector("#Description")
let categoryList = document.querySelector(".images");
let category = document.querySelector('#category')
let update_category = document.querySelector('#update-category')
const PRODUCTTEMPLATE = `<div class="post-image">
<div class="nav-item dropdown">
<a href="#" class="nav-link" data-bs-toggle="dropdown" style="padding:0px !important;"><i class="fas fa-ellipsis-v" style="align-self: end;padding-right: 10px;padding-top: 10px;margin-left: 250px !important;"></i></a>
<div class="dropdown-menu bg-transparent border-0" style="margin-left: 170px !important;">
                        <div class="" id="updated-product" onclick="showForm({{ID}})">
                            <a href="#" class="dropdown-item">UPDATE</a>
                        </div>
                        <div>
                        <a class="dropdown-item" onclick="remove({{PRODUCT-ID}})" style="cursor: pointer">DELETE</a>
                        </div>
                    </div>
</div>
<img src="http://127.0.0.1:5501/wwwroot/Images/{{PRODUCT-IMAGE}}" alt="">
<h6>{{PRODUCT-TYPE}}</h6>
<p>{{PRODUCT-DESCRIPTION}}</p>
<p>x{{PRODUCT-QUANTITY}}</p>
<p>&#8358;{{PRODUCT-PRICE}}</p>
</div>`;

/**fetch product category */
function fetchCategory() {
  // window.alert("hi")
  fetch('https://localhost:5001/api/Category/GetProductCategoties')
    .then(res => res.json())
    .then(function (response) {
      category.innerHTML = ""
      response.data.forEach(x => {
        category.innerHTML += `<option value="${x.name}">${x.name}</option>`

      })

    })
}
/**add a new category */
let displayFormaddCategory = () => {
  let form = document.createElement("div")
  form.innerHTML = `<div class="">
  <form action="" id="add-category">
      <div class="form_wrap">
          <div class="form_item">
              <input type="text" name="name" id="CName" required class="form-control" placeholder="Category Name">
          </div>
      </div>
      </br>
      <div class="form_wrap">
          <div class="form_item">
              <input type="text" name="description" id="CDescription" required class="form-control" placeholder="Category Description">

          </div>
      </div>
  </form>
</div>`
  swal({
    title: 'Add Category',
    text: null,
    showCancelButton: true,
    closeOnConfirm: false,
    content: form,
    buttons: {
      cancel: "Cancel",
      catch: {
        text: "Submit",
      },
    }
  }).then(function (isConfirm) {
    let dname = document.querySelector("#CName")
    let ddescription = document.querySelector("#CDescription")
    if (isConfirm) {
      let values = {
        Name: dname.value,
        Description: ddescription.value
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      fetch(`https://localhost:5001/api/Category/AddNewCategory`, options)
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
    }
  }
  );
}
function fetchupdateCategory() {
  // window.alert("hi")
  fetch('https://localhost:5001/api/Category/GetProductCategoties')
    .then(res => res.json())
    .then(function (response) {
      update_category.innerHTML = ""
      response.data.forEach(x => {
        update_category.innerHTML += `<option value="${x.name}">${x.name}</option>`

      })

    })
}

/**Removes the product */
let remove = (id) => {
  swal({
    title: "Are you sure?",
    text: "Once deleted, Customers will not be able to see it",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      const options = {
              method: 'DELETE',
              body: null,
              headers: {
                'Content-Type': 'application/json'
              }
            }
      fetch(`https://localhost:5001/api/Product/Delete/${id}`, options)
          .then(res => res.json())
          .then(function (response) {

            if (response.success == true) {
              swal(`${response.message}`, {
                icon: "success",
              });
              displayProduct();
            }
            else {
              swal(`${response.message}`, {
                icon: "warning",
              });
            }
          });
        }
  });
  // swal(
  //   {
  //     title: "Are you sure?",
  //     text: "This product will no longer be available for customers",
  //     type: "warning",
  //     allowEscapeKey: false,
  //     allowOutsideClick: false,
  //     showCancelButton: true,
  //     confirmButtonColor: "#DD6B55",
  //     confirmButtonText: "Yes",
  //     // showLoaderOnConfirm: true,
  //     closeOnConfirm: false
  //   },

  //   function (isConfirm) {
  //     const options = {
  //       method: 'DELETE',
  //       body: null,
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     }


  //     if (isConfirm) {
  //       fetch(`https://localhost:5001/api/Product/Delete/${id}`, options)
  //         .then(res => res.json())
  //         .then(function (response) {

  //           if (response.success == true) {
  //             swal("Success", `${response.message}`, "success");
  //             displayProduct();
  //           }
  //           else {
  //             swal("Opps!", `${response.message}`, "warning");
  //           }
  //         });

  //     }

  //   }

  // );

}
function showForm(id) {
  let btn = document.querySelector("#updated-product")
  let box = document.querySelector(".update-modal-box")
  box.classList.toggle("show-modal")
  btn.classList.add("show-modal")
  fetch(`https://localhost:5001/api/Product/Get/${id}`)
    .then(res => res.json())
    .then(function (value) {
      console.log(value.data.categoryName)
      // console.log(update_category.innerHTML)
      pname.value = value.data.name
      price.value = value.data.price
      description.value = value.data.description
      update_category.innerHTML = `<option value="${value.data.categoryName}">${value.data.categoryName}</option>`
      localStorage.removeItem('productId')
      localStorage.setItem('productId', id)
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
          .replace('{{PRODUCT-ID}}', x.productId)
          .replace('{{ID}}', x.productId)
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
// fetchCategory()
displayProduct();