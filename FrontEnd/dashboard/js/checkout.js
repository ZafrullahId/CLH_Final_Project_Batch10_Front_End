
let counttry_form = document.querySelectorAll('.list')
let current_country = document.querySelectorAll('.current')
let list_country = document.querySelector('#countries')
let list_states = document.querySelector('#states')
let city = document.querySelector('#city')
let street = document.querySelector('#street')
let zip_code = document.querySelector('#zip')
let additionalinfo = document.querySelector('#additionalDetails')
let email = document.querySelector('#email')
let phone = document.querySelector('#phone-number')

let cart_items = document.querySelector('#list-cart-items')
let total = document.querySelector('.checkout__order__subtotal')
let sub_total = document.querySelector('.checkout__order__total')

current_country[0].innerText = "Nigeria"

counttry_form.forEach(x => {
    x.style.maxHeight = "300px"
    x.style.overflowY = "scroll"
})

let fetchCountries = () => {
    let countries = []

    fetch(`https://restcountries.com/v3.1/all`)
        .then(res => res.json())
        .then(response => {
            response.forEach(x => {
                // console.log(x)
                countries.push(x.name.common)
            })
            countries.sort()
            let count = 1
            countries.forEach(x => {
                if (x != "Nigeria") {
                    count++
                    counttry_form[0].innerHTML += `<option value="${x}" class="option" data-value="" disabled>${x}</option>`
                    list_country.innerHTML += `<option value="${x}" disabled>${x}</option>`
                }
                else {
                    count++
                    console.log(count)
                    counttry_form[0].innerHTML += `<option value="${x}" class="option" data-value="">${x}</option>`
                    list_country.innerHTML += `<option value="${x}">${x}</option>`
                }
            })

        })
}

// var headers = new Headers();
// headers.append("X-CSCAPI-KEY", "aTlJS2JQeTkwNUdWWG5RQVdKS2dFdjRKWElDTWVaaU05eDI3SzRSZQ==");

// var requestOptions = {
//   method: 'GET',
//   headers: headers,
//   redirect: 'follow'
// };

// // Pass Country Code -- Eg: Country Code : IN
// fetch("https://api.countrystatecity.in/v1/countries/161/states", requestOptions)
//   .then(response => response.json())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));

let states = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara"
]
const id = localStorage.getItem("Id")
states.forEach(x => {
    counttry_form[1].innerHTML += `<option value="${x}" class="option" data-value="">${x}</option>`
    list_states.innerHTML += `<option value="${x}">${x}</option>`
});

let items = JSON.parse(localStorage.getItem('cart'))
let uniqueIds = []
let t = 0
items.forEach(x => {
    var id = x.productId
    var item_number = items.filter(x => x.productId == id)
    t += x.price
    total.children[0].innerHTML = "₦" + t
    sub_total.children[0].innerHTML = "₦" + t
    if (uniqueIds.filter(x => x == id) == 0) {

        uniqueIds.push(id)
        cart_items.innerHTML += `<li>${x.name}<span>₦${x.price * item_number.length}</span></li>`
    }
})


const my_order_form = document.querySelector('#order-form')
my_order_form.addEventListener('submit', (x) => {
    let orders = JSON.parse(localStorage.getItem('cart'))
    let procart = []
    let uniqueIds = []
    orders.forEach(x => {
        let id = x.productId
        if (uniqueIds.filter(x => x == id).length != 0) {

        }
        else {
            let product = {
                productId: x.productId,
                quantityBought: orders.filter(x => x.productId == id).length,
            }
            procart.push(product)
            uniqueIds.push(id)
        }
    })
    console.log(procart)

    const inputes = {
        country: list_country.value,
        street: street.value,
        city: city.value,
        state: current_country[1].innerText,
        postalCode: zip_code.value,
        additionalDetails: additionalinfo.value,
        request: procart
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(inputes),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(`https://localhost:5001/api/Order/CreateOrder/${id}`, options)
        .then(res => res.json())
        .then(function (response) {
            if (response.success == true) {
                initiatePayment(response.message)
                // Swal.fire("Success", `Successfully Ordererd`, "success");
            }
            else {
                Swal.fire("Opps!", `${response.message}`, "warning");
            }
        })
})


let initiatePayment = (orderId) => {

    const inputes = {
        amount: t,
        email: email.value,
        phoneNumber: phone.value
    }
    console.log(inputes)
    const options = {
        method: 'POST',
        body: JSON.stringify(inputes),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(`https://localhost:5001/api/Payment/InitiatePayment/${id}/${orderId}`, options)
        .then(res => res.json())
        .then(function (response) {
            console.log(response)
            if (response.status == true) {
                location.href = response.data.authorization_url
            }
            else {
                Swal.fire("Opps!", `Something went wrong`, "warning");
            }
        })
}
// })

fetchCountries()