(function (win, doc) {
    'use strict';

    var $menuTriggers = doc.querySelectorAll('[data-js-menu-trigger]'),
        $menu = doc.querySelector('#main-menu');

        for (var i = $menuTriggers.length - 1; i >= 0; i--) {
            $menuTriggers[i].addEventListener('click', function (event) {
                var activeIndex = $menu.className.indexOf('main-menu--active');

                if (activeIndex !== -1){
                    $menu.className = $menu.className.substring(0, activeIndex);
                } else {
                    $menu.className += ' main-menu--active';
                }
            }, true)
        };

})(window, document); 