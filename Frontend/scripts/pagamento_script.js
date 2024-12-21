$(document).ready(function () {

  if(!checkCookieLogin())
    {
      alert("Precisa de fazer login para ter prosseguir com a compra!");
      window.location.replace("login.html");
    }
  // Obtém os produtos do carrinho armazenado no localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Calcula o preço total com base nos itens do carrinho
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  // Exibe o preço total no console (pode ser exibido no HTML, se necessário)
  console.log("Preço total:", totalPrice);

  // Função para validar campos individuais e ocultar mensagens de erro
  function validateFieldOnPattern(field, alertId, validationFn) {
    $(field).on("input", function () {
      if (validationFn($(this).val())) {
        $(alertId).hide(); // Esconde o alerta se o valor corresponder ao padrão
      }
    });
  }

  // Formatação dinâmica para número do cartão (#### #### #### ####)
  $("#cardnumberinput").on("input", function () {
    let input = $(this).val().replace(/\D/g, ""); // Remove tudo que não for número
    if (input.length > 16) {
      input = input.substring(0, 16); // Limita a 16 caracteres
    }
    let formatted = input.match(/.{1,4}/g)?.join(" ") || input; // Agrupa em blocos de 4
    $(this).val(formatted);
  });

  // Formatação dinâmica para PIN (###)
  $("#cardpininput").on("input", function () {
    let input = $(this).val().replace(/\D/g, ""); // Remove tudo que não for número
    $(this).val(input.substring(0, 3)); // Limita a 3 caracteres
  });

  // Formatação dinâmica para Código Postal (####-###)
  

  // Validações para ocultar erros automaticamente ao digitar e cumprir o padrão
  validateFieldOnPattern("#nameinput", "#alert", value => value.trim() !== ""); // Primeiro Nome
  validateFieldOnPattern("#lastnameinput", "#alert2", value => value.trim() !== ""); // Último Nome
  validateFieldOnPattern("#cardnumberinput", "#alert3", value => /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(value)); // Número do Cartão
  validateFieldOnPattern("#cardpininput", "#alert4", value => /^\d{3}$/.test(value)); // PIN do Cartão
  validateFieldOnPattern("#invalidCheck", "#alert8", value => $("#invalidCheck").is(":checked")); // Aceitar termos

  // Validação no botão "Pagar"
  $("#pagarBtn").click(function () {
    let isValid = true;

    const primeiroNome = $("#nameinput").val().trim();
    const ultimoNome = $("#lastnameinput").val().trim();
    const numeroCartao = $("#cardnumberinput").val().trim();
    const pinCartao = $("#cardpininput").val().trim();
    const termosAceitos = $("#invalidCheck").is(":checked");

    // Resetar mensagens de erro
    $(".alerta").hide();

    // Validações dos campos
    if (!primeiroNome) {
      $("#alert").show();
      isValid = false;
    }

    if (!ultimoNome) {
      $("#alert2").show();
      isValid = false;
    }

    if (!numeroCartao.match(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)) {
      $("#alert3").show();
      isValid = false;
    }

    if (!pinCartao.match(/^\d{3}$/)) {
      $("#alert4").show();
      isValid = false;
    }

    

    if (!termosAceitos) {
      $("#alert8").show();
      isValid = false;
    }

    // Se todas as validações passarem, prosseguir com o pagamento
    if (isValid) { 
      
// Verifica se há um produto no carrinho
if (cart.length > 0) {
  // Atribui os valores para o único item do carrinho
  const prod_id = cart[0].id;
  const unit_price = parseFloat(cart[0].price);
 

  // Envia a requisição AJAX com as variáveis separadas
  $.ajax({
    url: "http://localhost:3000/orders/addorder",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      user_id: getCookie("id"), // Obtém o ID do usuário via cookie
      total: totalPrice, // Preço total calculado
      prod_id: prod_id,
      unit_price: unit_price,
      
    }),
    success: function (response) {
      if (response.message === "Encomenda efetuada com sucesso!") {
        alert("Pagamento realizado com sucesso!\n A sua encomenda foi criada");
        localStorage.removeItem("cart"); // Limpa o carrinho do localStorage
        window.location.href = "paginainicial.html";
      } else {
        alert("Falha na compra: " + response.message);
      }
    },
    error: function () {
      alert("Erro durante o registo. Tente novamente mais tarde.");
    },
  });
} else {
  alert("O carrinho está vazio. Por favor, adicione um produto.");
}

    
    }
  });
});
