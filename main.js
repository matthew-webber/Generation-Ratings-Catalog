(function () {
    'use strict';
    let imageCounter = 0;

    const incImageCounter = () => {
        imageCounter++;
    };

    const saveHistoryItem = () => {
        const imageData = setImageData();
        const imagesList = getImagesList();
        saveImageData(imagesList, imageData);
    };
    const makeImage = document.getElementById('makeImage');
    makeImage.addEventListener('click', saveHistoryItem);

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

    const MARKUP = {
        tab: `
            <span id="tab-liked-images" class="tab"><span><i class="fa-solid fa-heart icon"></i>Liked Images</span></span>
        `,
        content: `
            <div id="tab-content-liked-images" class="tab-content">
                <div id="liked-images" class="custom-tab-content-inner">
                    <div class="header-container">
                        <div class="title-container">
                            <h2>Liked Images</h2>
                            <i id="table-options-icon" class="fa-solid fa-cog"></i>
                        </div>
                        <div class="filter-container">
                            <button tton id="clear-filter" class="clear-button">X</button>
                            <input id="filter-input" type="text" placeholder="Filter (extra: use column_name=filter_word)">
                        </div>
                    </div>
                    </div>
                    <table id="liked-images-table">
                        <thead>
                            <tr>
                                <th data-type="boolean" data-name="isLiked">Liked</th>
                                <th data-type="number" data-name="id">id</th>
                                <th data-type="string" data-name="prompt">Prompt</th>
                                <th data-type="number" data-name="steps">Steps</th>
                                <th data-type="number" data-name="guidance">Guidance</th>
                                <th data-type="number" data-name="seed">Seed</th>
                                <th data-type="string" data-name="model">Model</th>
                                <th data-type="meta" data-name="src">Src</th>
                                <th data-type="string" data-name="negativePrompt">Negative Prompt</th>
                                <th data-type="string" data-name="size">Size</th>
                                <th data-type="string" data-name="sampler">Sampler</th>
                                <th data-type="boolean" data-name="clipSkip">Clip Skip</th>
                                <th data-type="boolean" data-name="VAE">VAE</th>
                                <th data-type="string" data-name="outputFormat">Format</th>
                                <th data-type="number" data-name="outputQuality">Quality</th>
                            </tr>
                        </thead>
                        <tbody id="liked-images-list">
                            <!-- Liked images will be listed here -->
                        </tbody>
                    </table>
                </div>
            </div>
        `,
        optionsModal: `
            <div id="table-options-modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Table Options</h2>
                    <div class="options-list">
                        <div class="column-default column">
                            <div class="option">
                                <input type="checkbox" name="isLiked">
                                <label for="isLiked">Liked</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="id">
                                <label for="id">id</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="prompt">
                                <label for="prompt">Prompt</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="steps">
                                <label for="steps">Steps</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="guidance">
                                <label for="guidance">Guidance</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="seed">
                                <label for="seed">Seed</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="model">
                                <label for="model">Model</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="src">
                                <label for="src">Src</label>
                            </div>
                        </div>
                        <div class="column-additional column">
                            <div class="option">
                                <input type="checkbox" name="negativePrompt">
                                <label for="negativePrompt">Negative Prompt</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="size">
                                <label for="size">Size</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="sampler">
                                <label for="sampler">Sampler</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="clipSkip">
                                <label for="clipSkip">Clip Skip</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="VAE">
                                <label for="VAE">VAE</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="outputFormat">
                                <label for="outputFormat">Output Format</label>
                            </div>
                            <div class="option">
                                <input type="checkbox" name="outputQuality">
                                <label for="outputQuality">Output Quality</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
    };

    const STYLES = `
        /* ==================== */
        /* Table Styles */
        /* ==================== */

        #liked-images-table {
            width: 100%;
            border-collapse: collapse;
        }

        thead th[data-name="isLiked"] {
            width: 3%;
        }

        thead th[data-name="id"] {
            width: 6%;
        }

        thead th[data-name="prompt"] {
            width: auto;
        }

        thead th[data-name="steps"] {
            width: 6%;
        }

        thead th[data-name="guidance"] {
            width: 6%;
        }

        thead th[data-name="seed"] {
            width: 8%;
        }

        thead th[data-name="model"] {
            width: 20%;
        }

        thead th[data-name="src"] {
            width: 3%;
        }

        thead th[data-name="negativePrompt"] {
            width: auto;
        }

        thead th[data-name="size"] {
            width: 6%;
        }

        thead th[data-name="sampler"] {
            width: 6%;
        }

        thead th[data-name="clipSkip"] {
            width: 8%;
        }

        thead th[data-name="VAE"] {
            width: 20%;
        }

        thead th[data-name="outputFormat"] {
            width: 3%;
        }

        thead th[data-name="outputQuality"] {
            width: 6%;
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

        #table-options-modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }

        .options-list {
            display: flex;

            .column {
                flex: 1 0 50%;
            }
        }


        #table-options-modal .modal-content {
            background-color: #000;
            margin: 15% auto; /* 15% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 40%;
            position: relative;
        }

        #table-options-modal .close {
            color: #aaa;
            font-size: 50px;
            font-weight: bold;
            position: absolute;
            top: 0;
            right: 20px;
        }

        #table-options-modal .close:hover,
        #table-options-modal .close:focus {
            color: #fff;
            text-decoration: none;
            cursor: pointer;
        }

        /* Checkbox styles */
        #table-options-modal .option {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        #table-options-modal .option input[type="checkbox"] {
            margin-right: 10px;
        }

        #table-options-modal .option label {
            margin: 0;
        }

        /* ==================== */
        /* General UI Styles */
        /* ==================== */

        .hidden {
            display: none;
        }

        .title-container {
            display: flex;
            align-items: center;
            gap: 20px;
        }

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

    function addShowModalFunctionality() {
        /* ==================== */
        /* Img Src Modal */
        /* ==================== */

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

        /* ==================== */
        /* Table Options Modal */
        /* ==================== */

        let tableOptionsModal;
        let settingsIcon;
        let closeTableOptionsModal;

        if (!document.querySelector('#table-options-modal')) {
            // Create the modal element
            tableOptionsModal = document.createElement('div');
            tableOptionsModal.innerHTML = MARKUP.optionsModal;
            document.body.appendChild(tableOptionsModal);
        }

        tableOptionsModal = document.querySelector('#table-options-modal');
        settingsIcon = document.querySelector('#table-options-icon');
        closeTableOptionsModal = document.querySelector(
            '#table-options-modal .close'
        );

        console.log('tableOptionsModal', tableOptionsModal);
        console.log('settingsIcon', settingsIcon);

        function showTableOptionsModal() {
            tableOptionsModal.style.display = 'block';
        }

        function hideTableOptionsModal() {
            tableOptionsModal.style.display = 'none';
        }

        function hideTableOptionsModalEventDriven(e) {
            if (e.target === tableOptionsModal || e.key === 'Escape') {
                hideTableOptionsModal();
            }
        }

        settingsIcon.removeEventListener('click', showTableOptionsModal);
        settingsIcon.addEventListener('click', showTableOptionsModal);

        // Close the modal when the user clicks outside of the menu
        tableOptionsModal.removeEventListener(
            'click',
            hideTableOptionsModalEventDriven
        );

        tableOptionsModal.addEventListener(
            'click',
            hideTableOptionsModalEventDriven
        );

        // Close the modal when the #table-options-modal .close element is clicked
        closeTableOptionsModal.removeEventListener(
            'click',
            hideTableOptionsModal
        );
        closeTableOptionsModal.addEventListener('click', hideTableOptionsModal);

        // Close the modal when the user hits the Esc key
        document.removeEventListener(
            'keydown',
            hideTableOptionsModalEventDriven
        );
        document.addEventListener('keydown', hideTableOptionsModalEventDriven);

        document
            .querySelectorAll('#table-options-modal input[type="checkbox"]')
            .forEach((checkbox) => {
                checkbox.addEventListener('change', () => {
                    toggleDataCellVisibility(checkbox);
                });
            });

        // Check the checkboxes for the columns that are already visible
        const columns = document.querySelectorAll('#liked-images-table th');
        columns.forEach((column) => {
            const checkbox = document.querySelector(
                `#table-options-modal input[name="${column.getAttribute(
                    'data-name'
                )}"]`
            );
            checkbox.checked = column.style.display !== 'none';
        });
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

    /**
     * Displays the liked images in a table, based on the data stored in localStorage.
     * Also provides filtering functionality based on user input.
     */
    function displayLikedImages() {
        console.log('calling displayLikedImages');
        const imagesList = getImagesList();
        const tableBody = document.getElementById('liked-images-list');
        tableBody.innerHTML = '';

        imagesList.forEach((imageData) => {
            // set the <img> element with imageData.imageCounter to a variable
            const imageElement = document.querySelector(
                `img[data-imagecounter="${imageData.imageCounter}"]`
            );

            const imageOuterHTML = imageElement ? imageElement.outerHTML : '';

            const row = `<tr>
                <td>${imageData.isLiked}</td>
                <td>${imageData.imageCounter}</td>
                <td>${imageData.prompt}</td>
                <td>${imageData.steps}</td>
                <td>${imageData.guidance}</td>
                <td>${imageData.seed}</td>
                <td>${imageData.model}</td>
                <td>${imageOuterHTML}</td>
                <td>${imageData.negativePrompt}</td>
                <td>${imageData.size}</td>
                <td>${imageData.sampler}</td>
                <td>${imageData.clipSkip}</td>
                <td>${imageData.VAE}</td>
                <td>${imageData.outputFormat}</td>
                <td>${imageData.outputQuality}</td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });

        // Hide values for columns that are unchecked
        document
            .querySelectorAll('#table-options-modal input[type="checkbox"]')
            .forEach((checkbox) => {
                toggleDataCellVisibility(checkbox);
            });
    }

    const injectLikedImagesListeners = () => {
        const filterInput = document.querySelector('#filter-input');
        const clearButton = document.querySelector('#clear-filter');

        // Add event listener to filter input
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

        // Add event listener to clear button
        clearButton.addEventListener('click', function () {
            filterInput.value = '';
            filterInput.dispatchEvent(new Event('input'));
        });
    };

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

    function logSavedData() {
        console.log('Promptfield value: ', promptField.value);
        // let likedImages = localStorage.getItem('likedImages');
        // console.log('Saved Liked Images:', likedImages);
    }

    const likeImage = (imagesList, index) => {
        console.log('imagesList', imagesList);
        console.log('index', index);
        console.log('imagesList[index] before', imagesList[index]);
        imagesList[index].isLiked = true;
        console.log('imagesList[index] after', imagesList[index]);
        console.log('what is being returned', imagesList);
        return imagesList;
    };

    const unlikeImage = (imagesList, index) => {
        imagesList[index].isLiked = false;
        return imagesList;
    };

    const getImagesList = () => {
        const imagesList =
            JSON.parse(localStorage.getItem('likedImages')) || [];
        return imagesList;
    };

    function saveImageData(imagesList, imageData = null) {
        if (imageData) {
            imagesList.push(imageData);
        }
        localStorage.setItem('likedImages', JSON.stringify(imagesList));
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

    function setImageData(
        origRequest = null,
        imageElement = null,
        isLiked = false
    ) {
        let imageData;
        console.log('before imageCounter', imageCounter);
        incImageCounter();
        console.log('after imageCounter', imageCounter);
        if (!origRequest || !imageElement) {
            const prompt = promptField.value
                .split('\n')
                .filter((foo) => foo)[0];
            imageData = {
                imageCounter,
                prompt,
                steps: numInferenceStepsField.value,
                guidance: guidanceScaleField.value,
                seed: seedField.value,
                model: stableDiffusionModelField.value,
                negativePrompt: negativePromptField.value,
                size: `${widthField.value}x${heightField.value}`,
                sampler: samplerField.value,
                clipSkip: clipSkipField.checked,
                VAE: vaeModelField.value,
                outputFormat: outputFormatField.value,
                outputQuality: outputQualityField.value,
                isLiked: isLiked,
            };
        } else {
            imageData = {
                // src: imageElement.getAttribute('src'),
                imageCounter: imageElement.getAttribute('data-imagecounter'),
                prompt: origRequest.prompt,
                steps: origRequest.num_inference_steps,
                guidance: origRequest.guidance_scale,
                seed: origRequest.seed,
                model: origRequest.use_stable_diffusion_model,
                negativePrompt: origRequest.negative_prompt,
                size: `${origRequest.width}x${origRequest.height}`,
                sampler: origRequest.sampler_name,
                clipSkip: origRequest.clip_skip,
                VAE: origRequest.use_vae_model,
                outputFormat: origRequest.output_format,
                outputQuality: origRequest.output_quality,
                isLiked: isLiked,
            };
        }
        console.log('imageData', imageData);
        return imageData;
    }

    const toggleDataCellVisibility = (checkbox) => {
        const columnIndex = Array.from(
            document.querySelector('#liked-images-table thead tr').children
        ).findIndex((th) => th.getAttribute('data-name') === checkbox.name);
        const column = document.querySelector(
            `thead th[data-name="${checkbox.name}"]`
        );
        column.style.display = checkbox.checked ? '' : 'none';
        document
            .querySelectorAll(`#liked-images-table tbody tr`)
            .forEach((row) => {
                row.children[columnIndex].style.display = checkbox.checked
                    ? ''
                    : 'none';
            });
    };

    function toggleLike(origRequest, imageElement) {
        // Toggle glow effect
        var imgContainer = imageElement.closest('.imgContainer');
        if (imgContainer) {
            imgContainer.style.boxShadow = imgContainer.style.boxShadow
                ? ''
                : '0 0 20px rgba(50, 205, 50, 0.7)';
        }

        const imageCounter = imageElement.getAttribute('data-imagecounter');
        let imagesList = getImagesList();

        let isLiked = false;
        let imageIndex = null;

        // Check if image is already liked
        imagesList.forEach((img, index) => {
            if (img.imageCounter === parseInt(imageCounter)) {
                isLiked = img.isLiked;
                imageIndex = index;
            }
        });

        console.log('imageIndex', imageIndex);
        console.log('isLiked', isLiked);

        // If image is already liked, unlike it
        if (isLiked) {
            imagesList = unlikeImage(imagesList, imageIndex);
        } else {
            // Otherwise, like it
            imagesList = likeImage(imagesList, imageIndex);
        }

        // Prepare image data
        // var imageData = {
        //     // src: imageElement.getAttribute('src'),
        //     imageCounter: imageElement.getAttribute('data-imagecounter'),
        //     prompt: origRequest.prompt,
        //     steps: origRequest.num_inference_steps,
        //     guidance: origRequest.guidance_scale,
        //     seed: origRequest.seed,
        //     model: origRequest.use_stable_diffusion_model,
        //     negativePrompt: origRequest.negative_prompt,
        //     size: `${origRequest.width}x${origRequest.height}`,
        //     sampler: origRequest.sampler_name,
        //     clipSkip: origRequest.clip_skip,
        //     VAE: origRequest.use_vae_model,
        //     outputFormat: origRequest.output_format,
        //     outputQuality: origRequest.output_quality,
        // };

        // Save or remove the liked image data
        saveImageData(imagesList);
    }

    // Utility function to log saved data

    // Toggle like function

    async function init() {
        // Clear the liked images from local storage
        localStorage.removeItem('likedImages');

        // load the liked images demo data
        await loadDemoData();

        // Inject the Liked Images tab
        injectLikedImagesTab();

        // Add listeners to images tab
        injectLikedImagesListeners();

        // Add show modal functionality
        addShowModalFunctionality();

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
