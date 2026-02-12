import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Listagem from "../components/Listagem";
import { CronogramaRelatorio } from "../interfaces";

describe("Componente Listagem - Relatório Cronograma", () => {
  const mockCronogramas: CronogramaRelatorio[] = [
    {
      uuid: "1",
      numero: "CRONO001",
      produto: "Arroz Integral",
      empresa: "EMPRESA A",
      qtd_total_programada: 1000,
      armazem: "Armazém Central",
      status: "Em andamento",
      marca: "Marca X",
      custo_unitario_produto: 5,
      etapas: [
        {
          uuid: "etapa1",
          etapa: "Entrega",
          parte: "1/3",
          data_programada: "2023-06-15",
          quantidade: "300",
          total_embalagens: "30",
          desvinculada_recebimento: true,
          numero_empenho: "",
          qtd_total_empenho: null,
        },
        {
          uuid: "etapa2",
          etapa: "Entrega",
          parte: "2/3",
          data_programada: "2023-06-22",
          quantidade: "400",
          total_embalagens: "40",
          desvinculada_recebimento: true,
          numero_empenho: "",
          qtd_total_empenho: null,
        },
      ],
    },
    {
      uuid: "2",
      numero: "CRONO002",
      produto: "Feijão Carioca",
      empresa: "EMPRESA B",
      qtd_total_programada: 800,
      armazem: "Armazém Norte",
      status: "Concluído",
      marca: "Marca Y",
      custo_unitario_produto: 7,
      etapas: [
        {
          uuid: "etapa3",
          etapa: "Entrega",
          parte: "1/1",
          data_programada: "2023-05-10",
          quantidade: "800",
          total_embalagens: "80",
          desvinculada_recebimento: true,
          numero_empenho: "",
          qtd_total_empenho: null,
        },
      ],
    },
  ];

  it("deve renderizar a lista de cronogramas com os dados principais", () => {
    const setAtivos = jest.fn();
    render(
      <Listagem
        objetos={mockCronogramas}
        ativos={[]}
        setAtivos={setAtivos}
        setCarregando={jest.fn()}
      />,
    );

    expect(screen.getByText("CRONO001")).toBeInTheDocument();
    expect(screen.getByText("Arroz Integral")).toBeInTheDocument();
    expect(screen.getByText("EMPRESA A")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("Armazém Central")).toBeInTheDocument();
    expect(screen.getByText("Em andamento")).toBeInTheDocument();

    expect(screen.getByText("CRONO002")).toBeInTheDocument();
    expect(screen.getByText("Feijão Carioca")).toBeInTheDocument();
    expect(screen.getByText("EMPRESA B")).toBeInTheDocument();
  });

  it("deve exibir tooltip com nome completo do produto ao fazer hover", async () => {
    const setAtivos = jest.fn();
    render(
      <Listagem
        objetos={mockCronogramas}
        ativos={[]}
        setAtivos={setAtivos}
        setCarregando={jest.fn()}
      />,
    );

    const nomeProduto = screen.getByText("Arroz Integral");

    fireEvent.mouseEnter(nomeProduto);

    await waitFor(() => {
      const tooltip = document.querySelector(".ant-tooltip-inner");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent("Arroz Integral");
    });
  });

  it("deve exibir ícone de expandir/recolher para cada cronograma", () => {
    const setAtivos = jest.fn();
    render(
      <Listagem
        objetos={mockCronogramas}
        ativos={[]}
        setAtivos={setAtivos}
        setCarregando={jest.fn()}
      />,
    );

    const iconesExpandir = screen.getAllByTestId("icone-expandir");
    expect(iconesExpandir).toHaveLength(mockCronogramas.length);
    expect(iconesExpandir[0]).toHaveClass("fa-chevron-down");
  });

  it("deve expandir os detalhes quando clicado no ícone", () => {
    const setAtivos = jest.fn();
    render(
      <Listagem
        objetos={mockCronogramas}
        ativos={[]}
        setAtivos={setAtivos}
        setCarregando={jest.fn()}
      />,
    );

    const iconeExpandir = screen.getAllByTestId("icone-expandir")[0];
    fireEvent.click(iconeExpandir);

    expect(setAtivos).toHaveBeenCalledWith(["1"]);
  });

  it("deve exibir detalhes do cronograma quando expandido", () => {
    const setAtivos = jest.fn();
    render(
      <Listagem
        objetos={mockCronogramas}
        ativos={["1"]}
        setAtivos={setAtivos}
        setCarregando={jest.fn()}
      />,
    );

    expect(screen.getByText("Marca:")).toBeInTheDocument();
    expect(screen.getByText("Marca X")).toBeInTheDocument();
    expect(screen.getByText("Custo Unitário:")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    // Verifica se as etapas são exibidas
    expect(screen.getByText("Etapa")).toBeInTheDocument();
    expect(screen.getByText("1/3")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("deve recolher os detalhes quando clicado no ícone de um cronograma já expandido", () => {
    const setAtivos = jest.fn();
    render(
      <Listagem
        objetos={mockCronogramas}
        ativos={["1"]}
        setAtivos={setAtivos}
        setCarregando={jest.fn()}
      />,
    );

    const iconeRecolher = screen.getAllByTestId("icone-expandir")[0];
    fireEvent.click(iconeRecolher);

    expect(setAtivos).toHaveBeenCalledWith([]);
  });

  it("não deve exibir detalhes de cronogramas não expandidos", () => {
    const setAtivos = jest.fn();
    render(
      <Listagem
        objetos={mockCronogramas}
        ativos={[]}
        setAtivos={setAtivos}
        setCarregando={jest.fn()}
      />,
    );

    expect(screen.queryByText("Marca:")).not.toBeInTheDocument();
    expect(screen.queryByText("Etapa")).not.toBeInTheDocument();
  });

  it("deve formatar corretamente os dados numéricos", () => {
    const setAtivos = jest.fn();
    render(
      <Listagem
        objetos={mockCronogramas}
        ativos={["1"]}
        setAtivos={setAtivos}
        setCarregando={jest.fn()}
      />,
    );

    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
  });

  it("deve exibir todas as etapas quando o cronograma estiver expandido", () => {
    const setAtivos = jest.fn();
    render(
      <Listagem
        objetos={mockCronogramas}
        ativos={["1"]}
        setAtivos={setAtivos}
        setCarregando={jest.fn()}
      />,
    );

    const etapas = screen.getAllByText("Entrega");
    expect(etapas).toHaveLength(2);
    expect(screen.getByText("1/3")).toBeInTheDocument();
    expect(screen.getByText("2/3")).toBeInTheDocument();
  });

  describe("TagLeveLeite", () => {
    it("deve exibir a tag LEVE LEITE - PLL quando programa_leve_leite for true", () => {
      const mockComTag = [
        {
          ...mockCronogramas[0],
          programa_leve_leite: true,
        },
      ];
      const setAtivos = jest.fn();
      render(
        <Listagem
          objetos={mockComTag}
          ativos={[]}
          setAtivos={setAtivos}
          setCarregando={jest.fn()}
        />,
      );

      expect(screen.getByText("LEVE LEITE - PLL")).toBeInTheDocument();
    });

    it("não deve exibir a tag LEVE LEITE - PLL quando programa_leve_leite for false ou undefined", () => {
      const mockSemTag = [
        {
          ...mockCronogramas[1],
          programa_leve_leite: false,
        },
      ];
      const setAtivos = jest.fn();
      render(
        <Listagem
          objetos={mockSemTag}
          ativos={[]}
          setAtivos={setAtivos}
          setCarregando={jest.fn()}
        />,
      );

      expect(screen.queryByText("LEVE LEITE - PLL")).not.toBeInTheDocument();
    });
  });
});
