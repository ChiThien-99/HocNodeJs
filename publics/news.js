const socket = io();
let news = document.querySelectorAll(".news");
const listNews = document.getElementById("listNews");
socket.on("update-news", (data) => {
  renderNews(data.allNews);
  news = document.querySelectorAll(".news");
});
function renderNews(list_news) {
  listNews.innerHTML = list_news
    .map(
      (news) => {
        let plainText=news.info.replace(/<\/?[^>]+(>|$)/g,"");
        plainText=plainText.replace(/&nbsp;|&#160;/gi," ");
        plainText=plainText.replace(/\s+/g," ").trim();
        let shortText=plainText.length>200?plainText.substring(0,200)+"...":plainText;
       return `
  <div class="news">
    <a href="/blogs/detailBlog/${news._id}" target="_blank" class="linkImg"><img src="${news.image}" alt="news"></a>
  <div class="news-content">
    <a href="/blogs/detailBlog/${news._id}" target="_blank"><h4>${news.title}</h4></a>
    <p>${shortText}</p> 
  </div>
  </div>
  `
      }
    )
    .join("");
}
document.getElementById("btnNewBlog").addEventListener("click",function(){
    fetch("/blogs/newBlogs",{
        method:"GET",
        headers:{"Content-Type":"application/json;charset:UTF-8"},
    })
    .then(res=>res.json())
    .then(({success,error})=>{
        if (success) {
            document.querySelectorAll("#filterBlogs button").forEach((btn)=>{
                btn.classList.remove("active");
                this.classList.add("active");
            })
        }else{
            console.error(error);
        }
    })
})
document.getElementById("btnViewsBlog").addEventListener("click",function(){
    fetch("/blogs/viewsBlogs",{
        method:"GET",
        headers:{"Content-Type":"application/json;charset:UTF-8"},
    })
    .then(res=>res.json())
    .then(({success,error})=>{
        if (success) {
            document.querySelectorAll("#filterBlogs button").forEach((btn)=>{
                btn.classList.remove("active");
                this.classList.add("active");
            })
        }else{
            console.error(error);
        }
    })
})