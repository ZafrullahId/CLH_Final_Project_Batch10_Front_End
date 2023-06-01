
let cart_items_table = document.getElementsByTagName('tbody')[0]
let cart_sub_total = document.querySelector('#cart-sub-total')
let check_out_total = document.querySelector('#cart-total')

let CARTTABLETEMPLATE = `<tr id="item{{ID}}">
<td class="shoping__cart__item">
    <img src="http://127.0.0.1:5502/wwwroot/Images/{{PRODUCT-IMAGE}}" alt=""  width="100px" height="100px">
    <h5>{{PRODUCT-NAME}}</h5>
</td>
<td class="shoping__cart__price">
<span>&#8358;</span><span  id="price{{ID}}" >{{PRICE}}</span>
</td>
<td class="shoping__cart__quantity">
    <div class="quantity">
        <div class="pro-qty">
            <span class="dec qtybtn" onclick="decreaseQuantity({{ID}})">-</span>
            <input type="text" min="0" id="quantity{{ID}}" value="1">
            <span class="inc qtybtn" onclick="increaseQuantity({{ID}})">+</span>
            <small id="error-message{{ID}}" style="color: red"></small>
        </div>
    </div>
</td>
<td class="shoping__cart__total">

<span>&#8358;</span><span  id="total{{ID}}" class="quantitytotalamount">{{TOTAL}}</span>
</td>
<td class="shoping__cart__item__close">
    <span class="icon_close" id="{{ID}}" onclick="removeFromCart(this.id)" style="color:red"></span>
</td>
</tr>`



function cartTable() {
    var cartItem = JSON.parse(localStorage.getItem('cart'))
    cartItem.forEach(x => {
        let id = x.productId
            if (document.querySelector('#quantity' + x.productId) != null) {
                let i = cartItem.filter(x => x.productId == id)

                let duplicateItems = document.querySelector('#quantity' + x.productId)
                var currentValue = parseInt(duplicateItems.value);
                duplicateItems.value = currentValue + 1
                console.log("yes")
            }
            else {
                // console.log(x)
                let item = CARTTABLETEMPLATE
                    .replace('{{PRODUCT-NAME}}', x.name)
                    .replace('{{PRODUCT-IMAGE}}', x.imageUrl)
                    .replace('{{PRICE}}', x.price)
                    .replace('{{TOTAL}}', x.price)
                    .replaceAll('{{ID}}', x.productId)
                cart_items_table.innerHTML += item
            }
    });
}

function decreaseQuantity(id) {
    let carto = JSON.parse(localStorage.getItem('cart'))
    let a =  carto.indexOf(carto.find(x => x.productId == id))
    console.log(a)
    carto.splice(a, 1);

    let error = document.querySelector('#error-message' + id)
    let quantity = document.querySelector("#quantity" + id)
    let total = document.querySelector("#total" + id)
    let price = document.querySelector("#price" + id)
    if (Number(quantity.value) == 1) {
        error.innerText = "quantity can't be less than 1"
        return
    }
    error.innerText = ""
    let v = Number(quantity.value) - 1
    quantity.value = v
    let p = Number(price.innerText)
    let t = Number(total.innerText)
    total.innerText = (t - p).toString()
    cartTotal()
    localStorage.setItem("cart", JSON.stringify(carto))
}

function increaseQuantity(id) {
    let error = document.querySelector('#error-message' + id)
    let quantity = document.querySelector("#quantity" + id)
    let total = document.querySelector("#total" + id)
    let price = document.querySelector("#price" + id)
    let items = JSON.parse(localStorage.getItem('cart'))
    let item_to_increase = items.find(x => x.productId == id)
    items.push(item_to_increase)
    localStorage.setItem("cart", JSON.stringify(items))

    error.innerText = ""
    let v = Number(quantity.value) + 1
    quantity.value = v
    let p = Number(price.innerText)
    let t = Number(total.innerText)
    total.innerText = (p + t).toString()
    cartTotal()
}

function initialTotal() {
    let prices = document.querySelectorAll('.quantitytotalamount')
    
    prices.forEach(x => {
        // console.log(x.id.substring(5))
        let q = document.querySelector('#quantity' +x.id.substring(5))
        // console.log(x.id.substring(5))
        x.innerText = (Number(x.innerText) * Number(q.value)).toString()
    })

}

function cartTotal() {
    let totalamount = 0
    let allTotal = document.querySelectorAll('.quantitytotalamount')
    allTotal.forEach(x => {
        totalamount += Number(x.innerText)
    })
    cart_sub_total.innerText = "₦" + totalamount
    check_out_total.innerText = "₦" + totalamount
}

function removeFromCart(id) {
    let item = document.querySelector('#item' + id)
    let items = JSON.parse(localStorage.getItem('cart'))
    console.log(items)
    var remaining_items = items.filter(x => x.productId != id)
    localStorage.setItem("cart", JSON.stringify(remaining_items))
    item.innerHTML = ""
    initiatCartTotal()
}

function initiatCartTotal() {
    let items = JSON.parse(localStorage.getItem('cart'))
    let t = 0
    items.forEach(x => {
        t += x.price
    })
    check_out_total.innerText = "₦" + t
    cart_sub_total.innerText = "₦" + t
}

cartTable()
initialTotal()
initiatCartTotal()
