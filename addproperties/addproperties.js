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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const db = getDatabase(app); // Correctly initializing getDatabase
const storage = getStorage(app);

// Handle form submission
document.getElementById("propertyForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const propertyName = document.getElementById("propertyName").value;
    const price = document.getElementById("price").value;
    const location = document.getElementById("location").value;
    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;
    const contactDetails = document.getElementById("contactDetails").value;
    const features = document.getElementById("features").value;
    const images = document.getElementById("images").files;

    if (images.length === 0) {
        alert("Please select at least one image.");
        return;
    }

    const propertyId = Date.now(); // Unique ID for property
    const uploadPromises = [];
    const imageUrls = [];

    // Upload images to Firebase Storage
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageRef = storageRef(storage, `properties/${propertyId}/${image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, image);

        uploadPromises.push(new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Show upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    document.getElementById("uploadStatus").innerText = `Uploading ${image.name}: ${progress.toFixed(2)}% done.`;
                },
                (error) => reject(error),
                () => {
                    // Get download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        imageUrls.push(downloadURL);
                        resolve(downloadURL);
                    });
                }
            );
        }));
    }

    // Save property data after all images are uploaded
    Promise.all(uploadPromises)
        .then(() => {
            set(ref(db, 'properties/' + propertyId), {
                propertyName: propertyName,
                price: price,
                location: location,
                type: type,
                description: description,
                contactDetails: contactDetails,
                features: features,
                images: imageUrls // Store image URLs
            }).then(() => {
                alert("Property submitted successfully!");
                document.getElementById("propertyForm").reset();
                document.getElementById("uploadStatus").innerText = ""; // Clear status
            }).catch((error) => alert("Error saving property: " + error));
        })
        .catch((error) => alert("Error uploading images: " + error));
});
