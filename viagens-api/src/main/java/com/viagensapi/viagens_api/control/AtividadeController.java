package com.viagensapi.viagens_api.control;

import com.viagensapi.viagens_api.model.Atividade;
import com.viagensapi.viagens_api.model.enums.Categoria;
import com.viagensapi.viagens_api.model.enums.Status;
import com.viagensapi.viagens_api.repository.AtividadeRepository;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AtividadeController {
    
    //Faz a injeção do repositório
    @Autowired
    AtividadeRepository rep;

    //POST / : criar uma atividade nova
    @PostMapping("/")
    public ResponseEntity<Atividade> createAtividade(@Valid @RequestBody Atividade at)  {
        try {
            Atividade novaAt = rep.save(new Atividade(at.getTitulo(), 
            at.getImagem(), at.getDescricao(), at.getLocalUrl(), at.getData(),
            at.getHoraInicio(), at.getHoraFim(), at.getCustoEstimado(), 
            at.getCategoria(), at.getPrioridade()));

            return new ResponseEntity<>(novaAt, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //GET /:id : listar uma atividade baseando-se no id
    @GetMapping("/{id}")
    public ResponseEntity<Atividade> getAtividadeById(@PathVariable("id") long id)  {
        try {
            Optional<Atividade> at = rep.findById(id);

            if(at.isPresent())  {
                return new ResponseEntity<>(at.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //GET / : listar todas as tarefas existentes
    @GetMapping("/")
    public ResponseEntity<List<Atividade>> getAllAtividades(@RequestParam(required = false) String titulo,
    @RequestParam(required = false) Categoria categoria, @RequestParam(required = false) Status status, 
    @RequestParam(required = false) Integer prioridade, @RequestParam(required = false) LocalDate data) {
        try {
            List<Atividade> atividades = new ArrayList<>();

            if(titulo == null && categoria == null && status == null && prioridade == null && data == null) {
                rep.findAll().forEach(atividades::add);
            } else if(titulo != null && categoria == null && status == null && prioridade == null && data == null)  {
                rep.findByTituloContaining(titulo).forEach(atividades::add);
            } else if(titulo == null && categoria != null && status == null && prioridade == null && data == null)  {
                rep.findByCategoria(categoria).forEach(atividades::add);
            } else if(titulo == null && categoria == null && status != null && prioridade == null && data == null)  {
                rep.findByStatus(status).forEach(atividades::add);
            } else if(titulo == null && categoria == null && status == null && prioridade != null && data == null)  {
                rep.findByPrioridade(prioridade).forEach(atividades::add);
            } else if(titulo == null && categoria == null && status == null && prioridade == null && data != null)  {
                rep.findByData(data).forEach(atividades::add);
            }

            if(atividades.isEmpty())    {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(atividades, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //PUT /:id : atualizar uma atividade dado um id
    @PutMapping("/{id}")
    public ResponseEntity<Atividade> updateAtividade(@Valid @RequestBody Atividade at, @PathVariable("id") long id) {
        try {
            Optional<Atividade> data = rep.findById(id);

            if(data.isPresent())    {
                Atividade oldAtividade = data.get();
                oldAtividade.setTitulo(at.getTitulo());
                oldAtividade.setImagem(at.getImagem());
                oldAtividade.setDescricao(at.getDescricao());
                oldAtividade.setLocalUrl(at.getLocalUrl());
                oldAtividade.setData(at.getData());
                oldAtividade.setHoraInicio(at.getHoraInicio());
                oldAtividade.setHoraFim(at.getHoraFim());
                oldAtividade.setCustoEstimado(at.getCustoEstimado());
                oldAtividade.setCategoria(at.getCategoria());
                oldAtividade.setPrioridade(at.getPrioridade());

                Atividade updated = rep.save(oldAtividade);

                return new ResponseEntity<>(updated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //DELETE /:id : deleta uma atividade dado um id
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAtividade(@PathVariable("id") long id)  {
        try {
            Optional<Atividade> data = rep.findById(id);

            if(data.isPresent())    {
                rep.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //PATCH: /:id/concluir: altera uma atividade como concluida baseado em um id
    @PatchMapping("/{id}/concluir")
    public ResponseEntity<Atividade> concluirAtividade(@PathVariable("id") long id) {
        try {
            Optional<Atividade> data = rep.findById(id);

            if(data.isPresent())    {
                Atividade olAtividade = data.get();
                olAtividade.setStatus(Status.concluida);
                Atividade updated = rep.save(olAtividade);
                return new ResponseEntity<>(updated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //PATCH: /:id/cancelar: altera uma atividade como cancelada baseado em um id
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Atividade> cancelarAtividade(@PathVariable("id") long id) {
        try {
            Optional<Atividade> data = rep.findById(id);

            if(data.isPresent())    {
                Atividade olAtividade = data.get();
                olAtividade.setStatus(Status.cancelada);
                Atividade updated = rep.save(olAtividade);
                return new ResponseEntity<>(updated, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
 
}
