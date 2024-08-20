// Configurações do Firebase (substitua pelas suas credenciais reais)
const firebaseConfig = {
    apiKey: "AIzaSyDHM_Un_OqWYlbgSyswQTuHU-mQqrt1Y20",
    authDomain: "support-67692.firebaseapp.com",
    projectId: "support-67692",
    storageBucket: "support-67692.appspot.com",
    messagingSenderId: "234582709996",
    appId: "1:234582709996:web:fd6fa8c87b65ca0751b7c9",
    measurementId: "G-LPH8XF28N4",
  };
  
  // Inicializar o Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Obter a referência do Firestore
  const db = firebase.firestore();
  const empresaId = "teste"; // ID da empresa (ajuste se necessário)
  
  // Função para salvar a pergunta e resposta no Firestore
  function salvarPerguntaResposta(pergunta, resposta) {
    // Cria um novo documento com ID automático
    const perguntaRef = db.collection("perguntas").doc();
  
    // Define os dados da pergunta e resposta, incluindo empresaId
    const dadosPergunta = {
      pergunta: pergunta,
      resposta: resposta,
      empresaId: empresaId,
    };
  
    // Salva os dados no Firestore
    perguntaRef
      .set(dadosPergunta)
      .then(() => {
        console.log("Pergunta e resposta salvas com sucesso!");
        carregarPerguntasRespostas(); // Recarrega a lista após salvar
  
        // Limpa os campos do formulário após salvar
        document.getElementById("pergunta").value = "";
        document.getElementById("resposta").value = "";
      })
      .catch((error) => {
        console.error("Erro ao salvar pergunta e resposta: ", error);
      });
  }
  
  // Função para excluir uma pergunta
  function excluirPergunta(perguntaId) {
    if (confirm("Tem certeza que deseja excluir esta pergunta?")) {
      db.collection("perguntas")
        .doc(perguntaId)
        .delete()
        .then(() => {
          console.log("Pergunta excluída com sucesso!");
          carregarPerguntasRespostas(); // Recarrega a lista após excluir
        })
        .catch((error) => {
          console.error("Erro ao excluir pergunta: ", error);
        });
    }
  }
  
  // Função para abrir o modal de edição com os dados da pergunta
  function abrirModalEditar(perguntaId) {
    db.collection("perguntas")
      .doc(perguntaId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const perguntaData = doc.data();
  
          // Preencher o formulário do modal com os dados da pergunta
          document.getElementById("editarPerguntaId").value = perguntaId;
          document.getElementById("editarPerguntaInput").value = perguntaData.pergunta;
          document.getElementById("editarRespostaInput").value = perguntaData.resposta;
  
          // Mostrar o modal de edição
          const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarPergunta"));
          modalEditar.show();
        } else {
          console.log("Nenhum documento encontrado para este ID.");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar pergunta: ", error);
      });
  }
  
  // Função para carregar as perguntas e respostas do Firestore
  function carregarPerguntasRespostas() {
    const tabelaPerguntasRespostas = document.getElementById("tabelaPerguntasRespostas");
    tabelaPerguntasRespostas.innerHTML = ""; // Limpa a tabela
  
    const totalPerguntasElement = document.getElementById("totalPerguntas");
    let totalPerguntas = 0;
  
    // Consulta direta na coleção "perguntas" filtrando por empresaId
    db.collection("perguntas")
      .where("empresaId", "==", empresaId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((perguntaDoc) => {
          const perguntaData = perguntaDoc.data();
  
          // Criar a linha na tabela
          const linha = document.createElement("tr");
          linha.innerHTML = `
            <th scope="row">${perguntaDoc.id}</th>
            <td>${perguntaData.pergunta}</td>
            <td class="descricao-truncada">${truncarTexto(perguntaData.resposta, 50)}</td>
            <td>
              <button class="btn btn-sm btn-warning btn-editar" data-pergunta-id="${perguntaDoc.id}">Editar</button>
              <button class="btn btn-sm btn-danger btn-excluir" data-pergunta-id="${perguntaDoc.id}">Excluir</button>
            </td>
          `;
          tabelaPerguntasRespostas.appendChild(linha);
  
          totalPerguntas++;
        });
        totalPerguntasElement.textContent = totalPerguntas;
      })
      .catch((error) => {
        console.error("Erro ao carregar perguntas e respostas: ", error);
      });
  }
  
  // Adicionar ouvinte de evento para a tabela (delegação de eventos)
  const tabelaPerguntasRespostas = document.getElementById("tabelaPerguntasRespostas");
  tabelaPerguntasRespostas.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-excluir")) {
      const perguntaId = event.target.dataset.perguntaId;
      excluirPergunta(perguntaId);
    }
  
    if (event.target.classList.contains("btn-editar")) {
      const perguntaId = event.target.dataset.perguntaId;
      abrirModalEditar(perguntaId);
    }
  });
  
  // Evento de submit do formulário de perguntas e respostas
  const formTreinamento = document.querySelector("#treinamento form");
  formTreinamento.addEventListener("submit", function (event) {
    event.preventDefault(); // Previne o envio padrão do formulário
  
    const perguntaInput = document.getElementById("pergunta");
    const respostaInput = document.getElementById("resposta");
  
    salvarPerguntaResposta(perguntaInput.value, respostaInput.value);
  });
  
  // Evento de submit do formulário de edição do modal
  const formEditarPergunta = document.getElementById("formEditarPergunta");
  formEditarPergunta.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const perguntaId = document.getElementById("editarPerguntaId").value;
    const perguntaEditada = document.getElementById("editarPerguntaInput").value;
    const respostaEditada = document.getElementById("editarRespostaInput").value;
  
    db.collection("perguntas")
      .doc(perguntaId)
      .update({
        pergunta: perguntaEditada,
        resposta: respostaEditada,
      })
      .then(() => {
        console.log("Pergunta atualizada com sucesso!");
        const modalEditar = bootstrap.Modal.getInstance(document.getElementById("modalEditarPergunta"));
        modalEditar.hide();
        carregarPerguntasRespostas();
      })
      .catch((error) => {
        console.error("Erro ao atualizar pergunta: ", error);
      });
  });

  // Função para adicionar um novo produto
function adicionarProduto(nome, descricao) {
    const produtoRef = db.collection("produtos").doc(); // ID automático
    const dadosProduto = {
      empresaId: empresaId,
      nome: nome,
      descricao: descricao,
    };
  
    produtoRef
      .set(dadosProduto)
      .then(() => {
        console.log("Produto adicionado com sucesso!");
        carregarProdutos(); // Recarrega a lista de produtos
        // Limpa o formulário
        document.getElementById("adicionarNomeProduto").value = "";
        document.getElementById("adicionarDescricaoProduto").value = "";
      })
      .catch((error) => {
        console.error("Erro ao adicionar produto: ", error);
      });
  }
  
  // Função para carregar os produtos do Firestore
  function carregarProdutos() {
    const tabelaProdutos = document.getElementById("tabelaProdutos").getElementsByTagName("tbody")[0];
    tabelaProdutos.innerHTML = ""; // Limpa a tabela
  
    db.collection("produtos")
      .where("empresaId", "==", empresaId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((produtoDoc) => {
          const produtoData = produtoDoc.data();
  
          // Criar a linha na tabela
          const linha = tabelaProdutos.insertRow();
          linha.insertCell().textContent = produtoDoc.id; // ID do produto
          linha.insertCell().textContent = produtoData.nome;
          // linha.insertCell().textContent = produtoData.descricao;
          linha.insertCell().textContent = truncarTexto(produtoData.descricao, 50); // Truncar para 50 
  
          // Criar célula para botões de ação
          const celulaAcoes = linha.insertCell();
          celulaAcoes.innerHTML = `
            <button class="btn btn-sm btn-warning btn-editar-produto" data-produto-id="${produtoDoc.id}">Editar</button>
            <button class="btn btn-sm btn-danger btn-excluir-produto" data-produto-id="${produtoDoc.id}">Excluir</button>
          `;
        });
        atualizarTotalProdutosDashboard(); // Atualiza o contador no Dashboard
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos: ", error);
      });
  }
  
  // Função para excluir um produto
  function excluirProduto(produtoId) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      db.collection("produtos")
        .doc(produtoId)
        .delete()
        .then(() => {
          console.log("Produto excluído com sucesso!");
          carregarProdutos(); // Recarrega a lista de produtos
        })
        .catch((error) => {
          console.error("Erro ao excluir produto: ", error);
        });
    }
  }
  
  // Função para abrir o modal de edição de produto
  function abrirModalEditarProduto(produtoId) {
    db.collection("produtos")
      .doc(produtoId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const produtoData = doc.data();
  
          // Preencher o formulário do modal com os dados do produto
          document.getElementById("editarProdutoId").value = produtoId;
          document.getElementById("editarNomeProduto").value = produtoData.nome;
          document.getElementById("editarDescricaoProduto").value = produtoData.descricao;
  
          // Mostrar o modal de edição
          const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarProduto"));
          modalEditar.show();
        } else {
          console.log("Nenhum documento encontrado para este ID.");
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar produto: ", error);
      });
  }
  
  // Função para atualizar um produto
  function atualizarProduto(produtoId, novoNome, novaDescricao) {
    db.collection("produtos")
      .doc(produtoId)
      .update({
        nome: novoNome,
        descricao: novaDescricao,
      })
      .then(() => {
        console.log("Produto atualizado com sucesso!");
        // Fechar o modal de edição
        const modalEditar = bootstrap.Modal.getInstance(document.getElementById("modalEditarProduto"));
        modalEditar.hide();
  
        carregarProdutos(); // Recarregar a lista de produtos
      })
      .catch((error) => {
        console.error("Erro ao atualizar produto: ", error);
      });
  }

  function atualizarTotalProdutosDashboard() {
    const totalProdutosElement = document.getElementById("totalProdutos");
    let totalProdutos = 0;
  
    db.collection("produtos")
      .where("empresaId", "==", empresaId)
      .get()
      .then((querySnapshot) => {
        totalProdutos = querySnapshot.size; // Obtém o número de documentos retornados
        totalProdutosElement.textContent = totalProdutos; 
      })
      .catch((error) => {
        console.error("Erro ao carregar o total de produtos: ", error);
      });
  }
  
  // Adicionar ouvintes de evento para os formulários e botões
  document.addEventListener("DOMContentLoaded", () => {
    // Formulário de adicionar produto
    const formAdicionarProduto = document.getElementById("formAdicionarProduto");
    formAdicionarProduto.addEventListener("submit", (event) => {
      event.preventDefault();
      const nomeProduto = document.getElementById("adicionarNomeProduto").value;
      const descricaoProduto = document.getElementById("adicionarDescricaoProduto").value;
      adicionarProduto(nomeProduto, descricaoProduto);
    });
  
    // Formulário de editar produto
    const formEditarProduto = document.getElementById("formEditarProduto");
    formEditarProduto.addEventListener("submit", (event) => {
      event.preventDefault();
      const produtoId = document.getElementById("editarProdutoId").value;
      const novoNome = document.getElementById("editarNomeProduto").value;
      const novaDescricao = document.getElementById("editarDescricaoProduto").value;
      atualizarProduto(produtoId, novoNome, novaDescricao);
    });
  
    // Delegação de eventos para botões na tabela de produtos
    const tabelaProdutos = document.getElementById("tabelaProdutos");
    tabelaProdutos.addEventListener("click", (event) => {
      const elementoClicado = event.target;
  
      if (elementoClicado.classList.contains("btn-editar-produto")) {
        const produtoId = elementoClicado.dataset.produtoId;
        abrirModalEditarProduto(produtoId);
      } else if (elementoClicado.classList.contains("btn-excluir-produto")) {
        const produtoId = elementoClicado.dataset.produtoId;
        excluirProduto(produtoId);
      }
    });
  
    // Carregar produtos ao carregar a página
    carregarProdutos();
  });

  // Função para obter dados do Firestore e criar o gráfico
function carregarMetricas() {
  const canvas = document.getElementById('graficoMetricas');
  const ctx = canvas.getContext('2d');

  // Métricas Exemplo:
  // 1. Total de Perguntas por Dia (últimos 7 dias)
  // 2. Tempo Médio de Resposta (últimos 7 dias) 

  // Função auxiliar para formatar datas para o gráfico
  function formatarData(data) {
      const dia = data.getDate().toString().padStart(2, '0');
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      return `${dia}/${mes}`;
  }

  // Obter data de hoje e dos últimos 7 dias
  const hoje = new Date();
  const ultimos7Dias = [...Array(7)].map((_, i) => {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - i);
      return data;
  });

  const labelsDatas = ultimos7Dias.map(formatarData).reverse();

  // Inicializar os dados do gráfico como zero
  const dadosPerguntas = Array(7).fill(0); 
  const dadosTempoResposta = Array(7).fill(0);

  // Consultar o Firestore para obter os dados das métricas
  db.collection("perguntas")
      .where("empresaId", "==", empresaId)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              const perguntaData = doc.data();
              const dataCriacao = perguntaData.dataCriacao ? perguntaData.dataCriacao.toDate() : new Date(); // Se você tiver um campo dataCriacao

              // Calcular métricas (exemplo)
              const indiceDia = ultimos7Dias.findIndex(data => data.getDate() === dataCriacao.getDate());
              if (indiceDia !== -1) {
                  dadosPerguntas[indiceDia]++;

                  // Exemplo de cálculo de tempo de resposta (requer campo 'tempoResposta' nos documentos)
                  // if (perguntaData.tempoResposta) {
                  //  dadosTempoResposta[indiceDia] += perguntaData.tempoResposta; 
                  // }
              }
          });

          // Criar o gráfico com Chart.js
          new Chart(ctx, {
              type: 'bar', // Tipo de gráfico (bar, line, pie, etc.)
              data: {
                  labels: labelsDatas,
                  datasets: [
                      {
                          label: 'Total de Perguntas',
                          data: dadosPerguntas,
                          backgroundColor: 'rgba(54, 162, 235, 0.2)',
                          borderColor: 'rgba(54, 162, 235, 1)',
                          borderWidth: 1,
                      },
                      // { // Exemplo de segundo conjunto de dados
                      //     label: 'Tempo Médio de Resposta (minutos)',
                      //     data: dadosTempoResposta.map((tempo, i) => dadosPerguntas[i] > 0 ? (tempo / dadosPerguntas[i]).toFixed(2) : 0),
                      //     backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                      //     borderColor: 'rgba(255, 99, 132, 1)',
                      //     borderWidth: 1,
                      //     yAxisID: 'y2' 
                      // },
                  ],
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true,
                          title: {
                              display: true,
                              text: 'Quantidade'
                          }
                      },
                      // y2: { // Segundo eixo Y para o exemplo de tempo de resposta
                      //     position: 'right', 
                      //     beginAtZero: true,
                      //     title: {
                      //         display: true,
                      //         text: 'Tempo (min)' 
                      //     }
                      // }
                  }
              },
          });
      })
      .catch((error) => {
          console.error("Erro ao carregar dados do Firestore: ", error);
      });
}

// Obter o botão pelo ID
const botaoChat = document.getElementById("botaoChat");

// Adicionar um ouvinte de evento de clique ao botão
botaoChat.addEventListener("click", () => {
  // Redirecionar para a página do chatbot com o empresaId
  window.location.href = `chatbot/chatbot.html?empresaId=${empresaId}`;
});

function calcularMediaAvaliacoes(empresaId) {
  const totalAvaliacoesElement = document.getElementById('mediaAvaliacoes');
  let somaNotas = 0;
  let totalAvaliacoes = 0;

  db.collection('avaliacoes')
    .where('empresaId', '==', empresaId)
    .get()
    .then((querySnapshot) => {
      totalAvaliacoes = querySnapshot.size;

      querySnapshot.forEach((doc) => {
        somaNotas += doc.data().nota;
      });

      if (totalAvaliacoes > 0) {
        const media = (somaNotas / totalAvaliacoes).toFixed(1); // Calcula a média com uma casa decimal
        totalAvaliacoesElement.textContent = media;
      } else {
        totalAvaliacoesElement.textContent = '0'; // Ou "-" se preferir
      }
    })
    .catch((error) => {
      console.error("Erro ao calcular a média das avaliações:", error);
    });
}

function truncarTexto(texto, maxLength) {
  if (texto.length > maxLength) {
    return texto.substring(0, maxLength) + "...";
  } else {
    return texto;
  }
}

// Função para verificar notificações não lidas e atualizar o ícone
function verificarNotificacoesNaoLidas(empresaId) {
  const iconeNotificacoes = document.getElementById('icone-notificacoes');
  let indicador = iconeNotificacoes.querySelector('.indicador');

  db.collection("notificacoes")
    .where("empresa", "==", empresaId)
    .where("lida", "==", false)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) { // Se houver notificações não lidas
        if (!indicador) {
          // Criar o indicador (bolinha vermelha)
        }
        // Não precisa definir o textContent, pois queremos apenas a bolinha
      } else {
        document.getElementById("indicador").style.display = "none"
        if (indicador) {
          iconeNotificacoes.removeChild(indicador);
        }
      }
    })
    .catch((error) => {
      console.error("Erro ao verificar notificações não lidas:", error);
    });
}

// Adicione um ouvinte de evento ao ícone para abrir a página de notificações em uma nova aba
const iconeNotificacoes = document.getElementById('icone-notificacoes');
iconeNotificacoes.addEventListener('click', () => {
  window.open(`notificacoes/notificacoes.html?empresaId=${empresaId}`, '_blank'); 
});

const integrar = document.getElementById('integrar');
integrar.addEventListener('click', () => {
  window.open(`integration/index.html?empresaId=${empresaId}`, '_blank'); 
});


  
  
  // Chame as funções para carregar os dados ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    carregarPerguntasRespostas();
    carregarMetricas()
    calcularMediaAvaliacoes(empresaId); 
    verificarNotificacoesNaoLidas(empresaId);
  });