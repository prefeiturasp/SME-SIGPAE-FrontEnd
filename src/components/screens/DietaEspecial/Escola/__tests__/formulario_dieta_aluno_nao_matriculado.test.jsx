import "@testing-library/jest-dom";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { DietaEspecialEscolaPage } from "src/pages/Escola/DietaEspecial/DietaEspecialEscolaPage";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

describe("Testa Formulário de Solicitação de Dieta Especial com Aluno Não Matriculado - Recreio nas Férias", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);

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

  it("renderiza Nº de Matriculados`", () => {
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar",
      ),
    ).toBeInTheDocument();
  });

  it("Preenche formulário com Aluno Não Matriculado e envia", async () => {
    const checkboxAlunoNaoMatriculado = screen.getByTestId(
      "checkbox-aluno-nao-matriculado",
    );
    fireEvent.click(checkboxAlunoNaoMatriculado);

    await waitFor(() => {
      expect(screen.getByText("Cód. EOL da Escola")).toBeInTheDocument();
    });

    const checkboxDietaParaRecreioNasFerias = screen.getByTestId(
      "checkbox-dieta-para-recreio-nas-ferias",
    );
    fireEvent.click(checkboxDietaParaRecreioNasFerias);

    await waitFor(() => {
      expect(
        screen.getByText("Alteração válida pelo período:"),
      ).toBeInTheDocument();
    });

    const inputCPFAluno = screen.getByTestId("input-cpf-aluno");
    fireEvent.change(inputCPFAluno, { target: { value: "123.456.789-09" } });
    expect(inputCPFAluno).toHaveValue("123.456.789-09");

    const inputNomeCompletoAluno = screen.getByTestId(
      "input-nome-completo-aluno",
    );
    fireEvent.change(inputNomeCompletoAluno, {
      target: { value: "Aluno de Teste" },
    });
    expect(inputNomeCompletoAluno).toHaveValue("Aluno de Teste");

    const divDataNascimentoAluno = screen.getByTestId(
      "div-data-nascimento-aluno",
    );
    const inputDataNascimentoAluno =
      divDataNascimentoAluno.querySelector("input");
    fireEvent.change(inputDataNascimentoAluno, {
      target: { value: "18/09/2025" },
    });
    expect(inputDataNascimentoAluno).toHaveValue("18/09/2025");

    const inputCPFDoResponsavel = screen.getByTestId("input-cpf-responsavel");
    fireEvent.change(inputCPFDoResponsavel, {
      target: { value: "987.654.321-00" },
    });
    expect(inputCPFDoResponsavel).toHaveValue("987.654.321-00");

    const inputNomeCompletoResponsavel = screen.getByTestId(
      "input-nome-completo-responsavel",
    );
    fireEvent.change(inputNomeCompletoResponsavel, {
      target: { value: "Responsável de Teste" },
    });
    expect(inputNomeCompletoResponsavel).toHaveValue("Responsável de Teste");

    const divDataInicio = screen.getByTestId("div-data-inicio");
    const inputDataInicio = divDataInicio.querySelector("input");
    fireEvent.change(inputDataInicio, {
      target: { value: "17/09/2025" },
    });
    expect(inputDataInicio).toHaveValue("17/09/2025");

    const divDataTermino = screen.getByTestId("div-data-termino");
    const inputDataTermino = divDataTermino.querySelector("input");
    fireEvent.change(inputDataTermino, {
      target: { value: "18/09/2025" },
    });
    expect(inputDataTermino).toHaveValue("18/09/2025");

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
});
