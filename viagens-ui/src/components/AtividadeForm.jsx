// src/components/AtividadeForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AtividadeDataService from "../services/atividadeDataService";

const categorias = [
  "ALIMENTACAO",
  "PASSEIO",
  "HOSPEDAGEM",
  "TRANSPORTE",
  "COMPRAS",
  "OUTRO",
];

const statusList = ["PENDENTE", "CONCLUIDA", "CANCELADA"];
const requiredFields = ["titulo", "descricao", "data", "categoria", "prioridade"];

const toTimeInput = (value) => {
  if (!value) return "";
  const [h, m] = String(value).split(":");
  return `${h || "00"}:${m || "00"}`;
};

const fromTimeInput = (value) => {
  if (!value) return null;
  return value.length === 5 ? value + ":00" : value;
};

const initialAtividade = {
  titulo: "",
  imagem: "",
  descricao: "",
  localUrl: "",
  data: "",
  horaInicio: "",
  horaFim: "",
  custoEstimado: "",
  categoria: "",
  prioridade: 1,
  status: "PENDENTE",
};

const isEmpty = (v) =>
  !v || (typeof v === "string" && v.trim() === "");

export default function AtividadeForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [atividade, setAtividade] = useState(initialAtividade);
  const [mensagem, setMensagem] = useState("");
  const [errors, setErrors] = useState({});

  // carrega dados na edição
  useEffect(() => {
    if (!isEdit || !id) return;

    const carregar = async () => {
      try {
        const { data: a } = await AtividadeDataService.get(id);
        setAtividade({
          ...a,
          horaInicio: toTimeInput(a.horaInicio),
          horaFim: toTimeInput(a.horaFim),
          custoEstimado: a.custoEstimado ?? "",
        });
      } catch (e) {
        console.error(e);
      }
    };

    carregar();
  }, [isEdit, id]);

  // --------- VALIDAÇÃO ---------
  const validateField = (name, value) => {
    if (!requiredFields.includes(name)) return true;

    const msg = isEmpty(value)
      ? "Campo obrigatório. Preencha para cadastrar a atividade."
      : "";

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return !msg;
  };

  const validateAll = () => {
    const newErrors = {};
    let ok = true;

    requiredFields.forEach((field) => {
      const value = atividade[field];
      if (isEmpty(value)) {
        newErrors[field] =
          "Campo obrigatório. Preencha para cadastrar a atividade.";
        ok = false;
      }
    });

    setErrors(newErrors);
    return ok;
  };
  // ------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAtividade((prev) => ({ ...prev, [name]: value }));

    if (requiredFields.includes(name)) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (requiredFields.includes(name)) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (!validateAll()) {
      setMensagem("Preencha todos os campos obrigatórios para continuar.");
      return;
    }

    const payload = {
      ...atividade,
      horaInicio: fromTimeInput(atividade.horaInicio),
      horaFim: fromTimeInput(atividade.horaFim),
      custoEstimado:
        atividade.custoEstimado === "" ? null : Number(atividade.custoEstimado),
    };

    if (!isEdit) {
      delete payload.status; // back define PENDENTE
    }

    const msgSucesso = isEdit
      ? "Atividade atualizada com sucesso!"
      : "Atividade cadastrada com sucesso!";
    const msgErro = isEdit
      ? "Erro ao atualizar atividade."
      : "Erro ao cadastrar atividade.";

    try {
      if (isEdit) {
        await AtividadeDataService.update(id, payload);
      } else {
        await AtividadeDataService.create(payload);
      }
      setMensagem(msgSucesso);
      navigate("/agenda");
    } catch {
      setMensagem(msgErro);
    }
  };

  return (
    <div className="col-md-8 mx-auto">
      <h3 className="mb-4">
        {isEdit ? "Editar Atividade" : "Cadastrar Atividade"}
      </h3>

      <form onSubmit={handleSubmit} noValidate>
        {/* TÍTULO */}
        <div className="mb-3">
          <label className="form-label">Título *</label>
          <input
            type="text"
            name="titulo"
            maxLength={100}
            value={atividade.titulo}
            onChange={handleChange}
            onBlur={handleBlur}
            className={"form-control" + (errors.titulo ? " is-invalid" : "")}
          />
          {errors.titulo && (
            <div className="invalid-feedback">{errors.titulo}</div>
          )}
        </div>

        {/* DESCRIÇÃO */}
        <div className="mb-3">
          <label className="form-label">Descrição *</label>
          <textarea
            name="descricao"
            rows="3"
            maxLength={500}
            value={atividade.descricao}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              "form-control" + (errors.descricao ? " is-invalid" : "")
            }
          />
          {errors.descricao && (
            <div className="invalid-feedback">{errors.descricao}</div>
          )}
        </div>

        {/* LOCAL */}
        <div className="mb-3">
          <label className="form-label">Link do local (URL)</label>
          <input
            type="url"
            name="localUrl"
            value={atividade.localUrl || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* DATA / HORAS */}
        <div className="row">
          <div className="mb-3 col-md-4">
            <label className="form-label">Data *</label>
            <input
              type="date"
              name="data"
              value={atividade.data || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              min={new Date().toISOString().split("T")[0]}
              className={"form-control" + (errors.data ? " is-invalid" : "")}
            />
            {errors.data && (
              <div className="invalid-feedback">{errors.data}</div>
            )}
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label">Hora início</label>
            <input
              type="time"
              name="horaInicio"
              value={atividade.horaInicio || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label">Hora fim</label>
            <input
              type="time"
              name="horaFim"
              value={atividade.horaFim || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* CATEGORIA / PRIORIDADE / CUSTO */}
        <div className="row">
          <div className="mb-3 col-md-4">
            <label className="form-label">Categoria *</label>
            <select
              name="categoria"
              value={atividade.categoria || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                "form-select" + (errors.categoria ? " is-invalid" : "")
              }
            >
              <option value="">Selecione...</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <div className="invalid-feedback">{errors.categoria}</div>
            )}
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label">Prioridade (1 a 5) *</label>
            <select
              name="prioridade"
              value={atividade.prioridade}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                "form-select" + (errors.prioridade ? " is-invalid" : "")
              }
            >
              {[1, 2, 3, 4, 5].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.prioridade && (
              <div className="invalid-feedback">{errors.prioridade}</div>
            )}
          </div>

          <div className="mb-3 col-md-4">
            <label className="form-label">Custo estimado (R$)</label>
            <input
              type="number"
              name="custoEstimado"
              value={atividade.custoEstimado}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="form-control"
            />
          </div>
        </div>

        {/* STATUS — APENAS NA EDIÇÃO */}
        {isEdit && (
          <div className="mb-3 col-md-4">
            <label className="form-label">Status *</label>
            <select
              name="status"
              value={atividade.status}
              onChange={handleChange}
              className="form-select"
            >
              {statusList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* BOTÕES */}
        <button type="submit" className="btn btn-success">
          {isEdit ? "Atualizar" : "Enviar"}
        </button>

        <Link to="/agenda" className="btn btn-link ms-2">
          Voltar
        </Link>

        {mensagem && <p className="mt-3">{mensagem}</p>}
      </form>
    </div>
  );
}
