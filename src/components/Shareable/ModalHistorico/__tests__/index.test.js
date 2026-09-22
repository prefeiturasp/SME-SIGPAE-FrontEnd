import { act, fireEvent, render, screen, within } from "@testing-library/react";
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

describe("ModalHistorico com snapshot dos dados do produto", () => {
  const criarLogProduto = ({ dadosProduto = {}, log = {} } = {}) => ({
    uuid: "6276f210-b30c-41ff-8efc-742d2d9cc0ae",
    anexos: [],
    status_evento_explicacao: "Solicitação Realizada",
    tipo_solicitacao_explicacao: "Homologação de Produto",
    usuario: {
      uuid: "13b42bbc-8cdd-44b8-9344-5dad81246b5b",
      cpf: "82335284045",
      nome: "Terceirizada",
      registro_funcional: null,
      tipo_usuario: "terceirizada",
    },
    criado_em: "16/09/2026 17:22:41",
    descricao: "Homologação #110C2",
    justificativa:
      "<p>Alterações realizadas</p><p>Campo: Componentes do produto</p><ul><li>De: Componente anterior</li><li>Para: Componente atualizado</li></ul>",
    resposta_sim_nao: false,
    dados_produto: {
      produto_uuid: "9f27d693-15e6-4b5c-a250-dce592a90f8e",
      empresa: "ALIMENTAR GESTÃO DE SERVIÇOS LTDA",
      criado_em: "16/09/2026 17:22:41",
      produto: "TESTE PRODUTO 1",
      marca: "ITALAC",
      fabricante: "VIGOR",
      eh_para_alunos_com_dieta: true,
      componentes: "Componente atualizado",
      perfil_responsavel: "ADMINISTRADOR_EMPRESA",
      nome_instituicao: "ALIMENTAR GESTÃO DE SERVIÇOS LTDA",
      ...dadosProduto,
    },
    ...log,
  });

  const renderizarModal = (logs) =>
    render(
      <MemoryRouter>
        <ModalHistorico
          visible
          onOk={jest.fn()}
          onCancel={jest.fn()}
          logs={logs}
          getHistorico={() => logs}
        />
      </MemoryRouter>,
    );

  it("exibe o snapshot completo do produto referente ao log selecionado", () => {
    renderizarModal([criarLogProduto()]);

    fireEvent.click(screen.getByTestId("log-item-0"));

    const dadosProduto = document.querySelector(".dados-do-produto-historico");

    expect(dadosProduto).toBeInTheDocument();
    expect(within(dadosProduto).getByText("Empresa:")).toBeInTheDocument();
    expect(
      within(dadosProduto).getByText("ALIMENTAR GESTÃO DE SERVIÇOS LTDA"),
    ).toBeInTheDocument();
    expect(within(dadosProduto).getByText("Criado em:")).toBeInTheDocument();
    expect(
      within(dadosProduto).getByText("16/09/2026 - 17:22:41"),
    ).toBeInTheDocument();
    expect(
      within(dadosProduto).getByText("TESTE PRODUTO 1"),
    ).toBeInTheDocument();
    expect(within(dadosProduto).getByText("ITALAC")).toBeInTheDocument();
    expect(within(dadosProduto).getByText("VIGOR")).toBeInTheDocument();
    expect(within(dadosProduto).getByText("SIM")).toBeInTheDocument();
    expect(
      within(dadosProduto).getByText("Componente atualizado"),
    ).toBeInTheDocument();
  });

  it("exibe o snapshot correspondente a cada movimentação", () => {
    const primeiroLog = criarLogProduto({
      dadosProduto: {
        componentes: "Componentes da primeira movimentação",
      },
    });
    const segundoLog = criarLogProduto({
      dadosProduto: {
        componentes: "Componentes da segunda movimentação",
      },
      log: {
        uuid: "8ee408ec-10de-422b-bc39-7952ac4d7aeb",
        criado_em: "17/09/2026 09:30:00",
      },
    });
    renderizarModal([primeiroLog, segundoLog]);

    fireEvent.click(screen.getByTestId("log-item-0"));
    expect(
      screen.getByText("Componentes da primeira movimentação"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("log-item-1"));
    expect(
      screen.queryByText("Componentes da primeira movimentação"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Componentes da segunda movimentação"),
    ).toBeInTheDocument();
  });

  it("exibe NÃO quando o produto não é destinado à dieta especial", () => {
    renderizarModal([
      criarLogProduto({
        dadosProduto: { eh_para_alunos_com_dieta: false },
      }),
    ]);

    fireEvent.click(screen.getByTestId("log-item-0"));

    expect(screen.getByText("NÃO")).toBeInTheDocument();
  });

  it("exibe a alteração registrada e aplica o espaçamento somente ao snapshot", () => {
    renderizarModal([criarLogProduto()]);

    fireEvent.click(screen.getByTestId("log-item-0"));

    const justificativa = document.querySelector(
      ".log-selecionado-justificativa-valor",
    );

    expect(justificativa).toHaveTextContent("Alterações realizadas");
    expect(justificativa).toHaveTextContent("Campo: Componentes do produto");
    expect(justificativa).toHaveTextContent("De: Componente anterior");
    expect(justificativa).toHaveTextContent("Para: Componente atualizado");
    expect(
      document.querySelector(".preenchimento-dados-produto"),
    ).toContainElement(justificativa);
  });

  it("preserva a apresentação legada quando o log não possui snapshot", () => {
    const logLegado = criarLogProduto({
      log: {
        dados_produto: null,
        justificativa: "Justificativa do log legado",
      },
    });
    renderizarModal([logLegado]);

    fireEvent.click(screen.getByTestId("log-item-0"));

    expect(screen.getByText("CPF: 82335284045")).toBeInTheDocument();
    expect(screen.getByText("Data:")).toBeInTheDocument();
    expect(screen.getAllByText("16/09/2026")).toHaveLength(3);
    expect(
      document.querySelector(".dados-do-produto-historico"),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector(".preenchimento-dados-produto"),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector(".log-selecionado-justificativa-valor"),
    ).not.toBeInTheDocument();
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
