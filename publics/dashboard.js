import { scriptHeader } from "/script.js";
scriptHeader();
document.querySelectorAll(".navBtnDB").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".navBtnDB.active").classList.remove("active");
    document.querySelector(".tabContent.active").classList.remove("active");
    button.classList.add("active");
    document.getElementById(button.dataset.target).classList.add("active");
  });
});
document.getElementById("registerAdmin").addEventListener("submit", (e) => {
  e.preventDefault();
  const emailAdmin = document.getElementById("emailAdmin").value;
  const pwAdmin = document.getElementById("pwAdmin").value;
  const listDecentAdmin = document.querySelectorAll(
    "input[name='decentAdmin']:checked",
  );
  const valueDecentAdmin = Array.from(listDecentAdmin).map(
    (item) => item.value,
  );
  fetch("/dashboard/registerAdmin", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ emailAdmin, pwAdmin, valueDecentAdmin }),
  })
    .then((res) => res.json())
    .then(({ mess, status, err }) => {
      if (status) {
        alert(mess);
      } else {
        alert(`${mess}\n${err}`);
      }
    });
});
