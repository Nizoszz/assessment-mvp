import { ExternalAnalyseProcessing } from '../../../../../analysis/http/client/external-analyse-processing.client';
import { ConfigModule } from '../../../../../config/config.module';
import { CurriculumAnalysisService } from '../../curriculum-analysis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ExternalEvaluationProcessing } from '../../../../../analysis/http/client/external-evaluation-processing.client';

describe('Curriculum Processing', () => {
  let curriculumAnalysisService: CurriculumAnalysisService;
  //   let userRepository: UserRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        CurriculumAnalysisService,
        ExternalAnalyseProcessing,
        ExternalEvaluationProcessing,
      ],
    }).compile();

    curriculumAnalysisService = module.get<CurriculumAnalysisService>(
      CurriculumAnalysisService,
    );
    // userRepository = module.get<UserRepository>(UserRepository);
  });
  //   it('get analyse curriculum', async () => {
  //     const input = {
  //       resumeText: `
  //       Andrew da Silva

  //       Desenvolvedor Full-stack Jr

  //       São Bernardo do Campo - SP
  //       Telefone: (11) 98057-5191/ 94165-2963
  //       E-mail: andrewairamdasilva@gmail.com
  //       Linkedin | GitHub

  //       Síntese de Qualificações

  //       Sou estudante de Cibersegurança na Universidade Anhanguera e sou formado em desenvolvimento full-stack pela Kenzie Academy, onde concluí um curso intensivo de 2000 horas e desenvolvi mais de 40 projetos práticos em front-end e back-end, utilizando principalmente JavaScript, TypeScript e Python. Após a formação, passei a estudar e expandir meus conhecimentos com Java, além de estudar design patterns, arquitetura de software e desenvolvimento orientado a objetos. Neste momento, estou em transição de carreira, com o objetivo de aprimorar minhas habilidades em segurança da informação e focar no desenvolvimento web.
  //       Tenho um perfil adaptável e gosto de aprender e aplicar novas tecnologias, sempre buscando a melhor solução para os desafios que surgem. Valorizo a comunicação clara e a colaboração, e tenho o compromisso de entregar soluções eficientes e escaláveis, com qualidade e confiabilidade. Busco constantemente evoluir tecnicamente, explorando áreas como escalabilidade e segurança, para poder contribuir com projetos inovadores e impactantes.
  //       Tenho uma abordagem resiliente, sou proativo e colaborativo, com uma forte postura voltada ao aprendizado contínuo e à entrega de resultados em equipe.
  //       Habilidades Técnicas: JavaScript, TypeScript, Python, Java, Node.js, Express.js, Nest.js, Django, Django Rest Framework, React, React Hooks, Styled-components, API’s REST, PostgreSQL, SQLite3, MySQL, MongoDB, Prisma, TypeORM, Zod, Yup, Git, GitHub, Docker, Pytest, Junit, Jest, Spring Boot, JPA, Scrum.

  //       Formação Acadêmica
  //       Anhanguera Educacional, Técnologo em Cibersegurança | JANEIRO DE 2024 - JULHO - 2026.
  //       Kenzie Academy Brasil,  Desenvolvimento-Web Full-Stack  | JULHO  DE 2022- JULHO DE 2023.
  //       Generation Brasil,  Desenvolvedor Web Cloud AWS | OUTUBRO DE 2024 - JANEIRO DE 2025.

  //       Experiências Profissionais
  //       Kenzie Academy Brasil - Monitor de Ensino (Maio de 2023 - Julho de 2023)
  //       Responsável por prestar assistência aos alunos do quinto módulo;
  //       Correção das entregas nas tecnologias: Python, Django, Django Rest Framework e PostgreSQL;
  //       Relatórios sobre os alunos;
  //       Comunicação ativa com os alunos.

  //       Principais Projetos

  //       Trampo Finder - Backend
  //       Desenvolvido para facilitar o acompanhamento do progresso de mentees em programas de mentoria de empregabilidade da Generation Brasil. O sistema permite cadastro de usuários, exibição de vagas, candidatura, alteração de status, upload de arquivos (apenas por instrutores) e geração de relatórios em CSV. Mentores podem acessar relatórios detalhados ou específicos sobre as candidaturas ativas dos mentees.
  //       Tecnologias: Node.js, NestJS, PostgreSQL, Docker, PBKDF2Sync, JWT, Jest, Multer, ExcelJs.
  //       Status: Em desenvolvimento, com funcionalidades principais implementadas, sem deploy disponível.

  //       Trampo Finder - FrontEnd
  //       Interface responsiva e interativa que permite aos mentees visualizarem e se candidatarem a vagas de emprego, além de acompanhar o progresso e alterar o status das candidaturas. Mentores podem gerar relatórios em CSV e acompanhar a quantidade de vagas em que os mentees estão participando.
  //       Tecnologias: React, React Hook Form, Axios, Context API, Toastify, Tailwind CSS.
  //       Status: Em desenvolvimento, com funcionalidades principais implementadas, sem deploy disponível.

  //       KImoveis
  //       K'imoveis foi desenvolvida para atender às necessidades de gerenciamento de uma imobiliária, proporcionando recursos para o gerenciamento de propriedades e agendamento de clientes. A aplicação utiliza diversas tecnologias para garantir segurança, eficiência e escalabilidade.
  //       Tecnologias: Typescript, Express.js, TypeORM, Zod, PSQL, JWT e Bcryptjs`,
  //       jobText: `
  //      Sobre a vaga
  // O Grupo Smart Fit é muito mais do que a maior rede de academias da América Latina e o maior empregador de profissionais de educação física do mundo. Somos um verdadeiro ecossistema focado em bem-estar e saúde, impactando a vida de milhares de pessoas todos os dias.

  // Estamos em 15 países, com mais de 1.700 unidades, e temos o prazer de atender mais de 5,2 milhões de alunos. Nossa equipe de 15 mil colaboradores está sempre a mil, trazendo novas ideias e inovações. Desde que abrimos nossa capital em 2021, aceleramos nossa missão de transformar vidas com soluções de fitness e saúde.

  // Temos várias marcas no nosso portfólio, como Bio Ritmo, Smart Fit, Race Bootcamp, Vidya Studio, Jab House, Tonus Gym, One Pilates, Velocity, Kore TotalPass e Nation CT. Além disso, oferecemos produtos digitais como Queima Diária, Smart Fit Nutri e Smart Fit Coach. Estamos sempre procurando novas formas de integrar tecnologia e inovação para ajudar você a ter um estilo de vida mais ativo e saudável. E aí, topa o desafio junto com a gente?

  // O que nos move todos os dias?

  // Somos parte da mudança, transformando o cenário e trazendo mais qualidade para a vida de quem tá junto com a gente. Cada gotinha de suor é uma prova do nosso compromisso em inspirar e motivar todo mundo que quer uma vida mais ativa e saudável. A cada dia, começamos nossa jornada com aquecimento total, prontos para alcançar novos objetivos e viver o máximo.

  // Estamos buscando um Estagiário em Análise de Dados que será responsável por:

  // Auxiliar na análise de dados de aprovações de diferentes formas de pagamento (cartões, carteiras digitais, boletos, entre outros) em 15 países;
  // Monitorar diariamente os indicadores de performance das transações financeiras, auxiliando no bom funcionamento do processo de cobrança;
  // Auxilio em identificar anomalias, falhas ou comportamentos fora do padrão nos fluxos de pagamento, propondo planos de ação para correção;
  // Ajudar na sugestão e implementação de melhorias contínuas nos processos e regras de cobrança, contribuindo para o aumento da taxa de aprovação e redução de perdas financeiras;
  // Trabalhar em parceria com áreas como Produto, Engenharia, Financeiro e Atendimento para garantir uma operação eficiente e integrada;
  // Auxílio na elaboração de relatórios e dashboards para acompanhar a evolução dos KPIs e apoiar a tomada de decisão.

  // Itens essenciais que não podem faltar no seu kit:

  // Estar cursando Engenharia, Matemática, Estatística ou áreas correlatas;
  // Ter disponibilidade para estagiar por, no mínimo, 1 ano;
  // Ter conhecimento em Excel;
  // Diferencial: conhecimento prévio em Power BI ou SQL.

  // Cuidados com a nossa gente:

  // Mantemos um ambiente descontraído, onde cada ideia conta. Na base da colaboração e criatividade, a gente está sempre evoluindo e de olho nas tendências que movem o mundo fitness
  // Aqui é tudo sobre o "porquê" fazemos o que fazemos. Apesar de sermos o maior Grupo de academias da América Latina, sabemos que a saúde e o bem-estar devem ser integral.
  //       `,
  //     };
  //     await curriculumAnalysisService.analyseProcess(input);
  //   }, 15000);
  it('get analyse curriculum', async () => {
    const input = {
      resumeText: `
        Igor Araujo de Mattos
        LinkedIn • +55 (75) 98141-9449 • yigor88mattos@gmail.com • GitHub
        RESUMO PROFISSIONAL
        Cientista de Dados em formação, com experiência prática em Machine Learning, Cloud Computing e Análise de Dados. Apaixonado por transformar dados em insights estratégicos, impulsionando a inovação e a tomada de decisões baseadas em evidências.
        HABILIDADES TÉCNICAS

        Linguagens: Python, JavaScript, C, C++, Java
        Machine Learning & IA: Scikit-learn, TensorFlow, PyTorch, Keras, XGBoost, NLP
        Big Data & Cloud: AWS, Google Cloud (GCP), AWS SageMaker, Lambda, BigQuery
        Engenharia de Dados: ETL, pipelines, SQL otimizado, NumPy, Pandas, PySpark
        Visualização: Power BI, Looker Studio, Qlik Sense, Matplotlib, Seaborn, Plotly
        Web & Bancos de Dados: HTML5, CSS3, React JS, Node JS, PostgreSQL, MySQL, MongoDB
        DevOps & Infraestrutura: Docker, Kubernetes, Terraform, Linux básico

        EXPERIÊNCIA PROFISSIONAL
        Estagiário em IA/ML — Compass UOL
        Set 2023 - Fev 2024

        Desenvolvimento de interfaces para consumir APIs, com deploy via Docker e Kubernetes
        Treinamento de modelos de ML, criação de API com Flask e deploy no Elastic Beanstalk
        Criação de assistente virtual (Chat-Bots) com intents, slots e integração com Slack
        Lambdas para processar imagens do S3, CloudWatch, AWS Polly e arquitetura serverless

        Aprendiz de Analista de Sistemas — Supermercado Compre Bem
        Jul 2018 - Dez 2019

        Manutenção e configuração de hardware e redes
        Gestão de ERP, análise de processos e suporte técnico
        Diagnóstico e resolução de problemas de TI

        FORMAÇÃO ACADÊMICA
        Engenharia de Computação
        Jul 2021 - Presente
        Universidade Tecnológica Federal do Paraná (UTFPR)

        Foco em desenvolvimento de soluções tecnológicas em hardware e software, alinhadas às normas técnicas e legais.

        Bootcamp de Analista de Dados
        Out 2024 - Jan 2025
        Martech Academy

        Formação prática com 480 horas voltada ao conhecimento em Cloud GCP, análise de dados avançada e criação de dashboards dinâmicos com ferramentas modernas.

        LICENÇAS & CERTIFICAÇÕES

        AWS Certified Cloud Practitioner
        Inglês B1: Universidade Tecnológica Federal do Paraná (UTFPR)
        Espanhol A2: Universidade Tecnológica Federal do Paraná (UTFPR)
        Operador de Computador (Pacote Office): Prepara Cursos
        Montagem e Manutenção de Computadores: Prepara Cursos
      `,
      jobText: `
Sobre a vaga
  O Grupo Smart Fit é muito mais do que a maior rede de academias da América Latina e o maior empregador de profissionais de educação física do mundo. Somos um verdadeiro ecossistema focado em bem-estar e saúde, impactando a vida de milhares de pessoas todos os dias.

  Estamos em 15 países, com mais de 1.700 unidades, e temos o prazer de atender mais de 5,2 milhões de alunos. Nossa equipe de 15 mil colaboradores está sempre a mil, trazendo novas ideias e inovações. Desde que abrimos nossa capital em 2021, aceleramos nossa missão de transformar vidas com soluções de fitness e saúde.

  Temos várias marcas no nosso portfólio, como Bio Ritmo, Smart Fit, Race Bootcamp, Vidya Studio, Jab House, Tonus Gym, One Pilates, Velocity, Kore TotalPass e Nation CT. Além disso, oferecemos produtos digitais como Queima Diária, Smart Fit Nutri e Smart Fit Coach. Estamos sempre procurando novas formas de integrar tecnologia e inovação para ajudar você a ter um estilo de vida mais ativo e saudável. E aí, topa o desafio junto com a gente?

  O que nos move todos os dias?

  Somos parte da mudança, transformando o cenário e trazendo mais qualidade para a vida de quem tá junto com a gente. Cada gotinha de suor é uma prova do nosso compromisso em inspirar e motivar todo mundo que quer uma vida mais ativa e saudável. A cada dia, começamos nossa jornada com aquecimento total, prontos para alcançar novos objetivos e viver o máximo.

  Estamos buscando um Estagiário em Análise de Dados que será responsável por:

  Auxiliar na análise de dados de aprovações de diferentes formas de pagamento (cartões, carteiras digitais, boletos, entre outros) em 15 países;
  Monitorar diariamente os indicadores de performance das transações financeiras, auxiliando no bom funcionamento do processo de cobrança;
  Auxilio em identificar anomalias, falhas ou comportamentos fora do padrão nos fluxos de pagamento, propondo planos de ação para correção;
  Ajudar na sugestão e implementação de melhorias contínuas nos processos e regras de cobrança, contribuindo para o aumento da taxa de aprovação e redução de perdas financeiras;
  Trabalhar em parceria com áreas como Produto, Engenharia, Financeiro e Atendimento para garantir uma operação eficiente e integrada;
  Auxílio na elaboração de relatórios e dashboards para acompanhar a evolução dos KPIs e apoiar a tomada de decisão.

  Itens essenciais que não podem faltar no seu kit:

  Estar cursando Engenharia, Matemática, Estatística ou áreas correlatas;
  Ter disponibilidade para estagiar por, no mínimo, 1 ano;
  Ter conhecimento em Excel;
  Diferencial: conhecimento prévio em Power BI ou SQL.

  Cuidados com a nossa gente:

  Mantemos um ambiente descontraído, onde cada ideia conta. Na base da colaboração e criatividade, a gente está sempre evoluindo e de olho nas tendências que movem o mundo fitness
  Aqui é tudo sobre o "porquê" fazemos o que fazemos. Apesar de sermos o maior Grupo de academias da América Latina, sabemos que a saúde e o bem-estar devem ser integral.
      `,
    };
    await curriculumAnalysisService.analyseProcess(input);
  }, 15000);
});
