$(function() {
  $(".bs-wizard").bs_wizard({beforeNext: before_next});
  $('#last-back').click($(".bs-wizard").bs_wizard('go_prev'));
  $('#signup_form').validate_popover({
    onsubmit: false,
    rules: {
      'client[firstname]': {
        required: true,
        minlength: 2,
        maxlength: 20
      },
      'client[lastname]': {
        required: true,
        minlength: 2,
        maxlength: 20
      },
      'client[tel]': {
        required: true,
        minlength: 9,
        maxlength: 10,
        digits: true,
      },
      'client[mobile]': {
        required: true,
        minlength: 9,
        maxlength: 10,
        digits: true
      },
      'website[company]': {
        required: true,
        minlength: 2,
        maxlength: 320
      },
      'website[address]': {
        required: true,
        minlength: 2,
        maxlength: 120
      },
      'website[city]': {
        required: true,
        minlength: 2,
        maxlength: 20
      },
      'website[zipcode]': {
        required: true,
        minlength: 5,
        maxlength: 10,
        digits: true
      },
      // 'website[sub_name]': {
      //  required: true,
      //   minlength: 5,
      //   maxlength: 20
      // },
      // 'website[locales][]': {
      //  required: true,
      //   minlength: 1
      // }
    }
  });

  $(".submit-btn").click(function(ev) {
    ev.preventDefault();
    return false;
  });

  $('[name="website[locales][]"]').click(manipulate_locales);

  $('#btn-signup').click(submit_signup);
  $(window).keydown(function(event) {
    if (event.keyCode === 13) {
      return submit_signup(event);
    }
  });

  function validate_fields(fields, step) {
    var error_step, field, _i, _len;
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      field = fields[_i];
      if (!form_validator().element(field)) {
        error_step = step;
      }
    }
    return error_step != null ? error_step : true;
  }

  function form_validator() {
    return $('#signup_form').validate();
  }

  function current_step() {
    return $(".bs-wizard").bs_wizard('option', 'currentStep');
  }

  function build_span_label(lable) {
    return "<span class='label label-success'>" + lable + "</span>";
  }

  function before_next() {
    if (current_step() == 1) return validate_fields($('#client_email, #client_firstname, #client_lastname, #client_tel, #client_mobile'), 1) === true;
    if (current_step() == 2) {
      if (validate_fields($('#website_company, #website_address,  #website_city, #website_zipcode '), 2) !== true) return false;
      $('#r-email').html($('#client_email').val());
      $('#r-firstname').html($('#client_firstname').val());
      $('#r-lastname').html($('#client_lastname').val());
      $('#r-tel').html($('#client_tel').val());
      $('#r-mobile').html($('#client_mobile').val());
      $('#r-company').html($('#client_company').val());
      $('#r-address').html($('#website_address').val());
      $('#r-city').html($('#website_city').val());
      $('#r-zipcode').html($('#website_zipcode').val());
      
      locales = [];
      $('[name="website[locales][]"]:checked').each(function() {
        return locales.push(build_span_label($(this).val()));
      });
      $('#r-locales').html(locales.join(' '));
      $('#r-dlocale').html($("#website_default_locale").val());

      pages = [build_span_label('Home')];
      $("input[name='website[predefined_pages][]']:checked").each(function() {
        return pages.push(build_span_label($(this).val()));
      });
      $('#r-pages').html(pages.join(' '));
      return true;
    }
    return false;
  }

  LOCALES = {'en': 'English', 'zh-CN': 'Simple Chinese'};

  function manipulate_locales() {
    var locale;
    locale = $(this).val();
    if ($(this).is(':checked')) {
      if ($("#opt-" + locale).length === 0) {
        $("#website_default_locale").append($("<option value='" + locale + "' id='opt-" + locale + "'>" + LOCALES[locale] + "</option>"));
      }
    } else {
      $("#opt-" + locale).remove();
    }
  }

  function submit_signup(ev) {
    validate_fields($('#agreeToTheTerms'), 4);
  }

  $(window).resize(function() {
      $.validator.reposition();
  });

});