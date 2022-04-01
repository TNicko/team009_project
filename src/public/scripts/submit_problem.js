

  $('.chb').click(function() {

    var chb_type = $(this).attr('id')

    // check
    if ($(this).is(':checked')) {
        if (chb_type == "chb_hardware") {
            $("#hardware_input").show();
        } 
        else if (chb_type == "chb_software") {
            $("#software_input").show();
        }
        else if (chb_type == "chb_network") {
        
        }
        else if (chb_type == "chb_other") {
            $("#other_input").show();
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