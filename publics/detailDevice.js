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
document
  .getElementById("btnDashboardUserLogin")
  .addEventListener("click", (e) => {
    e.preventDefault();
    window.open("/dashboardClient", "_blank");
  });
document.getElementById("btnRegisterClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=registerClient&redirect=${encodeURIComponent(currentPath)}`;
});
document.getElementById("btnLoginClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
});
socket.on("update-totalItems", (totalItems) => {
  const countBagShopping = document.querySelector("#bagShopping span");
  if (countBagShopping) {
    countBagShopping.innerText = totalItems;
  }
});
socket.on("update-detailDevice", (data) => {
  const mainDetailDevice = document.getElementById("mainDetailDevice");
  const idDevice = mainDetailDevice.getAttribute("data-idDetailDevice");
  if (idDevice !== data._id) {
    return;
  }
  window.location.reload();
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
    const color = this.querySelector("p").innerText;
    document.getElementById("inpColorDevice").value = color;
  });
});
document.addEventListener("DOMContentLoaded", () => {
  colorDevice[0].classList.add("active");
  const color = colorDevice[0].querySelector("p").innerText;
  document.getElementById("inpColorDevice").value = color;
});
document
  .getElementById("quantityDevice")
  .addEventListener("change", function () {
    if (this.value < 1) {
      return (this.value = 1);
    }
    const priceDevice = document.getElementById("priceDevice");
    const basePrice = Number(priceDevice.getAttribute("data-base-price"));
    const totalPrice = basePrice * Number(this.value);
    priceDevice.innerText = totalPrice.toLocaleString("vi-VN") + " đ";
    document.getElementById("quantityDevice2").innerText = this.value;
  });
document.getElementById("btnShareDevice").addEventListener("click", () => {
  const divShareSocial = document.getElementById("divShareSocial");
  let type = divShareSocial.style.display === "flex" ? "none" : "flex";
  divShareSocial.style.display = type;
});
document.getElementById("btnCartDevice").addEventListener("click", function () {
  const token = getCookie("accessToken2");
  const decodedeUser = jwtDecode(token);
  const idClient = decodedeUser.id;
  const productId = this.getAttribute("data-idDevice");
  const productName = this.getAttribute("data-nameDevice");
  const productPrice = this.getAttribute("data-priceDevice");
  const productQuantity = document.getElementById("quantityDevice").value;
  const productColor = document.getElementById("inpColorDevice").value;
  console.log(productQuantity);
  console.log(productColor);
  this.disabled = true;
  this.style.cursor = "not-allowed";
  fetch("/detailDevice/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({
      idClient,
      productId,
      productName,
      productPrice,
      productQuantity,
      productColor,
    }),
  })
    .then((res) => res.json())
    .then(({ success, mess, totalItems, error }) => {
      this.disabled = false;
      this.style.cursor = "pointer";
      if (success) {
        const countCart = document.querySelector("#bagShopping span");
        countCart.innerText = totalItems;
        countCart.classList.remove("bounce-animation");
        void countCart.offsetWidth;
        countCart.classList.add("bounce-animation");
        setTimeout(() => {
          countCart.classList.remove("bounce-animation");
        }, 500);
        const countCartHamburgerBtn = document.getElementById(
          "countCartHamburgerBtn",
        );
        countCartHamburgerBtn.innerText = totalItems;
        countCartHamburgerBtn.classList.remove("bounce-animation");
        void countCartHamburgerBtn.offsetWidth;
        countCartHamburgerBtn.classList.add("bounce-animation");
        setTimeout(() => {
          countCartHamburgerBtn.classList.remove("bounce-animation");
        }, 500);
      } else {
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    })
    .catch((error) => {
      this.disabled = false;
      this.style.cursor = "pointer";
      alert("Lỗi", error, "red");
    });
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
document.addEventListener("DOMContentLoaded", () => {
  const device = document.querySelectorAll(".device");
  for (let i = 0; i < device.length; i++) {
    const rawChucNangOtherDevice = document.querySelectorAll(
      ".rawChucNangOtherDevice",
    )[i].innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawChucNangOtherDevice, "text/html");
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
    document.querySelectorAll(".targetChucNangOtherDevice")[i].innerHTML =
      chucNangHTML || "<p>Đang cập nhật chức năng thiết bị</p>";
  }
});
document.addEventListener("DOMContentLoaded", () => {
  if (typeof EmojiPicker !== "undefined") {
    new EmojiPicker();
  } else {
    console.error("Lỗi: Thư viện EmojiPicker chưa được tải thành công");
  }
});
document.getElementById("formCommentDevice").addEventListener("submit", (e) => {
  e.preventDefault();
  const idComment = document.getElementById("idDevice").value;
  const parentCommentId = document.getElementById(
    "parentCommentDeviceId",
  ).value;
  const authorComment = document.getElementById("authorCommentDevice").value;
  const contentComment = document.getElementById("contentCommentDevice").value;
  fetch(`/detailDevice/addComment/${idComment}`, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ authorComment, contentComment, parentCommentId }),
  })
    .then((res) => res.json())
    .then(({ data, success }) => {
      if (success) {
        document.getElementById("parentCommentDeviceId").value = "";
        document.getElementById("authorCommentDevice").value = "";
        document.getElementById("contentCommentDevice").value = "";
        const noComment = document.getElementById("noCommentDevice");
        if (noComment) {
          noComment.remove();
        }
        document.getElementById("lenCommentDevice").innerHTML =
          `Bình luận ${data.length}`;
        const rootComments = data.filter((comment) => !comment.parentId);
        document.getElementById("listCommentDevice").innerHTML = rootComments
          .map((comment) => {
            const replies = data.filter(
              (reply) => String(reply.parentId) === String(comment._id),
            );
            const repliesHTML = replies
              .map(
                (reply) =>
                  `
            <div class="commentDevice">
            <p>
              <strong>${reply.author}</strong>
              <span>${reply.content}</span>
            </p>
            <div class="commentDevice-action">
              <div>
                <button type="button" class="btnLikeCommentDevice" data-idComment="${reply._id}"><i class="fa-solid fa-thumbs-up"></i> Thích (<span id="like-count-${reply._id}">${reply.likes.length}</span>)</button>
                <button type="button" class="btnReplyCommentDevice" data-idComment="${comment._id}" data-authorComment="${reply.author}"><i class="fa-solid fa-comment"></i> Trả lời</button>
              </div>
               <p>${new Date(reply.createAt).toLocaleString("vi-VN")}</p>
            </div>
            </div>
            `,
              )
              .join("");
            return `
       <div class="commentDevice">
        <p>
              <strong>${comment.author}</strong>
              <span>${comment.content}</span>
        </p>
        <div class="commentDevice-action">
            <div>
                <button type="button" class="btnLikeCommentDevice" data-idComment="${comment._id}"><i class="fa-solid fa-thumbs-up"></i> Thích (<span id="like-count-${comment._id}">${comment.likes.length}</span>)</button>
                <button type="button" class="btnReplyCommentDevice" data-idComment="${comment._id}" data-authorComment="${comment.author}"><i class="fa-solid fa-comment"></i> Trả lời</button>
            </div>
            <p>${new Date(comment.createAt).toLocaleString("vi-VN")}</p>
        </div>
        </div>
        <div class="repliesDevice-box">${repliesHTML}</div>
    `;
          })
          .join("");
      } else {
        console.error(`Lỗi: ${data}`);
      }
    })
    .catch((error) => {
      console.error(`Lỗi kết nối: ${error}`);
    });
});

document.getElementById("listCommentDevice").addEventListener("click", (e) => {
  const btnLike = e.target.closest(".btnLikeCommentDevice");
  if (!btnLike) {
    return;
  }
  const idComment = btnLike.getAttribute("data-idComment");
  fetch(`/detailDevice/commentLike/${idComment}`, {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ success, data, likeCount }) => {
      if (success) {
        document.getElementById(`like-count-${idComment}`).innerHTML =
          likeCount;
      } else {
        console.error(data);
      }
    })
    .catch((error) => {
      console.error(`Lỗi hệ thống ${error}`);
    });
});
document.getElementById("listCommentDevice").addEventListener("click", (e) => {
  const btnReply = e.target.closest(".btnReplyCommentDevice");
  if (!btnReply) {
    return;
  }
  const idComment = btnReply.getAttribute("data-idComment");
  const authorComment = btnReply.getAttribute("data-authorComment");
  const contentComment = document.getElementById("contentCommentDevice");
  contentComment.focus();
  contentComment.value = `@${authorComment}: `;
  let parentInput = document.getElementById("parentCommentDeviceId");
  if (!parentInput) {
    parentInput = document.createElement("input");
    parentInput.type = "hidden";
    parentInput.id = "parentCommentId";
    contentComment.parentNode.appendChild(parentInput);
  }
  parentInput.value = idComment;
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
