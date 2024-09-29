// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js"; // Import getDatabase
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js"; // Import getStorage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI_bHdk1Zx6-mD8oOT8JsQhtdl0H6QP1c",
  authDomain: "house-rental-fd97d.firebaseapp.com",
  databaseURL: "https://house-rental-fd97d-default-rtdb.firebaseio.com",
  projectId: "house-rental-fd97d",
  storageBucket: "house-rental-fd97d.appspot.com",
  messagingSenderId: "338300928463",
  appId: "1:338300928463:web:410b85334033c01bfd12ba",
  measurementId: "G-TLKG5DWQQX"
};

//Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app); // Correctly initializing getDatabase
const storage = getStorage(app);


const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Handle form submission
document.getElementById("propertyForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    const submitButton = document.getElementById("submit");
    submitButton.disabled = true;

    // Get form values
    const propertyName = document.getElementById("propertyName").value;
    const price = document.getElementById("price").value;
    const location = document.getElementById("location").value;
    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;
    const contactDetails = document.getElementById("contactDetails").value;
    const features = document.getElementById("features").value;
    const bedrooms = document.getElementById("bedrooms").value;
    const bathrooms = document.getElementById("bathrooms").value;
    const squareFeet = document.getElementById("squareFeet").value;
    const images = document.getElementById("images").files;

    // Validate image files
    if (images.length === 0) {
        alert("Please select at least one image.");
        submitButton.disabled = false;
        return;
    }

    let uploadedImageCount = 0;
    const imageUrls = [];

    // Upload each image
    for (let i = 0; i < images.length; i++) {
        const file = images[i];

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            alert(`File ${file.name} is too large. Maximum size is 5MB.`);
            submitButton.disabled = false;
            return;
        }

        const storageReference = storageRef(storage, 'propertyImages/' + file.name);
        const uploadTask = uploadBytesResumable(storageReference, file);

        // Monitor the upload progress
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.getElementById("uploadStatus").innerText = `Uploading ${file.name}: ${progress.toFixed(2)}%`;
            },
            (error) => {
                alert("Error uploading image: " + error.message);
                submitButton.disabled = false;
            },
            () => {
                // Upload completed successfully, now get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    imageUrls.push(downloadURL);
                    uploadedImageCount++;

                    // If all images are uploaded, save property data to database
                    if (uploadedImageCount === images.length) {
                        const newPropertyRef = ref(db, 'properties/' + propertyName.replace(/\s+/g, '-'));
                        set(newPropertyRef, {
                            propertyName,
                            price,
                            location,
                            type,
                            description,
                            contactDetails,
                            features,
                            bedrooms,
                            bathrooms,
                            squareFeet,
                            images: imageUrls
                        }).then(() => {
                            alert("Property added successfully!");
                            document.getElementById("propertyForm").reset();
                            document.getElementById("uploadStatus").innerText = "";
                            submitButton.disabled = false;
                            clearImagePreview(); 
                        }).catch((error) => {
                            alert("Error adding property: " + error.message);
                            submitButton.disabled = false;
                        });
                    }
                });
            }
        );
    }
});


// Image preview function
function previewImages() {
    const previewContainer = document.getElementById("imagePreview");
    previewContainer.innerHTML = ""; // Clear previous previews

    const files = document.getElementById("images").files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (event) {
            const imgElement = document.createElement("img");
            imgElement.src = event.target.result;
            imgElement.style.width = "100px"; // Set width for preview
            imgElement.style.margin = "5px";
            previewContainer.appendChild(imgElement);
        }

        reader.readAsDataURL(file);
    }
}
function clearImagePreview() {
    const previewContainer = document.getElementById("imagePreview");
    previewContainer.innerHTML = ""; // Clear the preview container
}

// Ensure the function is available globally
window.previewImages = previewImages;
window.clearImagePreview = clearImagePreview;