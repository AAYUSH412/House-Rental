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
            let count = 0;
            Object.keys(propertiesData).forEach((propertyId) => {
                if (window.location.pathname.includes('index.html') && count >= 6) return; // Limit to 6 property cards on index.html

                const property = propertiesData[propertyId];

                // Create a property card
                const propertyCard = document.createElement('div');
                propertyCard.classList.add('property-card');

                propertyCard.innerHTML = `
                    <img src="${property.images[0]}" alt="${property.propertyName}" loading="lazy">
                    <div class="property-details">
                        <h3>${property.propertyName}</h3>
                        <h4>$${property.price}</h4>
                        <p>Location: ${property.location}</p>
                        <div class="amenities">
                            <i class="bx bx-bed"><span>${property.bedrooms || '0'}</span></i>
                            <i class="bx bx-bath"><span>${property.bathrooms || '0'}</span></i>
                        </div>
                        <p>${property.squareFeet} sq ft</p>
                        <p class="contactPhone">${property.contactPhone}</p> <!-- Ensure this element exists -->
                        <button class="contact-details-button">Contact Details</button>
                    </div>
                `;

                propertiesContainer.appendChild(propertyCard);
                propertyCard.querySelector('.contact-details-button').addEventListener('click', () => {
                    showContactDetails(property);
                });
                count++;
            });
        } else {
            propertiesContainer.innerHTML = "<p>No properties available at the moment.</p>";
        }
    });
}

// Call loadProperties when the page loads
document.addEventListener('DOMContentLoaded', loadProperties);

// Function to handle the search
function searchProperties() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const propertiesContainer = document.getElementById('propertiesContainer');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const searchResultsSection = document.getElementById('searchResultsSection');
    const propertyCards = propertiesContainer.getElementsByClassName('property-card');
    searchResultsContainer.innerHTML = ''; // Clear previous search results

    let hasResults = false;

    Array.from(propertyCards).forEach(card => {
        const propertyName = card.querySelector('.property-details h3').innerText.toLowerCase();
        const contactPhone = card.querySelector('.contactPhone') ? card.querySelector('.contactPhone').innerText : 'N/A';

        if (propertyName.includes(searchInput)) {
            const clonedCard = card.cloneNode(true);
            searchResultsContainer.appendChild(clonedCard);

            // Add event listener for the contact details button in the cloned card
            clonedCard.querySelector('.contact-details-button').addEventListener('click', () => {
                showContactDetails({
                    propertyName: propertyName,
                    contactDetails: contactPhone 
                });
            });

            hasResults = true;
        }
    });

    // Show or hide the search results section
    searchResultsSection.style.display = hasResults ? 'block' : 'none';
}

// Function to handle autocomplete suggestions
function autocompleteSuggestions() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const propertiesContainer = document.getElementById('propertiesContainer');
    const propertyCards = propertiesContainer.getElementsByClassName('property-card');
    const suggestions = [];

    Array.from(propertyCards).forEach(card => {
        const type = card.querySelector('.property-details h3').innerText.toLowerCase();

        if (type.includes(searchInput)) {
            suggestions.push(`${type}`);
        }
    });

    // Show suggestions in the input field
    const datalist = document.createElement('datalist');
    datalist.id = 'autocompleteOptions';
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });

    // Remove existing datalist if any
    const existingDatalist = document.getElementById('autocompleteOptions');
    if (existingDatalist) {
        existingDatalist.remove();
    }

    // Append new datalist to the input field's parent
    document.getElementById('searchInput').parentNode.appendChild(datalist);
    document.getElementById('searchInput').setAttribute('list', 'autocompleteOptions');
}

// Ensure the functions are available globally
window.searchProperties = searchProperties;
window.autocompleteSuggestions = autocompleteSuggestions;

function showContactDetails(property) {
    console.log(property); 
    document.getElementById('contactName').innerText = `Name: ${property.propertyName}`;
    document.getElementById('contactPhone').innerText = `Phone: ${property.contactDetails}`;

    const contactDetailsPopup = document.getElementById('contactDetailsPopup');
    contactDetailsPopup.style.display = 'block';

    // Add event listener to close the pop-up
    contactDetailsPopup.querySelector('.close-button').addEventListener('click', () => {
        contactDetailsPopup.style.display = 'none';
    });
}

// Call loadProperties when the page loads
document.addEventListener('DOMContentLoaded', loadProperties);