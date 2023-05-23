
let counttry_form = document.querySelector('#countries')

let fetchCountries = () => {
var countries = []

fetch(`https://restcountries.com/v3.1/all`)
    .then(res => res.json())
    .then(response => {
        response.forEach(x => {
            // console.log(x)
            countries.push(x.name.common)
            counttry_form.innerHTML += `<option value="${x.name.common}">${x.name.common}</option>`
        })
        countries.sort()
        console.log(countries)
        console.log(counttry_form)
    })
}
fetchCountries()