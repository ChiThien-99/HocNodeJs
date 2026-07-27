import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
import { alert, confirm } from "./alert.js";
import { setAccessToken2 } from "./authFetch.js";
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
      document.querySelector("title").innerText =
        `Dashboard của ${decodedUser.fullname}`;
      document.querySelector("#fullnameClient").innerText =
        decodedUser.fullname;
      document.querySelector("#idClient").innerText = `ID:${decodedUser.id}`;
      document.getElementById("idInfoClient").value = decodedUser.id;
      document.getElementById("fullname").value = decodedUser.fullname;
      const dateObj = new Date(decodedUser.datebirth);
      document.getElementById("dateBirth").value = dateObj.toLocaleDateString(
        "vi-VN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        },
      );
      document.getElementById("tel").value = decodedUser.tel;
      document.getElementById("email").value = decodedUser.email;
      const btnSetupMfa=document.getElementById("btnSetupMfa");
      console.log(decodedUser);
      if (decodedUser.mfa.isEnabled===true) {
        btnSetupMfa.innerText="Tắt";
        btnSetupMfa.style.backgroundColor="red";
      } else {
        btnSetupMfa.innerText="Thiết lập";
        btnSetupMfa.style.backgroundColor="#80a710";
      }
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
const formInfoClient = document.getElementById("formInfoClient");
formInfoClient.addEventListener("input", () => {
  checkFormEmptiness(formInfoClient, "btnRestoreInfoClient");
});
document
  .getElementById("btnRestoreInfoClient")
  .addEventListener("click", (e) => {
    e.preventDefault();
    getUserFromCookie();
    document.getElementById("currentPw").value = "";
    document.getElementById("newPw").value = "";
  });
new Cleave("#dateBirth", {
  date: true,
  delimiter: "/",
  datePattern: ["d", "m", "Y"], // Ép buộc cấu trúc gõ: ngày (d), tháng (m), năm (Y)
});
const currentPw = document.getElementById("currentPw");
const toggleCurrentPw = document.getElementById("toggleCurrentPw");
toggleCurrentPw.addEventListener("click", function (e) {
  e.preventDefault();
  const type =
    currentPw.getAttribute("type") === "password" ? "text" : "password";
  currentPw.setAttribute("type", type);
  this.innerHTML =
    type === "password"
      ? "<i class='fa-solid fa-eye'></i>"
      : "<i class='fa-solid fa-eye-slash'></i>";
});
const newPw = document.getElementById("newPw");
const toggleNewPw = document.getElementById("toggleNewPw");
toggleNewPw.addEventListener("click", function (e) {
  e.preventDefault();
  const type = newPw.getAttribute("type") === "password" ? "text" : "password";
  newPw.setAttribute("type", type);
  this.innerHTML =
    type === "password"
      ? "<i class='fa-solid fa-eye'></i>"
      : "<i class='fa-solid fa-eye-slash'></i>";
});
formInfoClient.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("idInfoClient").value;
  const fullname = document.getElementById("fullname").value;
  const dateBirth = document.getElementById("dateBirth").value;
  const tel = document.getElementById("tel").value;
  const email = document.getElementById("email").value;
  const currentPw = document.getElementById("currentPw").value;
  const newPw = document.getElementById("newPw").value;
  fetch(`/dashboardClient/updateInfo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({
      fullname,
      dateBirth,
      tel,
      email,
      currentPw,
      newPw,
    }),
  })
    .then((res) => res.json())
    .then(async ({ mess, success, error }) => {
      if (success) {
        const confirmRefresh = await confirm(
          "Thông báo",
          `${mess}\nHãy nhấn Có để tải lại trang`,
          "#1877f2",
        );
        if (confirmRefresh) {
          window.location.href = "/dashboardClient";
        }
      } else {
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi", error, "red");
    });
});
document.querySelectorAll(".btnBuyBack").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-idProduct");
    window.open(id, "_blank");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const btnMenuDBClient = document.getElementById("btnMenuDBClient");
  const navMenu = document.getElementById("divNavDashboardClient");
  if (btnMenuDBClient && navMenu) {
    btnMenuDBClient.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      if (navMenu.classList.contains("active")) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    });
    const navLink = navMenu.querySelectorAll("button");
    navLink.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        document.body.classList.remove("no-scroll");
      });
    });
  }
  const btnCloseDBClient = document.getElementById("btnCloseDBClient");
  btnCloseDBClient.addEventListener("click", () => {
    navMenu.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });
  document.querySelectorAll(".status").forEach((p) => {
    if (p.innerHTML === "Hủy") {
      p.style.backgroundColor = "red";
    }
  });
});
document.getElementById("btnSetupMfa").addEventListener("click",function(){
  if (this.innerText==="Thiết lập") {
    fetch("/dashboardClient/mfa/setup",{
    method:"GET",
    headers:{"Content-Type":"application/json;charset=UTF-8"}
  })
  .then(res=>res.json())
  .then(({mess,error,success,qrCode})=>{
    if (success) {
    document.getElementById("qrSetupMfa").src=qrCode;
    document.getElementById("mfaBody").style.display="block";
    this.innerText="Tắt"
    this.style.backgroundColor="red";
    }else{
      if (error) {
        alert("Lỗi",`${mess}\n${error}`,"red");
      } else {
        alert("Lỗi",mess,"red");
      }
    }
  })
  .catch((error)=>{
    alert("Lỗi",error,"red");
  });
  } else {
    
  }
});
document.getElementById("btnEnableMfa").addEventListener("click",()=>{
  const otpMfa=document.getElementById("otpMfaSetup").value;
  fetch("/dashboardClient/enableMfa",{
    method:"POST",
    headers:{"Content-Type":"application/json;charset=UTF-8"},
    body:JSON.stringify({otpMfa}),
  })
  .then(res=>res.json())
  .then(({mess,success,error})=>{
    if (success) {
      document.getElementById("mfaBody").style.display="none";
      alert("Thông báo",mess,"#80a710");
    } else {
      if (error) {
        alert("Lỗi",`${mess}\n${error}`,"red");
      } else {
        alert("Lỗi",mess,"red");
      }
    }
  })
  .catch((error)=>{
    alert("Lỗi",error,"red");
  });
})
