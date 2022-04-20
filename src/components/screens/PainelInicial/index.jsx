import React from "react";
import { withRouter } from "react-router-dom";
import { Row, Col } from "antd";
import CardLogo from "../../Shareable/CardLogo/CardLogo";
import IconeGestaoDeAlimentacao from "../../Shareable/Icones/IconeGestaoDeAlimentacao";
import IconeGestaoDeProduto from "../../Shareable/Icones/IconeGestaoDeProduto";
import IconeDietaEspecial from "../../Shareable/Icones/IconeDietaEspecial";
import IconeAbastecimento from "../../Shareable/Icones/IconeAbastecimento";
import {
  usuarioEhEscola,
  usuarioEhTerceirizada,
  usuarioEhQualquerCODAE,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhCODAEDietaEspecial,
  usuarioEhDRE,
  usuarioEhNutricionistaSupervisao,
  usuarioEscolaEhGestaoDireta,
  usuarioEscolaEhGestaoMistaParceira,
  usuarioEhEscolaAbastecimento,
  exibirGA
} from "helpers/utilities";

const PainelInicial = ({ history }) => {
  const exibeMenuValidandoAmbiente = exibirGA();

  return (
    <Row className="mt-3" gutter={[16, 16]}>
      {exibeMenuValidandoAmbiente &&
        (usuarioEhCODAEGestaoAlimentacao() ||
          usuarioEhCODAENutriManifestacao() ||
          usuarioEhTerceirizada() ||
          usuarioEhDRE() ||
          usuarioEhNutricionistaSupervisao() ||
          (usuarioEhEscola() &&
            !usuarioEscolaEhGestaoMistaParceira() &&
            !usuarioEscolaEhGestaoDireta())) && (
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <CardLogo
              titulo={"Gestão de Alimentação"}
              onClick={() => history.push("/painel-gestao-alimentacao")}
            >
              <IconeGestaoDeAlimentacao />
            </CardLogo>
          </Col>
        )}
      {(usuarioEhCODAEGestaoAlimentacao() ||
        usuarioEhCODAENutriManifestacao() ||
        usuarioEhCODAEDietaEspecial() ||
        usuarioEhNutricionistaSupervisao() ||
        usuarioEhTerceirizada() ||
        usuarioEhDRE() ||
        usuarioEhEscola()) && (
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <CardLogo
            titulo={"Dieta Especial"}
            onClick={() => history.push("/painel-dieta-especial")}
          >
            <IconeDietaEspecial />
          </CardLogo>
        </Col>
      )}
      {(usuarioEhQualquerCODAE() ||
        usuarioEhCODAENutriManifestacao() ||
        usuarioEhTerceirizada() ||
        usuarioEhNutricionistaSupervisao() ||
        usuarioEhDRE() ||
        (usuarioEhEscola() &&
          !usuarioEscolaEhGestaoMistaParceira() &&
          !usuarioEscolaEhGestaoDireta())) && (
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <CardLogo
            titulo={"Gestão de Produto"}
            onClick={() => history.push("/painel-gestao-produto")}
          >
            <IconeGestaoDeProduto />
          </CardLogo>
        </Col>
      )}
      {usuarioEhDRE() && (
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <CardLogo
            titulo={"Abastecimento"}
            onClick={() => history.push("/logistica/entregas-dre")}
          >
            <IconeAbastecimento />
          </CardLogo>
        </Col>
      )}
      {usuarioEhEscolaAbastecimento() && (
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <CardLogo
            titulo={"Abastecimento"}
            onClick={() => history.push("/logistica/conferir-entrega")}
          >
            <IconeAbastecimento />
          </CardLogo>
        </Col>
      )}
    </Row>
  );
};

export default withRouter(PainelInicial);
