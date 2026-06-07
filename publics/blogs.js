const socket = io();
socket.on("update-blogs", (newBlog) => {
  const currentBlog = document.querySelector(`a[data-idBlog="${newBlog._id}"]`);
  let plainText = newBlog.info.replace(/&nbsp;|&#160;/gi, " ");
  let shortText =
    plainText.length > 200 ? plainText.substring(0, 200) + "..." : plainText;
  if (currentBlog) {
    currentBlog.querySelector(".blogs img").src = newBlog.image;
    currentBlog.querySelector(".blogs .blogs-content h4").innerText =
      newBlog.title;
    currentBlog.querySelector(".blogs .blogs-content div").innerHTML =
      shortText;
  } else {
    const newBlogHTML = `
  <a href="/blogs/detailBlog/${newBlog._id}" target="_blank" class="linkImg" data-idBlog="${newBlog._id}">
    <div class="blogs">
      <img src="${newBlog.image}" alt="blogs">
      <div class="blogs-content">
        <h4>${newBlog.title}</h4>
        <div>${shortText}</div>
      </div>
    </div>
  </a>
  `;
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get("page")) || 1;
    if (currentPage === 1) {
      document
        .getElementById("listblogs")
        .insertAdjacentHTML("afterbegin", newBlogHTML);
      let blogs = document.querySelectorAll(".blogs");
      if (blogs.length > 12) {
        blogs[blogs.length - 1].remove();
      }
      blogs = document.querySelectorAll(".blogs");
    }
  }
});
socket.on("delete-blogs", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(`a[data-idBlog="${data._id}"]`);
    if (rowToDelete) {
      rowToDelete.remove();
    }
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

document
  .getElementById("btnCategoryBlog")
  .addEventListener("click", function () {
    const categoryWrapper = document.getElementById("categoryWrapper");
    const type = categoryWrapper.style.display === "block" ? "none" : "block";
    categoryWrapper.style.display = type;
    document.querySelectorAll("#filterBlogs a").forEach((btn) => {
      btn.classList.remove("active");
      this.classList.add("active");
    });
  });
let selectedCategoryblogs = [];
document.getElementById("divCategoryBlog").addEventListener("click", (e) => {
  const btn = e.target.closest(".categoryblogs");
  if (!btn) {
    return;
  }
  const name = btn.textContent.trim();
  if (selectedCategoryblogs.includes(name)) {
    selectedCategoryblogs = selectedCategoryblogs.filter((f) => f !== name);
    btn.classList.remove("active");
  } else {
    selectedCategoryblogs.push(name);
    btn.classList.add("active");
  }
  if (selectedCategoryblogs.length > 0) {
    document.getElementById("filterCategoryBlog").style.display =
      "inline-block";
  }
});
document.getElementById("filterCategoryBlog").addEventListener("click", () => {
  const params = new URLSearchParams();
  selectedCategoryblogs.forEach((f) => params.append("category", f));
  window.location.href = `/blogs?${params.toString()}`;
});
const filterBlogsSpan = document.querySelector("#filterBlogs span");
if (filterBlogsSpan) {
  filterBlogsSpan.addEventListener("click", () => {
    window.location.href = "/blogs";
  });
}
socket.on("update-categoryblogs", (data) => {
  const categoryNeedUD = document.querySelector(
    `a[data-idCategoryBlog="${data._id}"]`,
  );
  if (categoryNeedUD) {
    categoryNeedUD.innerText = data.name;
  } else {
    document.getElementById("divCategoryBlog").insertAdjacentHTML(
      "afterbegin",
      `
  <a class="categoryblogs" data-idCategoryBlog="${data._id}">${data.name}</a>  
  `,
    );
  }
});
socket.on("delete-categoryblogs", (data) => {
  if (data && data._id) {
    const categoryNeedDelete = document.querySelector(
      `a[data-idCategoryBlog="${data._id}"]`,
    );
    if (categoryNeedDelete) {
      categoryNeedDelete.remove();
    }
  }
});
function renderCategoryblogs(list_categoryblogs) {
  document.getElementById("divCategoryBlog").innerHTML = list_categoryblogs
    .map(
      (categoryblogs) => `
 <a class="categoryblogs">${categoryblogs.name}</a>
  `,
    )
    .join("");
}
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
