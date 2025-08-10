let username = "匿名";

const overlay = document.getElementById("overlay");
const nameModal = document.getElementById("nameModal");
const protectModal = document.getElementById("protectModal");

// 进入：关闭遮罩
document.getElementById("submitName").onclick = () => {
  const input = document.getElementById("username").value.trim();
  if (input) username = input;
  overlay.style.display = "none";
};

// 呼叫按钮：原逻辑
document.getElementById("callButton").onclick = () => {
  fetch("/api/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username }),
  }).catch(() => {});
};

// 打开“保护地球”确认弹窗
document.getElementById("protectEntry").onclick = () => {
  nameModal.classList.add("hidden");
  protectModal.classList.remove("hidden");
};

// 取消：回到第一个弹窗
document.getElementById("protectCancel").onclick = () => {
  protectModal.classList.add("hidden");
  nameModal.classList.remove("hidden");
};

// 确定：后台+1，界面保持在第二个弹窗，完全无反馈
document.getElementById("protectConfirm").onclick = () => {
  const input = document.getElementById("username").value.trim();
  if (input) username = input;

  fetch("/api/protect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username }),
  }).catch(() => {});
  // 不做任何 UI 变化（不关闭弹窗、不弹提示）
};

async function refreshTotals() {
  try {
    const r = await fetch('/api/totals');
    if (!r.ok) return;
    const { call, protect } = await r.json();
    const el = document.getElementById('totals');
    el.textContent = `呼叫：${call} 次   |   保卫：${protect} 次`;
  } catch (_) {}
}
document.getElementById('totals').addEventListener('click', refreshTotals);
refreshTotals();
setInterval(refreshTotals, 10000); // 每 10 秒刷新一次
