import React, { useEffect, useState } from "react";
import { arrayOf, shape, string } from "prop-types";
import { useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Card } from "src/components/Faq";
import {
  AJUDA,
  CADASTRO_CATEGORIA,
  CADASTRO_DUVIDAS_FREQUENTES,
} from "src/configs/constants";
import { usuarioComAcessoAoCadastroDeCategorias } from "src/helpers/utilities";
import { getFaq } from "src/services/faq.service";
import "./style.scss";

const ConteudoPerguntas = ({ itens }) => {
  return (
    <div className="conteudo-perguntas">
      {itens.length ? (
        itens.map((perguntaFrequente, indice) => (
          <Card
            key={
              perguntaFrequente.uuid ||
              `${perguntaFrequente.pergunta}-${indice}`
            }
            question={perguntaFrequente.pergunta}
            answer={perguntaFrequente.resposta}
          />
        ))
      ) : (
        <div className="sem-resultados-busca" />
      )}
    </div>
  );
};

ConteudoPerguntas.propTypes = {
  itens: arrayOf(
    shape({
      uuid: string,
      pergunta: string.isRequired,
      resposta: string.isRequired,
    }),
  ).isRequired,
};

const Faq = () => {
  const [carregando, setCarregando] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [indiceCategoriaAtiva, setIndiceCategoriaAtiva] = useState(0);

  const navegar = useNavigate();

  useEffect(() => {
    async function buscarDados() {
      try {
        const resultado = await getFaq();

        if (resultado.data) {
          setCategorias(resultado.data);
        }
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  useEffect(() => {
    const termoBuscaNormalizado = termoBusca.trim().toLowerCase();

    if (!termoBuscaNormalizado) {
      setCategoriasFiltradas(categorias);
      setIndiceCategoriaAtiva(0);
      return;
    }

    const categoriasFiltradasPorBusca = categorias
      .map((categoria) => ({
        ...categoria,
        perguntas: categoria.perguntas.filter((perguntaFrequente) =>
          perguntaFrequente.pergunta
            .toLowerCase()
            .includes(termoBuscaNormalizado),
        ),
      }))
      .filter((categoria) => categoria.perguntas.length > 0);

    setCategoriasFiltradas(categoriasFiltradasPorBusca);
    setIndiceCategoriaAtiva(0);
  }, [categorias, termoBusca]);

  const categoriaAtiva = categoriasFiltradas[indiceCategoriaAtiva];

  return (
    <div className="pagina-faq">
      <div className="row mb-4">
        <div className="d-none d-md-block col-md-4 col-lg-3" />

        <div className="col-12 col-md-8 col-lg-9">
          <div className="d-flex justify-content-end align-items-center gap-3 flex-wrap">
            {usuarioComAcessoAoCadastroDeCategorias() && (
              <Botao
                texto="Cadastro de Categoria"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                onClick={() => navegar(`/${AJUDA}/${CADASTRO_CATEGORIA}`)}
              />
            )}

            <Botao
              texto="Cadastro Dúvidas Frequentes"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() =>
                navegar(`/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}`)
              }
            />
          </div>
        </div>
      </div>

      <div className="container-fluid tela-faq px-0">
        <div className="container-titulo-faq">
          <h4 className="titulo-faq">Como podemos ajudar?</h4>
        </div>

        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-8 col-lg-8 container-busca-faq p-0 mb-0">
            <input
              id="search-input"
              className="campo-busca-faq"
              type="text"
              placeholder="Pesquisar"
              value={termoBusca}
              onChange={(evento) => setTermoBusca(evento.target.value)}
            />

            <i className="fas fa-search fa-lg icone-busca-faq" />
          </div>
        </div>

        {carregando && (
          <div className="row justify-content-center">
            <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
          </div>
        )}

        {!carregando && !!categoriasFiltradas.length && (
          <div className="row conteudo-faq">
            <div className="col-12 col-md-4 col-lg-3">
              <aside className="menu-categorias-faq">
                <h5 className="menu-categorias-faq__titulo">Categoria</h5>

                <div className="menu-categorias-faq__itens">
                  {categoriasFiltradas.map((categoria, indice) => {
                    const estaAtiva = indiceCategoriaAtiva === indice;

                    return (
                      <button
                        key={categoria.uuid || categoria.nome}
                        type="button"
                        className={`menu-categorias-faq__item ${
                          estaAtiva ? "menu-categorias-faq__item--ativo" : ""
                        }`}
                        onClick={() => setIndiceCategoriaAtiva(indice)}
                      >
                        {categoria.nome}
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>

            <div className="col-12 col-md-8 col-lg-9">
              <ConteudoPerguntas itens={categoriaAtiva?.perguntas || []} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Faq;
