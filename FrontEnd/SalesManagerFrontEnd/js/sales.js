let t_body = document.querySelector('.tbody')
let products = document.querySelector('#product')
let ORDERTABLETEMPLATE = `<tr>
<td>{{COUNT}}</td>
<td><a href="#"><img src="http://127.0.0.1:5501/wwwroot/Images/{{IMAGE}}" style="width: 40px; height: 40px;" class="avatar" alt="customer image">
        {{CUSTOMER-NAME}}</a></td>
<td><a href="#" class="view" title="View Delivery Address" data-toggle="tooltip" onclick=deleveryAddress({{ADDRESS-ID}})><i
    class="material-icons">&#xE5C8;</i></a></td>
<td>{{ORDERED-DATED}}</td>
<td>{{DELIVERED-DATED}}</td>
<td>&#8358;{{NET-AMOUNT}}</td>
<td>
    <a href="#" class="view" title="View Ordered Product" data-toggle="tooltip" onclick=getOrderedProducts({{PRODUCT-ID}})>
    <i class="material-icons">&#xE5C8;</i>
    </a>
</td>
</tr>`

let sales = () => {
    t_body.innerHTML = ""
    let count = 1;
    let jsonUrl = `https://localhost:5001/api/Sales/GetAllSales`
    fetchdata(jsonUrl)
    fetch(jsonUrl)
        .then(res => res.json())
        .then(function (response) {
            response.data.forEach(x => {
                let sales = ORDERTABLETEMPLATE
                    .replace('{{COUNT}}', count)
                    .replace('{{IMAGE}}', x.customerDto.imageUrl)
                    .replace('{{ORDERED-DATED}}', x.orderDtos[0].orderedDate)
                    .replace('{{DELIVERED-DATED}}', x.orderDtos[0].deleveredDate)
                    .replace('{{CUSTOMER-NAME}}', x.customerDto.fullName)
                    .replace('{{NET-AMOUNT}}', x.amountPaid)
                    .replace('{{PRODUCT-ID}}', x.orderId)
                    .replace('{{ADDRESS-ID}}', x.addressId)
                t_body.innerHTML += sales
                count++
            });
        })

}

fetch('https://localhost:5001/api/Product/GetAll')
.then(res => res.json())
.then(function(value){
    // products.innerHTML = ""
    value.data.forEach(x => {
        products.innerHTML += `<option value="${x.productId}">${x.name}</option>`
    })
})

let getOrderedProducts = (id) => {
    var form = document.createElement("div");
    form.classList.add("products")
    let html = `<div class="">
    <div class="card-1 card">
<img class="product-image" src="http://127.0.0.1:5501/wwwroot/Images/{{IMAGE}}" alt="product image">
<span class="product-price">{{PRODUCT-NAME}}</span>
<small>x{{QUANTITY}}</small>
<span class="product-price">&#8358;{{PRICE}}</span>
</div>
    </div>
    `;


    fetch(`https://localhost:5001/api/Order/Get/${id}`)
        .then(res => res.json())
        .then(function (response) {
            // dropdouwn.innerHTML = ""
            response.data.orderDtos.forEach(x => {
                let ordered_product = html
                    .replace('{{IMAGE}}', x.productDto.imageUrl)
                    .replace('{{PRODUCT-NAME}}', x.productDto.name)
                    .replace('{{PRICE}}', x.productDto.price)
                    .replace('{{QUANTITY}}', x.quantityBought)
                form.innerHTML += ordered_product
            })
        })
    swal({
        title: 'Ordered Products',
        text: null,
        showCancelButton: true,
        closeOnConfirm: false,
        content: form,
        buttons: {
            cancel: "Cancel",
            catch: {
                text: "Ok",
            },
        }
    })
}


let deleveryAddress = (id) => {
    fetch(`https://localhost:5001/api/Address/GetById/${id}`)
        .then(res => res.json())
        .then(function (response) {
            if (response.success == true) {
                let form = document.createElement("div")
                form.classList.add("delivery-address")
                //    let html = `<address style=\"align-items: start;\">State: ${response.data.state}<br>City: ${response.data.city}<br>Street: ${response.data.street}<br>Zip Code: ${response.data.postalCode}</address>`
                let html = `<address><i>State: ${response.data.state}</i><i>City: ${response.data.city}</i><i>Street: ${response.data.street}</i><i>Zip Code: ${response.data.postalCode}</i></address>`
                form.innerHTML = html
                swal({
                    title: 'Delivery Address',
                    text: null,
                    showCancelButton: true,
                    closeOnConfirm: false,
                    content: form,
                    buttons: {
                        // cancel: "Cancel",
                        catch: {
                            text: "Ok",
                        },
                    }
                })
            }
        })
}

let filterTableByProductName = (value) => {
    let jsonUrl = "" 
    console.log(value)
    if (value == "0") {
        sales()
    }
    else {
        jsonUrl = `https://localhost:5001/api/Sales/GetSalesByProductNameForTheYear/${value}/2023`
        fetchdata(jsonUrl)
    }
    fetch(jsonUrl)
    .then(res => res.json())
        .then(function (response) {
            t_body.innerHTML = ""
            let count = 1
            response.data.forEach(x => {
                let sales = ORDERTABLETEMPLATE
                    .replace('{{COUNT}}', count)
                    .replace('{{IMAGE}}', x.customerDto.imageUrl)
                    .replace('{{ORDERED-DATED}}', x.orderedDate)
                    .replace('{{DELIVERED-DATED}}', x.deleveredDate)
                    .replace('{{CUSTOMER-NAME}}', x.customerDto.fullName)
                    .replace('{{NET-AMOUNT}}', x.amountPaid)
                    .replace('{{ADDRESS-ID}}', x.addressId)
                t_body.innerHTML += sales
                count++
            });
        })
}

let delivered_order = []

let fetchdata = (endpoint) => {
    delivered_order = []
    fetch(endpoint)
    .then(res => res.json())
    .then(data => delivered_order.push(...data.data));
}

function findMatches(wordToMatch, sales) {
    return sales.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.customerDto.fullName.match(regex);
    })
}

function displayMatches() {
    let count = 0;
    const matchObj = findMatches(this.value, delivered_order);
    const html = matchObj.map(x => {
        count++;
        return `<tr>
        <td>${count}</td>
        <td><a href="#"><img src="http://127.0.0.1:5501/wwwroot/Images/${x.customerDto.imageUrl}" style="width: 40px; height: 40px;" class="avatar" alt="customer image">
                ${x.customerDto.fullName}</a></td>
        <td><a href="#" class="view" title="View Delivery Address" data-toggle="tooltip" onclick=deleveryAddress(${x.addressId})><i
            class="material-icons">&#xE5C8;</i></a></td>
        <td>${x.orderDtos[0].orderedDate}</td>
        <td>${x.orderDtos[0].deleveredDate}</td>
        <td>&#8358;${x.amountPaid}</td>
        <td>
            <a href="#" class="view" title="View Ordered Product" data-toggle="tooltip" onclick=getOrderedProducts(${x.orderId})>
            <i class="material-icons">&#xE5C8;</i>
            </a>
        </td>
        </tr>`
    }).join('')
    
    t_body.innerHTML = html;
    console.log(t_body.innerHTML)
}



const searchInput = document.querySelector('#search');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
sales()