
let payment_info = document.querySelector("#payment-info")
let cart_info = document.querySelector("#cart-info")
let location_url = location.href.split("=")
let ref = location_url[location_url.length - 1]
let orderId = location_url[1].split("&")[0]
// console.log(location_url[1].split("&")[0])
let total = document.querySelector('.total')

let cartItems = ` <tr>
<td>{{Q}}</td>
<td>{{PRODUCT-NAME}}</td>
<td class="right">₦{{TOTAL}}</td>
<td class="bold">₦{{TOTAL}}</td>
</tr>`

let PaymentInfo = `<tr>
<td>Status</td>
<td class="right">{{STATUS}}</td>
</tr>
<tr>
<td>Bank name</td>
<td class="right">{{BANK}}</td>
</tr>
<tr>
<td>Email</td>
<td class="right">{{EMAIL}}</td>
</tr>
<tr>
<td>Paid with</td>
<td class="right">{{TYPE}}</td>
</tr>
<tr>
<td>Card Type</td>
<td class="right">{{CARD-TYPE}}</td>
</tr>
<tr>
<td>currency</td>
<td class="right">{{CURRENCY}}</td>
</tr>
<tr>
<td>Reference number</td>
<td class="right">{{REFERENCE-NUMBER}}</td>
</tr>`

fetch(`https://localhost:5001/api/Payment/Get/${ref}`)
  .then(res => res.json())
  .then(function (response) {
    console.log(response)
    let p = PaymentInfo
      .replace('{{STATUS}}', response.data.gateway_response.toUpperCase())
      .replace('{{BANK}}', response.data.authorization.bank.toUpperCase())
      .replace('{{EMAIL}}', response.data.customer.email)
      .replace('{{TYPE}}', response.data.authorization.channel.toUpperCase())
      .replace('{{CARD-TYPE}}', response.data.authorization.card_type.toUpperCase())
      .replace('{{CURRENCY}}', response.data.currency.toUpperCase())
      .replace('{{REFERENCE-NUMBER}}', response.data.reference)
    payment_info.innerHTML = p
  })

let fetchOrderDetails = () => {
  fetch(`https://localhost:5001/api/Order/Get/${orderId}`)
    .then(res => res.json())
    .then(function(response){
      console.log(response)
      cart_info.innerHTML = ""
      total.innerText
      let t = 0
      response.data.orderDtos.forEach(x => {
        let ct = cartItems
        .replace('{{Q}}', x.quantityBought)
        .replace('{{PRODUCT-NAME}}', x.productDto.name)
        .replaceAll('{{TOTAL}}', x.amountPaid)
        t += x.amountPaid
        cart_info.innerHTML += ct
      })
      total.innerText = "₦" + t
    })
}
fetchOrderDetails()

