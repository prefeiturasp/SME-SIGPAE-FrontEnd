import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AgendaSemanalView from "../AgendaSemanalView";
import moment from "moment";
import "moment/locale/pt-br";

jest.mock("../helpers", () => ({
  ehMesmoDia: jest.fn(
    (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate(),
  ),
}));

// Helpers para criar eventos de teste

const criarEventoProduto = (uuid: string, title: string, date: Date) => ({
  title,
  start: date,
  end: date,
  allDay: true,
  objeto: {
    uuid,
    nome_produto: title,
    uuid_cronograma: "cron-1",
    nome_fornecedor: "Fornecedor A",
    numero_cronograma: "123",
    numero_empenho: "456",
    quantidade: 100,
    unidade_medida: "kg",
    data_programada: "01/01/2025",
    status: "ativo",
    programa_leve_leite: false,
  },
});

const criarEventoInterrupcao = (
  uuid: string,
  title: string,
  date: Date,
  motivo = "FERIADO",
) => ({
  uuid,
  title,
  start: date,
  end: date,
  allDay: true,
  isInterrupcao: true as const,
  motivo_display: motivo,
  descricao_motivo: "Descrição teste",
  tipo_calendario: "PONTO_A_PONTO",
  tipo_calendario_display: "Ponto a Ponto",
});

const localizadorMock = {
  add: (date: Date, amount: number, _unit: string) => {
    const d = new Date(date);
    d.setDate(d.getDate() + amount);
    return d;
  },
  format: (date: Date, fmt: string) => moment(date).format(fmt),
};

describe("AgendaSemanalView", () => {
  const dataBase = new Date(2025, 6, 7); // segunda, 7 julho 2025

  describe("Renderização", () => {
    it("deve renderizar 7 linhas, uma para cada dia útil (seg a sex)", () => {
      render(
        <AgendaSemanalView
          date={dataBase}
          events={[]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const linhas = document.querySelectorAll(".agenda-row");
      expect(linhas).toHaveLength(7);
    });

    it("deve pular sábado e domingo na sequência de dias", () => {
      const sexta = new Date(2025, 6, 11);

      render(
        <AgendaSemanalView
          date={sexta}
          events={[]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const nomesDias = document.querySelectorAll(".agenda-day-name");
      expect(nomesDias[0].textContent).toMatch(/sexta/i);
      expect(nomesDias[1].textContent).toMatch(/segunda/i);
    });

    it("deve exibir cabeçalho de data em duas linhas: nome do dia e dia + mês", () => {
      render(
        <AgendaSemanalView
          date={dataBase}
          events={[]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const nomeDia = document.querySelector(".agenda-day-name");
      const dataDia = document.querySelector(".agenda-day-date");

      expect(nomeDia).toBeInTheDocument();
      expect(dataDia).toBeInTheDocument();
      expect(nomeDia!.textContent).toMatch(/segunda/i);
      expect(dataDia!.textContent).toMatch(/07 de jul/i);
    });

    it("deve capitalizar a primeira letra do nome do dia da semana", () => {
      render(
        <AgendaSemanalView
          date={dataBase}
          events={[]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const nomeDia = document.querySelector(".agenda-day-name");
      const texto = nomeDia!.textContent!;
      expect(texto[0]).toBe(texto[0].toUpperCase());
    });

    it("deve mostrar indicador '---' quando não há eventos em um dia", () => {
      render(
        <AgendaSemanalView
          date={dataBase}
          events={[]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const indicadoresVazios = document.querySelectorAll(".agenda-empty");
      expect(indicadoresVazios).toHaveLength(7);
      indicadoresVazios.forEach((el) => {
        expect(el.textContent).toBe("---");
      });
    });

    it("deve renderizar tags de produto com texto em maiúsculas", () => {
      const eventos = [
        criarEventoProduto("prod-1", "Arroz Integral", dataBase),
      ];

      render(
        <AgendaSemanalView
          date={dataBase}
          events={eventos}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const tagProduto = document.querySelector(".agenda-product-tag");
      expect(tagProduto).toBeInTheDocument();
      expect(tagProduto!.textContent).toBe("ARROZ INTEGRAL");
      expect(tagProduto).toHaveClass("agenda-product-tag");
    });

    it("deve renderizar tags de interrupção com classe correta", () => {
      const eventos = [criarEventoInterrupcao("int-1", "FERIADO", dataBase)];

      render(
        <AgendaSemanalView
          date={dataBase}
          events={eventos}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const tag = document.querySelector(".agenda-interrupcao-tag");
      expect(tag).toBeInTheDocument();
      expect(tag!.textContent).toContain("FERIADO");
    });

    it("deve incluir descricao_motivo na tag de interrupção quando presente", () => {
      const interrupcao = criarEventoInterrupcao("int-1", "FERIADO", dataBase);
      interrupcao.descricao_motivo = "Dia do Trabalhador";

      render(
        <AgendaSemanalView
          date={dataBase}
          events={[interrupcao]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const tag = document.querySelector(".agenda-interrupcao-tag");
      expect(tag!.textContent).toContain("Dia do Trabalhador");
    });

    it("deve listar interrupções antes dos produtos no mesmo dia", () => {
      const eventos = [
        criarEventoProduto("prod-1", "Produto A", dataBase),
        criarEventoInterrupcao("int-1", "FERIADO", dataBase),
        criarEventoProduto("prod-2", "Produto B", dataBase),
      ];

      render(
        <AgendaSemanalView
          date={dataBase}
          events={eventos}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const tags = document.querySelectorAll(
        ".agenda-day-content > div:not(.agenda-empty)",
      );

      expect(tags[0]).toHaveClass("agenda-interrupcao-tag");
      expect(tags[1]).toHaveClass("agenda-product-tag");
      expect(tags[2]).toHaveClass("agenda-product-tag");
    });

    it("deve mostrar múltiplos produtos no mesmo dia", () => {
      const eventos = [
        criarEventoProduto("p1", "Arroz", dataBase),
        criarEventoProduto("p2", "Feijão", dataBase),
        criarEventoProduto("p3", "Macarrão", dataBase),
      ];

      render(
        <AgendaSemanalView
          date={dataBase}
          events={eventos}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const tags = document.querySelectorAll(".agenda-product-tag");
      expect(tags).toHaveLength(3);
    });

    it("não deve mostrar tag de produto em dia diferente do evento", () => {
      const outraData = new Date(2025, 6, 8);
      const eventos = [criarEventoProduto("prod-1", "Arroz", outraData)];

      render(
        <AgendaSemanalView
          date={dataBase}
          events={eventos}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const linhas = document.querySelectorAll(".agenda-row");
      const conteudoSegunda = linhas[0].querySelector(".agenda-day-content");
      const conteudoTerca = linhas[1].querySelector(".agenda-day-content");

      expect(
        conteudoSegunda!.querySelector(".agenda-empty"),
      ).toBeInTheDocument();
      expect(
        conteudoTerca!.querySelector(".agenda-product-tag"),
      ).toBeInTheDocument();
    });
  });

  describe("Interações", () => {
    it("deve chamar onSelectEvent ao clicar em uma tag de produto", async () => {
      const onSelectEvent = jest.fn();
      const evento = criarEventoProduto("prod-1", "Arroz", dataBase);

      render(
        <AgendaSemanalView
          date={dataBase}
          events={[evento]}
          localizer={localizadorMock}
          length={7}
          onSelectEvent={onSelectEvent}
        />,
      );

      const user = userEvent.setup();
      await user.click(document.querySelector(".agenda-product-tag")!);

      expect(onSelectEvent).toHaveBeenCalledTimes(1);
      expect(onSelectEvent).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Arroz" }),
        expect.any(Object),
      );
    });

    it("NÃO deve chamar onSelectEvent ao clicar em interrupção", async () => {
      const onSelectEvent = jest.fn();
      const eventos = [criarEventoInterrupcao("int-1", "FERIADO", dataBase)];

      render(
        <AgendaSemanalView
          date={dataBase}
          events={eventos}
          localizer={localizadorMock}
          length={7}
          onSelectEvent={onSelectEvent}
        />,
      );

      const user = userEvent.setup();
      await user.click(document.querySelector(".agenda-interrupcao-tag")!);

      expect(onSelectEvent).not.toHaveBeenCalled();
    });

    it("deve acionar onSelectEvent via tecla Enter na tag de produto", async () => {
      const onSelectEvent = jest.fn();
      const evento = criarEventoProduto("prod-1", "Arroz", dataBase);

      render(
        <AgendaSemanalView
          date={dataBase}
          events={[evento]}
          localizer={localizadorMock}
          length={7}
          onSelectEvent={onSelectEvent}
        />,
      );

      const user = userEvent.setup();
      const tag = document.querySelector(".agenda-product-tag") as HTMLElement;
      tag.focus();
      await user.keyboard("{Enter}");

      expect(onSelectEvent).toHaveBeenCalledTimes(1);
    });

    it("deve acionar onSelectEvent via tecla Espaço na tag de produto", async () => {
      const onSelectEvent = jest.fn();
      const evento = criarEventoProduto("prod-1", "Arroz", dataBase);

      render(
        <AgendaSemanalView
          date={dataBase}
          events={[evento]}
          localizer={localizadorMock}
          length={7}
          onSelectEvent={onSelectEvent}
        />,
      );

      const user = userEvent.setup();
      const tag = document.querySelector(".agenda-product-tag") as HTMLElement;
      tag.focus();
      await user.keyboard(" ");

      expect(onSelectEvent).toHaveBeenCalledTimes(1);
    });

    it("tags de produto devem ter atributos de acessibilidade", () => {
      const evento = criarEventoProduto("prod-1", "Arroz", dataBase);

      render(
        <AgendaSemanalView
          date={dataBase}
          events={[evento]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const tag = document.querySelector(".agenda-product-tag");
      expect(tag).toHaveAttribute("role", "button");
      expect(tag).toHaveAttribute("tabIndex", "0");
    });

    it("não deve quebrar quando onSelectEvent não é fornecido", async () => {
      const evento = criarEventoProduto("prod-1", "Arroz", dataBase);

      render(
        <AgendaSemanalView
          date={dataBase}
          events={[evento]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const user = userEvent.setup();
      await user.click(document.querySelector(".agenda-product-tag")!);
    });
  });

  // Metodos estaticos (range, navigate, title) exigidos pelo react-big-calendar

  describe("Métodos estáticos", () => {
    it("range deve retornar { start, end } com intervalo suficiente", () => {
      const resultado = AgendaSemanalView.range(dataBase, {
        length: 7,
        localizer: localizadorMock,
      });

      expect(resultado).toHaveProperty("start");
      expect(resultado).toHaveProperty("end");
      expect(resultado.start).toEqual(dataBase);
      const fimEsperado = new Date(dataBase);
      fimEsperado.setDate(fimEsperado.getDate() + 14);
      expect(resultado.end).toEqual(fimEsperado);
    });

    it("navigate PREV deve retroceder 30 dias", () => {
      const resultado = AgendaSemanalView.navigate(dataBase, "PREV", {
        length: 7,
        localizer: localizadorMock,
      });

      const esperado = new Date(dataBase);
      esperado.setDate(esperado.getDate() - 30);
      expect(resultado).toEqual(esperado);
    });

    it("navigate NEXT deve avançar 30 dias", () => {
      const resultado = AgendaSemanalView.navigate(dataBase, "NEXT", {
        length: 7,
        localizer: localizadorMock,
      });

      const esperado = new Date(dataBase);
      esperado.setDate(esperado.getDate() + 30);
      expect(resultado).toEqual(esperado);
    });

    it("navigate TODAY deve retornar a data atual do sistema", () => {
      const agoraFalso = new Date(2025, 6, 15);
      jest.useFakeTimers().setSystemTime(agoraFalso);

      const resultado = AgendaSemanalView.navigate(dataBase, "TODAY", {
        length: 7,
        localizer: localizadorMock,
      });

      expect(resultado).toEqual(agoraFalso);
      jest.useRealTimers();
    });

    it("navigate com ação desconhecida deve retornar a própria data", () => {
      const resultado = AgendaSemanalView.navigate(dataBase, "UNKNOWN", {
        length: 7,
        localizer: localizadorMock,
      });

      expect(resultado).toEqual(dataBase);
    });

    it("title deve retornar string com mês e ano formatados em português", () => {
      const resultado = AgendaSemanalView.title(dataBase, {
        length: 7,
        localizer: localizadorMock,
      });

      expect(typeof resultado).toBe("string");
      expect(resultado).toMatch(/julho 2025/i);
    });
  });

  describe("Casos de borda", () => {
    it("deve iniciar da segunda-feira se a data fornecida for sábado", () => {
      const sabado = new Date(2025, 6, 12);

      render(
        <AgendaSemanalView
          date={sabado}
          events={[]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const nomeDia = document.querySelector(".agenda-day-name");
      expect(nomeDia!.textContent).toMatch(/segunda/i);
    });

    it("deve iniciar da segunda-feira se a data fornecida for domingo", () => {
      const domingo = new Date(2025, 6, 13);

      render(
        <AgendaSemanalView
          date={domingo}
          events={[]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const nomeDia = document.querySelector(".agenda-day-name");
      expect(nomeDia!.textContent).toMatch(/segunda/i);
    });

    it("deve lidar com array de eventos vazio sem erros", () => {
      expect(() =>
        render(
          <AgendaSemanalView
            date={dataBase}
            events={[]}
            localizer={localizadorMock}
            length={7}
          />,
        ),
      ).not.toThrow();
    });

    it("deve lidar com length customizado (ex: 5 dias)", () => {
      render(
        <AgendaSemanalView
          date={dataBase}
          events={[]}
          localizer={localizadorMock}
          length={5}
        />,
      );

      const linhas = document.querySelectorAll(".agenda-row");
      expect(linhas).toHaveLength(5);
    });

    it("deve usar length padrão 7 quando não especificado", () => {
      render(
        <AgendaSemanalView
          date={dataBase}
          events={[]}
          localizer={localizadorMock}
        />,
      );

      const linhas = document.querySelectorAll(".agenda-row");
      expect(linhas).toHaveLength(7);
    });

    it("não deve renderizar datas de fim de semana em nenhuma circunstância", () => {
      render(
        <AgendaSemanalView
          date={dataBase}
          events={[]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      const nomesDias = document.querySelectorAll(".agenda-day-name");
      nomesDias.forEach((el) => {
        const texto = el.textContent!.toLowerCase();
        expect(texto).not.toMatch(/sábado/);
        expect(texto).not.toMatch(/domingo/);
      });
    });

    it("deve renderizar corretamente com classe CSS agenda-semanal-view", () => {
      render(
        <AgendaSemanalView
          date={dataBase}
          events={[]}
          localizer={localizadorMock}
          length={7}
        />,
      );

      expect(
        document.querySelector(".agenda-semanal-view"),
      ).toBeInTheDocument();
    });
  });
});
