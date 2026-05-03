export const alert = (heading, content, backgroundColor) => {
  const alert = document.getElementById("alert");
  const headingAlert = document.getElementById("headingAlert");
  const contentAlert = document.getElementById("contentAlert");
  alert.style.transform = "translate(-50%,0)";
  alert.style.backgroundColor = backgroundColor;
  headingAlert.innerText = `${heading}:`;
  contentAlert.innerText = content;
  setTimeout(() => {
    alert.style.transform = "translate(-50%,-150%)";
  }, 5000);
};
