let username = "匿名";

const overlay = document.getElementById("overlay");
const nameModal = document.getElementById("nameModal");
const protectModal = document.getElementById("protectModal");

// 进入按钮：关闭弹窗，进入按钮界面（你已有）
document.getElementById("submitName").onclick = () => {
  const input = document.getElementById("username").value.trim();
  if (input.length > 0) username = input;
  overlay.style.display = "none";
};

// 呼叫按钮：原逻辑（你已有）
document.getElementById("callButton").onclick = () => {
  fetch("/api/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username }),
  }).catch(() => {});
};

// ---------- 新增：保卫地球分支 ----------

// 打开“保卫地球”确认弹窗
document.getElementById("protectEntry").onclick = () => {
  nameModal.classList.add("hidden");
  protectModal.classList.remove("hidden");
};

// 取消：返回第一个弹窗
document.getElementById("protectCancel").onclick = () => {
  protectModal.classList.add("hidden");
  nameModal.classList.remove("hidden");
};

// 确定：后台计数 +1（protect），界面不变（不提示）
document.getElementById("protectConfirm").onclick = () => {
  const input = document.getElementById("username").value.trim();
  if (input.length > 0) username = input;

  fetch("/api/protect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username }),
  }).catch(() => {});

  // 回到第一个弹窗（不提示，不改变外观）
  protectModal.classList.add("hidden");
  nameModal.classList.remove("hidden");
};
