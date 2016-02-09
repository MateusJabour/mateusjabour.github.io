(function (win, doc) {
    'use strict';

    function app () {
        var $openMenuButton = doc.querySelector('[data-js="open-menu-button"]');
        var $closeMenuButton  = doc.querySelector('[data-js="close-menu-button"]');
        var $menu = doc.querySelector('[data-js="main-menu"]');

        return {

        init: function init () {
            this.initEvents();
        },

        initEvents: function initEvents () {
            $openMenuButton.addEventListener('click', this.openMenu);
            $closeMenuButton.addEventListener('click', this.closeMenu);
        },

        openMenu: function openMenu (event) {
            event.preventDefault();
            $menu.className += ' main-header__menu--active';
        },

        closeMenu: function closeMenu (event) {
            event.preventDefault();
            var index = $menu.className.indexOf(' main-header__menu--active');
            $menu.className = $menu.className.slice(0, index);
        }

        }
    }
    app().init();

})(window, document); 