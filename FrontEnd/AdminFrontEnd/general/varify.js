

const inputs = document.querySelectorAll("input"),
  button = document.querySelector("button");

// iterate over all inputs
inputs.forEach((input, index1) => {
  input.addEventListener("keyup", (e) => {
    // This code gets the current input element and stores it in the currentInput variable
    // This code gets the next sibling element of the current input element and stores it in the nextInput variable
    // This code gets the previous sibling element of the current input element and stores it in the prevInput variable
    const currentInput = input,
      nextInput = input.nextElementSibling,
      prevInput = input.previousElementSibling;

    // if the value has more than one character then clear it
    if (currentInput.value.length > 1) {
      currentInput.value = "";
      return;
    }
    // if the next input is disabled and the current value is not empty
    //  enable the next input and focus on it
    if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
      nextInput.removeAttribute("disabled");
      nextInput.focus();
    }

    // if the backspace key is pressed
    if (e.key === "Backspace") {
      // iterate over all inputs again
      inputs.forEach((input, index2) => {
        // if the index1 of the current input is less than or equal to the index2 of the input in the outer loop
        // and the previous element exists, set the disabled attribute on the input and focus on the previous element
        if (index1 <= index2 && prevInput) {
          input.setAttribute("disabled", true);
          input.value = "";
          prevInput.focus();
        }
      });
    }
    //if the fourth input( which index number is 3) is not empty and has not disable attribute then
    //add active class if not then remove the active class.
    if (!inputs[4].disabled && inputs[4].value !== "") {
      button.classList.add("active");
      return;
    }
    button.classList.remove("active");
  });
});

//focus the first input which index is 0 on window load
window.addEventListener("load", () => inputs[0].focus());

var id = localStorage.getItem("registrationid");
// let code;
// inputs.forEach(element => {
//   code += element.value;
//   console.log(code)
// });

let verify = () => {
  let code1 = document.querySelector('#code1');
  let code2 = document.querySelector('#code2');
  let code3 = document.querySelector('#code3');
  let code4 = document.querySelector('#code4');
  let code5 = document.querySelector('#code5');
  let code = `${code1.value}${code2.value}${code3.value}${code4.value}${code5.value}`
  console.log(code1.value);

  fetch(`https://localhost:5001/api/VerificationCode/VerifyCode/${code}/${id}`)
    .then(res => res.json())
    .then(function (value) {
      if (value.success == false) {
        window.alert(value.message)
      }
      else {
        location.href = "signin.html"
      }
    })

}

let resendCode = () => {
  const options = {
    method: 'PUT',
    body: null,
    headers: {
      'Content-Type': 'application/json'
    }
  }
    fetch(`https://localhost:5001/api/VerificationCode/UpdateCode/${id}`, options)
    .then(res => res.json())
        .then(function (response) {
            if (response.success == true) {
                window.alert(response.message)
                codeTimer()
            }
            else if (response.success == false) {
                console.log(response.message)
            }
        })
}

function codeTimer() {
  var timeleft = 200;
  var downloadTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(downloadTimer);
      document.getElementById("countdown").innerHTML = `<small><a href="" style="text-decoration: none;" onclick="resendCode()">resend code</a></small>`;
    } else {
      document.getElementById("countdown").innerHTML = `<small><a href="" style="text-decoration: none;" >${timeleft} seconds remaining</a></small>`;
    }
    timeleft -= 1;
  }, 1000);
}
codeTimer()