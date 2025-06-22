// Pull inputs from the form for prompt generation
const form = document.getElementById("prompt-form");
const eventName = document.getElementById("eventName");
const eventFormat = document.getElementById("eventFormat");
const eventDate = document.getElementById("eventDate");
const eventTime = document.getElementById("eventTime");
const topic = document.getElementById("topic");
const speakerName = document.getElementById("speakerName");
const speakerCompany = document.getElementById("speakerCompany");
const targetAudience = document.getElementById("targetAudience");
const landingPage = document.getElementById("landingPage");
const promptDisplay = document.getElementById("aiPrompt");
const copyPromptButton = document.getElementById("copy-prompt-button");
const errorMsg = document.getElementById("errorMsg");

let timerId;

function typeWriter(txt) {
  let i = 0;
  const speed = 10;
  promptDisplay.innerHTML = "";
  function type() {
    if (i < txt.length) {
      promptDisplay.innerHTML += txt.charAt(i);
      i++;
      timerId = setTimeout(type, speed);
    } else {
      clearTimeout(timerId);
    }
  }
  type();
}

function handleSubmit(event) {
  event.preventDefault();
  clearTimeout(timerId);
  
  // Ensure all fields are filled
  if (
    eventName.value === "" ||
    eventFormat.value === "" ||
    eventDate.value === "" ||
    eventTime.value === "" ||
    topic.value === "" ||
    speakerName.value === "" ||
    speakerCompany.value === "" ||
    targetAudience.value === "" ||
    landingPage.value === ""
  ) {
    errorMsg.classList.remove("hidden");
    return;
  }

  // Build the LinkedIn post prompt
  const prompt = `You are a B2B Marketer promoting an upcoming ${eventFormat.value} B2B event on LinkedIn. The event is called ${eventName.value} happening on ${eventDate.value} at ${eventTime.value}. The speakers are ${speakerName.value} from ${speakerCompany.value}. The target audience are ${targetAudience.value}, and the session covers ${topic.value}. People can register to the event on this page ${landingPage.value}. Create a LinkedIn post that is engaging, encourages sign-ups, and highlights what attendees will gain. Tone of voice is approachable and vibrant. Include a call-to-action and mention that it's free. Keep it under 150 words. Give me multiple versions: one for the initial announcement, one reminder a week before the event, and a final reminder one day before the event. Avoid using bullet points and limit the use of emojis.`;

  copyPromptButton.disabled = false;
  copyPromptButton.classList.remove("copy-disabled");
  copyPromptButton.classList.add("enabled", "hover", "active");
  errorMsg.classList.add("hidden");

  typeWriter(prompt);
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

form.addEventListener("submit", handleSubmit);
copyPromptButton.addEventListener("click", copyPrompt);
