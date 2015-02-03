!function ($, win, doc) {

    "use strict"; // jshint ;_;

    var ss = win.SS;

    var ssValidator = new function() {

        this.validationTypes = [
            ".required",
            ".required-phone",
            // ".required-email",
            ".required-password",
            ".required-password-confirm",
            ".required-checkbox",
            ".required-numbers-only",
            ".required-suburb",
            ".required-textarea"

        ];

        this.validationMessages = {
            "required" : "This field is required",
            "required-phone" : "Please enter a valid phone number e.g. 0412 345 678 or 02 9123 4567",
            "required-email" : "Please enter a proper email address e.g. you@yoursite.com",
            "required-password" : "Please type at least 6 characters",
            "required-password-confirm" : "Your passwords do not match. Please try again",
            "required-checkbox" : "Please check at least one checkbox",
            "required-numbers-only" : "Required. Please enter only numbers",
            "required-suburb" : "Required. Please provide an Australian suburb or postcode",
            "required-textarea" : "Required. Please type between 3 and 250 characters"

        };


        // Used during the submission to scroll to the div with an error
        this.scrollToQuestion = function(question) {
            $('html,body').animate({scrollTop: question.offset().top-20},'slow');
        }


        // Used during the submission to scroll to the div with an error
        this.scrollToAnchor = function(aid){
            var aTag = $("a[name='"+ aid +"']");
            $('html,body').animate({scrollTop: aTag.offset().top-20},'slow');
        };

        /* function validField will check if a field is valid and update its style and button appropriately */
        this.validField = function(type, field){
            if (!this.validate(type, field)) {
                field.parents(".grey-box").addClass("error-field").removeClass("current-field");
                field.parents(".grey-box").find(".tooltip").hide();
                $('.email-confirm').remove();
                if (field.parents(".grey-box").find(".errortip").length == 0) {
                    var newError = "<div class='errortip mt5'>" + this.validationMessages[type] + "</div>";
                    field.parents(".grey-box").find(".question-message").append(newError);
                }
                field.parents(".grey-box").find(".errortip").show();
                return false;
            }
            else {
                field.parents(".grey-box").removeClass("error-field");
                field.parents(".grey-box").find(".errortip").hide();
                return true;
            }
        };

    /* function validate returns true if the input is valid for the corresponding class */
        this.validate = function(type, field) {
            switch (type) {
            case "required":
                if (field.val()) {
                    return true;
                }
                break;
            case "required-phone":
                var pattern = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/;
                return pattern.test(field.val());
            case "required-email":
                var pattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/;
                return pattern.test(field.val());
            case "required-password":
                if (field.val().length >= 6) {
                    return true;
                }
                break;
            case "required-password-confirm":
                if (field.val() === $("#user_password").val()) {
                    return true;
                }
                break;
            case "required-checkbox":
                if (field.parents(".grey-box").find("input:checked").length >= 1) {
                    return true;
                }
                break;
            case "required-numbers-only":
                var pattern = /^[0-9]+$/;
                return pattern.test(field.val());
            case "required-suburb":
                if (field.val().length >= 3 && field.val().length <= 100) {
                    return true;
                }
                break;
            case "required-textarea":
                if (field.val().length >= 3 && field.val().length <= 250) {
                    return true;
                }
                break;
            default:
                return false;
            }
            return false;
        };

        // function getValidationType will check if a string of classes contain any of the possible validation types and will return that
        this.getValidationType = function(classString) {
            if (classString) {
                var classArray = classString.split(" ");
                for (var i=0; i < classArray.length; i++) {
                    for (var j=0; j < this.validationTypes.length; j++) {
                        if ("." + classArray[i] == this.validationTypes[j]) {
                            return classArray[i];
                        }
                    }
                }
            }
            return false;
        };

    }

    $(doc).ready(function () {

        if (ss.currentPage.is('#landing-page-twb')) {

            if ($('.datepicker').length > 0) {
                $('.datepicker').datepicker({
                    format: 'dd-mm-yyyy'
                });
            }
            $('input[name="date_query"]').change(function() {
                $('#date_question').toggle();
            });
            $("input, select, textarea").focus(function() {
                var parentBox = $(this).parents(".grey-box");
                if (!parentBox.hasClass("error-field")) {
                    parentBox.addClass("current-field");
                    parentBox.find(".tooltip").show();
                }
            });

            $("input, select, textarea").blur(function() {
                    $(this).parents(".grey-box").removeClass("current-field");
                    $(this).parents(".grey-box").find(".tooltip").hide();
            });

            var validationClasses = ssValidator.validationTypes.join(",");

            // Checks the if the field is valid when the value is changed
            $(validationClasses).change( function(event) {
                ssValidator.validField(ssValidator.getValidationType(event.target.className), $(this));
            });

            // Checks the if the field is valid when field loses focus. It adds a class checked if it doesn't have it.
            $(validationClasses).blur( function(event) {
                var thisField = $(this);
                // if the field is a date, only check it if the datepicker drowdown is gone
                if (thisField.hasClass('datepicker')) {
                    if (!$('.datepicker-dropdown').length >= 1) {
                        ssValidator.validField(ssValidator.getValidationType(event.target.className), thisField);
                    }
                }
                else {
                    if (!thisField.hasClass("checked")) {
                        thisField.addClass("checked");
                    }
                    ssValidator.validField(ssValidator.getValidationType(event.target.className), thisField);
                }
            });

            // Checks on keyup if the field has been previously checked
            $(validationClasses).keyup( function(event) {
                var thisSelect = $(this);
                if (thisSelect.hasClass("checked")) {
                    ssValidator.validField(ssValidator.getValidationType(event.target.className), thisSelect);
                }
            });


            // $(".required-password").keyup( function() {
            //     var pwConfirm = $(".required-password-confirm")
            //     if (pwConfirm.val() != "" ){
            //         ssValidator.validField("required-password-confirm", pwConfirm );
            //     }
            // });

            // Fires on form submission. Checks whether all of the fields are valid and scrolls up to the invalid field if there is one
            $("#new_job").submit(function() {

                // Test email
                $('#user_email').focusout();
                if ($('#user_email').is(':visible')) {
                    if ($('.email-confirmed').length === 0) {
                        $('#user_password, #user_password_confirm, #user_name, #user_phone').parents('.control-group').show();
                    }
                }
                if (typeof writeName == 'function') {
                    writeName();
                }
                if (typeof writeDesc == 'function') {
                    writeDesc();
                }
                if (typeof setHidden == 'function') {
                    setHidden();
                }

                var isValid = true;
                var thisInput = null;
                $(ssValidator.validationTypes.join(":visible,") + ":visible").each(function(event) {
                    thisInput = $(this);
                    if (!ssValidator.validField(ssValidator.getValidationType(thisInput.attr("class")), thisInput)) {
                        isValid = false;
                    }
                    if (!thisInput.hasClass("checked")) {
                        thisInput.addClass("checked");
                    }
                });
                if (!isValid){
                    var questionDiv = $(".error-field:visible").first();
                    ssValidator.scrollToQuestion(questionDiv);

                }
                else {

                    $.ajax({
                        url: "http://www.serviceseeking.com.au/jobs/microsite_create",
                        type: "POST",
                        crossDomain: true,
                        data: $("#new_job").serialize(),
                    })
                    .done(function () {
                        window.location.href = "/thank_you.html";
                    })
                    .fail(function (data) {
                        var field = $("#user_password");
                        field.parents(".grey-box").addClass("error-field").removeClass("current-field");
                        field.parents(".grey-box").find(".tooltip").hide();
                        $('.email-confirm').remove();
                        if (field.parents(".grey-box").find(".errortip").length == 0) {
                            var newError = "<div class='errortip mt5'>Wrong username and/or password</div>";
                            field.parents(".grey-box").find(".question-message").append(newError);
                        }
                        field.parents(".grey-box").find(".errortip").show();
                        return false;
                    });
                }

                return false;
            });

        }

    }); // end doc ready

}(window.jQuery, window, document);
