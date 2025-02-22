function searchFunction() {
    let query = document.getElementById('search-input').value;
    alert("Searching for: " + query); // You can replace this with real search functionality
}

// Function to update the viewer counter
function updateViewerCount() {
    fetch('/getViewerCount')
        .then(response => response.text())
        .then(count => {
            document.getElementById('viewsCounter').innerText = `👁️ ${count}`;
        });
}

// Update every 3 seconds
setInterval(updateViewerCount, 3000);
