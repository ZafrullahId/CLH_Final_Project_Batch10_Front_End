let fullReview = document.querySelector("#full-review");
let unread_measage_count = document.querySelector("#unread-measage-count");
let unread = document.querySelector("#unread");

let TEMPLATEFULLREVIEW = `<figure class="snip1157">
<blockquote id="id{{ID}}">{{POST-CONTENT}}
    <div class="arrow"></div>
</blockquote>
<img src="http://127.0.0.1:5501/wwwroot/Images/{{CUSTOMER-IMAGE}}"
    alt="sq-sample3" />
<div class="author">
    <h5>{{SENDER-NAME}}</br><span>{{POSTED-TIME}}</span></h5>
    <i onclick="like({{ID2}})" class="fa fa-thumbs-up thumb" id="review{{ID1}}"></i>
    <span><small  style="color: black">{{LIKES}}</small></span>
</div>
</figure>`

let like = (id) => {
    let myId = localStorage.getItem('Id')
    const message = {
        userId: myId,
        reviewId : id
    }
    const options = {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch('https://localhost:5001/api/Like/CreateLike',options)
    .then(res => res.json())
    .then(function(response){
        if (response.success) {
            // window.alert(response.message)
            displayFullReview()
        }
        else{
            window.alert(response.message)
        }
    })
}

function myFunction(id) {
    // x.classList.toggle("fa-thumbs-down");
    let like = document.querySelector(`#review${id}`)
    like.classList.toggle("liked");
}

async function displayFullReview() {
    let myId = localStorage.getItem('Id')
    await getAllReviews()
        .then(async function (response) {
            fullReview.innerHTML = ""
            response.data.forEach(x => {
                fetch(`https://localhost:5001/api/Like/GetLikesByReviewId/${x.id}`)
                    .then(res => res.json())
                    .then(function (likes) {
                        
                        let reviews = TEMPLATEFULLREVIEW
                            .replace('{{SENDER-NAME}}', x.fullName)
                            .replace('{{POST-CONTENT}}', x.text)
                            .replace('{{POSTED-TIME}}', x.postedTime)
                            .replace('{{CUSTOMER-IMAGE}}', x.imageUrl)
                            .replace('{{ID}}', x.id)
                            .replace('{{ID1}}', x.id)
                            .replace('{{ID2}}', x.id)
                            .replace('{{LIKES}}', likes.data.numberOfLikes)
                        fullReview.innerHTML += reviews;
                        if (x.seen == false) {
                            let review = document.querySelector(`#id${x.id}`)
                            review.innerHTML += `<br>
                    <span style="background-color: #f24e4e;color: white;padding: 2px;">NEW</span>`
                        }
                        likes.data.customerDto.forEach(y => {
                            if (y.id == myId) {
                                let like = document.querySelector(`#review${x.id}`)
                                like.classList.toggle("liked");
                            }
                        })
                    })
            })
        })
}

async function getAllReviews() {
    let reviews = await fetch('https://localhost:5001/api/Review/GetAll')
    return reviews.json();
}
async function getLikes(id) {
    let likes = await fetch(`https://localhost:5001/api/Like/GetLikesByReviewId/${id}`)
    return likes.json();
}
fetch('https://localhost:5001/api/Review/GetAllUnseenReview')
    .then(response => response.json())
    .then(function (response) {
        if (response.success == false) {
            unread.innerHTML = ""
        }
        else {

            unread_measage_count.innerText = response.data.length;
        }
    })

let Update = () => {

    const options = {
        method: 'PUT',
        body: null,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch('https://localhost:5001/api/Review/UpdateAll', options)
        .then(response => response.json())
        .then(function (res) {
            if (res.success == true) {
                console.log(res.message)
            }
            else if (res.success == false) {
                console.log(res.message)
            }
        })
    message.style.color = "black"
}

displayFullReview();
Update();