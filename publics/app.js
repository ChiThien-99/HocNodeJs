const socket = io();
socket.on("update-app", (newApp) => {
  let plainText=newApp.info.replace(/&nbsp;|&#160;/gi," ");
  let shortText=plainText.length>80?plainText.substring(0,80)+"...":plainText;
  const newAppHTML = `
      <div class="app">
        <img src="${newApp.image}" alt="app">
        <div class="app-content">
            <h4>${newApp.name}</h4>
            <div>
                ${shortText}
            </div>
            <a href="/app/detailApp/${newApp._id}" target="_blank">Truy cập</a>
        </div>
    </div>
  `;
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("page")) || 1;
  if (currentPage === 1) {
    document
      .getElementById("listapps")
      .insertAdjacentHTML("afterbegin", newAppHTML);
    let app = document.querySelectorAll(".app");
    if (app.length > 12) {
      app[app.length - 1].remove();
    }
    app = document.querySelectorAll(".app");
  }
});

document.getElementById("btnFuncApp").addEventListener("click", function () {
  const functionWrapper = document.getElementById("functionWrapper");
  const type = functionWrapper.style.display === "block" ? "none" : "block";
  functionWrapper.style.display = type;
  document.querySelectorAll("#filterApp a").forEach((btn) => {
    btn.classList.remove("active");
    this.classList.add("active");
  });
});
let selectedFunctionApp = [];
document.getElementById("divFunctionApp").addEventListener("click", (e) => {
  const btn = e.target.closest(".functionApp");
  if (!btn) {
    return;
  }
  const name = btn.textContent.trim();
  if (selectedFunctionApp.includes(name)) {
    selectedFunctionApp = selectedFunctionApp.filter((f) => f !== name);
    btn.classList.remove("active");
  } else {
    selectedFunctionApp.push(name);
    btn.classList.add("active");
  }
  if (selectedFunctionApp.length > 0) {
    document.getElementById("filterFunctionApp").style.display = "inline-block";
  }
});
document.getElementById("filterFunctionApp").addEventListener("click", () => {
  const params = new URLSearchParams();
  selectedFunctionApp.forEach((f) => params.append("func", f));
  window.location.href = `/app?${params.toString()}`;
});
const filterAppSpan = document.querySelector("#filterApp span");
if (filterAppSpan) {
  filterAppSpan.addEventListener("click", () => {
    window.location.href = "/app";
  });
}
socket.on("update-funcapp", (newFuncApp) => {
  const newFunc = `<a class="functionApp">${newFuncApp.name}</a>`;
  document
    .getElementById("divFunctionApp")
    .insertAdjacentHTML("afterbegin", newFunc);
});

document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      hamburgerBtn.classList.toggle("active");
      navMenu.classList.toggle("active");
      if (navMenu.classList.contains("active")) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    });
    const navLink = navMenu.querySelectorAll("a");
    navLink.forEach((link) => {
      link.addEventListener("click", () => {
        hamburgerBtn.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("no-scroll");
      });
    });
  }
});
