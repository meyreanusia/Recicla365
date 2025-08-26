// src/pages/CadastroLocal.jsx
import { useState } from "react";

const RESIDUOS_OPCOES = ["Vidro", "Metal", "Papel", "Plástico", "Orgânico"];

export default function CadastroLocal() {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      localidade: "",
      estado: "",
    },
    coordenadas: {
      latitude: "",
      longitude: "",
    },
    residuosAceitos: [],
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  const onlyDigits = (v) => v.replace(/\D/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["cep","logradouro","numero","complemento","bairro","localidade","estado"].includes(name)) {
      setForm(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [name]: value }
      }));
    } else if (["latitude","longitude"].includes(name)) {
      setForm(prev => ({
        ...prev,
        coordenadas: { ...prev.coordenadas, [name]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleResiduo = (residuo) => {
    setForm(prev => {
      const jaTem = prev.residuosAceitos.includes(residuo);
      return {
        ...prev,
        residuosAceitos: jaTem
          ? prev.residuosAceitos.filter(r => r !== residuo)
          : [...prev.residuosAceitos, residuo],
      };
    });
  };

  // Busca endereço (ViaCEP) + lat/long (BrasilAPI) ao sair do campo CEP
  const handleCepBlur = async () => {
    setErro("");
    setOk("");
    const cep = onlyDigits(form.endereco.cep);

    if (cep.length !== 8) {
      setErro("CEP inválido. Use 8 dígitos.");
      return;
    }

    try {
      setLoadingCep(true);

      const resp = await fetch(`http://localhost:3000/cep/${cep}`);
      const data = await resp.json();

      if (!resp.ok || data.erro) {
        setErro("CEP não encontrado.");
        return;
      }

      setForm(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          localidade: data.localidade || "",
          estado: data.uf || "",
        },
        coordenadas: {
          latitude: data.coordenada?.latitude || prev.coordenadas.latitude,
          longitude: data.coordenada?.longitude || prev.coordenadas.longitude,
        }
      }));

    } catch {
      setErro("Falha ao consultar o CEP. Verifique sua conexão.");
    } finally {
      setLoadingCep(false);
    }
  };

  const validar = () => {
    if (!form.nome) return "Informe o nome do local.";
    if (!form.descricao) return "Informe a descrição.";
    if (onlyDigits(form.endereco.cep).length !== 8) return "CEP inválido.";
    if (!form.endereco.logradouro || !form.endereco.bairro || !form.endereco.localidade || !form.endereco.estado)
      return "Endereço incompleto. Use o CEP para auto-preencher.";
    if (form.residuosAceitos.length === 0)
      return "Selecione ao menos um tipo de resíduo aceito.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setOk("");

    const msg = validar();
    if (msg) {
      setErro(msg);
      return;
    }

    setSalvando(true);
    try {
      const resp = await fetch("http://localhost:3000/coletas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          descricao: form.descricao,
          endereco: {
            cep: onlyDigits(form.endereco.cep),
            logradouro: form.endereco.logradouro,
            numero: form.endereco.numero,
            complemento: form.endereco.complemento,
            bairro: form.endereco.bairro,
            localidade: form.endereco.localidade,
            estado: form.endereco.estado,
            latitude: form.coordenadas.latitude ? Number(form.coordenadas.latitude) : null,
            longitude: form.coordenadas.longitude ? Number(form.coordenadas.longitude) : null,
          },
          residuosAceitos: form.residuosAceitos,
        }),
      });

      if (resp.ok) {
        setOk("Local de coleta cadastrado com sucesso!");
      } else if (resp.status === 400) {
        const data = await resp.json().catch(() => ({}));
        setErro(data?.error || "Dados inválidos. Verifique os campos.");
      } else {
        setErro("Erro ao salvar. Tente novamente.");
      }
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <h3 className="mb-3">Cadastrar Local de Coleta</h3>

      {erro && <div className="alert alert-danger">{erro}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      <form onSubmit={handleSubmit}>
        {/* Nome / Descrição */}
        <div className="mb-3">
          <label className="form-label">Nome do local *</label>
          <input
            type="text"
            name="nome"
            className="form-control"
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex.: Ponto Verde Centro"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição *</label>
          <textarea
            name="descricao"
            className="form-control"
            rows={3}
            value={form.descricao}
            onChange={handleChange}
            placeholder="Descreva o local, horários de funcionamento, observações..."
          />
        </div>

        {/* Endereço */}
        <div className="row g-3">
          <div className="col-sm-6">
            <label className="form-label">CEP *</label>
            <input
              type="text"
              name="cep"
              className="form-control"
              value={form.endereco.cep}
              onChange={handleChange}
              onBlur={handleCepBlur}
              placeholder="Somente números"
            />
            {loadingCep && <div className="form-text">Buscando endereço pelo CEP...</div>}
          </div>
          <div className="col-sm-6">
            <label className="form-label">Logradouro *</label>
            <input
              type="text"
              name="logradouro"
              className="form-control"
              value={form.endereco.logradouro}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-4">
            <label className="form-label">Número</label>
            <input
              type="text"
              name="numero"
              className="form-control"
              value={form.endereco.numero}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-8">
            <label className="form-label">Complemento</label>
            <input
              type="text"
              name="complemento"
              className="form-control"
              value={form.endereco.complemento}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-6">
            <label className="form-label">Bairro *</label>
            <input
              type="text"
              name="bairro"
              className="form-control"
              value={form.endereco.bairro}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-4">
            <label className="form-label">Cidade *</label>
            <input
              type="text"
              name="localidade"
              className="form-control"
              value={form.endereco.localidade}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <label className="form-label">UF *</label>
            <input
              type="text"
              name="estado"
              className="form-control"
              value={form.endereco.estado}
              onChange={handleChange}
              maxLength={2}
            />
          </div>

          <div className="col-sm-6">
            <label className="form-label">Latitude</label>
            <input
              type="text"
              name="latitude"
              className="form-control"
              value={form.coordenadas.latitude}
              onChange={handleChange}
              placeholder="-23.55052"
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Longitude</label>
            <input
              type="text"
              name="longitude"
              className="form-control"
              value={form.coordenadas.longitude}
              onChange={handleChange}
              placeholder="-46.633308"
            />
          </div>
        </div>

        {/* Resíduos */}
        <div className="mt-4">
          <label className="form-label d-block">Tipos de resíduos aceitos *</label>
          <div className="d-flex flex-wrap gap-3">
            {RESIDUOS_OPCOES.map((item) => (
              <div className="form-check" key={item}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`res-${item}`}
                  checked={form.residuosAceitos.includes(item)}
                  onChange={() => toggleResiduo(item)}
                />
                <label className="form-check-label" htmlFor={`res-${item}`}>
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar local"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => window.history.back()}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
