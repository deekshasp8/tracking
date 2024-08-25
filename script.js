// Get references to HTML elements
const trackButton = document.getElementById('trackButton');
const statusText = document.getElementById('status');
const mapElement = document.getElementById('map');
const historyList = document.getElementById('historyList');

// Initialize map variables
let map;
let marker;
let watchID;
let locationHistory = [];

// Map styling options
const mapStyles = [
    {
        "featureType": "water",
        "stylers": [
            { "color": "#46bcec" },
            { "visibility": "on" }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            { "color": "#f2f2f2" }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            { "saturation": -100 },
            { "lightness": 45 }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            { "visibility": "simplified" }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#444444" }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            { "visibility": "off" }
        ]
    }
];

// Function to initialize the Google Map
function initMap(latitude, longitude) {
    const userLocation = { lat: latitude, lng: longitude };

    // Create a new map centered at the user's location with custom styles
    map = new google.maps.Map(mapElement, {
        center: userLocation,
        zoom: 15,
        styles: mapStyles
    });

    // Add a custom marker at the user's location
    marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'You are here!',
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    });

    // Add an info window to the marker
    const infoWindow = new google.maps.InfoWindow({
        content: '<h3>Your Current Location</h3><p>Latitude: ' + latitude + '<br>Longitude: ' + longitude + '</p>'
    });

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
}

// Function to update the user's location on the map
function updateMap(latitude, longitude) {
    const userLocation = { lat: latitude, lng: longitude };

    // Update the marker position
    marker.setPosition(userLocation);

    // Center the map on the user's location
    map.panTo(userLocation);
}

// Function to add a location to the history list
function addToHistory(latitude, longitude) {
    const listItem = document.createElement('li');
    listItem.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
    historyList.appendChild(listItem);
    locationHistory.push({ lat: latitude, lng: longitude });
}

// Function to handle success in geolocation
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    statusText.textContent = `Tracking your location...`;

    if (!map) {
        // Initialize the map if it hasn't been initialized
        initMap(latitude, longitude);
    } else {
        // Update the map with the new position
        updateMap(latitude, longitude);
    }

    // Add the location to the history list
    addToHistory(latitude, longitude);
}

// Function to handle errors in geolocation
function error() {
    statusText.textContent = 'Unable to retrieve your location';
}

// Event listener for the track button
trackButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        statusText.textContent = 'Geolocation is not supported by your browser';
    } else {
        statusText.textContent = 'Locating...';
        if (!watchID) {
            // Start real-time tracking
            watchID = navigator.geolocation.watchPosition(success, error, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });
            trackButton.textContent = "Stop Tracking";
        } else {
            // Stop real-time tracking
            navigator.geolocation.clearWatch(watchID);
            watchID = null;
            statusText.textContent = "Tracking stopped.";
            trackButton.textContent = "Start Tracking";
        }
    }
});
