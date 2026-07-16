import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  ACOMPANHAMENTO_DE_LANCAMENTOS,
  CRONOGRAMA_ENTREGA,
  FICHA_RECEBIMENTO,
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PAINEL_FICHAS_TECNICAS,
  PAINEL_LAYOUT_EMBALAGEM,
  PAINEL_RELATORIOS_FISCALIZACAO,
  PRE_RECEBIMENTO,
  RECEBIMENTO,
  SUPERVISAO,
  TERCEIRIZADAS,
  PAINEL_APROVACOES,
  SOLICITACAO_ALTERACAO_CRONOGRAMA,
} from "src/configs/constants";
import {
  PERFIL,
  TIPO_PERFIL,
  TIPO_SERVICO,
  MODULO_GESTAO,
} from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import PainelInicial from "../PainelInicial";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("src/constants/config", () => ({
  ...jest.requireActual("src/constants/config"),
  ENVIRONMENT: "development",
}));

describe("PainelInicial - Navegação por perfil", () => {
  const perfis = [
    {
      nome: "CODAE_GESTAO_ALIMENTACAO",
      localStorage: {
        perfil: PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
        tipo_perfil: TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      },
      expectedRoute: `/medicao-inicial/${ACOMPANHAMENTO_DE_LANCAMENTOS}`,
    },
    {
      nome: "EMPRESA_TERCEIRIZADA",
      localStorage: {
        perfil: PERFIL.USUARIO_EMPRESA,
        tipo_perfil: TIPO_PERFIL.TERCEIRIZADA,
        tipo_servico: TIPO_SERVICO.TERCEIRIZADA,
      },
      expectedRoute: `/medicao-inicial/${ACOMPANHAMENTO_DE_LANCAMENTOS}`,
    },
    {
      nome: "SUPERVISAO_NUTRICAO",
      localStorage: {
        perfil: PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO,
        tipo_perfil: TIPO_PERFIL.SUPERVISAO_NUTRICAO,
      },
      expectedRoute: `/medicao-inicial/${ACOMPANHAMENTO_DE_LANCAMENTOS}`,
    },
  ];

  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it.each(perfis)(
    "deve navegar para a rota correta ao clicar em Medição Inicial - Perfil $nome",
    async ({ localStorage: ls, expectedRoute }) => {
      Object.entries(ls).forEach(([key, value]) =>
        localStorage.setItem(key, value),
      );

      render(
        <MemoryRouter>
          <PainelInicial />
        </MemoryRouter>,
      );

      const medicaoInicialCard = screen.getByText("Medição Inicial");
      expect(medicaoInicialCard).toBeInTheDocument();

      fireEvent.click(medicaoInicialCard);

      expect(mockNavigate).toHaveBeenCalledWith(expectedRoute);
    },
  );

  it("não deve exibir o card de Medição Inicial para perfis não permitidos", () => {
    localStorage.setItem("perfil", "PERFIL_NAO_PERMITIDO");
    localStorage.setItem("tipo_perfil", "TIPO_NAO_PERMITIDO");

    render(
      <MemoryRouter>
        <PainelInicial />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Medição Inicial")).not.toBeInTheDocument();
  });
});

describe("PainelInicial - Perfil Fornecedor", () => {
  beforeEach(() => {
    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.clear();
    mockNavigate.mockClear();
    localStorage.setItem("perfil", PERFIL.USUARIO_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.FORNECEDOR);

    render(
      <MemoryRouter>
        <PainelInicial />
      </MemoryRouter>,
    );
  });

  it("exibe todos os cards do fornecedor", () => {
    expect(screen.getByText("Cronograma de Entrega")).toBeInTheDocument();
    expect(screen.getByText("Ficha Técnica")).toBeInTheDocument();
    expect(screen.getByText("Documentos de Recebimento")).toBeInTheDocument();
    expect(screen.getByText("Alterações de Cronograma")).toBeInTheDocument();
    expect(screen.getByText("Layout de Embalagem")).toBeInTheDocument();
  });

  it("navega para Cronograma de Entrega ao clicar no card", () => {
    fireEvent.click(screen.getByText("Cronograma de Entrega"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "pre-recebimento/cronograma-entrega",
    );
  });

  it("navega para Ficha Técnica ao clicar no card", () => {
    fireEvent.click(screen.getByText("Ficha Técnica"));
    expect(mockNavigate).toHaveBeenCalledWith("pre-recebimento/ficha-tecnica");
  });

  it("navega para Documentos de Recebimento ao clicar no card", () => {
    fireEvent.click(screen.getByText("Documentos de Recebimento"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "pre-recebimento/documentos-recebimento",
    );
  });

  it("navega para Alterações de Cronograma ao clicar no card", () => {
    fireEvent.click(screen.getByText("Alterações de Cronograma"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "pre-recebimento/solicitacao-alteracao-cronograma-fornecedor",
    );
  });

  it("navega para Layout de Embalagem ao clicar no card", () => {
    fireEvent.click(screen.getByText("Layout de Embalagem"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "pre-recebimento/layout-embalagem",
    );
  });

  it("não exibe cards de outros módulos", () => {
    expect(screen.queryByText("Gestão de Alimentação")).not.toBeInTheDocument();
    expect(screen.queryByText("Dieta Especial")).not.toBeInTheDocument();
    expect(screen.queryByText("Gestão de Produto")).not.toBeInTheDocument();
    expect(screen.queryByText("Medição Inicial")).not.toBeInTheDocument();
  });
});

describe("PainelInicial - Atalhos por perfil", () => {
  const atalhosDilogQualidade = [
    {
      titulo: "Cronograma de Entrega",
      rota: `${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`,
    },
    {
      titulo: "Calendário de Cronogramas",
      rota: `${PRE_RECEBIMENTO}/calendario-cronograma`,
    },
    {
      titulo: "Layout de Embalagem",
      rota: `${PRE_RECEBIMENTO}/${PAINEL_LAYOUT_EMBALAGEM}`,
    },
    {
      titulo: "Documentos de Recebimento",
      rota: `${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
    },
    {
      titulo: "Fichas Técnicas",
      rota: `${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`,
    },
    {
      titulo: "Ficha de Recebimento",
      rota: `${RECEBIMENTO}/${FICHA_RECEBIMENTO}`,
    },
  ];

  const atalhosDilogDiretoria = [
    {
      titulo: "Painel de Aprovações",
      rota: `${PRE_RECEBIMENTO}/${PAINEL_APROVACOES}`,
    },
    {
      titulo: "Cronograma de Entrega",
      rota: `${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`,
    },
    {
      titulo: "Verificar Alterações de Cronograma",
      rota: `${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`,
    },
    {
      titulo: "Calendário de Cronogramas",
      rota: `${PRE_RECEBIMENTO}/calendario-cronograma`,
    },
    {
      titulo: "Fichas Técnicas",
      rota: `${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`,
    },
    {
      titulo: "Ficha de Recebimento",
      rota: `${RECEBIMENTO}/${FICHA_RECEBIMENTO}`,
    },
  ];

  const renderPainelInicial = (perfil) => {
    localStorage.setItem("perfil", perfil);

    render(
      <MemoryRouter>
        <PainelInicial />
      </MemoryRouter>,
    );
  };

  const getAtalhoPorTitulo = (titulo) => {
    const atalhos = screen.getAllByText(titulo);

    return atalhos[atalhos.length - 1];
  };

  beforeEach(() => {
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
    });

    localStorage.clear();
    mockNavigate.mockClear();
  });

  it("exibe e navega para o Calendário de Cronogramas", () => {
    renderPainelInicial(PERFIL.ADMINISTRADOR_CODAE_GABINETE);

    const calendarioCronogramas = screen.getByText("Calendário de Cronogramas");

    expect(calendarioCronogramas).toBeInTheDocument();

    fireEvent.click(calendarioCronogramas);

    expect(mockNavigate).toHaveBeenCalledWith(
      `${PRE_RECEBIMENTO}/calendario-cronograma`,
    );
  });

  it("exibe e navega para o Calendário Ponto a Ponto", () => {
    renderPainelInicial(PERFIL.ADMINISTRADOR_CODAE_GABINETE);

    const calendarioPontoAPonto = screen.getByText("Calendário Ponto a Ponto");

    expect(calendarioPontoAPonto).toBeInTheDocument();

    fireEvent.click(calendarioPontoAPonto);

    expect(mockNavigate).toHaveBeenCalledWith(
      `${PRE_RECEBIMENTO}/calendario-cronograma-ponto-a-ponto-semanal`,
    );
  });

  it("exibe os atalhos da DILOG Qualidade", () => {
    renderPainelInicial(PERFIL.DILOG_QUALIDADE);

    atalhosDilogQualidade.forEach(({ titulo }) => {
      expect(getAtalhoPorTitulo(titulo)).toBeInTheDocument();
    });
  });

  it.each(atalhosDilogQualidade)(
    "navega para a rota correta ao clicar em $titulo",
    ({ titulo, rota }) => {
      renderPainelInicial(PERFIL.DILOG_QUALIDADE);

      fireEvent.click(getAtalhoPorTitulo(titulo));

      expect(mockNavigate).toHaveBeenCalledWith(rota);
    },
  );

  it("exibe os atalhos da DILOG Diretoria", () => {
    renderPainelInicial(PERFIL.DILOG_DIRETORIA);

    atalhosDilogDiretoria.forEach(({ titulo }) => {
      expect(getAtalhoPorTitulo(titulo)).toBeInTheDocument();
    });
  });

  it.each(atalhosDilogDiretoria)(
    "navega para a rota correta da DILOG Diretoria ao clicar em $titulo",
    ({ titulo, rota }) => {
      renderPainelInicial(PERFIL.DILOG_DIRETORIA);

      fireEvent.click(getAtalhoPorTitulo(titulo));

      expect(mockNavigate).toHaveBeenCalledWith(rota);
    },
  );
});

describe("PainelInicial - Redirecionamentos dos demais cards", () => {
  const renderPainelInicial = () => {
    render(
      <MemoryRouter>
        <PainelInicial />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
    });

    localStorage.clear();
    mockNavigate.mockClear();
  });

  it("navega para o painel de Gestão de Alimentação", () => {
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    renderPainelInicial();

    fireEvent.click(screen.getByText("Gestão de Alimentação"));

    expect(mockNavigate).toHaveBeenCalledWith("/painel-gestao-alimentacao");
  });

  it("navega para o painel de Dieta Especial", () => {
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    renderPainelInicial();

    fireEvent.click(screen.getByText("Dieta Especial"));

    expect(mockNavigate).toHaveBeenCalledWith("/painel-dieta-especial");
  });

  it("navega para o painel de Gestão de Produto", () => {
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    renderPainelInicial();

    fireEvent.click(screen.getByText("Gestão de Produto"));

    expect(mockNavigate).toHaveBeenCalledWith("/painel-gestao-produto");
  });

  it("navega para as entregas da DRE", () => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);

    renderPainelInicial();

    fireEvent.click(screen.getByText("Abastecimento"));

    expect(mockNavigate).toHaveBeenCalledWith("/logistica/entregas-dre");
  });

  it("navega para a conferência de entrega da escola", () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.ABASTECIMENTO);

    renderPainelInicial();

    fireEvent.click(screen.getByText("Abastecimento"));

    expect(mockNavigate).toHaveBeenCalledWith("/logistica/conferir-entrega");
  });

  it("navega para o painel de relatórios de fiscalização", () => {
    localStorage.setItem("perfil", PERFIL.COORDENADOR_SUPERVISAO_NUTRICAO);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.SUPERVISAO_NUTRICAO);

    renderPainelInicial();

    fireEvent.click(screen.getByText("Supervisão Terceirizadas"));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/${SUPERVISAO}/${TERCEIRIZADAS}/${PAINEL_RELATORIOS_FISCALIZACAO}`,
    );
  });
});
