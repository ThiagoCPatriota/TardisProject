// ============================================
// T.A.R.D.I.S. — DETALHES DOS PLANETAS (MODAL)
// ============================================

export const PLANET_DETAILS_DATA = {
    'Sun': {
        subtitle: 'A estrela que sustenta toda a vida no Sistema Solar',
        description: 'O Sol é uma estrela de tipo espectral G2V, uma anã amarela, localizada no braço de Órion da Via Láctea. Ele é responsável por 99,86% de toda a massa do Sistema Solar. Através de reações de fusão nuclear, converte cerca de 600 milhões de toneladas de hidrogênio em hélio a cada segundo, liberando uma quantidade enorme de energia. A luz do Sol leva aproximadamente 8 minutos e 20 segundos para chegar à Terra. Sua atividade magnética gera fenômenos como manchas solares, proeminências e ejeções de massa coronal que podem afetar sistemas de comunicação na Terra.',
        stats: [
            { label: 'Tipo', value: 'G2V', unit: 'Anã Amarela' },
            { label: 'Diâmetro', value: '1.392.700', unit: 'km' },
            { label: 'Massa', value: '1,989 × 10³⁰', unit: 'kg' },
            { label: 'Temp. Superfície', value: '5.500', unit: '°C' },
            { label: 'Temp. Núcleo', value: '15.000.000', unit: '°C' },
            { label: 'Idade', value: '4,6', unit: 'bilhões de anos' },
            { label: 'Composição', value: '73% H, 25% He', unit: '' },
            { label: 'Luminosidade', value: '3,828 × 10²⁶', unit: 'watts' }
        ],
        curiosities: [
            { icon: '🌡️', text: 'A temperatura no núcleo do Sol é de 15 milhões de °C — quente o suficiente para fundir hidrogênio em hélio.' },
            { icon: '⚡', text: 'A cada segundo, o Sol converte 4 milhões de toneladas de matéria em energia pura (E=mc²).' },
            { icon: '🔄', text: 'O Sol completa uma rotação a cada 25 dias no equador e 35 dias nos polos — rotação diferencial!' },
            { icon: '💨', text: 'O vento solar viaja a 400-750 km/s e cria a heliosfera, uma bolha que envolve todo o sistema solar.' },
            { icon: '🔍', text: 'Cerca de 1,3 milhão de Terras caberiam dentro do Sol.' }
        ],
        missions: [
            { year: '1990', name: 'Ulysses', desc: 'Missão conjunta ESA/NASA para estudar os polos do Sol.' },
            { year: '1995', name: 'SOHO', desc: 'Observatório Solar e Heliosférico — monitoramento contínuo do Sol.' },
            { year: '2006', name: 'STEREO', desc: 'Duas sondas para observar o Sol em estéreo 3D.' },
            { year: '2018', name: 'Parker Solar Probe', desc: 'A nave mais rápida já construída, voando pela atmosfera do Sol.' },
            { year: '2020', name: 'Solar Orbiter', desc: 'Missão da ESA para observar os polos do Sol de perto.' }
        ]
    },
    'Mercury': {
        subtitle: 'O mensageiro dos deuses — o planeta mais rápido',
        description: 'Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol. Sua superfície é marcada por crateras, semelhante à Lua, resultado de bilhões de anos de impactos. Apesar de ser o planeta mais próximo do Sol, não é o mais quente — esse título pertence a Vênus. Mercúrio praticamente não possui atmosfera, o que resulta em variações extremas de temperatura: de -180°C no lado noturno a 430°C no lado diurno. Um ano em Mercúrio dura apenas 88 dias terrestres.',
        stats: [
            { label: 'Diâmetro', value: '4.879', unit: 'km' },
            { label: 'Massa', value: '3,301 × 10²³', unit: 'kg' },
            { label: 'Gravidade', value: '3,7', unit: 'm/s²' },
            { label: 'Temp. Máx', value: '430', unit: '°C' },
            { label: 'Temp. Mín', value: '-180', unit: '°C' },
            { label: 'Órbita', value: '88', unit: 'dias' },
            { label: 'Distância do Sol', value: '57,9', unit: 'milhões km' },
            { label: 'Luas', value: '0', unit: '' }
        ],
        curiosities: [
            { icon: '🏃', text: 'Mercúrio orbita o Sol a 170.500 km/h — o planeta mais rápido do sistema solar.' },
            { icon: '🌡️', text: 'A variação de temperatura entre dia e noite é de mais de 600°C.' },
            { icon: '🔍', text: 'Mercúrio é tão denso que seu núcleo de ferro ocupa 85% do raio do planeta.' },
            { icon: '🎵', text: 'Crateras em Mercúrio são nomeadas com artistas: Beethoven, Shakespeare, Tolkien.' },
            { icon: '🔅', text: 'Um dia solar em Mercúrio (nascer ao nascer do sol) dura 176 dias terrestres.' }
        ],
        missions: [
            { year: '1974', name: 'Mariner 10', desc: 'Primeira nave a visitar Mercúrio — mapeou 45% da superfície.' },
            { year: '2004', name: 'MESSENGER', desc: 'Orbitou Mercúrio por 4 anos, mapeando toda a superfície.' },
            { year: '2018', name: 'BepiColombo', desc: 'Missão conjunta ESA/JAXA a caminho de Mercúrio.' }
        ]
    },
    'Venus': {
        subtitle: 'O gêmeo maligno da Terra — um inferno de efeito estufa',
        description: 'Vênus é frequentemente chamado de planeta irmão da Terra por seu tamanho similar, mas as semelhanças param por aí. Sua atmosfera densa de dióxido de carbono cria o efeito estufa mais extremo do sistema solar, com temperatura superficial de 465°C — quente o suficiente para derreter chumbo. Chuvas de ácido sulfúrico nunca chegam ao solo, evaporando antes. Vênus gira ao contrário dos outros planetas (rotação retrógrada), e um dia em Vênus dura mais que um ano venusiano.',
        stats: [
            { label: 'Diâmetro', value: '12.104', unit: 'km' },
            { label: 'Massa', value: '4,867 × 10²⁴', unit: 'kg' },
            { label: 'Gravidade', value: '8,87', unit: 'm/s²' },
            { label: 'Temp. Superfície', value: '465', unit: '°C' },
            { label: 'Pressão Atm.', value: '92', unit: 'atm' },
            { label: 'Órbita', value: '225', unit: 'dias' },
            { label: 'Distância do Sol', value: '108,2', unit: 'milhões km' },
            { label: 'Luas', value: '0', unit: '' }
        ],
        curiosities: [
            { icon: '🔄', text: 'Vênus gira ao contrário — o Sol nasce no oeste e se põe no leste.' },
            { icon: '⏰', text: 'Um dia em Vênus (243 dias terrestres) é mais longo que seu ano (225 dias).' },
            { icon: '🌧️', text: 'Chove ácido sulfúrico em Vênus, mas as gotas evaporam antes de tocar o solo.' },
            { icon: '💪', text: 'A pressão na superfície é equivalente a estar a 900m de profundidade no oceano.' },
            { icon: '⭐', text: 'Vênus é o objeto mais brilhante no céu depois do Sol e da Lua.' }
        ],
        missions: [
            { year: '1970', name: 'Venera 7', desc: 'Primeira nave a pousar em outro planeta e transmitir dados.' },
            { year: '1982', name: 'Venera 13', desc: 'Primeiras fotos coloridas da superfície de Vênus.' },
            { year: '1990', name: 'Magellan', desc: 'Mapeou 98% da superfície com radar.' },
            { year: '2006', name: 'Venus Express', desc: 'Missão da ESA que estudou a atmosfera por 8 anos.' },
            { year: '2031', name: 'VERITAS & DAVINCI', desc: 'Missões futuras da NASA para estudar Vênus em detalhe.' }
        ]
    },
    'Earth': {
        subtitle: 'O pálido ponto azul — nosso lar no cosmos',
        description: 'A Terra é o terceiro planeta do Sistema Solar e o único conhecido por abrigar vida. Com 71% de sua superfície coberta por oceanos, é um mundo dominado por água líquida. Sua atmosfera de nitrogênio e oxigênio, combinada com o campo magnético gerado pelo núcleo de ferro líquido, protege a vida da radiação solar e cósmica. A Terra possui uma lua natural que estabiliza sua inclinação axial, criando as estações do ano. Nosso planeta é geologicamente ativo, com placas tectônicas que constantemente redesenham continentes.',
        stats: [
            { label: 'Diâmetro', value: '12.742', unit: 'km' },
            { label: 'Massa', value: '5,972 × 10²⁴', unit: 'kg' },
            { label: 'Gravidade', value: '9,81', unit: 'm/s²' },
            { label: 'Temp. Média', value: '15', unit: '°C' },
            { label: 'Atmosfera', value: '78% N₂, 21% O₂', unit: '' },
            { label: 'Órbita', value: '365,25', unit: 'dias' },
            { label: 'Distância do Sol', value: '149,6', unit: 'milhões km' },
            { label: 'Luas', value: '1', unit: '(Lua)' }
        ],
        curiosities: [
            { icon: '🌊', text: '97% da água da Terra é salgada. Apenas 3% é doce, e 2/3 disso está em geleiras.' },
            { icon: '🌋', text: 'Existem cerca de 1.500 vulcões ativos. A placa do Pacífico tem o "Anel de Fogo".' },
            { icon: '⚡', text: 'Cerca de 8 milhões de raios atingem a Terra todos os dias.' },
            { icon: '🧲', text: 'O campo magnético da Terra inverte seus polos a cada 200-300 mil anos.' },
            { icon: '🏔️', text: 'O ponto mais alto é o Everest (8.849m), mas da base ao topo, o Mauna Kea tem 10.210m.' }
        ],
        missions: [
            { year: '1957', name: 'Sputnik 1', desc: 'Primeiro satélite artificial em órbita da Terra.' },
            { year: '1961', name: 'Vostok 1 (Gagarin)', desc: 'Primeiro ser humano no espaço.' },
            { year: '1969', name: 'Apollo 11', desc: 'Primeiro pouso humano na Lua — "Um pequeno passo..."' },
            { year: '1998', name: 'ISS', desc: 'Início da construção da Estação Espacial Internacional.' },
            { year: '2020', name: 'Crew Dragon', desc: 'SpaceX leva astronautas da NASA à ISS — nova era comercial.' }
        ]
    },
    'Mars': {
        subtitle: 'O planeta vermelho — próximo destino da humanidade',
        description: 'Marte é o quarto planeta do Sistema Solar, conhecido como o Planeta Vermelho devido ao óxido de ferro (ferrugem) em sua superfície. Possui o maior vulcão do sistema solar, Olympus Mons (21,9 km de altura), e o maior cânion, Valles Marineris (4.000 km de comprimento). Evidências sugerem que Marte já teve oceanos de água líquida bilhões de anos atrás. Atualmente, vários rovers, incluindo Perseverance e Curiosity, exploram sua superfície em busca de sinais de vida passada.',
        stats: [
            { label: 'Diâmetro', value: '6.779', unit: 'km' },
            { label: 'Massa', value: '6,417 × 10²³', unit: 'kg' },
            { label: 'Gravidade', value: '3,72', unit: 'm/s²' },
            { label: 'Temp. Média', value: '-63', unit: '°C' },
            { label: 'Atmosfera', value: '95% CO₂', unit: '' },
            { label: 'Órbita', value: '687', unit: 'dias' },
            { label: 'Distância do Sol', value: '227,9', unit: 'milhões km' },
            { label: 'Luas', value: '2', unit: '(Fobos, Deimos)' }
        ],
        curiosities: [
            { icon: '🌋', text: 'Olympus Mons tem 21,9 km de altura — quase 3x o Everest. Base do tamanho da França.' },
            { icon: '🏜️', text: 'Valles Marineris tem 4.000 km — tão longo quanto os EUA de costa a costa.' },
            { icon: '🤖', text: 'O rover Perseverance tem um helicóptero chamado Ingenuity — primeiro voo em outro planeta.' },
            { icon: '💎', text: 'Existem tempestades de poeira em Marte que cobrem o planeta inteiro por meses.' },
            { icon: '🔴', text: 'Marte é vermelho porque seu solo é rico em óxido de ferro — basicamente ferrugem.' }
        ],
        missions: [
            { year: '1965', name: 'Mariner 4', desc: 'Primeira nave a fotografar Marte de perto.' },
            { year: '1976', name: 'Viking 1 & 2', desc: 'Primeiros pousos bem-sucedidos em Marte.' },
            { year: '2004', name: 'Spirit & Opportunity', desc: 'Rovers gêmeos — Opportunity operou por 15 anos!' },
            { year: '2012', name: 'Curiosity', desc: 'Rover de 1 tonelada no Crater Gale — ainda ativo.' },
            { year: '2021', name: 'Perseverance + Ingenuity', desc: 'Rover com drone. Coletando amostras para retorno à Terra.' }
        ]
    },
    'Jupiter': {
        subtitle: 'O gigante gasoso — protetor do Sistema Solar',
        description: 'Júpiter é o maior planeta do Sistema Solar, com massa 2,5 vezes maior que todos os outros planetas combinados. Sua famosa Grande Mancha Vermelha é uma tempestade anticiclônica ativa há pelo menos 400 anos, maior que a Terra inteira. Júpiter possui pelo menos 95 luas conhecidas, incluindo as 4 luas galileanas: Io (a mais vulcânica), Europa (oceano subterrâneo), Ganimedes (maior lua do sistema solar) e Calisto. Sua forte gravidade ajuda a desviar asteroides, protegendo os planetas internos.',
        stats: [
            { label: 'Diâmetro', value: '139.820', unit: 'km' },
            { label: 'Massa', value: '1,898 × 10²⁷', unit: 'kg' },
            { label: 'Gravidade', value: '24,79', unit: 'm/s²' },
            { label: 'Temp. Nuvens', value: '-108', unit: '°C' },
            { label: 'Composição', value: '90% H₂, 10% He', unit: '' },
            { label: 'Órbita', value: '12', unit: 'anos' },
            { label: 'Distância do Sol', value: '778,5', unit: 'milhões km' },
            { label: 'Luas', value: '95+', unit: '' }
        ],
        curiosities: [
            { icon: '🌀', text: 'A Grande Mancha Vermelha é uma tempestade maior que a Terra, ativa há 400+ anos.' },
            { icon: '🛡️', text: 'Júpiter é o "aspirador cósmico" — sua gravidade desvia asteroides que ameaçariam a Terra.' },
            { icon: '🌊', text: 'A lua Europa pode ter um oceano de água líquida sob sua crosta de gelo — candidata a vida.' },
            { icon: '⚡', text: 'Os raios de Júpiter são 1.000x mais poderosos que os da Terra.' },
            { icon: '🔄', text: 'Júpiter gira tão rápido (10h) que é visivelmente achatado nos polos.' }
        ],
        missions: [
            { year: '1973', name: 'Pioneer 10', desc: 'Primeira nave a atravessar o cinturão de asteroides e sobrevoar Júpiter.' },
            { year: '1979', name: 'Voyager 1 & 2', desc: 'Descobriram os anéis de Júpiter e vulcões em Io.' },
            { year: '1995', name: 'Galileo', desc: 'Primeira sonda a orbitar Júpiter — 8 anos de dados.' },
            { year: '2016', name: 'Juno', desc: 'Em órbita polar, estudando o interior e magnetosfera.' },
            { year: '2024', name: 'Europa Clipper', desc: 'Missão para investigar a habitabilidade de Europa.' }
        ]
    },
    'Saturn': {
        subtitle: 'O senhor dos anéis — a joia do Sistema Solar',
        description: 'Saturno é o sexto planeta do Sistema Solar e famoso por seu espetacular sistema de anéis, composto principalmente de partículas de gelo e rocha. Apesar de ser o segundo maior planeta, é tão pouco denso que flutuaria na água (se houvesse uma banheira grande o suficiente). Sua lua Titã é a única lua do sistema solar com atmosfera densa e lagos de metano líquido na superfície. Encélado, outra lua, possui jatos de água que indicam um oceano subterrâneo — outro candidato a vida.',
        stats: [
            { label: 'Diâmetro', value: '116.460', unit: 'km' },
            { label: 'Massa', value: '5,683 × 10²⁶', unit: 'kg' },
            { label: 'Gravidade', value: '10,44', unit: 'm/s²' },
            { label: 'Temp. Nuvens', value: '-139', unit: '°C' },
            { label: 'Composição', value: '96% H₂, 3% He', unit: '' },
            { label: 'Órbita', value: '29,4', unit: 'anos' },
            { label: 'Distância do Sol', value: '1.434', unit: 'milhões km' },
            { label: 'Luas', value: '146+', unit: '' }
        ],
        curiosities: [
            { icon: '💍', text: 'Os anéis de Saturno se estendem por 282.000 km, mas têm apenas ~10m de espessura.' },
            { icon: '🏊', text: 'Saturno flutuaria na água — sua densidade (0,687 g/cm³) é menor que a da água.' },
            { icon: '🌊', text: 'Encélado ejeta jatos de água que contêm compostos orgânicos — possível vida!' },
            { icon: '🌫️', text: 'Titã tem lagos de metano e etano — são os únicos lagos estáveis fora da Terra.' },
            { icon: '💨', text: 'Ventos em Saturno podem chegar a 1.800 km/h — 5x furacões terrestres.' }
        ],
        missions: [
            { year: '1979', name: 'Pioneer 11', desc: 'Primeira nave a sobrevoar Saturno — descobriu o anel F.' },
            { year: '1981', name: 'Voyager 2', desc: 'Revelou detalhes dos anéis e luas de Saturno.' },
            { year: '2004', name: 'Cassini-Huygens', desc: '13 anos orbitando Saturno — Huygens pousou em Titã.' },
            { year: '2017', name: 'Grand Finale', desc: 'Cassini mergulhou nos anéis de Saturno em sacrifício final.' },
            { year: '2027', name: 'Dragonfly', desc: 'Drone que voará sobre a superfície de Titã — lançamento previsto.' }
        ]
    },
    'Uranus': {
        subtitle: 'O gigante de gelo deitado — o planeta que rola',
        description: 'Urano é o sétimo planeta do Sistema Solar e um dos dois "gigantes de gelo". Sua característica mais notável é sua inclinação axial extrema de 98°, fazendo com que ele essencialmente "role" ao redor do Sol de lado. Isso significa que seus polos recebem mais luz solar do que o equador. Urano tem 27 luas conhecidas, todas nomeadas com personagens de Shakespeare e Alexander Pope. Foi visitado apenas uma vez, pela Voyager 2 em 1986. Sua cor azul-esverdeada vem do metano em sua atmosfera.',
        stats: [
            { label: 'Diâmetro', value: '50.724', unit: 'km' },
            { label: 'Massa', value: '8,681 × 10²⁵', unit: 'kg' },
            { label: 'Gravidade', value: '8,87', unit: 'm/s²' },
            { label: 'Temp. Mín', value: '-224', unit: '°C' },
            { label: 'Composição', value: 'H₂, He, CH₄', unit: '' },
            { label: 'Órbita', value: '84', unit: 'anos' },
            { label: 'Distância do Sol', value: '2.871', unit: 'milhões km' },
            { label: 'Luas', value: '27', unit: '' }
        ],
        curiosities: [
            { icon: '🔄', text: 'Urano é o único planeta que gira "deitado" — inclinação axial de 98°.' },
            { icon: '🥶', text: 'É o planeta mais frio do sistema solar (-224°C), mais frio que Netuno.' },
            { icon: '📚', text: 'Todas as luas de Urano são nomeadas com personagens de Shakespeare e Pope.' },
            { icon: '💎', text: 'Pode chover diamantes dentro de Urano, devido à pressão extrema sobre o metano.' },
            { icon: '🔭', text: 'Urano foi o primeiro planeta descoberto com telescópio (William Herschel, 1781).' }
        ],
        missions: [
            { year: '1986', name: 'Voyager 2', desc: 'Única nave a visitar Urano — descobriu 10 luas e 2 anéis.' },
            { year: '2030s', name: 'Uranus Orbiter (proposta)', desc: 'Missão prioritária recomendada pela NASA para a década de 2030.' }
        ]
    },
    'Neptune': {
        subtitle: 'O planeta do vento furioso — fronteira do sistema solar',
        description: 'Netuno é o planeta mais distante do Sol e o mais ventoso do Sistema Solar, com ventos que ultrapassam 2.100 km/h. Sua cor azul intensa vem do metano em sua atmosfera, que absorve luz vermelha. Netuno foi o primeiro planeta descoberto por cálculos matemáticos antes de ser observado. Sua lua principal, Tritão, é um dos objetos mais frios do sistema solar (-235°C) e orbita na direção oposta ao giro de Netuno, sugerindo que foi capturada do Cinturão de Kuiper.',
        stats: [
            { label: 'Diâmetro', value: '49.244', unit: 'km' },
            { label: 'Massa', value: '1,024 × 10²⁶', unit: 'kg' },
            { label: 'Gravidade', value: '11,15', unit: 'm/s²' },
            { label: 'Temp. Nuvens', value: '-214', unit: '°C' },
            { label: 'Composição', value: 'H₂, He, CH₄', unit: '' },
            { label: 'Órbita', value: '165', unit: 'anos' },
            { label: 'Distância do Sol', value: '4.495', unit: 'milhões km' },
            { label: 'Luas', value: '16', unit: '' }
        ],
        curiosities: [
            { icon: '💨', text: 'Netuno tem os ventos mais rápidos do sistema solar — até 2.100 km/h.' },
            { icon: '🧮', text: 'Foi o primeiro planeta previsto matematicamente antes de ser visto (Adams & Le Verrier, 1846).' },
            { icon: '🌀', text: 'A Grande Mancha Escura de Netuno apareceu e desapareceu — tempestades transitórias.' },
            { icon: '❄️', text: 'Tritão é tão frio que sua superfície é de nitrogênio congelado, com gêiseres ativos.' },
            { icon: '💎', text: 'Assim como Urano, dentro de Netuno provavelmente chove diamantes.' }
        ],
        missions: [
            { year: '1989', name: 'Voyager 2', desc: 'Única nave a visitar Netuno — fotografou a Grande Mancha Escura e Tritão.' },
            { year: '2030s', name: 'Neptune Odyssey (proposta)', desc: 'Proposta de orbitador e sonda atmosférica para Netuno e Tritão.' }
        ]
    }
};
