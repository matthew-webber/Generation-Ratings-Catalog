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

    function displayLikedImages() {
        var likedImages = JSON.parse(localStorage.getItem('likedImages')) || [];
        var container = document.getElementById('liked-images-list');
        container.innerHTML = '';

        likedImages.forEach((imageData) => {
            var imageElement = document.createElement('div');
            imageElement.innerText = `Image ID: ${imageData.imageCounter}, Model: ${imageData.model}, Prompt: ${imageData.prompt}`;
            container.appendChild(imageElement);
        });
    }

    function injectLikedImagesTab() {
        // Define the HTML for the tab and content
        var tabHtml = `
            <span id="tab-liked-images" class="tab"><span><i class="fa-solid fa-heart icon"></i><span>Liked Images</span></span></span>
        `;
        var contentHtml = `
            <div id="tab-content-liked-images" class="tab-content">
                <div id="liked-images" class="tab-content-inner">
                    <h2>Liked Images</h2>
                    <div id="liked-images-list">
                        <!-- Liked images will be listed here -->
                    </div>
                </div>
            </div>
        `;

        // Locate the position where the tab and content should be injected
        var tabContainer = document.getElementById('tab-plugin').parentNode;
        var contentContainer =
            document.getElementById('tab-content-merge').parentNode;

        // Inject the HTML
        tabContainer.insertAdjacentHTML('afterend', tabHtml);
        contentContainer.insertAdjacentHTML('afterend', contentHtml);

        document
            .getElementById('tab-liked-images')
            .addEventListener('click', function () {
                // Hide all other tab contents and deactivate other tabs
                document
                    .querySelectorAll('.tab-content')
                    .forEach((el) => el.classList.remove('active'));
                document
                    .querySelectorAll('.tab')
                    .forEach((el) => el.classList.remove('active'));

                // Activate the Liked Images tab and display its content
                this.classList.add('active');
                document
                    .getElementById('tab-content-liked-images')
                    .classList.add('active');
                displayLikedImages();
            });
    }

    // if document is ready, inject the tab, otherwise add an event listener
    if (
        document.readyState === 'complete' ||
        document.readyState === 'loaded' ||
        document.readyState === 'interactive'
    ) {
        injectLikedImagesTab();
    } else {
        document.addEventListener('DOMContentLoaded', injectLikedImagesTab);
    }
    // injectLikedImagesTab();
})();
