(function () {
    'use strict';

    console.log('xxyyxx loading Generation Ratings Catalog plugin...');
    PLUGINS['IMAGE_INFO_BUTTONS'].push({
        html: '<i class="fa-solid fa-thumbs-up"></i> Like',
        on_click: likeImage,
    });

    function likeImage(origRequest, image) {
        // Toggle glow effect
        var imgContainer = image.closest('.imgContainer');
        if (imgContainer) {
            imgContainer.style.boxShadow = imgContainer.style.boxShadow
                ? ''
                : '0 0 20px rgba(50, 205, 50, 0.7)';
        } else {
            console.warn('Could not find imgContainer for image:', image);
        }

        // Log image ID
        console.log('Liked image ID:', image.image_id);
    }
})();
