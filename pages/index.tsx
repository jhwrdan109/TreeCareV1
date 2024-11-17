import { useState } from 'react';
import { database, auth } from "@/services/firebase";
import { useRouter } from 'next/router';
import styles from "@/styles/Home.module.scss"; // Importa os estilos

export default function Home() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  // Tipando o evento como FormEvent de React
  function gravar(event: React.FormEvent) {
    event.preventDefault();

    // Verificação se todos os campos estão preenchidos
    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Por favor, preencha todos os campos.");
      setSucesso(false);
      return;
    }

    // Validação para verificar se as senhas coincidem
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem. Por favor, verifique.");
      setSucesso(false);
      return;
    }

    // Verifica se o email já está cadastrado
    auth.fetchSignInMethodsForEmail(email).then((methods) => {
      if (methods.length > 0) {
        setErro("Usuário já cadastrado com este email.");
        setSucesso(false);
        return;
      }

      // Se o email não existir, cria a conta
      auth.createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
          const user = userCredential.user;

          // Adiciona dados do usuário ao Realtime Database
          const ref = database.ref("usuarios");
          const dados = {
            nome,
            email,
            senha,
          };
          ref.push(dados);

          setSucesso(true);
          setErro(""); // Limpa qualquer erro

          // Limpa os campos do formulário
          setNome("");
          setEmail("");
          setSenha("");
          setConfirmarSenha("");

          // Redireciona para a página de login após o cadastro
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        })
        .catch((error) => {
          setErro(error.message);
          setSucesso(false);
        });
    });
  }

  return (
    <main className={styles.container}>
      <div className="bg-cadastro arredondar">
        <form onSubmit={gravar}>
          <h1 className="treecare-afastar">TreeCare</h1>

          {/* Mensagem de sucesso */}
          {sucesso && (
            <p style={{ color: "#57e75d", marginTop: "10px", fontWeight: "bold" }}>
              Cadastro realizado com sucesso! Redirecionando para o login...
            </p>
          )}

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChange={(event) => setConfirmarSenha(event.target.value)}
          />

          <h4 className="fazlogin">
            Já possui uma conta?
            <span className="link" onClick={() => router.push("/login")}>Faça login</span>
          </h4>

          {/* Exibe a mensagem de erro, se houver */}
          {erro && <p style={{ color: "white", marginTop: "10px" }}>{erro}</p>}

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </main>
  );
}
