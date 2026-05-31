const socket = io();
socket.on("update-blogs", (newBlog) => {
  let plainText = newBlog.info.replace(/<\/?[^>]+(>|$)/g, "");
  plainText = plainText.replace(/&nbsp;|&#160;/gi, " ");
  plainText = plainText.replace(/\s+/g, " ").trim();
  let shortText =
    plainText.length > 200 ? plainText.substring(0, 200) + "..." : plainText;
  const newBlogHTML = `
  <div class="blogs">
    <a href="/blogs/detailBlog/${newBlog._id}" target="_blank" class="linkImg"><img src="${newBlog.image}" alt="blogs"></a>
  <div class="blogs-content">
    <a href="/blogs/detailBlog/${newBlog._id}" target="_blank"><h4>${newBlog.title}</h4></a>
    <p>${shortText}</p> 
  </div>
  </div>
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
});
socket.on("update-banner", (data) => {
  console.log(data);
  if (data.page !== "blog") {
    return;
  } else {
    const banner = document.getElementById("banner");
    banner.innerHTML = `
      <a href="${data.url}"><img src="${data.image}" alt="banner"></a>
     `;
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
socket.on("update-categoryblogs", (allCategoryblogs) => {
  renderCategoryblogs(allCategoryblogs);
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
