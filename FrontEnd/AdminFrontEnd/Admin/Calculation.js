let profit = document.querySelector('#profit');
let percentage = document.querySelector('#profit-percentage');
let present_month = document.querySelectorAll('#present-month');
let mnth = document.querySelector('#months');
let present_month_cost = document.querySelector('#cost');
let exp_month = document.querySelector('#expmonths');
let sales_month = document.querySelector('#salemonth');
let table_row = document.querySelector('#sales_table');
let sales_on_a_product = document.querySelector('#sales-table');
let table_head = document.querySelector('#t-head');
let show_all = document.querySelector('#colaps');
let year = document.querySelector('.yearpicker');
let graph = document.querySelector('#first-graph')
// graph.innerHTML = ""

let displayProfit = () => {
    fetch('https://localhost:5001/api/Sales/CalculateProfit')
        .then(res => res.json())
        .then(function (response) {
            profit.innerHTML = "";
            if (response.data.profit == 0) {
                profit.innerText = "₦" + "0.00";
            }
            else {
                profit.innerText = "₦" + response.data.profit
            }
            // percentage.innerHTML = Math.ceil(response.data.percentage) + "%"
        })
}

let displayMonth = () => {
    var date = new Date;
    switch (date.getMonth()) {
        case 0:
            present_month.forEach(element => {
                element.innerHTML = 'January'
                element.value = 1;
            });

            break;
        case 1:
            present_month.forEach(element => {
                element.innerHTML = 'Febuary';
                element.value = 2;
            });

            break;
        case 2:
            present_month.forEach(element => {
                element.innerHTML = 'March';
                element.value = 3;
            });


            break;
        case 3:
            present_month.forEach(element => {
                element.innerHTML = 'April';
                element.value = 4;
            });

            break;
        case 4:
            present_month.forEach(element => {
                element.innerHTML = 'May';
                element.value = 5;
            });

            break;
        case 5:
            present_month.forEach(element => {
                element.innerHTML = 'June';
                element.value = 6;
            });

            break;
        case 6:
            present_month.forEach(element => {
                element.innerHTML = 'July';
                element.value = 7;
            });

            break;
        case 7:
            present_month.forEach(element => {
                element.innerHTML = 'August';
                element.value = 8;
            });

            break;
        case 8:
            present_month.forEach(element => {
                element.innerHTML = 'September';
                element.value = 9;
            });

            break;
        case 9:
            present_month.forEach(element => {
                element.innerHTML = 'October';
                element.value = 10;
            });

            break;
        case 10:
            present_month.forEach(element => {
                element.innerHTML = 'November';
                element.value = 11;
            });

            break;
        case 11:
            present_month.forEach(element => {
                element.innerHTML = 'December';
                element.value = 12;
            });

            break;

        default:
            break;
    }
}

displayProfitForSelectedMonth = () => {
    fetch(`https://localhost:5001/api/Sales/CalculateProfit/${mnth.value}/${year.value}`)
        .then(res => res.json())
        .then(function (response) {
            console.log(year.value);
            if (response.data == null) {
                profit.innerText = "₦" + "0.00";
                percentage.innerHTML = "";
            }
            else {
                profit.innerHTML = "";
                profit.innerText = "₦" + response.data.profit
                percentage.innerHTML = Math.ceil(response.data.percentage) + "%"
            }
        })
}

dist = () => {
    displayProfitForSelectedMonth()
    displayCostForSelectedMonth();
    monthlySalseTable();
}

displayCostForThePresentmonth = () => {
    fetch('https://localhost:5001/api/RawMaterial/CalculateCostOfRawMaterialsForTheMonth')
        .then(res => res.json())
        .then(function (response) {
            if (response.data == null) {
                present_month_cost.innerText = "₦" + "0.00"
            }
            else {
                present_month_cost.innerText =  "₦" + response.data.cost
            }
        })
}

displayCostForSelectedMonth = () => {
    fetch(`https://localhost:5001/api/RawMaterial/GetAllAprovedMonthlyRawMaterial/${exp_month.value}/${year.value}`)
        .then(res => res.json())
        .then(function (response) {
            if (response.data == null) {
                present_month_cost.innerText = "₦" + "0.00"
            }
            else {
                let cost = 0;
                for (let i = 0; i < response.data.length; i++) {
                    cost += response.data[i].cost;
                }
                present_month_cost.innerText = "₦" + cost;
            }
        })
}

let TABLETEMPLATE = `<tr>
<td>{{COUNT}}</td>
<td>{{PRODUCT}}</td>
<td><img src="http://127.0.0.1:5502/wwwroot/Images/{{IMAGE}}" alt="" style="width: 40px; height: 40px;"></td>
<td id="id{{ID}}">&#8358; {{PRICE}}</td>
<td>{{QUANTITY}}</td>
<td>₦{{AMOUNT}}</td>
<td><a class="btn btn-sm btn-primary" onclick="getFullInfoOnAProductForTheMonth({{PRODUCT-ID}})">Detail</a></td>
</tr>`
let monthlySalseTable = () => {
    fetch(`https://localhost:5001/api/Sales/GetSalesForTheMonth/${sales_month.value}/${year.value}`)
        .then(res => res.json())
        .then(function (response) {
            table_row.innerHTML = "";
            // console.log(response.data[0].productDto.name);
            let count = 1;
            response.data.forEach(x => {
                // console.log(x.productDto.name)
                let sales = TABLETEMPLATE
                    .replace('{{COUNT}}', count)
                    .replace('{{PRODUCT}}', x.productDto.name)
                    .replace('{{IMAGE}}', x.productDto.imageUrl)
                    .replace('{{PRICE}}', x.productDto.price)
                    .replace('{{QUANTITY}}', x.quantityBought)
                    .replace('{{AMOUNT}}', x.amountPaid)
                    .replace('{{PRODUCT-ID}}', x.productDto.productId)
                    .replace('{{ID}}', x.productDto.productId)
                count++;
                table_row.innerHTML += sales;
            })
        })
}

let SALESTABLETEMPLATE = `<tr class="alert" role="alert">
<td style="padding-left: 35px !important">{{COUNT}}</td>
<td style="padding-left: 80px !important">{{QUANTITY}}</td>
<td class="quantity" style="padding-left: 50px !important">
₦{{AMOUNT-PAID}}
</td>
<td style="text-align: center;">
<div class="email">
<div class="img" style="text-align: center !important;">
<img src="http://127.0.0.1:5502/wwwroot/Images/{{CUSTOMER-IMAGE}}" alt="" style="width: 55px; height: 55px;" class="rounded-circle"></div>
<span style="font-size: 13px;">{{CUSTOMER-NAME}}</span>
</div>
</td>
<td style="padding-left: 40px !important;">{{PHONE}}</td>
</tr>
`
let TABLEHEADTEMPLATE = `<tr>
<th style="border: none !important;padding: 30px;font-size: 13px;font-weight: 600;">S/N</th>
<th style="border: none !important;padding: 30px;font-size: 13px;font-weight: 600; padding-left: 40px !important;">Quantity Bought</th>
<th style="white-space: nowrap;border: none !important;padding: 30px;font-size: 13px;font-weight: 600;">Amount paid</th>
<th style="text-align: center;border: none !important;padding: 30px;font-size: 13px;font-weight: 600;">Customer</th>
<th style="border: none !important;padding: 30px;font-size: 13px;font-weight: 600;">Phone number</th>
</tr>`

let getFullInfoOnAProductForTheMonth = (id) => {
    fetch(`https://localhost:5001/api/Sales/GetSalesByProductNameForTheMonth/${id}/${sales_month.value}/${year.value}`)
        .then(res => res.json())
        .then(function (response) {
            let price = document.querySelector(`#id${id}`)
            console.log(response.data)
            console.log(response.data[0].quantityBought);
            show_all.innerHTML = `<a style="cursor: pointer; color: #009CFF;" onclick="reload()">Colaps</a>`
            table_head.innerHTML = "";
            table_head.innerHTML = TABLEHEADTEMPLATE;
            let count = 1;
            table_row.innerHTML = "";
            response.data.forEach(x => {
                let sales = SALESTABLETEMPLATE
                    .replace('{{COUNT}}', count)
                    .replace('{{QUANTITY}}', x.amountPaid / price.innerText.split(" ")[1])
                    .replace('{{AMOUNT-PAID}}', x.amountPaid)
                    .replace('{{CUSTOMER-IMAGE}}', x.customerDto.imageUrl)
                    .replace('{{CUSTOMER-NAME}}', x.customerDto.fullName)
                    .replace('{{PHONE}}', x.customerDto.phoneNumber)
                count++;
                table_row.innerHTML += sales;
            })
        })
}

function reload() {
    monthlySalseTable();
    table_head.innerHTML = `<tr class="text-dark">
    <th scope="col">S/N</th>
    <th scope="col">Product</th>
    <th scope="col">Image</th>
    <th scope="col">Price</th>
    <th scope="col">Quantity</th>
    <th scope="col">Amount</th>
    <th scope="col">Action</th>
</tr>`
}

let calculateNetProfit = () => {

    var form = document.createElement("div");
    form.style.paddingLeft = "30px"
    let html = `<div>
                 <input type="month" class="form-control" style="width:90%;" id="monthNetProfit" required>
                 </br>
                 <input type="number" class="form-control" style="width:90%;" id="monthExtraexpense" placeholder="Amount" required>
                 </div>
                 `;
    form.innerHTML = html
    swal({
        title: 'NET PROFIT',
        text: 'Input date and amount',
        showCancelButton: true,
        closeOnConfirm: false,
        content: form,
        buttons: {
            cancel: "Cancel",
            catch: {
                text: "GET",
            },
        }
    }).then(function () {
        var extraexp = document.getElementById("monthExtraexpense");
        var monthNet = document.getElementById("monthNetProfit");
        if (extraexp.value == "" || monthNet.value == "") {
            return false

        }
        else {
            let y = monthNet.value.split("-")[0]
            let m = monthNet.value.split("-")[1]
            fetch(`https://localhost:5001/api/Sales/CalculateNetProfit/${m}/${y}/${extraexp.value}`)
                .then(res => res.json())
                .then(function (response) {
                    var mt = getMonthName(m)
                    // swal("NET PROFIT", `The net profit for the month ${mt} ${y} is ${response.data.profit}`, "success");
                    swal({
                        text: `The net profit for the month of ${mt} ${y} is ₦${response.data.profit}`,
                    });
                    // window.alert(monthNet.value.toDate())
                })
        }

    })
}

function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', { month: 'long' });
}


var date = new Date();
year.value = date.getFullYear();

displayMonth()
displayProfit();
monthlySalseTable()
displayCostForThePresentmonth()
displayProfit()