import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Checkbox, Collapse, Modal, Spin } from "antd";
import { format, getYear } from "date-fns";
import HTTP_STATUS from "http-status-codes";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { DETALHAMENTO_DO_LANCAMENTO } from "src/configs/constants";
import { ehEscolaTipoCEMEI } from "src/helpers/utilities";
import {
  getTiposDeContagemAlimentacao,
  setSolicitacaoMedicaoInicial,
  updateInformacoesBasicas,
} from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { getAlunosListagem } from "src/services/perfil.service";
import ResponsaveisInputs from "../ResponsaveisInput";
import TabelaAlunosParciais from "./TabelaAlunosParciais";

const RESPONSABLES_INITIAL_STATE = [
  { nome: "", rf: "" },
  { nome: "", rf: "" },
  { nome: "", rf: "" },
];

function useResponsaveis(initialState) {
  const [responsaveis, setResponsaveis] = useState(initialState);

  const setaResponsavel = useCallback((input, value, index) => {
    setResponsaveis((currentResponsaveis) =>
      currentResponsaveis.map((resp, i) =>
        i === index ? { ...resp, [input]: value } : resp,
      ),
    );
  }, []);

  return { responsaveis, setaResponsavel };
}

export const InformacoesMedicaoInicialCEI = ({
  periodoSelecionado,
  escolaInstituicao,
  nomeTerceirizada,
  solicitacaoMedicaoInicial,
  onClickInfoBasicas,
  objectoPeriodos,
}) => {
  const recreioNasFeriasUuid = objectoPeriodos?.find(
    (o) => o.dataBRT.getTime() === new Date(periodoSelecionado).getTime(),
  )?.recreio_nas_ferias;

  const { responsaveis, setaResponsavel } = useResponsaveis(
    RESPONSABLES_INITIAL_STATE,
  );

  const [uePossuiAlunosPeriodoParcial, setUePossuiAlunosPeriodoParcial] =
    useState(recreioNasFeriasUuid ? "false" : undefined);
  const [emEdicao, setEmEdicao] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPesquisaAluno, setShowPesquisaAluno] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [isModalDuplicata, setIsModalDuplicata] = useState(false);
  const [isModalNaoParcial, setIsModalNaoParcial] = useState(false);
  const [alunosAdicionados, setAlunosAdicionados] = useState([]);
  const [tiposDeContagem, setTiposDeContagem] = useState([]);
  const [tipoDeContagemSelecionada, setTipoDeContagemSelecionada] = useState(
    [],
  );
  const [alunosParcialAlterado, setAlunosParcialAlterado] = useState(false);
  const [loadingInfoBasicas, setLoadingInfoBasicas] = useState(false);

  const { Panel } = Collapse;

  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getAlunos = async () => {
    const response = await getAlunosListagem({
      escola: escolaInstituicao.uuid,
      sem_paginacao: true,
      inclui_alunos_egressos: true,
      mes: searchParams.get("mes"),
      ano: searchParams.get("ano"),
    });
    if (response.status === HTTP_STATUS.OK) {
      setAlunos(response.data);
      setLoading(false);
    } else {
      toastError("Houve um erro ao buscar alunos desta escola");
    }
  };

  useEffect(() => {
    async function fetch() {
      const response = await getTiposDeContagemAlimentacao();
      setTiposDeContagem(response.data);
    }
    fetch();

    if (solicitacaoMedicaoInicial) {
      solicitacaoMedicaoInicial.responsaveis.forEach((responsavel, index) => {
        setaResponsavel("nome", responsavel.nome, index);
        setaResponsavel("rf", responsavel.rf, index);
      });
      setTipoDeContagemSelecionada(
        solicitacaoMedicaoInicial.tipos_contagem_alimentacao.map((t) => t.uuid),
      );
      if (solicitacaoMedicaoInicial.ue_possui_alunos_periodo_parcial) {
        setUePossuiAlunosPeriodoParcial("true");
        setShowPesquisaAluno(true);
        setLoading(true);
        getAlunos();
        setAlunosAdicionados(solicitacaoMedicaoInicial.alunos_periodo_parcial);
      } else {
        setUePossuiAlunosPeriodoParcial("false");
      }
    } else {
      setEmEdicao(true);
    }
    setIsOpen(true);
  }, [setaResponsavel, solicitacaoMedicaoInicial]);

  useEffect(() => {
    getDefaultValueSelectTipoContagem();
  }, []);

  const verificarInput = (event, index) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
    setaResponsavel("rf", event.target.value, index);
  };

  const handleClickEditar = () => {
    setEmEdicao(true);
    !solicitacaoMedicaoInicial && opcoesContagem.length > 0;
  };

  const handleClickSalvar = async () => {
    if (!validarDados()) return;

    if (solicitacaoMedicaoInicial) {
      await atualizarSolicitacaoExistente();
    } else {
      await criarNovaSolicitacao();
    }

    setEmEdicao(false);
    await onClickInfoBasicas();
    setLoadingInfoBasicas(false);
  };

  const validarDados = () => {
    if (!validarPeriodoParcial()) return false;
    if (!validarResponsaveis()) return false;
    return true;
  };

  const validarPeriodoParcial = () => {
    if (!uePossuiAlunosPeriodoParcial) {
      toastError("Obrigatório preencher se UE possui aluno no período Parcial");
      return false;
    }

    if (
      uePossuiAlunosPeriodoParcial === "true" &&
      alunosAdicionados.length < 1
    ) {
      toastError("Obrigatório adicionar alunos parciais");
      return false;
    }

    return true;
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
    const responsaveisValidos = getResponsaveisPayload();
    return responsaveisValidos.some((resp) => resp.rf.length !== 7);
  };

  const getResponsaveisPayload = () => {
    return responsaveis.filter((resp) => resp.nome !== "" && resp.rf !== "");
  };

  const criarPayloadAlunosParciais = () => {
    if (!Array.isArray(alunosAdicionados) || alunosAdicionados.length === 0) {
      return null;
    }

    let alunos = [];
    alunosAdicionados.forEach((alunoAdicionado) => {
      alunos.push({
        aluno: alunoAdicionado.uuid,
        data: alunoAdicionado.data,
      });
    });

    return alunos;
  };

  const atualizaPayloadAlunosParciais = () => {
    if (!Array.isArray(alunosAdicionados) || alunosAdicionados.length === 0) {
      return null;
    }

    let alunos = [];
    alunosAdicionados.forEach((alunoAdicionado) => {
      alunos.push({
        aluno: alunoAdicionado.uuid,
        data: alunoAdicionado.data,
        data_removido: alunoAdicionado.data_removido,
      });
    });

    return alunos;
  };

  const criarPayloadAtualizacao = () => {
    const data = new FormData();
    const alunosParciais = atualizaPayloadAlunosParciais();

    data.append("escola", String(escolaInstituicao.uuid));
    data.append("responsaveis", JSON.stringify(getResponsaveisPayload()));
    data.append(
      "ue_possui_alunos_periodo_parcial",
      uePossuiAlunosPeriodoParcial === "true",
    );

    for (let index = 0; index < tipoDeContagemSelecionada.length; index++) {
      data.append(
        "tipos_contagem_alimentacao[]",
        tipoDeContagemSelecionada[index],
      );
    }

    if (alunosParciais) {
      data.append("alunos_periodo_parcial", JSON.stringify(alunosParciais));
      data.append("alunos_parcial_alterado", alunosParcialAlterado);
    }

    return data;
  };

  const criarPayloadNovaSolicitacao = () => {
    const dataPeriodo = new Date(periodoSelecionado);
    const alunosParciais = criarPayloadAlunosParciais();

    const payload = {
      escola: escolaInstituicao.uuid,
      tipos_contagem_alimentacao: tipoDeContagemSelecionada,
      responsaveis: getResponsaveisPayload(),
      ue_possui_alunos_periodo_parcial: uePossuiAlunosPeriodoParcial === "true",
      mes: format(dataPeriodo, "MM").toString(),
      ano: getYear(dataPeriodo).toString(),
    };

    if (alunosParciais) {
      payload.alunos_periodo_parcial = alunosParciais;
    }

    if (recreioNasFeriasUuid) {
      payload.recreio_nas_ferias = recreioNasFeriasUuid;
    }

    return payload;
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
        toastSuccess("Informações atualizadas com sucesso");
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
      toastSuccess("Medição Inicial criada com sucesso");
    } else {
      const errorMessage = Object.values(response.data).join("; ");
      throw new Error(errorMessage);
    }
  };

  const options = [
    { label: "Sim", value: "true" },
    { label: "Não", value: "false" },
  ];

  const onChange = (e) => {
    setUePossuiAlunosPeriodoParcial(e.target.value);
    if (alunosAdicionados?.length > 0) {
      if (e.target.value === "false") {
        setIsModalNaoParcial(true);
      }
    } else {
      let simCheck = e.target.value === "true";
      if (simCheck && alunos.length === 0) {
        setLoading(true);
        getAlunos();
      }
      setShowPesquisaAluno(simCheck);
    }
  };

  const handleModalClose = () => {
    setIsModalDuplicata(false);
  };

  const handleModalNaoParcialClose = () => {
    setIsModalNaoParcial(false);
  };

  const handleModalNaoParcialDelete = () => {
    setShowPesquisaAluno(false);
    setAlunosAdicionados([]);
    setIsModalNaoParcial(false);
  };

  const opcoesContagem = tiposDeContagem
    ? tiposDeContagem.map((tipo) => {
        return { value: tipo.uuid, label: tipo.nome };
      })
    : [];

  const handleChangeTipoContagem = (values) => {
    setTipoDeContagemSelecionada(values);
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
          <Modal
            title="Erro ao adicionar"
            open={isModalDuplicata}
            onCancel={handleModalClose}
            footer={[
              <Botao
                key="ok"
                texto="Ok"
                type={BUTTON_TYPE.BUTTON}
                onClick={handleModalClose}
              />,
            ]}
          >
            <p>Não é possível adicionar o mesmo aluno mais de uma vez.</p>
          </Modal>
          <Modal
            title="Fechar Perído Parcial"
            open={isModalNaoParcial}
            onCancel={handleModalClose}
            footer={[
              <>
                <Botao
                  key="sim"
                  texto="SIM"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={handleModalNaoParcialDelete}
                  className="ms-3"
                />
                <Botao
                  key="nao"
                  texto="NÃO"
                  type={BUTTON_TYPE.BUTTON}
                  onClick={handleModalNaoParcialClose}
                  className="ms-3"
                />
              </>,
            ]}
          >
            <p>Atenção! Você deseja excluir o período parcial?</p>
          </Modal>
          <Collapse
            expandIconPosition="end"
            activeKey={isOpen ? ["1"] : []}
            onChange={() => setIsOpen(!isOpen)}
          >
            <Panel header="Informações Básicas da Medição Inicial" key="1">
              <Spin tip="Carregando..." spinning={loadingInfoBasicas}>
                <div className="row">
                  {ehEscolaTipoCEMEI(escolaInstituicao) && (
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
                            allItemsAreSelected:
                              "Todos os métodos selecionados",
                          }}
                          disabled={!emEdicao}
                        />
                      )}
                    </div>
                  )}

                  <div className="col-7 info-label">
                    <label className="mt-2 mb-2">
                      Nome da Empresa Responsável pelo Atendimento
                    </label>
                    <p className="value-label">{nomeTerceirizada}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-7 info-label">
                    <label className="asterisk-label">*</label>
                    <label className="value-label mt-2 mb-2 me-3">
                      A UE possui alunos no período parcial?
                    </label>
                    {options.map((option) => (
                      <Checkbox
                        key={option.value}
                        value={option.value}
                        checked={uePossuiAlunosPeriodoParcial === option.value}
                        onChange={onChange}
                        disabled={!emEdicao || recreioNasFeriasUuid}
                      >
                        {option.label}
                      </Checkbox>
                    ))}
                  </div>
                </div>
                {showPesquisaAluno && (
                  <TabelaAlunosParciais
                    setIsModalDuplicata={setIsModalDuplicata}
                    alunos={alunos}
                    loading={loading}
                    alunosAdicionados={alunosAdicionados}
                    setAlunosAdicionados={setAlunosAdicionados}
                    emEdicao={emEdicao}
                    mes={searchParams.get("mes")}
                    ano={searchParams.get("ano")}
                    setAlunosParcialAlterado={setAlunosParcialAlterado}
                  />
                )}

                <div className="row mt-4 me-0">
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
                  <ResponsaveisInputs
                    responsaveis={responsaveis}
                    setaResponsavel={setaResponsavel}
                    verificarInput={verificarInput}
                    emEdicao={emEdicao}
                  />
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
              </Spin>
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
};
