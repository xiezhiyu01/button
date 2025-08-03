// script.js
let username = "匿名";

document.getElementById('submitName').onclick = () => {
  const input = document.getElementById('username').value.trim();
  if (input.length > 0) {
    username = input;
  }
  document.getElementById('overlay').style.display = 'none';
  document.querySelector('.container').style.display = 'block';
};

document.getElementById('callButton').onclick = () => {
  fetch('https://button-green-one.vercel.app/api/call', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: username })
  }).catch(() => {
    // 没有反馈（保持神秘）
  });
};
