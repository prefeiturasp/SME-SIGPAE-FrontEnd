import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import { Container } from "src/components/SuspensaoAlimentacaoDeCEI/Container";
import { Rascunhos } from "src/components/SuspensaoAlimentacaoDeCEI/Rascunhos";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCEI } from "src/mocks/meusDados/escola/CEI";
import { mockMeusDadosEscolaCEIcomMANHAeTARDE } from "src/mocks/meusDados/escola/CEIcomMANHAeTARDE";
import { mockRascunhosSuspensaoAlimentacaoCEI } from "src/mocks/services/suspensaoAlimentacaoCei.service/mockRascunhosSuspensaoAlimentacaoCEI";
import { mockMotivosSuspensaoCardapio } from "src/mocks/services/suspensaoDeAlimentacao.service/mockMotivosSuspensaoCardapio";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

const URL_MOTIVOS = "/motivos-suspensao-cardapio/";
const URL_DIAS_UTEIS = "/dias-uteis/";
const URL_SUSPENSAO_CEI = "/suspensao-alimentacao-de-cei/";
const URL_RASCUNHOS = `${URL_SUSPENSAO_CEI}meus_rascunhos/`;
const urlSuspensao = (uuid) => `${URL_SUSPENSAO_CEI}${uuid}/`;
const urlInformaSuspensao = (uuid) =>
  `suspensao-alimentacao-de-cei/${uuid}/informa-suspensao/`;

const [RASCUNHO_COMUM, RASCUNHO_OUTRO_MOTIVO] =
  mockRascunhosSuspensaoAlimentacaoCEI.results;
const [MOTIVO_COMUM, MOTIVO_OUTRO] = mockMotivosSuspensaoCardapio.results;
const ESCOLA = mockMeusDadosEscolaCEIcomMANHAeTARDE.vinculo_atual.instituicao;
const UUID_NOVA_SUSPENSAO = "0c9d8e7f-6a5b-4c3d-9e2f-1a0b9c8d7e6f";

const clonar = (objeto) => JSON.parse(JSON.stringify(objeto));

const setup = async (
  meusDados = clonar(mockMeusDadosEscolaCEIcomMANHAeTARDE),
) => {
  await act(async () => {
    renderWithProvider(
      <MeusDadosContext.Provider value={{ meusDados }}>
        <Container />
        <ToastContainer />
      </MeusDadosContext.Provider>,
    );
  });
  expect(await screen.findByText("Descrição da Suspensão")).toBeInTheDocument();
};

const selectMotivo = () => screen.getByRole("combobox");
const inputData = () => document.querySelector(".datepicker input");
const checkboxPeriodo = (nome) => screen.getByRole("checkbox", { name: nome });
const cardRascunho = (idExterno) =>
  screen.getByText(`Suspensão de Alimentação # ${idExterno}`).closest(".draft");

const selecionarMotivo = (uuid) =>
  fireEvent.change(selectMotivo(), { target: { value: uuid } });

const preencherData = (data) =>
  fireEvent.change(inputData(), { target: { value: data } });

const preencherFormulario = ({
  motivo = MOTIVO_COMUM.uuid,
  data = "31/01/2025",
  periodos = ["INTEGRAL"],
} = {}) => {
  selecionarMotivo(motivo);
  preencherData(data);
  periodos.forEach((nome) => fireEvent.click(checkboxPeriodo(nome)));
};

const clicarBotao = async (texto) => {
  await act(async () => {
    fireEvent.click(screen.getByText(texto));
  });
};

const editarRascunho = async (rascunho) => {
  await act(async () => {
    fireEvent.click(
      within(cardRascunho(rascunho.id_externo)).getByRole("button", {
        name: "Editar rascunho",
      }),
    );
  });
};

const ultimoPayload = (metodo) =>
  JSON.parse(mock.history[metodo][mock.history[metodo].length - 1].data);

const totalBuscasRascunhos = () =>
  mock.history.get.filter((requisicao) =>
    requisicao.url.endsWith(URL_RASCUNHOS),
  ).length;

describe("SuspensaoAlimentacaoDeCEI - Formulário", () => {
  beforeEach(() => {
    mock.reset();
    mock.onGet(URL_MOTIVOS).reply(200, mockMotivosSuspensaoCardapio);
    mock.onGet(URL_DIAS_UTEIS).reply(200, mockDiasUteis);
    mock.onGet(URL_RASCUNHOS).reply(200, mockRascunhosSuspensaoAlimentacaoCEI);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  describe("renderização", () => {
    it("exibe o card de matriculados, os rascunhos e o formulário de nova solicitação", async () => {
      await setup();

      expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
      expect(
        screen.getByText(String(ESCOLA.quantidade_alunos)),
      ).toBeInTheDocument();

      expect(screen.getByText("Rascunhos")).toBeInTheDocument();
      mockRascunhosSuspensaoAlimentacaoCEI.results.forEach((rascunho) => {
        const card = cardRascunho(rascunho.id_externo);
        expect(within(card).getByText(rascunho.status)).toBeInTheDocument();
        expect(
          within(card).getByText(`Criado em: ${rascunho.criado_em}`),
        ).toBeInTheDocument();
        expect(within(card).getByText(rascunho.data)).toBeInTheDocument();
      });

      expect(screen.getByText("Nova Solicitação")).toBeInTheDocument();
      expect(screen.getByText("Salvar Rascunho")).toBeInTheDocument();
      ["INTEGRAL", "MANHA", "TARDE"].forEach((nome) => {
        expect(checkboxPeriodo(nome)).not.toBeChecked();
      });
    });

    it("destaca rascunhos com status SALVO com uma cor diferente", () => {
      render(
        <Rascunhos
          suspensoesDeAlimentacaoList={
            mockRascunhosSuspensaoAlimentacaoCEI.results
          }
          OnDeleteButtonClicked={jest.fn()}
          OnEditButtonClicked={jest.fn()}
        />,
      );

      expect(screen.getByText(RASCUNHO_OUTRO_MOTIVO.status)).toHaveStyle({
        background: "#82B7E8",
      });
      expect(screen.getByText(RASCUNHO_COMUM.status)).toHaveStyle({
        background: "#DADADA",
      });
    });

    it("não exibe a seção de rascunhos quando não há rascunhos", async () => {
      mock.onGet(URL_RASCUNHOS).reply(200, { results: [] });

      await setup();

      expect(screen.queryByText("Rascunhos")).not.toBeInTheDocument();
    });

    it("não renderiza o formulário quando a busca de rascunhos não retorna 200", async () => {
      mock.onGet(URL_RASCUNHOS).reply(204);

      await act(async () => {
        renderWithProvider(
          <MeusDadosContext.Provider
            value={{ meusDados: clonar(mockMeusDadosEscolaCEIcomMANHAeTARDE) }}
          >
            <Container />
          </MeusDadosContext.Provider>,
        );
      });

      await waitFor(() => expect(totalBuscasRascunhos()).toBe(1));
      expect(
        screen.queryByText("Descrição da Suspensão"),
      ).not.toBeInTheDocument();
    });

    it("exibe apenas os períodos com alunos regulares", async () => {
      await setup(clonar(mockMeusDadosCEI));

      expect(checkboxPeriodo("INTEGRAL")).toBeInTheDocument();
      expect(
        screen.queryByRole("checkbox", { name: "MANHA" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("checkbox", { name: "TARDE" }),
      ).not.toBeInTheDocument();
    });

    it("não exibe o número de matriculados quando a escola não possui alunos", async () => {
      const meusDados = clonar(mockMeusDadosEscolaCEIcomMANHAeTARDE);
      delete meusDados.vinculo_atual.instituicao.quantidade_alunos;

      await setup(meusDados);

      expect(screen.queryByText("Nº de Matriculados")).not.toBeInTheDocument();
    });
  });

  describe("interações do formulário", () => {
    it("exibe o campo 'Qual o motivo?' apenas quando o motivo 'Outro' é selecionado", async () => {
      await setup();

      selecionarMotivo(MOTIVO_OUTRO.uuid);
      expect(screen.getByText("Qual o motivo?")).toBeInTheDocument();

      selecionarMotivo(MOTIVO_COMUM.uuid);
      expect(screen.queryByText("Qual o motivo?")).not.toBeInTheDocument();
    });

    it("marca e desmarca os períodos", async () => {
      await setup();

      fireEvent.click(checkboxPeriodo("MANHA"));
      expect(checkboxPeriodo("MANHA")).toBeChecked();
      expect(checkboxPeriodo("TARDE")).not.toBeChecked();

      fireEvent.click(checkboxPeriodo("MANHA"));
      expect(checkboxPeriodo("MANHA")).not.toBeChecked();
    });

    it("impede o envio do formulário ao pressionar Enter", async () => {
      await setup();
      const formulario = document.querySelector("form");

      expect(
        fireEvent.keyPress(formulario, { key: "Enter", charCode: 13 }),
      ).toBe(false);
      expect(fireEvent.keyPress(formulario, { key: "a", charCode: 97 })).toBe(
        true,
      );
    });

    it("valida os campos obrigatórios antes de enviar", async () => {
      await setup();

      await clicarBotao("Salvar Rascunho");

      expect(screen.getAllByText("Campo obrigatório")).toHaveLength(2);
      expect(mock.history.post).toHaveLength(0);
    });

    it("exige ao menos um período selecionado", async () => {
      await setup();

      preencherFormulario({ periodos: ["MANHA", "MANHA"] });
      await clicarBotao("Salvar Rascunho");

      expect(
        await screen.findByText("Necessário pelo menos um periodo!"),
      ).toBeInTheDocument();
      expect(mock.history.post).toHaveLength(0);
    });

    it("limpa o formulário ao clicar em Cancelar", async () => {
      await setup();
      await editarRascunho(RASCUNHO_OUTRO_MOTIVO);

      expect(screen.getByText("Atualizar")).toBeInTheDocument();

      await clicarBotao("Cancelar");

      expect(screen.getByText("Nova Solicitação")).toBeInTheDocument();
      expect(screen.getByText("Salvar Rascunho")).toBeInTheDocument();
      expect(screen.queryByText("Qual o motivo?")).not.toBeInTheDocument();
      expect(selectMotivo()).toHaveValue("");
      expect(inputData()).toHaveValue("");
      ["INTEGRAL", "MANHA", "TARDE"].forEach((nome) => {
        expect(checkboxPeriodo(nome)).not.toBeChecked();
      });
    });
  });

  describe("salvar rascunho", () => {
    it("salva um novo rascunho com os dados preenchidos", async () => {
      mock.onPost(URL_SUSPENSAO_CEI).reply(201, { uuid: UUID_NOVA_SUSPENSAO });

      await setup();
      preencherFormulario({ periodos: ["INTEGRAL", "TARDE"] });
      await clicarBotao("Salvar Rascunho");

      expect(await screen.findByText("Salvo com sucesso!")).toBeInTheDocument();
      expect(ultimoPayload("post")).toEqual({
        motivo: MOTIVO_COMUM.uuid,
        data: "31/01/2025",
        periodos_escolares: [
          "e17e2405-36be-4981-a09c-35c89ae0f8b7",
          "20bd9ca9-d499-456a-bd86-fb8f297947d6",
        ],
        escola: ESCOLA.uuid,
      });
      expect(totalBuscasRascunhos()).toBe(2);
      expect(checkboxPeriodo("INTEGRAL")).not.toBeChecked();
    });

    it("exibe a mensagem da API e marca o campo data quando há conflito", async () => {
      const mensagem =
        "Já existe uma Solicitação de Suspensão de Alimentação para a data selecionada.";
      mock.onPost(URL_SUSPENSAO_CEI).reply(400, { message: mensagem });

      await setup();
      preencherFormulario();
      await clicarBotao("Salvar Rascunho");

      expect(await screen.findByText(mensagem)).toBeInTheDocument();
      expect(
        screen.getByText("Conflito com outra solicitação"),
      ).toBeInTheDocument();
    });

    it("exibe a mensagem padrão quando a API não retorna mensagem", async () => {
      mock.onPost(URL_SUSPENSAO_CEI).reply(500, {});

      await setup();
      preencherFormulario();
      await clicarBotao("Salvar Rascunho");

      expect(
        await screen.findByText("Erro ao salvar Rascunho"),
      ).toBeInTheDocument();
    });
  });

  describe("editar e atualizar rascunho", () => {
    it("preenche o formulário com um rascunho de motivo comum", async () => {
      await setup();
      await editarRascunho(RASCUNHO_COMUM);

      expect(screen.getByText("Solicitação # 1234AB")).toBeInTheDocument();
      expect(screen.getByText("Atualizar")).toBeInTheDocument();
      expect(selectMotivo()).toHaveValue(RASCUNHO_COMUM.motivo.uuid);
      expect(inputData()).toHaveValue(RASCUNHO_COMUM.data);
      expect(checkboxPeriodo("INTEGRAL")).toBeChecked();
      expect(checkboxPeriodo("MANHA")).not.toBeChecked();
      expect(screen.queryByText("Qual o motivo?")).not.toBeInTheDocument();
    });

    it("preenche o formulário com um rascunho de outro motivo", async () => {
      await setup();
      await editarRascunho(RASCUNHO_OUTRO_MOTIVO);

      expect(selectMotivo()).toHaveValue(RASCUNHO_OUTRO_MOTIVO.motivo.uuid);
      expect(screen.getByText("Qual o motivo?")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(RASCUNHO_OUTRO_MOTIVO.outro_motivo),
      ).toBeInTheDocument();
      expect(checkboxPeriodo("INTEGRAL")).not.toBeChecked();
      expect(checkboxPeriodo("MANHA")).toBeChecked();
      expect(checkboxPeriodo("TARDE")).toBeChecked();
    });

    it("permite editar o rascunho pelo teclado", async () => {
      await setup();

      await act(async () => {
        fireEvent.keyDown(
          within(cardRascunho(RASCUNHO_COMUM.id_externo)).getByRole("button", {
            name: "Editar rascunho",
          }),
          { key: "Enter" },
        );
      });

      expect(screen.getByText("Atualizar")).toBeInTheDocument();
    });

    it("atualiza o rascunho editado", async () => {
      mock.onPatch(urlSuspensao(RASCUNHO_COMUM.uuid)).reply(200, {});

      await setup();
      await editarRascunho(RASCUNHO_COMUM);
      await clicarBotao("Atualizar");

      expect(
        await screen.findByText("Atualizado com sucesso!"),
      ).toBeInTheDocument();
      expect(ultimoPayload("patch")).toEqual(
        expect.objectContaining({
          motivo: RASCUNHO_COMUM.motivo.uuid,
          data: RASCUNHO_COMUM.data,
          periodos_escolares: [RASCUNHO_COMUM.periodos_escolares[0].uuid],
          escola: ESCOLA.uuid,
        }),
      );
      expect(totalBuscasRascunhos()).toBe(2);
      expect(screen.getByText("Salvar Rascunho")).toBeInTheDocument();
    });

    it("exibe todas as mensagens de erro retornadas pela API ao atualizar", async () => {
      mock.onPatch(urlSuspensao(RASCUNHO_COMUM.uuid)).reply(400, {
        message: ["Data inválida", "Período inválido"],
      });

      await setup();
      await editarRascunho(RASCUNHO_COMUM);
      await clicarBotao("Atualizar");

      expect(
        await screen.findByText(/Data inválida\s+Período inválido/),
      ).toBeInTheDocument();
    });

    it("exibe a mensagem padrão quando falha ao atualizar", async () => {
      mock.onPatch(urlSuspensao(RASCUNHO_COMUM.uuid)).reply(500, {});

      await setup();
      await editarRascunho(RASCUNHO_COMUM);
      await clicarBotao("Atualizar");

      expect(
        await screen.findByText("Erro ao atualizar Rascunho"),
      ).toBeInTheDocument();
    });
  });

  describe("enviar solicitação", () => {
    it("cria e informa uma nova suspensão", async () => {
      mock.onPost(URL_SUSPENSAO_CEI).reply(201, { uuid: UUID_NOVA_SUSPENSAO });
      mock.onPatch(urlInformaSuspensao(UUID_NOVA_SUSPENSAO)).reply(200, {});

      await setup();
      preencherFormulario();
      await clicarBotao("Enviar");

      expect(
        await screen.findByText("Enviado com sucesso!"),
      ).toBeInTheDocument();
      expect(ultimoPayload("post")).toEqual(
        expect.objectContaining({
          motivo: MOTIVO_COMUM.uuid,
          periodos_escolares: ["e17e2405-36be-4981-a09c-35c89ae0f8b7"],
        }),
      );
      expect(ultimoPayload("post")).not.toHaveProperty("status");
      expect(mock.history.patch[0].url).toBe(
        urlInformaSuspensao(UUID_NOVA_SUSPENSAO),
      );
      expect(totalBuscasRascunhos()).toBe(2);
    });

    it("exibe a mensagem padrão quando não consegue criar a suspensão", async () => {
      mock.onPost(URL_SUSPENSAO_CEI).networkError();

      await setup();
      preencherFormulario();
      await clicarBotao("Enviar");

      expect(
        await screen.findByText("Erro ao enviar Rascunho"),
      ).toBeInTheDocument();
      expect(mock.history.patch).toHaveLength(0);
    });

    it("exibe a mensagem da API quando falha ao informar a nova suspensão", async () => {
      mock.onPost(URL_SUSPENSAO_CEI).reply(201, { uuid: UUID_NOVA_SUSPENSAO });
      mock
        .onPatch(urlInformaSuspensao(UUID_NOVA_SUSPENSAO))
        .reply(400, { message: "Data fora do prazo permitido" });

      await setup();
      preencherFormulario();
      await clicarBotao("Enviar");

      expect(
        await screen.findByText("Data fora do prazo permitido"),
      ).toBeInTheDocument();
    });

    it("envia um rascunho existente", async () => {
      mock.onPatch(urlInformaSuspensao(RASCUNHO_COMUM.uuid)).reply(200, {});

      await setup();
      await editarRascunho(RASCUNHO_COMUM);
      await clicarBotao("Enviar");

      expect(
        await screen.findByText("Enviado com sucesso!"),
      ).toBeInTheDocument();
      expect(mock.history.post).toHaveLength(0);
      expect(ultimoPayload("patch")).toEqual(
        expect.objectContaining({
          motivo: RASCUNHO_COMUM.motivo.uuid,
          escola: ESCOLA.uuid,
        }),
      );
    });

    it("exibe a mensagem padrão quando falha ao enviar um rascunho existente", async () => {
      mock.onPatch(urlInformaSuspensao(RASCUNHO_COMUM.uuid)).reply(500, {});

      await setup();
      await editarRascunho(RASCUNHO_COMUM);
      await clicarBotao("Enviar");

      expect(
        await screen.findByText("Erro ao enviar Rascunho"),
      ).toBeInTheDocument();
    });
  });

  describe("excluir rascunho", () => {
    const clicarExcluir = async (rascunho, evento = "click") => {
      const botao = within(cardRascunho(rascunho.id_externo)).getByRole(
        "button",
        { name: "Excluir rascunho" },
      );
      await act(async () => {
        if (evento === "click") fireEvent.click(botao);
        else fireEvent.keyDown(botao, { key: " " });
      });
    };

    it("não exclui o rascunho quando o usuário não confirma", async () => {
      jest.spyOn(window, "confirm").mockReturnValue(false);

      await setup();
      await clicarExcluir(RASCUNHO_COMUM);

      expect(window.confirm).toHaveBeenCalledWith(
        "Deseja remover este rascunho?",
      );
      expect(mock.history.delete).toHaveLength(0);
    });

    it("exclui o rascunho após confirmação", async () => {
      jest.spyOn(window, "confirm").mockReturnValue(true);
      mock.onDelete(urlSuspensao(RASCUNHO_COMUM.uuid)).reply(204);

      await setup();
      await clicarExcluir(RASCUNHO_COMUM);

      expect(
        await screen.findByText(
          `Rascunho # ${RASCUNHO_COMUM.id_externo} excluído com sucesso`,
        ),
      ).toBeInTheDocument();
      expect(mock.history.delete[0].url).toBe(
        urlSuspensao(RASCUNHO_COMUM.uuid),
      );
      expect(totalBuscasRascunhos()).toBe(2);
    });

    it("exclui o rascunho pelo teclado", async () => {
      jest.spyOn(window, "confirm").mockReturnValue(true);
      mock.onDelete(urlSuspensao(RASCUNHO_OUTRO_MOTIVO.uuid)).reply(204);

      await setup();
      await clicarExcluir(RASCUNHO_OUTRO_MOTIVO, "teclado");

      expect(
        await screen.findByText(
          `Rascunho # ${RASCUNHO_OUTRO_MOTIVO.id_externo} excluído com sucesso`,
        ),
      ).toBeInTheDocument();
    });

    it("exibe erro quando a API não confirma a exclusão", async () => {
      jest.spyOn(window, "confirm").mockReturnValue(true);
      mock.onDelete(urlSuspensao(RASCUNHO_COMUM.uuid)).reply(200, {});

      await setup();
      await clicarExcluir(RASCUNHO_COMUM);

      expect(
        await screen.findByText("Houve um erro ao excluir o rascunho"),
      ).toBeInTheDocument();
    });
  });
});
