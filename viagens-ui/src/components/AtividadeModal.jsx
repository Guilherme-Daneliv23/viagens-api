// src/components/AtividadeModal.jsx

// campos obrigatórios
const CAMPOS_OBRIGATORIOS = [
  "titulo",
  "descricao",
  "data",
  "categoria",
  "prioridade",
  "status",
];

const LABELS = {
  titulo: "Título",
  descricao: "Descrição",
  data: "Data",
  horaInicio: "Hora de Início",
  horaFim: "Hora de Fim",
  custoEstimado: "Custo Estimado (R$)",
  categoria: "Categoria",
  prioridade: "Prioridade",
  status: "Status",
  localUrl: "Local",
};

const formatarNomeCampo = (campo) =>
  LABELS[campo] || campo.charAt(0).toUpperCase() + campo.slice(1);

// "yyyy-MM-dd" -> "dd/MM/yyyy" (pt-BR)
const formatarDataBR = (valor) => {
  if (!valor) return valor;
  const partes = valor.split("-");
  if (partes.length !== 3) return valor;

  const [ano, mes, dia] = partes.map(Number);
  const data = new Date(ano, mes - 1, dia);
  return isNaN(data.getTime())
    ? valor
    : data.toLocaleDateString("pt-BR");
};

// imagem por categoria
const getImagemCategoria = (categoria) =>
  `/img/${String(categoria).toLowerCase()}.jpeg`;

// estilos para badge de status
export function getStatusStyles(status) {
  const s = (status || "").toLowerCase();
  let backgroundColor = "#6c757d";
  let color = "white";

  if (s === "concluida" || s === "concluída") {
    backgroundColor = "#28a745";
  } else if (s === "pendente") {
    backgroundColor = "#ffc107";
    color = "black";
  } else if (s === "cancelada") {
    backgroundColor = "#dc3545";
  }

  return {
    backgroundColor,
    color,
    padding: "6px 12px",
    fontWeight: "bold",
    textTransform: "capitalize",
  };
}

// render dos campos de texto
const renderizarCamposDetalhados = (atividade) => {
  if (!atividade) return null;

  return Object.entries(atividade)
    .filter(([campo]) => campo !== "id" && campo !== "imagem")
    .map(([campo, valor]) => {
      if(campo !== "titulo")  {
         const nomeCampo = formatarNomeCampo(campo);     
     
        if (campo === "localUrl") {
          return (
            <p key={campo}>
              <strong>{nomeCampo}:</strong>{" "}
              {valor ? (
                <a href={valor} target="_blank" rel="noreferrer">
                  Abrir no Maps
                </a>
              ) : (
                "Não foi selecionado local."
              )}
            </p>
          );
        }

        if (campo === "data") {
          const exibicao = valor
            ? formatarDataBR(valor)
            : "(campo obrigatório vazio)";
          return (
            <p key={campo}>
              <strong>{nomeCampo}:</strong> {exibicao}
            </p>
          );
        }

        if (CAMPOS_OBRIGATORIOS.includes(campo)) {
          return (
            <p key={campo}>
              <strong>{nomeCampo}:</strong>{" "}
              {valor || "(campo obrigatório vazio)"}
            </p>
          );
        }

        return (
          <p key={campo}>
            <strong>{nomeCampo}:</strong>{" "}
            {valor || `Não foi selecionado(a) ${nomeCampo}.`}
          </p>
        );
      }
    });
};

export default function AtividadeModal({
  atividade,
  onClose,
  onConcluir,
  onCancelar,
  onEditar,
  onExcluir,
}) {
  if (!atividade) return null;

  const handleBackdropClick = () => onClose && onClose();
  const stopProp = (e) => e.stopPropagation();

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        padding: 20,
      }}
    >
      <div
        className="bg-white rounded"
        onClick={stopProp}
        style={{
          width: "85%",
          maxWidth: 1000,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 24,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h2 style={{ margin: 0 }}>{atividade.titulo}</h2>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="row">
          {/* info */}
          <div className="col-md-7">
            {renderizarCamposDetalhados(atividade)}
          </div>

          {/* imagem + ações */}
          <div className="col-md-5 d-flex flex-column align-items-stretch">
            <div style={{ flex: 1 }}>
              <img
                src={getImagemCategoria(atividade.categoria)}
                alt="Atividade"
                style={{
                  width: "100%",
                  height: "100%",
                  maxHeight: 400,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </div>

            <div className="d-flex justify-content-between gap-2 mt-3">
              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={onConcluir}>
                  Concluir
                </button>
                <button className="btn btn-warning" onClick={onCancelar}>
                  Cancelar
                </button>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={onEditar}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={onExcluir}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
