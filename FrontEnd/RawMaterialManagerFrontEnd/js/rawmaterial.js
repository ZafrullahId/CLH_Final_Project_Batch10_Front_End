let table_body = document.getElementsByTagName('tbody')[0]

let RAWMATERIALTABLETEMPLATE = `<tr>
<td>{{COUNT}}</td>
<td>{{NAME}}</td>
<td>{{QUANTITYREQUEST}} tonns</td>
<td>{{QUANTITYREMAINING}}</td>
<td><span class="status {{STATUS-ICON}}">&bull;</span> {{STATUS}}</td>
<td>₦{{NET-AMOUNT}}</td>
<td style="white-space: nowrap;">{{DATEREQUESTED}}</td>
</tr>`

let rawMaterials = []
let fetchrawmaterialdata = (endpoint) => {
    rawMaterials = []
    fetch(endpoint)
        .then(res => res.json())
        .then(data => rawMaterials.push(...data.data));
}

function FilterTableByStatus(value) {

    let icon = ""
    if (value == "All") {
        displayRawMatrailTable()
        return
    }
    if (value == "Pending") {
        icon = "text-warning"
    }
    else if (value == "Approved") {
        icon = "text-success"
    }
    let jsonUrl = `https://localhost:5001/api/RawMaterial/GetAll${value}RawMaterial`
    fetchrawmaterialdata(jsonUrl)
    fetch(jsonUrl)
        .then(res => res.json())
        .then(function (response) {
            table_body.innerHTML = ""
            let count = 1
            response.data.forEach(x => {
                let raw = RAWMATERIALTABLETEMPLATE
                    .replace('{{COUNT}}', count)
                    .replace('{{NAME}}', x.name)
                    .replace('{{QUANTITYREQUEST}}', x.quantiityBought)
                    .replace('{{QUANTITYREMAINING}}', x.quantiityRemaining)
                    .replace('{{STATUS-ICON}}', icon)
                    .replace('{{STATUS}}', x.stringApprovalStatus)
                    .replace('{{NET-AMOUNT}}', x.cost)
                    .replace('{{DATEREQUESTED}}', x.createdTime)
                table_body.innerHTML += raw
                count++
            })
        })
}

let displayRawMatrailTable = () => {
    let jsonUrl = `https://localhost:5001/api/RawMaterial/GetAllRawMaterials`
    fetchrawmaterialdata(jsonUrl)
    fetch(jsonUrl)
        .then(res => res.json())
        .then(function (response) {
            table_body.innerHTML = ""
            let count = 1
            response.data.forEach(x => {
                if (x.enumApprovalStatus == 1) {
                    let raw = RAWMATERIALTABLETEMPLATE
                        .replace('{{COUNT}}', count)
                        .replace('{{NAME}}', x.name)
                        .replace('{{QUANTITYREQUEST}}', x.quantiityBought)
                        .replace('{{QUANTITYREMAINING}}', x.quantiityRemaining)
                        .replace('{{STATUS-ICON}}', 'text-success')
                        .replace('{{STATUS}}', x.stringApprovalStatus)
                        .replace('{{NET-AMOUNT}}', x.cost)
                        .replace('{{DATEREQUESTED}}', x.createdTime)
                    table_body.innerHTML += raw
                }
                else if (x.enumApprovalStatus == 2) {
                    let raw = RAWMATERIALTABLETEMPLATE
                        .replace('{{COUNT}}', count)
                        .replace('{{NAME}}', x.name)
                        .replace('{{QUANTITYREQUEST}}', x.quantiityBought)
                        .replace('{{QUANTITYREMAINING}}', x.quantiityRemaining)
                        .replace('{{STATUS-ICON}}', 'text-warning')
                        .replace('{{STATUS}}', x.stringApprovalStatus)
                        .replace('{{NET-AMOUNT}}', x.cost)
                        .replace('{{DATEREQUESTED}}', x.createdTime)
                    table_body.innerHTML += raw
                }
                else {
                    let raw = RAWMATERIALTABLETEMPLATE
                        .replace('{{COUNT}}', count)
                        .replace('{{NAME}}', x.name)
                        .replace('{{QUANTITYREQUEST}}', x.quantiityBought)
                        .replace('{{QUANTITYREMAINING}}', x.quantiityRemaining)
                        .replace('{{STATUS-ICON}}', 'text-danger')
                        .replace('{{STATUS}}', x.stringApprovalStatus)
                        .replace('{{NET-AMOUNT}}', x.cost)
                        .replace('{{DATEREQUESTED}}', x.createdTime)
                    table_body.innerHTML += raw
                }
                count++
            });
        })
}

displayRawMatrailTable()



function findMatches(wordToMatch, rawMaterial) {
    return rawMaterial.filter(x => {
        const regex = new RegExp(wordToMatch, 'gi');
        return x.name.match(regex);
    })
}

function displayMatches() {
    let icon = ""
    let count = 0;
    const matchObj = findMatches(this.value, rawMaterials);
    const html = matchObj.map(x => {
        if (x.stringApprovalStatus == "Approved") {
            icon = "text-success"
        }
        else if (x.stringApprovalStatus == "Pending") {
            icon = "text-warning"
        }
        else {
            icon = "text-danger"
        }
        count++;
        return `<tr>
        <td>${count}</td>
        <td>${x.name}</td>
        <td>${x.quantiityBought} tonns</td>
        <td>${x.quantiityRemaining}</td>
        <td><span class="status ${icon}">&bull;</span> ${x.stringApprovalStatus}</td>
        <td>₦${x.cost}</td>
        <td>${x.createdTime}</td>
        </tr>`
    }).join('')

    table_body.innerHTML = html;
}



const searchInput = document.querySelector('#search');
searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);