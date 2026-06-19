import { authFetch2, setAccessToken2 } from "./authFetch.js";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
import { alert, confirm } from "./alert.js";
async function verifySession() {
  try {
    const response = await authFetch2("/api/auth/me2");
    if (!response.ok) {
      throw new Error("Session Expired");
    }
    console.log("Phiên làm việc hợp lệ");
  } catch (error) {
    console.error("Không thể refresh token, quay về login");
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
  }
}
verifySession();
document.getElementById("btnAddCart").addEventListener("click",function(){
  const token=getCookie("accessToken2");
  const decodedeUser=jwtDecode(token);
  const idClient=decodedeUser.id;
  const productId=this.getAttribute("data-idApp");
  const productName=this.getAttribute("data-nameApp");
  const productPrice=this.getAttribute("data-priceApp");
  this.disabled=true;
  this.style.cursor="not-allowed";
  fetch("/detailApp/cart/add",{
    method:"POST",
    headers:{"Content-Type":"application/json;charset=UTF-8"},
    body:JSON.stringify({idClient,productId,productName,productPrice}),
  })
  .then(res=>res.json())
  .then(({success,mess,totalItems,error})=>{
    this.disabled=false;
    this.style.cursor="pointer";
    if (success) {
      // alert("Thông báo",mess,"#80a710");
      const countCart=document.querySelector("#bagShopping span")
      countCart.innerText=totalItems;
      countCart.classList.remove("bounce-animation");
      void countCart.offsetWidth;
      countCart.classList.add("bounce-animation");
      setTimeout(() => {
        countCart.classList.remove("bounce-animation");
      }, 500);
      const countCartHamburgerBtn=document.getElementById("countCartHamburgerBtn");
      countCartHamburgerBtn.innerText=totalItems;
      countCartHamburgerBtn.classList.remove("bounce-animation");
      void countCartHamburgerBtn.offsetWidth;
      countCartHamburgerBtn.classList.add("bounce-animation");
      setTimeout(() => {
        countCartHamburgerBtn.classList.remove("bounce-animation");
      }, 500);
    } else {
      alert("Lỗi",`${mess}\n${error}`,"red");
    }
  })
  .catch((error)=>{
    this.disabled=false;
    this.style.cursor="pointer";
    alert("Lỗi",error,"red");
  });
})
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}
function getUserFromCookie() {
  const token = getCookie("accessToken2");
  if (token) {
    try {
      document.querySelector("#navMenu #groupBtn").style.display = "none";
      document.querySelector("#navMenu #containerUserLogin").style.display =
        "flex";
      const decodedUser = jwtDecode(token);
      document.querySelector("#infoUserLogin h3").innerText =
        decodedUser.fullname;
      const idClient=decodedUser.id;
      fetch(`/detailApp/cart/count?idClient=${idClient}`,{
        method:"GET",
        headers:{"Content-Type":"application/json;charset=UTF-8"},
      })
      .then(res=>res.json())
      .then(({success,totalItems})=>{
        if (success) {
          const countCart=document.querySelector("#bagShopping span");
          const countCartHamburgerBtn=document.getElementById("countCartHamburgerBtn");
          if (countCart||countCartHamburgerBtn) {
            countCart.innerText=totalItems;
            countCartHamburgerBtn.innerText=totalItems;
          }
        }
      })
      .catch((error)=>{
        alert("Lỗi",error,"red");
      });
      return decodedUser;
    } catch (error) {
      console.error(`Token không hợp lệ hoặc đã bị can thiệp ${error}`);
      return null;
    }
  } else {
    document.querySelector("#navMenu #groupBtn").style.display = "block";
    document.querySelector("#navMenu #containerUserLogin").style.display =
      "none";
    const countCart=document.querySelector("#bagShopping span");
    if (countCart) {
      countCart.innerText=0;
    }
    return null;
  }
}
window.onload = getUserFromCookie;
document.getElementById("btnLogoutUserLogin").addEventListener("click", (e) => {
  e.preventDefault();
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.json())
    .then(({ mess, error, success }) => {
      if (success) {
        setAccessToken2(null);
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
      } else {
        alert("Lỗi", `${mess}\n${error}`, red);
      }
    })
    .catch((error) => {
      alert("Lỗi", error, red);
      setAccessToken2(null);
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
    });
});
document
  .getElementById("btnDashboardUserLogin")
  .addEventListener("click", (e) => {
    e.preventDefault();
    window.open("/dashboardClient", "_blank");
  });
document.getElementById("btnRegisterClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=registerClient&redirect=${encodeURIComponent(currentPath)}`;
});
document.getElementById("btnLoginClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
});
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      hamburgerBtn.classList.toggle("active");
      navMenu.classList.toggle("active");
      if (navMenu.classList.contains("active")) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    });
    const navLink = navMenu.querySelectorAll("a");
    navLink.forEach((link) => {
      link.addEventListener("click", () => {
        hamburgerBtn.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("no-scroll");
      });
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const token = getCookie("accessToken2");
  const idApp=document.getElementById("idApp").innerText;
  const decodeToken = jwtDecode(token);
  const idClient = decodeToken.id;
  checkOrActivateTrial(idClient, idApp)
});
function checkOrActivateTrial(idClient, idApp, isClientClick=false) {
  fetch("/index/softwareAccess", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ idClient, idApp, isClientClick }),
  })
    .then((res) => res.json())
    .then(({ success, daysLeft, isExpired, mess, error }) => {
      if (success) {
        if (isExpired) {
          document.getElementById("bodyDetailApp").style.display="none";
          document.querySelector(".statusTrial").innerText =
            "Đã hết hạn dùng thử";
          document.querySelector(".statusTrial").style.backgroundColor =
            "red";
          alert(
              "Thông báo",
              "Bạn hết hạn dùng thử hãy mua để sử dụng thoải mái nhé",
              "#80a710",
            );
        } else {
          if (document.querySelector(".statusTrial")) {
            document.querySelector(".statusTrial").innerHTML =
            `Còn ${daysLeft} ngày dùng thử`;
          }
        }
      } else {
        if (error) {
          alert("Lỗi", `${mess}\n${error}`, "red");
        } else {
          alert("Lỗi", mess, "red");
        }
      }
    });
}