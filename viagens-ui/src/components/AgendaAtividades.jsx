// src/components/AgendaAtividades.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AtividadeDataService from "../services/atividadeDataService";
import AtividadeModal, { getStatusStyles } from "./AtividadeModal";

// cria Date local a partir de "yyyy-MM-dd"
const toLocalDate = (iso) => {
  if (!iso) return null;
  const partes = iso.split("-");
  if (partes.length !== 3) return null;
  const [ano, mes, dia] = partes.map(Number);
  const d = new Date(ano, mes - 1, dia);
  return isNaN(d.getTime()) ? null : d;
};

const ordenarAtividades = (a, b) => {
  const pa = Number(a.prioridade) || 0;
  const pb = Number(b.prioridade) || 0;
  if (pa !== pb) return pb - pa;
  return (a.horaInicio || "").localeCompare(b.horaInicio || "");
};

function organizarAtividades(lista) {
  if (!Array.isArray(lista)) return [];

  const meses = {};

  lista.forEach((atividade) => {
    if (!atividade.data) return;

    const data = toLocalDate(atividade.data);
    if (!data) return;

    const mesLabel = data.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });

    const diaLabel = data.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    if (!meses[mesLabel]) {
      meses[mesLabel] = {
        label: mesLabel,
        tsMes: new Date(data.getFullYear(), data.getMonth(), 1).getTime(),
        dias: {},
      };
    }

    const tsDia = data.getTime();

    if (!meses[mesLabel].dias[diaLabel]) {
      meses[mesLabel].dias[diaLabel] = {
        label: diaLabel,
        tsDia,
        atividades: [],
      };
    }

    meses[mesLabel].dias[diaLabel].atividades.push(atividade);
  });

  return Object.values(meses)
    .sort((a, b) => a.tsMes - b.tsMes)
    .map((mes) => ({
      mes: mes.label,
      dias: Object.values(mes.dias)
        .sort((a, b) => a.tsDia - b.tsDia)
        .map((dia) => ({
          dia: dia.label,
          atividades: dia.atividades.sort(ordenarAtividades),
        })),
    }));
}

export default function AgendaAtividades() {
  const [grupos, setGrupos] = useState([]);
  const [atividadeAberta, setAtividadeAberta] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const carregar = async () => {
    setLoading(true);
    try {
      const { data } = await AtividadeDataService.getAll();
      setGrupos(organizarAtividades(data || []));
    } catch {
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirModal = (a) => setAtividadeAberta(a);
  const fecharModal = () => setAtividadeAberta(null);

  const acaoEmAtividadeAberta = async (fn) => {
    if (!atividadeAberta) return;
    await fn(atividadeAberta.id);
    await carregar();
    fecharModal();
  };

  const handleConcluir = () => acaoEmAtividadeAberta(AtividadeDataService.concluir);
  const handleCancelar = () => acaoEmAtividadeAberta(AtividadeDataService.cancelar);

  const handleExcluir = async () => {
    if (!atividadeAberta) return;
    if (!window.confirm("Deseja realmente excluir esta atividade?")) return;
    await AtividadeDataService.delete(atividadeAberta.id);
    await carregar();
    fecharModal();
  };

  const handleEditar = () => {
    if (!atividadeAberta) return;
    navigate(`/atividades/${atividadeAberta.id}`);
    fecharModal();
  };

  return (
    <div>
      <h1 className="mb-4">Agenda de Atividades</h1>

      {loading && <p>Carregando...</p>}
      {!loading && grupos.length === 0 && <p>Não há atividades cadastradas.</p>}

      {grupos.map((m) => (
        <div key={m.mes} className="mb-5">
          <h3 className="text-capitalize">{m.mes}</h3>

          {m.dias.map((d) => (
            <div key={d.dia} className="mb-4">
              <h5 className="text-capitalize">{d.dia}</h5>

              <div className="list-group">
                {d.atividades.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    onClick={() => abrirModal(a)}
                  >
                    <div>
                      <div className="fw-bold">{a.titulo}</div>
                      <small>
                        {a.categoria} | Prioridade {a.prioridade}
                      </small>
                    </div>

                    <span
                      className="badge"
                      style={{
                        ...getStatusStyles(a.status),
                        minWidth: "100px",
                        textAlign: "center",
                        display: "inline-block",
                      }}
                    >
                      {a.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {atividadeAberta && (
        <AtividadeModal
          atividade={atividadeAberta}
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
