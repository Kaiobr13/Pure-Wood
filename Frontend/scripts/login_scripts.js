function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

$(document).ready(function () {
  // Função para validar e esconder mensagens de erro dinamicamente
  function validateField(field, alertId, validationFn) {
    $(field).on("input", function () {
      if (validationFn($(this).val())) {
        $(alertId).hide(); // Esconde o alerta se o campo for válido
      }
    });
  }

  // Adicionar validações para ocultar mensagens automaticamente
  validateField("#inputusername", "#alert", isValidEmail);
  validateField("#inputpassword", "#alert2", (value) => value.trim() !== "");

  // Ação no botão "Login"
  $("#loginBtn").click(function () {
    var email = document.getElementById("inputusername").value.trim(); // Remover espaços desnecessários
    var pass = document.getElementById("inputpassword").value.trim();
    var alert = document.getElementById("alert");
    var alert2 = document.getElementById("alert2");

    // Resetar os alertas antes de validar
    alert.style.display = "none";
    alert2.style.display = "none";

    // Verificações
    if (!email && !pass) {
      alert.style.display = "block"; // Alerta para email
      alert2.style.display = "block"; // Alerta para senha
      return; // Finalizar execução
    }

    if (!email) {
      alert.style.display = "block"; // Mostrar alerta para email vazio
      return;
    }

    if (!isValidEmail(email)) {
      alert.style.display = "block"; // Mostrar alerta para email inválido
      return;
    }

    if (!pass) {
      alert2.style.display = "block"; // Mostrar alerta para senha vazia
      return;
    }

    // Se todas as validações passarem, enviar a requisição AJAX
    $.ajax({
      url: "http://localhost:3000/clients/login",
      type: "POST",
      async: false,
      cache: false,
      timeout: 30000,
      contentType: "application/json",
      data: JSON.stringify({
        password: pass,
        email: email,
      }),
      success: function (response) {
        console.log(response); // Verifica o objeto de resposta completo no console

        // Verificar se a autenticação foi bem-sucedida
        if (response.success) {
          setCookie("login", true);
         
          
          if (response.classid == 1) {
            setCookie("admin", response.classid);
            setCookie("id", response.idcliente);

            setTimeout(function () {
              window.location.href = "admin.html"; 
            }, 500);

          } 
          else if (response.classid == 2) 
            {
              setCookie("supplier", response.classid);
              setTimeout(function () {
                window.location.href = "supplier.html"; 
              }, 500);
          } 
          else {
            setTimeout(function () {
              setCookie("id", response.idcliente);
              window.location.href = "paginainicial.html"; 
            }, 500);
          }
          

          window.alert("Login efetuado com sucesso!");
        } else {
          window.alert("Falha no Login: " + response.message);
        }
      },
      error: function (error) {
        window.alert(
          "Ocorreu um erro durante o login. Por favor, tente novamente."
        );
      },
    });
  });
});
