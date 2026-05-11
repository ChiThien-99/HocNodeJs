document.getElementById("btnTransUpper").addEventListener("click", () => {
  try {
    let areaTextLower = document.getElementById("areaTextLower").value;
    let areaTextUpper = document.getElementById("areaTextUpper");
    areaTextUpper.value = areaTextLower.toUpperCase();
    alert("Đã chuyển thành công");
  } catch (error) {
    console.error(`Quá trình chuyển bị lỗi: ${error}`);
  }
});
document
  .getElementById("btnDownloadFileUpper")
  .addEventListener("click", () => {
    const body = JSON.stringify({
      data: document.getElementById("areaTextUpper").value,
    });
    console.log(body);
    fetch("/file/createFile", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      body,
    })
      .then((res) => res.json())
      .then(({ mess, status, err }) => {
        if (status) {
          window.location.href = "/file/download";
        } else {
          console.error(`${mess}: ${err}`);
        }
      });
  });
