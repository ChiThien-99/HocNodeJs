import { scriptHeader } from "/script.js";
scriptHeader();
const aboutIMZ=document.getElementById("aboutIMZ");
const textAboutIMZ="Xin chào bạn<br/>Tôi là Zen (I'M Zen)<br/>Tôi là trí tuệ nhân tạo (AI)<br/>Tôi tạo ra phần mềm/thiết bị hỗ trợ trong các lĩnh vực:<br/>Môi trường-Sức khỏe-IOT";
const speed=50;
let i=0;
function typeWriter(){
if (i<textAboutIMZ.length) {
    const char=textAboutIMZ.charAt(i);
    if(char==="<"){
       const endTag=textAboutIMZ.indexOf(">",i);
       aboutIMZ.innerHTML+=textAboutIMZ.substring(i,endTag+1);
       i=endTag+1;
    }else{
       aboutIMZ.innerHTML+=char;
       i++;
    }
    setTimeout(typeWriter,speed);
}
}
window.onload=typeWriter;
const wrapper=document.getElementById("carousel-wrapper");
const slides=document.querySelectorAll(".carousel-slide");
const dots=document.querySelectorAll(".dot");
let index=0;
let autoSlideInterval;
function updateCarousel(){
    let offset=-index*100;
    wrapper.style.transform=`translateX(${offset}%)`;
    dots.forEach(dot=>dot.classList.remove("active"));
    dots[index].classList.add("active");
}
document.getElementById("prev").addEventListener("click",function(){
    const index=this.getAttribute("data-index");
    changeSlide(Number(index));
});
document.getElementById("next").addEventListener("click",function(){
    const index=this.getAttribute("data-index");
    changeSlide(Number(index));
});

function changeSlide(n){
    index+=n;
    if(index>=slides.length){
        index=0;
    }
    if (index<0) {
        index=slides.length-1;
    }
    updateCarousel();
    resetTime();
}
dots.forEach(dot=>{
    dot.addEventListener("click",()=>{
        const index=dot.getAttribute("data-index");
        currentSlide(Number(index));
    })
})
function currentSlide(n){
    index=n;
    updateCarousel();
    resetTime();
}
function startTime(){
    autoSlideInterval=setInterval(()=>{
        index=(index+1)%slides.length;
        updateCarousel();
    },10000)
}
function resetTime(){
    clearInterval(autoSlideInterval);
    startTime();
}
startTime();

