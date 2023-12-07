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
                            <th data-type="number">Image Counter</th>
                            <th>Prompt</th>
                            <th data-type="number">Steps</th>
                            <th data-type="number">Guidance</th>
                            <th data-type="number">Seed</th>
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

        var tabContainer = document.querySelector('#tab-container');
        var contentContainer = document.querySelector('#tab-content-wrapper');
        var likedImagesTab = document.querySelector('#tab-liked-images');
        var likedImagesTabContent = document.querySelector(
            '#tab-content-liked-images'
        );

        tabContainer.insertAdjacentHTML('beforeend', tabHtml);
        contentContainer.insertAdjacentHTML('beforeend', contentHtml);

        document
            .querySelector('#tab-liked-images')
            .addEventListener('click', function () {
                // for each immediate child of #tab-content-wrapper, remove the active class
                document
                    .querySelectorAll('#tab-content-wrapper > .tab-content')
                    .forEach((el) => {
                        el.classList.remove('active');
                    });

                // for each immediate child of #tab-container, remove the active class
                document
                    .querySelectorAll('#tab-container > .tab')
                    .forEach((el) => {
                        el.classList.remove('active');
                    });

                // Activate the Liked Images tab and display its content
                this.classList.add('active');
                document
                    .querySelector('#tab-content-liked-images')
                    .classList.add('active');
                displayLikedImages();
            });

        // if any other tab other than Liked Images is clicked, deactivate the Liked Images tab
        document.querySelectorAll('#tab-container > .tab').forEach((el) => {
            if (el.id !== 'tab-liked-images') {
                el.addEventListener('click', function () {
                    document
                        .querySelector('#tab-liked-images')
                        .classList.remove('active');
                    document
                        .querySelector('#tab-content-liked-images')
                        .classList.remove('active');
                });
            }
        });
    }

    function sortTable(columnIndex, type) {
        var table = document.getElementById('liked-images-table');
        var rows = Array.from(table.getElementsByTagName('tr')).slice(1); // Exclude header row
        var sorted = false;

        while (!sorted) {
            sorted = true;

            for (var i = 0; i < rows.length - 1; i++) {
                var x = rows[i].getElementsByTagName('TD')[columnIndex];
                var y = rows[i + 1].getElementsByTagName('TD')[columnIndex];

                if (
                    type === 'number'
                        ? parseFloat(x.innerHTML) > parseFloat(y.innerHTML)
                        : x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()
                ) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    sorted = false;
                    break;
                }
            }
        }
    }

    function addSortingToTableHeaders() {
        var headers = document.querySelectorAll('#liked-images-table th');
        headers.forEach((header, index) => {
            header.classList.add('sortable');
            header.addEventListener('click', function () {
                sortTable(index, header.getAttribute('data-type'));
            });
            header.innerHTML += ' <i class="fa-solid fa-arrow-down"></i>'; // UI component (arrow icon)
        });
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

        addSortingToTableHeaders();
    }

    function injectStyles() {
        var style = document.createElement('style');
        style.innerHTML = `
            #liked-images-table {
                width: 100%;
                border-collapse: collapse;
            }
            #liked-images-table th, #liked-images-table td {
                border: 1px solid #ddd; /* Light grey */
                padding: 8px;
            }
            #liked-images-table th {
                background-color: #5300B8; /* Purple */
                cursor: pointer;
            }
            #liked-images-table th.sortable:hover {
                background-color: #eaeaea; /* Light grey */
            }
            #liked-images-table tr:nth-child(even) {
                background-color: #000;
            }      
        `;
        document.head.appendChild(style);
    }

    function init() {
        // Clear the liked images from local storage
        // localStorage.removeItem('likedImages');

        // Inject the Liked Images tab
        injectLikedImagesTab();

        // inject styles
        injectStyles();
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
