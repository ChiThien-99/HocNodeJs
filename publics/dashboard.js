import { alert, confirm } from "./alert.js";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
import { authFetch, setAccessToken } from "./authFetch.js";
const socket = io();
socket.on("update-funcdevice", (data) => {
  const existRow = document.querySelector(`tr[data-rowId="${data._id}"]`);
  if (existRow) {
    existRow.querySelector(".cellNameDevice").innerText = data.name;
  } else {
    document.querySelector("#tableFuncDevice tbody").insertAdjacentHTML(
      "afterbegin",
      `
      <tr data-rowId="${data._id}">
        <td class="cellNameDevice">${data.name}</td>
        <td>
          <div class="btnGroup">
            <button class="btnUpdateFuncDevice" data-idfuncdevice="${data._id}">Cập nhật</button>
            <button class="btnDeleteFuncDevice" data-idfuncdevice="${data._id}">Xóa</button>
          </div>
        </td>
      </tr>
      `,
    );
  }
});
socket.on("delete-funcdevice", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(`tr[data-rowId="${data._id}"]`);
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-device", (data) => {
  const existRow = document.querySelector(`tr[data-rowId="${data._id}"]`);
  if (existRow) {
    existRow.cells[0].innerText = data.name;
    existRow.cells[1].innerText = `${data.price.toLocaleString("vi-VN")}đ`;
    existRow.cells[2].innerText = data.func;
    existRow.cells[3].innerText = new Date(data.createAt).toLocaleString(
      "vi-VN",
    );
  } else {
    document.querySelector("#tableDevice tbody").insertAdjacentHTML(
      "afterbegin",
      `
      <tr data-rowId="${data._id}">
        <td>${data.name}</td>
        <td>${data.price.toLocaleString("vi-VN")} đ</td>
        <td>${data.func}</td>
        <td>${new Date(data.createAt).toLocaleString("vi-VN")}</td>
        <td>
          <div class="btnGroup">
            <button class="btnUpdateDevice" data-iddevice="${data._id}">Cập nhật</button>
            <button class="btnDeleteDevice" data-iddevice="${data._id}">Xóa</button>
          </div>
        </td>
      </tr>
      `,
    );
  }
});
socket.on("delete-device", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(`tr[data-rowId="${data._id}"]`);
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-funcapp", (data) => {
  const existFuncApp = document.querySelector(
    `tr[data-idFuncApp="${data._id}"]`,
  );
  if (existFuncApp) {
    existFuncApp.cells[0].innerText = data.name;
  } else {
    document.querySelector("#tableFuncApp tbody").insertAdjacentHTML(
      "afterbegin",
      `
    <tr data-idFuncApp="${data._id}">
      <td>${data.name}</td>
      <td>
        <div class="btnGroup">
          <button class="btnUpdateFuncApp" data-idfuncapp="${data._id}">Cập nhật</button>
          <button class="btnDeleteFuncApp" data-idfuncapp="${data._id}">Xóa</button>
        </div>
      </td>
    </tr>
    `,
    );
  }
});
socket.on("delete-funcapp", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(
      `tr[data-idFuncApp="${data._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-app",(data)=>{
  const existRow=document.querySelector(`tr[data-idapp="${data._id}"]`);
  if (existRow) {
    existRow.cells[0].innerText=data.name;
    existRow.cells[1].innerText=data.func;
    existRow.cells[2].innerText=new Date(data.createAt).toLocaleString("vi-VN");
  } else {
    document.querySelector("#tableApp tbody").insertAdjacentHTML("afterbegin",`
    <tr data-idapp="${data._id}">
      <td>${data.name}</td>
      <td>${data.func}</td>
      <td>${new Date(data.createAt).toLocaleString("vi-VN")}</td>
      <td>
        <div class="btnGroup">
          <button class="btnUpdateApp" data-idapp="${data._id}">Cập nhật</button>
          <button class="btnDeleteApp" data-idapp="${data._id}">Xóa</button>
        </div>
      </td>
    </tr>
  `)
  }
});
socket.on("delete-app", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(`tr[data-idapp="${data._id}"]`);
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-categoryblogs",(data)=>{
  document.querySelector("#tableCategoryblogs tbody").insertAdjacentHTML("afterbegin",`
    <tr data-idCategoryblogs="${data._id}">
      <td>${data.name}</td>
      <td>
        <div class="btnGroup">
          <button class="btnUpdateCategoryblogs" data-idnCategoryblogs="${data._id}">Cập nhật</button>
          <button class="btnDeleteCategoryblogs" data-idCategoryblogs="${data._id}">Xóa</button>
        </div>
      </td>
    </tr>
  `)
})
async function verifySession() {
  try {
    const response = await authFetch("/api/auth/me");
    if (!response.ok) {
      throw new Error("Session Expired");
    }
    console.log("Phiên làm việc hợp lệ");
  } catch (error) {
    console.error("Không thể refresh token, quay về login");
    window.location.href = "/loginAdmin";
  }
}
verifySession();
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
  const idAdminHidden = document.getElementById("idAdminHidden").value;
  const fullnameAdmin = document.getElementById("fullnameAdmin").value;
  const roleAdmin = document.getElementById("roleAdmin").value;
  const emailAdmin = document.getElementById("emailAdmin").value;
  const pwAdmin = document.getElementById("pwAdmin").value;
  const listDecentAdmin = document.querySelectorAll(
    "input[name='decentAdmin']:checked",
  );
  const valueDecentAdmin = Array.from(listDecentAdmin).map(
    (item) => item.value,
  );
  if (idAdminHidden) {
    fetch(`/dashboard/updateAdmin/${idAdminHidden}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        fullnameAdmin,
        roleAdmin,
        emailAdmin,
        pwAdmin,
        valueDecentAdmin,
      }),
    })
      .then((res) => res.json())
      .then(({ mess, accessToken, id, success, error }) => {
        if (success) {
          console.log(id);
          if (id === "69f98d958b238a769b7080a2") {
            setAccessToken(accessToken);
          }
          document.getElementById("idAdminHidden").value = "";
          document.getElementById("fullnameAdmin").value = "";
          document.getElementById("roleAdmin").value = "";
          document.getElementById("emailAdmin").value = "";
          document.getElementById("pwAdmin").value = "";
          document.getElementById("btnRegister").value = "Tạo";
          const allCheckbox = document.querySelectorAll(
            "input[name='decentAdmin']",
          );
          allCheckbox.forEach((item) => (item.checked = false));
          alert("Thông báo", mess, "#80a710");
          window.location.reload();
        } else {
          document.getElementById("idAdminHidden").value = "";
          document.getElementById("fullnameAdmin").value = "";
          document.getElementById("roleAdmin").value = "";
          document.getElementById("emailAdmin").value = "";
          document.getElementById("pwAdmin").value = "";
          document.getElementById("btnRegister").value = "Tạo";
          const allCheckbox = document.querySelectorAll(
            "input[name='decentAdmin']",
          );
          allCheckbox.forEach((item) => (item.checked = false));
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      });
  } else {
    fetch("/dashboard/registerAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        fullnameAdmin,
        roleAdmin,
        emailAdmin,
        pwAdmin,
        valueDecentAdmin,
      }),
    })
      .then((res) => res.json())
      .then(({ mess, success, err }) => {
        if (success) {
          alert("Thông báo", mess, "#80a710");
          document.getElementById("fullnameAdmin").value = "";
          document.getElementById("roleAdmin").value = "";
          document.getElementById("emailAdmin").value = "";
          document.getElementById("pwAdmin").value = "";
          const allCheckbox = document.querySelectorAll(
            "input[name='decentAdmin']",
          );
          allCheckbox.forEach((item) => (item.checked = false));
          window.location.reload();
        } else {
          alert("Lỗi", `${mess}\n${err ? err : ""}`, "red");
          document.getElementById("fullnameAdmin").value = "";
          document.getElementById("roleAdmin").value = "";
          document.getElementById("emailAdmin").value = "";
          document.getElementById("pwAdmin").value = "";
          const allCheckbox = document.querySelectorAll(
            "input[name='decentAdmin']",
          );
          allCheckbox.forEach((item) => (item.checked = false));
        }
      });
  }
});
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}
function getUserFromCookie() {
  const token = getCookie("accessToken");
  if (token) {
    try {
      const decodedUser = jwtDecode(token);
      document.getElementById("idAd").innerText = `ID:${decodedUser.id}`;
      document.getElementById("fullnameAd").innerText = decodedUser.fullname;
      document.getElementById("roleAd").innerText =
        `Chức vụ: ${decodedUser.role}`;
      const decent = decodedUser.decent;
      console.log(decent);
      function applyPermission() {
        const buttons = document.querySelectorAll(".navBtnDB");
        buttons.forEach((btn) => {
          const target = btn.getAttribute("data-target");
          if (!decent.includes(target)) {
            btn.remove();
          }
        });
      }
      applyPermission();
      return decodedUser;
    } catch (error) {
      console.error(`Token không hợp lệ hoặc đã bị can thiệp ${error}`);
      return null;
    }
  } else {
    console.error("Không thấy token trong cookie");
    return null;
  }
}
window.onload = getUserFromCookie;
const idAdminHidden = document.getElementById("idAdminHidden");
const fullnameAdmin = document.getElementById("fullnameAdmin");
const roleAdmin = document.getElementById("roleAdmin");
const emailAdmin = document.getElementById("emailAdmin");
const btnRegister = document.getElementById("btnRegister");
document.querySelectorAll(".btnEditUserAdmin").forEach((btn) => {
  btn.addEventListener("click", () => {
    const idAdmin = btn.getAttribute("data-idAdmin");
    fetch(`/dashboard/getUserAdmin/${idAdmin}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ data, success, error }) => {
        if (success) {
          idAdminHidden.value = data._id;
          fullnameAdmin.value = data.fullname;
          roleAdmin.value = data.role;
          emailAdmin.value = data.email;
          btnRegister.innerText = "Cập nhật";
          const decent = data.decent;
          const listDecentAdmin = document.querySelectorAll(
            "input[name='decentAdmin']",
          );
          listDecentAdmin.forEach((item) => {
            item.checked = false;
            const valueItem = item.value;
            if (decent.includes(valueItem)) {
              item.checked = true;
            }
          });
        } else {
          console.error(error);
        }
      });
  });
});
document.querySelectorAll(".btnDeleteUserAdmin").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa user admin này?",
      "#1877f2",
    );
    console.log(confirmDelete);
    if (confirmDelete) {
      const idAdmin = btn.getAttribute("data-idAdmin");
      fetch(`/dashboard/deleteUserAdmin/${idAdmin}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charser=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        });
    }
  });
});
const pwAdminNew = document.getElementById("pwAdminNew");
const btnTogglePW = document.getElementById("btnTogglePW");
btnTogglePW.addEventListener("click", function (e) {
  e.preventDefault();
  const type =
    pwAdminNew.getAttribute("type") === "password" ? "text" : "password";
  pwAdminNew.setAttribute("type", type);
  this.innerHTML =
    pwAdminNew.getAttribute("type") === "password"
      ? "<i class='fa-solid fa-eye'></i>"
      : "<i class='fa-solid fa-eye-slash'></i>";
});
const btnUpdatePW = document.getElementById("btnUpdatePW");
btnUpdatePW.addEventListener("click", (e) => {
  e.preventDefault();
  let idAd = document.getElementById("idAd").innerHTML;
  idAd = idAd.slice(3);
  console.log(idAd);
  const valuePwAdminNew = pwAdminNew.value;
  fetch(`/dashboard/updatePWAdmin/${idAd}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ valuePwAdminNew }),
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        alert("Thông báo", mess, "#80a710");
      } else {
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    });
});
const form = document.getElementById("formAddBanner");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const id = document.getElementById("idbanner").value;
  if (id) {
    try {
      console.log(formData);
      fetch(`/dashboard/updateBanner/${id}`, {
        method: "PUT",
        body: formData,
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            document.getElementById("idbanner").value = "";
            document.getElementById("imageBanner").value = "";
            document.getElementById("captionBanner").value = "";
            document.getElementById("urlBanner").value = "";
            document.getElementById("orderBanner").value = "";
            document.getElementById("btnAddBanner").value = "Tạo";
            alert("Thông báo", mess, "#80a710");
          } else {
            document.getElementById("idbanner").value = "";
            document.getElementById("imageBanner").value = "";
            document.getElementById("captionBanner").value = "";
            document.getElementById("urlBanner").value = "";
            document.getElementById("orderBanner").value = "";
            document.getElementById("btnAddBanner").value = "Tạo";
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        });
    } catch (error) {
      alert("Lỗi kết nối", error, "red");
    }
  } else {
    try {
      fetch("/dashboard/banner/add", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            document.getElementById("imageBanner").value = "";
            document.getElementById("captionBanner").value = "";
            document.getElementById("urlBanner").value = "";
            document.getElementById("orderBanner").value = "";
            alert("Thông báo", mess, "#80a710");
          } else {
            document.getElementById("imageBanner").value = "";
            document.getElementById("captionBanner").value = "";
            document.getElementById("urlBanner").value = "";
            document.getElementById("orderBanner").value = "";
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        });
    } catch (error) {
      alert("Lỗi kết nối", error, "red");
    }
  }
});
document.querySelectorAll(".btnUpdateBanner").forEach((btn) => {
  btn.addEventListener("click", () => {
    const idbanner = btn.getAttribute("data-idbanner");
    fetch(`/dashboard/updateBanner/${idbanner}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ banner }) => {
        document.getElementById("idbanner").value = banner._id;
        document.getElementById("captionBanner").value = banner.caption;
        document.getElementById("urlBanner").value = banner.url;
        document.getElementById("orderBanner").value = banner.order;
        document.getElementById("btnAddBanner").value = "Cập nhật";
      });
  });
});
document.querySelectorAll(".btnDeleteBanner").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn chắc chắn muốn xóa banner này",
      "#1877f2",
    );
    if (confirmDelete) {
      const id = btn.getAttribute("data-idbanner");
      fetch(`/dashboard/deleteBanner/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        })
        .catch((error) => {
          alert("Lỗi kết nối", error, "red");
        });
    }
  });
});
const formAddNotify = document.getElementById("formAddNotify");
formAddNotify.addEventListener("submit", (e) => {
  e.preventDefault();
  const idNotify = document.getElementById("idNotify").value;
  const typeNotify = document.getElementById("typeNotify").value;
  const contentNotify = document.getElementById("contentNotify").value;
  const urlNotify = document.getElementById("urlNotify").value;
  const expiredNotify = document.getElementById("expiredNotify").value;
  if (idNotify) {
    fetch(`/dashboard/updateNotify/${idNotify}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        typeNotify,
        contentNotify,
        urlNotify,
        expiredNotify,
      }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("idNotify").value = "";
          document.getElementById("typeNotify").value = "all";
          document.getElementById("contentNotify").value = "";
          document.getElementById("urlNotify").value = "";
          document.getElementById("expiredNotify").value = "";
          document.getElementById("btnNotify").value = "Tạo";
          alert("Thông báo", mess, "#80a710");
        } else {
          document.getElementById("idNotify").value = "";
          document.getElementById("typeNotify").value = "all";
          document.getElementById("contentNotify").value = "";
          document.getElementById("urlNotify").value = "";
          document.getElementById("expiredNotify").value = "";
          document.getElementById("btnNotify").value = "Tạo";
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  } else {
    fetch("/dashboard/addNotify", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        typeNotify,
        contentNotify,
        urlNotify,
        expiredNotify,
      }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("typeNotify").value = "all";
          document.getElementById("contentNotify").value = "";
          document.getElementById("urlNotify").value = "";
          document.getElementById("expiredNotify").value = "";
          alert("Thông báo", mess, "#80a710");
        } else {
          document.getElementById("typeNotify").value = "all";
          document.getElementById("contentNotify").value = "";
          document.getElementById("urlNotify").value = "";
          document.getElementById("expiredNotify").value = "";
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  }
});
document.querySelectorAll(".btnUpdateNotify").forEach((btn) => {
  btn.addEventListener("click", () => {
    const idnotify = btn.getAttribute("data-idnotify");
    fetch(`/dashboard/updateNotify/${idnotify}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        if (data) {
          document.getElementById("idNotify").value = data._id;
          document.getElementById("typeNotify").value = data.type;
          document.getElementById("contentNotify").value = data.content;
          document.getElementById("urlNotify").value = data.url;
          document.getElementById("btnNotify").value = "Cập nhật";
          if (data.expireAt) {
            const date = new Date(data.expireAt);
            const localDate = new Date(
              date.getTime() - date.getTimezoneOffset() * 60000,
            );
            const formattedDate = localDate.toISOString().slice(0, 16);
            document.getElementById("expiredNotify").value = formattedDate;
          }

          document.getElementById("btnNotify").value = "Cập nhật";
        } else {
          console.error("Không nhận được data");
        }
      });
  });
});
document.querySelectorAll(".btnDeleteNotify").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa thông báo này",
      "#1877f2",
    );
    if (confirmDelete) {
      const id = btn.getAttribute("data-idnotify");
      fetch(`/dashboard/deleteNotify/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        })
        .catch((error) => {
          alert("Lỗi kết nối", error, "red");
        });
    }
  });
});
document.getElementById("formFuncApp").addEventListener("submit", (e) => {
  e.preventDefault();
  const listFuncApp = document.getElementById("listFuncApp").value;
  const idFuncApp = document.getElementById("idFuncApp").value;
  if (idFuncApp) {
    fetch(`/dashboard/updateFuncApp/${idFuncApp}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ listFuncApp }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("idFuncApp").value = "";
          document.getElementById("listFuncApp").value = "";
          document.getElementById("btnFuncApp").value = "Tạo";
          document.getElementById("btnCancelUDFuncApp").style.display = "none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch(() => {
        alert("Lỗi kết nối", `${mess}\n${error}`, "red");
      });
  } else {
    fetch("/dashboard/listFuncApp", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ listFuncApp }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("listFuncApp").value = "";
          alert("Thông báo", mess, "#80a710");
        } else {
          document.getElementById("listFuncApp").value = "";
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  }
});
document
  .querySelector("#tableFuncApp tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btnUpdateFuncApp")) {
      const id = target.getAttribute("data-idfuncapp");
      fetch(`/dashboard/updateFuncApp/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          if (data) {
            document.getElementById("idFuncApp").value = data._id;
            document.getElementById("listFuncApp").value = data.name;
            document.getElementById("btnFuncApp").value = "Cập nhật";
            document.getElementById("btnCancelUDFuncApp").style.display =
              "inline-block";
          } else {
            console.error("Không nhận được data");
          }
        })
        .catch((error) => {
          console.error("Lỗi kết nối");
        });
    }
    if (target.classList.contains("btnDeleteFuncApp")) {
      const confirmDelete = await confirm(
        "Thông báo",
        "Bạn có chắc nhắn muốn xóa chức năng này",
        "#1877f2",
      );
      if (confirmDelete) {
        const id = target.getAttribute("data-idfuncapp");
        fetch(`/dashboard/deleteFuncApp/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json;charset=UTF-8" },
        })
          .then((res) => res.json())
          .then(({ mess, success, error }) => {
            if (success) {
              alert("Thông báo", mess, "#80a710");
            } else {
              alert("Lỗi", `${mess}\n${error}`, "red");
            }
          })
          .catch((error) => {
            alert("Lỗi kết nối", error, "red");
          });
      }
    }
  });
document
  .getElementById("btnCancelUDFuncApp")
  .addEventListener("click", function () {
    document.getElementById("formFuncApp").reset();
    document.getElementById("idFuncApp").value = "";
    document.getElementById("btnFuncApp").value = "Tạo";
    this.style.display = "none";
  });
if (typeof Quill === "undefined") {
  console.error(
    "Quill.js chưa được tải thành công từ CDN! Vui lòng kiểm tra lại thẻ <script>.",
  );
  // return;
}
window.Quill = Quill;
const VideoBlot = Quill.import("formats/video");
class CustomVideoBlot extends VideoBlot {
  static create(value) {
    const cleanUrl = CustomVideoBlot.sanitizeYoutubeUrl(value);
    let node = super.create(value);
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", "true");
    node.setAttribute("class", "quill-video-embed");
    node.setAttribute("style", "width:100%;height:350px;margin:1rem 0;");
    return node;
  }
  static sanitizeYoutubeUrl(url) {
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v");
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split(/[?#]/)[0];
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("youtube.com/shorts/")[1].split(/[?#]/)[0];
    } else {
      return url;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
Quill.register(CustomVideoBlot, true);
Quill.register("modules/imageResize", QuillResizeModule);
const Size = Quill.import("attributors/style/size");
Size.whitelist = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
Quill.register(Size, true);
const Align = Quill.import("attributors/style/align");
Quill.register(Align, true);
Quill.register(
  {
    "modules/table-better": QuillTableBetter,
  },
  true,
);
const quillEditor = document.querySelectorAll(".quill-editor");
const quillInstances = [];
quillEditor.forEach((element, index) => {
  const quill = new Quill(element, {
    theme: "snow",
    modules: {
      table: false,
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ size: ["12px", "14px", "16px", "18px", "20px", "24px", "32px"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }, { align: [] }],
        ["link", "image", "video", "table-better", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        ["clean"],
      ],
      imageResize: {
        displaySize: true,
      },
      "table-better": {
        language: "en_US",
        menus: [
          "column",
          "row",
          "merge",
          "table",
          "cell",
          "wrap",
          "copy",
          "delete",
        ],
        toolbarTable: true,
      },
      keyboard: {
        bindings: QuillTableBetter.keyboardBindings,
      },
    },
  });
  quill.getModule("toolbar").addHandler("image", () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png,image/jpeg,image/webp");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) {
        return;
      }
      const formData = new FormData();
      formData.append("imgblogs", file);
      fetch("/dashboard/uploadImage", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then(({ data }) => {
          if (data) {
            const range = quill.getSelection();
            const insertIndex = range ? range.index : quill.getLength();
            quill.insertEmbed(insertIndex, "image", data);
            quill.setSelection(insertIndex + 1);
          }
        })
        .catch((error) => {
          console.error(`Lỗi upload ảnh quill ${error}`);
        });
    };
  });
  quillInstances.push(quill);
});
console.log(quillInstances);
const formApp = document.getElementById("formApp");
formApp.addEventListener("input",()=>{
  checkFormEmptiness(formApp,"idApp","btnCancelAddApp");
});
formApp.addEventListener("submit", (e) => {
  e.preventDefault();
  const quillEditor = document.getElementsByClassName("quill-editor");
  const infoApp = document.getElementById("infoApp");
  infoApp.value = quillEditor;
  infoApp.value = quillInstances[0].getSemanticHTML();
  const formData = new FormData(formApp);
  const idApp = document.getElementById("idApp").value;
  if (idApp) {
    fetch(`/dashboard/updateApp/${idApp}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("idApp").value = "";
          formApp.reset();
          if (typeof quillInstances !== "undefined") {
            quillInstances[0].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnApp").value = "Tạo";
          document.getElementById("btnDeleteImgApp").style.display="none";
          document.getElementById("btnCancelUpdateApp").style.display="none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  } else {
    fetch("/dashboard/addApp", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          formApp.reset();
          if (typeof quillInstances !== "undefined") {
            quillInstances[0].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnCancelAddApp").style.display="none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  }
});
document.querySelector("#tableApp tbody").addEventListener("click",async(e) => {
  const target=e.target;
  if (target.classList.contains("btnUpdateApp")) {
    const id = target.getAttribute("data-idapp");
    fetch(`/dashboard/updateApp/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        try {
          document.getElementById("idApp").value = data._id;
          document.getElementById("nameApp").value = data.name;
          if (typeof quillInstances !== "undefined") {
            quillInstances[0].clipboard.dangerouslyPasteHTML(data.info || "");
          } else {
            console.error("Biến quill chưa được khởi tạo");
          }
          document.getElementById("btnApp").value = "Cập nhật";
          document.getElementById("btnDeleteImgApp").style.display="inline-block";
          document.getElementById("btnCancelUpdateApp").style.display="inline-block";
          const dataFuncApp = data.func;
          const funcApp = document.getElementById("funcApp");
          Array.from(funcApp.options).forEach((option) => {
            option.selected = dataFuncApp.includes(option.value);
          });
        } catch (error) {
          console.error("Lỗi không nhận được data");
        }
      })
      .catch((error) => {
        console.error("Lỗi kết nối");
      });
  }
  if (target.classList.contains("btnDeleteApp")) {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn xóa phần mềm này",
      "#1877f2",
    );
    if (confirmDelete) {
      const id = target.getAttribute("data-idapp");
      fetch(`/dashboard/deleteApp/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        })
        .catch((error) => {
          alert("Lỗi kết nối", error, "red");
        });
    }
  }
});
document.getElementById("btnDeleteImgApp").addEventListener("click",()=>{
  const id=document.getElementById("idApp").value;
  fetch(`/dashboard/deleteImgApp/${id}`,{
    method:"DELETE",
    headers:{"Content-Type":"application/json;charset=UTF-8"},
  })
  .then(res=>res.json())
  .then(({mess,success,error})=>{
    if (success) {
      alert("Thông báo",mess,"#80a710");
    } else {
      alert("Lỗi",`${mess}\n${error}`,"red");
    }
  })
  .catch((error)=>{
    alert("Lỗi",error,"red");
  });
})
document.getElementById("btnCancelUpdateApp").addEventListener("click",function(){
  formApp.reset();
  if (typeof quillInstances !== "undefined") {
    quillInstances[0].setText("");
  } else {
    console.error("Biến quill không tồn tại");
  }
  document.getElementById("idApp").value="";
  document.getElementById("btnApp").value="Tạo";
  document.getElementById("btnDeleteImgApp").style.display="none";
  this.style.display="none";
})
document.getElementById("btnCancelAddApp").addEventListener("click",function(){
  formApp.reset();
  if (typeof quillInstances !== "undefined") {
    quillInstances[0].setText("");
  } else {
    console.error("Biến quill không tồn tại");
  }
  this.style.display="none";
})
document.getElementById("formFuncDevice").addEventListener("submit", (e) => {
  e.preventDefault();
  const listFuncDevice = document.getElementById("listFuncDevice").value;
  const id = document.getElementById("idFuncDevice").value;
  if (id) {
    fetch(`/dashboard/updateFuncDevice/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ listFuncDevice }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("idFuncDevice").value = "";
          document.getElementById("listFuncDevice").value = "";
          document.getElementById("btnFuncDevice").value = "Tạo";
          document.getElementById("btnCancleUpdateFuncDevice").style.display =
            "none";
          alert("Thông báo", mess, "#80a710");
        } else {
          document.getElementById("idFuncDevice").value = "";
          document.getElementById("listFuncDevice").value = "";
          document.getElementById("btnFuncDevice").value = "Tạo";
          document.getElementById("btnCancleUpdateFuncDevice").style.display =
            "none";
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  } else {
    fetch("/dashboard/listFuncDevice", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ listFuncDevice }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("listFuncDevice").value = "";
          alert("Thông báo", mess, "#80a710");
        } else {
          document.getElementById("listFuncDevice").value = "";
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert(`Lỗi kết nối: ${error}`);
      });
  }
});
document
  .getElementById("btnCancleUpdateFuncDevice")
  .addEventListener("click", () => {
    document.getElementById("formFuncDevice").reset();
    document.getElementById("idFuncDevice").value = "";
    document.getElementById("btnFuncDevice").value = "Tạo";
    document.getElementById("btnCancleUpdateFuncDevice").style.display = "none";
  });
document
  .querySelector("#tableFuncDevice tbody")
  .addEventListener("click", (e) => {
    const btn = e.target.closest(".btnUpdateFuncDevice");
    if (!btn) {
      return;
    }
    const id = btn.getAttribute("data-idfuncdevice");
    fetch(`/dashboard/updateFuncDevice/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        if (data) {
          document.getElementById("idFuncDevice").value = data._id;
          document.getElementById("listFuncDevice").value = data.name;
          document.getElementById("btnFuncDevice").value = "Cập nhật";
          document.getElementById("btnCancleUpdateFuncDevice").style.display =
            "inline-block";
        }
      })
      .catch((error) => {
        console.error(`Lỗi kết nối:${error}`);
      });
  });
document
  .querySelector("#tableFuncDevice tbody")
  .addEventListener("click", async (e) => {
    const btn = e.target.closest(".btnDeleteFuncDevice");
    if (!btn) {
      return;
    }
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa chức năng này không",
      "#1877f2",
    );
    if (confirmDelete) {
      const id = btn.getAttribute("data-idfuncdevice");
      fetch(`/dashboard/deleteFuncDevice/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        })
        .catch((error) => {
          alert(`Lỗi kết nối ${error}`);
        });
    }
  });
const formDevice = document.getElementById("formDevice");
formDevice.addEventListener("input",()=>{
  checkFormEmptiness(formDevice,"idDevice","btnCancelAddDevice");
})
formDevice.addEventListener("submit", (e) => {
  e.preventDefault();
  const dataform = new FormData(formDevice);
  const quillHTML = quillInstances[1].getSemanticHTML();
  dataform.set("infoDevice", quillHTML);
  const id = document.getElementById("idDevice").value;
  if (id) {
    fetch(`/dashboard/updateDevice/${id}`, {
      method: "PUT",
      body: dataform,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          formDevice.reset();
          if (typeof quillInstances !== "undefined") {
            quillInstances[1].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnDevice").value = "Tạo";
          document.getElementById("btnCancleUpdateDevice").style.display =
            "none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  } else {
    fetch(`/dashboard/addDevice`, {
      method: "POST",
      body: dataform,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          formDevice.reset();
          if (typeof quillInstances !== "undefined") {
            quillInstances[1].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnCancelAddDevice").style.display="none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert(`Lỗi kết nối ${error}`);
      });
  }
});
const priceDevice = document.getElementById("priceDevice");
const priceActual = document.getElementById("priceActual");
priceDevice.addEventListener("input", (e) => {
  let rawValue = e.target.value.replace(/\D/g, "");
  priceActual.value = rawValue;
  if (rawValue) {
    e.target.value = Number(rawValue).toLocaleString("vi-VN");
  } else {
    e.target.value = "";
  }
});
document
  .querySelector("#tableDevice tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btnUpdateDevice")) {
      const id = target.getAttribute("data-iddevice");
      fetch(`/dashboard/updateDevice/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          if (data) {
            document.getElementById("idDevice").value = data._id;
            document.getElementById("nameDevice").value = data.name;
            if (typeof quillInstances !== "undefined") {
              quillInstances[1].clipboard.dangerouslyPasteHTML(data.info || "");
            } else {
              console.error("Biến quill chưa được khởi tạo");
            }
            document.getElementById("color-container").innerHTML = "";
            for (let i = 0; i < data.color.length; i++) {
              const colorContainer = document.getElementById("color-container");
              const newRow = document.createElement("div");
              newRow.className = "color-row";
              newRow.innerHTML = `
             <input type="text" name="colorNames" class="colorNames" placeholder="VD:Đen">
             <input type="number" name="colorIndex" class="colorIndex" placeholder="Nhập index">
             <input type="file" class="imgDevice" name="colorImg" accept="image/webp">
             <button type="button" class="btnRemoveColor">Xóa</button>
            `;
              colorContainer.appendChild(newRow);
              newRow
                .querySelector(".btnRemoveColor")
                .addEventListener("click", () => {
                  newRow.remove();
                });
              document.querySelectorAll(".colorNames")[i].value =
                data.color[i].name;
              document.querySelectorAll(".colorIndex")[i].value =
                data.color[i].index;
            }
            document.getElementById("priceDevice").value =
              data.price.toLocaleString("vi-VN");
            document.getElementById("priceActual").value = data.price;
            document.getElementById("instrucDevice").value =
              data.instruction || "";
            document.getElementById("btnDevice").value = "Cập nhật";
            document.getElementById("deleteImageDevice").style.display =
              "inline-block";
            document.getElementById("deleteImageColor").style.display =
              "inline-block";
            document.getElementById("btnCancleUpdateDevice").style.display =
              "inline-block";
            const dataFuncDevice = data.func;
            const funcDevice = document.getElementById("funcDevice");
            Array.from(funcDevice.options).forEach((option) => {
              option.selected = dataFuncDevice.includes(option.value);
            });
          } else {
            console.error("Không lấy được data");
          }
        })
        .catch((error) => {
          console.error(`Lỗi kết nối: ${error}`);
        });
    }

    if (target.classList.contains("btnDeleteDevice")) {
      const confirmDelete = await confirm(
        "Thông báo",
        "Bạn có chắc chắn muốn xóa thiết bị này",
        "#1877f2",
      );
      if (confirmDelete) {
        const id = target.getAttribute("data-iddevice");
        fetch(`/dashboard/deleteDevice/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json;charset=UTF-8" },
        })
          .then((res) => res.json())
          .then(({ mess, success, error }) => {
            if (success) {
              alert("Thông báo", mess, "#80a710");
            } else {
              alert("Lỗi", `${mess}\n${error}`, "red");
            }
          })
          .catch((error) => {
            alert("Lỗi kết nối", error, "red");
          });
      }
    }
  });
document.getElementById("deleteImageDevice").addEventListener("click", () => {
  const idDevice = document.getElementById("idDevice").value;
  console.log(idDevice);
  fetch(`/dashboard/deleteImgDevice/${idDevice}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success }) => {
      if (success) {
        alert("Thông báo", mess, "#80a710");
      } else {
        alert("Lỗi", mess, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi", error, "red");
    });
});
document.getElementById("deleteImageColor").addEventListener("click", () => {
  const idDevice = document.getElementById("idDevice").value;
  console.log(idDevice);
  fetch(`/dashboard/deleteImgColorDevice/${idDevice}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ mess, success }) => {
      if (success) {
        alert("Thông báo", mess, "#80a710");
      } else {
        alert("Lỗi", mess, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi", error, "red");
    });
});
document
  .getElementById("btnCancleUpdateDevice")
  .addEventListener("click", function () {
    document.getElementById("btnDevice").value = "Tạo";
    formDevice.reset();
    document.getElementById("idDevice").value = "";
    if (typeof quillInstances !== "undefined") {
      quillInstances[1].setText("");
    } else {
      console.error("Biến quill không tồn tại");
    }
    this.style.display = "none";
    document.getElementById("deleteImageDevice").style.display = "none";
    document.getElementById("deleteImageColor").style.display = "none";
  });
document.getElementById("btnCancelAddDevice").addEventListener("click",function(){
  formDevice.reset();
    if (typeof quillInstances !== "undefined") {
      quillInstances[1].setText("");
    } else {
      console.error("Biến quill không tồn tại");
    }
  this.style.display="none";
})
const formblogs = document.getElementById("formblogs");
formblogs.addEventListener("submit", (e) => {
  e.preventDefault();
  const quillEditor = document.getElementsByClassName("quill-editor");
  const infoblogs = document.getElementById("infoblogs");
  infoblogs.value = quillEditor;
  infoblogs.value = quillInstances[2].getSemanticHTML();
  const formData = new FormData(formblogs);
  const id = document.getElementById("idblogs").value;
  if (id) {
    fetch(`/dashboard/updateblogs/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("idblogs").value = "";
          document.getElementById("titleblogs").value = "";
          document.getElementById("infoblogs").value = "";
          if (typeof quillInstances !== "undefined") {
            quillInstances[2].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("categoryblogs").value = "";
          document.getElementById("btnblogs").value = "Tạo";
          alert("Thông báo", mess, "#80a710");
        } else {
          document.getElementById("idblogs").value = "";
          document.getElementById("titleblogs").value = "";
          document.getElementById("infoblogs").value = "";
          if (typeof quillInstances !== "undefined") {
            quillInstances[2].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("categoryblogs").value = "";
          document.getElementById("btnblogs").value = "Tạo";
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  } else {
    fetch("/dashboard/addblogs", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("imgblogs").value = "";
          document.getElementById("titleblogs").value = "";
          document.getElementById("infoblogs").value = "";
          if (typeof quillInstances !== "undefined") {
            quillInstances[2].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("categoryblogs").value = "";
          alert("Thông báo", mess, "#80a710");
        } else {
          document.getElementById("imgblogs").value = "";
          document.getElementById("titleblogs").value = "";
          document.getElementById("infoblogs").value = "";
          if (typeof quillInstances !== "undefined") {
            quillInstances[2].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("categoryblogs").value = "";
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  }
});
document.getElementById("formCategoryblogs").addEventListener("submit", (e) => {
  e.preventDefault();
  const categoryblogs = document.getElementById("listCategoryblogs").value;
  const id = document.getElementById("idCategoryblogs").value;
  if (id) {
    fetch(`/dashboard/updateCategoryblogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ categoryblogs }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("idCategoryblogs").value = "";
          document.getElementById("listCategoryblogs").value = "";
          document.getElementById("btnCategoryblogs").value = "Tạo";
          alert("Thông báo", mess, "#80a710");
        } else {
          document.getElementById("idCategoryblogs").value = "";
          document.getElementById("listCategoryblogs").value = "";
          document.getElementById("btnCategoryblogs").value = "Tạo";
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  } else {
    fetch("/dashboard/addCategoryblogs", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ categoryblogs }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("listCategoryblogs").value = "";
          alert("Thông báo", mess, "#80a710");
        } else {
          document.getElementById("listCategoryblogs").value = "";
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  }
});
document.querySelector("#tableCategoryblogs tbody").addEventListener("click",async(e) => {
  const target=e.target;
  if (target.classList.contains("btnUpdateCategoryblogs")) {
    const id = target.getAttribute("data-idnCategoryblogs");
    fetch(`/dashboard/updateCategoryblogs/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        if (data) {
          document.getElementById("idCategoryblogs").value = data._id;
          document.getElementById("listCategoryblogs").value = data.name;
          document.getElementById("btnCategoryblogs").value = "Cập nhật";
        } else {
          console.error("Lỗi không lấy được data");
        }
      })
      .catch((error) => {
        console.error(`Lỗi kết nối: ${error}`);
      });
  }
  if (target.classList.contains("btnDeleteCategoryblogs")) {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa danh mục blogs này",
      "#1877f2",
    );
    if (confirmDelete) {
      const id = target.getAttribute("data-idCategoryblogs");
      fetch(`/dashboard/deleteCategoryblogs/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset:UTF-8" },
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        })
        .catch((error) => {
          alert("Lỗi kết nối", error, "red");
        });
    }
  }
});

document.querySelectorAll(".btnUpdateblogs").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-idblogs");
    fetch(`/dashboard/updateblogs/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        if (data) {
          document.getElementById("idblogs").value = data._id;
          document.getElementById("titleblogs").value = data.title;
          if (typeof quill !== "undefined") {
            quill.clipboard.dangerouslyPasteHTML(data.info || "");
          } else {
            console.error("Biến quill chưa được khởi tạo");
          }
          const dataCategoryblogs = data.category;
          const categoryblogs = document.getElementById("categoryblogs");
          Array.from(categoryblogs.options).forEach((option) => {
            option.selected = dataCategoryblogs.includes(option.value);
          });
          document.getElementById("btnblogs").value = "Cập nhật";
        } else {
          console.error("Lỗi không lấy được data");
        }
      })
      .catch((error) => {
        console.error(`Lỗi kết nối ${error}`);
      });
  });
});
document.querySelectorAll(".btnDeleteblogs").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa blogs này",
      "#1877f2",
    );
    if (confirmDelete) {
      const id = btn.getAttribute("data-idblogs");
      fetch(`/dashboard/deleteblogs/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        })
        .catch((error) => {
          alert("Lỗi kết nối", error, "red");
        });
    }
  });
});
document.getElementById("btnAddColor").addEventListener("click", () => {
  const colorContainer = document.getElementById("color-container");
  const newRow = document.createElement("div");
  newRow.className = "color-row";
  newRow.innerHTML = `
   <input type="text" name="colorNames" placeholder="VD:Đen" required>
   <input type="number" name="colorIndex" placeholder="Nhập index" required>
   <input type="file" class="imgDevice" name="colorImg" accept="image/webp" required>
   <button type="button" class="btnRemoveColor">Xóa</button>
  `;
  colorContainer.appendChild(newRow);
  newRow.querySelector(".btnRemoveColor").addEventListener("click", () => {
    newRow.remove();
  });
});
const formBanner = document.getElementById("formBanner");
formBanner.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("idBN").value;
  const formData = new FormData(formBanner);
  if (id) {
    fetch(`/dashboard/updateBN/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          formBanner.reset();
          document.getElementById("btnBanner").value = "Tạo";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  } else {
    fetch("/dashboard/addBanner", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mess, success }) => {
        if (success) {
          formBanner.reset();
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", mess, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  }
});
const btnUpdateBN = document.querySelectorAll(".btnUpdateBN");
btnUpdateBN.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-idBN");
    fetch(`/dashboard/updateBN/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        document.getElementById("idBN").value = data._id;
        document.getElementById("pageBanner").value = data.page;
        document.getElementById("btnDeleteBN").style.display = "inline-block";
        document.getElementById("btnCancleUpdateBN").style.display =
          "inline-block";
        document.getElementById("urlBN").value = data.url;
        document.getElementById("btnBanner").value = "Cập nhật";
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  });
});
document.getElementById("btnDeleteBN").addEventListener("click", async () => {
  const confirmDelete = await confirm(
    "Thông báo",
    "Bạn có chắc chắn muốn xóa hình",
    "#1877f2",
  );
  if (confirmDelete) {
    const id = document.getElementById("idBN").value;
    fetch(`/dashboard/deleteImgBanner/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  }
});
document
  .getElementById("btnCancleUpdateBN")
  .addEventListener("click", function () {
    formBanner.reset();
    document.getElementById("btnBanner").value = "Tạo";
    document.getElementById("btnDeleteBN").style.display = "none";
    this.style.display = "none";
  });
const btnDeleteBN = document.querySelectorAll(".btnDeleteBN");
btnDeleteBN.forEach((btn) => {
  btn.addEventListener("click", async () => {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa banner này",
      "#1877f2",
    );
    if (confirmDelete) {
      const id = btn.getAttribute("data-idBN");
      fetch(`/dashboard/deleteBN/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        })
        .catch((error) => {
          alert("Lỗi", error, "red");
        });
    }
  });
});
function checkFormEmptiness(form,idHidden,btn){
  const id=document.getElementById(idHidden).value;
  if (id) {
    document.getElementById(btn).style.display="none";
    return;
  }
  const formData=new FormData(form);
  let hasData=false;
  for (let value of formData.values()) {
    if (value.trim!="") {
      hasData=true;
      break;
    }
  }
  if (hasData) {
    document.getElementById(btn).style.display="inline-block";
  } else {
    document.getElementById(btn).style.display="none";
  }
}
