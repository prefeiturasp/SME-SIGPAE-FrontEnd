import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { string } from "prop-types";
import { ToggleExpandir } from "../Shareable/ToggleExpandir";
import "./style.scss";

const Card = ({ question: pergunta, answer: resposta }) => {
  const [recolhido, setRecolhido] = useState(true);

  const alternarExpansao = () => {
    setRecolhido((valorAtual) => !valorAtual);
  };

  return (
    <div className="card cartao-faq">
      <div className="borda-cartao-faq" aria-hidden="true" />

      <div className="container-fluid conteudo-cartao-faq">
        <div className="row align-items-center g-0">
          <div className="col card-title titulo-cartao-faq">{pergunta}</div>

          <div className="col-auto controle-expandir">
            <ToggleExpandir onClick={alternarExpansao} ativo={!recolhido} />
          </div>
        </div>

        <Collapse isOpened={!recolhido}>
          <div
            className="card-body corpo-cartao-faq"
            dangerouslySetInnerHTML={{ __html: resposta }}
          />
        </Collapse>
      </div>
    </div>
  );
};

Card.propTypes = {
  question: string.isRequired,
  answer: string.isRequired,
};

export default Card;
