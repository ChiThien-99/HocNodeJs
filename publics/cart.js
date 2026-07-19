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
        <div>
          <img src="${data[0].img}" alt="img">
          ${data[0].color === "-" ? data[0].productName : data[0].productName + " " + data[0].color}
        </div>
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
          document.getElementById("discountAmount").dataset.discount =
            totalDiscountAmount;
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
socket.on("update-deliveryAddress", (data) => {
  console.log(data);
  document.getElementById("contentReceivingInfor").innerHTML = "";
  document.getElementById("contentReceivingInfor").innerHTML = data
    .map(
      (da) => `
  <div data-idAddress="${da._id}">
    <p><span>Tên người nhận:</span> ${da.fullname}</p>
    <p><span>Số điện thoại:</span> ${da.tel}</p>
    <p><span>Địa chỉ:</span> ${da.address} (${da.category === "home" ? "Nhà riêng" : "Văn phòng"})</p>
    <button type="button" class="btnDeleteAddress" data-idAddress="${da._id}"><i class="fa-solid fa-xmark"></i></button>
  </div>
  `,
    )
    .join("");
});
socket.on("delete-deliveryAddress", (data) => {
  const deleteAddress = document.querySelector(`div[data-idAddress="${data}"]`);
  if (deleteAddress) {
    deleteAddress.remove();
  }
});
socket.on("update-invoiceInfo", (data) => {
  document.getElementById("contentInvoice").innerHTML = "";
  document.getElementById("contentInvoice").innerHTML = data
    .map(
      (da) => `
  <div data-idInvoiceInfor="${da._id}">
    <p><span>Tên công ty:</span> ${da.nameCompany}</p>
    <p><span>Mã số thuế:</span> ${da.mstCompany}</p>
    <p><span>Địa chỉ:</span> ${da.addressCompany}</p>
    <p><span>Mail nhận hóa đơn:</span> ${da.mailInvoice}</p>
    <button type="button" class="btnDeleteInvoice" data-idInvoiceInfor="${da._id}"><i class="fa-solid fa-xmark"></i></button>
  </div>
  `,
    )
    .join("");
});
socket.on("delete-inforInvoice", (data) => {
  const deleteInforInvoice = document.querySelector(
    `div[data-idInvoiceInfor="${data}"]`,
  );
  if (deleteInforInvoice) {
    deleteInforInvoice.remove();
  }
});
socket.on("updateCod", (data) => {
  const cod = document.querySelector("#divPaymentMethod label[for='cod']");
  if (data > 0) {
    cod.style.display = "flex";
  } else {
    cod.style.display = "none";
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
      document.getElementById("bagShopping").addEventListener("click", () => {
        window.open(`/cart/${idClient}`, "_self");
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
const tableOrder = document.querySelector("#tableOrder tbody");
if (tableOrder) {
  tableOrder.addEventListener("click", async function (e) {
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
                      document.getElementById(
                        "discountAmount",
                      ).dataset.discount = totalDiscountAmount;
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
}
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
                  document.getElementById("discountAmount").dataset.discount =
                    totalDiscountAmount;
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
  const navMenu = document.getElementById("divNavMenu");
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
              document.getElementById("discountAmount").dataset.discount =
                totalDiscountAmount;
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
if (addReceivingInfor) {
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
}
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
  // Chỉ cần gọi hàm select2() là khung search tự động xuất hiện
  $("#provinceCityInvoice").select2({
    placeholder: "Chọn tỉnh/thành phố",
    allowClear: true, // Cho phép bấm dấu x để xóa nhanh lựa chọn
  });
  $("#wardsCommunesInvoice").select2({
    placeholder: "Chọn phường/xã",
    allowClear: true, // Cho phép bấm dấu x để xóa nhanh lựa chọn
  });
  // 2. HÀNH ĐỘNG FIX: Lắng nghe sự kiện change thông qua Select2 của jQuery [cite: 2026-01-28]
  $("#provinceCityInvoice").on("change", function () {
    const province = this.value; // Lấy giá trị value (mã tỉnh) [cite: 2026-01-28]

    // ĐỊNH VỊ Ô PHƯỜNG XÃ
    const $wardsSelect = $("#wardsCommunesInvoice");

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
const submitFormReceivingInfor = document.getElementById(
  "submitFormReceivingInfor",
);
if (submitFormReceivingInfor) {
  submitFormReceivingInfor.addEventListener("click", () => {
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
          document.getElementById("fullname").value = "";
          document.getElementById("tel").value = "";
          $("#provinceCity").val(null).trigger("change");
          $("#wardsCommunes").val(null).trigger("change");
          document.getElementById("numberHouse").value = "";
          document.getElementById("categoryAddress").value = "";
          document.getElementById("addReceivingInfor").style.borderColor =
            "#80a710";
          document.getElementById("addReceivingInfor").style.color = "#80a710";
          document.getElementById("addReceivingInfor").innerHTML =
            `<i class="fa-solid fa-plus"></i> Thêm thông tin`;
          document.getElementById("formReceivingInfor").style.display = "none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  });
}
const listDeliveryAddress = document.getElementById("contentReceivingInfor");
if (listDeliveryAddress) {
  listDeliveryAddress.addEventListener("click", (e) => {
    const clickAddressDelivery = e.target.closest("div[data-idAddress]");
    if (!clickAddressDelivery) {
      return;
    }
    if (e.target.closest(".btnDeleteAddress")) {
      return;
    }
    const addressDelivery = listDeliveryAddress.querySelectorAll(
      "div[data-idAddress]",
    );
    addressDelivery.forEach((address) => {
      address.classList.remove("active");
    });
    clickAddressDelivery.classList.add("active");
    addressDelivery.forEach((address) => {
      if (address.classList.contains("active")) {
        document.getElementById("nameDelivery").innerText = address
          .querySelectorAll("p")[0]
          .childNodes[1].textContent.trim();
        document.getElementById("telDelivery").innerText = address
          .querySelectorAll("p")[1]
          .childNodes[1].textContent.trim();
        document.getElementById("addressDelivery").innerText = address
          .querySelectorAll("p")[2]
          .childNodes[1].textContent.trim();
      }
    });
  });
}
const contentReceivingInfor = document.getElementById("contentReceivingInfor");
if (contentReceivingInfor) {
  contentReceivingInfor.addEventListener("click", (e) => {
    const target = e.target;
    const btnDeleteAddress = target.closest(".btnDeleteAddress");
    if (!btnDeleteAddress) {
      return;
    }
    const idAddress = btnDeleteAddress.getAttribute("data-idAddress");
    const token = getCookie("accessToken2");
    if (!token) {
      return;
    }
    const decodedUser = jwtDecode(token);
    const idClient = decodedUser.id;
    fetch(`/cart/deleteAddress`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ idClient, idAddress }),
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
}
const cbInvoice = document.getElementById("cbInvoice");
if (cbInvoice) {
  document.getElementById("cbInvoice").addEventListener("change", function () {
    if (this.checked) {
      document.getElementById("divInvoice").style.display = "block";
    } else {
      document.getElementById("divInvoice").style.display = "none";
    }
  });
}
const addIssueInvoice = document.getElementById("addIssueInvoice");
if (addIssueInvoice) {
  addIssueInvoice.addEventListener("click", function () {
    const formIssueInvoice = document.getElementById("formIssueInvoice");
    const type = formIssueInvoice.style.display === "block" ? "none" : "block";
    const textBtn =
      formIssueInvoice.style.display === "block"
        ? `<i class="fa-solid fa-plus"></i> Thêm thông tin`
        : "Đóng form";
    formIssueInvoice.style.display = type;
    this.innerHTML = textBtn;
    if (textBtn === "Đóng form") {
      this.style.color = "red";
      this.style.borderColor = "red";
    } else {
      this.style.color = "#80a710";
      this.style.borderColor = "#80a710";
    }
  });
}
const submitIssueInvoice = document.getElementById("submitIssueInvoice");
if (submitIssueInvoice) {
  submitIssueInvoice.addEventListener("click", () => {
    const nameCompany = document.getElementById("nameCompany").value;
    const mstCompany = document.getElementById("mstCompany").value;
    const mailInvoice = document.getElementById("mailInvoice").value;
    const provinceCityInvoice = document.getElementById(
      "provinceCityInvoice",
    ).value;
    const wardsCommunesInvoice = document.getElementById(
      "wardsCommunesInvoice",
    ).value;
    const numberCompany = document.getElementById("numberCompany").value;
    const token = getCookie("accessToken2");
    if (!token) {
      return;
    }
    const decodedUser = jwtDecode(token);
    const idClient = decodedUser.id;
    fetch("/cart/addInfoInvoice", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        idClient,
        nameCompany,
        mstCompany,
        provinceCityInvoice,
        wardsCommunesInvoice,
        numberCompany,
        mailInvoice,
      }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("nameCompany").value = "";
          document.getElementById("mstCompany").value = "";
          document.getElementById("mailInvoice").value = "";
          $("#provinceCityInvoice").val(null).trigger("change");
          $("#wardsCommunesInvoice").val(null).trigger("change");
          document.getElementById("numberCompany").value = "";
          document.getElementById("addIssueInvoice").style.borderColor =
            "#80a710";
          document.getElementById("addIssueInvoice").style.color = "#80a710";
          document.getElementById("addIssueInvoice").innerHTML =
            `<i class="fa-solid fa-plus"></i> Thêm thông tin`;
          document.getElementById("formIssueInvoice").style.display = "none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  });
}
const contentInvoice = document.getElementById("contentInvoice");
if (contentInvoice) {
  contentInvoice.addEventListener("click", (e) => {
    const clickContentInvoice = e.target.closest("div[data-idInvoiceInfor]");
    if (!clickContentInvoice) {
      return;
    }
    if (e.target.closest(".btnDeleteInvoice")) {
      return;
    }
    const oneContentInvoice = contentInvoice.querySelectorAll(
      "div[data-idInvoiceInfor]",
    );
    oneContentInvoice.forEach((inv) => {
      inv.classList.remove("active");
    });
    clickContentInvoice.classList.add("active");
    oneContentInvoice.forEach((inv) => {
      if (inv.classList.contains("active")) {
        document.getElementById("nameCompanyOrder").innerText = inv
          .querySelectorAll("p")[0]
          .childNodes[1].textContent.trim();
        document.getElementById("mstCompanyOrder").innerText = inv
          .querySelectorAll("p")[1]
          .childNodes[1].textContent.trim();
        document.getElementById("addressCompanyOrder").innerText = inv
          .querySelectorAll("p")[2]
          .childNodes[1].textContent.trim();
        document.getElementById("mailInvoiceOrder").innerText = inv
          .querySelectorAll("p")[3]
          .childNodes[1].textContent.trim();
      }
    });
  });
  contentInvoice.addEventListener("click", (e) => {
    const target = e.target;
    const btnDeleteInforInvoice = target.closest(".btnDeleteInvoice");
    if (!btnDeleteInforInvoice) {
      return;
    }
    const idInforInvoice = btnDeleteInforInvoice.getAttribute(
      "data-idInvoiceInfor",
    );
    const token = getCookie("accessToken2");
    if (!token) {
      return;
    }
    const decodedUser = jwtDecode(token);
    const idClient = decodedUser.id;
    fetch(`/cart/deleteInvoiceInfor`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ idClient, idInforInvoice }),
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
}
const inpPayment = document.querySelectorAll('input[name="paymentMethod"]');
inpPayment.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.checked) {
      document.getElementById("paymentOrder").innerText =
        this.getAttribute("data-paymentMethod");
      if (
        this.getAttribute("data-paymentMethod") === "Thanh toán khi nhận hàng"
      ) {
        document.getElementById("btnOrder").innerText = "Đặt hàng";
      } else {
        document.getElementById("btnOrder").innerText = "Thanh toán";
      }
    } else {
      return;
    }
  });
});
const btnOrder = document.getElementById("btnOrder");
if (btnOrder) {
  btnOrder.addEventListener("click", () => {
    const token = getCookie("accessToken2");
    if (!token) {
      return;
    }
    const decodedUser = jwtDecode(token);
    const idClient = decodedUser.id;
    const discountAmount = document
      .getElementById("discountAmount")
      .getAttribute("data-discount");
    const paymentOrder = document.getElementById("paymentOrder").innerText;
    const nameDelivery = document.getElementById("nameDelivery").innerText;
    const telDelivery = document.getElementById("telDelivery").innerText;
    const addressDelivery =
      document.getElementById("addressDelivery").innerText;
    const cbInvoice = document.getElementById("cbInvoice").checked;
    const nameCompanyOrder =
      document.getElementById("nameCompanyOrder").innerText;
    const mstCompanyOrder =
      document.getElementById("mstCompanyOrder").innerText;
    const addressCompanyOrder = document.getElementById(
      "addressCompanyOrder",
    ).innerText;
    const mailInvoiceOrder =
      document.getElementById("mailInvoiceOrder").innerText;
    fetch("/cart/addOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        idClient,
        discountAmount,
        paymentOrder,
        nameDelivery,
        telDelivery,
        addressDelivery,
        cbInvoice,
        nameCompanyOrder,
        mstCompanyOrder,
        addressCompanyOrder,
        mailInvoiceOrder,
      }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          alert("Thông báo", mess, "#80a710");
          setTimeout(() => {
            window.location.href = "/cart/thank";
          }, 3000);
        } else {
          if (error) {
            alert("Lỗi", `${mess}\n${error}`, "red");
          } else {
            alert("Lỗi", mess, "red");
          }
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  });
}
