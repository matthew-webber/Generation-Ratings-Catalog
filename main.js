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

    // save style string to a variable
    const styles = `
        #liked-images-table {
            width: 100%;
            border-collapse: collapse;
        }
        #liked-images-table th, #liked-images-table td {
            border: 1px solid #ddd; /* Light grey */
            padding: 8px;
        }
        #liked-images-table th {
            background-color: #f00; /* Purple */
            cursor: pointer;
        }
        #liked-images-table th.sortable:hover {
            background-color: #320365; /* Darker purple */
        }
        #liked-images-table tr:nth-child(even) {
            background-color: #000;
        }
        .custom-tab-content-inner {
            padding: 20px 10px;
        }  
    `;

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
                <div id="liked-images" class="custom-tab-content-inner">
                    <h2>Liked Images</h2>
                    <table id="liked-images-table">
                        <thead>
                            <tr>
                                <th data-type="number">Image Counter</th>
                                <th data-type="string">Prompt</th>
                                <th data-type="number">Steps</th>
                                <th data-type="number">Guidance</th>
                                <th data-type="number">Seed</th>
                                <th data-type="string">Model</th>
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

    function sortTableByColumn(table, columnIndex, type, isAsc = true) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        const sortedRows = rows.sort((a, b) => {
            const aValue =
                type === 'number'
                    ? parseFloat(a.children[columnIndex].textContent)
                    : a.children[columnIndex].textContent.toLowerCase();
            const bValue =
                type === 'number'
                    ? parseFloat(b.children[columnIndex].textContent)
                    : b.children[columnIndex].textContent.toLowerCase();

            if (aValue < bValue) return isAsc ? -1 : 1;
            if (aValue > bValue) return isAsc ? 1 : -1;
            return 0;
        });

        // Clear current rows and append sorted rows
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        sortedRows.forEach((row) => tbody.appendChild(row));
    }

    function addSortingToTableHeaders() {
        const table = document.querySelector('#liked-images-table');
        const headers = table.querySelectorAll('th');

        headers.forEach((header, index) => {
            header.classList.add('sortable');
            header.addEventListener('click', () => {
                const isAsc = !header.classList.contains('asc');
                sortTableByColumn(
                    table,
                    index,
                    header.getAttribute('data-type'),
                    isAsc
                );
                headers.forEach((h) => h.classList.remove('asc', 'desc'));
                header.classList.add(isAsc ? 'asc' : 'desc');
            });
            header.innerHTML += '<i class="fa-solid fa-arrows-up-down"></i>'; // UI component (arrow icon)
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
    }

    function injectStyles() {
        var style = document.createElement('style');
        style.innerHTML = styles;
        document.head.appendChild(style);
    }

    function init() {
        // Clear the liked images from local storage
        // localStorage.removeItem('likedImages');

        // Inject the Liked Images tab
        injectLikedImagesTab();

        // inject styles
        injectStyles();

        // Add sorting to table headers
        addSortingToTableHeaders();
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

/*
localStorage for dev:

[
    {
        "imageCounter": "3",
        "prompt": "cat on a windowsill",
        "steps": 14,
        "guidance": 9,
        "seed": 1485776769,
        "model": "sd-v1-4"
    },
    {
        "imageCounter": "2",
        "prompt": "body by Calvin Klein",
        "steps": 12,
        "guidance": 8.3,
        "seed": 608630128,
        "model": "deliberate_v2"
    },
    {
        "imageCounter": "1",
        "prompt": "a photograph of an astronaut riding a horse",
        "steps": 10,
        "guidance": 7.1,
        "seed": 3161532248,
        "model": "f222"
    }
]
*/
