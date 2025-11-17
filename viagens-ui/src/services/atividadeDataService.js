// src/services/atividadeDataService.js
import http from "../http-common";

class AtividadeDataService {
  getAll(params) {
    // params opcional para filtros (titulo, categoria, status, prioridade, data)
    return http.get("/", { params });
  }

  get(id) {
    return http.get(`/${id}`);
  }

  create(data) {
    return http.post("/", data);
  }

  update(id, data) {
    return http.put(`/${id}`, data);
  }

  delete(id) {
    return http.delete(`/${id}`);
  }

  concluir(id) {
    return http.patch(`/${id}/concluir`);
  }

  cancelar(id) {
    return http.patch(`/${id}/cancelar`);
  }
}

export default new AtividadeDataService();
