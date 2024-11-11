(function ($) {
  "use strict";
  $(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
    if (!$(this).next().hasClass("show")) {
      $(this)
        .parents(".dropdown-menu")
        .first()
        .find(".show")
        .removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass("show");
    $(this)
      .parents("li.nav-item.dropdown.show")
      .on("hidden.bs.dropdown", function (e) {
        $(".dropdown-submenu .show").removeClass("show");
      });
    return false;
  });
  $(document).on("ready", function () {
    $("[data-background]").each(function () {
      $(this).css(
        "background-image",
        "url(" + $(this).attr("data-background") + ")"
      );
    });
  });
  $(".search-btn").on("click", function () {
    $(".search-area").toggleClass("open");
  });
  $(".sidebar-btn").on("click", function () {
    $(".sidebar-popup").addClass("open");
    $(".sidebar-wrapper").addClass("open");
  });
  $(".close-sidebar-popup, .sidebar-popup").on("click", function () {
    $(".sidebar-popup").removeClass("open");
    $(".sidebar-wrapper").removeClass("open");
  });
  new WOW().init();
  $(".hero-slider").owlCarousel({
    loop: true,
    nav: true,
    dots: false,
    margin: 0,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 5000,
    items: 1,
    navText: [
      "<i class='far fa-long-arrow-left'></i>",
      "<i class='far fa-long-arrow-right'></i>",
    ],
    onInitialized: function (event) {
      var $firstAnimatingElements = $(".owl-item")
        .eq(event.item.index)
        .find("[data-animation]");
      doAnimations($firstAnimatingElements);
    },
    onChanged: function (event) {
      var $firstAnimatingElements = $(".owl-item")
        .eq(event.item.index)
        .find("[data-animation]");
      doAnimations($firstAnimatingElements);
    },
  });
  function doAnimations(elements) {
    var animationEndEvents =
      "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    elements.each(function () {
      var $this = $(this);
      var $animationDelay = $this.data("delay");
      var $animationDuration = $this.data("duration");
      var $animationType = "animated " + $this.data("animation");
      $this.css({
        "animation-delay": $animationDelay,
        "-webkit-animation-delay": $animationDelay,
        "animation-duration": $animationDuration,
        "-webkit-animation-duration": $animationDuration,
      });
      $this.addClass($animationType).one(animationEndEvents, function () {
        $this.removeClass($animationType);
      });
    });
  }
  $(".testimonial-slider").owlCarousel({
    loop: true,
    margin: 30,
    nav: false,
    dots: true,
    autoplay: true,
    responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 4 } },
  });
  $(".partner-slider").owlCarousel({
    loop: true,
    margin: 25,
    nav: false,
    dots: false,
    autoplay: true,
    responsive: { 0: { items: 2 }, 600: { items: 3 }, 1000: { items: 6 } },
  });
  $(window).on("load", function () {
    $(".preloader").fadeOut("slow");
  });
  $(".counter").countTo();
  $(".counter-box").appear(
    function () {
      $(".counter").countTo();
    },
    { accY: -100 }
  );
  $(".popup-gallery").magnificPopup({
    delegate: ".popup-img",
    type: "image",
    gallery: { enabled: true },
  });
  $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });
  $(window).scroll(function () {
    if (
      document.body.scrollTop > 100 ||
      document.documentElement.scrollTop > 100
    ) {
      $("#scroll-top").addClass("active");
    } else {
      $("#scroll-top").removeClass("active");
    }
  });
  $("#scroll-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 1500);
    return false;
  });
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").addClass("fixed-top");
    } else {
      $(".navbar").removeClass("fixed-top");
    }
  });
  if ($("#countdown").length) {
    $("#countdown").countdown("2028/01/30", function (event) {
      $(this).html(
        event.strftime(
          "" +
            '<div class="row">' +
            '<div class="col countdown-single">' +
            '<h2 class="mb-0">%-D</h2>' +
            '<h5 class="mb-0">Day%!d</h5>' +
            "</div>" +
            '<div class="col countdown-single">' +
            '<h2 class="mb-0">%H</h2>' +
            '<h5 class="mb-0">Hours</h5>' +
            "</div>" +
            '<div class="col countdown-single">' +
            '<h2 class="mb-0">%M</h2>' +
            '<h5 class="mb-0">Minutes</h5>' +
            "</div>" +
            '<div class="col countdown-single">' +
            '<h2 class="mb-0">%S</h2>' +
            '<h5 class="mb-0">Seconds</h5>' +
            "</div>" +
            "</div>"
        )
      );
    });
  }
  let date = new Date().getFullYear();
  $("#date").html(date);
  $(".select").niceSelect();
  $(window).on("load", function () {
    if ($(".filter-box").children().length > 0) {
      $(".filter-box").isotope({
        itemSelector: ".filter-item",
        masonry: { columnWidth: 1 },
      });
      $(".filter-btns").on("click", "li", function () {
        var filterValue = $(this).attr("data-filter");
        $(".filter-box").isotope({ filter: filterValue });
      });
      $(".filter-btns li").each(function () {
        $(this).on("click", function () {
          $(this).siblings("li.active").removeClass("active");
          $(this).addClass("active");
        });
      });
    }
  });
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  $(".profile-img-btn").on("click", function () {
    $(".profile-img-file").click();
  });
  if ($(".date-picker").length) {
    $(function () {
      $(".date-picker").datepicker();
    });
  }
  if ($(".time-picker").length) {
    $(function () {
      $(".time-picker").timepicker();
    });
  }
})(jQuery);





function switchLanguage(language) {
  const googleTranslateElement = new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,de',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
  }, 'google_translate_element');

  googleTranslateElement.showBanner(language);
}





// tostify .....................


(function ($) {
  "use strict";

  $(document).ready(function () {
    $('#bookingForm').on('submit', function (event) {
      event.preventDefault(); // Prevent default form submission

      // Serialize form data
      const formData = $(this).serialize();

      // AJAX call to send data to the server
      $.ajax({
        url: $(this).attr('action'), // Ensure your form action points to "/api/bookings"
        method: $(this).attr('method'), // "POST" method in the form
        data: formData,
        success: function (response) {
          showToast(response.message || "Booking saved successfully.", "success"); // Show success toast
        },
        error: function (xhr) {
          let errorMessage = "An error occurred. Please try again.";

          if (xhr.status === 409) {
            errorMessage = "Data already present."; // Handle duplicate booking error
          } else if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMessage = xhr.responseJSON.message;
          }

          showToast(errorMessage, "error"); // Show error toast
        }
      });
    });

    // Toastify function for displaying messages
    function showToast(message, type) {
      Toastify({
        text: message,
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: type === "success" ? "linear-gradient(to right, #4caf50, #81c784)" : "linear-gradient(to right, #ff5f6d, #ffc371)",
        stopOnFocus: true, // Prevents dismissing of toast on hover
      }).showToast();
    }
  });
})(jQuery);





// City distance data (in kilometers)
const cityDistances = {
  'Berlin-Hamburg': 289,
  'Berlin-Munich': 585,
  'Berlin-Cologne': 571,
  'Berlin-Frankfurt am Main': 545,
  'Hamburg-Munich': 774,
  'Hamburg-Cologne': 360,
  'Hamburg-Frankfurt am Main': 492,
  'Munich-Cologne': 574,
  'Munich-Frankfurt am Main': 394,
  'Cologne-Frankfurt am Main': 191,
  'Berlin-Stuttgart': 582,
  'Berlin-Düsseldorf': 535,
  'Hamburg-Stuttgart': 681,
  'Hamburg-Düsseldorf': 415,
  'Munich-Stuttgart': 220,
  'Munich-Düsseldorf': 600,
  'Cologne-Stuttgart': 250,
  'Cologne-Düsseldorf': 30,
  'Frankfurt am Main-Stuttgart': 220,
  'Frankfurt am Main-Düsseldorf': 190,
  // Add more cities as needed
};

// Define a basic pricing model
const basePricePerKm = 2; // Price per kilometer
const vehicleTypeMultiplier = {
  "Standard": 1,
  "Hybrid": 1.2,
  "Luxury": 1.5
};

// Define additional multipliers for preferred vehicle models
const vehicleModelMultiplier = {
  "No Preference": 1,
  "Mercedes E-Class": 1.3,
  "BMW 7 Series": 1.4,
  "Audi A8": 1.5
};

// Update price function
function updatePrice() {
  const pickupLocation = document.getElementById("pickup_location").value;
  const dropoffLocation = document.getElementById("dropoff_location").value;
  const passengers = document.getElementById("passengers").value;
  const vehicleType = document.getElementById("vehicle_type").value;
  const vehicleModel = document.getElementById("vehicle_model").value;

  if (pickupLocation && dropoffLocation) {
    // Create the key for city pair (e.g., 'Berlin-Hamburg')
    const cityKey = `${pickupLocation}-${dropoffLocation}`;
    const reverseCityKey = `${dropoffLocation}-${pickupLocation}`;

    // Check if the distance exists in the cityDistances object
    let distance = cityDistances[cityKey] || cityDistances[reverseCityKey];

    if (distance) {
      let price = distance * basePricePerKm; // Calculate the price based on distance
      price *= vehicleTypeMultiplier[vehicleType]; // Apply vehicle type multiplier
      price *= vehicleModelMultiplier[vehicleModel]; // Apply vehicle model multiplier

      // Add extra cost based on the number of passengers (optional)
      if (passengers > 4) {
        price += (passengers - 4) * 5; // For example, $5 extra for each passenger above 4
      }

      // Display the estimated price
      document.getElementById("estimated_price").value = `€${price.toFixed(2)}`;

      // Save the booking data
      saveBookingData(pickupLocation, dropoffLocation, passengers, vehicleType, vehicleModel, price);
    }
  }
}

// Save booking data to the database
function saveBookingData(pickupLocation, dropoffLocation, passengers, vehicleType, vehicleModel, price) {
  const pickupDate = document.getElementById("pickup_date").value;
  const pickupTime = document.getElementById("pickup_time").value;

  // Prepare the booking data
  const bookingData = {
    pickup_location: pickupLocation,
    dropoff_location: dropoffLocation,
    passengers: passengers,
    vehicle_type: vehicleType,
    vehicle_model: vehicleModel,
    pickup_date: pickupDate,
    pickup_time: pickupTime,
    price: price
  };

  // Send the data to the server via POST request
  fetch('http://localhost:5050/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  })
  .then(response => response.json())
  .then(data => {
    if (data === "Booking saved successfully") {
      alert("Booking has been successfully saved!");
    } else {
      alert("There was an error saving the booking.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("An error occurred. Please try again later.");
  });
}

// Attach event listeners to fields that affect pricing
document.getElementById("pickup_location").addEventListener("change", updatePrice);
document.getElementById("dropoff_location").addEventListener("change", updatePrice);
document.getElementById("passengers").addEventListener("input", updatePrice);
document.getElementById("vehicle_type").addEventListener("change", updatePrice);
document.getElementById("vehicle_model").addEventListener("change", updatePrice);

// Trigger the price update function when the page loads
window.addEventListener("load", updatePrice);
