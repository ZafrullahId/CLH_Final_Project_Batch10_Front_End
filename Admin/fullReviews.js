let fullReview = document.querySelector("#full-review");
let unread_measage_count = document.querySelector("#unread-measage-count");
let unread = document.querySelector("#unread");

let TEMPLATEFULLREVIEW = ` <div class="d-flex align-items-flex-start ms-4 mb-4" id="message-box" >
<div >
    <img class="rounded-circle" src="C:\\Users\\Zafrullah\\Desktop\\Project\\wwwroot\\Images\\{{CUSTOMER-IMAGE}}" alt=""
        style="width: 40px; height: 40px; box-shadow: 0px 4px 10px rgba(0, 0, 0, .6);">
</div>

<div class="container">
    <div class="arrow">
        <div class="outer"></div>
        <div class="inner"></div>
    </div>
    <div class="message-body">
        <small style="font-size: x-small;">{{SENDER-NAME}}</small>
        <br>
        <p style="font-style: italic;">{{POST-CONTENT}}</p>
            <small style="font-size: x-small;padding-left: 200px;text-align: end;">{{POSTED-TIME}}</small>
    </div>
</div>
</div>`

let displayFullReview = () => {
    fetch('https://localhost:5001/api/Review/GetAll')
    .then(response => response.json())
    .then(function(response){
        
        // fullReview.innerHTML = "";
        response.data.forEach(x => {
            
            let reviews = TEMPLATEFULLREVIEW
            .replace('{{SENDER-NAME}}',x.fullName)
            .replace('{{POST-CONTENT}}',x.text)
            .replace('{{POSTED-TIME}}',x.postedTime)
            .replace('{{CUSTOMER-IMAGE}}',x.imageUrl)
            fullReview.innerHTML += reviews;
        })
    })
}

fetch('https://localhost:5001/api/Review/GetAllUnseenReview')
    .then(response => response.json())
    .then(function(response){
        if (response.success == false) {
            unread.innerHTML = ""
        }
        else{

            unread_measage_count.innerText = response.data.length;
        }
    })

let Update = () => {

    const options = {
        method : 'PUT',
        body : null,
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    fetch('https://localhost:5001/api/Review/UpdateAll',options)
    .then(response => response.json())
    .then(function(res){
        if(res.success == true)
        {
            console.log(res.message)
        }
        else if(res.success == false)
        {
            console.log(res.message)
        }
    })
    message.style.color="black"
}

displayFullReview();
Update();