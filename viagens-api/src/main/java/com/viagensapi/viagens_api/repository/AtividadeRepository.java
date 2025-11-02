package com.viagensapi.viagens_api.repository;

import com.viagensapi.viagens_api.model.enums.*;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.viagensapi.viagens_api.model.Atividade;

public interface AtividadeRepository extends JpaRepository<Atividade, Long> { 
      List<Atividade> findByTituloContaining(String titulo);
      List<Atividade> findByCategoria(Categoria categoria);
      List<Atividade> findByStatus(Status status);
      List<Atividade> findByData(LocalDate data);
      List<Atividade> findByPrioridade(int prioridade);
}
