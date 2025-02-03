const prompt = document.querySelector("#prompt");
const submitBtn = document.querySelector("#submit");
const chatContainer = document.querySelector(".chat-container");
const imageBtn = document.querySelector("#image");
const image = document.querySelector("#image img");
const imageInput = document.querySelector("#image input");

// Replace with your valid API key

};

// Function to generate AI response
async function generateResponse(aiChatBox) {
  const text = aiChatBox.querySelector(".ai-chat-area");
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: user.message, // Adjust this based on the API's expected structure
      max_tokens: 200, // Adjust as needed
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const apiResponse = data.candidates?.[0]?.output || "Sorry, I couldn't understand that.";
    text.innerHTML = apiResponse;
  } catch (error) {
    console.error("Error:", error);
    text.innerHTML = "Something went wrong. Please try again later.";
  } finally {
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    image.src = `img.svg`;
    image.classList.remove("choose");
    user.file = {};
  }
}

// Function to create a chat box
function createChatBox(html, classes) {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

// Function to handle user input and bot response
function handleChatResponse(userMessage) {
  if (!userMessage.trim()) return; // Ignore empty messages

  user.message = userMessage;

  // Create user chat box
  const html = `
    <img src="user.png" alt="" id="userImage" width="8%">
    <div class="user-chat-area">
      ${user.message}
    </div>`;
  prompt.value = ""; // Clear input
  const userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  // Create AI chat box with loading animation
  setTimeout(() => {
    const html = `
      <img src="ai.png" alt="" id="aiImage" width="10%">
      <div class="ai-chat-area">
        <img src="loading.webp" alt="" class="load" width="50px">
      </div>`;
    const aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);
}

// Event listeners
prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleChatResponse(prompt.value);
  }
});

submitBtn.addEventListener("click", () => {
  handleChatResponse(prompt.value);
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64string = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64string,
    };
    image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
    image.classList.add("choose");
  };
  reader.readAsDataURL(file);
});

imageBtn.addEventListener("click", () => {
  imageBtn.querySelector("input").click();
});
