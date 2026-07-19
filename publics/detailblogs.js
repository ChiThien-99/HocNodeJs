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
const socket = io();
socket.on("update-totalItems", (totalItems) => {
  const countBagShopping = document.querySelector("#bagShopping span");
  if (countBagShopping) {
    countBagShopping.innerText = totalItems;
  }
});
socket.on("update-banner", (data) => {
  if (data.page !== "blog") {
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
document.addEventListener("DOMContentLoaded", () => {
  if (typeof EmojiPicker !== "undefined") {
    new EmojiPicker();
  } else {
    console.error("Lỗi: Thư viện EmojiPicker chưa được tải thành công");
  }
});
document.getElementById("formComment").addEventListener("submit", (e) => {
  e.preventDefault();
  const idComment = document.getElementById("idblogs").value;
  const parentCommentId = document.getElementById("parentCommentId").value;
  const authorComment = document.getElementById("authorComment").value;
  const contentComment = document.getElementById("contentComment").value;
  fetch(`/blogs/addComment/${idComment}`, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ authorComment, contentComment, parentCommentId }),
  })
    .then((res) => res.json())
    .then(({ data, success }) => {
      if (success) {
        document.getElementById("parentCommentId").value = "";
        document.getElementById("authorComment").value = "";
        document.getElementById("contentComment").value = "";
        const noComment = document.getElementById("noComment");
        if (noComment) {
          noComment.remove();
        }
        document.getElementById("lenComment").innerHTML =
          `Bình luận ${data.length}`;
        const rootComments = data.filter((comment) => !comment.parentId);
        document.getElementById("listComment").innerHTML = rootComments
          .map((comment) => {
            const replies = data.filter(
              (reply) => String(reply.parentId) === String(comment._id),
            );
            const repliesHTML = replies
              .map(
                (reply) =>
                  `
            <div class="comment">
            <p>
              <strong>${reply.author}</strong>
              <span>${reply.content}</span>
            </p>
            <div class="comment-action">
              <div>
                <button type="button" class="btnLikeComment" data-idComment="${reply._id}"><i class="fa-solid fa-thumbs-up"></i> Thích (<span id="like-count-${reply._id}">${reply.likes.length}</span>)</button>
                <button type="button" class="btnReplyComment" data-idComment="${comment._id}" data-authorComment="${reply.author}"><i class="fa-solid fa-comment"></i> Trả lời</button>
              </div>
               <p>${new Date(reply.createAt).toLocaleString("vi-VN")}</p>
            </div>
            </div>
            `,
              )
              .join("");
            return `
       <div class="comment">
        <p>
              <strong>${comment.author}</strong>
              <span>${comment.content}</span>
        </p>
        <div class="comment-action">
            <div>
                <button type="button" class="btnLikeComment" data-idComment="${comment._id}"><i class="fa-solid fa-thumbs-up"></i> Thích (<span id="like-count-${comment._id}">${comment.likes.length}</span>)</button>
                <button type="button" class="btnReplyComment" data-idComment="${comment._id}" data-authorComment="${comment.author}"><i class="fa-solid fa-comment"></i> Trả lời</button>
            </div>
            <p>${new Date(comment.createAt).toLocaleString("vi-VN")}</p>
        </div>
        </div>
        <div class="replies-box">${repliesHTML}</div>
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

document.getElementById("listComment").addEventListener("click", (e) => {
  const btnLike = e.target.closest(".btnLikeComment");
  if (!btnLike) {
    return;
  }
  const idComment = btnLike.getAttribute("data-idComment");
  fetch(`/blogs/commentLike/${idComment}`, {
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
document.getElementById("listComment").addEventListener("click", (e) => {
  const btnReply = e.target.closest(".btnReplyComment");
  if (!btnReply) {
    return;
  }
  const idComment = btnReply.getAttribute("data-idComment");
  const authorComment = btnReply.getAttribute("data-authorComment");
  const contentComment = document.getElementById("contentComment");
  contentComment.focus();
  contentComment.value = `@${authorComment}: `;
  let parentInput = document.getElementById("parentCommentId");
  if (!parentInput) {
    parentInput = document.createElement("input");
    parentInput.type = "hidden";
    parentInput.id = "parentCommentId";
    contentComment.parentNode.appendChild(parentInput);
  }
  parentInput.value = idComment;
});
document.getElementById("btnShare").addEventListener("click", () => {
  const divShareSocial = document.querySelector("#divShare div");
  const width = divShareSocial.style.width === "6rem" ? "0px" : "6rem";
  divShareSocial.style.width = width;
});
document.getElementById("btnShareFB").addEventListener("click", () => {
  const urlCurrent = encodeURIComponent(window.location.href);
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${urlCurrent}`;
  window.open(
    fbShareUrl,
    "facebook-share-dialog",
    "width=600,height=400,resizable=yes,scrollbars=yes",
  );
});
document.getElementById("btnShareZL").addEventListener("click", () => {
  const urlCurrent = encodeURIComponent(window.location.href);
  const zlShareUrl = `https://zalo.me/share?url=${urlCurrent}`;
  window.open(
    zlShareUrl,
    "zalo-share-dialog",
    "width=600,height=500,resizable=yes,scrollbars=yes",
  );
});
document.addEventListener("DOMContentLoaded", () => {
  const device = document.querySelectorAll(".deviceCol");
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
  const navMenu = document.getElementById("divNavMenu");
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
