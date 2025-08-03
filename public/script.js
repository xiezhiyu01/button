let username = "匿名";

document.getElementById("submitName").onclick = () => {
  const input = document.getElementById("username").value.trim();
  if (input.length > 0) {
    username = input;
  }
  document.getElementById("overlay").style.display = "none";
};

document.getElementById("callButton").onclick = () => {
  fetch("/api/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username }),
  }).catch(() => {});
};
