import * as axios from "axios";
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const emailAdmin = document.getElementById("emailAdmin").value;
  const pwAdmin = document.getElementById("pwAdmin").value;
  fetch("/loginAdmin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ emailAdmin, pwAdmin }),
  })
    .then((res) => res.json())
    .then(({ mess, success, token }) => {
      if (success && token) {
        localStorage.setItem("token", token);
        alert(mess);
        // window.location.href="/dashboard";
      } else {
        alert(mess);
      }
    });
});
let limit = 0;
let remaining = 0;
axios.interceptors.response.use(
  (response) => {
    const limitHeader = response.headers["ratelimit-limit"];
    const remainingHeader = response.headers["ratelimit-remaining"];
    const resetTime=response.headers["ratelimit-reset"];
    if (limitHeader && remainingHeader) {
      updateRateLimitUI(limitHeader, remainingHeader);
      startCountdown(parseInt(resetTime));
    }
    return response;
  },
  (error) => {
    const response=error?.response;
    if(!response){
      console.error("Lỗi mạng hoặc server không phản hồi");
      return Promise.reject(error);
    }
    if(response&&response.status===400){}
    const limitHeader = response.headers["ratelimit-limit"];
    const remainingHeader = response.headers["ratelimit-remaining"];
    const resetTime=response.headers["ratelimit-reset"];
    if (limitHeader && remainingHeader && resetTime) {
      updateRateLimitUI(limitHeader, remainingHeader);
      startCountdown(parseInt(resetTime));
    }
    return Promise.reject(error);
  },
);
const updateRateLimitUI = (limitHeader, remainingHeader) => {
  document.getElementById("limitRate").innerText = limitHeader;
  document.getElementById("remainingRate").innerText = remainingHeader;
  if (remainingHeader <= 2) {
    document.getElementById("messLoginAdmin").style.color = "red";
  }
};
let countdownTimer=0;
const startCountdown=(resetTimestamp)=>{
  clearInterval(countdownTimer);
  const rateLimitAlert=document.getElementById("rateLimitAlert");
  const remainingTime=document.getElementById("remainingTime");
  const btnSubmitAdmin=document.getElementById("btnSubmitAdmin");
  btnSubmitAdmin.disabled=true;
  btnSubmitAdmin.style.opacity=0.5;
  btnSubmitAdmin.style.cursor="not-allowed";
  countdownTimer=setInterval(()=>{
    const now=Math.floor(Date.now()/1000);
    const secondsLeft=resetTimestamp-now;
    if(secondsLeft<=0){
      clearInterval(countdownTimer);
      remainingTime.innerText="Bạn có thể thử lại ngay bây giờ";
      btnSubmitAdmin.disabled=false;
      btnSubmitAdmin.style.opacity=1;
      btnSubmitAdmin.style.cursor="pointer";
      return;
    }
    const minutes=Math.floor(secondsLeft/60);
    const seconds=secondsLeft%60;
    remainingTime.innerText=`Thử lại sau: ${minutes}p ${seconds<10 ? "0":""}${seconds}`;
    
  })
}
