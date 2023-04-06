let table_body = document.querySelector('.t-body');
let sales_table_head = document.getElementById("table-head")
let year = document.querySelector('.yearpicker')
let colexp = document.querySelector(".colpas")
let search_Input = document.querySelector('#look-for')

let TABLEBODYTEMPLATE = ` <tr>
<td>{{COUNT}}</td>
<td>{{PRODUCT-NAME}}</td>
<td>{{PRODUCT-PRICE}}</td>
<td>{{AMOUNT-EARNED}}</td>
<td>{{QUANTITY-BOUGHT}}</td>
<td><input type="submit" class="btn btn-primary" value="Details" style="font-size: 12px;" id="{{ID}}" onclick="displayDetailsforProduct({{PRODUCT-ID}})"></td>
</tr>`

let DETAILEDTABLEBODYTEMPLATE = ` <tr>
<td>{{COUNT}}</td>
<td style="text-align: center;">
    <div class="email">
        <div class="img" style="text-align: center !important;">
            <img src="http://127.0.0.1:5501/wwwroot/Images/{{CUSTOMER-IMAGE}}" alt="" style="width: 50px; height: 50px;" class="rounded-circle">
        </div>
        <span style="font-size: 11px;">{{CUSTOMER-NAME}}</span>
    </div>
</td>
<td>{{QUANTITY}}</td>
<td>{{AMOUNT-PAIED}}</td>
<td>{{PHONE}}</td>
<td style="white-space: normal">{{ORDERED-DATE}}</td>
<td style="white-space: normal">{{DELIVERED-DATE}}</td>
<td><input type="submit" class="btn btn-primary" value="Address Details" style="font-size: 12px;" id="{{ID}}" onclick="displayAddressForOrder({{ADRESS-ID}})"></td>
</tr>`
 
let SALESTABLEHEADTEMPLATE = `
<tr>
<th scope="col">S/N</th>
<th scope="col">Customer</th>
<th scope="col">Quantity Bought</th>
<th scope="col">Amount Paied</th>
<th scope="col">Phone No</th>
<th scope="col">Ordered Date</th>
<th scope="col">Delivered Date</th>
<th scope="col">Action</th>
</tr>`
{/* <a href="" class="btn btn-primary" onclick="displayDetailsforProduct({{PRODUCT-ID}})" style="font-size: 12px;">Details</a> */}
let getAllSales = () => {
    fetch(`https://localhost:5001/api/Sales/GetSalesForTheYearOnEachProduct/${year.value}`)
    .then(res => res.json())
        .then(function (response) {
            sales_table_head.innerHTML = `<tr>
            <th scope="col">S/N</th>
            <th scope="col">Product name</th>
            <th scope="col">Product Price</th>
            <th scope="col">Amount Earned</th>
            <th scope="col">Quantity</th>
            <th scope="col">Action</th>
        </tr>`
            table_body.innerHTML = "";
            // window.alert(response.message);
            
            let count = 1;
            response.data.forEach(x => {
                let sales = TABLEBODYTEMPLATE
                .replace('{{COUNT}}', count)
                .replace('{{PRODUCT-NAME}}',x.productDto.name)
                .replace('{{PRODUCT-PRICE}}',x.productDto.price)
                .replace('{{AMOUNT-EARNED}}',x.amountPaid)
                .replace('{{QUANTITY-BOUGHT}}',x.quantityBought)
                .replace('{{PRODUCT-ID}}',x.productDto.productId)
                .replace('{{ID}}',x.productDto.productId)
                .replace('{{PRICE}}',x.productDto.productId)
                count++;
                table_body.innerHTML += sales;
            });
        })
}

let displayDetailsforProduct = (id) => {
    fetch(`https://localhost:5001/api/Sales/GetSalesByProductNameForTheYear/${id}/${year.value}`)
    .then(res => res.json())
    .then(function(response){
        search_Input.innerHTML = `<input class="form-control border-0 fa fa-search" type="search" placeholder="Search" id="search">`
        events()
        let matchestodisplay = document.getElementById(`${id}`)
        // window.alert(matchestodisplay.id)
        colexp.children[0].innerHTML = `<input type="submit" name="" id="" value="Colaps" style="padding: 0px 7px 0px 7px;" onclick="reload()">`
        // console.log(colexp)
        fetchdata(matchestodisplay.id)
        table_body.innerHTML = ""
        sales_table_head.innerHTML = SALESTABLEHEADTEMPLATE
        let count = 1;
        response.data.forEach(x => {
            let st = DETAILEDTABLEBODYTEMPLATE
            .replace('{{COUNT}}',count)
            .replace('{{CUSTOMER-IMAGE}}',x.customerDto.imageUrl)
            .replace('{{CUSTOMER-NAME}}',x.customerDto.fullName)
            .replace('{{QUANTITY}}',x.quantityBought)
            .replace('{{AMOUNT-PAIED}}',x.amountPaid)
            .replace('{{PHONE}}',x.customerDto.phoneNumber)
            .replace('{{ORDERED-DATE}}',x.orderedDate)
            .replace('{{DELIVERED-DATE}}',x.deleveredDate)
            .replace('{{ADRESS-ID}}',x.addressId)
            .replace('{{ID}}',x.productDto.productId)
            count++
            table_body.innerHTML += st
        })
    })
}

let reload = () =>{
    location.reload()
}

let sales = [];
function fetchdata(id) {
    sales = []
    fetch(`https://localhost:5001/api/Sales/GetSalesByProductNameForTheYear/${id}/${year.value}`)
        .then(res => res.json())
            .then(data => sales.push(...data.data));
}

function findMatches(wordToMatch, sales)
{
    return sales.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.customerDto.fullName.match(regex) || x.orderedDate.match(regex) || x.deleveredDate.match(regex) || x.customerDto.phoneNumber.match(regex);
    })
}
function displayMatches(){
            let count = 0;
            const matchObj = findMatches(this.value, sales);
            let id = sales[0].productDto.productId
            const html = matchObj.map(x => {
                count++;
                return  `<tr>
                <td>${count}</td>
                <td style="text-align: center;">
                    <div class="email">
                        <div class="img" style="text-align: center !important;">
                            <img src="http://127.0.0.1:5501/wwwroot/Images/${x.customerDto.imageUrl}" alt="" style="width: 50px; height: 50px;" class="rounded-circle">
                        </div>
                        <span style="font-size: 11px;">${x.customerDto.fullName}</span>
                    </div>
                </td>
                <td>${x.quantityBought}</td>
                <td>${x.amountPaid}</td>
                <td>${x.customerDto.phoneNumber}</td>
                <td style="white-space: normal">${x.orderedDate}</td>
                <td style="white-space: normal">${x.deleveredDate}</td>
                <td><input type="submit" class="btn btn-primary" value="Address Details" style="font-size: 12px;" id="${x.productDto.productId}" onclick="displayAddressForOrder(${x.addressId})"></td>
                </tr>`
            }).join('')
            // if(searchInput.value == '')
            // {
            //     let matchestodisplay = document.getElementById(`${id}`)
            //     displayDetailsforProduct(matchestodisplay.id);
            // }
            // console.log(html);
            table_body.innerHTML = html;
}
function events() {
    const searchInput = document.querySelector('#search');
    searchInput.addEventListener('change',displayMatches);
    searchInput.addEventListener('keyup',displayMatches);
    
}
// const select_year = document.querySelector('#select-year')
// select_year.addEventListener('change',getAllSales)

function display() {
    getAllSales()
}
var date = new Date()
year.value = date.getFullYear()
function displayAddressForOrder(id) {
    fetch(`https://localhost:5001/api/Address/GetById/${id}`)
    .then(res => res.json())
    .then(function(response){
        if (response.success == true) {
            Swal.fire({
                title: "<i>Address</i>", 
                html: `<address style=\"align-items: start;\">State: ${response.data.state}<br>City: ${response.data.city}<br>Street: ${response.data.street}<br>Zip Code: ${response.data.postalCode}</address>`,  
                confirmButtonText: "Ok", 
              });
            
        }
    })
}
getAllSales()