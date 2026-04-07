import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Simulado() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null)
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState({})
  const [respostaSelecionada, setRespostaSelecionada] = useState(null)
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [simuladoIniciado, setSimuladoIniciado] = useState(false)
  const [tempoRestante, setTempoRestante] = useState(7200) // 2 horas em segundos
  const [mostrarRevisao, setMostrarRevisao] = useState(false)
  const [questoesDoSimulado, setQuestoesDoSimulado] = useState([])

  // BANCO COMPLETO DE QUESTÕES (80+ questões para variar)
  const bancoDeQuestoes = [
    // REGULAMENTAÇÃO (30 questões - 20 serão sorteadas)
    {
      id: 1,
      categoria: 'Regulamentação',
      pergunta: 'Qual a altitude mínima para sobrevoo de áreas densamente povoadas?',
      alternativas: [
        '300 metros acima do obstáculo mais alto',
        '500 metros acima do obstáculo mais alto',
        '1000 pés acima do obstáculo mais alto',
        '150 metros acima do solo'
      ],
      respostaCorreta: 2,
      explicacao: 'Conforme RBAC 91, a altitude mínima para sobrevoo de áreas densamente povoadas é de 1000 pés (300m) acima do obstáculo mais alto num raio de 600m.'
    },
    {
      id: 2,
      categoria: 'Regulamentação',
      pergunta: 'Qual o prazo de validade do CMA de 2ª classe para pilotos com menos de 40 anos?',
      alternativas: [
        '6 meses',
        '12 meses',
        '24 meses',
        '60 meses'
      ],
      respostaCorreta: 3,
      explicacao: 'O CMA de 2ª classe tem validade de 60 meses (5 anos) para menores de 40 anos.'
    },
    {
      id: 3,
      categoria: 'Regulamentação',
      pergunta: 'Qual documento NÃO é obrigatório portar durante o voo?',
      alternativas: [
        'Certificado de Aeronavegabilidade',
        'Apólice de Seguro',
        'Manual de Voo da aeronave',
        'Certificado de Matrícula'
      ],
      respostaCorreta: 1,
      explicacao: 'A apólice de seguro não precisa estar a bordo. Os documentos obrigatórios são: CA, CM, FIAM e Manual de Voo.'
    },
    {
      id: 4,
      categoria: 'Regulamentação',
      pergunta: 'Em voo VFR, qual a visibilidade mínima abaixo de 10.000 pés?',
      alternativas: [
        '1500 metros',
        '3000 metros',
        '5000 metros',
        '8000 metros'
      ],
      respostaCorreta: 2,
      explicacao: 'Para voo VFR abaixo de 10.000 pés, a visibilidade mínima é de 5km (5000m).'
    },
    {
      id: 5,
      categoria: 'Regulamentação',
      pergunta: 'Qual a idade mínima para obter a licença de Piloto Privado?',
      alternativas: [
        '16 anos',
        '17 anos',
        '18 anos',
        '21 anos'
      ],
      respostaCorreta: 2,
      explicacao: 'A idade mínima para obtenção da licença de PP é 18 anos.'
    },
    {
      id: 6,
      categoria: 'Regulamentação',
      pergunta: 'Qual a função do transponder code 7700?',
      alternativas: [
        'Falha de comunicação',
        'Sequestro',
        'Emergência',
        'Interferência ilícita'
      ],
      respostaCorreta: 2,
      explicacao: 'O código 7700 indica EMERGÊNCIA. 7600 = falha de comunicação, 7500 = sequestro.'
    },
    {
      id: 7,
      categoria: 'Regulamentação',
      pergunta: 'Durante voo VFR controlado, o piloto deve manter escuta na frequência:',
      alternativas: [
        'Apenas durante decolagem e pouso',
        'Somente quando solicitado',
        'Durante todo o voo no espaço controlado',
        'Apenas em classe A'
      ],
      respostaCorreta: 2,
      explicacao: 'Deve manter escuta contínua durante todo o tempo no espaço aéreo controlado.'
    },
    {
      id: 8,
      categoria: 'Regulamentação',
      pergunta: 'Qual a distância mínima de nuvens para voo VFR abaixo de 10.000 pés?',
      alternativas: [
        '500 pés vertical e 1000m horizontal',
        '1000 pés vertical e 1500m horizontal',
        '1500 pés vertical e 2000m horizontal',
        '2000 pés vertical e 3000m horizontal'
      ],
      respostaCorreta: 1,
      explicacao: 'Para VFR abaixo de 10.000 pés: mínimo 1500m horizontal e 1000 pés vertical das nuvens.'
    },
    {
      id: 9,
      categoria: 'Regulamentação',
      pergunta: 'O que significa NOTAM?',
      alternativas: [
        'Notice to Air Men',
        'Notice to Airmen',
        'Notification to Aviation Members',
        'Notice of Air Movement'
      ],
      respostaCorreta: 1,
      explicacao: 'NOTAM significa "Notice to Airmen" - aviso aos aeronavegantes.'
    },
    {
      id: 10,
      categoria: 'Regulamentação',
      pergunta: 'Qual o combustível mínimo para voo VFR diurno?',
      alternativas: [
        '30 minutos após destino',
        '45 minutos após destino',
        '1 hora após destino',
        '30 min alternativa + 30 min'
      ],
      respostaCorreta: 0,
      explicacao: 'Para VFR diurno, o combustível mínimo é suficiente para destino mais 30 minutos de reserva.'
    },
    {
      id: 11,
      categoria: 'Regulamentação',
      pergunta: 'A inspeção anual da aeronave (IAM) deve ser realizada a cada:',
      alternativas: [
        '100 horas de voo',
        '6 meses',
        '12 meses',
        '24 meses'
      ],
      respostaCorreta: 2,
      explicacao: 'A IAM deve ser realizada a cada 12 meses.'
    },
    {
      id: 12,
      categoria: 'Regulamentação',
      pergunta: 'Em que altitude deve-se voar em rota magnética 090°?',
      alternativas: [
        'Altitude ímpar + 500 pés',
        'Altitude par + 500 pés',
        'Altitude ímpar',
        'Altitude par'
      ],
      respostaCorreta: 0,
      explicacao: 'Rumos de 000° a 179° voam em altitudes ímpares + 500 pés em VFR.'
    },
    {
      id: 13,
      categoria: 'Regulamentação',
      pergunta: 'Luz vermelha constante da torre para aeronave em voo significa:',
      alternativas: [
        'Prossiga com cautela',
        'Aeródromo indisponível, não pouse',
        'Dê passagem a outra aeronave',
        'Retorne e pouse'
      ],
      respostaCorreta: 1,
      explicacao: 'Luz vermelha constante = aeródromo indisponível, não pouse.'
    },
    {
      id: 14,
      categoria: 'Regulamentação',
      pergunta: 'O Plano de Voo deve ser apresentado com antecedência mínima de:',
      alternativas: [
        '15 minutos',
        '30 minutos',
        '45 minutos',
        '60 minutos'
      ],
      respostaCorreta: 3,
      explicacao: 'Plano de Voo deve ser apresentado com no mínimo 60 minutos de antecedência.'
    },
    {
      id: 15,
      categoria: 'Regulamentação',
      pergunta: 'Qual classe de espaço aéreo requer contato rádio obrigatório?',
      alternativas: [
        'Classe G',
        'Classe E acima de 10.000 pés',
        'Classe D',
        'Todas as classes'
      ],
      respostaCorreta: 2,
      explicacao: 'Espaço aéreo Classe D requer contato rádio bilateral obrigatório.'
    },
    {
      id: 16,
      categoria: 'Regulamentação',
      pergunta: 'Quantas horas de voo são necessárias para licença PP?',
      alternativas: [
        '30 horas',
        '35 horas',
        '40 horas',
        '50 horas'
      ],
      respostaCorreta: 1,
      explicacao: 'São necessárias no mínimo 35 horas de voo total.'
    },
    {
      id: 17,
      categoria: 'Regulamentação',
      pergunta: 'Qual documento registra todas as manutenções da aeronave?',
      alternativas: [
        'Certificado de Matrícula',
        'FIAM',
        'Manual de Voo',
        'Certificado de Aeronavegabilidade'
      ],
      respostaCorreta: 1,
      explicacao: 'A FIAM registra todas as inspeções e manutenções.'
    },
    {
      id: 18,
      categoria: 'Regulamentação',
      pergunta: 'O que é ELT?',
      alternativas: [
        'Emergency Landing Transmitter',
        'Emergency Locator Transmitter',
        'Electronic Location Tool',
        'Emergency Light Transmitter'
      ],
      respostaCorreta: 1,
      explicacao: 'ELT é o transmissor localizador de emergência (121.5 MHz).'
    },
    {
      id: 19,
      categoria: 'Regulamentação',
      pergunta: 'Qual a prioridade absoluta em aviação?',
      alternativas: [
        'Cumprimento do horário',
        'Segurança de voo',
        'Conforto dos passageiros',
        'Economia de combustível'
      ],
      respostaCorreta: 1,
      explicacao: 'A segurança de voo é SEMPRE a prioridade absoluta.'
    },
    {
      id: 20,
      categoria: 'Regulamentação',
      pergunta: 'Voo VFR noturno sobre área densamente povoada requer altitude mínima de:',
      alternativas: [
        '500 pés acima do solo',
        '1000 pés acima do obstáculo',
        '1500 pés acima do obstáculo',
        '2000 pés acima do solo'
      ],
      respostaCorreta: 2,
      explicacao: 'VFR noturno em área densamente povoada: 1500 pés acima do obstáculo mais alto.'
    },
    {
      id: 21,
      categoria: 'Regulamentação',
      pergunta: 'A licença de PP permite transportar:',
      alternativas: [
        'Apenas o piloto',
        'Passageiros sem remuneração',
        'Passageiros com remuneração',
        'Apenas instrutores'
      ],
      respostaCorreta: 1,
      explicacao: 'PP pode transportar passageiros, mas sem remuneração (voo não comercial).'
    },
    {
      id: 22,
      categoria: 'Regulamentação',
      pergunta: 'Qual a frequência internacional de emergência?',
      alternativas: [
        '118.0 MHz',
        '121.5 MHz',
        '123.45 MHz',
        '243.0 MHz'
      ],
      respostaCorreta: 1,
      explicacao: '121.5 MHz é a frequência internacional de emergência (243.0 MHz é militar).'
    },
    {
      id: 23,
      categoria: 'Regulamentação',
      pergunta: 'Em caso de falha de rádio em voo VFR, o piloto deve:',
      alternativas: [
        'Pousar imediatamente',
        'Transponderar 7600 e prosseguir VFR',
        'Transponderar 7700',
        'Retornar ao aeródromo de partida'
      ],
      respostaCorreta: 1,
      explicacao: 'Falha de rádio em VFR: transponderar 7600 e continuar VFR até destino.'
    },
    {
      id: 24,
      categoria: 'Regulamentação',
      pergunta: 'Qual o teto mínimo para voo VFR abaixo de 10.000 pés?',
      alternativas: [
        '500 pés',
        '1000 pés',
        '1500 pés',
        '3000 pés'
      ],
      respostaCorreta: 2,
      explicacao: 'Teto mínimo VFR abaixo de 10.000 pés: 1500 pés.'
    },
    {
      id: 25,
      categoria: 'Regulamentação',
      pergunta: 'A habilitação MLTE permite voar:',
      alternativas: [
        'Monomotor terrestre',
        'Multimotor terrestre',
        'Hidroavião',
        'Planador'
      ],
      respostaCorreta: 1,
      explicacao: 'MLTE = Multi-engine Land - aeronaves multimotoras terrestres.'
    },
    {
      id: 26,
      categoria: 'Regulamentação',
      pergunta: 'O CIV (Código de Identificação de Voo) deve ter quantos caracteres?',
      alternativas: [
        '4 caracteres',
        '5 caracteres',
        '6 caracteres',
        '7 caracteres'
      ],
      respostaCorreta: 3,
      explicacao: 'CIV tem 7 caracteres (ex: PT-ABC, PR-XYZ).'
    },
    {
      id: 27,
      categoria: 'Regulamentação',
      pergunta: 'Zona de tráfego de aeródromo (ATZ) estende-se até:',
      alternativas: [
        '5 NM e 1500 pés',
        '5 NM e 3000 pés',
        '10 NM e 3000 pés',
        '15 NM e 5000 pés'
      ],
      respostaCorreta: 0,
      explicacao: 'ATZ normalmente se estende até 5 NM e 1500 pés AGL.'
    },
    {
      id: 28,
      categoria: 'Regulamentação',
      pergunta: 'A revalidação de PP requer, no mínimo:',
      alternativas: [
        '1 hora de voo nos últimos 12 meses',
        '5 horas de voo nos últimos 12 meses',
        '10 horas de voo nos últimos 24 meses',
        'Apenas CMA válido'
      ],
      respostaCorreta: 1,
      explicacao: 'Revalidação PP requer mínimo 5 horas de voo nos últimos 12 meses e CMA válido.'
    },
    {
      id: 29,
      categoria: 'Regulamentação',
      pergunta: 'Em pouso de emergência, a prioridade é:',
      alternativas: [
        'Proteger a aeronave',
        'Proteger vidas humanas',
        'Proteger a carga',
        'Evitar danos ao solo'
      ],
      respostaCorreta: 1,
      explicacao: 'Em emergência, a PRIORIDADE ABSOLUTA é proteger vidas humanas.'
    },
    {
      id: 30,
      categoria: 'Regulamentação',
      pergunta: 'O que significa FIR?',
      alternativas: [
        'Flight Information Region',
        'Flying Instruction Rules',
        'Final Instrument Region',
        'Flight Inspection Required'
      ],
      respostaCorreta: 0,
      explicacao: 'FIR = Flight Information Region (Região de Informação de Voo).'
    },

    // CONHECIMENTOS TÉCNICOS (30 questões - 20 serão sorteadas)
    {
      id: 31,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'O que causa o estol de uma aeronave?',
      alternativas: [
        'Velocidade excessiva',
        'Ângulo de ataque excessivo',
        'Altitude muito baixa',
        'Potência insuficiente'
      ],
      respostaCorreta: 1,
      explicacao: 'O estol ocorre quando o ângulo de ataque excede o ângulo crítico.'
    },
    {
      id: 32,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Qual a função do aileron?',
      alternativas: [
        'Controlar o arfagem',
        'Controlar o rolamento',
        'Controlar a guinada',
        'Aumentar a sustentação'
      ],
      respostaCorreta: 1,
      explicacao: 'Os ailerons controlam o movimento de rolamento (roll) em torno do eixo longitudinal.'
    },
    {
      id: 33,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'O que é densidade do ar?',
      alternativas: [
        'Peso do ar por unidade de volume',
        'Temperatura do ar ambiente',
        'Pressão atmosférica local',
        'Umidade relativa do ar'
      ],
      respostaCorreta: 0,
      explicacao: 'Densidade do ar é a massa de ar em um determinado volume.'
    },
    {
      id: 34,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Qual instrumento indica altitude em relação ao nível do mar?',
      alternativas: [
        'Altímetro',
        'Variômetro',
        'Velocímetro',
        'Horizonte Artificial'
      ],
      respostaCorreta: 0,
      explicacao: 'O altímetro indica altitude em relação a um datum (QNH = nível do mar).'
    },
    {
      id: 35,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'O que é P-fator?',
      alternativas: [
        'Pressão do combustível',
        'Tração assimétrica da hélice',
        'Potência do motor',
        'Fator de carga'
      ],
      respostaCorreta: 1,
      explicacao: 'P-factor é a tração assimétrica da hélice em alto ângulo de ataque.'
    },
    {
      id: 36,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Qual a função do compensador (trim)?',
      alternativas: [
        'Aumentar velocidade',
        'Reduzir força nos comandos',
        'Melhorar subida',
        'Economizar combustível'
      ],
      respostaCorreta: 1,
      explicacao: 'O trim alivia pressões nos comandos, permitindo voo sem esforço.'
    },
    {
      id: 37,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Performance em alta altitude:',
      alternativas: [
        'Melhora (ar mais denso)',
        'Piora (ar menos denso)',
        'Não altera',
        'Melhora apenas no frio'
      ],
      respostaCorreta: 1,
      explicacao: 'Em altitude o ar é menos denso, reduzindo potência e sustentação.'
    },
    {
      id: 38,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Velocidade de melhor planeio é próxima de:',
      alternativas: [
        'VNE',
        'VS',
        'VX',
        'VY'
      ],
      respostaCorreta: 3,
      explicacao: 'Velocidade de melhor planeio está próxima da VY.'
    },
    {
      id: 39,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'O que é densidade altitude?',
      alternativas: [
        'Altitude indicada',
        'Altitude corrigida pela temperatura',
        'Altitude de pressão + temperatura',
        'Altitude absoluta'
      ],
      respostaCorreta: 2,
      explicacao: 'Densidade altitude é altitude de pressão corrigida pela temperatura não-padrão.'
    },
    {
      id: 40,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Efeito do flap na decolagem:',
      alternativas: [
        'Reduz corrida mas reduz ângulo de subida',
        'Aumenta distância',
        'Não afeta',
        'Aumenta apenas velocidade'
      ],
      respostaCorreta: 0,
      explicacao: 'Flaps reduzem corrida mas também reduzem ângulo de subida (maior arrasto).'
    },
    {
      id: 41,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'O que é CG (Centro de Gravidade)?',
      alternativas: [
        'Ponto de maior peso',
        'Ponto onde se concentra todo peso',
        'Centro geométrico',
        'Fixação das asas'
      ],
      respostaCorreta: 1,
      explicacao: 'CG é o ponto onde se considera concentrado todo o peso da aeronave.'
    },
    {
      id: 42,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Função do carburador:',
      alternativas: [
        'Resfriar motor',
        'Misturar ar e combustível',
        'Lubrificar motor',
        'Gerar ignição'
      ],
      respostaCorreta: 1,
      explicacao: 'O carburador mistura ar e combustível na proporção adequada.'
    },
    {
      id: 43,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'O que indica o tacômetro?',
      alternativas: [
        'Velocidade da aeronave',
        'Rotação do motor (RPM)',
        'Temperatura do motor',
        'Pressão do óleo'
      ],
      respostaCorreta: 1,
      explicacao: 'O tacômetro indica RPM (rotações por minuto) do motor.'
    },
    {
      id: 44,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Gelo de carburador se forma por:',
      alternativas: [
        'Gelo no para-brisa',
        'Expansão e resfriamento no venturi',
        'Gelo nas asas',
        'Gelo no pitot'
      ],
      respostaCorreta: 1,
      explicacao: 'Gelo de carburador forma-se pela expansão/resfriamento do ar no venturi.'
    },
    {
      id: 45,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Sequência correta de cheque de magnetos:',
      alternativas: [
        'BOTH - L - R - BOTH',
        'L - R - BOTH - OFF',
        'BOTH - R - L - BOTH',
        'OFF - L - R - BOTH'
      ],
      respostaCorreta: 2,
      explicacao: 'Cheque: BOTH - RIGHT - LEFT - BOTH (sempre retornar para BOTH).'
    },
    {
      id: 46,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'O que é Vs0?',
      alternativas: [
        'Estol em configuração limpa',
        'Estol com flaps baixados',
        'Velocidade nunca exceder',
        'Velocidade de cruzeiro'
      ],
      respostaCorreta: 1,
      explicacao: 'Vs0 é velocidade de estol na configuração de pouso (trem e flaps baixados).'
    },
    {
      id: 47,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Torque do motor causa:',
      alternativas: [
        'Velocidade excessiva',
        'Reação à rotação da hélice',
        'Falha do motor',
        'Vento de través'
      ],
      respostaCorreta: 1,
      explicacao: 'Torque é a reação da fuselagem à rotação da hélice (3ª Lei de Newton).'
    },
    {
      id: 48,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Instrumento que funciona com tubo de pitot:',
      alternativas: [
        'Altímetro',
        'Velocímetro',
        'Horizonte Artificial',
        'Giro Direcional'
      ],
      respostaCorreta: 1,
      explicacao: 'O velocímetro utiliza pressão dinâmica do tubo de pitot.'
    },
    {
      id: 49,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'O que é fator de carga?',
      alternativas: [
        'Peso total',
        'Peso útil',
        'Relação sustentação/peso',
        'Capacidade do bagageiro'
      ],
      respostaCorreta: 2,
      explicacao: 'Fator de carga é a relação entre sustentação total e peso.'
    },
    {
      id: 50,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Combustível usado em motores convencionais:',
      alternativas: [
        'Querosene',
        'AVGAS 100LL',
        'Diesel',
        'JET-A1'
      ],
      respostaCorreta: 1,
      explicacao: 'Motores a pistão utilizam AVGAS 100LL (gasolina de aviação azul).'
    },
    {
      id: 51,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'VNE significa:',
      alternativas: [
        'Velocidade normal de cruzeiro',
        'Velocidade nunca exceder',
        'Velocidade de estol',
        'Velocidade de melhor subida'
      ],
      respostaCorreta: 1,
      explicacao: 'VNE (Never Exceed) é a velocidade que nunca deve ser excedida.'
    },
    {
      id: 52,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Efeito solo ocorre quando:',
      alternativas: [
        'Aeronave próxima ao solo',
        'Aeronave em altitude',
        'Aeronave em estol',
        'Aeronave com vento forte'
      ],
      respostaCorreta: 0,
      explicacao: 'Efeito solo ocorre quando aeronave está próxima ao solo (menos de 1 envergadura).'
    },
    {
      id: 53,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Razão de planeio 10:1 significa:',
      alternativas: [
        '10 metros horizontal para 1 vertical',
        '1 metro horizontal para 10 vertical',
        '10 pés por segundo de descida',
        '1 minuto para 10 metros'
      ],
      respostaCorreta: 0,
      explicacao: 'Razão 10:1 = 10 unidades horizontal para cada 1 vertical perdida.'
    },
    {
      id: 54,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'VX é a velocidade de:',
      alternativas: [
        'Melhor razão de subida',
        'Melhor ângulo de subida',
        'Cruzeiro econômico',
        'Estol'
      ],
      respostaCorreta: 1,
      explicacao: 'VX é a velocidade de melhor ângulo de subida (mais altitude em menor distância).'
    },
    {
      id: 55,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'VY é a velocidade de:',
      alternativas: [
        'Melhor ângulo de subida',
        'Melhor razão de subida',
        'Cruzeiro',
        'Estol'
      ],
      respostaCorreta: 1,
      explicacao: 'VY é a velocidade de melhor razão de subida (mais altitude em menor tempo).'
    },
    {
      id: 56,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Horizonte artificial indica:',
      alternativas: [
        'Altitude',
        'Atitude (arfagem e rolamento)',
        'Velocidade',
        'Direção'
      ],
      respostaCorreta: 1,
      explicacao: 'Horizonte artificial mostra atitude da aeronave (arfagem e rolamento).'
    },
    {
      id: 57,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Variômetro indica:',
      alternativas: [
        'Velocidade horizontal',
        'Razão de subida/descida',
        'Altitude',
        'Atitude'
      ],
      respostaCorreta: 1,
      explicacao: 'Variômetro (VSI) indica razão de subida ou descida em pés/minuto.'
    },
    {
      id: 58,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Indicador de curva e derrapagem mostra:',
      alternativas: [
        'Apenas a curva',
        'Curva e coordenação',
        'Apenas altitude',
        'Velocidade'
      ],
      respostaCorreta: 1,
      explicacao: 'Turn coordinator mostra razão de curva e coordenação (bolinha).'
    },
    {
      id: 59,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Manete de mistura controla:',
      alternativas: [
        'Potência do motor',
        'Proporção ar/combustível',
        'RPM',
        'Temperatura'
      ],
      respostaCorreta: 1,
      explicacao: 'Mixture controla a proporção ar/combustível (enriquecer/empobrecer).'
    },
    {
      id: 60,
      categoria: 'Conhecimentos Técnicos',
      pergunta: 'Aquaplanagem ocorre quando:',
      alternativas: [
        'Pista seca',
        'Filme de água entre pneu e pista',
        'Pista com gelo',
        'Vento forte'
      ],
      respostaCorreta: 1,
      explicacao: 'Aquaplanagem ocorre quando camada de água impede contato pneu/pista.'
    },

    // METEOROLOGIA (30 questões - 20 serão sorteadas)
    {
      id: 61,
      categoria: 'Meteorologia',
      pergunta: 'O que é METAR?',
      alternativas: [
        'Previsão de tempo',
        'Observação meteorológica de rotina',
        'Aviso de tempestade',
        'Carta de tempo significativo'
      ],
      respostaCorreta: 1,
      explicacao: 'METAR é observação meteorológica de rotina de aeródromo.'
    },
    {
      id: 62,
      categoria: 'Meteorologia',
      pergunta: 'Nuvem que indica turbulência severa:',
      alternativas: [
        'Stratus',
        'Cirrus',
        'Cumulonimbus',
        'Altocumulus'
      ],
      respostaCorreta: 2,
      explicacao: 'Cumulonimbus (CB) indica tempestade com turbulência severa - EVITAR!'
    },
    {
      id: 63,
      categoria: 'Meteorologia',
      pergunta: 'O que significa QNH?',
      alternativas: [
        'Pressão ao nível da pista',
        'Pressão ao nível do mar',
        'Pressão padrão (1013 hPa)',
        'Pressão na altitude de cruzeiro'
      ],
      respostaCorreta: 1,
      explicacao: 'QNH é ajuste altimétrico que indica altitude em relação ao nível do mar.'
    },
    {
      id: 64,
      categoria: 'Meteorologia',
      pergunta: 'Visibilidade em METAR "9999" significa:',
      alternativas: [
        '999 metros',
        '9 km',
        '10 km ou mais',
        '99 milhas'
      ],
      respostaCorreta: 2,
      explicacao: 'No METAR, 9999 indica visibilidade de 10km ou superior.'
    },
    {
      id: 65,
      categoria: 'Meteorologia',
      pergunta: 'O que é inversão térmica?',
      alternativas: [
        'Temperatura aumenta com altitude',
        'Temperatura diminui com altitude',
        'Temperatura constante',
        'Mudança brusca'
      ],
      respostaCorreta: 0,
      explicacao: 'Inversão térmica = temperatura aumenta com altitude (oposto do normal).'
    },
    {
      id: 66,
      categoria: 'Meteorologia',
      pergunta: 'CAVOK significa:',
      alternativas: [
        'Céu encoberto',
        'Condições visuais excelentes',
        'Chuva forte',
        'Ventos fortes'
      ],
      respostaCorreta: 1,
      explicacao: 'CAVOK = vis ≥10km, sem nuvens <5000ft, sem CB, sem tempo significativo.'
    },
    {
      id: 67,
      categoria: 'Meteorologia',
      pergunta: 'Nuvens altas (Cirrus) formam-se em:',
      alternativas: [
        'Abaixo de 2000m',
        'Entre 2000m e 6000m',
        'Acima de 6000m',
        'Ao nível do solo'
      ],
      respostaCorreta: 2,
      explicacao: 'Nuvens altas formam-se acima de 6000m (cristais de gelo).'
    },
    {
      id: 68,
      categoria: 'Meteorologia',
      pergunta: 'Ponto de orvalho é:',
      alternativas: [
        'Temperatura do ar',
        'Temperatura em que ar fica saturado',
        'Temperatura ao amanhecer',
        'Temperatura máxima'
      ],
      respostaCorreta: 1,
      explicacao: 'Ponto de orvalho = temperatura na qual ar se satura e vapor condensa.'
    },
    {
      id: 69,
      categoria: 'Meteorologia',
      pergunta: 'Nevoeiro se forma quando:',
      alternativas: [
        'Ar quente sobre água fria',
        'Ar resfria até ponto de orvalho',
        'Aumento da pressão',
        'Vento forte'
      ],
      respostaCorreta: 1,
      explicacao: 'Nevoeiro forma-se quando ar é resfriado até ponto de orvalho próximo ao solo.'
    },
    {
      id: 70,
      categoria: 'Meteorologia',
      pergunta: 'Vento 27015KT significa:',
      alternativas: [
        '270° com 15 mph',
        '270° com 15 nós',
        '27° com 015 km/h',
        '15° com 270 nós'
      ],
      respostaCorreta: 1,
      explicacao: '27015KT = direção 270° (oeste) com velocidade 15 nós.'
    },
    {
      id: 71,
      categoria: 'Meteorologia',
      pergunta: 'Código METAR para chuva moderada:',
      alternativas: [
        'RA',
        '-RA',
        '+RA',
        'SHRA'
      ],
      respostaCorreta: 0,
      explicacao: 'RA = chuva moderada; -RA = fraca; +RA = forte; SHRA = pancada.'
    },
    {
      id: 72,
      categoria: 'Meteorologia',
      pergunta: 'Frente fria é:',
      alternativas: [
        'Ar frio avançando sobre ar quente',
        'Ar quente avançando sobre ar frio',
        'Temperatura abaixo de 0°C',
        'Vento do polo'
      ],
      respostaCorreta: 0,
      explicacao: 'Frente fria = massa de ar frio avança e desloca ar quente (tempo severo).'
    },
    {
      id: 73,
      categoria: 'Meteorologia',
      pergunta: 'Diferença entre TAF e METAR:',
      alternativas: [
        'TAF é observação, METAR previsão',
        'TAF é previsão, METAR observação',
        'São a mesma coisa',
        'TAF apenas noturno'
      ],
      respostaCorreta: 1,
      explicacao: 'TAF é previsão; METAR é observação atual.'
    },
    {
      id: 74,
      categoria: 'Meteorologia',
      pergunta: 'Wind shear é causado por:',
      alternativas: [
        'Mudança abrupta de vento',
        'Vento constante',
        'Ausência de vento',
        'Vento de cauda'
      ],
      respostaCorreta: 0,
      explicacao: 'Wind shear = mudança súbita de velocidade/direção do vento (perigoso).'
    },
    {
      id: 75,
      categoria: 'Meteorologia',
      pergunta: 'Acima da altitude de transição, ajusta-se:',
      alternativas: [
        'QNH',
        '1013 hPa (29.92 inHg)',
        'QFE',
        'QNE'
      ],
      respostaCorreta: 1,
      explicacao: 'Acima da altitude de transição: ajuste 1013 hPa (altitude vira FL).'
    },
    {
      id: 76,
      categoria: 'Meteorologia',
      pergunta: 'Nuvens lenticulares indicam:',
      alternativas: [
        'Tempo bom',
        'Ondas de montanha e turbulência',
        'Chuva leve',
        'Céu limpo'
      ],
      respostaCorreta: 1,
      explicacao: 'Lenticulares = ondas de montanha, indicam turbulência severa.'
    },
    {
      id: 77,
      categoria: 'Meteorologia',
      pergunta: 'Perigo de voar abaixo de CB:',
      alternativas: [
        'Apenas chuva leve',
        'Turbulência severa e microburst',
        'Não há perigo',
        'Apenas vento fraco'
      ],
      respostaCorreta: 1,
      explicacao: 'Abaixo de CB: turbulência extrema, microburst, raios, granizo - EVITAR!'
    },
    {
      id: 78,
      categoria: 'Meteorologia',
      pergunta: 'BR no METAR significa:',
      alternativas: [
        'Chuva forte',
        'Névoa úmida',
        'Brisa',
        'Bruma seca'
      ],
      respostaCorreta: 1,
      explicacao: 'BR (Mist) = névoa úmida (visibilidade 1000m a 5000m).'
    },
    {
      id: 79,
      categoria: 'Meteorologia',
      pergunta: 'Característica de frente quente:',
      alternativas: [
        'Chegada rápida, tempo severo',
        'Chegada gradual, chuva contínua',
        'Sem nuvens',
        'Melhora imediata'
      ],
      respostaCorreta: 1,
      explicacao: 'Frente quente: chegada lenta, nuvens estratificadas, chuva contínua.'
    },
    {
      id: 80,
      categoria: 'Meteorologia',
      pergunta: 'O que é SIGMET?',
      alternativas: [
        'Observação de rotina',
        'Aviso de fenômenos perigosos',
        'Previsão de aeródromo',
        'Carta de vento'
      ],
      respostaCorreta: 1,
      explicacao: 'SIGMET = aviso de fenômenos meteorológicos perigosos (CB, turbulência, gelo).'
    },
    {
      id: 81,
      categoria: 'Meteorologia',
      pergunta: 'Stratus são nuvens:',
      alternativas: [
        'Altas e de bom tempo',
        'Baixas e estratificadas',
        'De desenvolvimento vertical',
        'Médias e instáveis'
      ],
      respostaCorreta: 1,
      explicacao: 'Stratus são nuvens baixas, estratificadas, geralmente com chuvisco.'
    },
    {
      id: 82,
      categoria: 'Meteorologia',
      pergunta: 'Cumulus indicam:',
      alternativas: [
        'Tempo estável',
        'Bom tempo se isolados',
        'Sempre tempestade',
        'Inversão térmica'
      ],
      respostaCorreta: 1,
      explicacao: 'Cumulus isolados indicam bom tempo; se agrupados podem evoluir para CB.'
    },
    {
      id: 83,
      categoria: 'Meteorologia',
      pergunta: 'FG no METAR significa:',
      alternativas: [
        'Nevoeiro (visibilidade < 1000m)',
        'Neblina',
        'Chuva',
        'Fumaça'
      ],
      respostaCorreta: 0,
      explicacao: 'FG (Fog) = nevoeiro com visibilidade menor que 1000m.'
    },
    {
      id: 84,
      categoria: 'Meteorologia',
      pergunta: 'Trovoadas formam-se em nuvens:',
      alternativas: [
        'Stratus',
        'Cirrus',
        'Cumulonimbus',
        'Altocumulus'
      ],
      respostaCorreta: 2,
      explicacao: 'Trovoadas, raios e granizo formam-se em Cumulonimbus.'
    },
    {
      id: 85,
      categoria: 'Meteorologia',
      pergunta: 'Visibilidade reduzida por fumaça é codificada:',
      alternativas: [
        'FG',
        'BR',
        'FU',
        'HZ'
      ],
      respostaCorreta: 2,
      explicacao: 'FU = Smoke (fumaça); HZ = Haze (névoa seca).'
    },
    {
      id: 86,
      categoria: 'Meteorologia',
      pergunta: 'QFE indica:',
      alternativas: [
        'Pressão ao nível do mar',
        'Pressão ao nível da pista',
        'Pressão padrão',
        'Altitude de transição'
      ],
      respostaCorreta: 1,
      explicacao: 'QFE = pressão ao nível da pista (altímetro indica altura acima da pista).'
    },
    {
      id: 87,
      categoria: 'Meteorologia',
      pergunta: 'Granizo é mais provável em:',
      alternativas: [
        'Nuvens baixas',
        'Cumulonimbus',
        'Cirrus',
        'Stratus'
      ],
      respostaCorreta: 1,
      explicacao: 'Granizo forma-se em CB devido às correntes verticais intensas.'
    },
    {
      id: 88,
      categoria: 'Meteorologia',
      pergunta: 'Microburst é:',
      alternativas: [
        'Vento horizontal',
        'Corrente descendente violenta',
        'Tipo de nuvem',
        'Pressão baixa'
      ],
      respostaCorreta: 1,
      explicacao: 'Microburst = corrente descendente violenta e localizada (muito perigosa).'
    },
    {
      id: 89,
      categoria: 'Meteorologia',
      pergunta: 'Temperatura decresce com altitude na:',
      alternativas: [
        'Troposfera',
        'Estratosfera',
        'Mesosfera',
        'Termosfera'
      ],
      respostaCorreta: 0,
      explicacao: 'Na troposfera (onde voamos), temperatura decresce com altitude.'
    },
    {
      id: 90,
      categoria: 'Meteorologia',
      pergunta: 'AIRMET é aviso de:',
      alternativas: [
        'Fenômenos severos',
        'Fenômenos moderados',
        'Apenas vento',
        'Apenas temperatura'
      ],
      respostaCorreta: 1,
      explicacao: 'AIRMET = aviso de fenômenos meteorológicos moderados; SIGMET = severos.'
    }
  ]

  // Função para embaralhar array
  const embaralharArray = (array) => {
    const novoArray = [...array]
    for (let i = novoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
    }
    return novoArray
  }

  // Função para selecionar questões aleatórias
  const selecionarQuestoesAleatorias = () => {
    const categorias = ['Regulamentação', 'Conhecimentos Técnicos', 'Meteorologia']
    let questoesSelecionadas = []

    categorias.forEach(categoria => {
      const questoesCategoria = bancoDeQuestoes.filter(q => q.categoria === categoria)
      const embaralhadas = embaralharArray(questoesCategoria)
      const selecionadas = embaralhadas.slice(0, 20) // Seleciona 20 de cada categoria
      
      // Embaralha alternativas de cada questão
      const comAlternativasEmbaralhadas = selecionadas.map(questao => {
        const alternativasComIndices = questao.alternativas.map((alt, idx) => ({
          texto: alt,
          indiceOriginal: idx
        }))
        
        const alternativasEmbaralhadas = embaralharArray(alternativasComIndices)
        
        // Encontra novo índice da resposta correta
        const novaRespostaCorreta = alternativasEmbaralhadas.findIndex(
          alt => alt.indiceOriginal === questao.respostaCorreta
        )
        
        return {
          ...questao,
          alternativas: alternativasEmbaralhadas.map(alt => alt.texto),
          respostaCorreta: novaRespostaCorreta
        }
      })
      
      questoesSelecionadas = [...questoesSelecionadas, ...comAlternativasEmbaralhadas]
    })

    // Embaralha todas as 60 questões
    return embaralharArray(questoesSelecionadas)
  }

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const dadosUsuario = localStorage.getItem('usuario')
    if (dadosUsuario) {
      setUsuario(JSON.parse(dadosUsuario))
    }
  }, [router])

  // Timer do simulado
  useEffect(() => {
    let intervalo
    if (simuladoIniciado && !mostrarResultado && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            finalizarSimulado()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalo)
  }, [simuladoIniciado, mostrarResultado, tempoRestante])

  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  const iniciarSimulado = () => {
    const novasQuestoes = selecionarQuestoesAleatorias()
    setQuestoesDoSimulado(novasQuestoes)
    setSimuladoIniciado(true)
    setQuestaoAtual(0)
    setRespostas({})
    setRespostaSelecionada(null)
    setMostrarResultado(false)
    setMostrarRevisao(false)
    setTempoRestante(7200)
  }

  const selecionarResposta = (indice) => {
    setRespostaSelecionada(indice)
  }

  const confirmarResposta = () => {
    if (respostaSelecionada !== null) {
      setRespostas({
        ...respostas,
        [questaoAtual]: respostaSelecionada
      })
      
      if (questaoAtual < questoesDoSimulado.length - 1) {
        setQuestaoAtual(questaoAtual + 1)
        setRespostaSelecionada(respostas[questaoAtual + 1] ?? null)
      }
    }
  }

  const voltarQuestao = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1)
      setRespostaSelecionada(respostas[questaoAtual - 1] ?? null)
    }
  }

  const irParaQuestao = (indice) => {
    setQuestaoAtual(indice)
    setRespostaSelecionada(respostas[indice] ?? null)
    setMostrarRevisao(false)
  }

  const finalizarSimulado = () => {
    setMostrarResultado(true)
    setSimuladoIniciado(false)
  }

  const calcularResultado = () => {
    let acertos = 0
    questoesDoSimulado.forEach((questao, indice) => {
      if (respostas[indice] === questao.respostaCorreta) {
        acertos++
      }
    })
    return {
      acertos,
      total: questoesDoSimulado.length,
      percentual: ((acertos / questoesDoSimulado.length) * 100).toFixed(1),
      aprovado: acertos >= 42 // 70% de 60 questões
    }
  }

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  // TELA INICIAL
  if (!simuladoIniciado && !mostrarResultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">✈️ Simulado PPL - ANAC</h1>
              <p className="text-blue-100">Prepare-se para a prova teórica oficial</p>
            </div>

            <div className="p-8">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">📋 Informações do Simulado</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-3">📝</span>
                    <strong className="mr-2">60 questões</strong> (20 Regulamentação, 20 Conhecimentos Técnicos, 20 Meteorologia)
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-3">⏱️</span>
                    <strong className="mr-2">Tempo:</strong> 2 horas
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-3">✅</span>
                    <strong className="mr-2">Aprovação:</strong> Mínimo 70% (42 acertos)
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 mr-3">🔀</span>
                    <strong className="mr-2">Questões aleatórias:</strong> A cada simulado questões e alternativas são embaralhadas
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
                <h3 className="font-bold text-yellow-900 mb-3">⚠️ Regras Importantes:</h3>
                <ul className="space-y-2 text-yellow-800 text-sm">
                  <li>• O cronômetro inicia automaticamente ao começar</li>
                  <li>• Você pode navegar entre questões e alterar respostas</li>
                  <li>• O simulado será finalizado automaticamente ao fim do tempo</li>
                  <li>• Certifique-se de estar em ambiente tranquilo</li>
                  <li>• Banco com 90+ questões - simulados sempre diferentes!</li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <button
                  onClick={iniciarSimulado}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-4 rounded-xl text-xl font-bold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition shadow-lg"
                >
                  🚀 Iniciar Simulado Aleatório
                </button>
                <div>
                  <button
                    onClick={() => router.push('/painel')}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    ← Voltar ao Painel
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center text-gray-500 text-sm">
                <p>✨ Questões e alternativas embaralhadas automaticamente</p>
                <p className="mt-1">Boa sorte, {usuario.nome}! ✈️</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // TELA DE RESULTADO (continua igual... código muito longo, mantido da versão anterior)
  if (mostrarResultado) {
    const resultado = calcularResultado()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className={`p-8 text-white ${resultado.aprovado ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
              <h1 className="text-4xl font-bold mb-2">
                {resultado.aprovado ? '🎉 APROVADO!' : '📚 NÃO APROVADO'}
              </h1>
              <p className="text-xl">
                {resultado.aprovado 
                  ? 'Parabéns! Você atingiu a nota mínima!'
                  : 'Continue estudando, você vai conseguir!'}
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-blue-600">{resultado.acertos}</div>
                  <div className="text-gray-600 mt-2">Acertos</div>
                </div>
                <div className="bg-red-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-red-600">{resultado.total - resultado.acertos}</div>
                  <div className="text-gray-600 mt-2">Erros</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl text-center">
                  <div className="text-4xl font-bold text-purple-600">{resultado.percentual}%</div>
                  <div className="text-gray-600 mt-2">Aproveitamento</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Desempenho por Categoria:</h3>
                {['Regulamentação', 'Conhecimentos Técnicos', 'Meteorologia'].map(categoria => {
                  const questoesCategoria = questoesDoSimulado.filter(q => q.categoria === categoria)
                  const acertosCategoria = questoesCategoria.filter((q, i) => {
                    const indiceGlobal = questoesDoSimulado.findIndex(qq => qq.id === q.id)
                    return respostas[indiceGlobal] === q.respostaCorreta
                  }).length
                  const percentualCategoria = ((acertosCategoria / questoesCategoria.length) * 100).toFixed(1)
                  
                  return (
                    <div key={categoria} className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-gray-700">{categoria}</span>
                        <span className="text-gray-600">{acertosCategoria}/{questoesCategoria.length} ({percentualCategoria}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${parseFloat(percentualCategoria) >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{width: `${percentualCategoria}%`}}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setMostrarRevisao(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  📖 Revisar Questões
                </button>
                <button
                  onClick={iniciarSimulado}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  🔄 Novo Simulado Aleatório
                </button>
                <button
                  onClick={() => router.push('/painel')}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 font-semibold"
                >
                  🏠 Voltar ao Painel
                </button>
              </div>
            </div>
          </div>

          {mostrarRevisao && (
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Revisão Completa</h2>
              {questoesDoSimulado.map((questao, indice) => {
                const respostaUsuario = respostas[indice]
                const acertou = respostaUsuario === questao.respostaCorreta
                
                return (
                  <div key={questao.id} className={`mb-6 p-6 rounded-lg border-2 ${acertou ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-600">{questao.categoria}</span>
                        <h3 className="text-lg font-bold text-gray-800 mt-1">
                          {indice + 1}. {questao.pergunta}
                        </h3>
                      </div>
                      <span className={`text-2xl ${acertou ? '✅' : '❌'}`}></span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {questao.alternativas.map((alt, i) => (
                        <div 
                          key={i}
                          className={`p-3 rounded ${
                            i === questao.respostaCorreta ? 'bg-green-200 border-2 border-green-500 font-semibold' :
                            i === respostaUsuario && !acertou ? 'bg-red-200 border-2 border-red-500' :
                            'bg-white border border-gray-300'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}) {alt}
                          {i === questao.respostaCorreta && <span className="ml-2 text-green-700">✓ Correta</span>}
                          {i === respostaUsuario && !acertou && <span className="ml-2 text-red-700">✗ Sua resposta</span>}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                      <p className="text-sm text-gray-700"><strong>💡 Explicação:</strong> {questao.explicacao}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // TELA DO SIMULADO EM ANDAMENTO
  const questao = questoesDoSimulado[questaoAtual]
  const progresso = ((Object.keys(respostas).length / questoesDoSimulado.length) * 100).toFixed(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header com timer e progresso */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Simulado PPL - ANAC 🔀</h1>
              <p className="text-gray-600">Questão {questaoAtual + 1} de {questoesDoSimulado.length}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${tempoRestante < 600 ? 'text-red-600' : 'text-blue-600'}`}>
                  ⏱️ {formatarTempo(tempoRestante)}
                </div>
                <div className="text-sm text-gray-600">Tempo restante</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{progresso}%</div>
                <div className="text-sm text-gray-600">Respondidas</div>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{width: `${((questaoAtual + 1) / questoesDoSimulado.length) * 100}%`}}
            ></div>
          </div>
        </div>

        {/* Questão */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              {questao.categoria}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {questaoAtual + 1}. {questao.pergunta}
          </h2>
          
          <div className="space-y-4">
            {questao.alternativas.map((alternativa, indice) => (
              <button
                key={indice}
                onClick={() => selecionarResposta(indice)}
                className={`w-full p-5 rounded-xl text-left transition transform hover:scale-[1.02] ${
                  respostaSelecionada === indice
                    ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  <span className={`font-bold text-lg mr-4 ${
                    respostaSelecionada === indice ? 'text-white' : 'text-blue-600'
                  }`}>
                    {String.fromCharCode(65 + indice)})
                  </span>
                  <span className="text-lg">{alternativa}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navegação */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={voltarQuestao}
              disabled={questaoAtual === 0}
              className={`px-6 py-3 rounded-lg font-semibold ${
                questaoAtual === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              ← Anterior
            </button>

            <button
              onClick={confirmarResposta}
              disabled={respostaSelecionada === null}
              className={`px-8 py-3 rounded-lg font-semibold ${
                respostaSelecionada === null
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
              }`}
            >
              {questaoAtual === questoesDoSimulado.length - 1 ? 'Última Questão ✓' : 'Confirmar e Próxima →'}
            </button>

            {questaoAtual === questoesDoSimulado.length - 1 && Object.keys(respostas).length === questoesDoSimulado.length && (
              <button
                onClick={finalizarSimulado}
                className="px-8 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 shadow-lg"
              >
                🏁 Finalizar Simulado
              </button>
            )}
          </div>

          {/* Mapa de navegação */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Ir para questão:</h3>
            <div className="grid grid-cols-10 gap-2">
              {questoesDoSimulado.map((_, indice) => (
                <button
                  key={indice}
                  onClick={() => irParaQuestao(indice)}
                  className={`w-full aspect-square rounded-lg font-semibold text-sm transition ${
                    indice === questaoAtual
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : respostas[indice] !== undefined
                      ? 'bg-green-200 text-green-800 hover:bg-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {indice + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
