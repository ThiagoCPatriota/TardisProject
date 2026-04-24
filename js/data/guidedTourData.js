// ============================================
// T.A.R.D.I.S. — GUIDED TOUR DATA (Doctor Who)
// Perguntas extraídas dos dados em planetsData.js
// e planetDetails.js
// ============================================

export var GUIDED_TOUR_DATA = [
    {
        planetNameEN: 'Sun',
        question: 'Qual a porcentagem da massa do Sistema Solar que o Sol contém?',
        options: ['75,5%', '50,0%', '99,86%', '89,2%'],
        correctIndex: 2,
        doctorIntro: 'Allons-y! Nossa primeira parada é a estrela mais importante desta vizinhança. O Sol! Eu já estive perto dele algumas vezes — não recomendo sem proteção nível TARDIS. Vejamos o que você sabe...',
        doctorCorrect: 'Fantástico! 99,86% — praticamente tudo! Você seria um excelente companheiro de viagem!',
        doctorWrong: 'Hmm, não é bem isso. Dê uma olhada na descrição do Sol e tente novamente. A resposta está ali!'
    },
    {
        planetNameEN: 'Mercury',
        question: 'Qual a variação de temperatura entre dia e noite em Mercúrio?',
        options: ['Mais de 200°C', 'Mais de 400°C', 'Mais de 600°C', 'Mais de 100°C'],
        correctIndex: 2,
        doctorIntro: 'Mercúrio! O mensageiro veloz. Tão perto do Sol que dá para sentir o calor daqui da TARDIS. Mas atenção — as noites são GELADAS. Vamos ver se você consegue...',
        doctorCorrect: 'Brilhante! De -180°C a 430°C — são mais de 600 graus de diferença! Você realmente presta atenção!',
        doctorWrong: 'Quase! Olhe os dados técnicos — temperatura máxima e mínima. Faça a conta e tente de novo!'
    },
    {
        planetNameEN: 'Venus',
        question: 'Por que um dia em Vênus é especial comparado ao seu ano?',
        options: [
            'O dia é mais curto que o ano',
            'O dia dura exatamente igual ao ano',
            'O dia é mais longo que o ano',
            'Vênus não tem dias — é sempre noite'
        ],
        correctIndex: 2,
        doctorIntro: 'Vênus! O gêmeo maligno da Terra. Chuva de ácido sulfúrico, pressão de esmagar submarinos e... uma peculiaridade temporal muito curiosa. Preste atenção nos detalhes...',
        doctorCorrect: 'Exato! 243 dias terrestres de rotação contra 225 dias de órbita. O dia é mais longo que o ano! Paradoxo temporal? Quase!',
        doctorWrong: 'Não é essa. Leia as curiosidades de Vênus com atenção — a relação entre rotação e órbita é fascinante!'
    },
    {
        planetNameEN: 'Earth',
        question: 'Qual a porcentagem da superfície da Terra coberta por oceanos?',
        options: ['51%', '71%', '85%', '62%'],
        correctIndex: 1,
        doctorIntro: 'Ah, a Terra! Meu planeta favorito. Já salvei este lugar tantas vezes que perdi a conta. Um pálido ponto azul no cosmos... Mas será que você realmente conhece seu próprio lar?',
        doctorCorrect: 'Correto! 71% de água — por isso ela é tão azul vista do espaço. Sempre me emociono com essa visão.',
        doctorWrong: 'Hmm, você mora aqui e não sabe? Olhe a descrição da Terra — a resposta está logo no início!'
    },
    {
        planetNameEN: 'Mars',
        question: 'Qual é a altura do Olympus Mons, o maior vulcão do Sistema Solar?',
        options: ['8,8 km', '15,2 km', '21,9 km', '32,5 km'],
        correctIndex: 2,
        doctorIntro: 'Marte! O Planeta Vermelho. Já conheci civilizações marcianas em algumas linhas temporais. Mas nesta, o mais impressionante é a geologia. Preste atenção nos números...',
        doctorCorrect: 'Perfeito! 21,9 km de altura — quase 3 vezes o Everest! E a base é do tamanho da França. Impressionante, não?',
        doctorWrong: 'Não exatamente. Verifique as curiosidades de Marte — o Olympus Mons é mencionado com precisão!'
    },
    {
        planetNameEN: 'Jupiter',
        question: 'Há quanto tempo a Grande Mancha Vermelha de Júpiter está ativa?',
        options: ['50 anos', '100 anos', '200 anos', 'Mais de 400 anos'],
        correctIndex: 3,
        doctorIntro: 'Júpiter! O gigante. O protetor. Este planeta já desviou tantos asteroides da Terra que merece uma medalha cósmica. Mas sua característica mais famosa é...',
        doctorCorrect: 'Excelente! Mais de 400 anos de tempestade ininterrupta, maior que a Terra inteira. Alguns dos meus inimigos são menos persistentes!',
        doctorWrong: 'Não é essa. A resposta está nas curiosidades de Júpiter — procure pela Grande Mancha Vermelha!'
    },
    {
        planetNameEN: 'Saturn',
        question: 'Qual a característica única de Saturno em relação à água?',
        options: [
            'Saturno é feito 90% de água',
            'Saturno flutuaria na água',
            'Saturno tem oceanos de água líquida',
            'A água ferve instantaneamente em Saturno'
        ],
        correctIndex: 1,
        doctorIntro: 'Saturno! A joia do Sistema Solar. Esses anéis... eu nunca me canso. Mas Saturno guarda um segredo físico muito curioso. Explore os detalhes...',
        doctorCorrect: 'Isso mesmo! Com densidade de 0,687 g/cm³, Saturno é menos denso que a água. Flutuaria como uma boia cósmica! Genial!',
        doctorWrong: 'Quase lá! Olhe as curiosidades de Saturno — uma delas fala sobre densidade e água. É surpreendente!'
    },
    {
        planetNameEN: 'Uranus',
        question: 'Qual é a inclinação axial de Urano que o faz "rolar" pelo espaço?',
        options: ['45°', '67°', '98°', '120°'],
        correctIndex: 2,
        doctorIntro: 'Urano! O planeta que decidiu ser diferente de todos os outros. Literalmente "deitou" no espaço e disse "vou orbitar assim mesmo". Descubra o quanto...',
        doctorCorrect: 'Perfeito! 98 graus de inclinação — ele basicamente rola em torno do Sol! Até para um Senhor do Tempo, isso é incomum.',
        doctorWrong: 'Não é esse valor. Confira a descrição de Urano — a inclinação axial é mencionada com precisão!'
    },
    {
        planetNameEN: 'Neptune',
        question: 'Qual a velocidade máxima dos ventos em Netuno?',
        options: ['800 km/h', '1.200 km/h', '1.600 km/h', '2.100 km/h'],
        correctIndex: 3,
        doctorIntro: 'Netuno! A fronteira do Sistema Solar. O planeta mais ventoso que existe. Nem a TARDIS consegue ficar estável aqui. Última pergunta — vamos ver se você chega até o fim!',
        doctorCorrect: 'BRILHANTE! 2.100 km/h — ventos absolutamente insanos! Você completou a viagem com maestria! Allons-y!',
        doctorWrong: 'Tão perto do fim! Confira os dados de Netuno — a velocidade dos ventos é destaque principal!'
    }
];
