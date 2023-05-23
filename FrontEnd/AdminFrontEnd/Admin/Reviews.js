let review = document.querySelector("#reviews");
let message = document.querySelector('#message');

let TEMPLATE = `<a href="#" class="dropdown-item">
<div class="d-flex align-items-center" >
    <img class="rounded-circle" src="http://127.0.0.1:5502/wwwroot/Images/{{CUSTOMER-IMAGE}}" alt="" style="width: 40px; height: 40px;">
    <div class="ms-2" >
        <h6 class="fw-normal mb-0" style="font-size: .775em;">{{SENDER-NAME}}</h6>       
        <small id="text" class="post-content">{{POST-CONTENT}}</small>
        <div>
        <small>{{POSTED-TIME}}</small>
        </div>
    </div>
</div>
</a>
<hr class="dropdown-divider">`

let displayReview = () => {
    fetch('https://localhost:5001/api/Review/GetAllUnseenReview')
    .then(response => response.json())
    .then(function(response){
        
        review.innerHTML = "";
        for(let i = 0; i < response.data.length; i++)
        {
            if(response.data[i].seen == false)
            {
                message.style.color="green"
                break;
            }
        }
        response.data.forEach(x => {
            
            let reviews = TEMPLATE
            .replace('{{SENDER-NAME}}',x.fullName)
            .replace('{{POST-CONTENT}}',x.text)
            .replace('{{POSTED-TIME}}',x.postedTime)
            .replace('{{CUSTOMER-IMAGE}}',x.imageUrl)
            review.innerHTML += reviews;
        })
    })
}

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

displayReview();