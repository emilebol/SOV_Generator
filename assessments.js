
const container = document.getElementById("container");
const form = document.getElementById("prompt-form");
const promptDisplay = document.getElementById("aiPrompt");

let config = null;

function fillTemplate(template, values) {
  return template.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] || "");
}

function typeWriter(txt) {
  let i = 0;
  const speed = 10;
  promptDisplay.innerHTML = "";
  function type() {
    if (i < txt.length) {
      promptDisplay.innerHTML += txt.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function buildForm() {
  document.title = config.title;

  const promptDisplay = document.getElementById("aiPrompt");
  if (promptDisplay) {
    promptDisplay.innerHTML = "";
  }

  const h1 = document.createElement("h1");
  h1.innerText = config.title;
  const p = document.createElement("p");
  p.innerText = config.description;

  const oldH1 = container.querySelector("h1");
  const oldDesc = Array.from(container.children).find(
    el => el.tagName === "P" && !el.id
  );

  if (oldH1) oldH1.remove();
  if (oldDesc) oldDesc.remove();

  const existingHideBtn = container.querySelector(".hide-button");
  if (existingHideBtn) existingHideBtn.remove();

  // Add a "Hide" button at the top of the container
  const hideButton = document.createElement("button");
  hideButton.innerText = "Hide";
  hideButton.className = "tab-button hide-button";
  hideButton.style.marginBottom = "20px";
  hideButton.onclick = () => {
    // Trigger fade-out
    container.classList.remove("fade-in");
    container.classList.add("fade-out");

    // Wait for opacity animation, then hide
    setTimeout(() => {
      container.style.display = "none";
    }, 300);

    // Scroll back to tabs
    document.querySelector(".tab-groups").scrollIntoView({ behavior: "smooth" });

    // Remove active tab highlight
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
  };

  // Insert it just before the form
  container.prepend(hideButton);

  container.prepend(p);
  container.prepend(h1);

  form.innerHTML = "";
  config.fields.forEach(field => {
    const label = document.createElement("label");
    label.innerText = `${field.label}: `;
    const textarea = document.createElement("textarea");
    textarea.id = field.id;
    textarea.placeholder = field.placeholder;
    textarea.className = "small-textarea bg-light";
    form.appendChild(label);
    form.appendChild(document.createElement("br"));
    form.appendChild(textarea);
    form.appendChild(document.createElement("br"));
  });

  const error = document.createElement("p");
  error.id = "errorMsg";
  error.className = "hidden error-msg bg-danger border border-1 border-dark";
  error.textContent = config.errorText;
  form.appendChild(error);

  const generateButton = document.createElement("button");
  generateButton.type = "submit";
  generateButton.innerText = config.buttonText;
  generateButton.className = "hover active";
  form.appendChild(generateButton);

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.innerText = config.copyButtonText;
  copyButton.id = "copy-prompt-button";
  copyButton.className = "copy-disabled";
  copyButton.disabled = true;
  form.appendChild(copyButton);
}

function handleSubmit(e) {
  e.preventDefault();
  const values = {};
  let valid = true;

  config.fields.forEach(field => {
    const val = document.getElementById(field.id).value.trim();
    values[field.id] = val;
    if (!val) valid = false;
  });

  const errorMsg = document.getElementById("errorMsg");
  if (!valid) {
    errorMsg.classList.remove("hidden");
    return;
  }

  errorMsg.classList.add("hidden");

  const result = fillTemplate(config.template, values);
  promptDisplay.innerText = "";
  typeWriter(result);

  const copyButton = document.getElementById("copy-prompt-button");
  copyButton.disabled = false;
  copyButton.classList.remove("copy-disabled");
  copyButton.classList.add("enabled", "hover", "active");
}

function copyPrompt() {
  const copyText = document.getElementById("aiPrompt");
  const range = document.createRange();
  range.selectNode(copyText);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  alert("Copied the prompt");
  window.open("http://chat.openai.com", "_blank");
}

fetch("prompts.json")
  .then(res => res.json())
  .then(data => {
    // config = data.event;
    // buildForm();
    document.getElementById("prompt-form").addEventListener("submit", handleSubmit);
    document.addEventListener("click", function (e) {
      if (e.target && e.target.id === "copy-prompt-button") copyPrompt();
    });
  });



function loadPrompt(type) {
  fetch("prompts.json")
    .then(res => res.json())
    .then(data => {
      config = data[type]; // dynamically load based on tab
      buildForm();
      // Show the hidden container
      const containerEl = document.getElementById("container");
      container.classList.remove("fade-out");
      container.style.display = "block";

      // 👇 Force browser to recognize the change before transitioning
      void container.offsetWidth;

      container.classList.add("fade-in");

      // Scroll to the container smoothly
      containerEl.scrollIntoView({ behavior: "smooth" });
      
    });
}

// On tab click
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("tab-button")) {
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    const promptType = e.target.getAttribute("data-prompt");
    loadPrompt(promptType);
  }
});