import { alert, confirm } from "./alert.js";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
import { authFetch, setAccessToken } from "./authFetch.js";
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
          const allCheckbox = document.querySelectorAll(
            "input[name='decentAdmin']",
          );
          allCheckbox.forEach((item) => (item.checked = false));
          alert("Thông báo", mess, "#027e1f");
          window.location.reload();
        } else {
          document.getElementById("idAdminHidden").value = "";
          document.getElementById("fullnameAdmin").value = "";
          document.getElementById("roleAdmin").value = "";
          document.getElementById("emailAdmin").value = "";
          document.getElementById("pwAdmin").value = "";
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
          alert("Thông báo", mess, "#027e1f");
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
      "#027e1f",
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
            alert("Thông báo", mess, "#027e1f");
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
        alert("Thông báo", mess, "#027e1f");
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
            alert("Thông báo", mess, "#027e1f");
          } else {
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
            alert("Thông báo", mess, "#027e1f");
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
      "#027e1f",
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
            alert("Thông báo", mess, "#027e1f");
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
  const idNotify=document.getElementById("idNotify").value;
  const typeNotify=document.getElementById("typeNotify").value;
  const contentNotify=document.getElementById("contentNotify").value;
  const urlNotify=document.getElementById("urlNotify").value;
  if (idNotify) {
    fetch(`/dashboard/updateNotify/${idNotify}`,{
      method:"PUT",
      headers:{"Content-Type":"application/json;charset=UTF-8"},
      body:JSON.stringify({typeNotify,contentNotify,urlNotify}),
    })
    .then(res=>res.json())
    .then(({mess,success,error})=>{
      if (success) {
        alert("Thông báo",mess,"#027e1f");
      } else {
        alert("Lõi",`${mess}\n${error}`,"red");
      }
    })
    .catch((error)=>{
      alert("Lỗi kết nối",error,"red");
    })
  } else {
     fetch("/dashboard/addNotify", {
    method: "POST",
    headers:{"Content-Type":"application/json;charset=UTF-8"},
    body: JSON.stringify({typeNotify,contentNotify,urlNotify}),
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        document.getElementById("typeNotify").value = "all";
        document.getElementById("contentNotify").value = "";
        document.getElementById("urlNotify").value = "";
        alert("Thông báo", mess, "#027e1f");
      } else {
        document.getElementById("typeNotify").value = "all";
        document.getElementById("contentNotify").value = "";
        document.getElementById("urlNotify").value = "";
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi kết nối", error, "red");
    });
  }
 
});
document.querySelectorAll(".btnUpdateNotify").forEach((btn)=>{
  btn.addEventListener("click",()=>{
    const idnotify=btn.getAttribute("data-idnotify");
    fetch(`/dashboard/updateNotify/${idnotify}`,{
      method:"GET",
      headers:{"Content-Type":"application/json;charset=UTF-8"},
    })
    .then(res=>res.json())
    .then(({data})=>{
      if(data){
      document.getElementById("idNotify").value=data._id;
      document.getElementById("typeNotify").value=data.type;
      document.getElementById("contentNotify").value=data.content;
      document.getElementById("urlNotify").value=data.url;
      document.getElementById("btnNotify").value="Cập nhật";
      }else{
        console.error("Không nhận được data");
      }
    });
  })
})
document.querySelectorAll(".btnDeleteNotify").forEach((btn)=>{
  btn.addEventListener("click",async()=>{
    const confirmDelete=await confirm("Thông báo","Bạn có chắc chắn muốn xóa thông báo này","#027e1f");
    if (confirmDelete) {
    const id=btn.getAttribute("data-idnotify");
    fetch(`/dashboard/deleteNotify/${id}`,{
      method:"DELETE",
      headers:{"Content-Type":"application/json;charset=UTF-8"},
    })
    .then(res=>res.json())
    .then(({mess,success,error})=>{
      if (success) {
        alert("Thông báo",mess,"#027e1f")
      } else {
        alert("Lỗi",`${mess}\n${error}`,"red")
      }
    })
    .catch((error)=>{
      alert("Lỗi kết nối",error,"red")
    })
    }
  })
})
