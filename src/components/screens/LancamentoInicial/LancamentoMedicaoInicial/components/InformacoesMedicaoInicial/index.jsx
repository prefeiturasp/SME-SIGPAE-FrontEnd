import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HTTP_STATUS from "http-status-codes";
import { getYear, format } from "date-fns";
import { Collapse, Input } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { DETALHAMENTO_DO_LANCAMENTO } from "src/configs/constants";
import {
  getTiposDeContagemAlimentacao,
  setSolicitacaoMedicaoInicial,
  updateInformacoesBasicas,
} from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import StatefulMultiSelect from "@khanacademy/react-multi-select";

export default ({
  periodoSelecionado,
  escolaInstituicao,
  nomeTerceirizada,
  solicitacaoMedicaoInicial,
  onClickInfoBasicas,
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
    setTipoDeContagemSelecionada(values);
  };

  const handleClickEditar = () => {
    setEmEdicao(true);
    !solicitacaoMedicaoInicial && opcoesContagem.length > 0;
  };

  const handleClickSalvar = async () => {
    if (!responsaveis.some((resp) => resp.nome !== "" && resp.rf !== "")) {
      toastError("Pelo menos um responsável deve ser cadastrado");
      return;
    }
    if (
      responsaveis.some(
        (resp) =>
          (resp.nome !== "" && resp.rf === "") ||
          (resp.nome === "" && resp.rf !== ""),
      )
    ) {
      toastError("Responsável com dados incompletos");
      return;
    }
    const responsaveisPayload = responsaveis.filter(
      (resp) => resp.nome !== "" && resp.rf !== "",
    );
    if (responsaveisPayload.some((resp) => resp.rf.length !== 7)) {
      toastError("O campo de RF deve conter 7 números");
      return;
    }
    if (solicitacaoMedicaoInicial) {
      let data = new FormData();
      data.append("escola", String(escolaInstituicao.uuid));
      for (let index = 0; index < tipoDeContagemSelecionada.length; index++) {
        data.append(
          "tipos_contagem_alimentacao[]",
          tipoDeContagemSelecionada[index],
        );
      }
      data.append("responsaveis", JSON.stringify(responsaveisPayload));
      const response = await updateInformacoesBasicas(
        solicitacaoMedicaoInicial.uuid,
        data,
      );
      if (response.status === HTTP_STATUS.OK) {
        setIsOpen(false);
        if (
          responsaveisPayload.length ===
          solicitacaoMedicaoInicial.responsaveis.length
        ) {
          let toast = false;
          for (let i = 0; i < responsaveisPayload.length; i++) {
            if (
              JSON.stringify(responsaveisPayload[i]) !==
                JSON.stringify(solicitacaoMedicaoInicial.responsaveis[i]) &&
              !toast
            ) {
              toastSuccess("Responsável atualizado com sucesso");
              toast = true;
            }
          }
          !toast &&
            toastSuccess(
              "Método de Contagem / Responsável atualizado com sucesso",
            );
        } else if (
          responsaveisPayload.length >
          solicitacaoMedicaoInicial.responsaveis.length
        ) {
          toastSuccess("Responsável adicionado com sucesso");
        } else if (
          responsaveisPayload.length <
          solicitacaoMedicaoInicial.responsaveis.length
        ) {
          toastSuccess("Responsável excluído com sucesso");
        }
      } else {
        toastError("Não foi possível salvar as alterações!");
      }
    } else {
      const payload = {
        escola: escolaInstituicao.uuid,
        tipos_contagem_alimentacao: tipoDeContagemSelecionada,
        responsaveis: responsaveisPayload,
        mes: format(new Date(periodoSelecionado), "MM").toString(),
        ano: getYear(new Date(periodoSelecionado)).toString(),
      };
      const response = await setSolicitacaoMedicaoInicial(payload);
      if (response.status === HTTP_STATUS.CREATED) {
        setIsOpen(false);
        toastSuccess("Medição Inicial criada com sucesso!");
      } else {
        const errorMessage = Object.values(response.data).join("; ");
        toastError(`Erro: ${errorMessage}`);
      }
    }
    setEmEdicao(false);
    onClickInfoBasicas();
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
                  <b className="mb-2">
                    Método de Contagem das Alimentações Servidas
                  </b>
                  {opcoesContagem.length > 0 && (
                    <StatefulMultiSelect
                      name="contagem_refeicoes"
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
