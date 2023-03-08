let conversation = document.querySelector('.chat__conversation-board')

let CHATTEMPLATE =
  `<div class="chat__conversation-board__message-container" id="id{{SenderId}}">
<div class="chat__conversation-board__message__person">
  <div class="chat__conversation-board__message__person__avatar"><img
      src="http://127.0.0.1:5501/wwwroot/Images/{{PROFILE-IMAGE}}" alt="Monika Figi" /></div><span
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
        if (x.senderId == id) {
          var element = document.querySelectorAll(`#id${x.senderId}`);
          element.forEach(x => {
            x.classList.add("reversed");
            x.children[1].children[0].style.background = "#00BFFF"
          })
        }
      });
    })
}
let SendAMessage = () => {
  let id = localStorage.getItem('Id')
  let senderId = localStorage.getItem('senderId')
  let inputmessage = document.querySelector('#input-message')
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
  fetch(`https://localhost:5001/api/Chat/CreateChat/${id}/${senderId}`, options)
    .then(res => res.json())
    .then(function (response) {
      if (response.success == true) {
        inputmessage.value = ""
        chatPage()
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
      }
      else {
        window.alert(value.message)
      }
    })
}
markAllAsRead()
chatPage()