import { alert, confirm } from "./alert.js";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/+esm";
import { authFetch, setAccessToken } from "./authFetch.js";
import MindElixir from "./mind-elixir/dist/MindElixir.js";
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
  const existOption = document.querySelector(
    `option[data-optionFuncDVID="${data._id}"]`,
  );
  if (existOption) {
    existOption.value = data.name;
    existOption.innerText = data.name;
  } else {
    document.getElementById("funcDevice").insertAdjacentHTML(
      "afterbegin",
      `
      <option value="${data.name}" data-optionFuncDVID="${data._id}">${data.name}</option>  
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
    const optionToDelete = document.querySelector(
      `option[data-optionFuncDVID="${data._id}"]`,
    );
    if (optionToDelete) {
      optionToDelete.remove();
    }
  }
});
socket.on("update-device", (data) => {
  const existRow = document.querySelector(`tr[data-rowId="${data._id}"]`);
  if (existRow) {
    existRow.cells[0].innerText = data.name;
    existRow.cells[1].innerText = `${Number(data.priceLE).toLocaleString("vi-VN")}đ`;
    existRow.cells[2].innerText = `${Number(data.priceSI).toLocaleString("vi-VN")}đ`;
    existRow.cells[3].innerText = data.func;
    existRow.cells[4].innerText = new Date(data.createAt).toLocaleString(
      "vi-VN",
    );
  } else {
    document.querySelector("#tableDevice tbody").insertAdjacentHTML(
      "afterbegin",
      `
      <tr data-rowId="${data._id}">
        <td>${data.name}</td>
        <td>${Number(data.priceLE).toLocaleString("vi-VN")}đ</td>
        <td>${Number(data.priceSI).toLocaleString("vi-VN")}đ</td>
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
  const existRowDevice = document.querySelector(
    `tr[data-idDeviceImport="${data._id}"]`,
  );
  if (existRowDevice) {
    existRowDevice.cells[0].innerText = data.name;
    existRowDevice.cells[1].innerText = `${Number(data.priceLE).toLocaleString("vi-VN")}đ`;
    existRowDevice.cells[2].innerText = `${Number(data.priceSI).toLocaleString("vi-VN")}đ`;
  } else {
    document.querySelector("#tableImportDevice tbody").insertAdjacentHTML(
      "afterbegin",
      `
      <tr data-idDeviceImport="${data._id}">
        <td>${data.name}</td>
        <td>${data.priceLE.toLocaleString("vi-VN")}đ</td>
        <td>${data.priceSI.toLocaleString("vi-VN")}đ</td>
        <td>
          <input type="text" name="importQuantity" class="importQuantity">
          <input type="hidden" name="importQuantityActual" class="importQuantityActual">
        </td>
        <td>
          <input type="text" name="cost" class="cost">
          <input type="hidden" name="costActual" class="costActual">
        </td>
        <td>
          <button type="button" class="btnImportDevice">Nhập kho</button>
          <button type="button" class="btnCancleDevice">Hủy</button>
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
  const existOptionFuncApp = document.querySelector(
    `option[data-optionFuncAppID="${data._id}"]`,
  );
  if (existOptionFuncApp) {
    existOptionFuncApp.value = data.name;
    existOptionFuncApp.innerText = data.name;
  } else {
    document.getElementById("funcApp").insertAdjacentHTML(
      "afterbegin",
      `
      <option value="${data.name}" data-optionFuncAppID="${data._id}">${data.name}</option>  
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
    const optionToDelete = document.querySelector(
      `option[data-optionFuncAppID="${data._id}"]`,
    );
    if (optionToDelete) {
      optionToDelete.remove();
    }
  }
});
socket.on("update-app", (data) => {
  const existRow = document.querySelector(`tr[data-idapp="${data._id}"]`);
  if (existRow) {
    existRow.cells[0].innerText = data.name;
    existRow.cells[1].innerText = data.func;
    if (data.priceLE === "Miễn phí" && data.priceSI === "Miễn phí") {
      existRow.cells[2].innerText = data.priceLE;
      existRow.cells[3].innerText = data.priceSI;
    } else {
      existRow.cells[2].innerText = `${Number(data.priceLE).toLocaleString("vi-VN")}đ`;
      existRow.cells[3].innerText = `${Number(data.priceSI).toLocaleString("vi-VN")}đ`;
    }
    existRow.cells[4].innerText = new Date(data.createAt).toLocaleString(
      "vi-VN",
    );
  } else {
    let price = "";
    if (data.priceLE === "Miễn phí" && data.priceSI === "Miễn phí") {
      price = `
      <td>${data.priceLE}</td>
      <td>${data.priceSI}</td>
      `;
    } else {
      price = `
      <td>${Number(data.priceLE).toLocaleString("vi-VN")}đ</td>
      <td>${Number(data.priceSI).toLocaleString("vi-VN")}đ</td>
      `;
    }
    document.querySelector("#tableApp tbody").insertAdjacentHTML(
      "afterbegin",
      `
    <tr data-idapp="${data._id}">
      <td>${data.name}</td>
      <td>${data.func}</td>
      ${price}
      <td>${new Date(data.createAt).toLocaleString("vi-VN")}</td>
      <td>
        <div class="btnGroup">
          <button class="btnUpdateApp" data-idapp="${data._id}">Cập nhật</button>
          <button class="btnDeleteApp" data-idapp="${data._id}">Xóa</button>
        </div>
      </td>
    </tr>
  `,
    );
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
socket.on("update-categoryblogs", (data) => {
  const existRow = document.querySelector(
    `tr[data-idCategoryblogs="${data._id}"]`,
  );
  if (existRow) {
    existRow.cells[0].innerText = data.name;
  } else {
    document.querySelector("#tableCategoryblogs tbody").insertAdjacentHTML(
      "afterbegin",
      `
    <tr data-idCategoryblogs="${data._id}">
      <td>${data.name}</td>
      <td>
        <div class="btnGroup">
          <button class="btnUpdateCategoryblogs" data-idnCategoryblogs="${data._id}">Cập nhật</button>
          <button class="btnDeleteCategoryblogs" data-idCategoryblogs="${data._id}">Xóa</button>
        </div>
      </td>
    </tr>
  `,
    );
  }
});
socket.on("delete-categoryblogs", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(
      `tr[data-idCategoryblogs="${data._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-blogs", (data) => {
  const existBlog = document.querySelector(`tr[data-idblogs="${data._id}"]`);
  if (existBlog) {
    existBlog.cells[0].innerText = data.title;
    existBlog.cells[1].innerText = data.category;
    existBlog.cells[2].innerText = new Date(data.createAt).toLocaleString(
      "vi-VN",
    );
  } else {
    document.querySelector("#tableblogs tbody").insertAdjacentHTML(
      "afterbegin",
      `
    <tr data-idblogs="${data._id}">
      <td>${data.title}</td>
      <td>${data.category}</td>
      <td>${new Date(data.createAt).toLocaleString("vi-VN")}</td>
      <td>
        <div class="btnGroup">
          <button class="btnUpdateblogs" data-idblogs="${data._id}">Cập nhật</button>
          <button class="btnDeleteblogs" data-idblogs="${data._id}">Xóa</button>
        </div>
      </td>
    </tr>  
  `,
    );
  }
});
socket.on("delete-blogs", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(
      `tr[data-idblogs="${data._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-blogsDraft", (data) => {
  const currentBlogDraft = document.querySelector(
    `tr[data-idblogsdraft="${data._id}"]`,
  );
  if (currentBlogDraft) {
    currentBlogDraft.cells[0].innerText = data.title;
    currentBlogDraft.cells[1].innerText = data.category;
  } else {
    document.querySelector("#tableBlogsDraft tbody").insertAdjacentHTML(
      "afterbegin",
      `
    <tr data-idblogsdraft="${data._id}">
      <td>${data.title}</td>
      <td>${data.category}</td>
      <td>
        <div class="btnGroup">
          <button class="btnEditBlogsDraft" data-idblogsdraft="${data._id}">Chỉnh sửa</button>
          <button class="btnDeleteBlogsDraft" data-idblogsdraft="${data._id}">Xóa</button>
        </div>
      </td>
    </tr>
  `,
    );
  }
});
socket.on("delete-blogsdraft", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(
      `tr[data-idblogsdraft="${data._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-banner", (data) => {
  const currentRow = document.querySelector(`tr[data-idBN="${data._id}"]`);
  if (currentRow) {
    currentRow.cells[0].innerText = data.page;
    currentRow.cells[1].innerText = data.url;
  } else {
    document.querySelector("#tableBN tbody").insertAdjacentHTML(
      "afterbegin",
      `
    <tr data-idBN="${data._id}">
      <td>${data.page}</td>
      <td>${data.url}</td>
      <td>
        <div class="btnGroup">
          <button class="btnUpdateBN" data-idBN="${data._id}">Cập nhật</button>
          <button class="btnDeleteBN" data-idBN="${data._id}">Xóa</button>
        </div>
      </td>
    </tr>
  `,
    );
  }
});
socket.on("delete-banner", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(`tr[data-idBN="${data._id}"]`);
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-carousel", (data) => {
  if (!Array.isArray(data)) {
    const currentCarousel = document.querySelector(
      `tr[data-idCarousel="${data._id}"]`,
    );
    currentCarousel.cells[0].innerText = data.caption;
    currentCarousel.cells[1].innerText = data.url;
    currentCarousel.cells[2].innerText = data.order;
  } else {
    const lastCarousel = data[data.length - 1];
    document.querySelector("#tableCarousel tbody").insertAdjacentHTML(
      "afterbegin",
      `
      <tr data-idCarousel="${lastCarousel._id}">
        <td>${lastCarousel.caption}</td>
        <td>${lastCarousel.url}</td>
        <td>${lastCarousel.order}</td>
        <td>
          <div class="btnGroup">
            <button class="btnUpdateCarousel" data-idCarousel="${lastCarousel._id}">Cập nhật</button>
            <button class="btnDeleteCarousel" data-idCarousel="${lastCarousel._id}">Xóa</button>
          </div>
        </td>
      </tr>
    `,
    );
  }
});
socket.on("delete-carousel", (data) => {
  if (data.deleteCarousel && data.deleteCarousel._id) {
    const rowToDelete = document.querySelector(
      `tr[data-idCarousel="${data.deleteCarousel._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-notify", (data) => {
  if (Array.isArray(data)) {
    return;
  } else {
    const currentNotify = document.querySelector(
      `tr[data-idnotify="${data._id}"]`,
    );
    if (currentNotify) {
      currentNotify.cells[0].innerText = data.type;
      currentNotify.cells[1].innerText = data.content;
      currentNotify.cells[2].innerText = data.url;
      currentNotify.cells[3].innerText = new Date(data.expireAt).toLocaleString(
        "vi-VN",
      );
    } else {
      document.querySelector("#tableNotify tbody").insertAdjacentHTML(
        "afterbegin",
        `
      <tr data-idnotify="${data._id}">
        <td>${data.type}</td>
        <td>${data.content}</td>
        <td>${data.url}</td>
        <td>${new Date(data.expireAt).toLocaleString("vi-VN")}</td>
        <td>
          <div class="btnGroup">
            <button class="btnUpdateNotify" data-idnotify="${data._id}">Cập nhật</button>
            <button class="btnDeleteNotify" data-idnotify="${data._id}">Xóa</button>
          </div>
        </td>
      </tr>
    `,
      );
    }
  }
});
socket.on("delete-notify", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(
      `tr[data-idnotify="${data._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("update-problem", (data) => {
  document.querySelector("#tableProblem tbody").insertAdjacentHTML(
    "afterbegin",
    `
    <tr data-idProblem="${data._id}">
      <td>${data.name}</td>
      <td>${data.content}</td>
      <td>${new Date(data.createAt).toLocaleString("vi-VN")}</td>
      <td>
        <button type="button" class="btnWatchProblem" data-idProblem="${data._id}">Xem</button>
        <button type="button" class="btnDeleteProblem" data-idProblem="${data._id}">Xóa</button>
      </td>
    </tr>
  `,
  );
});
socket.on("delete-problem", (data) => {
  if (data && data._id) {
    const rowToDelete = document.querySelector(
      `tr[data-idProblem="${data._id}"]`,
    );
    if (rowToDelete) {
      rowToDelete.remove();
    }
  }
});
socket.on("updateStatusOrder", (data) => {
  data[0].forEach((id) => {
    const tr = document.querySelector(`tr[data-idOrder="${id}"]`);
    tr.querySelector(".status").value = data[1];
  });
});
socket.on("updateGeneratedOrder", (data) => {
  const generatedOrder = document.getElementById("generatedOrder");
  const computedStyle = window.getComputedStyle(generatedOrder);
  if (computedStyle.display === "none") {
    generatedOrder.style.display = "inline-block";
  }
  let totalGeneratedOrder = Number(generatedOrder.innerText);
  totalGeneratedOrder += Number(data);
  generatedOrder.innerText = totalGeneratedOrder;
});
socket.on("update-job", (data) => {
  const existRow = document.querySelector(`tr[data-idJob="${data[0]._id}"]`);
  if (existRow) {
    existRow.cells[0].innerText = data[0].level;
    existRow.cells[1].innerText = data[0].title;
    existRow.cells[2].innerText = new Date(data[0].startTime).toLocaleString(
      "vi-VN",
    );
    existRow.cells[3].innerText = new Date(data[0].deadline).toLocaleString(
      "vi-VN",
    );
    existRow.cells[4].innerText = data[0].assigned[1]
      ? data[0].assigned[1].name
      : "--";
    if (existRow.cells[0].innerText === "Đã hoàn thành") {
      existRow.cells[0].style.color = "#1877f2";
      existRow.style.backgroundColor = "gainsboro";
      existRow.style.color = "#bbb";
      existRow.querySelector(".btnAssignJob").style.display = "none";
      existRow.querySelector(".btnCompleteJob").style.display = "none";
      existRow.querySelector(".btnUpdateJob").style.display = "none";
    }
    if (existRow.cells[0].innerText === "Gấp") {
      existRow.cells[0].style.color = "red";
    } else if (existRow.cells[0].innerText === "Ưu tiên") {
      existRow.cells[0].style.color = "#ffcc00";
    } else if (existRow.cells[0].innerText === "Thong thả") {
      existRow.cells[0].style.color = "#80a710";
    }
  } else {
    const adminRowHtml = data[1]
      .map(
        (admin) => `
      <tr>
        <td>${admin.fullname}</td>
        <td>${admin.role}</td>
        <td>${admin.email}</td>
        <td>
          <input type="radio" name="assignAdmin" class="radioAssignAdmin" value="${admin._id}">
        </td>
      </tr>
    `,
      )
      .join("");
    const stringIdAdmin = JSON.stringify(
      data[0].assigned.map((item) => item.id),
    );
    const tbody = document.querySelector("#tableJob tbody");
    tbody.insertAdjacentHTML(
      "afterbegin",
      `
      <tr data-idJob="${data[0]._id}">
        <td class="levelJob">${data[0].level}</td>
        <td>${data[0].title}</td>
        <td>${new Date(data[0].startTime).toLocaleString("vi-VN")}</td>
        <td>${new Date(data[0].deadline).toLocaleString("vi-VN")}</td>
        <td>
        ${data[0].assigned[1] ? data[0].assigned[1].name : "--"}
        <div class="arrayIdAdminAssign" data-stringId='${stringIdAdmin}'></div>
        </td>
        <td>
        <button type="button" class="btnWatchJob">Xem</button>
        <button type="button" class="btnAssignJob">Giao việc</button>
        <button type="button" class="btnCompleteJob">Hoàn thành</button>
        <button type="button" class="btnUpdateJob">Cập nhật</button>
        <button type="button" class="btnDeleteJob">Xóa</button>
        <div class="divMindmap">
          <div class="mindmap">
            <div class="tool">
              <span><kbd>Enter</kbd>: Chèn nút cùng cấp <kbd>Tab</kbd>: Chèn nút con <kbd>F1</kbd>: Chuyển đến nút trung tâm <kbd>F2</kbd>: Chỉnh nội dung nút <kbd>Delete</kbd>: Xóa nút <kbd>Ctrl+C</kbd>: Copy <kbd>Ctrl+V</kbd>: Paste <kbd>Ctrl+Z</kbd>: Quay lại <kbd>Chuột trái</kbd>: Tô chọn nhiều node <kbd>Chuột phải</kbd>: Kéo màn hình</span>
              <button type="button" class="btnSaveMindmap">Lưu</button>
              <button type="button" class="btnCloseMindmap">Đóng</button>
            </div>
            <div class="map" data-title="${data[0].title}" data-mindmap='${JSON.stringify(data[0].mindmapStructure)}'></div>
          </div>
        </div>
          <div class="divAssignAdmin">
            <div class="assignAdmin">
              <h2>Chọn thành viên giao việc</h2>
              <table>
                <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Vị trí</th>
                  <th>Email</th>
                  <th>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                 ${adminRowHtml}
                </tbody>  
              </table>
              <div class="divBtnAssignAdmin">
                <button type="button" class="btnConfirmAssignAdmin">Xác nhận</button>
                <button type="button" class="btnCloseAssignAdmin">Đóng</button>
              </div>
            </div>
          </div>
        </td>
      </tr>
      `,
    );
    const newlyInsertRow = tbody.firstElementChild;
    const levelJob = newlyInsertRow.querySelector(".levelJob");
    if (levelJob) {
      levelJob.style.fontWeight = "bold";
      const levelTitle = levelJob.innerText;
      if (levelTitle === "Gấp") {
        levelJob.style.color = "red";
      } else if (levelTitle === "Ưu tiên") {
        levelJob.style.color = "#ffcc00";
      } else if (levelTitle === "Thong thả") {
        levelJob.style.color = "#80a710";
      }
    }
    const map = newlyInsertRow.querySelector(".map");
    const customTitle = map.getAttribute("data-title");
    const mind = new MindElixir({
      el: map,
    });
    mindInstances.push({
      mapId: customTitle,
      instance: mind,
      isInitialized: false,
    });
  }
});
socket.on("updateGeneratedJob", (data) => {
  const idAd = document.getElementById("idAd").innerText.slice(3);
  if (data[0].toString() === idAd.toString()) {
    const generatedJob = document.getElementById("generatedJob");
    const computedStyle = window.getComputedStyle(generatedJob);
    if (computedStyle.display === "none") {
      generatedJob.style.display = "inline-block";
    }
    let totalGeneratedOrder = Number(generatedJob.innerText);
    totalGeneratedOrder += Number(data[1]);
    generatedJob.innerText = totalGeneratedOrder;
  }
});
socket.on("delete-job", (data) => {
  if (data && data._id) {
    const rowDelete = document.querySelector(`tr[data-idJob="${data._id}"]`);
    if (rowDelete) {
      rowDelete.remove();
    }
  }
});
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
      const currentAdminId = document
        .getElementById("idAd")
        .innerText.slice(3)
        .trim();
      if (currentAdminId) {
        registerPushNotification(currentAdminId);
      }
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
const formCarousel = document.getElementById("formCarousel");
formCarousel.addEventListener("input", () => {
  checkFormEmptiness(formCarousel, "btnCancelCarousel");
});
formCarousel.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(formCarousel);
  const id = document.getElementById("idCarousel").value;
  if (id) {
    try {
      console.log(formData);
      fetch(`/dashboard/updateCarousel/${id}`, {
        method: "PUT",
        body: formData,
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            document.getElementById("idCarousel").value = "";
            formCarousel.reset();
            document.getElementById("btnAddCarousel").value = "Tạo";
            document.getElementById("btnCancelCarousel").style.display = "none";
            document.getElementById("btnDeleteImgCarousel").style.display =
              "none";
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        });
    } catch (error) {
      alert("Lỗi kết nối", error, "red");
    }
  } else {
    try {
      fetch("/dashboard/addCarousel", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then(({ mess, success, error }) => {
          if (success) {
            formCarousel.reset();
            document.getElementById("btnCancelCarousel").style.display = "none";
            alert("Thông báo", mess, "#80a710");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        });
    } catch (error) {
      alert("Lỗi kết nối", error, "red");
    }
  }
});
document
  .getElementById("btnCancelCarousel")
  .addEventListener("click", function () {
    formCarousel.reset();
    document.getElementById("idCarousel").value = "";
    document.getElementById("btnAddCarousel").value = "Tạo";
    document.getElementById("btnDeleteImgCarousel").style.display = "none";
    this.style.display = "none";
  });
document
  .getElementById("btnDeleteImgCarousel")
  .addEventListener("click", async () => {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn xóa hình carousel này",
      "#1877f2",
    );
    if (confirmDelete) {
      const id = document.getElementById("idCarousel").value;
      fetch(`/dashboard/deleteImgCarousel/${id}`, {
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
  .querySelector("#tableCarousel tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btnUpdateCarousel")) {
      const idCarousel = target.getAttribute("data-idCarousel");
      fetch(`/dashboard/updateBanner/${idCarousel}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          document.getElementById("idCarousel").value = data._id;
          document.getElementById("captionCarousel").value = data.caption;
          document.getElementById("btnDeleteImgCarousel").style.display =
            "inline-block";
          document.getElementById("urlCarousel").value = data.url;
          document.getElementById("orderCarousel").value = data.order;
          document.getElementById("btnAddCarousel").value = "Cập nhật";
          document.getElementById("btnCancelCarousel").style.display =
            "inline-block";
        });
    }
    if (target.classList.contains("btnDeleteCarousel")) {
      const confirmDelete = await confirm(
        "Thông báo",
        "Bạn chắc chắn muốn xóa carousel này",
        "#1877f2",
      );
      if (confirmDelete) {
        const id = target.getAttribute("data-idCarousel");
        fetch(`/dashboard/deleteCarousel/${id}`, {
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
const formAddNotify = document.getElementById("formAddNotify");
formAddNotify.addEventListener("input", () => {
  checkFormEmptiness(formAddNotify, "btnCancelNotify");
});
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
          formAddNotify.reset();
          document.getElementById("btnNotify").value = "Tạo";
          document.getElementById("btnCancelNotify").style.display = "none";
          alert("Thông báo", mess, "#80a710");
        } else {
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
          formAddNotify.reset();
          document.getElementById("btnCancelNotify").style.display = "none";
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
document
  .querySelector("#tableNotify tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btnUpdateNotify")) {
      const idnotify = target.getAttribute("data-idnotify");
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
            document.getElementById("btnCancelNotify").style.display =
              "inline-block";
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
    }
    if (target.classList.contains("btnDeleteNotify")) {
      const confirmDelete = await confirm(
        "Thông báo",
        "Bạn có chắc chắn muốn xóa thông báo này",
        "#1877f2",
      );
      if (confirmDelete) {
        const id = target.getAttribute("data-idnotify");
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
    }
  });
document
  .getElementById("btnCancelNotify")
  .addEventListener("click", function () {
    formAddNotify.reset();
    document.getElementById("idNotify").value = "";
    document.getElementById("btnNotify").value = "Tạo";
    this.style.display = "none";
  });
const formFuncApp = document.getElementById("formFuncApp");
formFuncApp.addEventListener("input", () => {
  checkFormEmptiness(formFuncApp, "btnCancelFuncApp");
});
formFuncApp.addEventListener("submit", (e) => {
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
          document.getElementById("btnCancelFuncApp").style.display = "none";
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
          document.getElementById("btnCancelFuncApp").style.display = "none";
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
            document.getElementById("btnCancelFuncApp").style.display =
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
  .getElementById("btnCancelFuncApp")
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
const optionPrice = document.getElementById("optionPrice");
optionPrice.addEventListener("change", () => {
  if (optionPrice.value === "freeApp") {
    document.getElementById("priceLEApp").value = "";
    document.getElementById("divPriceLEApp").style.display = "none";
    document.getElementById("priceSIApp").value = "";
    document.getElementById("divPriceSIApp").style.display = "none";
  } else {
    document.getElementById("divPriceLEApp").style.display = "block";
    document.getElementById("divPriceSIApp").style.display = "block";
  }
});
const priceSIApp = document.getElementById("priceSIApp");
const priceSIActualApp = document.getElementById("priceSIActualApp");
priceSIApp.addEventListener("input", (e) => {
  let rawValue = e.target.value.replace(/\D/g, "");
  priceSIActualApp.value = rawValue;
  if (rawValue) {
    e.target.value = Number(rawValue).toLocaleString("vi-VN");
  } else {
    e.target.value = "";
  }
});
const priceLEApp = document.getElementById("priceLEApp");
const priceLEActualApp = document.getElementById("priceLEActualApp");
priceLEApp.addEventListener("input", (e) => {
  let rawValue = e.target.value.replace(/\D/g, "");
  priceLEActualApp.value = rawValue;
  if (rawValue) {
    e.target.value = Number(rawValue).toLocaleString("vi-VN");
  } else {
    e.target.value = "";
  }
  let rawValueSI = rawValue * 0.8;
  priceSIActualApp.value = rawValueSI;
  if (rawValueSI) {
    priceSIApp.value = Number(rawValueSI).toLocaleString("vi-VN");
  } else {
    priceSIApp.value = "";
  }
});
const formApp = document.getElementById("formApp");
formApp.addEventListener("input", () => {
  checkFormEmptiness(formApp, "btnCancelApp");
});
formApp.addEventListener("submit", (e) => {
  e.preventDefault();
  const quillEditor = document.getElementsByClassName("quill-editor");
  const infoApp = document.getElementById("infoApp");
  infoApp.value = quillEditor;
  infoApp.value = quillInstances[1].getSemanticHTML();
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
            quillInstances[1].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("optionPrice").value = "freeApp";
          document.getElementById("divPriceLEApp").style.display = "none";
          document.getElementById("divPriceSIApp").style.display = "none";
          document.getElementById("btnApp").value = "Tạo";
          document.getElementById("btnDeleteImgApp").style.display = "none";
          document.getElementById("btnCancelApp").style.display = "none";
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
            quillInstances[1].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("optionPrice").value = "freeApp";
          document.getElementById("divPriceLEApp").style.display = "none";
          document.getElementById("divPriceSIApp").style.display = "none";
          document.getElementById("btnCancelApp").style.display = "none";
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
document
  .querySelector("#tableApp tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
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
              quillInstances[1].clipboard.dangerouslyPasteHTML(data.info || "");
            } else {
              console.error("Biến quill chưa được khởi tạo");
            }
            if (data.priceLE !== "Miễn phí") {
              document.getElementById("optionPrice").value = "hasPriceApp";
              document.getElementById("divPriceLEApp").style.display = "block";
              document.getElementById("priceLEApp").value = Number(
                data.priceLE,
              ).toLocaleString("vi-VN");
              console.log(Number(data.priceLE).toLocaleString("vi-VN"));
              document.getElementById("priceLEActualApp").value = data.priceLE;
              console.log(data.priceLE);
              document.getElementById("divPriceSIApp").style.display = "block";
              document.getElementById("priceSIApp").value = Number(
                data.priceSI,
              ).toLocaleString("vi-VN");
              console.log(Number(data.priceSI).toLocaleString("vi-VN"));
              document.getElementById("priceSIActualApp").value = data.priceSI;
              console.log(data.priceSI);
            } else {
              document.getElementById("optionPrice").value = "freeApp";
              document.getElementById("divPriceLEApp").style.display = "none";
              document.getElementById("priceLEApp").value = "";
              document.getElementById("priceLEActualApp").value = "";
              document.getElementById("divPriceSIApp").style.display = "none";
              document.getElementById("priceSIApp").value = "";
              document.getElementById("priceSIActualApp").value = "";
            }
            document.getElementById("instructionApp").value = data.instruction;
            document.getElementById("btnApp").value = "Cập nhật";
            document.getElementById("btnDeleteImgApp").style.display =
              "inline-block";
            document.getElementById("btnCancelApp").style.display =
              "inline-block";
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
document.getElementById("btnDeleteImgApp").addEventListener("click", () => {
  const id = document.getElementById("idApp").value;
  fetch(`/dashboard/deleteImgApp/${id}`, {
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
});
document.getElementById("btnCancelApp").addEventListener("click", function () {
  formApp.reset();
  if (typeof quillInstances !== "undefined") {
    quillInstances[1].setText("");
  } else {
    console.error("Biến quill không tồn tại");
  }
  document.getElementById("optionPrice").value = "freeApp";
  document.getElementById("divPriceLEApp").style.display = "none";
  document.getElementById("priceLEApp").value = "";
  document.getElementById("priceLEActualApp").value = "";
  document.getElementById("divPriceSIApp").style.display = "none";
  document.getElementById("priceSIApp").value = "";
  document.getElementById("priceSIActualApp").value = "";
  document.getElementById("idApp").value = "";
  document.getElementById("btnApp").value = "Tạo";
  document.getElementById("btnDeleteImgApp").style.display = "none";
  this.style.display = "none";
});
document.getElementById("btnCancelApp").addEventListener("click", function () {
  formApp.reset();
  if (typeof quillInstances !== "undefined") {
    quillInstances[1].setText("");
  } else {
    console.error("Biến quill không tồn tại");
  }
  this.style.display = "none";
});
const formFuncDevice = document.getElementById("formFuncDevice");
formFuncDevice.addEventListener("input", () => {
  checkFormEmptiness(formFuncDevice, "btnCancleFuncDevice");
});
formFuncDevice.addEventListener("submit", (e) => {
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
          document.getElementById("btnCancleFuncDevice").style.display = "none";
          alert("Thông báo", mess, "#80a710");
        } else {
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
          document.getElementById("btnCancleFuncDevice").style.display = "none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert(`Lỗi kết nối: ${error}`);
      });
  }
});
document
  .getElementById("btnCancleFuncDevice")
  .addEventListener("click", function () {
    document.getElementById("formFuncDevice").reset();
    document.getElementById("idFuncDevice").value = "";
    document.getElementById("btnFuncDevice").value = "Tạo";
    this.style.display = "none";
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
          document.getElementById("btnCancleFuncDevice").style.display =
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
formDevice.addEventListener("input", () => {
  checkFormEmptiness(formDevice, "btnCancelDevice");
});
formDevice.addEventListener("submit", (e) => {
  e.preventDefault();
  const dataform = new FormData(formDevice);
  const quillHTML = quillInstances[2].getSemanticHTML();
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
            quillInstances[2].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnDevice").value = "Tạo";
          document.getElementById("btnCancelDevice").style.display = "none";
          document.getElementById("deleteImageDevice").style.display = "none";
          document.getElementById("deleteImageColor").style.display = "none";
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
            quillInstances[2].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnCancelDevice").style.display = "none";
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
const priceSIDevice = document.getElementById("priceSIDevice");
const priceSIDeviceActual = document.getElementById("priceSIDeviceActual");
priceSIDevice.addEventListener("input", (e) => {
  let rawValue = e.target.value.replace(/\D/g, "");
  priceSIDeviceActual.value = rawValue;
  if (rawValue) {
    e.target.value = Number(rawValue).toLocaleString("vi-VN");
  } else {
    e.target.value = "";
  }
});
const priceLEDevice = document.getElementById("priceLEDevice");
const priceLEDeviceActual = document.getElementById("priceLEDeviceActual");
priceLEDevice.addEventListener("input", (e) => {
  let rawValue = e.target.value.replace(/\D/g, "");
  priceLEDeviceActual.value = rawValue;
  if (rawValue) {
    e.target.value = Number(rawValue).toLocaleString("vi-VN");
  } else {
    e.target.value = "";
  }
  let rawValueSI = rawValue * 0.8;
  priceSIDeviceActual.value = rawValueSI;
  if (rawValueSI) {
    priceSIDevice.value = Number(rawValueSI).toLocaleString("vi-VN");
  } else {
    priceSIDevice.value = "";
  }
});
document.querySelector("#tableImportDevice").addEventListener("input", (e) => {
  const target = e.target;
  if (target.classList.contains("cost")) {
    let rawValue = target.value.replace(/\D/g, "");
    const cell = target.closest("td");
    const costActual = cell.querySelector(".costActual");
    costActual.value = rawValue;
    if (rawValue) {
      target.value = Number(rawValue).toLocaleString("vi-VN");
    } else {
      target.value = "";
    }
  }
  if (target.classList.contains("importQuantity")) {
    let rawValue = target.value.replace(/\D/g, "");
    const cell = target.closest("td");
    const importQuantityActual = cell.querySelector(".importQuantityActual");
    importQuantityActual.value = rawValue;
    if (rawValue) {
      target.value = Number(rawValue).toLocaleString("vi-VN");
    } else {
      target.value = "";
    }
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
              quillInstances[2].clipboard.dangerouslyPasteHTML(data.info || "");
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
            document.getElementById("priceLEDevice").value = Number(
              data.priceLE,
            ).toLocaleString("vi-VN");
            document.getElementById("priceLEDeviceActual").value = data.priceLE;
            document.getElementById("priceSIDevice").value = Number(
              data.priceSI,
            ).toLocaleString("vi-VN");
            document.getElementById("priceSIDeviceActual").value = data.priceSI;
            document.getElementById("instrucDevice").value =
              data.instruction || "";
            document.getElementById("btnDevice").value = "Cập nhật";
            document.getElementById("deleteImageDevice").style.display =
              "inline-block";
            document.getElementById("deleteImageColor").style.display =
              "inline-block";
            document.getElementById("btnCancelDevice").style.display =
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
  .getElementById("btnCancelDevice")
  .addEventListener("click", function () {
    document.getElementById("btnDevice").value = "Tạo";
    formDevice.reset();
    document.getElementById("idDevice").value = "";
    if (typeof quillInstances !== "undefined") {
      quillInstances[2].setText("");
    } else {
      console.error("Biến quill không tồn tại");
    }
    this.style.display = "none";
    document.getElementById("deleteImageDevice").style.display = "none";
    document.getElementById("deleteImageColor").style.display = "none";
  });
document
  .getElementById("btnCancelDevice")
  .addEventListener("click", function () {
    formDevice.reset();
    if (typeof quillInstances !== "undefined") {
      quillInstances[2].setText("");
    } else {
      console.error("Biến quill không tồn tại");
    }
    document.getElementById("btnDevice").value = "Tạo";
    this.style.display = "none";
  });
const formblogs = document.getElementById("formblogs");
formblogs.addEventListener("input", () => {
  checkFormEmptiness(formblogs, "idblogs", "btnCancleBlog");
  checkFormEmptinessForSaveDraft(formblogs, "btnSaveDraft");
});
formblogs.addEventListener("submit", (e) => {
  e.preventDefault();
  const quillEditor = document.getElementsByClassName("quill-editor");
  const infoblogs = document.getElementById("infoblogs");
  infoblogs.value = quillEditor;
  infoblogs.value = quillInstances[3].getSemanticHTML();
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
          formblogs.reset();
          if (typeof quillInstances !== "undefined") {
            quillInstances[3].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnblogs").value = "Tạo";
          document.getElementById("btnCancleBlog").style.display = "none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi kết nối", error, "red");
      });
  } else {
    fetch(`/dashboard/addblogs/`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          formblogs.reset();
          if (typeof quillInstances !== "undefined") {
            quillInstances[3].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnCancleBlog").style.display = "none";
          document.getElementById("btnSaveDraft").style.display = "none";
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
document.getElementById("btnSaveDraft").addEventListener("click", function () {
  const quillEditor = document.getElementsByClassName("quill-editor");
  const infoblogs = document.getElementById("infoblogs");
  infoblogs.value = quillEditor;
  infoblogs.value = quillInstances[3].getSemanticHTML();
  const formData = new FormData(formblogs);
  const id = document.getElementById("idblogs").value;
  if (id) {
    fetch(`/dashboard/editBlogDraft/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("idblogs").value = "";
          formblogs.reset();
          if (typeof quillInstances !== "undefined") {
            quillInstances[3].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnDeleteImgBlog").style.display = "none";
          this.style.display = "none";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      });
  } else {
    fetch("/dashboard/addBlogDraft", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          formblogs.reset();
          if (typeof quillInstances !== "undefined") {
            quillInstances[3].setText("");
          } else {
            console.error("Biến quill không tồn tại");
          }
          document.getElementById("btnCancleBlog").style.display = "none";
          this.style.display = "none";
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
document.getElementById("btnPostDraft").addEventListener("click", function () {
  const quillEditor = document.getElementsByClassName("quill-editor");
  const infoblogs = document.getElementById("infoblogs");
  infoblogs.value = quillEditor;
  infoblogs.value = quillInstances[3].getSemanticHTML();
  const formData = new FormData(formblogs);
  const id = document.getElementById("idblogs").value;
  fetch(`/dashboard/postDraft/${id}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        formblogs.reset();
        if (typeof quillInstances !== "undefined") {
          quillInstances[3].setText("");
        } else {
          console.error("Biến quill không tồn tại");
        }
        document.getElementById("btnCancleBlog").style.display = "none";
        document.getElementById("btnSaveDraft").style.display = "none";
        document.getElementById("btnblogs").style.display = "inline-block";
        this.style.display = "none";
        alert("Thông báo", mess, "#80a710");
      } else {
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi", error, "red");
    });
});
document
  .querySelector("#tableBlogsDraft tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btnEditBlogsDraft")) {
      const id = target.getAttribute("data-idblogsdraft");
      fetch(`/dashboard/editBlogDraft/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          document.getElementById("idblogs").value = data._id;
          document.getElementById("titleblogs").value = data.title;
          if (typeof quillInstances !== "undefined") {
            quillInstances[3].clipboard.dangerouslyPasteHTML(data.info || "");
          } else {
            console.error("Biến quill chưa được khởi tạo");
          }
          const dataCategoryblogs = data.category;
          const categoryblogs = document.getElementById("categoryblogs");
          Array.from(categoryblogs.options).forEach((option) => {
            option.selected = dataCategoryblogs.includes(option.value);
          });
          document.getElementById("btnblogs").style.display = "none";
          document.getElementById("btnPostDraft").style.display =
            "inline-block";
          document.getElementById("btnDeleteImgBlog").style.display =
            "inline-block";
          document.getElementById("btnSaveDraft").style.display =
            "inline-block";
          document.getElementById("btnCancleBlog").style.display =
            "inline-block";
        });
    }
    if (target.classList.contains("btnDeleteBlogsDraft")) {
      const confirmDelete = await confirm(
        "Thông báo",
        "Bạn chắn chắn xóa blog nháp này",
        "#1877f2",
      );
      if (confirmDelete) {
        const id = target.getAttribute("data-idblogsdraft");
        fetch(`/dashboard/deleteBlogDraft/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json;charset=utf-8" },
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
    }
  });
document.getElementById("btnCancleBlog").addEventListener("click", function () {
  formblogs.reset();
  document.getElementById("idblogs").value = "";
  if (typeof quillInstances !== "undefined") {
    quillInstances[3].setText("");
  } else {
    console.error("Biến quill không tồn tại");
  }
  document.getElementById("btnblogs").value = "Tạo";
  document.getElementById("btnSaveDraft").style.display = "none";
  document.getElementById("btnDeleteImgBlog").style.display = "none";
  this.style.display = "none";
});

const formCategoryblogs = document.getElementById("formCategoryblogs");
formCategoryblogs.addEventListener("input", () => {
  checkFormEmptiness(formCategoryblogs, "btnCancleUDCategory");
});
formCategoryblogs.addEventListener("submit", (e) => {
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
          document.getElementById("btnCancleUDCategory").style.display = "none";
          alert("Thông báo", mess, "#80a710");
        } else {
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
          document.getElementById("btnCancleUDCategory").style.display = "none";
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
document
  .querySelector("#tableCategoryblogs tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
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
            document.getElementById("btnCancleUDCategory").style.display =
              "inline-block";
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
document
  .getElementById("btnCancleUDCategory")
  .addEventListener("click", function () {
    document.getElementById("idCategoryblogs").value = "";
    document.getElementById("listCategoryblogs").value = "";
    document.getElementById("btnCategoryblogs").value = "Tạo";
    this.style.display = "none";
  });
document
  .querySelector("#tableblogs tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btnUpdateblogs")) {
      const id = target.getAttribute("data-idblogs");
      fetch(`/dashboard/updateblogs/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          if (data) {
            document.getElementById("idblogs").value = data._id;
            document.getElementById("titleblogs").value = data.title;
            if (typeof quillInstances !== "undefined") {
              quillInstances[3].clipboard.dangerouslyPasteHTML(data.info || "");
            } else {
              console.error("Biến quill chưa được khởi tạo");
            }
            const dataCategoryblogs = data.category;
            const categoryblogs = document.getElementById("categoryblogs");
            Array.from(categoryblogs.options).forEach((option) => {
              option.selected = dataCategoryblogs.includes(option.value);
            });
            document.getElementById("btnblogs").value = "Cập nhật";
            document.getElementById("btnCancleBlog").style.display =
              "inline-block";
            document.getElementById("btnDeleteImgBlog").style.display =
              "inline-block";
          } else {
            console.error("Lỗi không lấy được data");
          }
        })
        .catch((error) => {
          console.error(`Lỗi kết nối ${error}`);
        });
    }
    if (target.classList.contains("btnDeleteblogs")) {
      const confirmDelete = await confirm(
        "Thông báo",
        "Bạn có chắc chắn muốn xóa blogs này",
        "#1877f2",
      );
      if (confirmDelete) {
        const id = target.getAttribute("data-idblogs");
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
    }
  });
document
  .getElementById("btnDeleteImgBlog")
  .addEventListener("click", async () => {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa hỉnh ảnh blog này",
      "#1877f2",
    );
    if (confirmDelete) {
      const id = document.getElementById("idblogs").value;
      fetch(`/dashboard/deleteImgBlog/${id}`, {
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
formBanner.addEventListener("input", () => {
  checkFormEmptiness(formBanner, "btnCancleBN");
});
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
          document.getElementById("idBN").value = "";
          document.getElementById("btnBanner").value = "Tạo";
          document.getElementById("btnDeleteImgBN").style.display = "none";
          document.getElementById("btnCancleBN").style.display = "none";
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
          document.getElementById("btnCancleBN").style.display = "none";
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
document
  .querySelector("#tableBN tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btnUpdateBN")) {
      const id = target.getAttribute("data-idBN");
      fetch(`/dashboard/updateBN/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          document.getElementById("idBN").value = data._id;
          document.getElementById("pageBanner").value = data.page;
          document.getElementById("btnDeleteImgBN").style.display =
            "inline-block";
          document.getElementById("btnCancleBN").style.display = "inline-block";
          document.getElementById("urlBN").value = data.url;
          document.getElementById("btnBanner").value = "Cập nhật";
        })
        .catch((error) => {
          alert("Lỗi", error, "red");
        });
    }
    if (target.classList.contains("btnDeleteBN")) {
      const confirmDelete = await confirm(
        "Thông báo",
        "Bạn có chắc chắn muốn xóa hình",
        "#1877f2",
      );
      if (confirmDelete) {
        const id = target.getAttribute("data-idBN");
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
    }
  });

document.getElementById("btnCancleBN").addEventListener("click", function () {
  formBanner.reset();
  document.getElementById("btnBanner").value = "Tạo";
  document.getElementById("idBN").value = "";
  document.getElementById("btnDeleteImgBN").style.display = "none";
  this.style.display = "none";
});

document
  .getElementById("btnDeleteImgBN")
  .addEventListener("click", async () => {
    const confirmDelete = await confirm(
      "Thông báo",
      "Bạn có chắc chắn muốn xóa hình banner này",
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
const formVoucher = document.getElementById("formVoucher");
formVoucher.addEventListener("submit", (e) => {
  e.preventDefault();
  const quillEditor = document.getElementsByClassName("quill-editor");
  const contentVoucher = document.getElementById("contentVoucher");
  contentVoucher.value = quillEditor;
  contentVoucher.value = quillInstances[0].getSemanticHTML();
  const dataForm = new FormData(formVoucher);
  fetch("/dashboard/addVoucher", {
    method: "POST",
    body: dataForm,
  })
    .then((res) => res.json())
    .then(({ mess, success, error }) => {
      if (success) {
        formVoucher.reset();
        if (typeof quillInstances !== "undefined") {
          quillInstances[0].setText("");
        } else {
          console.error("Biến quill không tồn tại");
        }
        alert("Thông báo", mess, "#80a710");
      } else {
        alert("Lỗi", `${mess}\n${error}`, "red");
      }
    })
    .catch((error) => {
      alert("Lỗi", error, "red");
    });
});
document
  .querySelector("#tableProblem tbody")
  .addEventListener("click", async (e) => {
    const target = e.target;
    if (target.classList.contains("btnWatchProblem")) {
      const id = target.getAttribute("data-idProblem");
      fetch(`/dashboard/getProblemById/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      })
        .then((res) => res.json())
        .then(({ data }) => {
          document.getElementById("name").value = data.name;
          document.getElementById("contentProblem").value = data.content;
        })
        .catch((error) => {
          alert("Lỗi", error, "red");
        });
    }
    if (target.classList.contains("btnDeleteProblem")) {
      const confirmDelete = await confirm(
        "Thông báo",
        "Bạn có chắc chắn xóa problem này",
        "#1877f2",
      );
      if (confirmDelete) {
        const id = target.getAttribute("data-idProblem");
        fetch(`/dashboard/deleteProblemById/${id}`, {
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
    }
  });
function checkFormEmptiness(form, btn) {
  const formData = new FormData(form);
  let hasData = false;
  for (let value of formData.values()) {
    if (value.trim != "") {
      hasData = true;
      break;
    }
  }
  if (hasData) {
    document.getElementById(btn).style.display = "inline-block";
  } else {
    document.getElementById(btn).style.display = "none";
  }
}
const tableOrder = document.querySelector("#tableOrder");
tableOrder.addEventListener("click", async (e) => {
  const target = e.target;
  if (target.classList.contains("btnEditOrder")) {
    const row = target.closest("tr");
    let invoice = row.querySelector(".invoice");
    let status = row.querySelector(".status");
    if (invoice.disabled && status.disabled) {
      invoice.disabled = false;
      status.disabled = false;
      target.innerText = "Xác nhận";
      target.style.backgroundColor = "#80a710";
    } else {
      invoice.disabled = true;
      status.disabled = true;
      target.innerText = "Chỉnh sửa";
      target.style.backgroundColor = "cadetblue";
      const id = row.getAttribute("data-idOrder");
      const valueInvoice = invoice.value;
      const valueStatus = status.value;
      fetch("/dashboard/updateOrder", {
        method: "PUT",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify({ id, valueInvoice, valueStatus }),
      })
        .then((res) => res.json())
        .then(
          ({
            mess,
            success,
            error,
            totalOrderLen,
            totalOrderHasInvoiceLen,
          }) => {
            if (success) {
              if (totalOrderHasInvoiceLen === totalOrderLen) {
                document.getElementById("totalOrderHasInvoice").style.color =
                  "#80a710";
                document.getElementById("totalOrder").style.color = "#80a710";
                document.getElementById("totalOrderHasInvoice").innerText =
                  totalOrderHasInvoiceLen + " / ";
                document.getElementById("totalOrder").innerText = totalOrderLen;
              } else {
                document.getElementById("totalOrderHasInvoice").style.color =
                  "red";
                document.getElementById("totalOrder").style.color = "red";
                document.getElementById("totalOrderHasInvoice").innerText =
                  totalOrderHasInvoiceLen + " / ";
                document.getElementById("totalOrder").innerText = totalOrderLen;
              }

              alert("Thông báo", mess, "#80a710");
            } else {
              alert("Lỗi", `${mess}\n${error}`, "red");
            }
          },
        )
        .catch((error) => {
          alert("Lỗi", error, "red");
        });
    }
  }
  if (target.classList.contains("btnDetailOrder")) {
    const row = target.closest("tr");
    const modal = row.querySelector(".modalDetailOrder");
    const display = modal.style.display === "block" ? "none" : "block";
    modal.style.display = display;
  }
  if (target.closest(".btnCloseOrder")) {
    const row = target.closest("tr");
    const modal = row.querySelector(".modalDetailOrder");
    const display = modal.style.display === "block" ? "none" : "block";
    modal.style.display = display;
  }
  const btnCaptureOrder = target.classList.contains("btnCaptureOrder");
  if (btnCaptureOrder) {
    const row = target.closest("tr");
    const invoiceArea = row.querySelector(".invoiceArea");
    try {
      target.innerText = "Đang xử lý...";
      target.disabled = true;
      invoiceArea.style.transform = "none";
      invoiceArea.style.position = "absolute";
      invoiceArea.style.top = "0px";
      invoiceArea.style.left = "0px";
      invoiceArea.style.height = "auto";
      invoiceArea.style.overflowY = "visible";
      const canvas = await html2canvas(invoiceArea, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#ffffff",
        width: invoiceArea.scrollWidth,
        height: invoiceArea.scrollHeight,
        // windowWidth:invoiceArea.scrollWidth,
        // windowHeight:invoiceArea.scrollHeight,
        // scrollX:-window.scrollX-rect.left,
        // scrollY:-window.scrollY-rect.top,
        logging: false,
      });
      invoiceArea.style.transform = "translate(-50%, -50%)";
      invoiceArea.style.position = "fixed";
      invoiceArea.style.top = "50%";
      invoiceArea.style.left = "50%";
      invoiceArea.style.height = "90%";
      invoiceArea.style.overflowY = "scroll";
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Lỗi", "Lỗi bóc tách dữ liệu ảnh", "red");
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
          target.innerText = "Đã copy";
          setTimeout(() => {
            target.innerText = "Copy đơn hàng";
            target.disabled = false;
          }, 2000);
        } catch (clipboardError) {
          alert("Lỗi", `Lỗi clipboard\n${clipboardError}`, "red");
          target.innerText = "Copy đơn hàng";
          target.disabled = false;
        }
      }, "image/png");
    } catch (error) {
      alert("Lỗi", `Lỗi: ${error}`, "red");
      target.innerText = "Copy đơn hàng";
      target.disabled = false;
    }
  }
  if (target.classList.contains("btnDownloadOrder")) {
    const row = target.closest("tr");
    const idOrder = row.getAttribute("data-idOrder");
    fetch(`/dashboard/downloadOrder/${idOrder}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/pdf")) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          let orderNumber = row.querySelector(".orderNumber").innerText;
          orderNumber = orderNumber.slice(10);
          a.href = url;
          a.download = `${orderNumber}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          alert("Thông báo", "Tải file pdf thành công", "#80a710");
        } else {
          const data = await res.json();
          alert("Lỗi", `${data.mess}\n${data.error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  }
});
let arrChooseOrder = [];
tableOrder.addEventListener("change", (e) => {
  const target = e.target;
  if (target.classList.contains("chooseOrders")) {
    const row = target.closest("tr");
    const idOrder = row.getAttribute("data-idOrder");
    if (target.checked) {
      if (!arrChooseOrder.includes(idOrder)) {
        arrChooseOrder.push(idOrder);
      }
    } else {
      arrChooseOrder = arrChooseOrder.filter((id) => id !== idOrder);
    }
    if (arrChooseOrder.length > 0) {
      document.getElementById("changeStatusOrders").style.display = "inline";
    } else {
      document.getElementById("changeStatusOrders").style.display = "none";
    }
  }
});
document
  .getElementById("changeStatusOrders")
  .addEventListener("change", function () {
    const statusChange = this.value;
    fetch("/dashboard/changeStatusOrders", {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ arrChooseOrder, statusChange }),
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
const DocSoTienVietNam = (number) => {
  const digits = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  if (number === 0) return "Không đồng";

  let strNumber = String(Math.floor(Math.abs(number)));
  // Đảm bảo độ dài chia hết cho 3 bằng cách bù số 0 vào đầu
  while (strNumber.length % 3 !== 0) {
    strNumber = "0" + strNumber;
  }

  let blocks = [];
  for (let i = 0; i < strNumber.length; i += 3) {
    blocks.push(strNumber.substr(i, 3));
  }

  let resultStrings = [];
  let totalBlocks = blocks.length;

  for (let i = 0; i < totalBlocks; i++) {
    let block = blocks[i];
    let h = Number(block[0]); // Hàng trăm
    let t = Number(block[1]); // Hàng chục
    let u = Number(block[2]); // Hàng đơn vị

    // Nếu block toàn số 0 và không phải block cuối cùng thì bỏ qua
    if (h === 0 && t === 0 && u === 0 && i !== totalBlocks - 1) {
      continue;
    }

    let blockText = "";
    // Đọc hàng trăm
    blockText += digits[h] + " trăm ";

    // Đọc hàng chục
    if (t === 0) {
      if (u !== 0) blockText += "lẻ ";
    } else if (t === 1) {
      blockText += "mười ";
    } else {
      blockText += digits[t] + " mươi ";
    }

    // Đọc hàng đơn vị
    if (t !== 0 && t !== 1 && u === 1) {
      blockText += "mốt";
    } else if (t !== 0 && u === 5) {
      blockText += "lăm";
    } else if (u !== 0) {
      blockText += digits[u];
    }

    // Cắt bỏ khoảng trắng thừa và thêm hàng đơn vị lớn (nghìn, triệu, tỷ...)
    blockText = blockText.trim();
    if (blockText !== "") {
      const unitIndex = totalBlocks - 1 - i;
      if (units[unitIndex] !== "") {
        blockText += " " + units[unitIndex];
      }
      resultStrings.push(blockText);
    }
  }

  // Ghép các chuỗi block lại thành chuỗi hoàn chỉnh
  let finalResult = resultStrings.join(" ").replace(/\s+/g, " ").trim();

  // Xử lý các trường hợp đọc "không trăm" dư thừa ở block đầu tiên nếu số nhỏ
  if (finalResult.startsWith("không trăm mươi")) {
    finalResult = finalResult.replace("không trăm mươi", "");
  } else if (finalResult.startsWith("không trăm lẻ")) {
    finalResult = finalResult.replace("không trăm lẻ", "");
  } else if (finalResult.startsWith("không trăm")) {
    finalResult = finalResult.replace("không trăm", "");
  }

  finalResult = finalResult.trim();
  // Viết hoa chữ cái đầu tiên và thêm chữ "đồng" chuẩn hóa đơn kế toán
  return finalResult.charAt(0).toUpperCase() + finalResult.slice(1) + " đồng";
};
document.addEventListener("DOMContentLoaded", () => {
  const totalOrderHasInvoiceLen = document.getElementById(
    "totalOrderHasInvoice",
  ).innerText;
  const totalOrderLen = document.getElementById("totalOrder").innerText;
  if (Number(totalOrderHasInvoiceLen.slice(0, 1)) === Number(totalOrderLen)) {
    document.getElementById("totalOrderHasInvoice").style.color = "#80a710";
    document.getElementById("totalOrder").style.color = "#80a710";
  }
});
document.getElementById("btnOrderMng").addEventListener("click", function () {
  const generatedOrder = this.querySelector("span");
  generatedOrder.style.display = "none";
});
document.getElementById("tableImportDevice").addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("btnImportDevice")) {
    const row = target.closest("tr");
    const importQuantityActual = row.querySelector(
      ".importQuantityActual",
    ).value;
    const costActual = row.querySelector(".costActual").value;
    const idDeviceImport = row.getAttribute("data-idDeviceImport");
    fetch("/dashboard/importDevice", {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        idDeviceImport,
        importQuantityActual,
        costActual,
      }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          row.querySelector(".importQuantity").value = "";
          row.querySelector(".cost").value = "";
          alert("Thông báo", mess, "#80a710");
        } else {
          alert("Lỗi", `${mess}\n${error}`, "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  }
  if (target.classList.contains("btnCancleDevice")) {
    const row = target.closest("tr");
    row.querySelector(".importQuantity").value = "";
    row.querySelector(".cost").value = "";
  }
});
document.getElementById("btnReloadOrder").addEventListener("click", () => {
  fetch("/dashboard/reloadOrder", {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ data }) => {
      document.getElementById("generatedOrder").style.display = "none";
      document.querySelector("#tableOrder tbody").innerHTML = "";
      document.querySelector("#tableOrder tbody").innerHTML = data
        .map(
          (order) => `
    <tr data-idOrder="${order._id}">
      <td>${order.orderNumber}</td>
      <td>${order.nameCompany === "--" ? order.buyer : order.nameCompany}</td>
      <td>
        ${(order.products.reduce((total, p) => total + p.quantity * p.price, 0) - order.voucherDiscount).toLocaleString("vi-VN")}đ
      </td>
      <td>
        <input type="text" name="invoice" class="invoice" value="${order.invoice}" disabled>
      </td>
      <td>
        <select name="status" class="status" disabled>
          <option value="Đang xử lý" ${order.status === "Đang xử lý" ? "selected" : ""}>Đang xử lý</option>
          <option value="Đang vận chuyển" ${order.status === "Đang vận chuyển" ? "selected" : ""}>Đang vận chuyển</option>
          <option value="Đã nhận hàng" ${order.status === "Đã nhận hàng" ? "selected" : ""}>Đã nhận hàng</option>
          <option value="Hủy" ${order.status === "Hủy" ? "selected" : ""}>Hủy</option>
        </select>
      </td>
      <td>
        <button type="button" class="btnEditOrder">Chỉnh sửa</button>
        <button type="button" class="btnDetailOrder">Chi tiết</button>
        <div class="modalDetailOrder">
          <button type="button" class="btnCloseOrder"><i class="fa-solid fa-xmark"></i></button>
          <button type="button" class="btnCaptureOrder">Copy đơn hàng</button>
          <button type="button" class="btnDownloadOrder">Tải file pdf</button>
        <div class="detailOrder invoiceArea">
          <div class="headerOrder">
            <img src="/img/logo_imzai_1.webp" alt="logo">
          <div>
            <p>CÔNG TY TNHH CÔNG NGHỆ IMZEN</p>
            <p>MST: 0123456789</p>
            <p>ĐỊA CHỈ: 236 LÊ THỊ NGAY, XÃ VĨNH LỘC, THÀNH PHỐ HỒ CHÍ MINH, VIỆT NAM</p>
            <p>STK 0123456789 tại NGÂN HÀNG QUỐC TẾ (VIB)</p>
          </div>
          </div>
          <div class="bodyOrder">
            <div class="titleOrder">
            <h2>Đơn hàng</h2>
            <p>Thời gian: ${new Date(order.createAt).toLocaleDateString("vi-VN")}</p>
            <p class="orderNumber">Số phiếu: ${order.orderNumber}</p>
          </div>
          <div>
            <p>Người mua: ${order.buyer}</p>
            ${
              order.nameCompany === "--" &&
              order.addressCompany === "--" &&
              order.mstCompany === "--"
                ? `
            <p>Tên người nhận: ${order.fullnameDelivery}</p>
            <p>Số điện thoại: ${order.telDelivery}</p>
            <p>Địa chỉ nhận hàng: ${order.addressDelivery}</p>  
            `
                : `
            <p>Tên công ty: ${order.nameCompany}</p>
            <p>Địa chỉ công ty: ${order.addressCompany}</p>
            <p>Mã số thuế: ${order.mstCompany}</p>
            `
            }
            <p>Diễn giải: VAT${order.mailInvoice === "--" ? ", " + order.mailClient : ", " + order.mailInvoice}</p>
            <p>Loại tiền: VNĐ</p>
          </div>
          <table>
            <tr>
              <th>STT</th>
              <th>Tên hàng</th>
              <th>Đơn vị</th>
              <th>Số lượng</th>
              <th>Đơn giá (bao gồm VAT)</th>
              <th>Thành tiền</th>
            </tr>
            ${order.products
              .map(
                (p, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${p.productName}</td>
                <td>Cái</td>
                <td>${p.quantity}</td>
                <td>${p.price.toLocaleString("vi-VN")}đ</td>
                <td>${(p.quantity * p.price).toLocaleString("vi-VN")}đ</td>
              </tr>
            `,
              )
              .join("")}
            </table>
            <div class="divDiscountAndTotal">
              <div>
                <p><b>Chiết khấu:</b></p>
                <p><b>Tổng tiền:</b></p>
              </div>
              <div>
                <p>${order.voucherDiscount.toLocaleString("vi-VN")}đ</p>
                <p>
                  ${(order.products.reduce((total, p) => total + p.quantity * p.price, 0) - order.voucherDiscount).toLocaleString("vi-VN")}đ
                </p>
              </div>
              </div>
                <p>Số tiền bằng chữ: ${DocSoTienVietNam(order.products.reduce((total, p) => total + p.quantity * p.price, 0) - order.voucherDiscount)}</p>
                <p>Hình thức thanh toán: ${order.paymentMethod}</p>
                <div class="divSign">
                  <div>
                    <p>Người mua hàng</p>
                    <p>(Ký và ghi rõ họ tên)</p>
                  </div>
                  <div>
                    <p>Người bán hàng</p>
                    <p>(Ký và ghi rõ họ tên)</p>
                  </div>
                </div>
              </div>
            </div>
                    </div>
                  </td>
                  <td class="tdChooseOrders">
                    <input type="checkbox" name="chooseOrders" class="chooseOrders">
                  </td>
                </tr>
    `,
        )
        .join("");
    });
});
document.getElementById("formJob").addEventListener("submit", (e) => {
  e.preventDefault();
  const token = getCookie("accessToken");
  const decodedUser = jwtDecode(token);
  const idAdmin = decodedUser.id;
  const titleJob = document.getElementById("titleJob").value;
  const levelJob = document.getElementById("levelJob").value;
  const startTimeJob = document.getElementById("startTimeJob").value;
  const deadlineJob = document.getElementById("deadlineJob").value;
  const idJob = document.getElementById("idJob").value;
  if (idJob) {
    fetch("/dashboard/updateJob", {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        idJob,
        titleJob,
        levelJob,
        startTimeJob,
        deadlineJob,
      }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          document.getElementById("idJob").value = "";
          document.getElementById("titleJob").value = "";
          document.getElementById("levelJob").value = "Gấp";
          document.getElementById("startTimeJob").value = "";
          document.getElementById("deadlineJob").value = "";
          document.getElementById("btnJob").value = "Thêm công việc";
          alert("Thông báo", mess, "#80a710");
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
  } else {
    fetch("/dashboard/addJob", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({
        idAdmin,
        titleJob,
        levelJob,
        startTimeJob,
        deadlineJob,
      }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          alert("Thông báo", mess, "#80a710");
          document.getElementById("titleJob").value = "";
          document.getElementById("levelJob").value = "Gấp";
          document.getElementById("startTimeJob").value = "";
          document.getElementById("deadlineJob").value = "";
        } else {
          if (!error) {
            alert("Lỗi", mess, "red");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const levelColor = {
    Gấp: "red",
    "Ưu tiên": "#ffcc00",
    "Thong thả": "#80a710",
    "Đã hoàn thành": "#1877f2",
  };
  document.querySelectorAll(".levelJob").forEach((td) => {
    const levelJob = td.innerHTML.trim();
    if (levelColor[levelJob]) {
      td.style.color = levelColor[levelJob];
      td.style.fontWeight = "bold";
    }
    if (levelJob === "Đã hoàn thành") {
      const row = td.closest("tr");
      row.style.backgroundColor = "gainsboro";
      row.style.color = "#bbb";
      row.querySelector(".btnAssignJob").style.display = "none";
      row.querySelector(".btnCompleteJob").style.display = "none";
      row.querySelector(".btnUpdateJob").style.display = "none";
    }
  });
});
let mindInstances = [];
function runMap() {
  const maps = document.querySelectorAll(".map");
  if (maps.length === 0) {
    return;
  }
  maps.forEach((map) => {
    const customTitle = map.getAttribute("data-title");
    const mind = new MindElixir({
      el: map,
    });
    mindInstances.push({
      mapId: customTitle,
      instance: mind,
      isInitialized: false,
    });
  });
}
runMap();
document.querySelector("#tableJob tbody").addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("btnWatchJob")) {
    const row = target.closest("tr");
    const mindmap = row.querySelector(".divMindmap");
    const displayMindmap = mindmap.style.display === "block" ? "none" : "block";
    mindmap.style.display = displayMindmap;
    const map = row.querySelector(".map");
    const mapId = map.getAttribute("data-title");
    const rawData = map.getAttribute("data-mindmap");
    let mindMapSave = "";
    if (rawData && rawData.trim !== "" && rawData !== "[object Object]") {
      try {
        mindMapSave = JSON.parse(rawData);
      } catch (error) {
        console.error(`Error: ${error}`);
        mindMapSave = null;
      }
    }
    const data = MindElixir.new(mapId);
    if (displayMindmap === "block") {
      const currentMap = mindInstances.find((item) => item.mapId === mapId);
      if (currentMap && !currentMap.isInitialized) {
        setTimeout(() => {
          currentMap.instance.init(mindMapSave || data);
          currentMap.isInitialized = true;
        }, 100);
      }
    }
  }
  if (target.classList.contains("btnCloseMindmap")) {
    const row = target.closest("tr");
    const mindmap = row.querySelector(".divMindmap");
    const displayMindmap = mindmap.style.display === "block" ? "none" : "block";
    mindmap.style.display = displayMindmap;
  }
  if (target.classList.contains("btnSaveMindmap")) {
    target.disabled = true;
    const payload = mindInstances.map((item) => ({
      mapId: item.mapId,
      mapStructure: item.instance.getData(),
    }));
    fetch("/dashboard/saveMindmap", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ payload }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          alert("Thông báo", mess, "#80a710");
        } else {
          if (!error) {
            alert("Lỗi", mess, "red");
          } else {
            alert("Lỗi", `${mess}\n${error}`, "red");
          }
        }
      })
      .finally(() => {
        target.disabled = false;
      });
  }
  if (target.classList.contains("btnAssignJob")) {
    const row = target.closest("tr");
    const divAssignAdmin = row.querySelector(".divAssignAdmin");
    const displayAssignAdmin =
      divAssignAdmin.style.display === "block" ? "none" : "block";
    divAssignAdmin.style.display = displayAssignAdmin;
  }
  if (target.classList.contains("btnConfirmAssignAdmin")) {
    const row = target.closest("tr");
    let idAssignAdmin = "";
    document.querySelectorAll(".radioAssignAdmin").forEach((radio) => {
      if (radio.checked) {
        idAssignAdmin = radio.value;
      }
    });
    const idJob = row.getAttribute("data-idJob");
    fetch("/dashboard/assignAdmin", {
      method: "PUT",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body: JSON.stringify({ idJob, idAssignAdmin }),
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          alert("Thông báo", mess, "#80a710");
        } else {
          if (error) {
            alert("Lỗi", `${mess}\n${error}`, "red");
          } else {
            alert("Lỗi", mess, "red");
          }
        }
      });
  }
  if (target.classList.contains("btnCloseAssignAdmin")) {
    const row = target.closest("tr");
    const divAssignAdmin = row.querySelector(".divAssignAdmin");
    const displayAssignAdmin =
      divAssignAdmin.style.display === "block" ? "none" : "block";
    divAssignAdmin.style.display = displayAssignAdmin;
  }
  if (target.classList.contains("btnCompleteJob")) {
    const row = target.closest("tr");
    const idJob = row.getAttribute("data-idJob");
    fetch(`/dashboard/updateStatusJob/${idJob}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          alert("Thông báo", mess, "#80a710");
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
  }
  if (target.classList.contains("btnUpdateJob")) {
    const row = target.closest("tr");
    const idJob = row.getAttribute("data-idJob");
    fetch(`/dashboard/getUpdateJob/${idJob}`, {
      method: "GET",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
      .then((res) => res.json())
      .then(({ data }) => {
        if (data) {
          document.getElementById("idJob").value = data._id;
          document.getElementById("titleJob").value = data.title;
          document.getElementById("levelJob").value = data.level;
          const rawStartTime = data.startTime;
          const startTimeObj = new Date(rawStartTime);
          const startTimeOffset = startTimeObj.getTimezoneOffset() * 60000;
          const startTimeLocalIsoTime = new Date(
            startTimeObj.getTime() - startTimeOffset,
          ).toISOString();
          const startTimeFormatted = startTimeLocalIsoTime.slice(0, 16);
          document.getElementById("startTimeJob").value = startTimeFormatted;
          const rawDeadline = data.deadline;
          const deadlineObj = new Date(rawDeadline);
          const deadlineOffset = deadlineObj.getTimezoneOffset() * 60000;
          const deadlineLocalIsoTime = new Date(
            deadlineObj.getTime() - deadlineOffset,
          ).toISOString();
          const deadlineFormatted = deadlineLocalIsoTime.slice(0, 16);
          document.getElementById("deadlineJob").value = deadlineFormatted;
          document.getElementById("btnJob").value = "Cập nhật";
        } else {
          alert("Lỗi", "Không lấy được data job để cập nhật", "red");
        }
      })
      .catch((error) => {
        alert("Lỗi", error, "red");
      });
  }
  if (target.classList.contains("btnDeleteJob")) {
    confirm("Thông báo", "Bạn có chắc chắn xóa công việc này?", "#1877f2").then(
      (result) => {
        if (result === true) {
          const row = target.closest("tr");
          const idJob = row.getAttribute("data-idJob");
          fetch(`/dashboard/deleteJob/${idJob}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json;charset=UTF-8" },
          })
            .then((res) => res.json())
            .then(({ mess, success, error }) => {
              if (success) {
                alert("Thông báo", mess, "#80a710");
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
        }
      },
    );
  }
});
document.getElementById("btnWorkMng").addEventListener("click", function () {
  const generatedJob = this.querySelector("#generatedJob");
  if (generatedJob.style.display === "inline-block") {
    generatedJob.style.display = "none";
  }
  const idAd = document.getElementById("idAd").innerText.slice(3);
  document.querySelectorAll("#tableJob tbody tr[data-idJob]").forEach((tr) => {
    tr.style.display = "none";
    const arrayIdAdminAssign = tr.querySelector(".arrayIdAdminAssign");
    if (!arrayIdAdminAssign) {
      return;
    }
    const rawData = arrayIdAdminAssign.getAttribute("data-stringId");
    let idAdAssign = [];
    if (rawData) {
      idAdAssign = JSON.parse(rawData);
    }
    if (idAdAssign.includes(idAd)) {
      tr.style.display = "table-row";
    }
  });
});
document.getElementById("btnReloadJob").addEventListener("click", () => {
  const idAd = document.getElementById("idAd").innerText.slice(3);
  fetch(`/dashboard/reloadJob/${idAd}`, {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
  })
    .then((res) => res.json())
    .then(({ jobAssign, admins }) => {
      if (jobAssign && admins) {
        document.getElementById("generatedJob").style.display = "none";
        document.querySelector("#tableJob tbody").innerHTML = "";
        const listRowAdmins = admins
          .map(
            (admin) => `
        <tr>
          <td>${admin.fullname}</td>
          <td>${admin.role}</td>
          <td>${admin.email}</td>
          <td>
            <input type="radio" name="assignAdmin" class="radioAssignAdmin" value="${admin._id}">
          </td>
        </tr>
        `,
          )
          .join("");
        document.querySelector("#tableJob tbody").innerHTML = jobAssign
          .map(
            (job) =>
              `
        <tr data-idJob="${job._id}">
          <td class="levelJob">${job.level}</td>
          <td class="titleJob">${job.title}</td>
          <td>${new Date(job.startTime).toLocaleString("vi-VN")}</td>
          <td>${new Date(job.deadline).toLocaleString("vi-VN")}</td>
          <td>
            ${job.assigned[1] ? job.assigned[1].name : "--"}
            <div class="arrayIdAdminAssign" data-stringId='${JSON.stringify(job.assigned.map((item) => item.id))}'></div>
          </td>
          <td>
            <button type="button" class="btnWatchJob">Xem</button>
            <button type="button" class="btnAssignJob">Giao việc</button>
            <button type="button" class="btnCompleteJob">Hoàn thành</button>
            <button type="button" class="btnUpdateJob">Cập nhật</button>
            <button type="button" class="btnDeleteJob">Xóa</button>
            <div class="divMindmap">
              <div class="mindmap">
                <div class="tool">
                  <span><kbd>Enter</kbd>: Chèn nút cùng cấp <kbd>Tab</kbd>: Chèn nút con <kbd>F1</kbd>: Chuyển đến nút trung tâm <kbd>F2</kbd>: Chỉnh nội dung nút <kbd>Delete</kbd>: Xóa nút <kbd>Ctrl+C</kbd>: Copy <kbd>Ctrl+V</kbd>: Paste <kbd>Ctrl+Z</kbd>: Quay lại <kbd>Chuột trái</kbd>: Tô chọn nhiều node <kbd>Chuột phải</kbd>: Kéo màn hình</span>
                  <button type="button" class="btnSaveMindmap">Lưu</button>
                  <button type="button" class="btnCloseMindmap">Đóng</button>
                </div>
                <div class="map" data-title="${job.title}" data-mindmap='${JSON.stringify(job.mindmapStructure)}'></div>
              </div>
            </div>
            <div class="divAssignAdmin">
              <div class="assignAdmin">
                <h2>Chọn thành viên giao việc</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Họ và tên</th>
                      <th>Vị trí</th>
                      <th>Email</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${listRowAdmins}
                  </tbody>
                </table>
                  <div class="divBtnAssignAdmin">
                    <button type="button" class="btnConfirmAssignAdmin">Xác nhận</button>
                    <button type="button" class="btnCloseAssignAdmin">Đóng</button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        `,
          )
          .join("");
        const levelJobs = document.querySelectorAll(".levelJob");
        levelJobs.forEach((levelJob) => {
          levelJob.style.fontWeight = "bold";
          const levelTitle = levelJob.innerText;
          if (levelTitle === "Gấp") {
            levelJob.style.color = "red";
          } else if (levelTitle === "Ưu tiên") {
            levelJob.style.color = "#ffcc00";
          } else if (levelTitle === "Thong thả") {
            levelJob.style.color = "#80a710";
          } else if (levelTitle === "Đã hoàn thành") {
            levelJob.style.color = "#1877f2";
          }
          if (levelTitle === "Đã hoàn thành") {
            const row = levelJob.closest("tr");
            row.style.backgroundColor = "gainsboro";
            row.style.color = "#bbb";
            row.querySelector(".btnAssignJob").style.display = "none";
            row.querySelector(".btnCompleteJob").style.display = "none";
            row.querySelector(".btnUpdateJob").style.display = "none";
          }
        });
        mindInstances = [];
        runMap();
      }
    });
});
const PUBLIC_VAPID_KEY =
  "BMOeeNoHZ5ljM0pQWz6Swn8T0KFou36_32QO962yDyISqG5mugGPp95zBJHKd74VZU_xASkI2F4lIcyfcx4l-4I";
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
async function registerPushNotification(idAdmin) {
  if ((!"serviceWorker") in navigator || (!"PushManager") in window) {
    console.warn("Trình duyệt không hỗ trợ web push");
    return;
  }
  if (Notification.permission === "denied") {
    console.error(
      "Quyền thông báo đang bị chặn. Hãy bật lại quyền ở biểu tượng ổ khóa trên thanh địa chỉ",
    );
    return;
  }
  try {
    const register = await navigator.serviceWorker.register("/sw.js");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Người dùng từ chối cấp quyền thông báo");
      return;
    }
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });
    await fetch("/dashboard/subscribe", {
      method: "POST",
      body: JSON.stringify({ subscription, idAdmin }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(({ mess, success, error }) => {
        if (success) {
          alert("Thông báo", mess, "#80a710");
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
    console.log("Kết nối web push thành công");
  } catch (error) {
    console.error("Lỗi kết nối web push", error);
  }
}
