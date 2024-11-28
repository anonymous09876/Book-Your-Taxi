(function ($) {
  "use strict";

  // Dropdown Toggle
  $(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
    e.preventDefault();
    const $subMenu = $(this).next(".dropdown-menu");
    if (!$subMenu.hasClass("show")) {
      $(this).closest(".dropdown-menu").find(".show").removeClass("show");
    }
    $subMenu.toggleClass("show");

    $(this).closest("li.nav-item.dropdown.show").on("hidden.bs.dropdown", function () {
      $(".dropdown-submenu .show").removeClass("show");
    });
  });

  // Background image handler
  $(document).ready(function () {
    $("[data-background]").each(function () {
      const bg = $(this).data("background");
      $(this).css("background-image", `url(${bg})`);
    });
  });

  // Toggle Search Area
  $(".search-btn").on("click", function () {
    $(".search-area").toggleClass("open");
  });

  // Sidebar Handlers
  $(".sidebar-btn").on("click", function () {
    $(".sidebar-popup, .sidebar-wrapper").addClass("open");
  });

  $(".close-sidebar-popup, .sidebar-popup").on("click", function () {
    $(".sidebar-popup, .sidebar-wrapper").removeClass("open");
  });

  // Hero Slider Initialization
  $(".hero-slider").owlCarousel({
    loop: true,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    items: 1,
    navText: [
      "<i class='far fa-long-arrow-left'></i>",
      "<i class='far fa-long-arrow-right'></i>",
    ],
    onInitialized: animateOnSlide,
    onChanged: animateOnSlide,
  });

  // Animation for slider elements
  function animateOnSlide(event) {
    const $animatingElements = $(".owl-item")
      .eq(event.item.index)
      .find("[data-animation]");
    doAnimations($animatingElements);
  }

  function doAnimations(elements) {
    const animationEndEvents = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    elements.each(function () {
      const $this = $(this);
      const delay = $this.data("delay");
      const duration = $this.data("duration");
      const animationType = `animated ${$this.data("animation")}`;

      $this
        .css({ "animation-delay": delay, "animation-duration": duration })
        .addClass(animationType)
        .one(animationEndEvents, function () {
          $this.removeClass(animationType);
        });
    });
  }

  // Testimonial Slider
  $(".testimonial-slider").owlCarousel({
    loop: true,
    margin: 30,
    dots: true,
    autoplay: true,
    responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 4 } },
  });

  // Fixed Navbar
  $(window).scroll(function () {
    $(".navbar").toggleClass("fixed-top", $(this).scrollTop() > 50);
    $("#scroll-top").toggleClass("active", $(this).scrollTop() > 100);
  });

  // Scroll to Top
  $("#scroll-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 1500);
    return false;
  });

  // Countdown Timer
  if ($("#countdown").length) {
    $("#countdown").countdown("2028/01/30", function (event) {
      $(this).html(
        event.strftime(`
          <div class="row">
            <div class="col countdown-single">
              <h2>%-D</h2><h5>Days</h5>
            </div>
            <div class="col countdown-single">
              <h2>%H</h2><h5>Hours</h5>
            </div>
            <div class="col countdown-single">
              <h2>%M</h2><h5>Minutes</h5>
            </div>
            <div class="col countdown-single">
              <h2>%S</h2><h5>Seconds</h5>
            </div>
          </div>`
        )
      );
    });
  }

  // Initialize Year
  $("#date").text(new Date().getFullYear());

  // Initialize Plugins
  $(".select").niceSelect();
  $(".popup-gallery").magnificPopup({ delegate: ".popup-img", type: "image", gallery: { enabled: true } });
  $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({ type: "iframe", mainClass: "mfp-fade" });

  // Tooltips
  [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Filter Functionality
  $(window).on("load", function () {
    $(".filter-box").isotope({ itemSelector: ".filter-item", masonry: { columnWidth: 1 } });
    $(".filter-btns").on("click", "li", function () {
      $(".filter-box").isotope({ filter: $(this).data("filter") });
      $(this).addClass("active").siblings().removeClass("active");
    });
  });
})(jQuery);



function googleTranslateElementInit() {
  new google.translate.TranslateElement(
      {
          pageLanguage: 'en',
          includedLanguages: 'en,de', // Include only English and German
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      },
      'google_translate_element'
  );
}

// Load the Google Translate script
(function() {
  var gtScript = document.createElement('script');
  gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(gtScript);
})();