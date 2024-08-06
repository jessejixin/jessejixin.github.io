const textarea = document.getElementById('myTextarea');
const overlayImage = document.getElementById('overlayImage');

textarea.addEventListener('focus', function() {
    overlayImage.style.display = 'block'; // Show the image when the textarea is focused
});

// Optional: Hide the image when clicking on the image itself
overlayImage.addEventListener('click', function() {
    overlayImage.style.display = 'none'; // Hide the image when clicked
});

// Optional: Keep the image displayed after clicking outside
document.addEventListener('click', function(event) {
    if (!textarea.contains(event.target) && !overlayImage.contains(event.target)) {
        overlayImage.style.display = 'block'; // Keep the image displayed
    }
});

function updateFileName() {
    const fileInput = document.getElementById('file-uploader');
    const fileNameDisplay = document.getElementById('file-name');

    if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name; // Show the name of the selected file
    } else {
        fileNameDisplay.textContent = ''; // Default text if no file is selected
    }
}

document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Submit the form using fetch API or XMLHttpRequest
    const formData = new FormData(this);

    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Redirect to a new route after successful submission
            window.location.href = "drawingboard-master/index1.html"; // Change this to your desired route
        } else {
            // Handle the error case
            console.error('Submission failed:', response);
            alert('There was a problem with your submission. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was a problem with your submission. Please try again.');
    });
});