import React, { useEffect, useRef, useState } from "react";
import { Field, Form } from "react-final-form";
import { Spin } from "antd";
import InputText from "src/components/Shareable/Input/InputText";
import { CollapseControl } from "src/components/Shareable/Collapse";
import BotaoVoltar from "src/components/Shareable/Page/BotaoVoltar";
import { FichaTecnicaDetalhadaComAnalise } from "src/interfaces/pre_recebimento.interface";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import {
  carregaListaCompletaInformacoesNutricionais,
  carregarDadosAnalisarDetalhar,
  imprimirFicha,
} from "../../helpers";
import { InformacaoNutricional } from "src/interfaces/produto.interface";
import { TerceirizadaComEnderecoInterface } from "src/interfaces/terceirizada.interface";
import CollapsesPadrao from "./components/CollapsesPadrao";
import CollapsesFLV from "./components/CollapsesFLV";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  AnaliseFichaTecnicaPayload,
  StateConferidosAnalise,
} from "../../interfaces";
import {
  cadastraAnaliseFichaTecnica,
  cadastraRascunhoAnaliseFichaTecnica,
  editaRascunhoAnaliseFichaTecnica,
} from "src/services/fichaTecnica.service";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import {
  PRE_RECEBIMENTO,
  PAINEL_FICHAS_TECNICAS,
  FICHA_TECNICA,
  ATUALIZAR_FICHA_TECNICA,
} from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import { getMensagemDeErro } from "src/helpers/statusErrors";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";
import "./styles.scss";

const idCollapse = "collapseAnalisarFichaTecnica";

interface AnalisarProps {
  somenteLeitura?: boolean;
}

export default ({ somenteLeitura = false }: AnalisarProps) => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [showModalCancelar, setShowModalCancelar] = useState<boolean>(false);
  const [collapse, setCollapse] = useState<CollapseControl>({});
  const [ficha, setFicha] = useState<FichaTecnicaDetalhadaComAnalise>(
    {} as FichaTecnicaDetalhadaComAnalise,
  );
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [conferidos, setConferidos] = useState<StateConferidosAnalise>({});
  const listaCompletaInformacoesNutricionais = useRef<InformacaoNutricional[]>(
    [],
  );
  const listaInformacoesNutricionaisFichaTecnica = useRef<
    InformacaoNutricional[]
  >([]);
  const [proponente, setProponente] =
    useState<TerceirizadaComEnderecoInterface>(
      {} as TerceirizadaComEnderecoInterface,
    );

  useEffect(() => {
    (async () => {
      await carregaListaCompletaInformacoesNutricionais(
        listaCompletaInformacoesNutricionais,
      );
      await carregarDadosAnalisarDetalhar(
        listaInformacoesNutricionaisFichaTecnica,
        setFicha,
        setConferidos,
        setInitialValues,
        setProponente,
        setCarregando,
      );
    })();
  }, []);

  const imprimirFichaTecnica = () => {
    setCarregando(true);
    let uuid = ficha.uuid;
    let numero = ficha.numero;
    imprimirFicha(uuid, numero, setCarregando);
  };

  const fechaCollapses = () => {
    const otherElements = document.querySelectorAll(`#${idCollapse} .show`);
    otherElements.forEach((element) => {
      element.classList.remove("show");
    });
    setCollapse({});
  };

  const aprovaCollapse = (name: string) => {
    fechaCollapses();
    setConferidos({
      ...conferidos,
      [name]: true,
    });
  };

  const reprovaCollapse = (name: string) => {
    fechaCollapses();
    setConferidos({
      ...conferidos,
      [name]: false,
    });
  };

  const montarPayloadAnalise = (values: Record<string, any>) => {
    const payload: AnaliseFichaTecnicaPayload = {
      fabricante_envasador_conferido: conferidos.fabricante_envasador,
      detalhes_produto_conferido: conferidos.detalhes_produto,
      informacoes_nutricionais_conferido: conferidos.informacoes_nutricionais,
      conservacao_conferido: conferidos.conservacao,
      temperatura_e_transporte_conferido: conferidos.temperatura_e_transporte,
      armazenamento_conferido: conferidos.armazenamento,
      embalagem_e_rotulagem_conferido: conferidos.embalagem_e_rotulagem,
      responsavel_tecnico_conferido: conferidos.responsavel_tecnico,
      modo_preparo_conferido: conferidos.modo_preparo,
      outras_informacoes_conferido: conferidos.outras_informacoes,
      fabricante_envasador_correcoes: values.fabricante_envasador_correcoes,
      detalhes_produto_correcoes: values.detalhes_produto_correcoes,
      informacoes_nutricionais_correcoes:
        values.informacoes_nutricionais_correcoes,
      conservacao_correcoes: values.conservacao_correcoes,
      temperatura_e_transporte_correcoes:
        values.temperatura_e_transporte_correcoes,
      armazenamento_correcoes: values.armazenamento_correcoes,
      embalagem_e_rotulagem_correcoes: values.embalagem_e_rotulagem_correcoes,
      responsavel_tecnico_correcoes: values.responsavel_tecnico_correcoes,
      modo_preparo_correcoes: values.modo_preparo_correcoes,
    };

    return payload;
  };

  const salvarRascunho = async (values: Record<string, any>) => {
    try {
      setCarregando(true);

      const payload = montarPayloadAnalise(values);

      const response = ficha.analise
        ? await editaRascunhoAnaliseFichaTecnica(payload, ficha.uuid)
        : await cadastraRascunhoAnaliseFichaTecnica(payload, ficha.uuid);

      if (response.status === 201 || response.status === 200) {
        toastSuccess("Rascunho salvo com sucesso!");
        const fichaAtualizada = {
          ...response.data,
          uuid: response.data.ficha_tecnica,
        };
        setFicha(fichaAtualizada);
      }
    } catch (error) {
      toastError(getMensagemDeErro(error.response?.status));
    } finally {
      setCarregando(false);
    }
  };

  const salvarAnalise = async (values: Record<string, any>) => {
    try {
      setCarregando(true);

      const payload = montarPayloadAnalise(values);

      const response = await cadastraAnaliseFichaTecnica(payload, ficha.uuid);

      if (response.status === 201 || response.status === 200) {
        toastSuccess("Análise da Ficha Técnica enviada com sucesso!");
        voltarPagina();
      }
    } catch (error) {
      toastError(getMensagemDeErro(error.response?.status));
    } finally {
      setCarregando(false);
    }
  };

  const voltarPagina = () => {
    const link = usuarioEhEmpresaFornecedor()
      ? `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`
      : `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`;

    navigate(link);
  };

  const validaForm = (ehNaoPerecivel: boolean) => {
    let conferidosFiltrados = conferidos;
    if (ehNaoPerecivel) {
      delete conferidos.temperatura_e_transporte;
    }

    return Object.values(conferidosFiltrados).some(
      (conf) => conf !== true && conf !== false,
    );
  };

  const renderizarTag = () => {
    const tagMap = {
      "Enviada para Análise": (
        <div className="status analise">
          <i className="fas fa-exclamation-triangle" />
          Enviada para Análise em {ficha.log_mais_recente}
        </div>
      ),
      Aprovada: (
        <div className="status aprovado">
          <i className="fas fa-check-circle" />
          Aprovada em {ficha.log_mais_recente}
        </div>
      ),
      "Enviada para Correção": (
        <div className="status correcao">
          <i className="fas fa-exclamation-triangle" />
          Solicitada correção em {ficha.log_mais_recente}
        </div>
      ),
    };

    return tagMap[ficha.status];
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-analise-ficha-tecnica">
        <div className="card-body analise-ficha-tecnica">
          <Form
            onSubmit={() => {}}
            initialValues={initialValues}
            render={({ handleSubmit, values }) => {
              const ehPerecivel = values["categoria"] === "Perecíveis";
              const ehNaoPerecivel = values["categoria"] === "Não Perecíveis";
              const ehFLV =
                values["categoria"] === "FLV (Frutas, Legumes e Verduras)";
              const collapseConfigsFLV = [
                {
                  titulo: <span className="verde-escuro">Proponente</span>,
                },
                {
                  titulo: (
                    <span className="verde-escuro">
                      Fabricante, Produtor, Envasador ou Distribuidor
                    </span>
                  ),
                  tag: true,
                },
                {
                  titulo: (
                    <span className="verde-escuro">Detalhes do Produto</span>
                  ),
                  tag: true,
                },
                {
                  titulo: (
                    <span className="verde-escuro">
                      Responsável Técnico e Anexos
                    </span>
                  ),
                  tag: true,
                },
                {
                  titulo: (
                    <span className="verde-escuro">Outras Informações</span>
                  ),
                  tag: true,
                },
              ];

              const collapseConfigsPadrao = [
                {
                  titulo: <span className="verde-escuro">Proponente</span>,
                },
                {
                  titulo: (
                    <span className="verde-escuro">
                      Fabricante, Produtor, Envasador ou Distribuidor
                    </span>
                  ),
                  tag: true,
                },
                {
                  titulo: (
                    <span className="verde-escuro">Detalhes do Produto</span>
                  ),
                  tag: true,
                },
                {
                  titulo: (
                    <span className="verde-escuro">
                      Informações Nutricionais
                    </span>
                  ),
                  tag: true,
                },
                {
                  titulo: <span className="verde-escuro">Conservação</span>,
                  tag: true,
                },
                ...(ehPerecivel
                  ? [
                      {
                        titulo: (
                          <span className="verde-escuro">
                            Temperatura e Transporte
                          </span>
                        ),
                        tag: true,
                      },
                    ]
                  : []),
                {
                  titulo: <span className="verde-escuro">Armazenamento</span>,
                  tag: true,
                },
                {
                  titulo: (
                    <span className="verde-escuro">Embalagem e Rotulagem</span>
                  ),
                  tag: true,
                },
                {
                  titulo: (
                    <span className="verde-escuro">
                      Responsável Técnico e Anexos
                    </span>
                  ),
                  tag: true,
                },
                {
                  titulo: <span className="verde-escuro">Modo de Preparo</span>,
                  tag: true,
                },
                {
                  titulo: (
                    <span className="verde-escuro">Outras Informações</span>
                  ),
                  tag: true,
                },
              ];

              const collapseConfigs = ehFLV
                ? collapseConfigsFLV
                : collapseConfigsPadrao;

              return (
                <form onSubmit={handleSubmit}>
                  <div className="flex-header">
                    <div className="subtitulo">Identificação do Produto</div>
                    {somenteLeitura && renderizarTag()}
                  </div>

                  <div className="row mt-4">
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Categoria"
                        name={`categoria`}
                        className="input-ficha-tecnica"
                        disabled
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Tipo de Entrega"
                        name={`tipo_entrega`}
                        className="input-ficha-tecnica"
                        disabled
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Para qual Programa o Produto é Destinado"
                        name={`programa`}
                        className="input-ficha-tecnica"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Produto"
                        name={`produto`}
                        className="input-ficha-tecnica"
                        disabled
                        suffix={
                          ficha.programa === "LEVE_LEITE" ? (
                            <TagLeveLeite />
                          ) : null
                        }
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        naoDesabilitarPrimeiraOpcao
                        label="Marca"
                        name={`marca`}
                        className="input-ficha-tecnica"
                        disabled
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Nº do Pregão/Chamada Pública"
                        name={`pregao_chamada_publica`}
                        className="input-ficha-tecnica"
                        disabled
                      />
                    </div>
                  </div>

                  <hr />

                  {!ehFLV && (
                    <CollapsesPadrao
                      idCollapse={idCollapse}
                      collapse={collapse}
                      setCollapse={setCollapse}
                      collapseConfigs={collapseConfigs}
                      conferidos={conferidos}
                      ficha={ficha}
                      values={values}
                      somenteLeitura={somenteLeitura}
                      ehPerecivel={ehPerecivel}
                      ehNaoPerecivel={ehNaoPerecivel}
                      proponente={proponente}
                      aprovaCollapse={aprovaCollapse}
                      reprovaCollapse={reprovaCollapse}
                      listaCompletaInformacoesNutricionais={
                        listaCompletaInformacoesNutricionais
                      }
                      listaInformacoesNutricionaisFichaTecnica={
                        listaInformacoesNutricionaisFichaTecnica
                      }
                    />
                  )}

                  {ehFLV && (
                    <CollapsesFLV
                      idCollapse={idCollapse}
                      collapse={collapse}
                      setCollapse={setCollapse}
                      collapseConfigs={collapseConfigs}
                      conferidos={conferidos}
                      ficha={ficha}
                      values={values}
                      somenteLeitura={somenteLeitura}
                      proponente={proponente}
                      aprovaCollapse={aprovaCollapse}
                      reprovaCollapse={reprovaCollapse}
                    />
                  )}

                  <div className="mt-4 mb-4">
                    {somenteLeitura ? (
                      <>
                        {ficha.status === "Aprovada" &&
                          usuarioEhEmpresaFornecedor() && (
                            <Botao
                              texto="Atualizar Ficha Técnica"
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                              className="float-end ms-3"
                              onClick={() =>
                                navigate(
                                  `/${PRE_RECEBIMENTO}/${ATUALIZAR_FICHA_TECNICA}?uuid=${ficha.uuid}`,
                                )
                              }
                            />
                          )}
                        {["Enviada para Análise", "Aprovada"].includes(
                          ficha.status,
                        ) && (
                          <Botao
                            texto="Ficha em PDF"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            className="float-end ms-3"
                            onClick={() => imprimirFichaTecnica()}
                            icon="fas fa-print"
                          />
                        )}
                        <BotaoVoltar onClick={voltarPagina} />
                      </>
                    ) : (
                      <>
                        <Botao
                          texto="Enviar Análise"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN}
                          className="float-end ms-3"
                          onClick={() => salvarAnalise(values)}
                          disabled={validaForm(ehNaoPerecivel)}
                        />
                        <Botao
                          texto="Salvar Rascunho"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="float-end ms-3"
                          onClick={() => salvarRascunho(values)}
                        />
                        <Botao
                          texto="Cancelar"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="float-end ms-3"
                          onClick={() => {
                            setShowModalCancelar(true);
                          }}
                        />
                      </>
                    )}
                  </div>

                  <ModalGenerico
                    show={showModalCancelar}
                    handleSim={() => {
                      navigate(`/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`);
                    }}
                    handleClose={() => {
                      setShowModalCancelar(false);
                    }}
                    loading={carregando}
                    titulo={<>Cancelar Análise da Ficha Técnica</>}
                    texto={<>Deseja cancelar a Análise da Ficha Técnica?</>}
                  />
                </form>
              );
            }}
          />
        </div>
      </div>
    </Spin>
  );
};
