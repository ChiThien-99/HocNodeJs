const wrapper = document.getElementById("carousel-wrapper");
let slides = document.querySelectorAll(".carousel-slide");
let dots = document.querySelectorAll(".dot");
let index = 0;
let autoSlideInterval;

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
}
const colorDevice = document.querySelectorAll(".colorDevice");
colorDevice.forEach((color) => {
  color.addEventListener("click", function () {
    const index = this.getAttribute("data-index");
    currentSlide(index);
    for (let i = 0; i < colorDevice.length; i++) {
      colorDevice[i].classList.remove("active");
    }
    this.classList.add("active");
  });
});
document
  .getElementById("quantityDevice")
  .addEventListener("input", function () {
    if (this.value < 0) {
      return (this.value = 0);
    }
  });
document.getElementById("btnShareDevice").addEventListener("click", () => {
  const divShareSocial = document.getElementById("divShareSocial");
  let type = divShareSocial.style.display === "flex" ? "none" : "flex";
  divShareSocial.style.display = type;
});
const groupNavigationBodyDevice = document.querySelectorAll(
  "#groupNavigationBodyDevice button",
);
groupNavigationBodyDevice.forEach((btn) => {
  btn.addEventListener("click", function () {
    const navigationDevice = this.getAttribute("data-naviDevice");
    const mainBodyDetailDevice = document.querySelectorAll(
      "#mainBodyDetailDevice div",
    );
    for (let i = 0; i < groupNavigationBodyDevice.length; i++) {
      groupNavigationBodyDevice[i].classList.remove("active");
    }
    for (let i = 0; i < mainBodyDetailDevice.length; i++) {
      mainBodyDetailDevice[i].classList.remove("active");
    }
    this.classList.add("active");
    document.getElementById(navigationDevice).classList.add("active");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const rawQuill = document.getElementById("rawQuillContent").innerHTML;
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawQuill, "text/html");
  let huongdanHTML = "";
  let thongSoHTML = "";
  let chucNangHTML = "";
  let thongTinHTML = "";
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
    if (currenSection === "thongso") {
      thongSoHTML += element.outerHTML;
    } else if (currenSection === "chucnang") {
      chucNangHTML += element.outerHTML;
    } else if (currenSection === "thongtin") {
      thongTinHTML += element.outerHTML;
    }
  }

  document.getElementById("targetChucNang").innerHTML =
    chucNangHTML || "<p>Đang cập nhật chức năng thiết bị</p>";
  document.getElementById("targetThongSo").innerHTML =
    thongSoHTML || "<p>Đang cập nhật thông số thiết bị</p>";
  document.getElementById("targetThongTin").innerHTML =
    thongTinHTML || "<p>Đang cập nhật thông tin thiết bị</p>";
});
