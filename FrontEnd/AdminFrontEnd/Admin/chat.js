let conversation = document.querySelector('.chat__conversation-board')
let button = document.querySelector('.send-message-button')
let inp = document.querySelector('#input-message')
let emojis = document.querySelector(".emojis")
let em = document.getElementsByTagName("li")
let CHATTEMPLATE =
  `<div class="chat__conversation-board__message-container" id="id{{SenderId}}">
<div class="chat__conversation-board__message__person">
  <div class="chat__conversation-board__message__person__avatar"><img
      src="http://127.0.0.1:5502/wwwroot/Images/{{PROFILE-IMAGE}}" alt="Monika Figi" /></div><span
    class="chat__conversation-board__message__person__nickname">Monika Figi</span>
</div>
<div class="chat__conversation-board__message__context">
  <div class="chat__conversation-board__message__bubble">
    <span>{{MESSAGE-TEXT}}</span>
    <br>
    <small>{{SENT-TIME}}</small>
  </div>
</div>
<div class="chat__conversation-board__message__options">
  <button class="btn-icon chat__conversation-board__message__option-button option-item emoji-button">
    <svg class="feather feather-smile sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24"
      height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
      <line x1="9" y1="9" x2="9.01" y2="9"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
    </svg>
  </button>
  <button class="btn-icon chat__conversation-board__message__option-button option-item more-button">
    <svg class="feather feather-more-horizontal sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg"
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="19" cy="12" r="1"></circle>
      <circle cx="5" cy="12" r="1"></circle>
    </svg>
  </button>
</div>
</div>`

function showOrClose() {
  emojis.toggleAttribute("hidden")
  emojis.style.height = "300px"
  // emojis.style.width = "260px"
  // emojis.style.transition = "2s"
}

function sendEmoji(value) {
  // console.log(value.innerText)
  inp.value += value.innerText
}

// var input = document.getElementById("myInput");
inp.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.querySelector(".send-message-button").click();
  }
});

function disablesendbutton(value) {
}
//  disablesendbutton()
function chatPage() {
  let id = localStorage.getItem('Id')
  let senderId = localStorage.getItem('senderId')
  fetch(`https://localhost:5001/api/Chat/Get/${id}/${senderId}`)
    .then(res => res.json())
    .then(function (response) {
      let id = localStorage.getItem('Id')
      conversation.innerHTML = ""
      response.data.forEach(x => {

        let chat = CHATTEMPLATE
          .replace('{{PROFILE-IMAGE}}', x.profileImage)
          .replace('{{MESSAGE-TEXT}}', x.message)
          .replace('{{SENT-TIME}}', x.postedTime)
          .replace('{{SenderId}}', x.senderId)
        conversation.innerHTML += chat
        // if (x.senderId == id) {
        //   var element = document.querySelectorAll(`#id${x.senderId}`);
        //   element.forEach(x => {
        //     x.classList.add("reversed");
        //     x.children[1].children[0].style.background = "#00BFFF"
        //   })
        // }
      });
      var element = document.querySelectorAll(`#id${id}`);
          element.forEach(x => {
            x.classList.add("reversed");
            x.children[1].children[0].style.background = "#00BFFF"
          })
    })
}

let SendAMessage = () => {
  let id = localStorage.getItem('Id')
  let recieverId = localStorage.getItem('senderId')
  let inputmessage = document.querySelector('#input-message')
  if (inputmessage.value == "" || inputmessage.value == undefined) {
    return
  }
  const text = {
    message: inputmessage.value,
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(text),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  fetch(`https://localhost:5001/api/Chat/CreateChat/${id}/${recieverId}`, options)
    .then(res => res.json())
    .then(function (response) {
      if (response.success == true) {
        inputmessage.value = ""
        chatPage()
        disablesendbutton(inp.value)
      }
      else {
        window.alert(response.message)
      }
    })
}

let markAllAsRead = () => {
  let id = localStorage.getItem('Id')
  let senderId = localStorage.getItem('senderId')
  const options = {
    method: 'PUT',
    body: null,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  fetch(`https://localhost:5001/api/Chat/MarkAllAsRead/${senderId}/${id}`, options)
    .then(res => res.json())
    .then(function (value) {
      if (value.success == true) {
        // window.alert(value.message)
        chatAlert()
      }
      else {
        window.alert(value.message)
      }
    })
}
var emoji = []
const jsonUrl = "https://gist.githubusercontent.com/housamz/67087a81eaf78837a420fdef4accf263/raw/emojis.json";
fetch(jsonUrl)
  .then(res => res.json())
  .then(function (data) {
    data.emojis.forEach(x => {
      emojis.innerHTML += `<li class="emoji" data-clipboard-text="--1" value="${x["#text"]}" onclick="sendEmoji(this)">${x["#text"]}</li>`
    })
  })

setInterval(chatPage, 5000);

chatPage()
markAllAsRead()


