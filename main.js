(function () {
    'use strict';

    console.log('xxyyxx loading Generation Ratings Catalog plugin...');
    PLUGINS['IMAGE_INFO_BUTTONS'].push({
        html: '<i class="fa-solid fa-thumbs-up"></i> Like',
        on_click: likeImage,
    });

    function likeImage(origRequest, image) {
        // Sanity check: console.log a confirmation message
        console.log('Image liked.');

        // You can access the image info using `this`. For example:
        // let img_info = this.image_info;
        // console.log('Liked image ID:', img_info.image_id);

        // Further implementation goes here...
    }
})();
