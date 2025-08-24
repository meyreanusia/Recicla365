import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();


  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");


   const handleLogin = async () => {
    setError(""); // Limpa erros antigos

    // Validação simples dos campos obrigatórios
    if (!email || !senha) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    console.log(email);
    console.log(senha);
    
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.status === 400) {
        setError("Campos obrigatórios não foram preenchidos corretamente.");
      } else if (response.status === 401) {
        setError("Usuário ou senha inválidos.");
      } else if (response.ok) {
        // Login bem-sucedido, redireciona para dashboard
        navigate("/dashboard");
      } else {
        setError("Ocorreu um erro. Tente novamente mais tarde.");
      }
    } catch (err) {
      setError("Não foi possível conectar ao servidor.");
      console.error(err);
    }
  };



  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
       <div className="text-center mb-4">
        <img src="/logo.png" alt="Recicla365" style={{ width: "400px" }} />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-2">
        <label className="form-label">Usuário</label>
        <input type="text" className="form-control"  onChange={(e) => setEmail(e.target.value)}
          required />
      </div>
      <div className="mb-2">
        <label className="form-label">Senha</label>
        <input type="password" className="form-control" onChange={(e) => setSenha(e.target.value)}
          required/>
      </div>
      <button className="btn btn-primary w-100 mt-4" onClick={handleLogin}>
        Entrar
      </button>

      <p className="text-center mt-3">
         <Link to="/register">Criar conta</Link>
      </p>
    </div>
  );
}

