jQuery(document).ready(function() {
    
    var responseCode = { 
        undefined: 0,
        success: 1, 
        validationFailed: 9,
        userExist: 50,
        wrongFaculty: 20
    }

    setupFirstStep();
    $('.loginFormBtn').on('click', authsAction);
    $('.registerFormBtn').on('click', regAction);
    

    //
    // ======= Auth action =======
    //
    function authsAction(event) {
        event.preventDefault();
        // hideAllMessages();
        console.log("Login form action");
        //Отправляем данные 

        var authData = {
            username: $('.loginInput').val(),
            password: $('.passwordInput').val()
        };
        var link = "../bsuldap.php";
        $.post( link, authData)
        .done(function(response) {
            authSuccessHandler(response, authData);
        })
        .fail(authFailHandler);
    }

    function authSuccessHandler(response, authData) {
        console.log("AUTH did get response");
        console.log(response);
        hideAllMessages();

        //Показываем второй шаг регистрации
        showStep2();
        //isStudent
        if (response.isStudent) {
            //Заполняем данными с ответа
            $('.passwordInput2').val(authData.password);
            $('.loginInput2').val(authData.username);
            $('.firstNameInput').val(response.name);
            $('.lastNameInput').val(response.surname);
            $('.midNameInput').val(response.patronymic);
			$('.hideStep2').hide();
			
            $('.firstNameInput').prop('readonly', response.name);
            $('.lastNameInput').prop('readonly', response.surname);
            $('.midNameInput').prop('readonly', response.patronymic);
        } else {
            //SHOW not authenticated form
            console.log("User not authenticated");
            showStep2();
            showStep2Warning("Невозможно провести авторизацию на серверах БГУ по Вашему логину и паролю. Вы можете вернуться назад и повторить ввод данных либо продолжить регистрацию с последующей модерацией вручную.");
        } 
    }

    function authFailHandler(error) {
        console.log("Error Auth:");
        console.log(error);
        console.log(error.responseJSON.message);

        hideAllMessages();
        var code = error.responseJSON.code
        if (code && code == responseCode.wrongFaculty) {
            showStep2();
            showStep2Warning("Невозможно провести авторизацию на серверах БГУ по Вашему логину и паролю. Вы можете вернуться назад и повторить ввод данных либо продолжить регистрацию с последующей модерацией вручную.");
            $('.passwordInput2').val($('.passwordInput').val());
            $('.loginInput2').val($('.loginInput').val());
            $('.passwordInput2').show();
        	$('.loginInput2').show();
            $('.passwordLabel2').show();
            $('.loginLabel2').show();
        } else if (code && code == responseCode.validationFailed) {
            var msg = error.responseJSON.message + ": " + error.responseJSON.description;
            showStep1Error(msg);
        } else {
            showStep1Error(error.responseJSON.message);
        }
    }

    //
    // === Registration action === 
    //
    function regAction(event) {
        event.preventDefault();
        hideAllMessages();
        console.log("Register form action");
        var data = $(".registerForm").serialize();
        console.log("posting data");
        console.log(data);
        $.post("../reguser.php", data).done(regSuccessHandler).fail(regFailHandler);
    } 

    function regSuccessHandler(response) {
        console.log("Registration success");
        console.log(response);
        hideAllMessages();
        showStep3(response.message);
    } 

    function regFailHandler(error) {
        console.log("Registration failed");
        console.log(error);
        var code = error.responseJSON.code;
        if (code && code == responseCode.validationFailed) {
            var msg = error.responseJSON.message + ": " + error.responseJSON.description;
            showStep2Error(msg);
        } else {
            showStep2Error(error.responseJSON.message);
        }
    } 

    //
    // ========== UI =========== 
    //
    function setupFirstStep() {
        $('.step2-form').hide();
        $('.step3-form').hide();
        $('.passwordInput2').hide();
        $('.loginInput2').hide();
        $('.passwordLabel2').hide();
        $('.loginLabel2').hide();
        hideAllMessages();
    }

    function showStep2() {
        $('.step1-form').hide();
        $('.step2-form').show(); 
    }

    function showStep3(msg) {
        $('.step1-form').hide();
        $('.step2-form').hide();
        $('.step3-form').show(); 
        $('.finishLabel').text(msg ? msg : "Регистрация завершена");
        $('.mandatory_fields').hide();
    }

    function showStep1Error(msg) {
        console.log("showStep1Error");
        $('.errorLbl1').text(msg ? msg : "Ошибка").show();
    }

    function showStep2Error(msg) {
        $('.errorLbl2').text(msg ? msg : "Ошибка").show();
    }

    function hideAllMessages(){
        $('.errorLbl1').hide();
        $('.errorLbl2').hide();
        $('.warnLbl2').hide();
        $('.mandatory_fields').show();
    }

    function showStep2Warning(msg) {
        hideAllMessages();
        if(msg) {
            $('.warnLbl2').text(msg).show();
        }
    }

    
    
    
        
});