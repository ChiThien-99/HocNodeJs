import { authFetch2, setAccessToken2 } from "./authFetch.js";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
import { alert, confirm } from "./alert.js";
const socket = io();
socket.on("updateCart", (data) => {
  console.log(data[0]);
  const rowNeedUpdate = document.querySelector(
    `tr[data-idProduct="${data[0].productId}"]`,
  );
  if (rowNeedUpdate) {
    rowNeedUpdate.querySelector("#quantityProduct").value = data[0].quantity;
    rowNeedUpdate.cells[4].innerText = (
      data[0].quantity * data[0].price
    ).toLocaleString("vi-VN");
  } else {
    const lengthTr =
      document.querySelectorAll("#tableOrder tbody tr").length + 1;
    document.querySelector("#tableOrder tbody").insertAdjacentHTML(
      "beforeend",
      `
      <tr data-idProduct="${data[0].productId}">
        <td>${lengthTr}</td>
        <td>
          ${data[0].color === "-" ? data[0].productName : data[0].productName + " " + data[0].color}
        </td>
        <td><input type="number" name="quantityProduct" class="quantityProduct" value="${data[0].quantity}" data-idProduct="${data[0].productId}"></td>
        <input type="hidden" name="priceProduct" class="priceProduct" value="${data[0].price}">
        <td>${data[0].price.toLocaleString("vi-VN")}đ</td>
        <td>${(data[0].quantity * data[0].price).toLocaleString("vi-VN")}đ</td>
        <td>
          <button type="button" class="btnDeleteProduct" data-idProduct="${data[0].productId}">Xóa</button>
        </td>
      </tr>
        `,
    );
  }
  const countBagShopping = document.querySelector("#bagShopping span");
  if (countBagShopping) {
    countBagShopping.innerText = data[1];
  }
  const token = getCookie("accessToken2");
  if (!token) {
    return;
  }
  const decodedUser = jwtDecode(token);
  const idClient = decodedUser.id;
  fetch("/cart/calMultiVouchers", {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    body: JSON.stringify({ selectedVoucherCode, idClient }),
  })
    .then((res) => res.json())
    .then(
      ({ subTotal, totalDiscountAmount, finalTotal, success, mess, error }) => {
        if (success) {
          document.getElementById("subTotal").innerText =
            `${subTotal.toLocaleString("vi-VN")}đ`;
          document.getElementById("discountAmount").innerText =
            `${totalDiscountAmount.toLocaleString("vi-VN")}đ`;
          document.getElementById("finalTotal").innerText =
            `${finalTotal.toLocaleString("vi-VN")}đ`;
        } else {
          alert("Thông báo", `${mess}\n${error}`, "#80a710");
        }
      },
    );
});
socket.on("update-totalItems", (totalItems) => {
  const countBagShopping = document.querySelector("#bagShopping span");
  if (countBagShopping) {
    countBagShopping.innerText = totalItems;
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
      document
        .getElementById("btnDashboardUserLogin")
        .addEventListener("click", (e) => {
          e.preventDefault();
          window.open(`/dashboardClient/${idClient}`, "_blank");
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
document.getElementById("btnRegisterClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=registerClient&redirect=${encodeURIComponent(currentPath)}`;
});
document.getElementById("btnLoginClient").addEventListener("click", () => {
  const currentPath = window.location.pathname + window.location.search;
  window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
});
document
  .querySelector("#tableOrder tbody")
  .addEventListener("click", async function (e) {
    const target = e.target;
    if (target.classList.contains("btnDeleteProduct")) {
      const confirmDelete = await confirm(
        "Thông báo",
        "Bạn có chắn chắn muốn xóa sản phẩm này",
        "#1877f2",
      );
      if (confirmDelete) {
        const token = getCookie("accessToken2");
        if (!token) {
          return;
        }
        const decodedUser = jwtDecode(token);
        const idClient = decodedUser.id;
        const idProduct = target.getAttribute("data-idProduct");
        console.log(idClient, idProduct);
        fetch(`/cart/deleteProduct`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          body: JSON.stringify({ idClient, idProduct }),
        })
          .then((res) => res.json())
          .then(({ mess, success, error, totalItems }) => {
            if (success) {
              alert("Thông báo", mess, "#80a710");
              const countBagShopping =
                document.querySelector("#bagShopping span");
              if (countBagShopping) {
                console.log(totalItems);
                countBagShopping.innerText = totalItems;
              }
              const rowToDelete = document.querySelector(
                `tr[data-idProduct="${idProduct}"]`,
              );
              if (rowToDelete) {
                rowToDelete.remove();
              }
              if (totalItems === 0) {
                window.location.reload();
              }
              fetch("/cart/calMultiVouchers", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=UTF-8" },
                body: JSON.stringify({ selectedVoucherCode, idClient }),
              })
                .then((res) => res.json())
                .then(
                  ({
                    subTotal,
                    totalDiscountAmount,
                    finalTotal,
                    success,
                    mess,
                    error,
                  }) => {
                    if (success) {
                      document.getElementById("subTotal").innerText =
                        `${subTotal.toLocaleString("vi-VN")}đ`;
                      document.getElementById("discountAmount").innerText =
                        `${totalDiscountAmount.toLocaleString("vi-VN")}đ`;
                      document.getElementById("finalTotal").innerText =
                        `${finalTotal.toLocaleString("vi-VN")}đ`;
                    } else {
                      alert("Thông báo", `${mess}\n${error}`, "#80a710");
                    }
                  },
                );
            } else {
              alert("Lỗi", `${mess}\n${error}`, "red");
            }
          })
          .catch((error) => {
            alert("Lỗi", error, "red");
          });
      }
    }
  });
document.querySelectorAll(".quantityProduct").forEach((inp) => {
  inp.addEventListener("change", function () {
    const idProduct = this.getAttribute("data-idProduct");
    const rowNeedUpdate = document.querySelector(
      `tr[data-idProduct="${idProduct}"]`,
    );
    const priceProduct = rowNeedUpdate.querySelector(".priceProduct").value;
    rowNeedUpdate.cells[4].innerText = `${(this.value * priceProduct).toLocaleString("vi-VN")} đ`;
    const token = getCookie("accessToken2");
    if (!token) {
      return;
    }
    const decodedUser = jwtDecode(token);
    const idClient = decodedUser.id;
    const productQuantity = this.value;
    fetch("/cart/updateQuantity", {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ idClient, idProduct, productQuantity }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error, totalItems }) => {
        if (success) {
          const countBagShopping = document.querySelector("#bagShopping span");
          if (countBagShopping) {
            countBagShopping.innerText = totalItems;
          }
          fetch("/cart/calMultiVouchers", {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=UTF-8" },
            body: JSON.stringify({ selectedVoucherCode, idClient }),
          })
            .then((res) => res.json())
            .then(
              ({
                subTotal,
                totalDiscountAmount,
                finalTotal,
                success,
                mess,
                error,
              }) => {
                if (success) {
                  document.getElementById("subTotal").innerText =
                    `${subTotal.toLocaleString("vi-VN")}đ`;
                  document.getElementById("discountAmount").innerText =
                    `${totalDiscountAmount.toLocaleString("vi-VN")}đ`;
                  document.getElementById("finalTotal").innerText =
                    `${finalTotal.toLocaleString("vi-VN")}đ`;
                } else {
                  alert("Thông báo", `${mess}\n${error}`, "#80a710");
                }
              },
            );
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  });
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

let selectedVoucherCode = [];
document.querySelectorAll(".voucher").forEach((v) => {
  v.addEventListener("change", (e) => {
    if (e.target && e.target.classList.contains("applyVoucher")) {
      const checkbox = e.target;
      const voucherCode = checkbox.getAttribute("data-codeVoucher");
      if (checkbox.checked) {
        if (!selectedVoucherCode.includes(voucherCode)) {
          selectedVoucherCode.push(voucherCode);
        }
      } else {
        selectedVoucherCode = selectedVoucherCode.filter(
          (code) => code !== voucherCode,
        );
      }
      const token = getCookie("accessToken2");
      if (!token) {
        return;
      }
      const decodedUser = jwtDecode(token);
      const idClient = decodedUser.id;
      fetch("/cart/calMultiVouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify({ selectedVoucherCode, idClient }),
      })
        .then((res) => res.json())
        .then(
          ({ subTotal, totalDiscountAmount, finalTotal, success, mess }) => {
            if (success) {
              document.getElementById("subTotal").innerText =
                `${subTotal.toLocaleString("vi-VN")}đ`;
              document.getElementById("discountAmount").innerText =
                `${totalDiscountAmount.toLocaleString("vi-VN")}đ`;
              document.getElementById("finalTotal").innerText =
                `${finalTotal.toLocaleString("vi-VN")}đ`;
            } else {
              alert("Thông báo", mess, "#80a710");
            }
          },
        );
    }
  });
});
const addReceivingInfor = document.getElementById("addReceivingInfor");
addReceivingInfor.addEventListener("click", function () {
  const displayFormReceivingInfor =
    document.getElementById("formReceivingInfor");
  const type =
    displayFormReceivingInfor.style.display === "block" ? "none" : "block";
  const textBtn =
    displayFormReceivingInfor.style.display === "block"
      ? `<i class="fa-solid fa-plus"></i> Thêm thông tin`
      : "Đóng form";
  displayFormReceivingInfor.style.display = type;
  this.innerHTML = textBtn;
  if (textBtn === "Đóng form") {
    this.style.color = "red";
    this.style.borderColor = "red";
  } else {
    this.style.color = "#80a710";
    this.style.borderColor = "#80a710";
  }
});
$(document).ready(function () {
  // Chỉ cần gọi hàm select2() là khung search tự động xuất hiện
  $("#provinceCity").select2({
    placeholder: "Chọn tỉnh/thành phố",
    allowClear: true, // Cho phép bấm dấu x để xóa nhanh lựa chọn
  });
  $("#wardsCommunes").select2({
    placeholder: "Chọn phường/xã",
    allowClear: true, // Cho phép bấm dấu x để xóa nhanh lựa chọn
  });
  // 2. HÀNH ĐỘNG FIX: Lắng nghe sự kiện change thông qua Select2 của jQuery [cite: 2026-01-28]
  $("#provinceCity").on("change", function () {
    const province = this.value; // Lấy giá trị value (mã tỉnh) [cite: 2026-01-28]

    // ĐỊNH VỊ Ô PHƯỜNG XÃ
    const $wardsSelect = $("#wardsCommunes");

    // BIỆN PHÁP PHÒNG THỦ 1: Reset sạch danh sách phường xã cũ khi chọn lại tỉnh khác [cite: 2026-01-28]
    // Hàm .html() rỗng giúp xóa option cũ, .val(null).trigger('change') giúp Select2 cập nhật lại giao diện trống [cite: 2026-01-28]
    $wardsSelect.html('<option value=""></option>').val(null).trigger("change");

    if (!province) {
      return; // Nếu người dùng bấm nút xóa (Clear choice), dừng lại tại đây [cite: 2026-01-28]
    }

    // Gửi dữ liệu về Server xử lý [cite: 2026-01-28]
    fetch("/cart/filterProvinceWards", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ province }),
    })
      .then((res) => res.json())
      .then(({ wards, mess, success, error }) => {
        if (success) {
          // BIỆN PHÁP PHÒNG THỦ 2: Tạo chuỗi html chứa danh sách option mới [cite: 2026-01-28]
          let optionsHtml = '<option value=""></option>'; // Dòng trống cho placeholder của Select2 [cite: 2026-01-28]

          wards.forEach((w) => {
            optionsHtml += `<option value="${w.name}">${w.name}</option>`;
          });

          // Đổ toàn bộ danh sách mới vào thẻ select gốc [cite: 2026-01-28]
          $wardsSelect.html(optionsHtml);

          // HÀNH ĐỘNG CỐT LÕI: Ép Select2 cập nhật lại giao diện hiển thị từ danh sách gốc mới [cite: 2026-01-28]
          $wardsSelect.trigger("change");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  });
});
document
  .getElementById("formReceivingInfor")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    const fullname = document.getElementById("fullname").value;
    const tel = document.getElementById("tel").value;
    const provinceCity = document.getElementById("provinceCity").value;
    const wardsCommunes = document.getElementById("wardsCommunes").value;
    const numberHouse = document.getElementById("numberHouse").value;
    const categoryAddress = document.getElementById("categoryAddress").value;
    const token = getCookie("accessToken2");
    if (!token) {
      return;
    }
    const decodedUser = jwtDecode(token);
    const idClient = decodedUser.id;
    fetch("/cart/addReceivingInfor", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        idClient,
        fullname,
        tel,
        provinceCity,
        wardsCommunes,
        numberHouse,
        categoryAddress,
      }),
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
  });
