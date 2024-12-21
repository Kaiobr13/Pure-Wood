$(document).ready(function () {
    // Função para carregar os usuários e preencher a tabela
    if(!checkCookieLogin())
    {
      alert("Precisa de fazer login para ter acesso a esta página!");
      window.location.replace("login.html");
    }
    if (!checkifitsadmin){
      alert("Não tem acesso a esta página!");
      window.location.replace("paginainicial.html");
    }
    
    function loadUsers() {
      // Recuperar o ID do usuário logado do cookie
      const loggedUserId = getCookie("id");
  
     
  
      $.ajax({
        url: "http://localhost:3000/clients", // Certifique-se de que este endpoint retorna os dados esperados
        type: "GET",
        dataType: "json",
        success: function (response) {
          // Limpar a tabela antes de adicionar os dados
          $("#usersTable tbody").empty();
  
          // Filtrar os usuários para excluir o logado
          const filteredUsers = response.data.filter(
            (user) => user.cli_id !== parseInt(loggedUserId)
          );
  
          // Iterar sobre os usuários filtrados e criar as linhas da tabela
          filteredUsers.forEach((user, index) => {
            const userRow = `
              <tr>
                <td>${index + 1}</td>
                <td>${user.cli_name}</td>
                <td>${user.cli_email}</td>
                <td>${user.cli_place}</td>
                <td>${user.cla_name}</td>
                <td>${new Date(user.cli_register_date).toLocaleDateString()}</td>
                <td>
                  <button class="btn btn-danger" data-id="${user.cli_id}">
                    Remover
                  </button>
                </td>
              </tr>
            `;
            $("#usersTable tbody").append(userRow);
          });
  
          // Adicionar evento de clique aos botões "Remover"
          $(".btn-remove").click(function () {
            const userId = $(this).data("id");
            removeUser(userId);
          });
        },
        error: function (error) {
          console.error("Erro ao carregar usuários:", error);
          alert("Ocorreu um erro ao carregar os usuários.");
        },
      });
    }
  
    // Função para remover um usuário
    function removeUser(userId) {
      $.ajax({
        url: `http://localhost:3000/clients/${userId}`, // Endpoint para remover o usuário
        type: "DELETE", // Método DELETE para remoção
        success: function (response) {
          alert(response.message || "Usuário removido com sucesso.");
          loadUsers(); // Recarregar a tabela após remover
        },
        error: function (error) {
          console.error("Erro ao remover usuário:", error);
          alert("Ocorreu um erro ao remover o usuário.");
        },
      });
    }
  
    // Função para recuperar um cookie pelo nome
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }
  
    // Carregar os usuários ao carregar a página
    loadUsers();
  });
  
