import { Collapse, Input } from "antd";
import { format, getYear } from "date-fns";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { DETALHAMENTO_DO_LANCAMENTO } from "src/configs/constants";
import {
  getTiposDeContagemAlimentacao,
  setSolicitacaoMedicaoInicial,
  updateInformacoesBasicas,
} from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";

export default ({
  periodoSelecionado,
  escolaInstituicao,
  nomeTerceirizada,
  solicitacaoMedicaoInicial,
  onClickInfoBasicas,
  objectoPeriodos,
}) => {
  const [tiposDeContagem, setTiposDeContagem] = useState([]);
  const [tipoDeContagemSelecionada, setTipoDeContagemSelecionada] = useState(
    [],
  );
  const [responsaveis, setResponsaveis] = useState([
    {
      nome: "",
      rf: "",
    },
    {
      nome: "",
      rf: "",
    },
    {
      nome: "",
      rf: "",
    },
  ]);
  const [emEdicao, setEmEdicao] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { Panel } = Collapse;

  const location = useLocation();

  useEffect(() => {
    async function fetch() {
      const response = await getTiposDeContagemAlimentacao();
      setTiposDeContagem(response.data);
    }
    fetch();

    if (solicitacaoMedicaoInicial) {
      const resps = responsaveis.map((resp, indice) => {
        return solicitacaoMedicaoInicial.responsaveis[indice] || resp;
      });
      setResponsaveis(resps);
      setTipoDeContagemSelecionada(
        solicitacaoMedicaoInicial.tipos_contagem_alimentacao.map((t) => t.uuid),
      );
    }
    if (!solicitacaoMedicaoInicial) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    getDefaultValueSelectTipoContagem();
  }, []);

  const opcoesContagem = tiposDeContagem
    ? tiposDeContagem.map((tipo) => {
        return { value: tipo.uuid, label: tipo.nome };
      })
    : [];

  const setaResponsavel = (input, event, indice) => {
    let responsavel = responsaveis;
    responsavel[indice][input] = event;
    setResponsaveis(responsaveis);
  };

  const verificarInput = (event, responsavel) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
    setaResponsavel("rf", event.target.value, responsavel);
  };

  const renderDadosResponsaveis = () => {
    let component = [];
    for (let responsavel = 0; responsavel <= 2; responsavel++) {
      component.push(
        <div className="row col-12 pe-0 mt-2" key={responsavel}>
          <div className="col-8">
            <Input
              className="mt-2"
              name={`responsavel_nome_${responsavel}`}
              data-testid={`input-responsavel-nome-${responsavel}`}
              defaultValue={responsaveis[responsavel]["nome"]}
              onChange={(event) =>
                setaResponsavel("nome", event.target.value, responsavel)
              }
              disabled={!emEdicao}
            />
          </div>
          <div className="col-4 pe-0">
            <Input
              maxLength={7}
              className="mt-2"
              name={`responsavel_rf_${responsavel}`}
              data-testid={`input-responsavel-rf-${responsavel}`}
              onKeyPress={(event) => verificarInput(event, responsavel)}
              onChange={(event) => verificarInput(event, responsavel)}
              defaultValue={responsaveis[responsavel]["rf"]}
              disabled={!emEdicao}
            />
          </div>
        </div>,
      );
    }

    return component;
  };

  const handleChangeTipoContagem = (values) => {
    setTipoDeContagemSelecionada(values.map((value_) => value_.value));
  };

  const handleClickEditar = () => {
    setEmEdicao(true);
    !solicitacaoMedicaoInicial && opcoesContagem.length > 0;
  };

  const handleClickSalvar = async () => {
    if (!validarResponsaveis()) return;

    if (solicitacaoMedicaoInicial) {
      await atualizarSolicitacaoExistente();
    } else {
      await criarNovaSolicitacao();
    }

    setIsOpen(false);
    setEmEdicao(false);
    onClickInfoBasicas();
  };

  const validarResponsaveis = () => {
    if (!temPeloMenosUmResponsavelValido()) {
      toastError("Pelo menos um responsável deve ser cadastrado");
      return false;
    }

    if (temResponsaveisComDadosIncompletos()) {
      toastError("Responsável com dados incompletos");
      return false;
    }

    if (temRFInvalido()) {
      toastError("O campo de RF deve conter 7 números");
      return false;
    }

    return true;
  };

  const temPeloMenosUmResponsavelValido = () => {
    return responsaveis.some((resp) => resp.nome !== "" && resp.rf !== "");
  };

  const temResponsaveisComDadosIncompletos = () => {
    return responsaveis.some(
      (resp) =>
        (resp.nome !== "" && resp.rf === "") ||
        (resp.nome === "" && resp.rf !== ""),
    );
  };

  const temRFInvalido = () => {
    const responsaveisValidos = responsaveis.filter(
      (resp) => resp.nome !== "" && resp.rf !== "",
    );

    return responsaveisValidos.some((resp) => resp.rf.length !== 7);
  };

  const getResponsaveisPayload = () => {
    return responsaveis.filter((resp) => resp.nome !== "" && resp.rf !== "");
  };

  const criarPayloadAtualizacao = () => {
    const data = new FormData();
    data.append("escola", String(escolaInstituicao.uuid));

    for (let index = 0; index < tipoDeContagemSelecionada.length; index++) {
      data.append(
        "tipos_contagem_alimentacao[]",
        tipoDeContagemSelecionada[index],
      );
    }

    data.append("responsaveis", JSON.stringify(getResponsaveisPayload()));
    return data;
  };

  const criarPayloadNovaSolicitacao = () => {
    const dataPeriodo = new Date(periodoSelecionado);

    const recreio_nas_ferias_uuid =
      objectoPeriodos?.find(
        (o) => o.dataBRT.getTime() === dataPeriodo.getTime(),
      )?.recreio_nas_ferias || null;

    return {
      escola: escolaInstituicao.uuid,
      tipos_contagem_alimentacao: tipoDeContagemSelecionada,
      responsaveis: getResponsaveisPayload(),
      mes: format(dataPeriodo, "MM").toString(),
      ano: getYear(dataPeriodo).toString(),
      recreio_nas_ferias: recreio_nas_ferias_uuid,
    };
  };

  const mostrarMensagemSucessoAtualizacao = (responsaveisPayload) => {
    const responsaveisOriginais = solicitacaoMedicaoInicial.responsaveis;

    if (responsaveisPayload.length === responsaveisOriginais.length) {
      const houveAlteracao = responsaveisPayload.some(
        (resp, i) =>
          JSON.stringify(resp) !== JSON.stringify(responsaveisOriginais[i]),
      );

      if (houveAlteracao) {
        toastSuccess("Responsável atualizado com sucesso");
      } else {
        toastSuccess("Método de Contagem / Responsável atualizado com sucesso");
      }
    } else if (responsaveisPayload.length > responsaveisOriginais.length) {
      toastSuccess("Responsável adicionado com sucesso");
    } else if (responsaveisPayload.length < responsaveisOriginais.length) {
      toastSuccess("Responsável excluído com sucesso");
    }
  };

  const atualizarSolicitacaoExistente = async () => {
    const data = criarPayloadAtualizacao();
    const response = await updateInformacoesBasicas(
      solicitacaoMedicaoInicial.uuid,
      data,
    );

    if (response.status === HTTP_STATUS.OK) {
      mostrarMensagemSucessoAtualizacao(getResponsaveisPayload());
    } else {
      toastError("Não foi possível salvar as alterações!");
    }
  };

  const criarNovaSolicitacao = async () => {
    const payload = criarPayloadNovaSolicitacao();
    const response = await setSolicitacaoMedicaoInicial(payload);

    if (response.status === HTTP_STATUS.CREATED) {
      toastSuccess("Medição Inicial criada com sucesso!");
    } else {
      const errorMessage = Object.values(response.data).join("; ");
      toastError(`Erro: ${errorMessage}`);
    }
  };

  const getDefaultValueSelectTipoContagem = () => {
    if (solicitacaoMedicaoInicial)
      return solicitacaoMedicaoInicial.tipos_contagem_alimentacao.map(
        (t) => t.nome,
      );
  };

  return (
    <div className="row mt-4 info-med-inicial collapse-adjustments">
      <div className="col-12 panel-med-inicial">
        <div className="ps-0 label-adjustments">
          <Collapse
            expandIconPosition="end"
            activeKey={isOpen ? ["1"] : []}
            onChange={() => setIsOpen(!isOpen)}
          >
            <Panel header="Informações Básicas da Medição Inicial" key="1">
              <div className="row">
                <div className="col-5 info-label select-medicao-inicial">
                  {opcoesContagem.length > 0 && (
                    <MultiselectRaw
                      label="Método de Contagem das Alimentações Servidas"
                      name="contagem_refeicoes"
                      dataTestId="multiselect-contagem-refeicoes"
                      selected={tipoDeContagemSelecionada}
                      options={opcoesContagem || []}
                      onSelectedChanged={(values) =>
                        handleChangeTipoContagem(values)
                      }
                      hasSelectAll={false}
                      overrideStrings={{
                        selectSomeItems: "Selecione os métodos de contagem",
                        allItemsAreSelected: "Todos os métodos selecionados",
                      }}
                      required
                      disabled={!emEdicao}
                    />
                  )}
                </div>
                <div className="col-7 info-label">
                  <label className="mt-2 mb-2">
                    Nome da Empresa Responsável pelo Atendimento
                  </label>
                  <p className="value-label">{nomeTerceirizada}</p>
                </div>
              </div>
              <div className="row mt-2 me-0">
                <div className="col-8">
                  <label>
                    Responsáveis por acompanhar a prestação de serviços
                  </label>
                  <label className="asterisk-label">*</label>
                </div>
                <div className="col-4 ps-0">
                  <label>RF</label>
                  <label className="asterisk-label">*</label>
                </div>
                {renderDadosResponsaveis()}
                {(!location.state ||
                  location.state.status !== "Aprovado pela DRE") &&
                  !location.pathname.includes(DETALHAMENTO_DO_LANCAMENTO) && (
                    <div className="mt-3 pe-2">
                      <Botao
                        texto="Salvar"
                        style={BUTTON_STYLE.GREEN}
                        className="float-end ms-3"
                        onClick={() => handleClickSalvar()}
                        disabled={!emEdicao}
                      />
                      <Botao
                        texto="Editar"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        icon={BUTTON_ICON.PEN}
                        className="float-end ms-3"
                        onClick={() => handleClickEditar()}
                        disabled={emEdicao}
                      />
                    </div>
                  )}
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
};
