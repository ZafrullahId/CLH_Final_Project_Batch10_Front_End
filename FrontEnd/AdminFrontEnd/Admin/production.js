let table_body = document.getElementsByTagName('tbody')[0]

let PRODUCTIONTABLETEMPLATE = `<tr>
<td>{{COUNT}}</td>
<td>{{PRODUCTNAME}}</td>
<td>{{QUANTITYREQUEST}} tonns</td>
<td>{{QUANTITYPRODUCED}}</td>
<td>{{QUANTITYREMAINING}}</td>
<td><span class="status {{STATUS-ICON}}">&bull;</span> {{STATUS}}</td>
<td>{{DATEREQUESTED}}</td>
<td><a href="#" class="view" title="View Raw Material Details" data-toggle="tooltip" onclick="viewRawMaterialUsed({{ID}})"><i
            class="material-icons">&#xE5C8;</i></a></td>
</tr>`


function viewRawMaterialUsed(id) {
    let list = document.createElement("ul")
    list.style.listStyleType = "none"
    fetch(`https://localhost:5001/api/Production/GetProduction/${id}`)
        .then(res => res.json())
        .then(function (response) {
            response.data.rawMaterialDto.forEach(x => {
                list.innerHTML += `<li>${x.name}</li>`
            })
        })
    swal({
        title: 'Raw Material Used',
        text: null,
        showCancelButton: true,
        closeOnConfirm: false,
        content: list,
        buttons: {
            // cancel: "Cancel",
            catch: {
                text: "Ok",
            },
        }
    })
}

function FilterTableByStatus(value) {
    console.log(value)
    let icon = ""
    if (value == "All") {
        displayPoductionTable()
        return
    }
    if (value == "Pending") {
        icon = "text-warning"
    }
    else if (value == "Approved") {
        icon = "text-success"
    }
    let url = `https://localhost:5001/api/Production/Get${value}Productions`
    fetchdata(url)
    fetch(url)
        .then(res => res.json())
        .then(function (response) {
            table_body.innerHTML = ""
            let count = 1
            response.data.forEach(x => {
                let raw = PRODUCTIONTABLETEMPLATE
                    .replace('{{COUNT}}', count)
                    .replace('{{PRODUCTNAME}}', x.productDto.name)
                    .replace('{{QUANTITYREQUEST}}', x.quantityRequest)
                    .replace('{{QUANTITYPRODUCED}}', x.quantityProduced)
                    .replace('{{QUANTITYREMAINING}}', x.quantityRemaining)
                    .replace('{{STATUS-ICON}}', 'text-success')
                    .replace('{{STATUS}}', x.approvalStatus)
                    .replace('{{DATEREQUESTED}}', x.productionDate)
                table_body.innerHTML += raw
                count++
            })
        })
}

let displayPoductionTable = () => {
    let url = `https://localhost:5001/api/Production/GetAllProductions`
    fetchdata(url)
    fetch(url)
        .then(res => res.json())
        .then(function (response) {
            table_body.innerHTML = ""
            let count = 1
            response.data.forEach(x => {
                if (x.approvalStatus == "Approved") {
                    let raw = PRODUCTIONTABLETEMPLATE
                        .replace('{{COUNT}}', count)
                        .replace('{{PRODUCTNAME}}', x.productDto.name)
                        .replace('{{QUANTITYREQUEST}}', x.quantityRequest)
                        .replace('{{QUANTITYPRODUCED}}', x.quantityProduced)
                        .replace('{{QUANTITYREMAINING}}', x.quantityRemaining)
                        .replace('{{STATUS-ICON}}', 'text-success')
                        .replace('{{STATUS}}', x.approvalStatus)
                        .replace('{{DATEREQUESTED}}', x.productionDate)
                        .replace('{{ID}}', x.productionId)
                    table_body.innerHTML += raw
                }
                else if (x.approvalStatus == "Pending") {
                    let raw = PRODUCTIONTABLETEMPLATE
                        .replace('{{COUNT}}', count)
                        .replace('{{PRODUCTNAME}}', x.productDto.name)
                        .replace('{{QUANTITYREQUEST}}', x.quantityRequest)
                        .replace('{{QUANTITYPRODUCED}}', x.quantityProduced)
                        .replace('{{QUANTITYREMAINING}}', x.quantityRemaining)
                        .replace('{{STATUS-ICON}}', 'text-warning')
                        .replace('{{STATUS}}', x.approvalStatus)
                        .replace('{{DATEREQUESTED}}', x.productionDate)
                        .replace('{{ID}}', x.productionId)
                    table_body.innerHTML += raw
                }
                else {
                    let raw = PRODUCTIONTABLETEMPLATE
                        .replace('{{COUNT}}', count)
                        .replace('{{PRODUCTNAME}}', x.productDto.name)
                        .replace('{{QUANTITYREQUEST}}', x.quantityRequest)
                        .replace('{{QUANTITYPRODUCED}}', x.quantityProduced)
                        .replace('{{QUANTITYREMAINING}}', x.quantityRemaining)
                        .replace('{{STATUS-ICON}}', 'text-danger')
                        .replace('{{STATUS}}', x.approvalStatus)
                        .replace('{{DATEREQUESTED}}', x.productionDate)
                        .replace('{{ID}}', x.productionId)
                    table_body.innerHTML += raw
                }
                count++
            });
        })
}

production = []
function fetchdata(url) {
    production = []
    fetch(url)
        .then(res => res.json())
        .then(data => production.push(...data.data));
}

function findMatches(wordToMatch, production) {

    return production.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.productDto.name.match(regex);
    })
}
function displayMatches() {
    let icon = ""
    let count = 0;
    const matchObj = findMatches(this.value, production);
    const html = matchObj.map(x => {
        if (x.approvalStatus == "Approved") {
            icon = "text-success"
        }
        else if (x.approvalStatus == "Pending") {
            icon = "text-warning"
        }
        else {
            icon = "text-danger"
        }
        count++;
        return `<tr>
        <td>${count}</td>
        <td>${x.productDto.name}</td>
        <td>${x.quantityRequest} tonns</td>
        <td>${x.quantityProduced}</td>
        <td>${x.quantityRemaining}</td>
        <td><span class="status ${icon}">&bull;</span> ${x.approvalStatus}</td>
        <td>${x.productionDate}</td>
        <td><a href="#" class="view" title="View Raw Material Details" data-toggle="tooltip" onclick="viewRawMaterialUsed(${x.productionId})"><i
                    class="material-icons">&#xE5C8;</i></a></td>
        </tr>`
    }).join('')
    table_body.innerHTML = html;
}

const searchInput = document.querySelector('#search');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

// const select_year = document.querySelector('#select-year')
// select_year.addEventListener('change',getAllSales)

displayPoductionTable()