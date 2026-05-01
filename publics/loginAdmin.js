import axios from "axios";
import { Promise } from "mongoose";
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.defaultPrevented();
  const emailAdmin = document.getElementById("emailAdmin").value;
  const pwAdmin = document.getElementById("pwAdmin").value;
  fetch("/loginAdmin", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ emailAdmin, pwAdmin }),
  })
    .then((res) => res.json())
    .then(({ mess, status, token }) => {
      if (status) {
        alert(mess);
        localStorage.setItem("token", token);
        window.location.href("/dashboard");
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
    if (limitHeader && remainingHeader) {
      limit = limitHeader;
      remaining = remainingHeader;
      updateRateLimitUI(limit, remaining);
    }
    return response;
  },
  (error) => {
    const limitHeader = error.response.headers["ratelimit-limit"];
    const remainingHeader = error.response.headers["ratelimit-remaining"];
    if (limitHeader && remainingHeader) {
      updateRateLimitUI(limitHeader, remainingHeader);
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
