import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
document.querySelectorAll(".navBtnDB").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".navBtnDB.active").classList.remove("active");
    document.querySelector(".tabContent.active").classList.remove("active");
    button.classList.add("active");
    document.getElementById(button.dataset.target).classList.add("active");
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
  const token = getCookie("accessToken2");
  if (token) {
    try {
      const decodedUser = jwtDecode(token);
      document.querySelector("title").innerText=`Dashboard của ${decodedUser.fullname}`
      document.querySelector("#fullnameClient").innerText = decodedUser.fullname;
      document.querySelector("#idClient").innerText = `ID:${decodedUser.id}`;
      document.getElementById("fullname").value=decodedUser.fullname;
      const dateObj=new Date(decodedUser.datebirth);
      document.getElementById("dateBirth").value=dateObj.toLocaleDateString("vi-VN",{
        day:"2-digit",
        month:"2-digit",
        year:"numeric",
      });
      document.getElementById("tel").value=decodedUser.tel;
      document.getElementById("email").value=decodedUser.email;
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
const formInfoClient=document.getElementById("formInfoClient");
formInfoClient.addEventListener("input",()=>{
    checkFormEmptiness(formInfoClient,"btnRestoreInfoClient");
})
document.getElementById("btnRestoreInfoClient").addEventListener("click",(e)=>{
    e.preventDefault();
    getUserFromCookie();
})