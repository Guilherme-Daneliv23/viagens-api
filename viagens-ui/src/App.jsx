// src/App.jsx
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import AtividadeAgenda from "./components/AtividadeAgenda.jsx";
import AtividadeFiltros from "./components/AtividadeFiltros.jsx";
import AtividadeForm from "./components/AtividadeForm.jsx";

const navItemStyle = (active) => ({
  fontSize: "17px",
  fontFamily: "Verdana",
  fontWeight: "bold",
  padding: "6px 12px",
  borderRadius: "6px",
  display: "inline-block",
  textDecoration: "none",
  color: active ? "#005ea5ff" : "white",
  backgroundColor: active ? "white" : "transparent",
  transition: "background-color 0.15s ease, color 0.15s ease",
});

export default function App() {
  const { pathname } = useLocation();

  const isAgenda = pathname === "/" || pathname === "/agenda";
  const isAtividades = pathname === "/atividades";
  const isAdd = pathname === "/atividades/add";

  return (
    <div>
      <nav
        className="navbar navbar-expand navbar-dark"
        style={{ backgroundColor: "#005ea5ff" }}
      >
        <div className="container">
          <NavLink
            to="/"
            className="navbar-brand fw-bold d-flex align-items-center"
            style={{ textDecoration: "none" }}
          >
            <img
              src="/img/logo.png"
              alt="Logo ViajAgenda"
              style={{
                height: 45,
                width: 45,
                objectFit: "contain",
                marginRight: 6,
              }}
            />
            <span style={{ fontFamily: "Verdana", fontSize: 29, color: "white" }}>
              ViajAgenda
            </span>
          </NavLink>

          <div className="navbar-nav ms-auto" style={{ gap: 8 }}>
            <NavLink to="/agenda" className="nav-link" style={navItemStyle(isAgenda)}>
              Agenda
            </NavLink>

            <NavLink
              to="/atividades"
              className="nav-link"
              style={navItemStyle(isAtividades)}
            >
              Atividades
            </NavLink>

            <NavLink
              to="/atividades/add"
              className="nav-link"
              style={navItemStyle(isAdd)}
            >
              Adicionar
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<AtividadeAgenda />} />
          <Route path="/agenda" element={<AtividadeAgenda />} />
          <Route path="/atividades" element={<AtividadeFiltros />} />
          <Route path="/atividades/add" element={<AtividadeForm mode="create" />} />
          <Route path="/atividades/:id" element={<AtividadeForm mode="edit" />} />
        </Routes>
      </div>
    </div>
  );
}
