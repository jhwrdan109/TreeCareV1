import { useState, useEffect } from "react";
import { database } from "@/services/firebase"; // Importa o serviço do Firebase
import { useRouter } from "next/router"; // Para redirecionamento de páginas

const Tree = () => {
  const [distancia, setdistancia] = useState(null);
  const [temperatura, setTemperatura] = useState(null);
  const [umidadeAr, setUmidadeAr] = useState(null);
  const [umidadeSolo, setUmidadeSolo] = useState(null);
  const [circuitoAtivado, setCircuitoAtivado] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const dbRef = database.ref("/esp32/sensores");

      dbRef.on("value", (snapshot) => {
        const data = snapshot.val();

        if (data) {
          setdistancia(data.distancia || "Dados não encontrados");
          setTemperatura(data.ambiente || "Dados não encontrados");
          setUmidadeAr(data.ar || "Dados não encontrados");
          setUmidadeSolo(data.solo || "Dados não encontrados");
        }
      });

      const releRef = database.ref("/esp32/atuadores/rele");
      releRef.on("value", (snapshot) => {
        const releStatus = snapshot.val();
        if (releStatus !== null) {
          setCircuitoAtivado(releStatus);
        }
      });

      return () => {
        dbRef.off();
        releRef.off();
      };
    };

    fetchData();
  }, []);

  const toggleCircuito = async () => {
    const novoEstado = !circuitoAtivado;

    const releRef = database.ref("/esp32/atuadores/rele");
    await releRef.set(novoEstado);

    setCircuitoAtivado(novoEstado);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <main className="imagemplanta" style={{ paddingTop: "10vh" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#57e75d", marginTop: "0" }}>TreeCare</h1>

        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "black",
            color: "yellow",
            border: "2px solid yellow",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            zIndex: 10,
          }}
        >
          Sair
        </button>

        <div
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "40px",
            border: "5px solid #57e75d",
            marginTop: "30px",
            width: "80%",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ marginTop: "0" }}>Monitoramento dos Sensores</h2>
          <div style={{ marginTop: "30px", textAlign: "left" }}>
            <h3>
              Porcentagem de água: {distancia !== null ? distancia : "Carregando..."}
            </h3>
            <h3>
              Temperatura do ambiente: {temperatura !== null ? temperatura : "Carregando..."}
            </h3>
            <h3>
              Umidade do Ar: {umidadeAr !== null ? `${umidadeAr}%` : "Carregando..."}
            </h3>
            <h3>
              Umidade do Solo: {umidadeSolo !== null ? `${umidadeSolo}%` : "Carregando..."}
            </h3>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "40px",
            border: "5px solid #57e75d",
            marginTop: "30px",
            width: "80%",
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2>Acionamento do Circuito</h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: circuitoAtivado ? "gray" : "red",
                marginRight: "10px",
              }}
            ></div>

            <button
              onClick={toggleCircuito}
              style={{
                backgroundColor: circuitoAtivado ? "red" : "#57e75d",
                color: "white",
                border: "none",
                padding: "15px 32px",
                textAlign: "center",
                display: "inline-block",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              {circuitoAtivado ? "Desativar" : "Ativar"}
            </button>

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
