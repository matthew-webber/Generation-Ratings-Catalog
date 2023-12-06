(function () {
    'use strict';

    PLUGINS['IMAGE_INFO_BUTTONS'].push(
        {
            html: '<i class="fa-solid fa-thumbs-up"></i> Like',
            on_click: toggleLike,
        },
        {
            html: '<i class="fa-solid fa-save"></i> Save',
            on_click: logSavedData,
        }
    );

    function saveLikedImageData(imageData) {
        let likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
        let imageIndex = likedImages.findIndex(
            (img) => img.imageCounter === imageData.imageCounter
        );

        if (imageIndex > -1) {
            // If image is already liked, unlike it (toggle off)
            likedImages.splice(imageIndex, 1);
        } else {
            // If image is not liked, add it to the liked images
            likedImages.push(imageData);
        }

        localStorage.setItem('likedImages', JSON.stringify(likedImages));
    }

    // Utility function to log saved data
    function logSavedData() {
        let likedImages = localStorage.getItem('likedImages');
        console.log('Saved Liked Images:', likedImages);
    }

    // Toggle like function
    function toggleLike(origRequest, imageElement) {
        // Toggle glow effect
        var imgContainer = imageElement.closest('.imgContainer');
        if (imgContainer) {
            imgContainer.style.boxShadow = imgContainer.style.boxShadow
                ? ''
                : '0 0 20px rgba(50, 205, 50, 0.7)';
        }

        // Prepare image data
        var imageData = {
            imageCounter: imageElement.getAttribute('data-imagecounter'),
            prompt: origRequest.prompt,
            steps: origRequest.num_inference_steps,
            guidance: origRequest.guidance_scale,
            seed: origRequest.seed,
            model: origRequest.use_stable_diffusion_model,
        };

        // Save or remove the liked image data
        saveLikedImageData(imageData);
    }

    function injectLikedImagesTab() {
        // Define the HTML for the tab
        var tabHtml = `
        <span id="tab-liked-images" class="tab"><span><i class="fa-solid fa-heart icon"></i><span>Liked Images</span></span></span>
    `;

        // Define the HTML for the content
        var contentHtml = `
        <div id="tab-content-liked-images" class="tab-content">
            <div id="liked-images" class="tab-content-inner">
                <h2>Liked Images</h2>
                <table id="liked-images-table">
                    <thead>
                        <tr>
                            <th>Image Counter</th>
                            <th>Prompt</th>
                            <th>Steps</th>
                            <th>Guidance</th>
                            <th>Seed</th>
                            <th>Model</th>
                        </tr>
                    </thead>
                    <tbody id="liked-images-list">
                        <!-- Liked images will be listed here -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

        // Locate the parent container and inject the tab and content
        var tabContainer = document.getElementById('tab-container');
        var contentContainer =
            document.querySelector('.tab-content').parentNode;

        tabContainer.insertAdjacentHTML('beforeend', tabHtml);
        contentContainer.insertAdjacentHTML('beforeend', contentHtml);
    }

    function displayLikedImages() {
        var likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
        var tableBody = document.getElementById('liked-images-list');
        tableBody.innerHTML = '';

        likedImages.forEach((imageData) => {
            var row = `<tr>
            <td>${imageData.imageCounter}</td>
            <td>${imageData.prompt}</td>
            <td>${imageData.steps}</td>
            <td>${imageData.guidance}</td>
            <td>${imageData.seed}</td>
            <td>${imageData.model}</td>
        </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    }

    function init() {
        // Clear the liked images from local storage
        localStorage.removeItem('likedImages');

        // Inject the Liked Images tab
        injectLikedImagesTab();
    }

    // if document is ready, inject the tab, otherwise add an event listener
    if (
        document.readyState === 'complete' ||
        document.readyState === 'loaded' ||
        document.readyState === 'interactive'
    ) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
