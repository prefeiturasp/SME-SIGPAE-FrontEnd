import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { alergiasIntolerantes } from "src/components/screens/DietaEspecial/Relatorio/dados";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDietaEspecialLevi } from "src/mocks/DietaEspecial/Relatorio/mockDietaEspecialLevi";
import { mockMotivosNegarCancelamento } from "src/mocks/DietaEspecial/Relatorio/mockMotivosNegarCancelamento";
import { mockDietaEspecialComum } from "src/mocks/DietaEspecial/mockDietaAvalidar";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosNutriCODAE } from "src/mocks/meusDados/nutriCODAE";
import { mockAlimentos } from "src/mocks/services/dietaEspecial.service/alimentos";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import * as RelatorioDietaEspecial from "src/pages/DietaEspecial/RelatorioPage";
import mock from "src/services/_mock";
import * as dietaEspecialService from "src/services/dietaEspecial.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { renderWithProvider } from "src/utils/test-utils";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("src/services/websocket", () => ({
  Websocket: jest.fn().mockImplementation(() => ({
    socket: {
      close: jest.fn(),
    },
  })),
}));

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, label, name }) => (
    <div>
      <label htmlFor={input?.name || name}>{label}</label>
      <textarea id={input?.name || name} {...input} />
    </div>
  ),
}));

describe("Testa Botão `Copiar Dados desta Solicitação`", () => {
  const uuidSolicitacaoAtual = "65dc7952-d0c9-4864-88c6-25e134bc4421";
  const search = `?uuid=${uuidSolicitacaoAtual}&ehInclusaoContinua=false&tipoSolicitacao=&card=pendentes-aut`;

  const dietaAtual = {
    ...mockDietaEspecialLevi,
    uuid: uuidSolicitacaoAtual,
  };

  const solicitacaoCopiada = {
    ...mockDietaEspecialComum,
    uuid: "11111111-1111-1111-1111-111111111111",
    id_externo: "COPIA1",
    status_solicitacao: "CODAE_AUTORIZADO",
    ativo: true,
    aluno: dietaAtual.aluno,
    alergias_intolerancias: [{ id: 127, descricao: "ARGININEMIA" }],
    classificacao: {
      id: 7,
      descricao: "Classificação copiada",
      nome: "Tipo A RESTRIÇÃO DE AMINOÁCIDOS",
    },
    protocolo_padrao: "4a4c8e48-1f76-4e9e-b6b5-d776ae350839",
    nome_protocolo: "ALERGIA - OVO",
    orientacoes_gerais: "<p>Orientação copiada</p>",
    substituicoes: [
      {
        id: 9001,
        alimento: {
          id: 495,
          nome: "ACEROLA",
          uuid: "8617806d-f03e-4d15-a1e3-fd93efe4f277",
          ativo: true,
          tipo: "E",
          marca: null,
          outras_informacoes: "",
          tipo_listagem_protocolo: "SO_ALIMENTOS",
        },
        substitutos: [
          {
            id: 489,
            nome: "ABACATE",
            uuid: "b48dc997-2cbd-4c10-9766-711f41637922",
            ativo: true,
            tipo: "E",
            marca: null,
            outras_informacoes: "",
            tipo_listagem_protocolo: "SO_ALIMENTOS",
          },
        ],
        alimentos_substitutos: [],
        tipo: "S",
        solicitacao_dieta_especial: 9001,
      },
    ],
    informacoes_adicionais: "<p>Informação copiada</p>",
  };

  const solicitacaoSecundaria = {
    ...solicitacaoCopiada,
    uuid: "22222222-2222-2222-2222-222222222222",
    id_externo: "COPIA2",
    ativo: false,
    nome_protocolo: "SEGUNDA SOLICITAÇÃO",
  };

  const expandirSolicitacao = (idExterno) => {
    const titulo = screen.getByText(`Solicitação: # ${idExterno}`);
    const container = titulo.closest(".school-container");
    const toggle = container.querySelector(".toggle-expandir");
    fireEvent.click(toggle);
    return container;
  };

  const renderPagina = async () => {
    mock.reset();

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosNutriCODAE);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock.onGet("/notificacoes/quantidade-nao-lidos/").reply(200, {
      quantidade_nao_lidos: 0,
    });
    mock.onGet("/motivos-negacao/").reply(200, mockMotivosNegarCancelamento);
    mock
      .onGet(`/solicitacoes-dieta-especial/${uuidSolicitacaoAtual}/`)
      .reply(200, dietaAtual);
    mock
      .onGet(
        `/solicitacoes-dieta-especial/solicitacoes-aluno/${dietaAtual.aluno.codigo_eol}/`,
      )
      .reply(200, { results: [solicitacaoCopiada, solicitacaoSecundaria] });
    mock.onGet("/solicitacoes-dieta-especial/").reply(200, { results: [] });
    mock.onGet("/alergias-intolerancias/").reply(200, alergiasIntolerantes());
    mock
      .onGet(`/alunos/${dietaAtual.aluno.codigo_eol}/ver-foto/`)
      .replyOnce(404, {});
    mock.onGet("/classificacoes-dieta/").reply(200, mockGetClassificacaoDieta);
    mock
      .onGet("/protocolo-padrao-dieta-especial/lista-protocolos-liberados/")
      .reply(200, {
        results: [
          {
            nome_protocolo: "ALERGIA - CARNE SUÍNA",
            uuid: "3a4ae301-d1e6-4e1a-9429-a4a324513383",
          },
          {
            nome_protocolo: "ALERGIA - OVO",
            uuid: "4a4c8e48-1f76-4e9e-b6b5-d776ae350839",
          },
        ],
      });
    mock.onGet("/alimentos/").reply(200, mockAlimentos);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIETA_ESPECIAL);
    localStorage.setItem("perfil", PERFIL.COORDENADOR_DIETA_ESPECIAL);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          initialEntries={[{ pathname: "/", search }]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosNutriCODAE,
              setMeusDados: jest.fn(),
            }}
          >
            <ToastContainer />
            <RelatorioDietaEspecial.RelatorioCODAE />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });

    await screen.findAllByText("Dieta Especial - Solicitação de Inclusão");
    await screen.findByText("Solicitação: # COPIA1");
    await screen.findByRole("button", { name: /autorizar/i });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("exibe o botão de copiar apenas no primeiro item da lista de dietas ativas/inativas", async () => {
    await renderPagina();

    const primeiroContainer = expandirSolicitacao("COPIA1");
    const segundoContainer = expandirSolicitacao("COPIA2");

    expect(
      within(primeiroContainer).getByText("Copiar Dados desta Solicitação"),
    ).toBeInTheDocument();
    expect(
      within(segundoContainer).queryByText("Copiar Dados desta Solicitação"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Copiar Dados desta Solicitação")).toHaveLength(
      1,
    );
  });

  it("copia os dados da primeira solicitação e preenche o formulário corretamente", async () => {
    await renderPagina();

    expandirSolicitacao("COPIA1");
    fireEvent.click(
      screen.getByRole("button", { name: /copiar dados desta solicitação/i }),
    );

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith(
        "Dados da solicitação copiados para o formulário.",
      );
    });

    expect(screen.getByDisplayValue("ALERGIA - OVO")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(solicitacaoCopiada.orientacoes_gerais),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(solicitacaoCopiada.informacoes_adicionais),
    ).toBeInTheDocument();

    const autorizarSpy = jest
      .spyOn(dietaEspecialService, "CODAEAutorizaDietaEspecial")
      .mockResolvedValue({
        status: 200,
        data: {
          detail: "Autorização de Dieta Especial realizada com sucesso!",
        },
      });

    fireEvent.click(screen.getByRole("button", { name: /autorizar/i }));

    await waitFor(() => {
      expect(autorizarSpy).toHaveBeenCalledWith(
        uuidSolicitacaoAtual,
        expect.objectContaining({
          alergias_intolerancias: ["127"],
          classificacao: "7",
          protocolo_padrao: "4a4c8e48-1f76-4e9e-b6b5-d776ae350839",
          nome_protocolo: "ALERGIA - OVO",
          orientacoes_gerais: "<p>Orientação copiada</p>",
          informacoes_adicionais: "<p>Informação copiada</p>",
          substituicoes: [
            expect.objectContaining({
              alimento: "495",
              tipo: "S",
              substitutos: ["b48dc997-2cbd-4c10-9766-711f41637922"],
            }),
          ],
        }),
      );
    });
  });

  it("autoriza a solicitação copiada e exibe toast de sucesso", async () => {
    const autorizarSpy = jest
      .spyOn(dietaEspecialService, "CODAEAutorizaDietaEspecial")
      .mockResolvedValue({
        status: 200,
        data: {
          detail: "Autorização de Dieta Especial realizada com sucesso!",
        },
      });

    await renderPagina();

    expandirSolicitacao("COPIA1");
    fireEvent.click(
      screen.getByRole("button", { name: /copiar dados desta solicitação/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /autorizar/i }));

    await waitFor(() => {
      expect(autorizarSpy).toHaveBeenCalled();
      expect(toastSuccess).toHaveBeenCalledWith(
        "Autorização de Dieta Especial realizada com sucesso!",
      );
    });
  });

  it("nega a solicitação e exibe toast de sucesso", async () => {
    const negarSpy = jest
      .spyOn(dietaEspecialService, "CODAENegaDietaEspecial")
      .mockResolvedValue({
        status: 200,
        data: { detail: "Solicitação negada com sucesso!" },
      });

    await renderPagina();

    fireEvent.click(screen.getByRole("button", { name: /negar/i }));

    const modal = await screen.findByRole("dialog");
    const selects = within(modal).getAllByRole("combobox");

    fireEvent.change(selects[0], {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText("Justificativa"), {
      target: { value: "Justificativa de teste para negação." },
    });
    fireEvent.click(within(modal).getByRole("button", { name: /^sim$/i }));

    await waitFor(() => {
      expect(negarSpy).toHaveBeenCalledWith(
        uuidSolicitacaoAtual,
        expect.objectContaining({
          motivo_negacao: "1",
          justificativa_negacao: "Justificativa de teste para negação.",
        }),
      );
      expect(toastSuccess).toHaveBeenCalledWith(
        "Solicitação negada com sucesso!",
      );
    });
  });

  it("não dispara toast de erro durante o fluxo principal", async () => {
    await renderPagina();

    expect(toastError).not.toHaveBeenCalled();
  });
});
