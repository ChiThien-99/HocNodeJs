import { authFetch2, setAccessToken2 } from "./authFetch.js";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
import { alert, confirm } from "./alert.js";
const socket = io();
socket.on("updateCart",(data)=>{
    console.log(data[0]);
    const rowNeedUpdate=document.querySelector(`tr[data-idProduct="${data[0].productId}"]`);
    if (rowNeedUpdate) {
    rowNeedUpdate.querySelector("#quantityProduct").value=data[0].quantity;
    rowNeedUpdate.cells[4].innerText=(data[0].quantity*data[0].price).toLocaleString('vi-VN');
    } else {
        const lengthTr=document.querySelectorAll("#tableOrder tbody tr").length+1;
        document.querySelector("#tableOrder tbody").insertAdjacentHTML("beforeend",`
            <tr data-idProduct="${data[0].productId}">
                <td>${lengthTr}</td>
                <td>
                    ${data[0].color==="-"?data[0].productName:data[0].productName+" "+data[0].color}
                </td>
                <td><input type="number" name="quantityProduct" id="quantityProduct" value="${data[0].quantity}"></td>
                <td>${data[0].price.toLocaleString('vi-VN')}đ</td>
                <td>${(data[0].quantity*data[0].price).toLocaleString('vi-VN')}đ</td>
                <td>
                    <button type="button" class="btnDeleteProduct" data-idProduct="${data[0].productId}">Xóa</button>
                </td>
            </tr>
        `)
    }
    const countBagShopping=document.querySelector("#bagShopping span");
    if (countBagShopping) {
        countBagShopping.innerText=data[1];
    }
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
      const idClient = decodedUser.id;
      fetch(`/detailApp/cart/count?idClient=${idClient}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ success, totalItems }) => {
          if (success) {
            const countCart = document.querySelector("#bagShopping span");
            const countCartHamburgerBtn = document.getElementById(
              "countCartHamburgerBtn",
            );
            if (countCart || countCartHamburgerBtn) {
              countCart.innerText = totalItems;
              countCartHamburgerBtn.innerText = totalItems;
            }
          }
        })
        .catch((error) => {
          alert("Lỗi", error, "red");
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
    const countCart = document.querySelector("#bagShopping span");
    if (countCart) {
      countCart.innerText = 0;
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
document.querySelector("#tableOrder tbody").addEventListener("click",async function(e){
    const target=e.target;
    if (target.classList.contains("btnDeleteProduct")) {
        const confirmDelete=await confirm("Thông báo","Bạn có chắn chắn muốn xóa sản phẩm này","#1877f2");
        if (confirmDelete) {
            const token=getCookie("accessToken2");
            if (!token) {
                return
            }
            const decodedUser=jwtDecode(token);
            const idClient=decodedUser.id;
            const idProduct=target.getAttribute("data-idProduct");
            console.log(idClient,idProduct);
        fetch(`/cart/deleteProduct`,{
            method:"DELETE",
            headers:{"Content-Type":"application/json;charset=UTF-8"},
            body:JSON.stringify({idClient,idProduct}),
        })
        .then(res=>res.json())
        .then(({mess,success,error,totalItems})=>{
            if (success) {
                alert("Thông báo",mess,"#80a710");
                const countBagShopping=document.querySelector("#bagShopping span");
                if (countBagShopping) {
                    console.log(totalItems);
                    countBagShopping.innerText=totalItems;
                }
                const rowToDelete = document.querySelector(`tr[data-idProduct="${idProduct}"]`);
                if (rowToDelete) {
                   rowToDelete.remove();
                }
                if (totalItems===0) {
                    window.location.reload();
                }
            } else {
                alert("Lỗi",`${mess}\n${error}`,"red");
            }
        })
        .catch((error)=>{
            alert("Lỗi",error,"red");
        });
        }
    }
})
document.querySelectorAll(".quantityProduct").forEach((inp)=>{
    inp.addEventListener("change",function(){
    const idProduct=this.getAttribute("data-idProduct");
    const rowNeedUpdate=document.querySelector(`tr[data-idProduct="${idProduct}"]`);
    const priceProduct=rowNeedUpdate.querySelector(".priceProduct").value;
    rowNeedUpdate.cells[4].innerText=`${(this.value*priceProduct).toLocaleString('vi-VN')} đ`;
    fetch("/cart/updateQuantity")
})
})
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