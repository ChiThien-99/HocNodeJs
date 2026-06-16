// const aboutIMZ = document.getElementById("aboutIMZ");
// const textAboutIMZ =
//   "Xin chào bạn<br/>Tôi là Zen (I'M Zen)<br/>Tôi là trí tuệ nhân tạo (AI)<br/>Tôi tạo ra phần mềm/thiết bị hỗ trợ trong các lĩnh vực:<br/>MÔI TRƯỜNG<br/>SỨC KHỎE<br/>IOT";
// const speed = 50;
// let i = 0;
// function typeWriter() {
//   if (i < textAboutIMZ.length) {
//     const char = textAboutIMZ.charAt(i);
//     if (char === "<") {
//       const endTag = textAboutIMZ.indexOf(">", i);
//       aboutIMZ.innerHTML += textAboutIMZ.substring(i, endTag + 1);
//       i = endTag + 1;
//     } else {
//       aboutIMZ.innerHTML += char;
//       i++;
//     }
//     setTimeout(typeWriter, speed);
//   }
// }
// window.onload = typeWriter;
import { authFetch2, setAccessToken2 } from "./authFetch.js";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
// window.addEventListener("beforeunload",function(e){
//   document.cookie = "accessToken2=;path=/;max-age=0;SameSite=none;Secure";
// })
const socket = io();
socket.on("update-app", (newApp) => {
  const existApp = document.querySelector(`a[data-idApp="${newApp._id}"]`);
  let price="";
    if (newApp.price==="Miễn phí") {
      price=`<p>Miễn phí</p>`;
    } else {
      price=
      `<p>${Number(newApp.price).toLocaleString('vi-VN')}đ%></p>
      <p>Dùng thử 30 ngày</p>`
    }
  if (existApp) {
    existApp.querySelector(".app img").src = newApp.image;
    existApp.querySelector(".app img").after(price);
    existApp.querySelector(".app .app-content h4").innerText = newApp.name;
    existApp.querySelector(".app .app-content div").innerHTML =
      newApp.info.replace(/&nbsp;|&#160;/gi, " ");
  } else {
    const newAppHTML = `
    <a href="/detailApp/${newApp._id}" target="_blank" data-idApp="${newApp._id}">
      <div class="app">
        <div>
          <img src="${newApp.image}" alt="app">
          ${price}
        </div>
        <div class="app-content">
          <h4>${newApp.name}</h4>
          <p>${newApp.info.replace(/&nbsp;|&#160;/gi," ")}</p>
        </div>
      </div>
    </a>
  `;
  document.getElementById("listApp").insertAdjacentHTML("afterbegin", newAppHTML);
  }
});
async function verifySession() {
  try {
    const response = await authFetch2("/api/auth/me2");
    if (!response.ok) {
      throw new Error("Session Expired");
    }
    console.log("Phiên làm việc hợp lệ");
  } catch (error) {
    console.error("Không thể refresh token, quay về login");
    // const currentPath = window.location.pathname + window.location.search;
    // window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
  }
}
verifySession();
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
      document.querySelector("#navMenu #groupBtn").style.display="none";
      document.querySelector("#navMenu #containerUserLogin").style.display="block";
      const decodedUser = jwtDecode(token);
      document.querySelector("#infoUserLogin h3").innerText = decodedUser.fullname;
      return decodedUser;
    } catch (error) {
      console.error(`Token không hợp lệ hoặc đã bị can thiệp ${error}`);
      return null;
    }
  } else {
    document.querySelector("#navMenu #groupBtn").style.display="block";
    document.querySelector("#navMenu #containerUserLogin").style.display="none";
    return null;
  }
}
window.onload = getUserFromCookie;
document.getElementById("btnLogoutUserLogin").addEventListener("click",(e)=>{
  e.preventDefault();
  fetch("/api/auth/logout",{
    method:"POST",
    credentials:"include",
  })
  .then(res=>res.json())
  .then(({mess,error,success})=>{
    if (success) {
      setAccessToken2(null);
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
    } else {
      alert("Lỗi",`${mess}\n${error}`,red);
    }
  })
  .catch((error)=>{
    alert("Lỗi",error,red);
    setAccessToken2(null);
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
  });
});
document.getElementById("btnDashboardUserLogin").addEventListener("click",(e)=>{
  e.preventDefault();
  window.open("/dashboardClient","_blank");
})
document.getElementById("btnRegisterClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=registerClient&redirect=${encodeURIComponent(currentPath)}`;
});
document.getElementById("btnLoginClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
});
import { alert, confirm } from "./alert.js";
const wrapper = document.getElementById("carousel-wrapper");
let slides = document.querySelectorAll(".carousel-slide");
let dots = document.querySelectorAll(".dot");
let index = 0;
let autoSlideInterval;
function initCarousel() {
  slides = document.querySelectorAll(".carousel-slide");
  dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const i = parseInt(dot.getAttribute("data-index"));
      currentSlide(i);
    });
  });
  index = 0;
  updateCarousel();
  resetTime();
}
function updateCarousel() {
  if (slides.length === 0) return;
  let offset = -index * 100;
  wrapper.style.transform = `translateX(${offset}%)`;
  dots.forEach((dot) => dot.classList.remove("active"));
  if (dots[index]) {
    dots[index].classList.add("active");
  }
}
document.getElementById("prev").addEventListener("click", function () {
  const index = this.getAttribute("data-index");
  changeSlide(Number(index));
});
document.getElementById("next").addEventListener("click", function () {
  const index = this.getAttribute("data-index");
  changeSlide(Number(index));
});

function changeSlide(n) {
  index += n;
  if (index >= slides.length) {
    index = 0;
  }
  if (index < 0) {
    index = slides.length - 1;
  }
  updateCarousel();
  resetTime();
}
dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = parseInt(dot.getAttribute("data-index"));
    currentSlide(index);
  });
});
function currentSlide(n) {
  index = n;
  updateCarousel();
  resetTime();
}
function startTime() {
  autoSlideInterval = setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
  }, 4000);
}
function resetTime() {
  clearInterval(autoSlideInterval);
  startTime();
}
startTime();

socket.on("update-carousel", (data) => {
  if (!Array.isArray(data)) {
    const currentCarousel = document.querySelector(
      `div[data-idCarousel="${data._id}"]`,
    );
    currentCarousel.querySelector("a").href = data.url;
    currentCarousel.querySelector("a img").src = data.image;
    currentCarousel.querySelector("a div").innerText = data.caption;
  } else {
    wrapper.innerHTML = data
      .map(
        (carousel) => `
     <div class="carousel-slide" data-idCarousel="${carousel._id}">
        <a href="${carousel.url}" target="_blank">
          <img src="${carousel.image}" loading="lazy" alt="carousel">
          <div class="carousel-caption">${carousel.caption}</div>
        </a>
      </div>
  `,
      )
      .join("");
    const indicators = document.getElementById("indicators");
    indicators.innerHTML = data.map(
      (_, i) => `
  <span class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></span>
  `,
    );
    initCarousel();
  }
});
socket.on("delete-carousel", (data) => {
  if (data.deleteCarousel && data.deleteCarousel._id) {
    const rowToDelete = document.querySelector(
      `div[data-idCarousel="${data.deleteCarousel._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
    const indicators = document.getElementById("indicators");
    indicators.innerHTML = data.allCarousel.map(
      (_, i) => `
  <span class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></span>
  `,
    );
    initCarousel();
  }
});
let notify = document.querySelectorAll(".notify");
socket.on("update-notify", (data) => {
  if (!Array.isArray(data)) {
    const currentNotify = document.querySelector(
      `div[data-idNotify="${data._id}"]`,
    );
    if (currentNotify) {
      currentNotify.querySelector("a").href = data.url;
      currentNotify.querySelector("a div .headerNotifyType").innerText =
        data.type;
      currentNotify.querySelector("a div .headerNotifyCreateAt").innerText =
        new Date(data.createAt).toLocaleString("vi-VN");
      currentNotify.querySelector("a p").innerText = data.content;
    } else {
      document.getElementById("bodyNotification").insertAdjacentHTML(
        "afterbegin",
        `
      <div class="notify" data-idNotify="${data._id}">
        <a href="${data.url}" target="_blank">
          <div class="headerNotify">
            <span class="headerNotifyType">${data.type}</span>
            <span class="headerNotifyCreateAt">${new Date(data.createAt).toLocaleString("vi-VN")}</span>
          </div>
          <p>${data.content}</p>
        </a>
      </div>
    `,
      );
    }
  } else {
    document.getElementById("bodyNotification").innerHTML = data
      .map(
        (notify) => `
    <div class="notify" data-idNotify="${notify._id}">
        <a href="${notify.url}" target="_blank">
          <div class="headerNotify">
            <span class="headerNotifyType">${notify.type}</span>
            <span class="headerNotifyCreateAt">${new Date(notify.createAt).toLocaleString("vi-VN")}</span>
          </div>
          <p>${notify.content}</p>
        </a>
      </div>
    `,
      )
      .join("");
  }
});
socket.on("delete-notify", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(
      `div[data-idNotify="${data._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
const selectFilter = document.querySelector(
  "select[name='filterNotification']",
);

selectFilter.addEventListener("change", function () {
  const type = this.value;
  fetch(`/index/filterNotify?type=${type}`, {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document.getElementById("filterNotification").style.color = "#0b57d0";
        document.getElementById("filterNotification").style.fontWeight = "bold";
      } else {
        console.error(`${mess}\n${error}`);
      }
    })
    .catch((error) => {
      console.error(`Lỗi kết nối: ${error}`);
    });
});
document.querySelectorAll("#filterOpera button").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll("#filterOpera button").forEach((btn) => {
      btn.classList.remove("active");
    });
    this.classList.add("active");
    document.querySelectorAll("#contentOpera div").forEach((div) => {
      div.classList.remove("active");
    });
    const operaActive = this.getAttribute("data-opera");
    document.getElementById(operaActive).classList.add("active");
  });
});
document.getElementById("formProblem").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const content = document.getElementById("contentProblem").value;
  fetch("/index/postProblem", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ name, content }),
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document.getElementById("name").value = "";
        document.getElementById("contentProblem").value = "";
        alert("Thông báo", mess, "#80a710");
      } else {
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi", error, "red");
    });
});
document.getElementById("formSubscribers").addEventListener("submit", (e) => {
  e.preventDefault();
  const nameSubscribers = document.getElementById("nameSubscribers").value;
  const emailSubscribers = document.getElementById("emailSubscribers").value;
  const telSubscribers = document.getElementById("telSubscribers").value;
  fetch("/index/postSubscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ nameSubscribers, emailSubscribers, telSubscribers }),
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document.getElementById("formSubscribers").reset();
        alert("Thông báo", mess, "#80a710");
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
document.addEventListener("DOMContentLoaded", () => {
  const device = document.querySelectorAll(".deviceIndex");
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
document.addEventListener("DOMContentLoaded", () => {
  if (typeof EmojiPicker !== "undefined") {
    new EmojiPicker();
  } else {
    console.error("Lỗi: Thư viện EmojiPicker chưa được tải thành công");
  }
});
