import "./style.scss";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import { Spin } from "antd";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import InputErroMensagem from "src/components/Shareable/Input/InputErroMensagem";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import { DadosMedicaoFinal } from "src/interfaces/relatorio_financeiro.interface";
import {
  gerarMedicaoFinal,
  getDadosMedicaoFinal,
} from "src/services/medicaoInicial/relatorioFinanceiro.service";
import { interpretarErroGerarMedicaoFinal } from "./helpers";
import { DadosMedicaoFinalLeitura } from "./DadosMedicaoFinalLeitura";
import {
  apenasDigitos,
  useResponsavelConferencia,
} from "./useResponsavelConferencia";

type Props = {
  showModal: boolean;
  setShowModal: (_e: boolean) => void;
  uuidRelatorio: string;
  onSucesso: () => void;
};

type FormValues = {
  rf?: string;
  numero_processo_pagamento?: string;
};

const ConteudoModal = ({
  setShowModal,
  uuidRelatorio,
  onSucesso,
}: Omit<Props, "showModal">) => {
  const [dados, setDados] = useState<DadosMedicaoFinal | null>(null);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const responsavel = useResponsavelConferencia();

  useEffect(() => {
    let cancelado = false;
    const carregar = async () => {
      try {
        const { data } = await getDadosMedicaoFinal(uuidRelatorio);
        if (!cancelado) setDados(data);
      } catch {
        if (!cancelado)
          toastError("Erro ao carregar os dados da Medição Final.");
      } finally {
        if (!cancelado) setCarregandoDados(false);
      }
    };
    carregar();
    return () => {
      cancelado = true;
    };
  }, [uuidRelatorio]);

  const podeSalvar = (values: FormValues) =>
    Boolean(values.rf) &&
    !responsavel.erro &&
    Boolean(responsavel.nome) &&
    !responsavel.buscando &&
    Boolean(values.numero_processo_pagamento?.trim()) &&
    !enviando;

  const onSubmit = async (values: FormValues) => {
    if (!podeSalvar(values)) return;
    setEnviando(true);
    const response = await gerarMedicaoFinal(
      {
        rf_responsavel_conferencia: values.rf,
        numero_processo_pagamento: values.numero_processo_pagamento.trim(),
      },
      uuidRelatorio,
    );
    setEnviando(false);

    if (response?.status === HTTP_STATUS.OK) {
      toastSuccess("Medição Final Gerada com sucesso");
      setShowModal(false);
      onSucesso();
    } else {
      const { erroRf, mensagem } = interpretarErroGerarMedicaoFinal(
        response?.data,
      );
      if (erroRf) responsavel.definirErro(erroRf);
      else toastError(mensagem);
    }
  };

  return (
    <Form<FormValues> onSubmit={onSubmit}>
      {({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <Spin tip="Carregando..." spinning={carregandoDados}>
              <p className="orientacao">
                Insira as informações administrativas para Geração da Medição
                Final:
              </p>
              <DadosMedicaoFinalLeitura dados={dados} />

              <div className="subtitulo mt-4 mb-2">
                Responsável pela conferência inicial das medições iniciais
              </div>
              <div className="row">
                <div className="col-6">
                  <Field
                    dataTestId="rf"
                    component={InputText}
                    label="RF"
                    name="rf"
                    placeholder="Digite o RF"
                    required
                    validate={required}
                    parse={apenasDigitos}
                    inputOnChange={(e) =>
                      responsavel.aoAlterarRf(apenasDigitos(e.target.value))
                    }
                    onBlur={(e) =>
                      responsavel.aoSairDoRf(apenasDigitos(e.target.value))
                    }
                    className={responsavel.erro ? "invalid-field" : ""}
                    inputMode="numeric"
                    maxlength={20}
                    disabled={enviando}
                  />
                  <InputErroMensagem
                    meta={{ touched: true, error: responsavel.erro }}
                  />
                  {responsavel.buscando && (
                    <small data-testid="buscando-rf">
                      <i className={BUTTON_ICON.LOADING} /> Buscando...
                    </small>
                  )}
                </div>
                <div className="col-6">
                  <Field
                    dataTestId="nome_responsavel"
                    component={InputText}
                    label="Nome Completo do Responsável"
                    name="nome_responsavel"
                    placeholder="Nome completo do Responsável"
                    valorInicial={responsavel.nome}
                    disabled
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <Field
                    dataTestId="numero_processo_pagamento"
                    component={InputText}
                    label="Nº do processo de pagamento"
                    name="numero_processo_pagamento"
                    placeholder="Informe o número do processo para pagamentos"
                    required
                    validate={required}
                    disabled={enviando}
                  />
                </div>
              </div>
            </Spin>
          </Modal.Body>

          <Modal.Footer>
            <Botao
              dataTestId="botao-cancelar"
              texto="Cancelar"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => setShowModal(false)}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="ms-3"
              disabled={enviando}
            />
            <Botao
              dataTestId="botao-salvar"
              texto="Salvar"
              type={BUTTON_TYPE.SUBMIT}
              style={BUTTON_STYLE.GREEN}
              icon={enviando ? BUTTON_ICON.LOADING : undefined}
              className="ms-3"
              disabled={!podeSalvar(values)}
            />
          </Modal.Footer>
        </form>
      )}
    </Form>
  );
};

const ModalGerarMedicaoFinal = ({
  showModal,
  setShowModal,
  uuidRelatorio,
  onSucesso,
}: Props) => (
  <>
    {showModal && <div className="modal-backdrop show" />}
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      backdrop="static"
      size="lg"
      dialogClassName="modal-gerar-medicao-final"
    >
      <Modal.Header closeButton>
        <Modal.Title>Gerar Medição Final</Modal.Title>
      </Modal.Header>
      <ConteudoModal
        setShowModal={setShowModal}
        uuidRelatorio={uuidRelatorio}
        onSucesso={onSucesso}
      />
    </Modal>
  </>
);

export default ModalGerarMedicaoFinal;
