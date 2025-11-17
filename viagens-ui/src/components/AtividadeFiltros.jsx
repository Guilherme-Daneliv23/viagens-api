// src/components/ListAtividades.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AtividadeDataService from "../services/atividadeDataService";
import AtividadeModal, { getStatusStyles } from "./AtividadeCard";

const categorias = [
  "ALIMENTACAO",
  "PASSEIO",
  "HOSPEDAGEM",
  "TRANSPORTE",
  "COMPRAS",
  "OUTRO",
];

const statusList = ["PENDENTE", "CONCLUIDA", "CANCELADA"];

// imagem por categoria
const getImagemCategoria = (categoria) =>
  `/img/${String(categoria).toLowerCase()}.jpeg`;

// data em pt-BR a partir de "yyyy-MM-dd" ou Date
const formatarData = (data) => {
  if (!data) return "";
  if (typeof data === "string" && data.length === 10 && data.includes("-")) {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }
  try {
    return new Date(data).toLocaleDateString("pt-BR");
  } catch {
    return data;
  }
};

export default function ListAtividades() {
  const [atividades, setAtividades] = useState([]);
  const [atividadeModal, setAtividadeModal] = useState(null);

  // filtros
  const [fTitulo, setFTitulo] = useState("");
  const [fCategoria, setFCategoria] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fPrioridade, setFPrioridade] = useState("");
  const [fData, setFData] = useState("");
  const [mensagemLista, setMensagemLista] = useState("");

  const navigate = useNavigate();

  const abrirModal = (atividade) => setAtividadeModal(atividade);
  const fecharModal = () => setAtividadeModal(null);

  const carregarAtividades = async (filtros = {}, isBusca = false) => {
    try {
      const { data } = await AtividadeDataService.getAll(filtros);
      const lista = Array.isArray(data) ? data : [];
      setAtividades(lista);

      if (isBusca) {
        setMensagemLista(
          lista.length === 0
            ? "Não foi possível encontrar atividades com essa combinação de filtros."
            : ""
        );
      }
    } catch {
      setAtividades([]);
      if (isBusca) {
        setMensagemLista(
          "Ocorreu um erro ao buscar atividades. Tente novamente."
        );
      }
    }
  };

  useEffect(() => {
    carregarAtividades();
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    const filtros = {};

    if (fTitulo.trim()) filtros.titulo = fTitulo.trim();
    if (fCategoria) filtros.categoria = fCategoria;
    if (fStatus) filtros.status = fStatus;
    if (fPrioridade) filtros.prioridade = fPrioridade;
    if (fData) filtros.data = fData;

    carregarAtividades(filtros, true);
  };

  const handleLimpar = () => {
    setFTitulo("");
    setFCategoria("");
    setFStatus("");
    setFPrioridade("");
    setFData("");
    setMensagemLista("");
    carregarAtividades();
  };

  const acaoModal = async (fn) => {
    if (!atividadeModal) return;
    await fn(atividadeModal.id);
    await carregarAtividades();
    fecharModal();
  };

  const handleConcluir = () => acaoModal(AtividadeDataService.concluir);
  const handleCancelar = () => acaoModal(AtividadeDataService.cancelar);

  const handleExcluir = async () => {
    if (!atividadeModal) return;
    if (!window.confirm("Tem certeza que deseja excluir esta atividade?"))
      return;
    await AtividadeDataService.delete(atividadeModal.id);
    await carregarAtividades();
    fecharModal();
  };

  const handleEditar = () => {
    if (!atividadeModal) return;
    navigate(`/atividades/${atividadeModal.id}`);
    fecharModal();
  };

  return (
    <div className="container">
      {/* FILTROS */}
      <div className="row mb-4">
        <form className="row g-2" onSubmit={handleBuscar}>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Buscar por título"
              value={fTitulo}
              onChange={(e) => setFTitulo(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={fCategoria}
              onChange={(e) => setFCategoria(e.target.value)}
            >
              <option value="">Categoria</option>
              {categorias.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
            >
              <option value="">Status</option>
              {statusList.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={fPrioridade}
              onChange={(e) => setFPrioridade(e.target.value)}
            >
              <option value="">Prioridade</option>
              {[1, 2, 3, 4, 5].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={fData}
              onChange={(e) => setFData(e.target.value)}
            />
          </div>

          <div className="col-md-2 d-flex gap-2">
            <button type="submit" className="btn btn-primary w-50">
              Buscar
            </button>

            <button
              type="button"
              className="btn btn-light border w-50"
              style={{ color: "#333" }}
              onClick={handleLimpar}
            >
              Limpar
            </button>
          </div>
        </form>
      </div>

      {/* LISTA DE ATIVIDADES EM CARDS */}
      <div className="row g-3">
        {atividades.map((a) => (
          <div key={a.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div
              className="card shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => abrirModal(a)}
            >
              <div className="position-relative">
                <span
                  className="badge position-absolute"
                  style={{
                    ...getStatusStyles(a.status),
                    top: 10,
                    left: 10,
                    opacity: 0.9,
                    minWidth: "100px",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {a.status}
                </span>

                <img
                  src={getImagemCategoria(a.categoria)}
                  className="card-img-top"
                  style={{ height: "140px", objectFit: "cover" }}
                  alt="Imagem da atividade"
                />
              </div>

              <div className="card-body">
                <h5 className="card-title text-truncate">{a.titulo}</h5>
                <p className="text-muted mb-0">{formatarData(a.data)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {atividades.length === 0 && <p className="mt-3">{mensagemLista}</p>}

      {/* MODAL */}
      {atividadeModal && (
        <AtividadeModal
          atividade={atividadeModal}
          onClose={fecharModal}
          onConcluir={handleConcluir}
          onCancelar={handleCancelar}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      )}
    </div>
  );
}
