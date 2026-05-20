document.addEventListener("DOMContentLoaded", () => {
  if (typeof EmojiPicker !== "undefined") {
    new EmojiPicker();
  } else {
    console.error("Lỗi: Thư viện EmojiPicker chưa được tải thành công");
  }
});
document.getElementById("formComment").addEventListener("submit", (e) => {
  e.preventDefault();
  const idComment = document.getElementById("idNews").value;
  const parentCommentId = document.getElementById("parentCommentId").value;
  const authorComment = document.getElementById("authorComment").value;
  const contentComment = document.getElementById("contentComment").value;
  fetch(`/news/addComment/${idComment}`, {
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
        const rootComments=data.filter(comment=>!comment.parentId);
        document.getElementById("listComment").innerHTML = rootComments
          .map(
            (comment) =>{
            const replies=data.filter(reply=>String(reply.parentId)===String(comment._id));
            const repliesHTML=replies.map((reply)=>
            `
            <div class="comment">
            <p>
              <strong>${reply.author}</strong>
              <span>${reply.content}</span>
            </p>
            <div class="comment-action">
              <div>
                <button type="button" class="btnLikeComment" data-idComment="${reply._id}"><i class="fa-solid fa-thumbs-up"></i> Thích (<span id="like-count-${reply._id}">${reply.likes.length}</span>)</button>
                <button type="button" class="btnReplyComment" data-idComment="${reply._id}" data-authorComment="${reply.author}"><i class="fa-solid fa-comment"></i> Trả lời</button>
              </div>
               <p>${new Date(reply.createAt).toLocaleString("vi-VN")}</p>
            </div>
            </div>
            `
            ).join("");
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
    `
            }).join("");
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
  fetch(`/news/commentLike/${idComment}`, {
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
document.getElementById("btnShare").addEventListener("click",()=>{
  const divShareSocial=document.querySelector("#divShare div");
  const width=divShareSocial.style.width==="6rem"?"0px":"6rem";
  divShareSocial.style.width=width;
})
document.getElementById("btnShareFB").addEventListener("click",()=>{
  const urlCurrent=encodeURIComponent(window.location.href);
  const fbShareUrl=`https://www.facebook.com/sharer/sharer.php?u=${urlCurrent}`;
  window.open(fbShareUrl,"facebook-share-dialog","width=600,height=400,resizable=yes,scrollbars=yes");
});
document.getElementById("btnShareZL").addEventListener("click",()=>{
  const urlCurrent=encodeURIComponent(window.location.href);
  const zlShareUrl=`https://zalo.me/share?url=${urlCurrent}`;
  window.open(zlShareUrl,"zalo-share-dialog","width=600,height=500,resizable=yes,scrollbars=yes");
})
