const socket = io();
socket.on("update-app", (newApp) => {
  const existApp=document.querySelector(`a[data-idApp="${newApp._id}"]`);
  if (existApp) {
    existApp.querySelector(".app img").src=newApp.image;
    existApp.querySelector(".app .app-content h4").innerText=newApp.name;
    existApp.querySelector(".app .app-content div").innerHTML=newApp.info.replace(/&nbsp;|&#160;/gi, " ");
  } else {
    const newAppHTML = `
    <a href="/detailApp/${newApp._id}" data-idApp="${newApp._id}" target="_blank">
      <div class="app">
        <img src="${newApp.image}" alt="app">
        <div class="app-content">
            <h4>${newApp.name}</h4>
            <div>
               ${newApp.info.replace(/&nbsp;|&#160;/gi, " ")}
            </div>
        </div>
      </div>
    </a>
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
  }
  
});
socket.on("update-banner", (data) => {
  if (data.page !== "app") {
    return;
  } else {
    const banner = document.getElementById("banner");
    banner.innerHTML = `
      <a href="${data.url}"><img src="${data.image}" alt="banner"></a>
     `;
  }
});
socket.on("delete-app",(data)=>{
  if (data && data._id) {
    const rowToDelete = document.querySelector(`a[data-idApp="${data._id}"]`);
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
})
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
document.addEventListener("DOMContentLoaded", () => {
  const device = document.querySelectorAll(".deviceCol");
  for (let i = 0; i < device.length; i++) {
    const rawDeviceInfo = document.querySelectorAll(
      ".rawDeviceInfo",
    )[i].innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawDeviceInfo, "text/html");
    let chucNangHTML = "";
    let currenSection = "";
    const childNodes = doc.body.children;
    for (let i = 0; i < childNodes.length; i++) {
      const element = childNodes[i];
      if (element.tagName === "H3") {
        const text = element.textContent.toLowerCase().trim();
        if (text.includes("thông số")) {
          currenSection = "thongso";
          continue;
        } else if (text.includes("chức năng")) {
          currenSection = "chucnang";
          continue;
        } else if (text.includes("thông tin")) {
          currenSection = "thongtin";
          continue;
        }
      }
      if (currenSection === "chucnang") {
        chucNangHTML += element.outerHTML;
      }
    }
    document.querySelectorAll(".targetDeviceInfo")[i].innerHTML =
      chucNangHTML || "<p>Đang cập nhật chức năng thiết bị</p>";
  }
});
