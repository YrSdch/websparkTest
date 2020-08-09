document.addEventListener('DOMContentLoaded', function () {
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  testWebP(function (support) {
    if (support == true) {
      document.querySelector('body').classList.add('webp');
    } else {
      document.querySelector('body').classList.add('no-webp');
    }
  });

  $(function () {
    var dateFormat = "mm/dd/yy",
        from = $("#from").datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3
    }).on("change", function () {
      to.datepicker("option", "minDate", getDate(this));
    }),
        to = $("#to").datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3
    }).on("change", function () {
      from.datepicker("option", "maxDate", getDate(this));
    });

    function getDate(element) {
      var date;
      try {
        date = $.datepicker.parseDate(dateFormat, element.value);
      } catch (error) {
        date = null;
      }

      return date;
    }
  });
});