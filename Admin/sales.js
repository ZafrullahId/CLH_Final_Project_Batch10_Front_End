let table_body = document.querySelector('.t-body');

let TABLEBODYTEMPLATE = ` <tr>
<td>{{COUNT}}</td>
<td>{{PRODUCT-NAME}}</td>
<td>{{PRODUCT-PRICE}}</td>
<td class="quantity">{{QUANTITY-BOUGHT}}</td>
<td>{{AMOUNT-PAID}}</td>
<td style="width: 160px;">{{DATE-BOUGHT}}</td>
<td>{{CUSTOMER-NAME}}</td>
<td>{{PHONE-NUMBER}}</td>
</tr>`

let getAllSales = () => {
    fetch('https://localhost:5001/api/Sales/GetAllSales')
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
                .replace('{{QUANTITY-BOUGHT}}',x.quantityBought)
                .replace('{{AMOUNT-PAID}}',x.amountPaid)
                .replace('{{DATE-BOUGHT}}',x.orderedDate)
                .replace('{{CUSTOMER-NAME}}',x.customerDto.fullName)
                .replace('{{PHONE-NUMBER}}',x.customerDto.phoneNumber)
                table_body.innerHTML += sales;
                count++;
            });
        })
}
let thisYearSales = () => {
    fetch('https://localhost:5001/api/Sales/GetThisYearSales')
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
                .replace('{{QUANTITY-BOUGHT}}',x.quantityBought)
                .replace('{{AMOUNT-PAID}}',x.amountPaid)
                .replace('{{DATE-BOUGHT}}',x.orderedDate)
                .replace('{{CUSTOMER-NAME}}',x.customerDto.fullName)
                .replace('{{PHONE-NUMBER}}',x.customerDto.phoneNumber)
                table_body.innerHTML += sales;
                count++;
            });
        })
}
let thisMonthSales = () => {
    fetch('https://localhost:5001/api/Sales/GetThisMonthSales')
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
                .replace('{{QUANTITY-BOUGHT}}',x.quantityBought)
                .replace('{{AMOUNT-PAID}}',x.amountPaid)
                .replace('{{DATE-BOUGHT}}',x.orderedDate)
                .replace('{{CUSTOMER-NAME}}',x.customerDto.fullName)
                .replace('{{PHONE-NUMBER}}',x.customerDto.phoneNumber)
                table_body.innerHTML += sales;
                count++;
            });
        })
}

let sales = [];

fetch('https://localhost:5001/api/Sales/GetAllSales')
    .then(res => res.json())
        .then(data => sales.push(...data.data));

function findMatches(wordToMatch, sales)
{
    return sales.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.customerDto.fullName.match(regex) || x.orderedDate.match(regex) || x.productDto.name.match(regex);
    })
}
function displayMatches(){
            let count = 0;
            const matchObj = findMatches(this.value, sales);
            const html = matchObj.map(x => {
                
                count++;
                return  `<tr>
                <td>${count}</td>
                <td>${x.productDto.name}</td>
                <td>${x.productDto.price}</td>
                <td class="quantity">${x.quantityBought}</td>
                <td>${x.amountPaid}</td>
                <td style="width: 160px;">${x.orderedDate}</td>
                <td>${x.customerDto.fullName}</td>
                <td>${x.customerDto.phoneNumber}</td>
                </tr>`
            }).join('')
            if(searchInput.value == '')
            {
                getAllSales();
            }
            console.log(html);
            table_body.innerHTML = html;
}
const searchInput = document.querySelector('#search');
searchInput.addEventListener('change',displayMatches);
searchInput.addEventListener('keyup',displayMatches);

getAllSales()