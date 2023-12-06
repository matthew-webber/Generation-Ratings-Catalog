PLUGINS['IMAGE_INFO_BUTTONS'].push({
    title: 'Rate Image',
    html: '<i class="fa-solid fa-thumbs-up"></i> Like',
    onclick: function (img_info) {
        showRatingDialog(img_info);
    },
});

function showRatingDialog(img_info) {
    // Code to display a rating dialog, which includes:
    // - A 1-5 scale for rating the image.
    // - A form to capture generation settings (if not automatically captured).
    // - A submit button to save the data.

    // Example pseudocode for dialog box
    let dialogHtml = `
        <div class="rating-dialog">
            <h3>Rate this Generation</h3>
            <div>
                <label for="rating">Rating (1-5): </label>
                <input type="number" id="rating" name="rating" min="1" max="5">
            </div>
            <!-- Include more fields as needed for additional data capture -->
            <button onclick="saveRating(img_info, document.getElementById('rating').value)">Save Rating</button>
        </div>
    `;

    // Display dialogHtml on the web page
    // ...
}

function saveRating(img_info, rating) {
    // Code to save the rating and any other captured data
    // This might involve storing the data locally or sending it to a server

    console.log(`Saved rating: ${rating} for image: ${img_info.image_id}`);
    // Implement actual saving logic here
}
