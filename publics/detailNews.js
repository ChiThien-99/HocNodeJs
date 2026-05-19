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
        document.getElementById("listComment").innerHTML = data
          .map(
            (comment) =>
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
    `,
          )
          .join("");
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
  //   const contentComment = document.getElementById("contentComment");
  document.getElementById("contentComment").focus();
  document.getElementById("contentComment").value = `@${authorComment}: `;
  let parentInput = document.getElementById("parentCommentId");
  if (!parentInput) {
    parentInput = document.createElement("input");
    parentInput.type = "hidden";
    parentInput.id = "parentCommentId";
    contentComment.parentNode.appendChild(parentInput);
  }
  parentInput.value = idComment;
});
