import { ExternalAnalyseProcessing } from '../../../../../analysis/http/client/external-analyse-processing.client';
import { ConfigModule } from '../../../../../config/config.module';
import { CurriculumAnalysisService } from '../../curriculum-analysis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ExternalEvaluationProcessing } from '../../../../../analysis/http/client/external-evaluation-processing.client';

describe('Curriculum Processing', () => {
  let curriculumAnalysisService: CurriculumAnalysisService;
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
  });

  it('get analyse curriculum', async () => {
    const input = {
      resumeText: `
Carlos Cady
+55 (11) 00000-0000 | carlos.teste@email.com |

RESUMO
Estudante de Análise de Dados, com experiência em Python, SQL e ferramentas de visualização como Power BI. Interessado em aplicar técnicas de análise e machine learning para transformar dados em insights estratégicos.

HABILIDADES

Linguagens: Python, R, Java, JavaScript

Ferramentas: Scikit-learn, Pandas, SQL, TensorFlow, Power BI, Docker

Banco de Dados: MySQL, PostgreSQL, MongoDB

Outros: Análise de dados, visualização de dados, ETL, Big Data

EXPERIÊNCIA

Estagiário de Análise de Dados — CloudTech Solutions
Mai 2023 - Out 2023

Desenvolvimento de pipelines de dados para análise em AWS

Criação de dashboards dinâmicos usando Power BI

Análise e monitoramento de dados financeiros em tempo real

Assistente de TI — Supermercado Boa Compra
Jan 2019 - Jun 2020

Suporte técnico e configuração de sistemas de rede

Análise e otimização de processos internos no ERP da empresa

Diagnóstico e manutenção de hardware e software

FORMAÇÃO

Técnico em Análise de Sistemas — Instituto TechData
Mar 2021 - Dez 2023

Bootcamp em Ciência de Dados — Data Academy
Jul 2024 - Dez 2024
      `,
      jobText: `
Sobre a vaga
A FitLife Solutions é uma empresa inovadora, líder no setor de saúde e bem-estar, com presença global e um compromisso constante com a transformação digital. Nossa missão é proporcionar um estilo de vida mais saudável e ativo para nossos clientes, utilizando tecnologia de ponta para otimizar cada experiência de bem-estar.

Contamos com uma equipe diversificada e dinâmica, que se dedica a criar soluções inteligentes para a saúde, com presença em múltiplos países e uma base de clientes em crescimento. Nosso portfólio inclui marcas de fitness, saúde mental e bem-estar, e estamos constantemente explorando novas formas de integrar tecnologia e inovação para impactar positivamente a vida de milhares de pessoas.

O que nos motiva?
Acreditamos no poder da inovação para transformar vidas. A cada dia, trabalhamos com dedicação para proporcionar o melhor serviço aos nossos usuários, com um compromisso firme de inspirar e apoiar aqueles que buscam um estilo de vida mais saudável.

Estamos buscando um Estagiário em Análise de Dados para ajudar a nossa equipe a:

Auxiliar na análise de dados de transações financeiras de diversos meios de pagamento, incluindo cartões, carteiras digitais e boletos, em vários países.

Monitorar os indicadores de performance e garantir a eficiência dos processos de cobrança.

Identificar anomalias e falhas nos fluxos de pagamento, sugerindo planos de ação para correção.

Propor melhorias nos processos e regras de cobrança, visando aumentar as taxas de aprovação e reduzir perdas financeiras.

Trabalhar de forma colaborativa com outras áreas, como Produto, Engenharia e Atendimento, para garantir uma operação integrada e eficiente.

Ajudar na criação de relatórios e dashboards para acompanhar a evolução dos KPIs e fornecer insights para a tomada de decisões.

Requisitos essenciais:

Cursando Engenharia, Matemática, Estatística ou áreas relacionadas.

Disponibilidade para estagiar por, no mínimo, 1 ano.

Conhecimento básico em Excel.

Desejável conhecimento em Power BI ou SQL.

O que oferecemos:

Ambiente descontraído e colaborativo, onde sua ideia tem impacto.

Oportunidades de aprendizado e crescimento contínuos.

Flexibilidade para que você evolua junto com a empresa.
      `,
    };
    const output = await curriculumAnalysisService.analyseProcess(input);
    expect(output).toBeDefined();
    expect(output).toHaveProperty('analysisResult');
    expect(output).toHaveProperty('matchScore');
    expect(output).toHaveProperty('createdAt');
    expect(output.analysisResult).toHaveProperty('classification');
    expect(output.analysisResult).toHaveProperty('strongPoints');
    expect(output.analysisResult).toHaveProperty('pointsToImprove');
    expect(output.analysisResult).toHaveProperty('resumeSuggestions');
    expect(output.analysisResult.classification).toBeDefined();
    expect(output.analysisResult.strongPoints).toHaveLength(3);
  }, 15000);
});
