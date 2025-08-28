![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

![node-version](https://img.shields.io/badge/node-22.15.1-blue)
![react-version](https://img.shields.io/badge/react-18.3.1-blue)

# Estratégia de Transformação Digital e Governo Aberto na SME

Como um governo pode atuar para garantir o bem comum de todos? Na SME, acreditamos que um dos meios para isso seja garantir transparência e prestação de contas e constante relação entre governo e sociedade para o desenvolvimento e implementação de políticas públicas. 

A Portaria SME nº 8.008, de 12 de novembro de 2018 oficializou a estratégia da Secretaria Municipal de Educação de SP para que nossas ações sejam pautadas nos princípios de Governo Aberto e para usarmos os valores e benefícios do mundo digital para melhorarmos nossos processos e serviços para os cidadãos. 
Com isso, pretendemos: 
- aumentar os níveis de transparência ativa e de abertura de dados, garantindo a proteção de dados pessoais; 
- instituir metodologias ágeis e colaborativas como parte do processo de desenvolvimento e de evolução de sistemas administrativos e de serviços digitais; 
- fortalecer o controle das políticas educacionais e da aplicação de recursos por parte da gestão e da sociedade; 
- promover espaços e metodologias de colaboração entre governo, academia, sociedade civil e setor privado. 

O [Ateliê do Software](http://forum.govit.prefeitura.sp.gov.br/uploads/default/original/1X/c88a4715eb3f9fc3ceb882c1f6afe9e308805a17.pdf) é uma das ferramentas para operacionalização. Baseado em um modelo de contratação inspirado pelos movimentos ágil e de Software Craftsmanship, trabalhamos com equipes multidisciplinares para o desenvolvimento de produtos que beneficiam toda a comunidade escolar (técnicos da SME e DREs, gestores, professores, alunos e famílias) e concretizam os objetivos da Estratégia de Transformação Digital e Governo Aberto “Pátio Digital”.

# Conteúdo

1. [Sobre o Produto](#sobre-o-produto)
2. [Sobre o Time](#sobre-o-time)
3. [Links Úteis](#links-úteis)  
4. [Comunicação](#comunicação)  
5. [Como contribuir](#como-contribuir)  
6. [Repositórios](#repositórios)  
7. [Instalação e Configuração](#instalação-e-configuração)


# Sobre o Produto

O Sistema de Gestão do Programa de Alimentação Escolar: **SIGPAE** foi desenvolvido pela **Secretaria Municipal de Educação** juntamente com a equipe técnica da **Coordenadoria de Alimentação Escolar** para facilitar e auxiliar o gerenciamento de processos e informações do **Programa de Alimentação Escolar no Município de São Paulo**.

## Objetivos de Negócio

- Promover transparência e agilidade nos processos, acesso de dados e geração de relatórios;
- Desenvolver módulos do sistema adaptáveis e alinhados às necessidades reais dos usuários;
- Fortalecer o controle das políticas educacionais e da aplicação de recursos por parte da gestão e da sociedade;
- Integrar setores, melhorar a eficiência e o fluxo de trabalho;
- Diminuir o fluxo de papéis e planilhas e agilizar o acesso às informações;
- Permitir a integração com sistemas novos ou já existentes;
- Automatizar os processos internos de fornecimento e distribuição da alimentação escolar.

## Personas

**UNIDADES EDUCACIONAIS** | Diretor, Assistente de Direção, Professor, Auxiliar Técnico de Educação, Gestor de Equipamento.  
Características e necessidades: responsável pela gestão da escola, com necessidade de otimização de tempo. O sistema é essencial para melhor controle das solicitações realizadas pela UE e demandas de DRE e CODAE.

**CODAE** | Coordenador(a), Assessores, Diretores, Técnicos de Educação, Nutricionistas, Veterinários e Agrônomos.  
Características e necessidades: responsável pela gestão das solicitações e produtos, cronogramas, encaminhamentos, fluxos, fornecimento, controle, entre outros relacionados ao Programa de Alimentação Escolar, com a necessidade de executar, monitorar e promover o Programa.

**DIRETORIA REGIONAL DE EDUCAÇÃO (DRE)** | Cogestores(as)  
Características e necessidades: responsável pelo gerenciamento das solicitações realizadas pelas escolas que administra, com a necessidade de otimizar e controlar as diversas solicitações das unidades escolares, afim de contribuir com a fiscalização e controle das solicitações geradas.

**EMPRESAS** | Fornecedores, Distribuidores, Fornecedores e Distribuidores  
Características e necessidades: responsável pelo atendimento das solicitações realizadas pelas Unidades Escolares, fornecimento de alimentos  provenientes da Agricultura Familiar solicitados pela CODAE e distribuição destes nas Unidades, com a necessidade de otimizar e controlar as diversas solicitações e entregas, afim de contribuir o controle de prazos execução das entregas.
  
## Funcionalidades

**Dieta Especial**
- Solicitação de Dieta
- Cancelamento de Dieta
- Autorização de Dieta
- Criação de Protocolos de Dieta Especial
- Alteração de UE
- Relatórios

**Gestão de Alimentação**
- Inclusão de Alimentação
- Solicitação de Kit Lanche
- Suspensão de Alimentação
- Alteração de Cardápio
- Relatórios

**Gestão de Produtos**
- Homologação de produto
- Suspensão e ativação de produto
- Registro de reclamação
- Analise sensorial
- Correção do produto
- Relatórios

**Gestão de Usuários**
- Gestão de Acesso
- Carga de Usuários
- Atualização de E-mail do EOL

**Medição**
- Lançamentos
- Acompanhamento de Lançamentos
- Relatórios

**Pré-Recebimento**
- Cronograma de Entrega
- Documentos de Recebimento
- Layout de Embalagem
- Fichas Técnicas
- Relatórios

**Recebimento**
- Ficha de Recebimento
- Questões por Produto
- Relatórios

## Roadmap

- Release 1 - Gestão de Alimentação
- Release 2 - Gestão de Produtos e Dieta Especial
- Release 3 – CoreSSO
- Release 4 – Gestão de nutricionistas
- Release 5 - Medição Inicial EMEF (visão UE)
- Release 6 - Medição Inicial EMEF (visão DRE e CODAE)
- Release 7 - Medição Inicial CEI e EMEI
- Release 8 - Cardápio
- Release 9 - Supervisão

Detalhamento do roadmap: [https://whimsical.com/roadmap-geral-sigpae-C2tThx2G9GpuVviBeHZ5me@VsSo8s35X1aaSatHxnJFRV](https://whimsical.com/roadmap-geral-sigpae-C2tThx2G9GpuVviBeHZ5me@VsSo8s35X1aaSatHxnJFRV)

Fluxos: [https://whimsical.com/fluxos-i7SkAADB94XRhRMd2afif](https://whimsical.com/fluxos-i7SkAADB94XRhRMd2afif)

Link do roadmap: [https://miro.com/app/board/uXjVJYCIt1M=/?share_link_id=769082437083](https://miro.com/app/board/uXjVJYCIt1M=/?share_link_id=769082437083)

# Sobre o Time

| Papel                | Titular                                                                                            | Suplente                 |
| -------------------- | -------------------------------------------------------------------------------------------------- | ------------------------ |
| Product Manager      | Carina Jakitas                                                                                     |                          |
| Product Owner        | Daniela Chichon e Carolina Dias                                                                    |                          |
| Agente de Governança | Juliana Demay                                                                                      | Vitor Augusto Ferragini  |
| Gerente de Projeto   | Ricardo Coda                                                                                       |                          |
| Scrum Master         | Cristiane Tuji                                                                                     |                          |
| Designer de Serviços | Rayanne Felicio                                                                                    |                          |
| Analista UX/UI       | Caroline Casassola                                                                                 |                          |
| Analista Programador | Calvin Rossinhole<br>Luis Zimmerman<br>Guilherme Massini<br>Murilo Schirmer<br>Priscyla dos Santos |                          |
| Analista de teste    | Leandro Sesconetti                                                                                 |                          |

## Protótipos

**Protótipo Navegável:**

**Visão Escola:**
https://www.figma.com/file/52MKvjiFFjoy7WLuvLLjAi/Spt_13-ALIMENTA%C3%87%C3%83O-Terceirizadas_sprint13-230719?node-id=0%3A25539

**Visão CODAE:**
https://www.figma.com/file/52MKvjiFFjoy7WLuvLLjAi/Spt_13-ALIMENTA%C3%87%C3%83O-Terceirizadas_sprint13-230719?node-id=0%3A36995

**Visão DRE:** https://www.figma.com/file/52MKvjiFFjoy7WLuvLLjAi/Spt_13-ALIMENTA%C3%87%C3%83O-Terceirizadas_sprint13-230719?node-id=0%3A43643

**Mapeamento inicial de fluxos:** https://drive.google.com/drive/folders/1mGy5On44p_wHBldWoEKyLrBTG98mhZaC?usp=sharing

# Links Úteis

**Homologação:**  
[https://hom-sigpae.sme.prefeitura.sp.gov.br/](https://hom-sigpae.sme.prefeitura.sp.gov.br/)

**Produção:**  
[https://sigpae.sme.prefeitura.sp.gov.br/](https://sigpae.sme.prefeitura.sp.gov.br/)

**Manual SIGPAE - UEs**  
[https://www.canva.com/design/DAF_30SjLFo/YeJsYGtwNMmt95V0oLDVcQ/edit](https://www.canva.com/design/DAF_30SjLFo/YeJsYGtwNMmt95V0oLDVcQ/edit)

**Manual SIGPAE - Empresas Terceirizadas**  
[https://educacao.sme.prefeitura.sp.gov.br/programa-de-alimentacao-escolar/para-empresas/prestadoras-de-servicos/](https://educacao.sme.prefeitura.sp.gov.br/programa-de-alimentacao-escolar/para-empresas/prestadoras-de-servicos/)

**Tutoriais SIGPAE**  
**Para Unidades**: [https://educacao.sme.prefeitura.sp.gov.br/programa-de-alimentacao-escolar/para-dres-e-ues/unidades-diretas/orientacoes-e-apoio-administrativo/](https://educacao.sme.prefeitura.sp.gov.br/programa-de-alimentacao-escolar/para-dres-e-ues/unidades-diretas/orientacoes-e-apoio-administrativo/)  
**Para Empresas**: [https://educacao.sme.prefeitura.sp.gov.br/programa-de-alimentacao-escolar/para-empresas/](https://educacao.sme.prefeitura.sp.gov.br/programa-de-alimentacao-escolar/para-empresas/)

# Comunicação:

| Canal de comunicação                                                         | Objetivos                                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Issues do Github](https://github.com/prefeiturasp/SME-SIGPAE-FrontEnd/issues) | - Sugestão de novas funcionalidades<br> - Reportar bugs<br> - Discussões técnicas |

# Como contribuir

Contribuições são **super bem vindas**! Se você tem vontade de construir o SIGPAE conosco, veja o nosso [guia de contribuição](./CONTRIBUTING.md) onde explicamos detalhadamente como trabalhamos e de que formas você pode nos ajudar a alcançar nossos objetivos. Lembrando que todos devem seguir  nosso [código de conduta](./CODEOFCONDUCT.md).

# Repositórios

Repositórios de código que envolvem a solução:  
- SME-SIGPAE-API: [https://github.com/prefeiturasp/SME-SIGPAE-API](https://github.com/prefeiturasp/SME-SIGPAE-API)
- SME-SIGPAE-FRONTEND: [https://github.com/prefeiturasp/SME-SIGPAE-Frontend](https://github.com/prefeiturasp/SME-SIGPAE-Frontend)


# Instalação e Configuração

Projeto SIGPAE Frontend baseado em <a  href="https://vite.dev/" target="_blank">Vite</a> para a interface gráfica onde os usuários do sistema poderão interagir com a <a  href="https://github.com/prefeiturasp/SME-SIGPAE-API" target="_blank">API SIGPAE</a>

**Pré-requisitos**

- npm
- nvm (utilizar versão do node 22.15.1)

**Passos**

1.  clonar o projeto

```
git clone https://github.com/prefeiturasp/SME-SIGPAE-Frontend
```

2.  criar arquivo `.env` na raiz do projeto com a variável de ambiente:

```
VITE_API_URL=http://localhost:8000
```

3.  instalar bibliotecas

```
npm install
```

4.  rodar o projeto

```
npm start
```
