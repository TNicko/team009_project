$('.chb').click(function () {

    var chb_type = $(this).attr('id')

    // check
    if ($(this).is(':checked')) {
        if (chb_type == "chb_hardware") {
            $("#hardware_input").css("display", "flex");
        } else if (chb_type == "chb_software") {
            $("#software_input").css("display", "flex");
        } else if (chb_type == "chb_network") {

        } else if (chb_type == "chb_other") {
            $("#other_input").css("display", "flex");
        }
    }
    // uncheck
    if (!$(this).is(':checked')) {
        if (chb_type == "chb_hardware") {

            $("#hardware_input").hide();
        } else if (chb_type == "chb_software") {
            $("#software_input").hide();
        } else if (chb_type == "chb_network") {

        } else if (chb_type == "chb_other") {
            $("#other_input").hide();
        }
    }
});

$('#add_hardware_btn').click(function () {
    const inputDiv = document.createElement("div");
    inputDiv.className = "hardware_input_sec";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "pt_input_field";
    input.list = "hardware_list";
    input.placeholder = "hardware id";
    const btnDiv = document.createElement("div");
    btnDiv.className = "input_del";
    const btn = document.createElement("button");
    btn.className = "delete_input_btn";
    btn.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
    // Delete button clicked -> delete input field
    btn.addEventListener("click", function () {
        $(this).parent().parent().remove();
    });

    btnDiv.append(btn);
    inputDiv.append(input);
    inputDiv.append(btnDiv);

    $(inputDiv).insertAfter("#hardware_input .hardware_input_sec:last");
});

$('#add_software_btn').click(function () {
    const inputDiv = document.createElement("div");
    inputDiv.className = "software_input_sec";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "pt_input_field";
    input.list = "software_list";
    input.placeholder = "software id";
    const btnDiv = document.createElement("div");
    btnDiv.className = "input_del";
    const btn = document.createElement("button");
    btn.className = "delete_input_btn";
    btn.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
    // Delete button clicked -> delete input field
    btn.addEventListener("click", function () {
        $(this).parent().parent().remove();
    });

    btnDiv.append(btn);
    inputDiv.append(input);
    inputDiv.append(btnDiv);

    $(inputDiv).insertAfter("#software_input .software_input_sec:last");
});


$('#submit-problem-btn').click(function () {
    console.log("CLICKED");
}); 