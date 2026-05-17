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
const socket = io();
socket.on("update-carousel", (allBanner) => {
  console.log("Nhận được cập nhật banner:", allBanner);
  console.log(wrapper);
  wrapper.innerHTML = allBanner
    .map(
      (banner) => `
     <div class="carousel-slide">
        <a href="${banner.url}" target="_blank">
            <img src="${banner.image}" alt="banner1">
            <div class="carousel-caption">${banner.caption}</div>
        </a>
     </div>  
  `,
    )
    .join("");
  const indicators = document.getElementById("indicators");
  indicators.innerHTML = allBanner.map(
    (_, i) => `
  <span class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></span>
  `,
  );
  initCarousel();
  console.log("Đã cập nhật và đồng bộ hóa");
});
let notify = document.querySelectorAll(".notify");
socket.on("update-notify", (allNotify) => {
  renderNotify(allNotify);
  notify = document.querySelectorAll(".notify");
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

function renderNotify(data) {
  const bodyNotification = document.getElementById("bodyNotification");
  bodyNotification.innerHTML = data
    .map(
      (notify) => `
  <div class="notify">
    <a href="${notify.url}" target="_blank">
      <div class="headerNotify">
        <span>${notify.type}</span>
        <span>${new Date(notify.createAt).toLocaleString()}</span>
      </div>
      <p>${notify.content}</p>
    </a>
  </div>
  `,
    )
    .join("");
}
document.getElementById("btnFuncApp").addEventListener("click", () => {
  const divFuncBtns = document.getElementById("divFuncBtns");
  const type = divFuncBtns.style.display === "block" ? "none" : "block";
  divFuncBtns.style.display = type;
  document.querySelectorAll("#groupFilterApp button").forEach((btn) => {
    btn.classList.remove("active");
    const id = btn.getAttribute("id");
    if (id === "btnFuncApp") {
      btn.classList.add("active");
    }
  });
});
window.addEventListener("click", (event) => {
  const btnFuncApp = document.getElementById("btnFuncApp");
  const divFuncBtns = document.getElementById("divFuncBtns");
  if (
    (divFuncBtns.style.display =
      "block" &&
      !divFuncBtns.contains(event.target) &&
      !btnFuncApp.contains(event.target))
  ) {
    divFuncBtns.style.display = "none";
  }
});
let app = document.querySelectorAll(".app");
const listApp = document.getElementById("listApp");
socket.on("update-app", (allApp) => {
  renderApp(allApp);
  app = document.querySelectorAll(".app");
});
function renderApp(apps) {
  listApp.innerHTML = apps
    .map(
      (app) => `
  <div class="app">
    <div>
      <img src="${app.image}" alt="app">
    </div>
    <div>
      <h4>${app.name}</h4>
      <p>${app.info}</p>
      <a href="/app/${app.name}/${app._id}" target="_blank">Truy cập</a>
    </div>
  </div>
  `,
    )
    .join("");
}
document.getElementById("btnNewApp").addEventListener("click", () => {
  fetch("/index/filter/newApp", {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document.querySelectorAll("#groupFilterApp button").forEach((btn) => {
          btn.classList.remove("active");
          const id = btn.getAttribute("id");
          if (id === "btnNewApp") {
            btn.classList.add("active");
          }
        });
      } else {
        console.error(`${mess}\n${error}`);
      }
    })
    .catch((error) => {
      console.error(`Lỗi kết nối: ${error}`);
    });
});
document.getElementById("btnPopularApp").addEventListener("click", () => {
  fetch("/index/filter/popularApp", {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document.querySelectorAll("#groupFilterApp button").forEach((btn) => {
          btn.classList.remove("active");
          const id = btn.getAttribute("id");
          if (id === "btnPopularApp") {
            btn.classList.add("active");
          }
        });
      } else {
        console.error(`${mess}\n${error}`);
      }
    })
    .catch((error) => {
      console.error(`Lỗi kết nối: ${error}`);
    });
});
const funcBtns = document.getElementById("funcBtns");
const funcBtn = document.querySelectorAll(".funcBtn");
socket.on("update-funcapp", (allFuncApp) => {
  renderFuncApp(allFuncApp);
  funcBtn = document.querySelectorAll(".funcBtn");
});
function renderFuncApp(funcapps) {
  funcBtns.innerHTML = funcapps
    .map(
      (funcapp) => `
 <button>${funcapp.name}</button>
  `,
    )
    .join("");
}
let selectedFunction = [];
funcBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.innerHTML;
    const divDeleteFuncBtn = document.getElementById("divDeleteFuncBtn");
    if (selectedFunction.includes(name)) {
      selectedFunction = selectedFunction.filter((f) => f !== name);
      btn.classList.remove("active");
    } else {
      selectedFunction.push(name);
      btn.classList.add("active");
      document.getElementById("btnNewApp").classList.remove("active");
      document.getElementById("btnPopularApp").classList.remove("active");
    }
    let type = selectedFunction.length > 0 ? "flex" : "none";
    divDeleteFuncBtn.style.display = type;
    const params = new URLSearchParams();
    selectedFunction.forEach((f) => params.append("names", f));
    fetch(`/index/filter/funcApp?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (!success) {
          console.error(`${mess}\n${error}`);
        }
      })
      .catch((error) => {
        console.error(`Lỗi kết nối: ${error}`);
      });
  });
});
document.getElementById("deleteFuncBtn").addEventListener("click", () => {
  selectedFunction = [];
  funcBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
  fetch("/index/filter/newApp", {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document.querySelectorAll("#groupFilterApp button").forEach((btn) => {
          btn.classList.remove("active");
          const id = btn.getAttribute("id");
          if (id === "btnNewApp") {
            btn.classList.add("active");
          }
        });
      } else {
        console.error(`${mess}\n${error}`);
      }
    })
    .catch((error) => {
      console.error(`Lỗi kết nối: ${error}`);
    });
});
document.getElementById("btnFuncDevice").addEventListener("click", () => {
  const divFuncDeviceBtns = document.getElementById("divFuncDeviceBtns");
  const type = divFuncDeviceBtns.style.display === "block" ? "none" : "block";
  divFuncDeviceBtns.style.display = type;
  document.querySelectorAll("#groupFilterDevice button").forEach((btn) => {
    btn.classList.remove("active");
    const id = btn.getAttribute("id");
    if (id === "btnFuncDevice") {
      btn.classList.add("active");
    }
  });
});
window.addEventListener("click", (event) => {
  const btnFuncDevice = document.getElementById("btnFuncDevice");
  const divFuncDeviceBtns = document.getElementById("divFuncDeviceBtns");
  if (
    (divFuncDeviceBtns.style.display =
      "block" &&
      !divFuncDeviceBtns.contains(event.target) &&
      !btnFuncDevice.contains(event.target))
  ) {
    divFuncDeviceBtns.style.display = "none";
  }
});
const funcDeviceBtns = document.getElementById("funcDeviceBtns");
const funcDeviceBtn = document.querySelectorAll(".funcDeviceBtn");
socket.on("update-funcdevice", (allFuncDevice) => {
  renderFuncDevice(allFuncDevice);
  funcDeviceBtn = document.querySelectorAll(".funcDeviceBtn");
});
function renderFuncDevice(funcdevices) {
  funcDeviceBtns.innerHTML = funcdevices
    .map(
      (funcdevice) => `
 <button>${funcdevice.name}</button>
  `,
    )
    .join("");
}
let device = document.querySelectorAll(".device");
const listDevice = document.getElementById("listDevice");
socket.on("update-device", (allDevice) => {
  renderDevice(allDevice);
  device = document.querySelectorAll(".device");
});
function renderDevice(devices) {
  listDevice.innerHTML = devices
    .map(
      (device) => `
  <div class="device">
    <div>
      <img src="${device.image}" alt="device">
      <p>${device.price.toLocaleString("vi-VN")}đ</p>
    </div>
    <div>
      <h4>${device.name}</h4>
      <p>${device.info}</p>
      <a href="/device/${device.name}/${device._id}" target="_blank">Xem chi tiết</a>
    </div>
  </div>
  `,
    )
    .join("");
}
document.getElementById("btnNewDevice").addEventListener("click", () => {
  fetch("/index/filter/newDevice", {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document
          .querySelectorAll("#groupFilterDevice button")
          .forEach((btn) => {
            btn.classList.remove("active");
            const id = btn.getAttribute("id");
            if (id === "btnNewDevice") {
              btn.classList.add("active");
            }
          });
      } else {
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi kết nối", error, "red");
    });
});
let selectedDeviceFunction = [];
funcDeviceBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.innerHTML;
    const divDeleteFuncDeviceBtn = document.getElementById(
      "divDeleteFuncDeviceBtn",
    );
    if (selectedDeviceFunction.includes(name)) {
      selectedDeviceFunction = selectedDeviceFunction.filter((f) => f !== name);
      btn.classList.remove("active");
    } else {
      selectedDeviceFunction.push(name);
      btn.classList.add("active");
      document.getElementById("btnNewDevice").classList.remove("active");
      document.getElementById("btnPopularDevice").classList.remove("active");
      document.getElementById("btnPriceLowHigh").classList.remove("active");
      document.getElementById("btnPriceHighLow").classList.remove("active");
    }
    let type = selectedDeviceFunction.length > 0 ? "flex" : "none";
    divDeleteFuncDeviceBtn.style.display = type;
    const params = new URLSearchParams();
    selectedDeviceFunction.forEach((f) => params.append("names", f));
    fetch(`/index/filter/funcDevice?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (!success) {
          console.error(`${mess}\n${error}`);
        }
      })
      .catch((error) => {
        console.error(`Lỗi kết nối: ${error}`);
      });
  });
});
document.getElementById("deleteFuncDeviceBtn").addEventListener("click", () => {
  selectedDeviceFunction = [];
  funcDeviceBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
  fetch("/index/filter/newDevice", {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document
          .querySelectorAll("#groupFilterDevice button")
          .forEach((btn) => {
            btn.classList.remove("active");
            const id = btn.getAttribute("id");
            if (id === "btnNewDevice") {
              btn.classList.add("active");
            }
          });
      } else {
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi kết nối", error, "red");
    });
});
document.getElementById("btnPriceLowHigh").addEventListener("click", () => {
  fetch("/index/filter/priceLowHigh", {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document
          .querySelectorAll("#groupFilterDevice button")
          .forEach((btn) => {
            btn.classList.remove("active");
            const id = btn.getAttribute("id");
            if (id === "btnPriceLowHigh") {
              btn.classList.add("active");
            }
          });
      } else {
        console.error(`${mess}\n${error}`);
      }
    })
    .catch((error) => {
      console.error(`Lỗi kết nối: ${error}`);
    });
});
document.getElementById("btnPriceHighLow").addEventListener("click", () => {
  fetch("/index/filter/priceHighLow", {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document
          .querySelectorAll("#groupFilterDevice button")
          .forEach((btn) => {
            btn.classList.remove("active");
            const id = btn.getAttribute("id");
            if (id === "btnPriceHighLow") {
              btn.classList.add("active");
            }
          });
      } else {
        console.error(`${mess}\n${error}`);
      }
    })
    .catch((error) => {
      console.error(`Lỗi kết nối: ${error}`);
    });
});
let news = document.querySelectorAll(".news");
const listNews = document.getElementById("listNews");
socket.on("update-news", (allNews) => {
  renderNews(allNews);
  news = document.querySelectorAll(".news");
});
function renderNews(list_news) {
  listNews.innerHTML = list_news
    .map(
      (news) => `
  <div class="news">
    <a href="${news.url}" target="_blank" class="linkImg"><img src="${news.image}" alt="news"></a>
    <div class="news-content">
      <a href="${news.url}" target="_blank"><h4>${news.title}</h4></a>
      ${news.info} 
    </div>
  </div>
  `,
    )
    .join("");
}
let selectedCategoryNews = [];
const listCategoryNews = document.querySelectorAll(".categoryNews");
listCategoryNews.forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.innerHTML;
    if (selectedCategoryNews.includes(name)) {
      selectedCategoryNews = selectedCategoryNews.filter((f) => f !== name);
      btn.classList.remove("active");
    } else {
      selectedCategoryNews.push(name);
      btn.classList.add("active");
    }
    const params = new URLSearchParams();
    selectedCategoryNews.forEach((f) => params.append("names", f));
    fetch(`/index/filter/categoryNews?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (!success) {
          console.error(`${mess}\n${error}`);
        }
      })
      .catch((error) => {
        console.error(`Lỗi kết nối: ${error}`);
      });
  });
});
let categoryNews = document.querySelectorAll(".categoryNews");
const groupFilterCategoryNews = document.getElementById(
  "groupFilterCategoryNews",
);
socket.on("update-categoryNews", (allCategoryNews) => {
  renderCategoryNews(allCategoryNews);
  categoryNews = document.querySelectorAll(".categoryNews");
});
function renderCategoryNews(list_categorynews) {
  groupFilterCategoryNews.innerHTML = list_categorynews
    .map(
      (categorynews) => `
 <button class="categoryNews">${categorynews.name}</button>
  `,
    )
    .join("");
}
