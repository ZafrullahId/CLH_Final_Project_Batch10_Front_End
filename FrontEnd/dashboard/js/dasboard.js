let products = document.querySelector('.featured__filter')
let slide_products = document.querySelector('.owl-stage')
let filter = document.querySelector('.categories-filter')
let slide_reviews = document.querySelector('.carousel-inner')
let number = document.querySelector('.cart-item-number')
let amount = document.querySelector('.cart-item-amount')
var cart = []
// cart.push(...localStorage.getItem('cart'))

// console.log(cart)

let DASHBOARDPRODUCTTEMPLATE = ` <div class="col-lg-3 col-md-4 col-sm-6 mix {{CATEGORY}} fresh-meat">
<div class="featured__item">
    <div class="featured__item__pic set-bg" data-setbg="http://127.0.0.1:5502/wwwroot/Images/{{IMAGE}}"  style="background-image: url(http://127.0.0.1:5502/wwwroot/Images/{{IMAGE}});">
        <ul class="featured__item__pic__hover">
            <li><a href="#"><i class="fa fa-heart"></i></a></li>
            <li><a href="#"><i class="fa fa-retweet"></i></a></li>
            <li><a id="{{ID}}" class="add-to-cart" onclick="addToCart(this.id)" title="add to cart"><i class="fa fa-shopping-cart"></i></a></li>
        </ul>
    </div>
    <div class="featured__item__text">
        <h6><a href=""  style="text-transform: capitalize;">{{PRODUCTNAME}}</a></h6>
        <h5>&#8358;{{PRICE}}</h5>
    </div>
</div>
</div>`

let PRODUCTSLIDESHOW = `<div class="owl-item active" style="width: 240px;">
<div class="col-lg-3">
<div class="categories__item set-bg" data-setbg="http://127.0.0.1:5502/wwwroot/Images/{{IMAGE}}" style="background-image: url(http://127.0.0.1:5502/wwwroot/Images/{{IMAGE}});">
    <h5><a href="#">{{CATEGORY}}</a></h5>
</div>
</div>
</div>`
if (JSON.parse(localStorage.getItem('cart')) == null) {
    // return
}
else {
    cart = JSON.parse(localStorage.getItem('cart'))
    let totalAmount = 0
    cart.forEach(x => {
        totalAmount += x.price
    });
    amount.innerText = "₦" + totalAmount + ".00"

    number.innerText = cart.length.toString()
}



        fetch('https://localhost:5001/api/Product/GetAll')
            .then(res => res.json())
            .then(function (response) {
                console.log(response.data)
                // products.innerHTML  = ""
                slide_products.innerHTML = ""
                response.data.forEach(x => {
                    let product = DASHBOARDPRODUCTTEMPLATE
                        .replace('{{ID}}', x.productId)
                        .replaceAll('{{IMAGE}}', x.imageUrl)
                        .replace('{{PRODUCTNAME}}', x.name)
                        .replace('{{CATEGORY}}', x.categoryName.toLowerCase())
                        .replace('{{PRICE}}', x.price)
                    products.innerHTML += product

                    let slide = PRODUCTSLIDESHOW
                        .replace('{{CATEGORY}}', x.categoryName)
                        .replaceAll('{{IMAGE}}', x.imageUrl)
                    slide_products.innerHTML += slide
                });
            })

fetch('https://localhost:5001/api/Category/GetProductCategoties')
            .then(res => res.json())
            .then(function (response) {
                response.data.forEach(x => {
                    filter.innerHTML += `<li data-filter=".${x.name.toLowerCase()}">${x.name}</li>`
                })
            })

let REVIEWTEMPLATE = ` <div class="carousel-item" style="height: 280px;">
<div class="carousel-caption" style="height: 280px;">
    <p>{{REVIEW-TEXT}} </p> <img src="http://127.0.0.1:5502/wwwroot/Images/{{IMAGE}}">
    <div id="image-caption" style="color: black;">{{NAME}}</div>
</div>
</div>`

fetch(`https://localhost:5001/api/Review/GetAll`)
            .then(res => res.json())
            .then(function (response) {

                response.data.forEach(x => {
                    let review = REVIEWTEMPLATE
                        .replace('{{REVIEW-TEXT}}', x.text)
                        .replace('{{IMAGE}}', x.imageUrl)
                        .replace('{{NAME}}', x.fullName)
                    slide_reviews.innerHTML += review
                })
                slide_reviews.children[0].classList.add("active")
            })


function addToCart(id) {
            fetch(`https://localhost:5001/api/Product/Get/${id}`)
                .then(res => res.json())
                .then(function (product) {
                    console.log(product)
                    let totalAmount = 0
                    cart.push(product.data)
                    number.innerText = cart.length.toString()
                    localStorage.setItem('cart', JSON.stringify(cart))
                    cart.forEach(x => {
                        totalAmount += x.price
                    });
                    amount.innerText = "₦" + totalAmount + ".00"
                })

            number.style.background = "#7fad39"

            $.notifyDefaults({
                type: 'success',
                allow_dismiss: true,
                delay: 1
            });
            $.notify('Successfully added to cart');
        }