let size = document.querySelector('#table-size')
let t_body = document.querySelector('.tbody')
let swalcontent = document.querySelector('.swal-content')
// let dropdouwn = document.querySelector('.items-container')
// let main = document.querySelector('#main')
let state = ""
let status_text = ""
size.addEventListener('change', (x) => {
    x.preventDefault()
    for (let index = 5; index < 15; index++) {
        t_body.children[index].setAttribute("hidden", "")
    }
    for (let index = 5; index < size.value; index++) {
        t_body.children[index].removeAttribute("hidden");
    }
})

let ORDERTABLETEMPLATE = `<tr>
<td>{{COUNT}}</td>
<td><a href="#"><img src="http://127.0.0.1:5501/wwwroot/Images/{{IMAGE}}" style="width: 40px; height: 40px;" class="avatar" alt="customer image">
        {{CUSTOMER-NAME}}</a></td>
<td><a href="#" class="view" title="View Delivery Address" data-toggle="tooltip" onclick=deleveryAddress({{ADDRESS-ID}})><i
    class="material-icons">&#xE5C8;</i></a></td>
<td>{{ORDERED-DATED}}</td>
<td><span class="status {{ISDELIVERED}}">&bull;</span>{{STATUS}}</td>
<td>&#8358;{{NET-AMOUNT}}</td>
<td>
    <a href="#" class="view" title="View Ordered Product" data-toggle="tooltip" onclick=getOrderedProducts({{PRODUCT-ID}})>
    <i class="material-icons">&#xE5C8;</i>
    </a>
</td>
</tr>`

let DROPDOWNTEMPLATE = `<div class="card-1 card">
<img class="product-image" src="http://127.0.0.1:5501/wwwroot/Images/{{IMAGE}}" alt="product image">
<span class="product-price">{{PRODUCT-NAME}}</span>
<span class="product-price">&#8358;{{PRICE}}</span>
</div>`

let displayFilteredOrderTable = (filter_value) => {

    if (filter_value == "pending") {
        fetch(`https://localhost:5001/api/Order/GetAllUnDeleveredOrders`)
            .then(res => res.json())
            .then(function (response) {
                state = "text-warning"
                status_text = "Pending"
                t_body.innerHTML = ""
                let count = 1;
                response.data.forEach(x => {
                    fetchdata(`https://localhost:5001/api/Order/GetAllUnDeleveredOrders`);
                    let order = ORDERTABLETEMPLATE
                        .replace('{{COUNT}}', count)
                        .replace('{{IMAGE}}', x.customerDto.imageUrl)
                        .replace('{{ORDERED-DATED}}', x.orderDtos[0].orderedDate)
                        .replace('{{CUSTOMER-NAME}}', x.customerDto.fullName)
                        .replace('{{STATUS}}', "Pending")
                        .replace('{{NET-AMOUNT}}', x.netAmount)
                        .replace('{{ISDELIVERED}}', "text-warning")
                        .replace('{{PRODUCT-ID}}', x.orderId)
                        .replace('{{ADDRESS-ID}}', x.addressDto.addressId)
                    t_body.innerHTML += order
                    count++
                    // }
                });
            })
    }
    else if (filter_value == "all") {
        fetch(`https://localhost:5001/api/Order/GetOrders`)
            .then(res => res.json())
            .then(function (response) {
                fetchdata(`https://localhost:5001/api/Order/GetOrders`);
                t_body.innerHTML = ""
                let count = 1;
                response.data.forEach(x => {
                    if (x.isDelivered == true) {
                        let order = ORDERTABLETEMPLATE
                            .replace('{{COUNT}}', count)
                            .replace('{{IMAGE}}', x.customerDto.imageUrl)
                            .replace('{{CUSTOMER-NAME}}', x.customerDto.fullName)
                            .replace('{{ORDERED-DATED}}', x.orderDtos[0].orderedDate)
                            .replace('{{STATUS}}', "Delivered")
                            .replace('{{NET-AMOUNT}}', x.netAmount)
                            .replace('{{ISDELIVERED}}', "text-success")
                            .replace('{{PRODUCT-ID}}', x.orderId)
                            .replace('{{ADDRESS-ID}}', x.addressDto.addressId)
                        t_body.innerHTML += order
                        count++
                    }
                    else {
                        let order = ORDERTABLETEMPLATE
                            .replace('{{COUNT}}', count)
                            .replace('{{IMAGE}}', x.customerDto.imageUrl)
                            .replace('{{ORDERED-DATED}}', x.orderDtos[0].orderedDate)
                            .replace('{{CUSTOMER-NAME}}', x.customerDto.fullName)
                            .replace('{{STATUS}}', "Pending")
                            .replace('{{NET-AMOUNT}}', x.netAmount)
                            .replace('{{ISDELIVERED}}', "text-warning")
                            .replace('{{PRODUCT-ID}}', x.orderId)
                            .replace('{{ADDRESS-ID}}', x.addressDto.addressId)
                        t_body.innerHTML += order
                        count++
                    }
                });
            })
    }
    else if (filter_value == "delivered") {
        fetch(`https://localhost:5001/api/Order/GetAllDeleveredOrders`)
            .then(res => res.json())
            .then(function (response) {
                fetchdata(`https://localhost:5001/api/Order/GetAllDeleveredOrders`);
                state = "text-success"
                status_text = "Delivered"
                t_body.innerHTML = ""
                let count = 1;
                response.data.forEach(x => {
                    // if (x.isDelivered == true) {
                    let order = ORDERTABLETEMPLATE
                        .replace('{{COUNT}}', count)
                        .replace('{{IMAGE}}', x.customerDto.imageUrl)
                        .replace('{{CUSTOMER-NAME}}', x.customerDto.fullName)
                        .replace('{{ORDERED-DATED}}', x.orderDtos[0].orderedDate)
                        .replace('{{STATUS}}', "Delivered")
                        .replace('{{NET-AMOUNT}}', x.netAmount)
                        .replace('{{ISDELIVERED}}', "text-success")
                        .replace('{{PRODUCT-ID}}', x.orderId)
                        .replace('{{ADDRESS-ID}}', x.addressDto.addressId)
                    t_body.innerHTML += order
                    count++
                });
            })
    }
}
function changeStatus() {
    let order_status = document.querySelector('#order-status');
    order_status.addEventListener('change', displayFilteredOrderTable(order_status.value))
}
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
            // main.children[1].innerText = `Net Amount: ${response.data.netAmount}`
        })
    // form.innerHTML = html
    swal({
        title: 'Ordered Products',
        text: null,
        showCancelButton: true,
        closeOnConfirm: false,
        content: form,
        buttons: {
            cancel: "Cancel",
            catch: {
                text: "Mark as Delivered",
            },
        }
    }).then(function (isConfirm) {
        if (isConfirm == "catch") {
            const options = {
                method: 'PUT',
                body: null,
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            fetch(`https://localhost:5001/api/Order/Update?id=${id}`,options)
                .then(res => res.json())
                .then(function (response) {
                    if (response.success == true) {
                        window.alert(response.message)
                        displayFilteredOrderTable("all")
                    }
                    else {
                        window.alert(response.message)
                    }
                })
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


let orders = []
let fetchdata = (endpoint) => {
    orders = []
    fetch(endpoint)
        .then(res => res.json())
        .then(data => orders.push(...data.data));

}

function findMatches(wordToMatch, sales) {
    return sales.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.customerDto.fullName.match(regex);
    })
}

function displayMatches() {
    let count = 0;
    const matchObj = findMatches(this.value, orders);
    const html = matchObj.map(x => {
        count++;
        if (x.isDelivered == true) {
            return `<tr>
            <td>${count}</td>
            <td><a href="#"><img src="http://127.0.0.1:5501/wwwroot/Images/${x.customerDto.imageUrl}" style="width: 40px; height: 40px;" class="avatar" alt="customer image">
                    ${x.customerDto.fullName}</a></td>
            <td><a href="#" class="view" title="View Delivery Address" data-toggle="tooltip"><i
                class="material-icons">&#xE5C8;</i></a></td>
            <td>${x.orderDtos[0].orderedDate}</td>
            <td><span class="status text-success">&bull;</span>Delivered</td>
            <td>&#8358;${x.netAmount}</td>
            <td>
                <a href="#" class="view" title="View Ordered Product" data-toggle="tooltip" onclick=getOrderedProducts(${x.orderId})>
                <i class="material-icons">&#xE5C8;</i>
                </a>
            </td>
            </tr>`
        }
        return `<tr>
            <td>${count}</td>
            <td><a href="#"><img src="http://127.0.0.1:5501/wwwroot/Images/${x.customerDto.imageUrl}" style="width: 40px; height: 40px;" class="avatar" alt="customer image">
                    ${x.customerDto.fullName}</a></td>
            <td><a href="#" class="view" title="View Delivery Address" data-toggle="tooltip"><i
                class="material-icons">&#xE5C8;</i></a></td>
            <td>${x.orderDtos[0].orderedDate}</td>
            <td><span class="status text-warning">&bull;</span>Pending</td>
            <td>&#8358;${x.netAmount}</td>
            <td>
                <a href="#" class="view" title="View Ordered Product" data-toggle="tooltip" onclick=getOrderedProducts(${x.orderId})>
                <i class="material-icons">&#xE5C8;</i>
                </a>
            </td>
            </tr>`
    }).join('')
    if (searchInput.value == "") {
        changeStatus()
    }

    t_body.innerHTML = html;
}

const searchInput = document.querySelector('#search');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

changeStatus()
displayFilteredOrderTable()
