import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";
import { alert } from "./alert.js";
import { authFetch, setAccessToken } from "./authFetch.js";

const updateRateLimitUI = (limitHeader, remainingHeader) => {
  document.getElementById("messLoginAdmin").style.display = "inline";
  document.getElementById("limitRate").innerText = limitHeader;
  document.getElementById("remainingRate").innerText = remainingHeader;
  if (remainingHeader <= 2) {
    document.getElementById("messLoginAdmin").style.color = "red";
  }
};
// updateRateLimitUI(20, 2);
let countdownTimer = 0;
const startCountdown = (resetTimestamp) => {
  clearInterval(countdownTimer);
  const rateLimitAlert = document.getElementById("rateLimitAlert");
  const remainingTime = document.getElementById("remainingTime");
  const btnSubmitAdmin = document.getElementById("btnSubmitAdmin");
  rateLimitAlert.style.display = "block";
  btnSubmitAdmin.disabled = true;
  btnSubmitAdmin.style.opacity = 0.5;
  btnSubmitAdmin.style.cursor = "not-allowed";
  countdownTimer = setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = resetTimestamp - now;
    if (secondsLeft <= 0) {
      clearInterval(countdownTimer);
      remainingTime.innerText = "Bạn có thể thử lại ngay bây giờ";
      btnSubmitAdmin.disabled = false;
      btnSubmitAdmin.style.opacity = 1;
      btnSubmitAdmin.style.cursor = "pointer";
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
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const emailAdmin = document.getElementById("emailAdmin").value;
  const pwAdmin = document.getElementById("pwAdmin").value;
  axios
    .post("/loginAdmin/login", { emailAdmin, pwAdmin })
    .then((res) => {
      const { mess, success, idAdmin } = res.data;
      if (success && idAdmin) {
        document.getElementById("myModalLoginAdmin").style.display = "block";
        document.getElementById("adminId").value = idAdmin;
      } else {
        alert("Lỗi", mess, "red");
      }
    })
    .catch((err) => {
      const mess = err.response?.data?.mess || "Có lỗi xảy ra";
      alert("Lỗi", mess, "red");
    });
});
const pwAdmin = document.getElementById("pwAdmin");
const togglePwAdmin = document.getElementById("togglePwAdmin");
togglePwAdmin.addEventListener("click", function (e) {
  e.preventDefault();
  const type =
    pwAdmin.getAttribute("type") === "password" ? "text" : "password";
  pwAdmin.setAttribute("type", type);
  this.innerHTML =
    type === "password"
      ? "<i class='fa-solid fa-eye'></i>"
      : "<i class='fa-solid fa-eye-slash'></i>";
});
document.getElementById("formOtpLoginAdmin").addEventListener("submit", (e) => {
  e.preventDefault();
  const otp = document.getElementById("otpCodeLoginAdmin").value;
  const adminId = document.getElementById("adminId").value;
  axios.post("/loginAdmin/checkOtpLoginAdmin", { otp, adminId }).then((res) => {
    const { mess, success, error, accessToken } = res.data;
    if (success && accessToken) {
      setAccessToken(accessToken);
      window.location.href = "/dashboard";
    } else {
      if (error) {
        alert("Lỗi", `${mess}\n${error}`, "red");
      } else {
        alert("Lỗi", mess, "red");
      }
    }
  });
});
