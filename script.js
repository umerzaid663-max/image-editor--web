let filters = {
    brightness: { value: 100, min: 0, max: 200, unit: "%" },
    contrast: { value: 100, min: 0, max: 200, unit: "%" },
    saturation: { value: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, min: 0, max: 20, unit: "px" },
    grayscale: { value: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, min: 0, max: 100, unit: "%" },
    opacity: { value: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, min: 0, max: 100, unit: "%" }
};

const presets = {
    drama: { brightness: 120, contrast: 150, saturation: 60 },
    vintage: { sepia: 70, contrast: 90, brightness: 110 },
    oldSchool: { grayscale: 100, contrast: 120 },
    cyberpunk: { hueRotation: 180, saturation: 150, brightness: 110 },
    softGlow: { blur: 2, brightness: 110 },
    noir: { grayscale: 100, contrast: 180, brightness: 80 },
    warmSunset: { sepia: 40, saturation: 140, hueRotation: -10 },
    coolTone: { hueRotation: 190, saturation: 80 },
    faded: { opacity: 80, brightness: 110, contrast: 90 }
};

const imgInput = document.querySelector("#image-input");
const filtersContainer = document.querySelector(".filters");
const presetsContainer = document.querySelector(".presets");
const imagePlaceholder = document.querySelector(".placeholder");
const bottomSection = document.querySelector(".bottom");
const resetButton = document.querySelector("#reset-btn");
const downloadButton = document.querySelector("#download-btn");

let imageCanvas = document.createElement("canvas");
let canvasCtx = imageCanvas.getContext("2d");
let activeImage = null;

function createFilterElement(name, unit, value, min, max) {
    const div = document.createElement("div");
    div.classList.add("filter");
    div.innerHTML = `<p>${name}</p>
                     <input type="range" min="${min}" max="${max}" value="${value}" id="${name}">`;
    
    div.querySelector("input").addEventListener("input", (e) => {
        filters[name].value = e.target.value;
        applyFilters();
    });
    return div;
}

function renderFilters() {
    filtersContainer.innerHTML = "";
    Object.keys(filters).forEach(key => {
        const el = createFilterElement(key, filters[key].unit, filters[key].value, filters[key].min, filters[key].max);
        filtersContainer.appendChild(el);
    });
}

function applyFilters() {
    if (!activeImage) return;
    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    canvasCtx.filter = `
        brightness(${filters.brightness.value}${filters.brightness.unit})
        contrast(${filters.contrast.value}${filters.contrast.unit})
        saturate(${filters.saturation.value}${filters.saturation.unit})
        hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
        blur(${filters.blur.value}${filters.blur.unit})
        grayscale(${filters.grayscale.value}${filters.grayscale.unit})
        sepia(${filters.sepia.value}${filters.sepia.unit})
        opacity(${filters.opacity.value}${filters.opacity.unit})
        invert(${filters.invert.value}${filters.invert.unit})
    `;
    canvasCtx.drawImage(activeImage, 0, 0);
}

imgInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    imagePlaceholder.style.display = "none";
    imageCanvas.style.display = "block";
    bottomSection.appendChild(imageCanvas);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        activeImage = img;
        imageCanvas.width = img.width;
        imageCanvas.height = img.height;
        applyFilters();
    };
});

Object.keys(presets).forEach(presetName => {
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.innerText = presetName;
    presetsContainer.appendChild(btn);

    btn.addEventListener("click", () => {
        Object.keys(filters).forEach(f => filters[f].value = (f === 'brightness' || f === 'contrast' || f === 'saturation' || f === 'opacity') ? 100 : 0);
        
        const presetData = presets[presetName];
        Object.keys(presetData).forEach(filterName => {
            filters[filterName].value = presetData[filterName];
        });

        applyFilters();
        renderFilters();
    });
});

resetButton.addEventListener("click", () => {
    filters = {
        brightness: { value: 100, min: 0, max: 200, unit: "%" },
        contrast: { value: 100, min: 0, max: 200, unit: "%" },
        saturation: { value: 100, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
        blur: { value: 0, min: 0, max: 20, unit: "px" },
        grayscale: { value: 0, min: 0, max: 100, unit: "%" },
        sepia: { value: 0, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    };
    applyFilters();
    filtersContainer.innerHTML = "";
    renderFilters();
});

downloadButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = imageCanvas.toDataURL();
    link.click();
});

renderFilters();