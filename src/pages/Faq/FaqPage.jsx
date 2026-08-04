import React, { useState, useEffect } from "react";
import { arrayOf, string, shape } from "prop-types";
import PageNoSidebar from "../../components/Shareable/Page/PageNoSidebar";
import { Card } from "../../components/Faq";
import { getFaq } from "../../services/faq.service";
import "./style.scss";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import { HOME } from "../../constants/config";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

const TabContent = ({ items }) => {
  return (
    <div className="tab-content">
      {items.length ? (
        items.map((item, index) => (
          <Card
            key={item.uuid || `${item.pergunta}-${index}`}
            question={item.pergunta}
            answer={item.resposta}
          />
        ))
      ) : (
        <div className="no-search-results" />
      )}
    </div>
  );
};

TabContent.propTypes = {
  items: arrayOf(
    shape({
      uuid: string,
      pergunta: string.isRequired,
      resposta: string.isRequired,
    }),
  ).isRequired,
};

const FaqPage = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [pattern, setPattern] = useState("");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getFaq();

        if (result.data) {
          setCategories(result.data);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const normalizedPattern = pattern.trim().toLowerCase();

    if (!normalizedPattern) {
      setFilteredCategories(categories);
      setActiveCategoryIndex(0);
      return;
    }

    const filtered = categories.map((category) => ({
      ...category,
      perguntas: category.perguntas.filter((item) =>
        item.pergunta.toLowerCase().includes(normalizedPattern),
      ),
    }));

    setFilteredCategories(filtered);
    setActiveCategoryIndex(0);
  }, [categories, pattern]);

  const activeCategory = filteredCategories[activeCategoryIndex];

  return (
    <PageNoSidebar
      titulo="Dúvidas Frequentes"
      botaoVoltar
      voltarPara={HOME}
      breadcrumb={
        <Breadcrumb
          home={HOME}
          atual={{
            href: "/ajuda",
            titulo: "Ajuda",
          }}
        />
      }
    >
      <div className="row mb-4">
        <div className="d-none d-md-block col-md-4 col-lg-3" />
        <div className="col-12 col-md-8 col-lg-9">
          <div className="d-flex justify-content-end align-items-center gap-3 flex-wrap">
            <Botao
              texto="Cadastro de Categoria"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() => {}}
            />

            <Botao
              texto="Cadastro Dúvidas Frequentes"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid faq-screen px-0">
        <div className="faq-title-container">
          <h4 className="faq-title">Como podemos ajudar?</h4>
        </div>

        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-8 col-lg-8 search-input-container p-0 mb-0">
            <input
              id="search-input"
              type="text"
              placeholder="Pesquisar"
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
            />
            <i className="fas fa-search fa-lg" />
          </div>
        </div>
        {loading && (
          <div className="row justify-content-center">
            <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
          </div>
        )}

        {!loading && !!filteredCategories.length && (
          <div className="row faq-content">
            <div className="col-12 col-md-4 col-lg-3">
              <aside className="faq-category-menu">
                <h5 className="faq-category-menu__title">Categoria</h5>

                <div className="faq-category-menu__items">
                  {filteredCategories.map((category, index) => {
                    const isActive = activeCategoryIndex === index;

                    return (
                      <button
                        key={category.uuid || category.nome}
                        type="button"
                        className={`faq-category-menu__item ${
                          isActive ? "faq-category-menu__item--active" : ""
                        }`}
                        onClick={() => setActiveCategoryIndex(index)}
                      >
                        {category.nome}
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>

            <div className="col-12 col-md-8 col-lg-9">
              <TabContent items={activeCategory?.perguntas || []} />
            </div>
          </div>
        )}
      </div>
    </PageNoSidebar>
  );
};

export default FaqPage;
