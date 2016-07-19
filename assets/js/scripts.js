(function (win, doc) {
    'use strict';

    function app () {
        var $openMenuButton = doc.querySelector('[data-js="open-menu-button"]');
        var $closeMenuButton  = doc.querySelector('[data-js="close-menu-button"]');
        var $menu = doc.querySelector('[data-js="main-menu"]');

        function init () {
          initEvents();
        }

        function initEvents () {
          $openMenuButton.addEventListener('click', openMenu);
          $closeMenuButton.addEventListener('click', closeMenu);
        }

        function openMenu (event) {
          event.preventDefault();
          $menu.className += ' main-header__menu--active';
        }

        function closeMenu (event) {
          event.preventDefault();
          var index = $menu.className.indexOf(' main-header__menu--active');
          $menu.className = $menu.className.slice(0, index);
        }

        return {
          init: init
        }
    }
    app().init();

})(window, document);
