export const scriptHeader=()=>{
const navCongCu = document.getElementById("navCongCu");
const listNavCongCu = document.getElementById("listNavCongCu");
navCongCu.addEventListener("click", (e) => {
  e.stopPropagation();
  listNavCongCu.style.display =
    listNavCongCu.style.display == "block" ? "none" : "block";
});
document.addEventListener("click", (e) => {
  if (!listNavCongCu.contains(e.target) && e.target !== navCongCu) {
    listNavCongCu.style.display = "none";
  }
});
window.addEventListener("scroll", () => {
  if (listNavCongCu.style.display == "block") {
    listNavCongCu.style.display = "none";
  }
});

}
