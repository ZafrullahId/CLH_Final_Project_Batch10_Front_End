
let categoryList = document.querySelector(".images");
const PRODUCTTEMPLATE = `<div class="post-image">

<img src="http://127.0.0.1:5501/wwwroot/Images/{{PRODUCT-IMAGE}}" alt="">
<h6>{{PRODUCT-TYPE}}</h6>
<p>{{PRODUCT-DESCRIPTION}}</p>
<p>x{{PRODUCT-QUANTITY}}</p>
<p>₦{{PRODUCT-PRICE}}</p>
</div>`;



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


displayProduct();