import "@testing-library/jest-dom";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockSolicitacoesAlunoEMEF } from "src/mocks/services/dietaEspecial.service/EMEF/solicitacoesAluno";
import { DietaEspecialEscolaPage } from "src/pages/Escola/DietaEspecial/DietaEspecialEscolaPage";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

describe("Testa Formulário de Solicitação de Dieta Especial - Aluno EOL", () => {
  const codigoEolAluno = "1234567";
  const codigoEolEscola = "017981";

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet(`/dados-alunos-eol/${codigoEolAluno}/`).reply(200, {
      detail: {
        cd_aluno: codigoEolAluno,
        nm_aluno: "TESTE ALUNO EOL",
        nm_social_aluno: null,
        dt_nascimento_aluno: "2016-10-18T00:00:00",
        cd_sexo_aluno: null,
        nm_mae_aluno: null,
        nm_pai_aluno: null,
        cd_escola: "017981",
        dc_turma_escola: "3B",
      },
    });
    mock
      .onGet(
        `/solicitacoes-dieta-especial/solicitacoes-aluno/${codigoEolAluno}/`,
      )
      .reply(200, mockSolicitacoesAlunoEMEF);
    mock
      .onGet(
        `/alunos/${codigoEolAluno}/aluno-pertence-a-escola/${codigoEolEscola}/`,
      )
      .reply(200, { pertence_a_escola: true });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

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
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <ToastContainer />
            <DietaEspecialEscolaPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza título e breadcrumb `Solicitação de Dieta Especial`", () => {
    expect(screen.queryAllByText("Solicitação de Dieta Especial")).toHaveLength(
      2,
    );
  });

  it("Preenche formulário com Aluno EOL e envia", async () => {
    const inputEolAluno = screen.getByTestId("input-codigo-eol-aluno");
    fireEvent.change(inputEolAluno, { target: { value: codigoEolAluno } });
    fireEvent.blur(inputEolAluno);

    await waitFor(() => {
      expect(screen.getByText("Solicitação: # 6EA2E")).toBeInTheDocument();
    });

    const InputNomePrescritor = screen.getByTestId("input-nome-prescritor");
    fireEvent.change(InputNomePrescritor, {
      target: { value: "Dr. Prescritor de Teste" },
    });
    expect(InputNomePrescritor).toHaveValue("Dr. Prescritor de Teste");

    const inputRegistroFuncionalPrescritor = screen.getByTestId(
      "input-registro-funcional-prescritor",
    );
    fireEvent.change(inputRegistroFuncionalPrescritor, {
      target: { value: "123456" },
    });
    expect(inputRegistroFuncionalPrescritor).toHaveValue("123456");

    const botaoAnexarArquivos = screen.getByText("Anexar").closest("button");
    expect(botaoAnexarArquivos).not.toBeDisabled();
    fireEvent.click(botaoAnexarArquivos);

    const inputFile = screen.getByTestId("input-laudo-anexo");

    const pdfFile = new File(["dummy pdf content"], "documento.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(inputFile, {
      target: { files: [pdfFile] },
    });

    expect(inputFile.files).toHaveLength(1);
    expect(inputFile.files[0].name).toBe("documento.pdf");

    await waitFor(() => {
      expect(screen.getByText("documento.pdf")).toBeInTheDocument();
    });

    const botaoEnviar = screen.getByText("Enviar").closest("button");
    mock.onPost("/solicitacoes-dieta-especial/").reply(201, {});
    fireEvent.click(botaoEnviar);

    await waitFor(() => {
      expect(
        screen.getByText("Solicitação realizada com sucesso."),
      ).toBeInTheDocument();
    });
  });

  it("Atualiza e deleta a foto do aluno", async () => {
    const inputEolAluno = screen.getByTestId("input-codigo-eol-aluno");
    fireEvent.change(inputEolAluno, { target: { value: codigoEolAluno } });
    fireEvent.blur(inputEolAluno);

    await waitFor(() => {
      expect(screen.getByText("Solicitação: # 6EA2E")).toBeInTheDocument();
    });

    const botaoAtualizarImagem = screen
      .getByText("Atualizar imagem")
      .closest("button");
    expect(botaoAtualizarImagem).not.toBeDisabled();

    fireEvent.click(botaoAtualizarImagem);

    const inputFile = screen.getByTestId("input-file-foto-aluno");

    const pngFile = new File(["dummy png content"], "imagem.png", {
      type: "image/png",
    });

    mock
      .onPost(`/alunos/${codigoEolAluno}/atualizar-foto/`)
      .reply(200, { data: "46eafe02-26d1-47f7-994e-22648028c04a" });
    mock.onGet(`/alunos/${codigoEolAluno}/ver-foto/`).replyOnce(200, {
      data: {
        codigo: "46eafe02-26d1-47f7-994e-22648028c04a",
        nome: "Screenshot from 2025-11-13 14-32-42.png",
        download: {
          item1:
            "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",
          item2: "image/png",
          item3: "Screenshot from 2025-11-13 14-32-42.png",
        },
        criadoRf: "7924488",
      },
    });

    fireEvent.change(inputFile, {
      target: { files: [pngFile] },
    });

    expect(inputFile.files).toHaveLength(1);
    expect(inputFile.files[0].name).toBe("imagem.png");

    await waitFor(() => {
      expect(
        screen.getByText("Foto atualizada com sucesso"),
      ).toBeInTheDocument();
    });

    const botaoDeletarImagem = screen
      .getByText("Deletar imagem")
      .closest("button");
    expect(botaoDeletarImagem).not.toBeDisabled();

    mock
      .onDelete(`/alunos/${codigoEolAluno}/deletar-foto/`)
      .reply(200, { data: true });
    window.confirm = jest.fn().mockImplementation(() => true);
    fireEvent.click(botaoDeletarImagem);

    await waitFor(() => {
      expect(screen.getByText("Foto deletada com sucesso")).toBeInTheDocument();
    });
  });
});
