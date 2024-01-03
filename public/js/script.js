const chooseBtn = document.querySelector("#choose-btn");
const fileInput = document.querySelector("#file-input");
const outputSection = document.querySelector(".output-section");
const copyBtn = document.querySelector("#copy-btn");
const linkText = document.querySelector("#link-text");
const sendBtn = document.querySelector("#send-btn");
const senderInput = document.querySelector("#sender-email-input");
const receiverInput = document.querySelector("#receiver-email-input");
const emailForm = document.querySelector("#email-form");

chooseBtn.onclick = () => {
  fileInput.click();
};

fileInput.onchange = (e) => {
  const file = e.target.files[0];

  const formData = new FormData();
  formData.append("file", file);

  fetch("api/file/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const shareLink = data.shareLink;
      function copyLink() {
        linkText.select();
        navigator.clipboard.writeText(linkText.value);
      }

      linkText.value = shareLink;
      copyBtn.addEventListener("click", copyLink);

      outputSection.classList.add("active");
    });
}

emailForm.addEventListener("submit", (e) => {

  e.preventDefault();

  fetch('/api/file/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uuid: linkText.value.split('/').splice(-1, 1)[0],
      emailTo: receiverInput.value,
      emailFrom: senderInput.value
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(data.message);
      }
    }).catch(err => {
      console.log(err);
      alert("Unable to send email right now");
    });
}); 