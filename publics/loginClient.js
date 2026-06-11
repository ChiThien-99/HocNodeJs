import { alert } from "./alert.js";
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
        formRegisterClient.reset();
        document
          .getElementById("dateBirthClient")
          .setAttribute("data-date", "Ngày/tháng/năm");
        document.getElementById("checkPw").style.display = "none";
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
const dateBirthClient = document.getElementById("dateBirthClient");
dateBirthClient.addEventListener("change", function (e) {
  e.preventDefault();
  const rawValue = this.value;
  if (!rawValue) {
    return;
  }
  const [year, month, day] = rawValue.split("-");
  const formattedDate = `${day}/${month}/${year}`;
  this.setAttribute("data-date", formattedDate);
});
document.getElementById("btnCancelRegister").addEventListener("click", (e) => {
  e.preventDefault();
  formRegisterClient.reset();
  dateBirthClient.setAttribute("data-date", "Ngày/tháng/năm");
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
