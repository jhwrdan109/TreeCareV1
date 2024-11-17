import { useState, useEffect } from 'react';
import { database } from "@/services/firebase"; // Importa o serviço do Firebase
import { useRouter } from 'next/router'; // Para redirecionamento de páginas

const Tree = () => {
  // Cria estados para armazenar os valores dos sensores e do rele de bomba
  const [distancia, setDistancia] = useState(null);
  const [temperatura, setTemperatura] = useState(null);
  const [umidadeAr, setUmidadeAr] = useState(null);
  const [umidadeSolo, setUmidadeSolo] = useState(null);
  const [circuitoAtivado, setCircuitoAtivado] = useState(false); // Para alternar entre "Ativar" e "Desativar"

  const router = useRouter(); // Hook de navegação

  // Função para pegar os dados do Firebase
  useEffect(() => {
    const fetchData = async () => {
      // Caminho para os dados no Firebase
      const dbRef = database.ref('/esp32/sensores'); // Caminho correto para os dados

      dbRef.on('value', (snapshot) => {
        const data = snapshot.val();  // Captura os dados do Firebase
        console.log("Dados recebidos do Firebase:", data);  // Log para depuração

        // Verifica se os dados existem e faz o set para os estados
        if (data) {
          setDistancia(data.distancia || "Dados não encontrados");
          setTemperatura(data["temperatura do ambiente"] || "Dados não encontrados");
          setUmidadeAr(data["umidade do ar"] || "Dados não encontrados");
          setUmidadeSolo(data["umidade do solo"] || "Dados não encontrados");
        }
      });

      // Caminho para o valor do rele de bomba no Firebase
      const releRef = database.ref('/esp32/atuadores/rele da bomba');
      releRef.on('value', (snapshot) => {
        const releStatus = snapshot.val();
        if (releStatus !== null) {
          setCircuitoAtivado(releStatus);  // Atualiza o estado do rele
        }
      });

      return () => {
        dbRef.off();  // Limpa o listener dos sensores
        releRef.off();  // Limpa o listener do rele de bomba
      };
    };

    fetchData();
  }, []);

  // Função para alternar o estado do circuito e atualizar o rele da bomba no Firebase
  const toggleCircuito = async () => {
    const novoEstado = !circuitoAtivado; // Inverte o estado

    // Atualiza o valor do rele de bomba no Firebase
    const releRef = database.ref('/esp32/atuadores/rele');
    await releRef.set(novoEstado); // Altera o valor do rele para true ou false

    // Atualiza o estado local
    setCircuitoAtivado(novoEstado);
  };

  // Função para redirecionar para a página de login
  const handleLogout = () => {
    router.push('/login'); // Redireciona para a página de login
  };

  return (
    <main className="imagemplanta" style={{ paddingTop: "10vh" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#57e75d", marginTop: "0" }}>TreeCare</h1>

        {/* Botão de Sair no canto superior direito */}
        <button
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'black',
            color: 'yellow',
            border: '2px solid yellow',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '5px',
            zIndex: 10, // Garante que o botão ficará sobre outros elementos
          }}
        >
          Sair
        </button>

        {/* Bloco de Monitoramento */}
        <div
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "40px",  // Ajuste para aumentar o tamanho da div
            border: "5px solid #57e75d",  // Borda verde
            marginTop: "30px",  // Espaço entre o título e o bloco de monitoramento
            width: "80%",  // Define a largura da div como 80% da largura da tela
            maxWidth: "800px",  // Limita a largura máxima da div
            margin: "0 auto",  // Centraliza a div horizontalmente
          }}
        >
          <h2 style={{ marginTop: "0" }}>Monitoramento dos Sensores</h2>
          <div style={{ marginTop: "30px", textAlign: "left" }}>
            <h3>Distância: {distancia !== null ? distancia : "Carregando..."}</h3>
            <h3>Temperatura do ambiente: {temperatura !== null ? temperatura : "Carregando..."}</h3>
            <h3>Umidade do Ar: {umidadeAr !== null ? umidadeAr : "Carregando..."}</h3>
            <h3>Umidade do Solo: {umidadeSolo !== null ? umidadeSolo : "Carregando..."}</h3>
          </div>
        </div>

        {/* Bloco de Acionamento do Circuito */}
        <div
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "40px",  // Ajuste para aumentar o tamanho da div
            border: "5px solid #57e75d",  // Borda verde
            marginTop: "30px",  // Espaço entre os dois blocos
            width: "80%",  // Define a largura da div como 80% da largura da tela
            maxWidth: "800px",  // Limita a largura máxima da div
            margin: "0 auto",  // Centraliza a div horizontalmente
            textAlign: "center", // Alinha o conteúdo dentro da div
          }}
        >
          <h2>Acionamento do Circuito</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px" }}>
            {/* Bolinha Esquerda */}
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: circuitoAtivado ? "gray" : "red",
                marginRight: "10px",
              }}
            ></div>

            {/* Botão de Ativação */}
            <button
              onClick={toggleCircuito}  // Associa a função toggle ao clique do botão
              style={{
                backgroundColor: circuitoAtivado ? "red" : "#57e75d",  // Muda a cor do botão
                color: "white",
                border: "none",
                padding: "15px 32px",
                textAlign: "center",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px", // Bordas arredondadas para o botão
              }}
            >
              {circuitoAtivado ? "Desativar" : "Ativar"}
            </button>

            {/* Bolinha Direita */}
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: circuitoAtivado ? "green" : "gray",
                marginLeft: "10px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Tree;

