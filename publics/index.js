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
  fetch(`/index/filterNotify?type=${type}`,{
    method:"GET",
    headers:{"Content-Type":"application/json;charset=UTF-8"},
  })
  .then(res=>res.json())
  .then(({mess,success,error})=>{
    if (success) {
      document.getElementById("filterNotification").style.color="#0b57d0";
      document.getElementById("filterNotification").style.fontWeight="bold";
    } else {
      console.error(`${mess}\n${error}`)
    }
  })
  .catch((error)=>{
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
};
document.getElementById("btnFuncApp").addEventListener("click", () => {
  const divFuncBtns = document.getElementById("divFuncBtns");
  const type = divFuncBtns.style.display === "block" ? "none" : "block";
  divFuncBtns.style.display = type;
});
let app = document.querySelectorAll(".app");
const listApp = document.getElementById("listApp");
socket.on("update-app", (allApp) => {
  renderApp(allApp);
  app = document.querySelectorAll(".app");
});
function renderApp(app){
listApp.innerHTML = app
    .map(
      (app) => `
  <div class="app">
    <div>
      <img src="${app.image}" alt="app">
    </div>
    <div>
      <h4>${app.name}</h4>
      <p>${app.info}</p>
      <a href="${app.url}">Truy cập</a>
    </div>
  </div>
  `,
    )
    .join("");
}
document.getElementById("btnNewApp").addEventListener("click",()=>{
  fetch("/index/filter/newApp",{
    method:"GET",
    headers:{"Content-Type":"application/json;charset=UTF-8"},
  })
  .then(res=>res.json())
  .then(({mess,success,error})=>{
    if (success) {
      document.querySelectorAll("#groupFilterApp button").forEach((btn)=>{
        btn.classList.remove("active");
        const id=btn.getAttribute("id");
        if(id==="btnNewApp"){
          btn.classList.add("active");
        }
      })
    } else {
      console.error(`${mess}\n${error}`);
    }
  })
  .catch((error)=>{
    console.error(`Lỗi kết nối: ${error}`)
  });
});
document.querySelectorAll(".btnApp").forEach((btn)=>{
  btn.addEventListener("click",()=>{
    const nameapp=btn.getAttribute("data-nameapp");
    const idapp=btn.getAttribute("data-idapp");
    fetch(`/app1/${nameapp}/${idapp}`,{
      method:"GET",
      headers:{"Content-Type":"application/json;charset=UTF-8"},
    });
  })
})
