const socket = io();
let blogs = document.querySelectorAll(".blogs");
const listblogs = document.getElementById("listblogs");
socket.on("update-blogs", (data) => {
  renderblogs(data.allblogs);
  blogs = document.querySelectorAll(".blogs");
});
function renderblogs(list_blogs) {
  listblogs.innerHTML = list_blogs
    .map((blogs) => {
      let plainText = blogs.info.replace(/<\/?[^>]+(>|$)/g, "");
      plainText = plainText.replace(/&nbsp;|&#160;/gi, " ");
      plainText = plainText.replace(/\s+/g, " ").trim();
      let shortText =
        plainText.length > 200
          ? plainText.substring(0, 200) + "..."
          : plainText;
      return `
  <div class="blogs">
    <a href="/blogs/detailBlog/${blogs._id}" target="_blank" class="linkImg"><img src="${blogs.image}" alt="blogs"></a>
  <div class="blogs-content">
    <a href="/blogs/detailBlog/${blogs._id}" target="_blank"><h4>${blogs.title}</h4></a>
    <p>${shortText}</p> 
  </div>
  </div>
  `;
    })
    .join("");
}

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
 <button class="categoryblogs">${categoryblogs.name}</button>
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
