document.addEventListener("DOMContentLoaded",()=>{
    if (typeof EmojiPicker!=="undefined") {
    new EmojiPicker();
    }else{
        console.error("Lỗi: Thư viện EmojiPicker chưa được tải thành công")
    }
    });
document.getElementById("formComment").addEventListener("submit",(e)=>{
    e.preventDefault();
    const idComment=document.getElementById("idNews").value;
    const authorComment=document.getElementById("authorComment").value;
    const contentComment=document.getElementById("contentComment").value;
    fetch(`/news/addComment/${idComment}`,{
        method:"POST",
        headers:{"Content-Type":"application/json;charset=UTF-8"},
        body:JSON.stringify({authorComment,contentComment}),
    })
    .then(res=>res.json())
    .then(({data,success})=>{
        if (success) {
       document.getElementById("authorComment").value="";
       document.getElementById("contentComment").value="";
       const noComment=document.getElementById("noComment");
       if (noComment) {
        noComment.remove();
       }
       let lenComment=document.getElementById("lenComment");
       lenComment.innerHTML=`Bình luận ${data.length}`;
       lenComment=document.getElementById("lenComment")
       const listComment=document.getElementById("listComment");
       listComment.innerHTML=data.map((comment)=>
        `
       <div class="comment">
        <p>
            <strong>${comment.author}</strong>
            <span>${comment.content}</span>
        </p>
        <div class="comment-action">
              <div>
                <button type="button" class="btnLikeComment" data-idComment="${comment._id}"><i class="fa-solid fa-thumbs-up"></i> Thích (<span id="like-count-${comment._id}">${comment.likes.length}</span>)</button>
                <button type="button" class="btnReplyComment" data-idComment="${comment._id}"><i class="fa-solid fa-comment"></i> Trả lời</button>
              </div>
               <p>${new Date(comment.createAt).toLocaleString("vi-VN")}</p>
        </div>
        </div>
    `
       ).join("");
       let comment=document.querySelectorAll(".comment");
       comment=document.querySelectorAll(".comment")
        }
        else{
        console.error(`Lỗi: ${data}`);
        }
      
    })
    .catch((error)=>{
        console.error(`Lỗi kết nối: ${error}`);
    });
})
document.querySelectorAll(".btnLikeComment").forEach((btn)=>{
    btn.addEventListener("click",()=>{
        const idComment=btn.getAttribute("data-idComment");
        fetch(`/news/commentLike/${idComment}`,{
            method:"GET",
            headers:{"Content-Type":"application/json;charset=UTF-8"},
        })
        .then(res=>res.json())
        .then(({success,data,likeCount})=>{
            if (success) {
                document.getElementById(`like-count-${idComment}`).innerHTML=likeCount;
            } else {
                console.error(data)
            }
        })
        .catch((error)=>{
            console.error(`Lỗi hệ thống ${error}`);
        });
    })
})