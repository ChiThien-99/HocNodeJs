const socket = io();
const createDeviceHTML = (newDevice) => {
  return `
       <a href="/detailDevice/${newDevice._id}" target="_blank">
        <div class="device" data-idDevice="${newDevice._id}">
          <div class="divImg">
            <img src="${newDevice.images[0].url}" alt="device">
            <p>${newDevice.price.toLocaleString("vi-VN")} đ</p>
          </div>
          <div class="device-content">
            <h4>${newDevice.name}</h4>
            <div class="rawDeviceInfo">
              ${newDevice.info.replace(/&nbsp;|&#160;/gi," ")}
            </div>
            <div class="targetDeviceInfo"></div>
          </div>
        </div>
      </a>
  `;
};

socket.on("update-device", (data) => {
  const existDevice=document.querySelector(`a[data-idDevice="${data._id}"]`)
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("page")) || 1;
  if (existDevice) {
    if (currentPage === 1) {
     existDevice.querySelector(".device .divImg img").src=data.images[0].url;
     existDevice.querySelector(".device .divImg p").innerText=`${data.price.toLocaleString('vi-VN')}đ`;
     existDevice.querySelector(".device .device-content h4").innerText=data.name;
     existDevice.querySelector(".device .device-content .rawDeviceInfo").innerHTML=data.info.replace(/&nbsp;|&#160;/gi," ");
     const device = document.querySelectorAll(".device");
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
    }
  } else {
    if (currentPage === 1) {
      listdevices.insertAdjacentHTML("afterbegin", createDeviceHTML(data));
      let device = document.querySelectorAll(".device");
      if (device.length > 12) {
        device[device.length - 1].closest("a").remove();
      }
      device = document.querySelectorAll(".device");
    }
  }
});
socket.on("delete-device",(data)=>{
  if (data&&data._id) {
    const rowToDelete=document.querySelector(`a[data-idDevice="${data._id}"]`);
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
})
socket.on("update-banner", (data) => {
  if (data.page !== "device") {
    return;
  } else {
    document.getElementById("banner").innerHTML = `
      <a href="${data.url}"><img src="${data.image}" alt="banner"></a>
     `;
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
  const existFuncDevice=document.querySelector(`a[data-idFuncDevice="${newFuncDevice._id}"]`);
  if (existFuncDevice) {
    existFuncDevice.innerText=newFuncDevice.name;
  } else {
  const newFunc = `<a class="functionDevice">${newFuncDevice.name}</a>`;
  document
    .getElementById("divFunctionDevice")
    .insertAdjacentHTML("afterbegin", newFunc);
  }
});
socket.on("delete-funcdevice",(data)=>{
  if (data&&data._id) {
    const rowToDelete=document.querySelector(`a[data-idFuncDevice="${data._id}"]`);
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
})
document.addEventListener("DOMContentLoaded", () => {
  const device = document.querySelectorAll(".device");
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
