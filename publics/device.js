const socket = io();
const createDeviceHTML=(newDevice)=>{
  return `
       <a href="/detailDevice/${newDevice._id}" target="_blank">
        <div class="device">
          <div class="divImg">
            <img src="${newDevice.images[0].url}" alt="device">
            <p>${newDevice.price.toLocaleString("vi-VN")} đ</p>
          </div>
          <div class="device-content">
            <h4>${newDevice.name}</h4>
            ${newDevice.info.replace(/&nbsp;|&#160;/gi, " ")}
          </div>
        </div>
      </a>
  `
}
socket.on("update-device", (data) => {
  const listdevices=document.getElementById("listdevices");
  if (!listdevices) {
    return
  }
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("page")) || 1;
  if (Array.isArray(data)) {
    if (currentPage === 1) {
      listdevices.innerHTML="";
      const deviceToRender=data.slice(0,12);
      deviceToRender.forEach((device)=>{
        listdevices.insertAdjacentHTML("beforeend", createDeviceHTML(device));
      })
  }
  } else {
    if (currentPage===1) {
      listdevices.insertAdjacentHTML("afterbegin", createDeviceHTML(data));
      let device = document.querySelectorAll(".device");
      if (device.length > 12) {
      device[device.length - 1].closest("a").remove();
      }
      device = document.querySelectorAll(".device");
    }
  }
});
document.getElementById("btnFuncDevice").addEventListener("click", function () {
  const functionWrapper = document.getElementById("functionWrapper");
  const type = functionWrapper.style.display === "block" ? "none" : "block";
  functionWrapper.style.display = type;
  document.querySelectorAll("#filterDevice a").forEach((btn) => {
    btn.classList.remove("active");
    this.classList.add("active");
  });
});
let selectedFunctionDevice = [];
document.getElementById("divFunctionDevice").addEventListener("click", (e) => {
  const btn = e.target.closest(".functionDevice");
  if (!btn) {
    return;
  }
  const name = btn.textContent.trim();
  if (selectedFunctionDevice.includes(name)) {
    selectedFunctionDevice = selectedFunctionDevice.filter((f) => f !== name);
    btn.classList.remove("active");
  } else {
    selectedFunctionDevice.push(name);
    btn.classList.add("active");
  }
  if (selectedFunctionDevice.length > 0) {
    document.getElementById("filterFunctionDevice").style.display =
      "inline-block";
  }
});
document
  .getElementById("filterFunctionDevice")
  .addEventListener("click", () => {
    const params = new URLSearchParams();
    selectedFunctionDevice.forEach((f) => params.append("func", f));
    window.location.href = `/device?${params.toString()}`;
  });
const filterDeviceSpan = document.querySelector("#filterDevice span");
if (filterDeviceSpan) {
  filterDeviceSpan.addEventListener("click", () => {
    window.location.href = "/device";
  });
}
socket.on("update-funcdevice", (newFuncDevice) => {
  const newFunc = `<a class="functionDevice">${newFuncDevice.name}</a>`;
  document
    .getElementById("divFunctionDevice")
    .insertAdjacentHTML("afterbegin", newFuncDevice);
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
