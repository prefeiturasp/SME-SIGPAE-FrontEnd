import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModalHistorico from "src/components/Shareable/ModalHistorico/index";
import { dietaComHistorico } from "src/mocks/DietaEspecial/Relatorio/mockDietaComLogDeHistorico.jsx";

describe("Testa componete <ModalHistorico>", () => {
  const mockOnOk = jest.fn();
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ModalHistorico
            visible={true}
            onOk={mockOnOk}
            onCancel={jest.fn()}
            logs={dietaComHistorico.logs}
            getHistorico={() => dietaComHistorico.logs}
          />
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza o modal corretamente", async () => {
    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Fechar")).toBeInTheDocument();
    expect(screen.getByText("Usuário")).toBeInTheDocument();
    expect(screen.getByText("Ações")).toBeInTheDocument();
  });

  it("Renderiza lista de históricos", async () => {
    const historicoItems = document.querySelectorAll(".grid-item-log");
    expect(historicoItems.length).toBe(dietaComHistorico.logs.length);
    expect(screen.getAllByText("Solicitação Realiza...")).toHaveLength(1);
    expect(screen.getAllByText("CODAE autorizou")).toHaveLength(1);
    expect(screen.getAllByText("CODAE Atualizou o p...")).toHaveLength(7);
    expect(screen.getAllByText("SUPER USUARIO ESCOLA EMEF")).toHaveLength(1);
    expect(screen.getAllByText("Dieta Especial")).toHaveLength(8);
    expect(screen.getAllByText("26/06/2025")).toHaveLength(1);
    expect(screen.getAllByText("11/08/2025")).toHaveLength(8);
  });

  test("Exibe os detalhes do histórico para o status Solicitação Realizada", () => {
    const solictacaoRealizada = document.querySelectorAll(".grid-item-log")[0];
    fireEvent.click(solictacaoRealizada);

    const classeNomeFantasiaEmpresa = document.querySelector(
      ".nome-fantasia-empresa",
    );
    expect(classeNomeFantasiaEmpresa.textContent).toBe(
      "SUPER USUARIO ESCOLA EMEF",
    );
    expect(screen.getAllByText("26/06/2025")).toHaveLength(3);
    expect(screen.getAllByText("11:52:55")).toHaveLength(2);

    expect(screen.getByText("Solicitação Realizada")).toBeInTheDocument();
    expect(screen.getByText("RF: 8115257")).toBeInTheDocument();
    expect(screen.getByText("Data:")).toBeInTheDocument();
  });

  test("Exibe os detalhes do histórico para o status CODAE autorizou", () => {
    const solictacaoRealizada = document.querySelectorAll(".grid-item-log")[1];
    fireEvent.click(solictacaoRealizada);

    const classeNomeFantasiaEmpresa = document.querySelector(
      ".nome-fantasia-empresa",
    );
    expect(classeNomeFantasiaEmpresa.textContent).toBe("Dieta Especial");
    expect(screen.getAllByText("11/08/2025")).toHaveLength(10);
    expect(screen.getAllByText("14:27:16")).toHaveLength(2);

    expect(screen.getAllByText("CODAE autorizou")).toHaveLength(2);
    expect(screen.getByText("RF: 8107807")).toBeInTheDocument();
    expect(screen.getByText("Data:")).toBeInTheDocument();
  });

  test("Exibe os detalhes do histórico para o status CODAE Atualizou o protocolo: Relação por Diagnóstico", () => {
    const solictacaoRealizada = document.querySelectorAll(".grid-item-log")[4];
    fireEvent.click(solictacaoRealizada);

    const classeNomeFantasiaEmpresa = document.querySelector(
      ".nome-fantasia-empresa",
    );
    expect(classeNomeFantasiaEmpresa.textContent).toBe("Dieta Especial");
    expect(screen.getAllByText("11/08/2025")).toHaveLength(10);
    expect(screen.getAllByText("14:40:14")).toHaveLength(2);

    expect(screen.getAllByText("CODAE Atualizou o protocolo")).toHaveLength(1);
    expect(screen.getByText("RF: 8107807")).toBeInTheDocument();
    expect(screen.getByText("Data:")).toBeInTheDocument();

    expect(screen.getByText("Edições realizadas")).toBeInTheDocument();
    expect(screen.getByText("Relação por Diagnóstico")).toBeInTheDocument();
    expect(screen.getByText("ARGININEMIA")).toBeInTheDocument();
    expect(
      screen.getByText("ACIDOSE METABOLICA, ARGININEMIA"),
    ).toBeInTheDocument();
  });

  test("Exibe os detalhes do histórico para o status CODAE Atualizou o protocolo: Data de término", () => {
    const solictacaoRealizada = document.querySelectorAll(".grid-item-log")[5];
    fireEvent.click(solictacaoRealizada);

    const classeNomeFantasiaEmpresa = document.querySelector(
      ".nome-fantasia-empresa",
    );
    expect(classeNomeFantasiaEmpresa.textContent).toBe("Dieta Especial");
    expect(screen.getAllByText("11/08/2025")).toHaveLength(10);
    expect(screen.getAllByText("14:40:53")).toHaveLength(2);

    expect(screen.getAllByText("CODAE Atualizou o protocolo")).toHaveLength(1);
    expect(screen.getByText("RF: 8107807")).toBeInTheDocument();
    expect(screen.getByText("Data:")).toBeInTheDocument();

    expect(screen.getByText("Edições realizadas")).toBeInTheDocument();
    expect(screen.getByText("Data de término")).toBeInTheDocument();
    expect(
      screen.getByText("Com data de término 27/08/2025"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Com data de término 29/08/2025"),
    ).toBeInTheDocument();
  });

  test("Exibe os detalhes do histórico para o status CODAE Atualizou o protocolo: Classificação da Dieta", () => {
    const solictacaoRealizada = document.querySelectorAll(".grid-item-log")[6];
    fireEvent.click(solictacaoRealizada);

    const classeNomeFantasiaEmpresa = document.querySelector(
      ".nome-fantasia-empresa",
    );
    expect(classeNomeFantasiaEmpresa.textContent).toBe("Dieta Especial");
    expect(screen.getAllByText("11/08/2025")).toHaveLength(10);
    expect(screen.getAllByText("14:42:14")).toHaveLength(2);

    expect(screen.getAllByText("CODAE Atualizou o protocolo")).toHaveLength(1);
    expect(screen.getByText("RF: 8107807")).toBeInTheDocument();
    expect(screen.getByText("Data:")).toBeInTheDocument();

    expect(screen.getByText("Edições realizadas")).toBeInTheDocument();
    expect(screen.getByText("Classificação da Dieta")).toBeInTheDocument();
    expect(screen.getByText("Tipo A")).toBeInTheDocument();
    expect(screen.getByText("Tipo A ENTERAL")).toBeInTheDocument();
  });

  test("Fecha o modal quando o botão Fechar é clicado", () => {
    expect(screen.getByText("Fechar")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Fechar"));
    expect(mockOnOk).toHaveBeenCalled();
  });
});

describe("Testa o método getArquivoUrl no componente <ModalHistorico>", () => {
  const mockOnOk = jest.fn();
  const mockLogComDownload = {
    ...dietaComHistorico.logs[0],
    status_evento_explicacao: "Enviado pela UE",
    tipo_solicitacao_explicacao: "Solicitação de medição inicial",
    anexos: [
      { nome: "documento.pdf", arquivo_url: "http://exemplo.com/doc.pdf" },
    ],
  };

  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ModalHistorico
            visible={true}
            onOk={mockOnOk}
            onCancel={jest.fn()}
            logs={[mockLogComDownload]} // Usa apenas o log modificado
            getHistorico={() => [mockLogComDownload]}
          />
        </MemoryRouter>,
      );
    });
  });

  it("Exibe botão de download quando há arquivo PDF para medição inicial", () => {
    const itemLog = document.querySelectorAll(".grid-item-log")[0];
    fireEvent.click(itemLog);
    expect(screen.getByText("Formulário PDF")).toBeInTheDocument();
  });

  it("Não exibe botão de download para status inválido", () => {
    const mockLogSemDownload = {
      ...mockLogComDownload,
      status_evento_explicacao: "Status Inválido",
    };
    render(
      <MemoryRouter>
        <ModalHistorico
          visible={true}
          onOk={mockOnOk}
          onCancel={jest.fn()}
          logs={[mockLogSemDownload]}
          getHistorico={() => [mockLogSemDownload]}
        />
      </MemoryRouter>,
      { container: document.body },
    );

    const itemLog = document.querySelectorAll(".grid-item-log")[0];
    fireEvent.click(itemLog);

    expect(screen.queryByText("Formulário PDF")).not.toBeInTheDocument();
  });
});
