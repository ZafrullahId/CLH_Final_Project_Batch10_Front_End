let table_body = document.querySelector('.t-body');
let sales_table_head = document.getElementById("table-head")
let year = document.querySelector('.yearpicker')


let TABLEBODYTEMPLATE = ` <tr>
<td>{{COUNT}}</td>
<td>{{PRODUCT-NAME}}</td>
<td>{{PRODUCT-PRICE}}</td>
<td>{{AMOUNT-EARNED}}</td>
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
<td><input type="submit" class="btn btn-primary" value="Details" style="font-size: 12px;" id="{{ID}}" onclick="displayAddressForOrder({{ADRESS-ID}})"></td>
</tr>`
 
let SALESTABLEHEADTEMPLATE = `<tr>
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
    fetch(`https://localhost:5001/api/Sales/GetSalesForThYear/${year.value}`)
    .then(res => res.json())
        .then(function (response) {
            table_body.innerHTML = "";
            // window.alert(response.message);
            
            let count = 1;
            response.data.forEach(x => {
                let sales = TABLEBODYTEMPLATE
                .replace('{{COUNT}}', count)
                .replace('{{PRODUCT-NAME}}',x.productDto.name)
                .replace('{{PRODUCT-PRICE}}',x.productDto.price)
                .replace('{{AMOUNT-EARNED}}',x.amountPaid)
                .replace('{{PRODUCT-ID}}',x.productDto.productId)
                .replace('{{ID}}',x.productDto.productId)
                count++;
                table_body.innerHTML += sales;
            });
        })
}

let displayDetailsforProduct = (id) => {
    fetch(`https://localhost:5001/api/Sales/GetSalesByProductNameForTheYear/${id}/${year.value}`)
    .then(res => res.json())
    .then(function(response){
        let matchestodisplay = document.getElementById(`${id}`)
        // window.alert(matchestodisplay.id)
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
            .replace('{{DELIVERED-DATE}}',x.deliveredDate)
            .replace('{{ADRESS-ID}}',x.addressId)
            .replace('{{ID}}',x.productDto.productId)
            count++
            table_body.innerHTML += st
        })
    })
}
// let thisYearSales = () => {
//     fetch('https://localhost:5001/api/Sales/GetThisYearSales')
//     .then(res => res.json())
//         .then(function (response) {
//             table_body.innerHTML = "";
//             // window.alert(response.message);
//             let count = 1;
//             response.data.forEach(x => {
//                 let sales = TABLEBODYTEMPLATE
//                 .replace('{{COUNT}}', count)
//                 .replace('{{PRODUCT-NAME}}',x.productDto.name)
//                 .replace('{{PRODUCT-PRICE}}',x.productDto.price)
//                 .replace('{{QUANTITY-BOUGHT}}',x.quantityBought)
//                 .replace('{{AMOUNT-PAID}}',x.amountPaid)
//                 .replace('{{DATE-BOUGHT}}',x.orderedDate)
//                 .replace('{{CUSTOMER-NAME}}',x.customerDto.fullName)
//                 .replace('{{PHONE-NUMBER}}',x.customerDto.phoneNumber)
//                 table_body.innerHTML += sales;
//                 count++;
//             });
//         })
// }
// let thisMonthSales = () => {
//     fetch('https://localhost:5001/api/Sales/GetThisMonthSales')
//     .then(res => res.json())
//         .then(function (response) {
//             table_body.innerHTML = "";
//             // window.alert(response.message);
//             let count = 1;
//             response.data.forEach(x => {
//                 let sales = TABLEBODYTEMPLATE
//                 .replace('{{COUNT}}', count)
//                 .replace('{{PRODUCT-NAME}}',x.productDto.name)
//                 .replace('{{PRODUCT-PRICE}}',x.productDto.price)
//                 .replace('{{QUANTITY-BOUGHT}}',x.quantityBought)
//                 .replace('{{AMOUNT-PAID}}',x.amountPaid)
//                 .replace('{{DATE-BOUGHT}}',x.orderedDate)
//                 .replace('{{CUSTOMER-NAME}}',x.customerDto.fullName)
//                 .replace('{{PHONE-NUMBER}}',x.customerDto.phoneNumber)
//                 table_body.innerHTML += sales;
//                 count++;
//             });
//         })
// }

let sales = [];
function fetchdata(id) {
    sales = []
    fetch(`https://localhost:5001/api/Sales/GetSalesByProductNameForTheYear/${id}/${2023}`)
        .then(res => res.json())
            .then(data => sales.push(...data.data));
}

function findMatches(wordToMatch, sales)
{
    return sales.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.customerDto.fullName.match(regex) || x.orderedDate.match(regex) || x.deliveredDate.match(regex) || x.customerDto.phoneNumber.match(regex);
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
                <td style="white-space: normal">${x.deliveredDate}</td>
                <td><input type="submit" class="btn btn-primary" value="Details" style="font-size: 12px;" id="${x.productDto.productId}" onclick="displayAddressForOrder(${x.addressId})"></td>
                </tr>`
            }).join('')
            if(searchInput.value == '')
            {
                let matchestodisplay = document.getElementById(`${id}`)
                displayDetailsforProduct(matchestodisplay.id);
            }
            // console.log(html);
            table_body.innerHTML = html;
}
const searchInput = document.querySelector('#search');
searchInput.addEventListener('change',displayMatches);
searchInput.addEventListener('keyup',displayMatches);
// const select_year = document.querySelector('#select-year')
// select_year.addEventListener('change',getAllSales)

function display() {
    getAllSales()
}
var date = new Date()
year.value = date.getFullYear()
getAllSales()