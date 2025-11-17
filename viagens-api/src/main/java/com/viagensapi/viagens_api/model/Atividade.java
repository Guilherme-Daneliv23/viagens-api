package com.viagensapi.viagens_api.model;

import com.viagensapi.viagens_api.model.enums.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import org.hibernate.validator.constraints.URL;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "atividades")
public class Atividade {
    
    //Criando os atributos da tabela
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    //titulo da atividade
    @NotBlank(message = "O nome da atividade não pode ser vazio")
    @Size(max = 100, message = "O título não pode ultrapassar 100 caracteres")
    @Column(length = 100, nullable = false)
    private String titulo;

    //imagem da atividade
    @URL
    @Column(nullable = true)
    private String imagem;

    // descrição da atividade
    @NotBlank(message = "A descrição não pode ser vazia")
    @Size(max = 500, message = "O tamanho da descrição não pode ultrapassar 500 caracteres")
    @Column(length = 500, nullable = false)
    private String descricao;

    // local da atividade por meio de um link do maps
    @URL
    @Column(name = "local_url", nullable = true)
    private String localUrl;

    // data que a atividade vai ocorrer
    @NotNull(message = "A data da atividade não pode ser vazia")
    @FutureOrPresent(message = "A data não pode estar no passado")
    @Column(nullable = false)
    private LocalDate data;

    // hora em que a atividade inicia
    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    // hora em que a atividade termina
    @Column(name = "hora_fim")
    private LocalTime horaFim;

    // custo estimado daquela atividade
    @PositiveOrZero
    @Digits(integer=8, fraction=2, message = "O valor deve seguir o formato estabelecido com 2 casas decimais")
    @Column(name = "custo_estimado", nullable = true, precision = 10, scale = 2)
    private BigDecimal custoEstimado;

    // categoria da atividade baseando-se na enumeração que contém as categorias possíveis
    @NotNull(message = "A categoria não pode ser vazia")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Categoria categoria;

    // prioridade das atividades que pode variar de 1 a 5
    @Min(value = 1, message = "A prioridade mínima é 1")
    @Max(value = 5, message = "A prioridade máxima é 5")
    @Column(nullable = false)
    private int prioridade;

    // status de conclusao da atividade
    @NotNull(message = "O status da atividade não pode ser vazio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.PENDENTE;

    //CONSTRUTOR PADRÃO
    public Atividade()  {

    }

    //CONSTRUTOR COMPLETO
    public Atividade(String titulo, String imagem, String descricao, String localUrl,
                 LocalDate data, LocalTime horaInicio, LocalTime horaFim,
                 BigDecimal custoEstimado, Categoria categoria, int prioridade) {
        this.titulo = titulo;
        this.imagem = imagem;
        this.descricao = descricao;
        this.localUrl = localUrl;
        this.data = data;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.custoEstimado = custoEstimado;
        this.categoria = categoria;
        this.prioridade = prioridade;
    }

    //GETTERS
    public long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getImagem() {
        return imagem;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getLocalUrl() {
        return localUrl;
    }

    public LocalDate getData() {
        return data;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public BigDecimal getCustoEstimado() {
        return custoEstimado;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public int getPrioridade() {
        return prioridade;
    }

    public Status getStatus() {
        return status;
    }

    //SETTERS
    public void setId(long id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setLocalUrl(String localUrl) {
        this.localUrl = localUrl;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }

    public void setCustoEstimado(BigDecimal custoEstimado) {
        this.custoEstimado = custoEstimado;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public void setPrioridade(int prioridade) {
        this.prioridade = prioridade;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
        
}
