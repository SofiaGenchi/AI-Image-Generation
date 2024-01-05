const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;
// Send a request to the OpenAI API to generate images based on user input

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];

        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn")

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    })
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) throw new Error("Failed to generate images! Please try again")

        const { data } = await response.json(); // Get data from the response
        updateImageCard([...data]);

    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
  e.preventDefault();
  if(isImageGenerating) return;
  isImageGenerating = true;

  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = e.srcElement[1].value;

//   Creating HTML marup for img cards with loading state
    const imgCardMarkup = Array.from(
        { length: userImgQuantity },
        () =>
        `<div class="img-card loading">
            <img src="./img/Spinner-1s-200px.svg" alt="image">
                <a href="#" class="download-btn">
                    <img src="./img/download-outline.svg" alt="download icon">
                </a>
        </div>`
    ).join("")

    // console.log(imgCardMarkup)
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
