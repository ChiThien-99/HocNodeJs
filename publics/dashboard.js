import {scriptHeader} from "/script.js";
scriptHeader();
document.querySelectorAll(".navBtnDB").forEach(button=>{
    button.addEventListener("click",()=>{
        document.querySelector(".navBtnDB.active").classList.remove("active");
        document.querySelector(".tabContent.active").classList.remove("active");
        button.classList.add("active");
        document.getElementById(button.dataset.target).classList.add("active");
    })
})