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

    const STYLES = `
        /* ==================== */
        /* Table Styles */
        /* ==================== */

        #liked-images-table {
            width: 100%;
            border-collapse: collapse;
        }
        thead th:nth-child(1) {
            width: 6%; /* Image ID */
        }
        thead th:nth-child(2) {
            width: auto; /* Prompt */
        }
        thead th:nth-child(3) {
            width: 6%; /* Steps */
        }
        thead th:nth-child(4) {
            width: 6%; /* Guidance */
        }
        thead th:nth-child(5) {
            width: 8%; /* Seed */
        }
        thead th:nth-child(6) {
            width: 20%; /* Model */
        }
        thead th:nth-child(7) {
            width: 3%; /* Src */
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
            background-color: #320365; /* Darker purple! */
        }
        #liked-images-table tr:nth-child(even) {
            background-color: #000;
        }
        #liked-images-table thead i {
            padding-right: 10px;
        }
        #liked-images-table tbody img {
            width: 50px;
            height: auto;
        }

        /* ==================== */
        /* Filter Styles */
        /* ==================== */

        .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #filter-input {
            width: 300px;
            padding: 10px;
        }
        .filter-container {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 10px;
            width: 100%;
        }
        .clear-button {
            background-color: #7b1010;
            color: white;
            border-radius: 30%;
            width: 20px;
            height: 20px;
            text-align: center;
            cursor: pointer;
        }
        @media (max-width: 700px) {
            .header-container {
                flex-direction: column;
                align-items: center;
            }
            .filter-container {
                justify-content: center;
            }
        
            #filter-input {
                width: 80%;
                margin: 10px 0;
            }
            
        }

        /* ==================== */
        /* Modal Styles */
        /* ==================== */

        .custom-modal {
            position: fixed;
            display: none;
            z-index: 100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
            align-items: center;
            justify-content: center;
        }

        .custom-modal-content {
            margin: auto;
            display: block;
            width: auto;
        }

        .custom-modal-close {
            position: absolute;
            top: 20px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            transition: 0.3s;
        }

        .custom-modal-close:hover,
        .custom-modal-close:focus {
            color: #bbb;
            text-decoration: none;
            cursor: pointer;
        }

        /* ==================== */
        /* General UI Styles */
        /* ==================== */

        .custom-tab-content-inner {
            padding: 20px 10px;
        }
        .header-container h2 {
            white-space: nowrap;
        }
        @media (min-width: 700px) {
            body {
                overflow-y: auto !important; 
            }
        }
    `;

    const MARKUP = {
        tab: `
            <span id="tab-liked-images" class="tab"><span><i class="fa-solid fa-heart icon"></i>Liked Images</span></span>
        `,
        content: `
            <div id="tab-content-liked-images" class="tab-content">
                <div id="liked-images" class="custom-tab-content-inner">
                    <div class="header-container">
                        <h2>Liked Images</h2>
                        <div class="filter-container">
                            <button tton id="clear-filter" class="clear-button">X</button>
                            <input id="filter-input" type="text" placeholder="Filter (extra: use column_name=filter_word)">
                        </div>
                    </div>
                    </div>
                    <table id="liked-images-table">
                        <thead>
                            <tr>
                                <th data-type="number">id</th>
                                <th data-type="string">Prompt</th>
                                <th data-type="number">Steps</th>
                                <th data-type="number">Guidance</th>
                                <th data-type="number">Seed</th>
                                <th data-type="string">Model</th>
                                <th data-type="meta">Src</th>
                            </tr>
                        </thead>
                        <tbody id="liked-images-list">
                            <!-- Liked images will be listed here -->
                        </tbody>
                    </table>
                </div>
            </div>
        `,
    };

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
            // src: imageElement.getAttribute('src'),
            imageCounter: imageElement.getAttribute('data-imagecounter'),
            prompt: origRequest.prompt,
            steps: origRequest.num_inference_steps,
            guidance: origRequest.guidance_scale,
            seed: origRequest.seed,
            model: origRequest.use_stable_diffusion_model,
        };

        // Save or remove the liked image data
        console.log('origRequest', origRequest);
        console.log('imageElement', imageElement);
        saveLikedImageData(imageData);
    }

    function injectLikedImagesTab() {
        // Define the HTML for the tab
        var tabHtml = MARKUP.tab;

        // Define the HTML for the content
        var contentHtml = MARKUP.content;

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
            // if the header is not 'src' or 'actions', add a click event listener
            'src' !== header.getAttribute('data-type') &&
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
        });
    }

    function displayLikedImages() {
        const headers = Array.from(
            document.querySelectorAll('#liked-images-table th')
        );
        const likedImages =
            JSON.parse(localStorage.getItem('likedImages')) || [];
        const tableBody = document.getElementById('liked-images-list');
        tableBody.innerHTML = '';

        likedImages.forEach((imageData) => {
            // set the <img> element with imageData.imageCounter to a variable
            const imageElement = document.querySelector(
                `img[data-imagecounter="${imageData.imageCounter}"]`
            );

            const imageOuterHTML = imageElement ? imageElement.outerHTML : '';

            const row = `<tr>
                <td>${imageData.imageCounter}</td>
                <td>${imageData.prompt}</td>
                <td>${imageData.steps}</td>
                <td>${imageData.guidance}</td>
                <td>${imageData.seed}</td>
                <td>${imageData.model}</td>
                <td>${imageOuterHTML}</td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        const filterInput = document.querySelector('#filter-input');

        filterInput.addEventListener('input', function () {
            const filter = this.value.split('=').map((s) => s.trim());
            const rows = document.querySelectorAll(
                '#liked-images-table tbody tr'
            );
            rows.forEach((row) => {
                const cells = Array.from(row.children);
                if (filter.length === 2) {
                    const columnIndex = headers.findIndex(
                        (header) =>
                            header.textContent.toLowerCase() ===
                            filter[0].toLowerCase()
                    );
                    row.style.display =
                        cells[columnIndex] &&
                        cells[columnIndex].textContent.includes(filter[1])
                            ? ''
                            : 'none';
                } else {
                    row.style.display = cells.some((cell) =>
                        cell.textContent.includes(filter[0])
                    )
                        ? ''
                        : 'none';
                }
            });
        });

        const clearButton = document.querySelector('#clear-filter');

        clearButton.addEventListener('click', function () {
            filterInput.value = '';
            filterInput.dispatchEvent(new Event('input'));
        });

        addShowModalToSrcImage();
    }

    function injectStyles() {
        var style = document.createElement('style');
        style.innerHTML = STYLES;
        document.head.appendChild(style);
    }

    async function loadDemoData() {
        // Load the demo data
        const demoData = await fetch(
            'https://raw.githubusercontent.com/matthew-webber/Generation-Ratings-Catalog/master/generation-demo.json'
        ).then((response) => response.json());

        // Save the demo data to local storage
        localStorage.setItem('likedImages', JSON.stringify(demoData));
    }

    function addShowModalToSrcImage() {
        let modal;
        if (!document.querySelector('.custom-modal')) {
            // Create the modal element
            modal = document.createElement('div');
            modal.classList.add('custom-modal');
            modal.innerHTML = `
            <span class="custom-modal-close">&times;</span>
            <img class="custom-modal-content">
        `;
            document.body.appendChild(modal);
        }

        modal = document.querySelector('.custom-modal');
        const img = document.querySelector('.custom-modal-content');
        const closeButton = document.querySelectorAll('.custom-modal-close')[0];

        // Get the images in the 'src' column
        var images = document.querySelectorAll('#liked-images-table img');

        function showModal() {
            document.querySelector('.custom-modal').style.display = 'flex';
            img.src = this.src;
        }

        function hideModal() {
            document.querySelector('.custom-modal').style.display = 'none';
            img.src = '';
        }

        function hideModalEventDriven(e) {
            if (e.target === modal || e.key === 'Escape') {
                hideModal();
            }
        }

        closeButton.removeEventListener('click', hideModal);
        closeButton.addEventListener('click', hideModal);

        // Remove the event listener from each image
        images.forEach(function (image) {
            image.removeEventListener('click', showModal);
        });

        // Add the event listener to each image
        images.forEach(function (image) {
            image.addEventListener('click', showModal);
        });

        // Close the modal when the user clicks outside of the <img> element
        modal.removeEventListener('click', hideModalEventDriven);
        modal.addEventListener('click', hideModalEventDriven);

        // Close the modal when the user hits the Esc key
        document.removeEventListener('keydown', hideModalEventDriven);
        document.addEventListener('keydown', hideModalEventDriven);
    }

    async function init() {
        // Clear the liked images from local storage
        localStorage.removeItem('likedImages');

        // load the liked images demo data
        await loadDemoData();

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

origRequest

{
    "prompt": "a photograph of an astronaut riding a horse",
    "seed": 4141789285,
    "used_random_seed": true,
    "negative_prompt": "",
    "num_outputs": 1,
    "num_inference_steps": 10,
    "guidance_scale": 7.5,
    "width": 256,
    "height": 256,
    "vram_usage_level": "balanced",
    "sampler_name": "euler_a",
    "use_stable_diffusion_model": "deliberate_v2",
    "clip_skip": false,
    "use_vae_model": "",
    "stream_progress_updates": true,
    "stream_image_progress": false,
    "show_only_filtered_image": true,
    "block_nsfw": false,
    "output_format": "jpeg",
    "output_quality": 75,
    "output_lossless": false,
    "metadata_output_format": "none",
    "original_prompt": "a photograph of an astronaut riding a horse",
    "active_tags": [],
    "inactive_tags": []
}

imageElement

<img width="256" height="256" data-prompt="a photograph of an astronaut riding a horse" data-steps="10" data-guidance="7.5" data-seed="4141789285" data-imagecounter="2" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgK...pqm7XP/2Q==">

*/
