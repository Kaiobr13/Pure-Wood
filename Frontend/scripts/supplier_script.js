$(document).ready(function () {

  if(!checkCookieLogin())
    {
      alert("Precisa de fazer login para ter acesso a esta página!");
      window.location.replace("login.html");
    }
    if (!checkifitssupplier()){
      alert("Não tem acesso a esta página!");
      window.location.replace("paginainicial.html");
    }
    // Função para carregar as encomendas e preencher a tabela
    function loadOrders() {
      $.ajax({
        url: "http://localhost:3000/orders", // Endpoint para buscar as encomendas
        type: "GET",
        dataType: "json",
        success: function (response) {
          // Limpar a tabela antes de adicionar os dados
          $(".table tbody").empty();
  
          // Iterar sobre as encomendas e criar as linhas da tabela
          response.data.forEach((order, index) => {
            const orderRow = `
              <tr>
                <td>${index + 1}</td>
                <td>${order.cli_email}</td>
                <td>${order.cli_place}</td>
                <td>${order.prod_name}</td>
                <td>${order.ord_total}€</td>
                <td>${order.ord_status}</td>
                <td>${new Date(order.ord_date).toLocaleDateString()}</td>
                <td>
                  <button class="btn btn-danger" data-id="${order.ord_id}">
                    Terminar
                  </button>
                </td>
              </tr>
            `;
            $(".table tbody").append(orderRow);
          });
  
          // Adicionar evento de clique aos botões "Remover"
          $(document).on("click", ".btn-danger", function () {
            const orderId = $(this).data("id");
            removeOrder(orderId);
          });
        },
        error: function (error) {
          console.error("Erro ao carregar encomendas:", error);
          alert("Ocorreu um erro ao carregar as encomendas.");
        },
      });
    }
  
    // Função para remover uma encomenda
    function removeOrder(orderId) {
      $.ajax({
        url: `http://localhost:3000/orders/${orderId}`, // Endpoint para remover a encomenda
        type: "DELETE", // Método DELETE para remoção
        success: function (response) {
          alert(response.message || "Encomenda removida com sucesso.");
          loadOrders(); // Recarregar a tabela após remover
        },
        error: function (error) {
          console.error("Erro ao remover encomenda:", error);
          alert("Ocorreu um erro ao remover a encomenda.");
        },
      });
    }
  
    // Carregar as encomendas ao carregar a página
    loadOrders();
  });
  