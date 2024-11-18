import { useRouter } from "next/router"; // Importa o roteador
import styles from "@/styles/Home.module.scss"; // Importa os estilos
import React, { useState } from "react";
import { database, auth } from "@/services/firebase"; // Certifique-se de importar o auth do Firebase

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter(); // Usando o roteador para navegação

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    
    // Simulando a lógica de autenticação
    auth.signInWithEmailAndPassword(email, senha)
      .then(() => {
        setSucesso(true); // Login realizado com sucesso
        setErro(""); // Limpa mensagens de erro, se houver

        // Redireciona para a página tree após o login
        setTimeout(() => {
          router.push("/tree"); // Redireciona para a página "tree"
        }, 2000); // Atraso de 2 segundos para exibir a mensagem de sucesso
      })
      .catch((error) => {
        setErro("Credenciais inválidas, tente novamente.");
        setSucesso(false);
      });
  }

  return (
    <div className={styles.container}>
      <div id="login1" className="loginpagina bg-cadastro arredondar">
        <h1 className="treecare-afastar text-center">TreeCare</h1>
        
        {/* Mensagem de sucesso */}
        {sucesso && (
          <p style={{ color: "#57e75d", marginTop: "10px", fontWeight: "bold", textAlign:'center' }}>
            Login realizado com sucesso! Redirecionando...
          </p>
        )}

        {/* Formulário de login */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {/* Link para a página de cadastro */}
          <h4 className="fazcadastro">
            Não tem uma conta?
            <span
              className="linkcad"
              style={{ cursor: "pointer", color: "#57e75d" }}
              onClick={() => router.push("/")} // Redireciona para a página principal de cadastro
            >
              Cadastrar-se
            </span>
          </h4>

          {/* Mensagem de erro */}
          {erro && <p style={{ color: "white", marginTop: "10px" }}>{erro}</p>}

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
