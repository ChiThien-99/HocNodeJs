let alertTimeOut=null;
export const alert = (heading, content, backgroundColor) => {
  const alert = document.getElementById("alert");
  const headingAlert = document.getElementById("headingAlert");
  const contentAlert = document.getElementById("contentAlert");
  if (alertTimeOut) {
    clearTimeout(alertTimeOut);
    alert.style.transform = "translate(-50%,-150%)";
    alert.offsetHeight;
  }
  alert.style.backgroundColor = backgroundColor;
  headingAlert.innerText = `${heading}:`;
  contentAlert.innerText = content;
  alert.style.transform = "translate(-50%,0)";
  alertTimeOut=setTimeout(() => {
    alert.style.transform = "translate(-50%,-150%)";
    alertTimeOut=null;
  }, 5000);
};
export const confirm = (heading, content, backgroundColor) => {
  return new Promise((resolve) => {
    const confirm = document.getElementById("confirm");
    const headingConfirm = document.getElementById("headingConfirm");
    const contentConfirm = document.getElementById("contentConfirm");
    confirm.style.transform = "translate(-50%,0)";
    confirm.style.backgroundColor = backgroundColor;
    headingConfirm.innerText = `${heading}:`;
    contentConfirm.innerText = content;
    document.getElementById("btnConfirm").addEventListener("click", () => {
      confirm.style.transform = "translate(-50%,-150%)";
      resolve(true);
    });
    document.getElementById("btnDeny").addEventListener("click", () => {
      confirm.style.transform = "translate(-50%,-150%)";
      resolve(false);
    });
  });
};
