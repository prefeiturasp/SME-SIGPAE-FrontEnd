import React from "react";
import {
  act,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import GestaoAcessoGeralPage from "src/pages/Configuracoes/GestaoAcessoGeralPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";
import { PERFIL } from "src/constants/shared";

import { mockGetVisoesListagem } from "src/mocks/services/perfil.service/mockGetVisoesListagem";
import { mockGetPerfilListagem } from "src/mocks/services/perfil.service/mockGetPerfilListagem";
import { mockGetSubdivisoesCODAE } from "src/mocks/services/vinculos.service/mockGetSubdivisoesCODAE";
import { mockGetVinculosAtivos } from "src/mocks/services/vinculos.service/mockGetVinculosAtivos";
import { mockMeusDadosAdmGestaoProduto } from "src/mocks/meusDados/admGestaoProduto";
import { mockGetDadosUsuarioEOL } from "src/mocks/services/permissoes.service/mockGetDadosUsuarioEOL";
import {
  mockGetVinculosAtivosPosCadastro,
  mockGetVinculosAtivosPosCadastro2,
  mockGetVinculosAtivosPosCadastro3,
} from "src/mocks/services/vinculos.service/mockGetVinculosAtivosPosCadastro";
import { mockAlterarVinculo } from "src/mocks/services/vinculos.service/mockAlterarVinculo";

describe("Teste <GestaoAcessoEmpresaPage>", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_GESTAO_PRODUTO);

    mock.onGet("/codae/").reply(200, mockGetSubdivisoesCODAE);
    mock.onGet(`/perfis/visoes/`).reply(200, mockGetVisoesListagem);
    mock
      .onGet("/vinculos/vinculos-ativos/")
      .replyOnce(200, mockGetVinculosAtivos);
    mock.onGet(`/perfis/`).reply(200, mockGetPerfilListagem);
    mock
      .onGet(
        `/perfis-vinculados/ADMINISTRADOR_GESTAO_PRODUTO/perfis-subordinados/`
      )
      .reply(200, [
        "ADMINISTRADOR_GESTAO_PRODUTO",
        "ADMINISTRADOR_EMPRESA",
        "USUARIO_EMPRESA",
      ]);
    mock
      .onGet("/dados-usuario-eol-completo/1391054/")
      .reply(200, mockGetDadosUsuarioEOL);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosAdmGestaoProduto,
              setMeusDados: jest.fn(),
            }}
          >
            <GestaoAcessoGeralPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Testa a renderização dos elementos da página", async () => {
    await waitFor(() =>
      expect(screen.getByText("Treinamento")).toBeInTheDocument()
    );
  });

  it("Verifica as visões disponíveis e se o fitro de perfis está funcional", async () => {
    await waitFor(() =>
      expect(
        screen.getByText("Usuários com Acesso Cadastrados")
      ).toBeInTheDocument()
    );

    const selectElement = screen
      .getByTestId("input-visao")
      .querySelector("select");
    expect(within(selectElement).queryByText("CODAE")).not.toBeNull();
    expect(within(selectElement).queryByText("Empresa")).not.toBeNull();
    fireEvent.change(selectElement, { target: { value: "CODAE" } });

    const selectPerfilAcesso = screen
      .getByTestId("input-perfil-acesso")
      .querySelector("select");
    fireEvent.mouseDown(selectPerfilAcesso);

    expect(
      within(selectPerfilAcesso).queryByText("ADMINISTRADOR_EMPRESA")
    ).toBeNull();
    expect(
      within(selectPerfilAcesso).queryByText("USUARIO_EMPRESA")
    ).toBeNull();
    expect(
      within(selectPerfilAcesso).queryByText("ADMINISTRADOR_GESTAO_PRODUTO")
    ).not.toBeNull();
  });

  it("Testa a abertura do modal de 'Adicionar Acesso' e o CRUD de um usuário Servidor", async () => {
    await waitFor(() =>
      expect(screen.getByText("Treinamento")).toBeInTheDocument()
    );

    await act(async () => {
      const botaoAdicionar = screen
        .getByText("Adicionar Acesso")
        .closest("button");
      fireEvent.click(botaoAdicionar);
    });

    expect(screen.queryByText("Servidor")).toBeInTheDocument();
    expect(screen.queryByText("Não Servidor")).toBeInTheDocument();
    expect(screen.queryByText("Unidade Parceira")).not.toBeInTheDocument();

    const botaoServidor = screen.getByLabelText("Servidor");
    fireEvent.click(botaoServidor);

    await waitFor(() =>
      expect(screen.getByText("Pesquisar RF")).toBeInTheDocument()
    );

    const inputRF = screen.getByPlaceholderText("Digite o RF do Servidor");
    fireEvent.change(inputRF, { target: { value: "1391054" } });

    const botaoPesquisar = document.querySelector(".botao-rf");
    fireEvent.click(botaoPesquisar);

    await waitFor(() =>
      expect(
        screen.getByDisplayValue("EDNA INES NATALI DEMETRIO")
      ).toBeInTheDocument()
    );

    const selectPerfilAcesso = screen
      .getByTestId("select-perfil-acesso")
      .querySelector("select");
    fireEvent.mouseDown(selectPerfilAcesso);
    await userEvent.selectOptions(
      selectPerfilAcesso,
      "ADMINISTRADOR_GESTAO_PRODUTO"
    );

    await waitFor(() => {
      expect(selectPerfilAcesso).toHaveValue("ADMINISTRADOR_GESTAO_PRODUTO");
    });

    mock
      .onPost("/cadastro-com-coresso/")
      .replyOnce(201, { uuid: "0b788b4b-85fb-4b4f-83e2-9e423176406b" });
    mock
      .onGet("/vinculos/vinculos-ativos/")
      .replyOnce(200, mockGetVinculosAtivosPosCadastro);

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(screen.getByText("EDNA INES NATALI DEMETRIO")).toBeInTheDocument();
    });

    const botaoLixeira = document.querySelector(".verde");
    fireEvent.click(botaoLixeira);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Após removido, o usuário não terá mais acesso ao SIGPAE."
        )
      ).toBeInTheDocument();
    });

    mock
      .onPost("/cadastro-com-coresso/1391054/finalizar-vinculo/")
      .replyOnce(200, { detail: "Acesso removido com sucesso!" });
    mock
      .onGet("/vinculos/vinculos-ativos/")
      .replyOnce(200, mockGetVinculosAtivos);

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(screen.queryByText("EDNA INES NATALI DEMETRIO")).toBeNull();
    });
  });

  it("Testa o CRUD de um usuário Não Servidor", async () => {
    await waitFor(() =>
      expect(screen.getByText("Treinamento")).toBeInTheDocument()
    );

    await act(async () => {
      const botaoAdicionar = screen
        .getByText("Adicionar Acesso")
        .closest("button");
      fireEvent.click(botaoAdicionar);
    });

    const botaoNaoServidor = screen.getByLabelText("Não Servidor");
    fireEvent.click(botaoNaoServidor);

    const inputNome = screen.getByPlaceholderText(
      "Digite o nome completo do usuário"
    );
    fireEvent.change(inputNome, { target: { value: "Fulano da Silva" } });

    const inputEmail = screen.getByPlaceholderText(
      "Digite o e-mail do Usuário"
    );
    fireEvent.change(inputEmail, { target: { value: "fulano@teste.com" } });

    const inputCPF = screen.getByPlaceholderText("Digite o CPF do usuário");
    fireEvent.change(inputCPF, { target: { value: "947.388.100-22" } });

    const inputCNPJ = screen.getByPlaceholderText("Digite o CNPJ da Empresa");
    fireEvent.change(inputCNPJ, { target: { value: "22.460.700/0001-00" } });

    const selectPerfilAcesso = screen
      .getByTestId("select-perfil-acesso2")
      .querySelector("select");
    fireEvent.mouseDown(selectPerfilAcesso);
    await userEvent.selectOptions(selectPerfilAcesso, "USUARIO_EMPRESA");

    mock
      .onPost("/cadastro-com-coresso/")
      .replyOnce(201, { uuid: "910efe60-5887-44d7-a1c0-166f17eb496a" });
    mock
      .onGet("/vinculos/vinculos-ativos/")
      .replyOnce(200, mockGetVinculosAtivosPosCadastro2);

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(screen.getByText("Fulano da Silva")).toBeInTheDocument();
    });

    // ALTERAÇÃO DE VÍNCULO
    const botoesVerdes = screen.getAllByRole("button", { class: "/verde/i" });
    const botaoEditar = botoesVerdes.find((btn) =>
      btn.querySelector("i.fa-edit")
    );
    await userEvent.click(botaoEditar);

    fireEvent.mouseDown(selectPerfilAcesso);
    await userEvent.selectOptions(selectPerfilAcesso, "ADMINISTRADOR_EMPRESA");

    await waitFor(() => {
      expect(selectPerfilAcesso).toHaveValue("ADMINISTRADOR_EMPRESA");
    });

    mock
      .onPost("/cadastro-com-coresso/94738810022/alterar-vinculo/")
      .replyOnce(200, mockAlterarVinculo);
    mock
      .onGet("/vinculos/vinculos-ativos/")
      .replyOnce(200, mockGetVinculosAtivosPosCadastro3);

    fireEvent.click(botaoSalvar);

    // EXCLUSÃO DE ACESSO
    await userEvent.click(botaoEditar);

    await waitFor(() => {
      expect(selectPerfilAcesso).toHaveValue("ADMINISTRADOR_EMPRESA");
    });

    const botaoRemover = screen.getByText("Remover").closest("button");
    await userEvent.click(botaoRemover);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Após removido, o usuário não terá mais acesso ao SIGPAE."
        )
      ).toBeInTheDocument();
    });

    mock
      .onPost("/cadastro-com-coresso/94738810022/finalizar-vinculo/")
      .replyOnce(200, { detail: "Acesso removido com sucesso!" });
    mock
      .onGet("/vinculos/vinculos-ativos/")
      .replyOnce(200, mockGetVinculosAtivos);

    const botaoSim = screen.getByText("Sim").closest("button");
    fireEvent.click(botaoSim);
  });
});
