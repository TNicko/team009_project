

  $('.chb').click(function() {

    var chb_type = $(this).attr('id')

    // check
    if ($(this).is(':checked')) {
        if (chb_type == "chb_hardware") {
            $('<p>Test</p>').insertAfter("#hardware_list p:first-child");
            $("#hardware_input").css("display", "flex");
        } 
        else if (chb_type == "chb_software") {
            $("#software_input").css("display", "flex");
        }
        else if (chb_type == "chb_network") {
        
        }
        else if (chb_type == "chb_other") {
            $("#other_input").css("display", "flex");
        }
    }
    // uncheck
    if (!$(this).is(':checked')) {
        if (chb_type == "chb_hardware") {
            
            $("#hardware_input").hide();
        } 
        else if (chb_type == "chb_software") {
            $("#software_input").hide();
        }
        else if (chb_type == "chb_network") {
        
        }
        else if (chb_type == "chb_other") {
            $("#other_input").hide();
        }
    }
  });


$('#submit-problem-btn').click(function() {
    console.log("CLICKED");
}); 