import { scriptHeader } from "/script.js";
scriptHeader();
import { alert } from "./alert.js";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
document.querySelectorAll(".navBtnDB").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".navBtnDB.active").classList.remove("active");
    document.querySelector(".tabContent.active").classList.remove("active");
    button.classList.add("active");
    document.getElementById(button.dataset.target).classList.add("active");
  });
});
document.getElementById("registerAdmin").addEventListener("submit", (e) => {
  e.preventDefault();
  const fullnameAdmin=document.getElementById("fullnameAdmin").value;
  const roleAdmin=document.getElementById("roleAdmin").value;
  const emailAdmin = document.getElementById("emailAdmin").value;
  const pwAdmin = document.getElementById("pwAdmin").value;
  const listDecentAdmin = document.querySelectorAll(
    "input[name='decentAdmin']:checked",
  );
  const valueDecentAdmin = Array.from(listDecentAdmin).map(
    (item) => item.value,
  );
  fetch("/dashboard/registerAdmin", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ fullnameAdmin,roleAdmin,emailAdmin, pwAdmin, valueDecentAdmin }),
  })
    .then((res) => res.json())
    .then(({ mess, success, err }) => {
      if (success) {
        alert("Thông báo", mess, "#027e1f");
        document.getElementById("fullnameAdmin").value="";
        document.getElementById("roleAdmin").value="";
        document.getElementById("emailAdmin").value = "";
        document.getElementById("pwAdmin").value = "";
        const allCheckbox = document.querySelectorAll(
          "input[name='decentAdmin']",
        );
        allCheckbox.forEach((item) => (item.checked = false));
      } else {
        alert("Lỗi", `${mess}\n${err ? err : ""}`, "red");
        document.getElementById("fullnameAdmin").value="";
        document.getElementById("roleAdmin").value="";
        document.getElementById("emailAdmin").value = "";
        document.getElementById("pwAdmin").value = "";
        const allCheckbox = document.querySelectorAll(
          "input[name='decentAdmin']",
        );
        allCheckbox.forEach((item) => (item.checked = false));
      }
    });
});
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}
function getUserFromCookie() {
  const token = getCookie("token");
  if (token) {
    try {
      const decodedUser = jwtDecode(token);
      document.getElementById("fullnameAd").innerText=decodedUser.fullname;
      document.getElementById("roleAd").innerText=`Chức vụ: ${decodedUser.role}`;
      const decent=decodedUser.decent;
      function applyPermission(){
        const buttons=document.querySelectorAll(".navBtnDB");
        buttons.forEach(btn=>{
          const target=btn.getAttribute("data-target");
          if(!decent.includes(target)){
            btn.remove();
          }
        })
      }
      applyPermission();
      return decodedUser;
    } catch (error) {
      console.error(`Token không hợp lệ hoặc đã bị can thiệp ${error}`);
      return null;
    }
  } else {
    console.error("Không thấy token trong cookie");
    return null;
  }
}
window.onload = getUserFromCookie;
