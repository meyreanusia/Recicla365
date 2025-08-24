import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    sexo: "",
    cpf: "",
    nascimento: "",
    email: "",
    senha: ""
  });
  const [error, setError] = useState("");

  const isValidCPF = (cpf) => /^\d{11}$/.test(cpf);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    const { nome, sexo, cpf, nascimento, email, senha } = form;
    console.log(form);
    

    if (!nome || !sexo || !cpf || !nascimento || !email || !senha) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!isValidCPF(cpf)) {
      setError("CPF inválido. Insira 11 dígitos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (response.status === 400) {
        // Backend retornou erro 400, checar se é CPF duplicado
          setError("CPF já cadastrado. Tente outro CPF.");
      } else if (response.ok) {
        navigate("/login"); // redireciona ao login após cadastro
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    } catch {
      setError("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4"> <img src="/public/logo.png" alt="" width={'80px'} />Cadastro</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-2">
        <label className="form-label">Nome</label>
        <input type="text" name="nome" className="form-control" onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label className="form-label">Sexo</label>
        <select name="sexo" className="form-select" onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="Feminino">Feminino</option>
          <option value="Masculino">Masculino</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label">CPF</label>
        <input type="text" name="cpf" className="form-control" onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label className="form-label">Data de Nascimento</label>
        <input type="date" name="nascimento" className="form-control" onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label className="form-label">E-mail</label>
        <input type="email" name="email" className="form-control" onChange={handleChange} />
      </div>

      <div className="mb-2">
        <label className="form-label">Senha</label>
        <input type="password" name="senha" className="form-control" onChange={handleChange} />
      </div>

      <button className="btn btn-success w-100 mt-3" onClick={handleRegister}>
        Criar conta
      </button>
    </div>
  );
}

