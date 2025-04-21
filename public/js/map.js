var map = L.map('map').setView([latitude, longitude], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 50,
    attribution: '&copy; Travana'
}).addTo(map);

var marker = L.marker([latitude, longitude]).addTo(map);

