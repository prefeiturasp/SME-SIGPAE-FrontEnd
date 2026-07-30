import { Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

import { CardLogo } from "src/components/Shareable/CardLogo/CardLogo";
import { IconeDietaEspecial } from "src/components/Shareable/Icones/IconeDietaEspecial";
import { IconeGestaoDeAlimentacao } from "src/components/Shareable/Icones/IconeGestaoDeAlimentacao";
import { IconeGestaoDeProduto } from "src/components/Shareable/Icones/IconeGestaoDeProduto";
import { IconeMedicaoInicial } from "src/components/Shareable/Icones/IconeMedicaoInicial";
import { IconeAbastecimento } from "./components/IconeAbastecimento";
import { IconeSupervisaoTerceirizadas } from "./components/IconeSupervisaoTerceirizadas";
import { IconeCronogramaEntrega } from "src/components/Shareable/Icones/IconeCronogramaEntrega";
import { IconeFichaTecnica } from "src/components/Shareable/Icones/IconeFichaTecnica";
import { IconeDocumentosRecebimento } from "src/components/Shareable/Icones/IconeDocumentosRecebimento";
import { IconeAlteracoesCronograma } from "src/components/Shareable/Icones/IconeAlteracoesCronograma";
import { IconeLayoutEmbalagem } from "src/components/Shareable/Icones/IconeLayoutEmbalagem";
import { IconeCalendarioCronograma } from "src/components/Shareable/Icones/iconeCalendarioCronograma";
import { IconeCalendarioPontoaPonto } from "src/components/Shareable/Icones/IconeCalendarioPontoaPonto";
import { IconeFichaDeRecebimento } from "src/components/Shareable/Icones/IconeFichaDeRecebimento";
import { IconeDocumentoDeRecebimento } from "src/components/Shareable/Icones/IconeDocumentoDeRecebimento";
import { IconeVerificarAlteracoesDeCronograma } from "src/components/Shareable/Icones/IconeVerificarAlteracoesDeCronograma";
import { IconePainelDeAprovacoes } from "src/components/Shareable/Icones/IconePainelDeAprovacoes";
import { IconeCronogramaSemanalFLV } from "src/components/Shareable/Icones/IconeCronogramaSemanalFLV";
import { IconeCalendarioPontoAPonto } from "src/components/Shareable/Icones/IconeCalendarioPontoAPonto";
import {
  ACOMPANHAMENTO_DE_LANCAMENTOS,
  CRONOGRAMA_ENTREGA,
  DOCUMENTOS_RECEBIMENTO,
  FICHA_TECNICA,
  LAYOUT_EMBALAGEM,
  PAINEL_RELATORIOS_FISCALIZACAO,
  PRE_RECEBIMENTO,
  SOLICITACAO_ALTERACAO_CRONOGRAMA_FORNECEDOR,
  SUPERVISAO,
  TERCEIRIZADAS,
  PAINEL_LAYOUT_EMBALAGEM,
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PAINEL_FICHAS_TECNICAS,
  FICHA_RECEBIMENTO,
  RECEBIMENTO,
  PAINEL_APROVACOES,
  SOLICITACAO_ALTERACAO_CRONOGRAMA,
  CRONOGRAMA_SEMANAL_FLV,
  CALENDARIO_CRONOGRAMA_PONTO_A_PONTO_SEMANAL,
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
  usuarioEhEmpresaFornecedor,
  usuarioEhMedicao,
  usuarioEhNutricionistaSupervisao,
  usuarioEhOrgaoFiscalizador,
  usuarioEhQualquerCODAE,
  usuarioEscolaEhGestaoDireta,
  usuarioEscolaEhGestaoParceira,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhAdministradorNutriSupervisao,
  usuarioComAcessoAosCalendarios,
  usuarioEhDilogQualidade,
  usuarioEhDilogDiretoria,
  usuarioEhCronograma,
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
      {usuarioComAcessoAosCalendarios() && (
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <CardLogo
            titulo={"Calendário de Cronogramas"}
            onClick={() => navigate(`${PRE_RECEBIMENTO}/calendario-cronograma`)}
          >
            <IconeCalendarioCronograma />
          </CardLogo>
        </Col>
      )}
      {usuarioComAcessoAosCalendarios() && (
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <CardLogo
            titulo={"Calendário Ponto a Ponto"}
            onClick={() =>
              navigate(
                `${PRE_RECEBIMENTO}/calendario-cronograma-ponto-a-ponto-semanal`,
              )
            }
          >
            <IconeCalendarioPontoaPonto />
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
      {usuarioEhEmpresaFornecedor() && (
        <>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Cronograma de Entrega"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`)
              }
            >
              <IconeCronogramaEntrega />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Alterações de Cronograma"}
              onClick={() =>
                navigate(
                  `${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA_FORNECEDOR}`,
                )
              }
            >
              <IconeAlteracoesCronograma />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Layout de Embalagem"}
              onClick={() => navigate(`${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`)}
            >
              <IconeLayoutEmbalagem />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Documentos de Recebimento"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`)
              }
            >
              <IconeDocumentosRecebimento />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Ficha Técnica"}
              onClick={() => navigate(`${PRE_RECEBIMENTO}/${FICHA_TECNICA}`)}
            >
              <IconeFichaTecnica />
            </CardLogo>
          </Col>
        </>
      )}
      {usuarioEhDilogQualidade() && (
        <>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Cronograma de Entrega"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`)
              }
            >
              <IconeCronogramaEntrega />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Calendário de Cronogramas"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/calendario-cronograma`)
              }
            >
              <IconeCalendarioCronograma />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Layout de Embalagem"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`)
              }
            >
              <IconeLayoutEmbalagem />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Documentos de Recebimento"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`)
              }
            >
              <IconeDocumentoDeRecebimento />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Fichas Técnicas"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`)
              }
            >
              <IconeFichaTecnica />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Ficha de Recebimento"}
              onClick={() => navigate(`${RECEBIMENTO}/${FICHA_RECEBIMENTO}`)}
            >
              <IconeFichaDeRecebimento />
            </CardLogo>
          </Col>
        </>
      )}
      {usuarioEhDilogDiretoria() && (
        <>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Painel de Aprovações"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${PAINEL_APROVACOES}`)
              }
            >
              <IconePainelDeAprovacoes />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Cronograma de Entrega"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`)
              }
            >
              <IconeCronogramaEntrega />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Verificar Alterações de Cronograma"}
              onClick={() =>
                navigate(
                  `${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`,
                )
              }
            >
              <IconeVerificarAlteracoesDeCronograma />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Calendário de Cronogramas"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/calendario-cronograma`)
              }
            >
              <IconeCalendarioCronograma />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Fichas Técnicas"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`)
              }
            >
              <IconeFichaTecnica />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Ficha de Recebimento"}
              onClick={() => navigate(`${RECEBIMENTO}/${FICHA_RECEBIMENTO}`)}
            >
              <IconeFichaDeRecebimento />
            </CardLogo>
          </Col>
        </>
      )}
      {usuarioEhCronograma() && (
        <>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Painel de Aprovações"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${PAINEL_APROVACOES}`)
              }
            >
              <IconePainelDeAprovacoes />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Cronograma de Entrega"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`)
              }
            >
              <IconeCronogramaEntrega />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Cronograma Semanal FLV"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/${CRONOGRAMA_SEMANAL_FLV}`)
              }
            >
              <IconeCronogramaSemanalFLV />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Verificar Alterações de Cronograma"}
              onClick={() =>
                navigate(
                  `${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`,
                )
              }
            >
              <IconeVerificarAlteracoesDeCronograma />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Calendário de Cronogramas"}
              onClick={() =>
                navigate(`${PRE_RECEBIMENTO}/calendario-cronograma`)
              }
            >
              <IconeCalendarioCronograma />
            </CardLogo>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CardLogo
              titulo={"Calendário Ponto a Ponto"}
              onClick={() =>
                navigate(
                  `${PRE_RECEBIMENTO}/${CALENDARIO_CRONOGRAMA_PONTO_A_PONTO_SEMANAL}`,
                )
              }
            >
              <IconeCalendarioPontoAPonto />
            </CardLogo>
          </Col>
        </>
      )}
    </Row>
  );
};

export default PainelInicial;
