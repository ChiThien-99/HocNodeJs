const socket = io();
import { authFetch2, setAccessToken2 } from "./authFetch.js";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
import { alert, confirm } from "./alert.js";
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
      document.querySelector("#navMenu #groupBtn").style.display = "none";
      document.querySelector("#navMenu #containerUserLogin").style.display =
        "flex";
      const decodedUser = jwtDecode(token);
      document.querySelector("#infoUserLogin h3").innerText =
        decodedUser.fullname;
      const idClient = decodedUser.id;
      fetch(`/detailApp/cart/count?idClient=${idClient}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ success, totalItems }) => {
          if (success) {
            const countCart = document.querySelector("#bagShopping span");
            const countCartHamburgerBtn = document.getElementById(
              "countCartHamburgerBtn",
            );
            if (countCart || countCartHamburgerBtn) {
              countCart.innerText = totalItems;
              countCartHamburgerBtn.innerText = totalItems;
            }
          }
        })
        .catch((error) => {
          alert("Lỗi", error, "red");
        });
      document.getElementById("bagShopping").addEventListener("click", () => {
        window.open(`/cart/${idClient}`, "_blank");
      });
      document
  .getElementById("btnDashboardUserLogin")
  .addEventListener("click", (e) => {
    e.preventDefault();
    window.open(`/dashboardClient/${idClient}`, "_blank");
  });
      return decodedUser;
    } catch (error) {
      console.error(`Token không hợp lệ hoặc đã bị can thiệp ${error}`);
      return null;
    }
  } else {
    document.querySelector("#navMenu #groupBtn").style.display = "block";
    document.querySelector("#navMenu #containerUserLogin").style.display =
      "none";
    const countCart = document.querySelector("#bagShopping span");
    if (countCart) {
      countCart.innerText = 0;
    }
    return null;
  }
}
window.onload = getUserFromCookie;
document.getElementById("btnLogoutUserLogin").addEventListener("click", (e) => {
  e.preventDefault();
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.json())
    .then(({ mess, error, success }) => {
      if (success) {
        setAccessToken2(null);
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
      } else {
        alert("Lỗi", `${mess}\n${error}`, red);
      }
    })
    .catch((error) => {
      alert("Lỗi", error, red);
      setAccessToken2(null);
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
    });
});
document.getElementById("btnRegisterClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=registerClient&redirect=${encodeURIComponent(currentPath)}`;
});
document.getElementById("btnLoginClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
});
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
              ${newDevice.info.replace(/&nbsp;|&#160;/gi, " ")}
            </div>
            <div class="targetDeviceInfo"></div>
          </div>
        </div>
      </a>
  `;
};
socket.on("update-totalItems", (totalItems) => {
  const countBagShopping = document.querySelector("#bagShopping span");
  if (countBagShopping) {
    countBagShopping.innerText = totalItems;
  }
});
socket.on("update-device", (data) => {
  const existDevice = document.querySelector(`a[data-idDevice="${data._id}"]`);
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("page")) || 1;
  if (existDevice) {
    if (currentPage === 1) {
      existDevice.querySelector(".device .divImg img").src = data.images[0].url;
      existDevice.querySelector(".device .divImg p").innerText =
        `${data.price.toLocaleString("vi-VN")}đ`;
      existDevice.querySelector(".device .device-content h4").innerText =
        data.name;
      existDevice.querySelector(
        ".device .device-content .rawDeviceInfo",
      ).innerHTML = data.info.replace(/&nbsp;|&#160;/gi, " ");
      const device = document.querySelectorAll(".device");
      for (let i = 0; i < device.length; i++) {
        const rawDeviceInfo =
          document.querySelectorAll(".rawDeviceInfo")[i].innerHTML;
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
socket.on("delete-device", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(
      `a[data-idDevice="${data._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-banner", (data) => {
  console.log(data);
  if (data.page !== "device") {
    return;
  } else {
    const currentBanner = document.querySelector(
      `div[data-idBN="${data._id}"]`,
    );
    if (currentBanner) {
      currentBanner.querySelector("a").href = data.url;
      currentBanner.querySelector("a img").src = data.image;
    } else {
      const div = document.createElement("div");
      div.id = "banner";
      div.setAttribute("data-idBN", data._id);
      div.innerHTML = `
      <a href="${data.url}"><img src="${data.image}" alt="banner"></a>
     `;
      document.querySelector("aside").prepend(div);
    }
  }
});
socket.on("delete-banner", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(`div[data-idBN="${data._id}"]`);
    if (rowToDelete) {
      rowToDelete.remove();
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
  const existFuncDevice = document.querySelector(
    `a[data-idFuncDevice="${newFuncDevice._id}"]`,
  );
  if (existFuncDevice) {
    existFuncDevice.innerText = newFuncDevice.name;
  } else {
    const newFunc = `<a class="functionDevice">${newFuncDevice.name}</a>`;
    document
      .getElementById("divFunctionDevice")
      .insertAdjacentHTML("afterbegin", newFunc);
  }
});
socket.on("delete-funcdevice", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(
      `a[data-idFuncDevice="${data._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const token = getCookie("accessToken2");
  const listApp = document.querySelectorAll("#listAppCol .app");
  listApp.forEach((app) => {
    app.addEventListener("click", () => {
      if (!token) {
        alert("Thông báo", "Vui lòng đăng nhập để tiếp tục", "#80a710");
      }
    });
  });
  if (!token) {
    return;
  }
  const decodeToken = jwtDecode(token);
  const idClient = decodeToken.id;
  listApp.forEach((app) => {
    const idApp = app.getAttribute("data-idApp");
    checkOrActivateTrial(idClient, idApp, app);
    app.addEventListener("click", () => {
      console.log("OK");
      checkOrActivateTrial(idClient, idApp, app, true);
    });
  });
});
function checkOrActivateTrial(idClient, idApp, app, isClientClick = false) {
  fetch("/index/softwareAccess", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ idClient, idApp, isClientClick }),
  })
    .then((res) => res.json())
    .then(({ success, daysLeft, isExpired, mess, error }) => {
      if (success) {
        if (isExpired) {
          app.querySelector(".priceApp .statusTrial").innerText =
            "Đã hết hạn dùng thử";
          app.querySelector(".priceApp .statusTrial").style.backgroundColor =
            "red";
          if (isClientClick) {
            alert(
              "Thông báo",
              "Bạn hết hạn dùng thử hãy mua để sử dụng thoải mái nhé",
              "#80a710",
            );
          }
        } else {
          if (app.querySelector(".priceApp .statusTrial")) {
            app.querySelector(".priceApp .statusTrial").innerHTML =
              `Còn ${daysLeft} ngày dùng thử`;
          }
          if (isClientClick) {
            window.open(`/detailApp/${idApp}`, "_blank");
          }
        }
      } else {
        if (error) {
          alert("Lỗi", `${mess}\n${error}`, "red");
        } else {
          alert("Lỗi", mess, "red");
        }
      }
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const device = document.querySelectorAll(".device");
  for (let i = 0; i < device.length; i++) {
    const rawDeviceInfo =
      document.querySelectorAll(".rawDeviceInfo")[i].innerHTML;
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
