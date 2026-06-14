import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";
import { alert } from "./alert.js";
import { setAccessToken2 } from "./authFetch.js";
document.querySelectorAll("#headerLogin button").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll("#headerLogin button").forEach((btn) => {
      btn.classList.remove("active");
    });
    this.classList.add("active");
    document.querySelectorAll("#bodyLogin div").forEach((div) => {
      div.classList.remove("active");
    });
    const idLogin = this.getAttribute("data-idLogin");
    document.getElementById(idLogin).classList.add("active");
  });
});
function checkFormEmptiness(form, btn) {
  const formData = new FormData(form);
  let hasData = false;
  for (let value of formData.values()) {
    if (value.trim != "") {
      hasData = true;
      break;
    }
  }
  if (hasData) {
    document.getElementById(btn).style.display = "inline-block";
  } else {
    document.getElementById(btn).style.display = "none";
  }
}
const formRegisterClient = document.getElementById("formRegisterClient");
formRegisterClient.addEventListener("input", () => {
  checkFormEmptiness(formRegisterClient, "btnCancelRegister");
});
formRegisterClient.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullNameClient = document.getElementById("fullNameClient").value;
  const dateBirthClient = document.getElementById("dateBirthClient").value;
  const telClient = document.getElementById("telClient").value;
  const emailClient = document.getElementById("emailClient").value;
  const pwClient = document.getElementById("pwClient").value;
  const pwReClient = document.getElementById("pwReClient").value;
  fetch("/loginClient/postClient", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({
      fullNameClient,
      dateBirthClient,
      telClient,
      emailClient,
      pwClient,
      pwReClient,
    }),
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        alert("Thông báo", mess, "#80a710");
        document.getElementById("myModal").style.display = "block";
      } else {
        if (error) {
          alert("Lỗi", `${mess}\n${error}`, "red");
        } else {
          alert("Lỗi", mess, "red");
        }
      }
    })
    .catch((error) => {
      alert("Lỗi", error, "red");
    });
});
const formOtp = document.getElementById("formOtp");
formOtp.addEventListener("submit", (e) => {
  e.preventDefault();
  const otpCode = document.getElementById("otpCode").value;
  const email = document.getElementById("emailClient").value;
  console.log(email);
  fetch("/loginClient/checkOtp", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ email, otpCode }),
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        formRegisterClient.reset();
        document
          .getElementById("dateBirthClient")
          .setAttribute("data-date", "Ngày/tháng/năm");
        document.getElementById("checkPw").style.display = "none";
        document.getElementById("myModal").style.display = "none";
        alert("Thông báo", mess, "#80a710");
        document.querySelectorAll("#headerLogin button").forEach((btn) => {
          btn.classList.remove("active");
        });
        document.getElementById("btnLoginClient").classList.add("active");
        document.querySelectorAll("#bodyLogin div").forEach((div) => {
          div.classList.remove("active");
        });
        document.getElementById("loginClient").classList.add("active");
      } else {
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi", error, "red");
    });
});
new Cleave("#dateBirthClient", {
  date: true,
  delimiter: "/",
  datePattern: ["d", "m", "Y"], // Ép buộc cấu trúc gõ: ngày (d), tháng (m), năm (Y)
});
document.getElementById("btnCancelRegister").addEventListener("click", (e) => {
  e.preventDefault();
  formRegisterClient.reset();
  document.getElementById("checkPw").style.display = "none";
});
const pwClient = document.getElementById("pwClient");
const togglePwClient = document.getElementById("togglePwClient");
togglePwClient.addEventListener("click", function (e) {
  e.preventDefault();
  const type =
    pwClient.getAttribute("type") === "password" ? "text" : "password";
  pwClient.setAttribute("type", type);
  this.innerHTML =
    type === "password"
      ? "<i class='fa-solid fa-eye'></i>"
      : "<i class='fa-solid fa-eye-slash'></i>";
});
const pwReClient = document.getElementById("pwReClient");
const togglePwReClient = document.getElementById("togglePwReClient");
togglePwReClient.addEventListener("click", function (e) {
  e.preventDefault();
  const type =
    pwReClient.getAttribute("type") === "password" ? "text" : "password";
  pwReClient.setAttribute("type", type);
  this.innerHTML =
    type === "password"
      ? "<i class='fa-solid fa-eye'></i>"
      : "<i class='fa-solid fa-eye-slash'></i>";
});
const pwClient2 = document.getElementById("pwClient2");
const togglePwClient2 = document.getElementById("togglePwClient2");
togglePwClient2.addEventListener("click", function (e) {
  e.preventDefault();
  const type =
    pwClient2.getAttribute("type") === "password" ? "text" : "password";
  pwClient2.setAttribute("type", type);
  this.innerHTML =
    type === "password"
      ? "<i class='fa-solid fa-eye'></i>"
      : "<i class='fa-solid fa-eye-slash'></i>";
});
document.getElementById("pwClient").addEventListener("input", function (e) {
  e.preventDefault();
  const pwReClient = document.getElementById("pwReClient").value;
  const checkPw = document.getElementById("checkPw");
  if (this.value === pwReClient) {
    checkPw.innerText = `\u{2714} Đã khớp`;
    checkPw.style.color = "#80a710";
    checkPw.style.display = "block";
  } else {
    checkPw.innerText = `\u{274C} Chưa khớp`;
    checkPw.style.color = "red";
    checkPw.style.display = "block";
  }
});
document.getElementById("pwReClient").addEventListener("input", function (e) {
  e.preventDefault();
  const pwClient = document.getElementById("pwClient").value;
  const checkPw = document.getElementById("checkPw");
  if (this.value === pwClient) {
    checkPw.innerText = `\u{2714} Đã khớp`;
    checkPw.style.color = "#80a710";
    checkPw.style.display = "block";
  } else {
    checkPw.innerText = `\u{274C} Chưa khớp`;
    checkPw.style.color = "red";
    checkPw.style.display = "block";
  }
});
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailClient2 = document.getElementById("emailClient2").value;
  const pwClient2 = document.getElementById("pwClient2").value;
  const rememberMe = document.getElementById("rememberMe").checked;
  axios
    .post("/loginClient/login", { emailClient2, pwClient2, rememberMe })
    .then((res) => {
      const { mess, success, error, accessToken, cookieMaxAge } = res.data;
      if ((success && accessToken) || cookieMaxAge) {
        setAccessToken2(accessToken, cookieMaxAge);
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get("redirect");
        if (redirectTo && redirectTo.startsWith("/")) {
          window.location.href = decodeURIComponent(redirectTo);
        } else {
          window.location.href = "/index";
        }
      } else {
        if (error) {
          alert("Lỗi", `${mess}\n${error}`, "red");
        } else {
          alert("Lỗi", mess, "red");
        }
      }
    })
    .catch((err) => {
      const mess = err.response?.data?.mess || "Có lỗi xảy ra";
      alert("Lỗi", mess, "red");
    });
});
const updateRateLimitUI = (limitHeader, remainingHeader) => {
  document.getElementById("messLoginClient").style.display = "inline";
  document.getElementById("limitRate").innerText = limitHeader;
  document.getElementById("remainingRate").innerText = remainingHeader;
  if (remainingHeader <= 2) {
    document.getElementById("messLoginClient").style.color = "red";
  }
};
// updateRateLimitUI(20, 2);
let countdownTimer = 0;
const startCountdown = (resetTimestamp) => {
  clearInterval(countdownTimer);
  const rateLimitAlert = document.getElementById("rateLimitAlert");
  const remainingTime = document.getElementById("remainingTime");
  const btnLoginClient = document.getElementById("btnLoginCL");
  rateLimitAlert.style.display = "block";
  btnLoginClient.disabled = true;
  btnLoginClient.style.opacity = 0.5;
  btnLoginClient.style.cursor = "not-allowed";
  countdownTimer = setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = resetTimestamp - now;
    if (secondsLeft <= 0) {
      clearInterval(countdownTimer);
      remainingTime.innerText = "Bạn có thể thử lại ngay bây giờ";
      btnLoginClient.disabled = false;
      btnLoginClient.style.opacity = 1;
      btnLoginClient.style.cursor = "pointer";
      return;
    }
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    remainingTime.innerText = `Thử lại sau: ${minutes}p ${seconds < 10 ? "0" : ""}${seconds}s`;
  }, 1000);
};
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error.response;
    if (response) {
      const limitHeader = response.headers["ratelimit-limit"];
      const remainingHeader = response.headers["ratelimit-remaining"];
      const resetTime = response.headers["ratelimit-reset"];
      console.log(`${limitHeader},${remainingHeader},${resetTime}`);
      if (limitHeader && remainingHeader) {
        updateRateLimitUI(limitHeader, remainingHeader);
      }
      if (response.status === 429 && resetTime) {
        const secondsToWait = parseInt(resetTime);
        const unlockTimeStamp = Math.floor(Date.now() / 1000) + secondsToWait;
        startCountdown(unlockTimeStamp);
      }
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
      }
    } else {
      console.error("Lỗi mạng hoặc server không phản hồi");
    }

    return Promise.reject(error);
  },
);
