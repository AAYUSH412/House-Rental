// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js"; 

// Firebase configuration
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
const db = getDatabase(app); // Initialize the Firebase Realtime Database

// Reference to the 'properties' node in Firebase Database
const propertiesRef = ref(db, 'properties');

function loadProperties() {
    const propertiesContainer = document.getElementById('propertiesContainer');
    
    onValue(propertiesRef, (snapshot) => {
        propertiesContainer.innerHTML = ''; // Clear previous properties
        const propertiesData = snapshot.val();

        if (propertiesData) {
            Object.keys(propertiesData).forEach((propertyId) => {
                const property = propertiesData[propertyId];

                // Create a property card
                const propertyCard = document.createElement('div');
                propertyCard.classList.add('property-card');

                propertyCard.innerHTML = `
                    <img src="${property.images[0]}" alt="${property.propertyName}"loading="lazy">
                    <div class="property-details">
                        <h3>$${property.price}</h3>
                        <p>Location: ${property.location}</p>
                        <p>${property.bedrooms} Bedrooms, ${property.bathrooms} Bathrooms</p>
                        <p>${property.squareFeet} sq ft</p>
                    </div>
                `;

                propertiesContainer.appendChild(propertyCard);
            });
        } else {
            propertiesContainer.innerHTML = "<p>No properties available at the moment.</p>";
        }
    });
}

// Call loadProperties when the page loads
document.addEventListener('DOMContentLoaded', loadProperties);