import { Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

import { CardLogo } from "src/components/Shareable/CardLogo/CardLogo";
import { IconeDietaEspecial } from "src/components/Shareable/Icones/IconeDietaEspecial";
import { IconeGestaoDeAlimentacao } from "src/components/Shareable/Icones/IconeGestaoDeAlimentacao";
import { IconeGestaoDeProduto } from "src/components/Shareable/Icones/IconeGestaoDeProduto";
import { IconeMedicaoInicial } from "src/components/Shareable/Icones/IconeMedicaoInicial";
import { IconeAbastecimento } from "./components/IconeAbastecimento";
import { IconeSupervisaoTerceirizadas } from "./components/IconeSupervisaoTerceirizadas";

import {
  ACOMPANHAMENTO_DE_LANCAMENTOS,
  PAINEL_RELATORIOS_FISCALIZACAO,
  SUPERVISAO,
  TERCEIRIZADAS,
} from "src/configs/constants";
import { ENVIRONMENT } from "src/constants/config";
import {
  exibirGA,
  exibirModuloMedicaoInicial,
  usuarioEhCODAEDietaEspecial,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaAbastecimento,
  usuarioEhEscolaAbastecimentoDiretor,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhMedicao,
  usuarioEhNutricionistaSupervisao,
  usuarioEhOrgaoFiscalizador,
  usuarioEhQualquerCODAE,
  usuarioEscolaEhGestaoDireta,
  usuarioEscolaEhGestaoParceira,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhAdministradorNutriSupervisao,
} from "src/helpers/utilities";

const PainelInicial = () => {
  const navigate = useNavigate();

  const exibeMenuValidandoAmbiente = exibirGA();

  const usuarioEscolaEhGestaoDiretaParceira =
    (usuarioEscolaEhGestaoDireta() || usuarioEscolaEhGestaoParceira()) &&
    !["production"].includes(ENVIRONMENT);

  return (
    <Row className="mt-3" gutter={[16, 16]}>
      {exibeMenuValidandoAmbiente &&
        (usuarioEhCODAEGestaoAlimentacao() ||
          usuarioEhCODAENutriManifestacao() ||
          usuarioEhEmpresaTerceirizada() ||
          usuarioEhDRE() ||
          usuarioEhMedicao() ||
          usuarioEhNutricionistaSupervisao() ||
          usuarioEhEscolaTerceirizadaDiretor() ||
          usuarioEhEscolaTerceirizada() ||
          usuarioEhCODAEGabinete() ||
          usuarioEhDinutreDiretoria()) && (
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Gestão de Alimentação"}
              onClick={() => navigate("/painel-gestao-alimentacao")}
            >
              <IconeGestaoDeAlimentacao />
            </CardLogo>
          </Col>
        )}
      {(usuarioEhCODAEGestaoAlimentacao() ||
        usuarioEhCODAENutriManifestacao() ||
        usuarioEhCODAEDietaEspecial() ||
        usuarioEhMedicao() ||
        usuarioEhNutricionistaSupervisao() ||
        usuarioEhEmpresaTerceirizada() ||
        usuarioEhDRE() ||
        usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhEscolaTerceirizada() ||
        usuarioEhCODAEGabinete() ||
        usuarioEscolaEhGestaoDiretaParceira ||
        usuarioEhDinutreDiretoria()) && (
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <CardLogo
            titulo={"Dieta Especial"}
            onClick={() => navigate("/painel-dieta-especial")}
          >
            <IconeDietaEspecial />
          </CardLogo>
        </Col>
      )}
      {(usuarioEhQualquerCODAE() ||
        usuarioEhCODAENutriManifestacao() ||
        usuarioEhEmpresaTerceirizada() ||
        usuarioEhNutricionistaSupervisao() ||
        usuarioEhDRE() ||
        usuarioEhEscolaTerceirizadaDiretor() ||
        usuarioEhEscolaTerceirizada() ||
        usuarioEhOrgaoFiscalizador() ||
        usuarioEhCODAEGabinete() ||
        usuarioEhDinutreDiretoria()) && (
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <CardLogo
            titulo={"Gestão de Produto"}
            onClick={() => navigate("/painel-gestao-produto")}
          >
            <IconeGestaoDeProduto />
          </CardLogo>
        </Col>
      )}
      {exibirModuloMedicaoInicial() && (
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <CardLogo
            titulo={"Medição Inicial"}
            onClick={() => {
              (usuarioEhEscolaTerceirizada() ||
                usuarioEhEscolaTerceirizadaDiretor()) &&
                navigate("/lancamento-inicial/lancamento-medicao-inicial");
              (usuarioEhDRE() ||
                usuarioEhMedicao() ||
                usuarioEhCODAEGestaoAlimentacao() ||
                usuarioEhCODAENutriManifestacao() ||
                usuarioEhCODAEGabinete() ||
                usuarioEhDinutreDiretoria() ||
                usuarioEhEmpresaTerceirizada() ||
                usuarioEhCoordenadorNutriSupervisao() ||
                usuarioEhAdministradorNutriSupervisao()) &&
                navigate(`/medicao-inicial/${ACOMPANHAMENTO_DE_LANCAMENTOS}`);
            }}
          >
            <IconeMedicaoInicial />
          </CardLogo>
        </Col>
      )}
      {usuarioEhDRE() && (
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <CardLogo
            titulo={"Abastecimento"}
            onClick={() => navigate("/logistica/entregas-dre")}
          >
            <IconeAbastecimento />
          </CardLogo>
        </Col>
      )}
      {(usuarioEhEscolaAbastecimento() ||
        usuarioEhEscolaAbastecimentoDiretor()) && (
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <CardLogo
            titulo={"Abastecimento"}
            onClick={() => navigate("/logistica/conferir-entrega")}
          >
            <IconeAbastecimento />
          </CardLogo>
        </Col>
      )}
      {(usuarioEhNutricionistaSupervisao() ||
        usuarioEhCODAEGestaoAlimentacao() ||
        usuarioEhMedicao() ||
        usuarioEhCODAENutriManifestacao()) &&
        !ENVIRONMENT.includes("production") && (
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Supervisão Terceirizadas"}
              onClick={() =>
                navigate(
                  `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
                )
              }
            >
              <IconeSupervisaoTerceirizadas />
            </CardLogo>
          </Col>
        )}
    </Row>
  );
};

export default PainelInicial;
