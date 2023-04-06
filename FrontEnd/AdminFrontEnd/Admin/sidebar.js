let chatProfiles = document.querySelector('#chat')
let chatalert = document.querySelector('#chat-alerts')
let WHOTOCHATTEMPLATE = ` <div class="d-flex align-items-center managers" style="padding-left: 20px;" id="{{MANAGER-ID}}">
<img class="rounded-circle" src="http://127.0.0.1:5501/wwwroot/Images/{{PROFILE-IMAGE}}" alt="" style="width: 30px; height: 30px;">
<div style="background-color: red !important;margin-left: -6px;margin-top: auto;">

</div>
<a href="chat.html" class="dropdown-item" style="text-transform: capitalize;" onclick=getReceiverId({{ID}})>{{ROLE}}</a>
</div>`
let userid = localStorage.getItem('Id');
fetch('https://localhost:5001/api/Admin/GetAllAdmins')
.then(res => res.json())
.then(function (value) {
    for (let i = 0; i < value.data.length; i++) {
       if (value.data[i].id == userid) {
            continue;
       }
       let chat = WHOTOCHATTEMPLATE
       .replace('{{PROFILE-IMAGE}}',value.data[i].profileImage)
       .replace('{{ROLE}}',value.data[i].role)
       .replace('{{ID}}',value.data[i].id)
       .replace('{{MANAGER-ID}}',value.data[i].id)
       chatProfiles.innerHTML += chat
    }
})

function chatAlert() {
   let id = localStorage.getItem('Id')
    fetch(`https://localhost:5001/api/Chat/GetAllUnSeenChatAsync/${id}`)
    .then(res => res.json())
    .then(function(response){
        let managers = document.querySelectorAll('.managers')
        managers.forEach(x => {
            x.children[1].classList.remove("bg-success","rounded-circle","border","border-2", "border-white", "position-relative", "end-0", "bottom-0", "p-1")
            console.log("removing")
        })
        response.data.forEach(x => {
            managers.forEach(c => {
                if (x.senderId == c.id) {
                    c.children[1].classList.add("bg-success","rounded-circle","border","border-2", "border-white", "position-relative", "end-0", "bottom-0", "p-1")
                }
            })
        });
    })
}
// class="bg-success rounded-circle border border-2 border-white position-relative end-0 bottom-0 p-1" style="background-color: red !important;"
chatAlert()

let getReceiverId = (id) => {
    localStorage.removeItem('senderId')
    localStorage.setItem('senderId',id)
    return id
}