// ============================================
// T.A.R.D.I.S. — DETALHES DAS MISSÕES
// ============================================
// Este catálogo complementa a timeline de missões exibida no modal de cada planeta.
// A estrutura foi feita para ser reaproveitada futuramente em conquistas, ranking e trilhas educativas.

const DEFAULT_IMAGE_HINT = 'Painel holográfico da missão com estrelas ao fundo';

export const MISSION_DETAILS_DATA = {
    Sun: {
        'Ulysses': {
            agency: 'ESA / NASA',
            target: 'Sol e heliosfera',
            status: 'Concluída',
            type: 'Sonda heliosférica',
            objective: 'Observar o Sol fora do plano dos planetas e estudar regiões solares que quase nunca eram vistas diretamente.',
            overview: 'A Ulysses foi lançada para investigar o vento solar, o campo magnético solar e partículas energéticas em uma trajetória inclinada. Para conseguir sair do plano dos planetas, ela usou a gravidade de Júpiter como uma espécie de estilingue cósmico.',
            highlights: [
                'Foi a primeira missão a estudar as regiões polares do Sol de forma ampla.',
                'Usou uma assistência gravitacional de Júpiter para mudar drasticamente sua órbita.',
                'Ajudou a entender como o vento solar muda em diferentes latitudes solares.'
            ],
            results: [
                'Melhorou o mapa do campo magnético solar.',
                'Mostrou que a heliosfera é muito mais dinâmica do que parecia vista apenas da Terra.',
                'Forneceu dados importantes sobre partículas cósmicas e vento solar.'
            ],
            whyItMatters: 'Sem missões como a Ulysses, nossa visão do Sol ficaria muito presa ao “equador” solar. Ela ajudou cientistas a enxergar o Sol como uma estrela tridimensional e ativa.',
            funFact: 'A Ulysses não apontava câmeras bonitas para tirar fotos: sua missão principal era medir partículas, campos e vento solar.',
            imageHint: DEFAULT_IMAGE_HINT
        },
        'SOHO': {
            agency: 'ESA / NASA',
            target: 'Sol',
            status: 'Ativa em operação prolongada',
            type: 'Observatório solar',
            objective: 'Monitorar o Sol continuamente para estudar sua atmosfera, seu interior e os efeitos da atividade solar no espaço.',
            overview: 'O SOHO funciona como um observatório espacial dedicado ao Sol. Ele fica em uma região estável entre a Terra e o Sol, observando erupções, manchas solares, ejeções de massa coronal e mudanças no vento solar.',
            highlights: [
                'Observa o Sol quase sem interrupção.',
                'É uma das missões solares mais importantes da história moderna.',
                'Também se tornou famosa pela descoberta de milhares de cometas próximos ao Sol.'
            ],
            results: [
                'Ajudou a prever tempestades solares que podem afetar satélites e comunicações.',
                'Revelou detalhes da coroa solar e das ejeções de massa coronal.',
                'Contribuiu para a área de clima espacial.'
            ],
            whyItMatters: 'O SOHO ajuda a proteger tecnologias na Terra, como satélites, GPS e sistemas elétricos, porque permite acompanhar explosões solares com antecedência.',
            funFact: 'Mesmo sendo uma missão solar, o SOHO virou um dos maiores “caçadores de cometas” da história.',
            imageHint: DEFAULT_IMAGE_HINT
        },
        'STEREO': {
            agency: 'NASA',
            target: 'Sol',
            status: 'Operação prolongada',
            type: 'Duas sondas solares',
            objective: 'Observar o Sol em duas posições diferentes para criar uma visão em profundidade das erupções solares.',
            overview: 'A missão STEREO usou duas naves: uma seguindo à frente da Terra em sua órbita e outra ficando para trás. Essa separação permitiu enxergar eventos solares de ângulos diferentes, como se fosse uma visão 3D.',
            highlights: [
                'Criou uma visão mais completa de ejeções de massa coronal.',
                'Ajudou a acompanhar tempestades solares viajando pelo espaço.',
                'Mostrou que observar o Sol de um único ponto pode esconder informações importantes.'
            ],
            results: [
                'Melhorou modelos de previsão de clima espacial.',
                'Ajudou cientistas a calcular direção e velocidade de grandes explosões solares.',
                'Produziu imagens impressionantes da atividade solar.'
            ],
            whyItMatters: 'Tempestades solares podem atingir a Terra. Ver essas tempestades em 3D ajuda a entender se elas vêm em nossa direção.',
            funFact: 'O nome STEREO combina com a ideia de “visão estéreo”: dois olhos enxergando profundidade.',
            imageHint: DEFAULT_IMAGE_HINT
        },
        'Parker Solar Probe': {
            agency: 'NASA',
            target: 'Coroa solar',
            status: 'Ativa',
            type: 'Sonda solar',
            objective: 'Chegar mais perto do Sol do que qualquer outra nave para estudar a origem do vento solar e o aquecimento da coroa.',
            overview: 'A Parker Solar Probe mergulha repetidamente nas regiões externas da atmosfera solar, protegida por um escudo térmico especial. Ela coleta dados em uma região onde nenhuma nave havia chegado tão perto antes.',
            highlights: [
                'É uma das naves mais rápidas já construídas.',
                'Usa passagens por Vênus para ajustar sua órbita e chegar cada vez mais perto do Sol.',
                'Foi projetada para suportar calor extremo enquanto seus instrumentos ficam protegidos.'
            ],
            results: [
                'Mediu estruturas do vento solar de perto.',
                'Ajudou a investigar por que a coroa solar é tão quente.',
                'Revelou movimentos complexos no campo magnético próximo ao Sol.'
            ],
            whyItMatters: 'Entender o vento solar é essencial para prever tempestades que podem afetar astronautas, satélites e redes elétricas.',
            funFact: 'A nave recebeu o nome de Eugene Parker, cientista que propôs a existência do vento solar.',
            imageHint: DEFAULT_IMAGE_HINT
        },
        'Solar Orbiter': {
            agency: 'ESA / NASA',
            target: 'Sol',
            status: 'Ativa',
            type: 'Orbitador solar',
            objective: 'Observar o Sol de perto e estudar como sua atividade cria efeitos em todo o Sistema Solar.',
            overview: 'A Solar Orbiter combina imagens de alta resolução com medições do ambiente ao redor da nave. Ao longo da missão, sua órbita permite observar regiões solares em ângulos cada vez mais interessantes, incluindo os polos.',
            highlights: [
                'Fotografa regiões solares em grande detalhe.',
                'Ajuda a conectar eventos na superfície do Sol com partículas detectadas no espaço.',
                'Complementa dados da Parker Solar Probe com uma visão diferente.'
            ],
            results: [
                'Identificou pequenas erupções solares apelidadas de “fogueiras”.',
                'Ajudou a estudar a origem do vento solar.',
                'Contribui para entender o ciclo de atividade solar.'
            ],
            whyItMatters: 'A missão ajuda a explicar como o Sol influencia planetas, satélites e futuras viagens espaciais.',
            funFact: 'A Solar Orbiter e a Parker Solar Probe funcionam quase como uma dupla investigando o Sol por caminhos diferentes.',
            imageHint: DEFAULT_IMAGE_HINT
        }
    },

    Mercury: {
        'Mariner 10': {
            agency: 'NASA',
            target: 'Mercúrio e Vênus',
            status: 'Concluída',
            type: 'Sonda de sobrevoo',
            objective: 'Fazer os primeiros sobrevoos de Mercúrio e revelar como era sua superfície.',
            overview: 'A Mariner 10 foi a primeira nave a visitar Mercúrio. Antes dela, quase nada se sabia sobre o planeta de perto. Ela usou Vênus como assistência gravitacional antes de passar por Mercúrio.',
            highlights: [
                'Primeira missão a visitar Mercúrio.',
                'Mostrou uma superfície cheia de crateras, parecida com a Lua.',
                'Também ajudou a estudar Vênus durante sua rota.'
            ],
            results: [
                'Mapeou uma parte importante da superfície mercuriana.',
                'Detectou evidências do campo magnético de Mercúrio.',
                'Abriu caminho para missões orbitais futuras.'
            ],
            whyItMatters: 'Ela transformou Mercúrio de um ponto brilhante no céu em um mundo real, com geologia e história próprias.',
            funFact: 'Foi uma das primeiras missões a usar assistência gravitacional de outro planeta.',
            imageHint: 'Sonda antiga sobrevoando um planeta cheio de crateras'
        },
        'MESSENGER': {
            agency: 'NASA',
            target: 'Mercúrio',
            status: 'Concluída',
            type: 'Orbitador planetário',
            objective: 'Orbitar Mercúrio para mapear sua superfície, composição, campo magnético e ambiente espacial.',
            overview: 'A MESSENGER foi a primeira nave a orbitar Mercúrio. Ela passou anos coletando dados e imagens, revelando detalhes que a Mariner 10 não conseguiu observar.',
            highlights: [
                'Primeira nave em órbita de Mercúrio.',
                'Mapeou praticamente todo o planeta.',
                'Investigou gelo em crateras permanentemente sombreadas.'
            ],
            results: [
                'Revelou a composição química da superfície.',
                'Confirmou características importantes do campo magnético.',
                'Ajudou a entender por que o núcleo de Mercúrio é tão grande.'
            ],
            whyItMatters: 'A missão mostrou que até o menor planeta do Sistema Solar guarda uma história geológica complexa.',
            funFact: 'O nome MESSENGER também lembra Mercúrio, o mensageiro dos deuses na mitologia romana.',
            imageHint: 'Orbitador moderno acima de Mercúrio'
        },
        'BepiColombo': {
            agency: 'ESA / JAXA',
            target: 'Mercúrio',
            status: 'Em rota / missão ativa',
            type: 'Missão orbital dupla',
            objective: 'Estudar Mercúrio com dois orbitadores especializados, investigando sua superfície, interior e magnetosfera.',
            overview: 'BepiColombo é uma missão conjunta europeia e japonesa. Ela leva dois orbitadores que trabalharão juntos para observar Mercúrio de maneiras complementares.',
            highlights: [
                'Combina instrumentos europeus e japoneses.',
                'Usa múltiplas assistências gravitacionais para chegar a Mercúrio.',
                'Vai investigar o planeta e seu ambiente magnético com grande precisão.'
            ],
            results: [
                'Ainda está em fase de chegada/planejamento científico principal.',
                'Já realizou sobrevoos que ajudam a preparar a entrada em órbita.',
                'Promete dados mais detalhados que missões anteriores.'
            ],
            whyItMatters: 'Mercúrio é difícil de alcançar porque está perto do Sol. BepiColombo mostra o quanto a navegação espacial precisa ser precisa.',
            funFact: 'A missão recebeu o nome de Giuseppe “Bepi” Colombo, matemático que estudou trajetórias espaciais.',
            imageHint: 'Duas sondas brilhantes se aproximando de Mercúrio'
        }
    },

    Venus: {
        'Venera 7': {
            agency: 'Programa espacial soviético',
            target: 'Vênus',
            status: 'Concluída',
            type: 'Módulo de pouso',
            objective: 'Tentar pousar em Vênus e transmitir dados diretamente da superfície.',
            overview: 'A Venera 7 enfrentou um dos ambientes mais extremos do Sistema Solar. Mesmo com calor e pressão enormes, conseguiu enviar dados após tocar a superfície.',
            highlights: [
                'Primeira transmissão bem-sucedida a partir da superfície de outro planeta.',
                'Provou que pousar em Vênus era possível, mesmo por pouco tempo.',
                'Mostrou a brutalidade da atmosfera venusiana.'
            ],
            results: [
                'Enviou medições de temperatura e pressão.',
                'Confirmou que Vênus era muito mais hostil que a Terra.',
                'Abriu caminho para outras missões Venera.'
            ],
            whyItMatters: 'Foi um marco histórico: pela primeira vez, uma máquina humana falou conosco diretamente da superfície de outro planeta.',
            funFact: 'A nave precisou ser construída quase como um pequeno submarino espacial para aguentar a pressão.',
            imageHint: 'Módulo reforçado pousado em paisagem laranja de Vênus'
        },
        'Venera 13': {
            agency: 'Programa espacial soviético',
            target: 'Vênus',
            status: 'Concluída',
            type: 'Módulo de pouso',
            objective: 'Fotografar e analisar a superfície de Vênus com mais detalhes.',
            overview: 'A Venera 13 pousou em Vênus e enviou imagens coloridas da superfície, além de estudar o solo local. Ela operou por tempo limitado, mas entregou dados valiosos.',
            highlights: [
                'Enviou imagens coloridas da superfície venusiana.',
                'Analisou amostras do solo com instrumentos a bordo.',
                'Funcionou em um ambiente de calor e pressão extremos.'
            ],
            results: [
                'Mostrou rochas e terreno de Vênus em detalhes inéditos.',
                'Ajudou a entender a composição da superfície.',
                'Reforçou a imagem de Vênus como um mundo vulcânico e sufocante.'
            ],
            whyItMatters: 'As imagens da Venera 13 continuam sendo algumas das visões mais impressionantes já obtidas da superfície de Vênus.',
            funFact: 'Mesmo hoje, pousar e sobreviver em Vênus ainda é extremamente difícil.',
            imageHint: 'Foto estilo panorâmica da superfície venusiana'
        },
        'Magellan': {
            agency: 'NASA',
            target: 'Vênus',
            status: 'Concluída',
            type: 'Orbitador de radar',
            objective: 'Mapear Vênus usando radar, já que suas nuvens impedem observação direta da superfície.',
            overview: 'A Magellan orbitou Vênus e usou radar para atravessar as nuvens densas do planeta. Assim, criou mapas detalhados de montanhas, planícies, crateras e formações vulcânicas.',
            highlights: [
                'Mapeou grande parte da superfície venusiana.',
                'Usou radar para enxergar através das nuvens.',
                'Revelou milhares de estruturas vulcânicas.'
            ],
            results: [
                'Mostrou que Vênus tem uma superfície geologicamente jovem em muitas regiões.',
                'Indicou um planeta com forte história vulcânica.',
                'Gerou mapas fundamentais para estudos posteriores.'
            ],
            whyItMatters: 'Sem radar, Vênus fica escondido. A Magellan tirou o “véu” do planeta e revelou seu relevo.',
            funFact: 'A missão transformou nuvens impenetráveis em mapas detalhados usando ondas de rádio.',
            imageHint: 'Mapa de radar dourado de Vênus'
        },
        'Venus Express': {
            agency: 'ESA',
            target: 'Vênus',
            status: 'Concluída',
            type: 'Orbitador atmosférico',
            objective: 'Estudar a atmosfera, as nuvens e a interação de Vênus com o vento solar.',
            overview: 'A Venus Express ficou anos orbitando Vênus e investigando sua atmosfera em várias camadas. A missão ajudou a explicar como um planeta parecido em tamanho com a Terra se tornou tão diferente.',
            highlights: [
                'Estudou ventos, nuvens e composição atmosférica.',
                'Observou fenômenos no lado diurno e noturno do planeta.',
                'Ajudou a comparar a evolução de Vênus e da Terra.'
            ],
            results: [
                'Melhorou modelos do efeito estufa venusiano.',
                'Revelou detalhes de circulação atmosférica extrema.',
                'Estudou perdas de gases para o espaço.'
            ],
            whyItMatters: 'Vênus é um laboratório natural para entender clima extremo e efeito estufa em escala planetária.',
            funFact: 'Mesmo sem pousar, a Venus Express ajudou a contar a história de um planeta inteiro pela atmosfera.',
            imageHint: 'Orbitador europeu sobre nuvens amarelas de Vênus'
        },
        'VERITAS & DAVINCI': {
            agency: 'NASA',
            target: 'Vênus',
            status: 'Missões planejadas',
            type: 'Orbitador e sonda atmosférica',
            objective: 'Investigar a geologia, atmosfera e evolução de Vênus com instrumentos modernos.',
            overview: 'VERITAS e DAVINCI são missões planejadas para responder perguntas importantes sobre Vênus: como sua superfície evoluiu, se ainda há vulcanismo ativo e como sua atmosfera ficou tão densa.',
            highlights: [
                'VERITAS deve mapear a superfície com radar avançado.',
                'DAVINCI deve estudar a atmosfera durante uma descida por Vênus.',
                'As missões complementam décadas de dados antigos com tecnologia nova.'
            ],
            results: [
                'Ainda estão em planejamento/desenvolvimento.',
                'Devem atualizar nosso conhecimento sobre o planeta irmão da Terra.',
                'Podem esclarecer se Vênus teve água no passado.'
            ],
            whyItMatters: 'Entender Vênus ajuda a entender a Terra, mudanças climáticas planetárias e a busca por mundos habitáveis.',
            funFact: 'DAVINCI é uma homenagem a Leonardo da Vinci, conectando ciência, engenharia e exploração.',
            imageHint: 'Sonda descendo através das nuvens de Vênus'
        }
    },

    Earth: {
        'Sputnik 1': {
            agency: 'União Soviética',
            target: 'Órbita da Terra',
            status: 'Concluída',
            type: 'Satélite artificial',
            objective: 'Colocar o primeiro satélite artificial em órbita da Terra.',
            overview: 'O Sputnik 1 foi uma esfera metálica com antenas que transmitia sinais de rádio. Seu lançamento marcou o início da Era Espacial.',
            highlights: [
                'Primeiro satélite artificial da humanidade.',
                'Demonstrou que era possível colocar objetos em órbita.',
                'Iniciou uma nova fase da exploração espacial.'
            ],
            results: [
                'Comprovou tecnologias de lançamento orbital.',
                'Inspirou programas espaciais em todo o mundo.',
                'Mudou a ciência, a política e a educação tecnológica.'
            ],
            whyItMatters: 'Antes do Sputnik, a humanidade nunca havia colocado um objeto artificial orbitando nosso planeta.',
            funFact: 'Seu sinal de rádio “bip-bip” podia ser captado por estações na Terra.',
            imageHint: 'Pequena esfera com antenas orbitando a Terra'
        },
        'Vostok 1 (Gagarin)': {
            agency: 'União Soviética',
            target: 'Órbita da Terra',
            status: 'Concluída',
            type: 'Voo espacial tripulado',
            objective: 'Levar o primeiro ser humano ao espaço e completar uma órbita ao redor da Terra.',
            overview: 'A missão Vostok 1 levou Yuri Gagarin ao espaço, fazendo dele o primeiro humano a ver a Terra de fora. O voo foi curto, mas histórico.',
            highlights: [
                'Primeiro voo humano ao espaço.',
                'Completou uma volta ao redor da Terra.',
                'Provou que seres humanos poderiam sobreviver em órbita.'
            ],
            results: [
                'Abriu caminho para missões tripuladas futuras.',
                'Transformou Gagarin em símbolo mundial da exploração espacial.',
                'Acelerou a corrida espacial.'
            ],
            whyItMatters: 'Foi o momento em que a exploração espacial deixou de ser apenas robótica e passou a incluir pessoas.',
            funFact: 'Gagarin teria dito “A Terra é azul”, frase que virou símbolo da visão humana do planeta visto do espaço.',
            imageHint: 'Cápsula espacial sobre a Terra azul'
        },
        'Apollo 11': {
            agency: 'NASA',
            target: 'Lua',
            status: 'Concluída',
            type: 'Missão lunar tripulada',
            objective: 'Pousar seres humanos na Lua e trazê-los de volta com segurança.',
            overview: 'A Apollo 11 levou Neil Armstrong, Buzz Aldrin e Michael Collins em uma das missões mais famosas da história. Armstrong e Aldrin caminharam na superfície lunar enquanto Collins orbitava a Lua.',
            highlights: [
                'Primeiro pouso humano na Lua.',
                'Coletou amostras lunares.',
                'Realizou experimentos científicos na superfície.'
            ],
            results: [
                'Trouxe rochas lunares para estudo.',
                'Provou a capacidade humana de pousar em outro mundo.',
                'Inspirou gerações de cientistas e engenheiros.'
            ],
            whyItMatters: 'A Apollo 11 é um dos maiores marcos da exploração espacial e da história humana.',
            funFact: 'O computador de bordo da Apollo tinha muito menos poder que um celular moderno.',
            imageHint: 'Astronauta deixando pegada na Lua com a Terra ao fundo'
        },
        'ISS': {
            agency: 'Parceria internacional',
            target: 'Órbita baixa da Terra',
            status: 'Ativa',
            type: 'Estação espacial',
            objective: 'Manter um laboratório habitado em órbita para pesquisas científicas e cooperação internacional.',
            overview: 'A Estação Espacial Internacional é um laboratório que orbita a Terra. Astronautas vivem e trabalham nela, realizando experimentos em microgravidade.',
            highlights: [
                'É um dos maiores projetos científicos internacionais.',
                'Permite estudar o corpo humano no espaço.',
                'Serve como laboratório para tecnologias de missões futuras.'
            ],
            results: [
                'Produziu milhares de experimentos científicos.',
                'Treinou astronautas para longas permanências no espaço.',
                'Ajudou a testar sistemas para exploração além da Terra.'
            ],
            whyItMatters: 'A ISS mostra que países diferentes podem trabalhar juntos para explorar e aprender no espaço.',
            funFact: 'A estação dá várias voltas ao redor da Terra todos os dias.',
            imageHint: 'Grande estação espacial sobre a Terra'
        },
        'Crew Dragon': {
            agency: 'SpaceX / NASA',
            target: 'ISS e órbita da Terra',
            status: 'Ativa',
            type: 'Cápsula tripulada',
            objective: 'Transportar astronautas para a Estação Espacial Internacional e apoiar voos espaciais comerciais.',
            overview: 'A Crew Dragon marcou uma nova fase em que empresas privadas passaram a levar astronautas ao espaço em parceria com agências espaciais.',
            highlights: [
                'Leva tripulações à ISS.',
                'É reutilizável em várias partes do sistema.',
                'Representa a expansão do setor espacial comercial.'
            ],
            results: [
                'Restaurou lançamentos tripulados a partir dos Estados Unidos.',
                'Aumentou a frequência de acesso humano à órbita.',
                'Ajudou a consolidar parcerias público-privadas no espaço.'
            ],
            whyItMatters: 'Ela mostra que a exploração espacial moderna envolve governos, empresas e novas tecnologias trabalhando juntos.',
            funFact: 'A cápsula usa telas sensíveis ao toque em vez de muitos painéis cheios de botões físicos.',
            imageHint: 'Cápsula moderna acoplando na estação espacial'
        }
    },

    Mars: {
        'Mariner 4': {
            agency: 'NASA',
            target: 'Marte',
            status: 'Concluída',
            type: 'Sonda de sobrevoo',
            objective: 'Fotografar Marte de perto pela primeira vez.',
            overview: 'A Mariner 4 passou por Marte e enviou as primeiras imagens próximas do planeta vermelho. As fotos revelaram crateras e mudaram as expectativas sobre Marte.',
            highlights: [
                'Primeiras imagens próximas de Marte.',
                'Mostrou uma superfície craterada.',
                'Forneceu dados sobre atmosfera e ambiente marciano.'
            ],
            results: [
                'Mudou a visão popular de Marte como um mundo possivelmente parecido com a Terra.',
                'Mostrou que a atmosfera era muito fina.',
                'Preparou o caminho para orbitadores e pousadores.'
            ],
            whyItMatters: 'Foi o primeiro olhar real da humanidade para Marte de perto.',
            funFact: 'As primeiras imagens foram inicialmente traduzidas em dados e até coloridas manualmente por equipes na Terra.',
            imageHint: 'Sonda passando por Marte avermelhado'
        },
        'Viking 1 & 2': {
            agency: 'NASA',
            target: 'Marte',
            status: 'Concluídas',
            type: 'Orbitadores e pousadores',
            objective: 'Pousar em Marte, fotografar a superfície e realizar experimentos científicos, incluindo busca por sinais de vida.',
            overview: 'As missões Viking foram as primeiras a pousar com sucesso em Marte e operar por longos períodos. Elas enviaram imagens da superfície e realizaram experimentos no solo.',
            highlights: [
                'Primeiros pousos bem-sucedidos em Marte.',
                'Enviaram panoramas históricos da superfície.',
                'Realizaram experimentos biológicos pioneiros.'
            ],
            results: [
                'Mostraram Marte como um deserto frio e seco.',
                'Geraram dados fundamentais sobre solo e atmosfera.',
                'Levantaram perguntas que ainda inspiram estudos sobre vida em Marte.'
            ],
            whyItMatters: 'Viking transformou Marte em um lugar explorado diretamente por máquinas humanas.',
            funFact: 'Os pousadores Viking sobreviveram muito mais tempo do que o mínimo planejado.',
            imageHint: 'Pousador em solo marciano com céu alaranjado'
        },
        'Spirit & Opportunity': {
            agency: 'NASA',
            target: 'Marte',
            status: 'Concluídas',
            type: 'Rovers',
            objective: 'Explorar a superfície marciana e procurar evidências de água no passado.',
            overview: 'Spirit e Opportunity eram rovers gêmeos enviados para locais diferentes de Marte. Eles percorreram a superfície analisando rochas, solo e formações geológicas.',
            highlights: [
                'Rovers gêmeos explorando regiões diferentes.',
                'Encontraram evidências de ambientes antigos com água.',
                'Opportunity durou muitos anos além do planejado.'
            ],
            results: [
                'Fortaleceram a ideia de que Marte já teve água líquida.',
                'Mapearam terrenos e minerais importantes.',
                'Mostraram a resistência de rovers em outro planeta.'
            ],
            whyItMatters: 'Esses rovers tornaram Marte mais “próximo”, com exploração de campo parecida com geologia feita por robôs.',
            funFact: 'Opportunity foi planejado para durar cerca de 90 sóis marcianos, mas operou por muitos anos.',
            imageHint: 'Rover pequeno atravessando dunas marcianas'
        },
        'Curiosity': {
            agency: 'NASA',
            target: 'Marte',
            status: 'Ativa',
            type: 'Rover laboratório',
            objective: 'Investigar se Marte já teve condições favoráveis à vida microbiana.',
            overview: 'Curiosity é um rover grande, do tamanho aproximado de um carro pequeno. Ele pousou na Cratera Gale para estudar rochas, clima e a história da água em Marte.',
            highlights: [
                'Usa um laboratório químico a bordo.',
                'Explora camadas rochosas do Monte Sharp.',
                'Estuda ambientes antigos que podem ter sido habitáveis.'
            ],
            results: [
                'Encontrou evidências de antigos lagos e rios.',
                'Detectou moléculas orgânicas em rochas marcianas.',
                'Mede radiação e clima para futuras missões humanas.'
            ],
            whyItMatters: 'Curiosity ajuda a responder uma das maiores perguntas: Marte já foi um lugar onde a vida poderia existir?',
            funFact: 'O pouso usou um sistema chamado “guindaste celeste”, que baixou o rover por cabos.',
            imageHint: 'Rover Curiosity com montanha marciana ao fundo'
        },
        'Perseverance + Ingenuity': {
            agency: 'NASA',
            target: 'Marte',
            status: 'Missão do rover ativa; helicóptero concluído',
            type: 'Rover e helicóptero experimental',
            objective: 'Buscar sinais de vida antiga, coletar amostras e testar voo motorizado em Marte.',
            overview: 'Perseverance explora a Cratera Jezero, um antigo delta que pode ter preservado sinais de ambientes habitáveis. Ingenuity foi um pequeno helicóptero enviado como demonstração tecnológica.',
            highlights: [
                'Perseverance coleta amostras para possível retorno à Terra.',
                'Ingenuity realizou os primeiros voos motorizados em outro planeta.',
                'A missão testa tecnologias para exploração futura.'
            ],
            results: [
                'Coletou amostras geológicas selecionadas.',
                'Demonstrou que voar em Marte é possível.',
                'Gerou dados sobre clima, solo e poeira marciana.'
            ],
            whyItMatters: 'Essa missão conecta exploração robótica, busca por vida antiga e preparação para futuras missões humanas.',
            funFact: 'Ingenuity era uma demonstração tecnológica, mas voou muito mais vezes do que o esperado.',
            imageHint: 'Rover Perseverance e pequeno helicóptero em Marte'
        }
    },

    Jupiter: {
        'Pioneer 10': {
            agency: 'NASA',
            target: 'Júpiter',
            status: 'Concluída',
            type: 'Sonda de sobrevoo',
            objective: 'Realizar o primeiro sobrevoo de Júpiter e estudar o ambiente do gigante gasoso.',
            overview: 'A Pioneer 10 atravessou o cinturão de asteroides e visitou Júpiter, enfrentando uma região de radiação intensa. Ela abriu caminho para missões mais avançadas.',
            highlights: [
                'Primeira nave a sobrevoar Júpiter.',
                'Mediu radiação e campo magnético joviano.',
                'Provou que sondas podiam atravessar o cinturão de asteroides.'
            ],
            results: [
                'Enviou imagens e dados pioneiros de Júpiter.',
                'Ajudou a preparar as missões Voyager.',
                'Medidas de radiação foram importantes para proteção de futuras naves.'
            ],
            whyItMatters: 'Pioneer 10 foi uma verdadeira exploradora abrindo trilha para o Sistema Solar exterior.',
            funFact: 'Ela carrega uma placa com mensagem simbólica da humanidade.',
            imageHint: 'Sonda pioneira diante de Júpiter gigante'
        },
        'Voyager 1 & 2': {
            agency: 'NASA',
            target: 'Júpiter e Sistema Solar exterior',
            status: 'Missões interestelares em operação prolongada',
            type: 'Sondas de sobrevoo',
            objective: 'Explorar Júpiter, Saturno e outros mundos do Sistema Solar exterior.',
            overview: 'As Voyager passaram por Júpiter e revelaram detalhes incríveis do planeta e de suas luas. A descoberta de vulcões ativos em Io foi uma surpresa enorme.',
            highlights: [
                'Descobriram vulcanismo ativo em Io.',
                'Observaram anéis finos de Júpiter.',
                'Revelaram detalhes das luas galileanas.'
            ],
            results: [
                'Mostraram que luas também podem ser mundos geologicamente ativos.',
                'Mudaram a forma como cientistas veem sistemas de luas.',
                'Produziram imagens icônicas do Sistema Solar exterior.'
            ],
            whyItMatters: 'As Voyager mostraram que a exploração planetária não é só sobre planetas: luas podem ser tão fascinantes quanto eles.',
            funFact: 'As duas sondas carregam discos de ouro com sons e imagens da Terra.',
            imageHint: 'Sonda Voyager passando por Júpiter e suas luas'
        },
        'Galileo': {
            agency: 'NASA',
            target: 'Júpiter',
            status: 'Concluída',
            type: 'Orbitador e sonda atmosférica',
            objective: 'Orbitar Júpiter, estudar suas luas e enviar uma sonda para dentro da atmosfera joviana.',
            overview: 'Galileo foi a primeira missão a orbitar Júpiter. Ela passou anos estudando o planeta, suas luas e seu ambiente magnético.',
            highlights: [
                'Primeiro orbitador de Júpiter.',
                'Enviou uma sonda atmosférica para o planeta.',
                'Estudou Europa, Io, Ganimedes e Calisto em detalhes.'
            ],
            results: [
                'Fortaleceu evidências de oceano sob a crosta de Europa.',
                'Revelou processos vulcânicos em Io.',
                'Medidas atmosféricas ajudaram a entender Júpiter por dentro.'
            ],
            whyItMatters: 'Galileo transformou o sistema de Júpiter em um laboratório de mundos variados.',
            funFact: 'A missão terminou com a nave mergulhando em Júpiter para evitar contaminar luas como Europa.',
            imageHint: 'Orbitador entrando no sistema de luas de Júpiter'
        },
        'Juno': {
            agency: 'NASA',
            target: 'Júpiter',
            status: 'Ativa',
            type: 'Orbitador polar',
            objective: 'Estudar o interior, a atmosfera, a gravidade e o campo magnético de Júpiter.',
            overview: 'Juno orbita Júpiter passando sobre seus polos. Ela mede campos magnéticos e gravitacionais para entender como o planeta se formou e como é seu interior.',
            highlights: [
                'Primeira missão a observar os polos de Júpiter em detalhes.',
                'Estuda auroras e tempestades polares.',
                'Mede a estrutura interna do planeta.'
            ],
            results: [
                'Revelou ciclones gigantes nos polos.',
                'Mostrou que o interior de Júpiter é mais complexo que modelos antigos.',
                'Produziu imagens impressionantes da atmosfera joviana.'
            ],
            whyItMatters: 'Entender Júpiter ajuda a entender a formação de todo o Sistema Solar.',
            funFact: 'Juno usa energia solar mesmo operando muito longe do Sol.',
            imageHint: 'Juno sobre os polos coloridos de Júpiter'
        },
        'Europa Clipper': {
            agency: 'NASA',
            target: 'Europa, lua de Júpiter',
            status: 'Missão lançada/em fase de cruzeiro',
            type: 'Sonda de múltiplos sobrevoos',
            objective: 'Investigar se Europa pode ter condições adequadas para vida em seu oceano subterrâneo.',
            overview: 'Europa Clipper foi criada para realizar muitos sobrevoos de Europa, estudando sua crosta de gelo, composição e possível oceano abaixo da superfície.',
            highlights: [
                'Focada em uma das luas mais promissoras para astrobiologia.',
                'Usará radar para investigar a crosta de gelo.',
                'Fará muitos sobrevoos em vez de orbitar diretamente Europa.'
            ],
            results: [
                'A missão científica principal ainda depende da chegada ao sistema de Júpiter.',
                'Deve mapear regiões interessantes da superfície de Europa.',
                'Pode indicar locais promissores para futuras missões de pouso.'
            ],
            whyItMatters: 'Europa pode ter um oceano global sob o gelo. Isso faz dela um dos lugares mais interessantes para procurar ambientes habitáveis.',
            funFact: 'A nave tem painéis solares enormes porque Júpiter recebe pouca luz solar em comparação com a Terra.',
            imageHint: 'Sonda passando sobre lua gelada com Júpiter ao fundo'
        }
    },

    Saturn: {
        'Pioneer 11': {
            agency: 'NASA',
            target: 'Saturno',
            status: 'Concluída',
            type: 'Sonda de sobrevoo',
            objective: 'Realizar o primeiro sobrevoo de Saturno e estudar seus anéis e luas.',
            overview: 'Depois de visitar Júpiter, a Pioneer 11 seguiu para Saturno. Ela forneceu as primeiras observações próximas do planeta dos anéis.',
            highlights: [
                'Primeira nave a visitar Saturno.',
                'Observou anéis e luas de perto.',
                'Ajudou a planejar as passagens das Voyager.'
            ],
            results: [
                'Mediu o campo magnético de Saturno.',
                'Estudou a estrutura dos anéis.',
                'Obteve imagens iniciais do sistema saturniano.'
            ],
            whyItMatters: 'Foi a primeira visita robótica à joia do Sistema Solar.',
            funFact: 'Pioneer 11 também carrega uma placa com mensagem simbólica da humanidade.',
            imageHint: 'Sonda Pioneer se aproximando dos anéis de Saturno'
        },
        'Voyager 2': {
            agency: 'NASA',
            target: 'Saturno e Sistema Solar exterior',
            status: 'Missão interestelar em operação prolongada',
            type: 'Sonda de sobrevoo',
            objective: 'Estudar Saturno, seus anéis e luas, seguindo depois para Urano e Netuno.',
            overview: 'A Voyager 2 passou por Saturno e depois continuou para os gigantes de gelo. Em Saturno, revelou detalhes importantes dos anéis e luas.',
            highlights: [
                'Fotografou anéis e luas com detalhes inéditos.',
                'Passou por Saturno antes de seguir para Urano.',
                'Contribuiu para entender a complexidade dos anéis.'
            ],
            results: [
                'Mostrou estruturas finas nos anéis.',
                'Enviou dados de atmosfera e magnetosfera.',
                'Ajudou a selecionar perguntas para a futura missão Cassini.'
            ],
            whyItMatters: 'A Voyager 2 conectou vários mundos do Sistema Solar exterior em uma única jornada histórica.',
            funFact: 'É a única nave que visitou Júpiter, Saturno, Urano e Netuno.',
            imageHint: 'Voyager passando pelos anéis de Saturno'
        },
        'Cassini-Huygens': {
            agency: 'NASA / ESA / ASI',
            target: 'Saturno e Titã',
            status: 'Concluída',
            type: 'Orbitador e módulo de pouso',
            objective: 'Estudar Saturno, seus anéis e luas, incluindo o pouso da Huygens em Titã.',
            overview: 'Cassini orbitou Saturno por anos, enquanto Huygens desceu em Titã. A missão revolucionou o conhecimento sobre Saturno, seus anéis e suas luas geladas.',
            highlights: [
                'Huygens pousou em Titã, uma lua com atmosfera densa.',
                'Cassini descobriu jatos de água em Encélado.',
                'Estudou os anéis com detalhes extraordinários.'
            ],
            results: [
                'Revelou que Encélado possui oceano subterrâneo.',
                'Mostrou lagos e mares de metano em Titã.',
                'Gerou um dos maiores acervos de dados de uma missão planetária.'
            ],
            whyItMatters: 'Cassini-Huygens mostrou que algumas luas de Saturno podem ser mundos complexos e até interessantes para a busca por vida.',
            funFact: 'Huygens foi o pouso mais distante já realizado em um corpo do Sistema Solar.',
            imageHint: 'Cassini perto de Saturno com Titã ao fundo'
        },
        'Grand Finale': {
            agency: 'NASA / ESA / ASI',
            target: 'Saturno',
            status: 'Concluída',
            type: 'Fase final da Cassini',
            objective: 'Encerrar a missão Cassini com mergulhos entre Saturno e seus anéis, coletando dados inéditos.',
            overview: 'No Grand Finale, Cassini realizou órbitas arriscadas entre Saturno e os anéis antes de mergulhar na atmosfera do planeta. Isso evitou contaminação de luas potencialmente habitáveis.',
            highlights: [
                'Passou por uma região nunca explorada entre planeta e anéis.',
                'Mediu partículas e campos próximos a Saturno.',
                'Terminou com um mergulho controlado na atmosfera.'
            ],
            results: [
                'Forneceu dados sobre massa e estrutura dos anéis.',
                'Investigou a alta atmosfera de Saturno.',
                'Protegeu luas como Encélado e Titã de contaminação terrestre.'
            ],
            whyItMatters: 'Foi um final científico e responsável para uma missão histórica.',
            funFact: 'A Cassini continuou enviando dados até perder contato durante a entrada na atmosfera.',
            imageHint: 'Nave mergulhando entre Saturno e seus anéis'
        },
        'Dragonfly': {
            agency: 'NASA',
            target: 'Titã, lua de Saturno',
            status: 'Missão planejada',
            type: 'Drone/rotorcraft planetário',
            objective: 'Voar por diferentes regiões de Titã para estudar química orgânica e ambientes potencialmente interessantes para a vida.',
            overview: 'Dragonfly será uma missão ousada: um veículo voador explorando Titã. A atmosfera densa da lua torna possível voar com um drone muito maior que helicópteros marcianos.',
            highlights: [
                'Será um laboratório voador em outro mundo.',
                'Vai visitar vários locais na superfície de Titã.',
                'Investigará química orgânica complexa.'
            ],
            results: [
                'Ainda está em desenvolvimento/planejamento.',
                'Pode revelar como moléculas orgânicas evoluem em ambientes frios.',
                'Ajudará a entender Titã como laboratório natural de química pré-biótica.'
            ],
            whyItMatters: 'Titã tem atmosfera, compostos orgânicos e paisagens exóticas. Dragonfly pode transformar nossa compreensão dessa lua.',
            funFact: 'Em Titã, a combinação de baixa gravidade e atmosfera densa ajuda o voo.',
            imageHint: 'Drone futurista voando sobre dunas de Titã'
        }
    },

    Uranus: {
        'Voyager 2': {
            agency: 'NASA',
            target: 'Urano',
            status: 'Concluída',
            type: 'Sonda de sobrevoo',
            objective: 'Realizar o primeiro e único sobrevoo de Urano, estudando seu sistema de anéis, luas e atmosfera.',
            overview: 'A Voyager 2 é a única nave que visitou Urano de perto. Sua passagem revelou um planeta inclinado, frio e com luas cheias de características misteriosas.',
            highlights: [
                'Único sobrevoo de Urano até hoje.',
                'Descobriu luas e anéis adicionais.',
                'Mostrou detalhes da atmosfera e magnetosfera inclinada.'
            ],
            results: [
                'Revelou um campo magnético estranho e deslocado.',
                'Fotografou luas como Miranda em detalhes inéditos.',
                'Deixou muitas perguntas para futuras missões.'
            ],
            whyItMatters: 'Urano ainda é um dos planetas menos explorados. A Voyager 2 é nossa principal fonte de dados próximos.',
            funFact: 'Depois de Urano, a Voyager 2 ainda seguiu para Netuno.',
            imageHint: 'Voyager passando por planeta azul-esverdeado inclinado'
        },
        'Uranus Orbiter (proposta)': {
            agency: 'NASA / comunidade científica',
            target: 'Urano',
            status: 'Proposta científica',
            type: 'Orbitador e possível sonda atmosférica',
            objective: 'Enviar uma missão dedicada para estudar Urano, suas luas, anéis, atmosfera e interior.',
            overview: 'Uma missão orbital a Urano é frequentemente apontada como prioridade científica para entender os gigantes de gelo. Esses planetas são comuns em outros sistemas estelares, mas pouco explorados no nosso.',
            highlights: [
                'Poderia orbitar Urano por anos.',
                'Estudaria luas pouco conhecidas.',
                'Investigaria por que Urano gira praticamente de lado.'
            ],
            results: [
                'Ainda não é uma missão em operação.',
                'Pode responder perguntas deixadas pela Voyager 2.',
                'Ajudaria a comparar Urano com Netuno e exoplanetas semelhantes.'
            ],
            whyItMatters: 'Gigantes de gelo são comuns na galáxia. Estudar Urano ajuda a entender muitos planetas fora do Sistema Solar.',
            funFact: 'Uma missão a Urano precisa de muitos anos de viagem antes de começar a ciência principal.',
            imageHint: 'Orbitador chegando a Urano com anéis finos ao redor'
        }
    },

    Neptune: {
        'Voyager 2': {
            agency: 'NASA',
            target: 'Netuno e Tritão',
            status: 'Concluída',
            type: 'Sonda de sobrevoo',
            objective: 'Realizar o primeiro e único sobrevoo de Netuno, estudando sua atmosfera, anéis e lua Tritão.',
            overview: 'A Voyager 2 passou por Netuno em 1989 e revelou um mundo azul, ventoso e cheio de surpresas. Também fotografou Tritão, uma lua gelada com atividade geológica.',
            highlights: [
                'Única nave a visitar Netuno de perto.',
                'Fotografou a Grande Mancha Escura.',
                'Revelou gêiseres em Tritão.'
            ],
            results: [
                'Mediu ventos extremamente rápidos.',
                'Mostrou anéis tênues ao redor de Netuno.',
                'Indicou que Tritão pode ser um mundo capturado e ativo.'
            ],
            whyItMatters: 'Netuno é a fronteira dos planetas clássicos. A Voyager 2 nos deu o único retrato próximo desse mundo distante.',
            funFact: 'Depois de Netuno, a Voyager 2 seguiu rumo ao espaço interestelar.',
            imageHint: 'Sonda passando por Netuno azul e Tritão gelado'
        },
        'Neptune Odyssey (proposta)': {
            agency: 'Conceito científico',
            target: 'Netuno e Tritão',
            status: 'Proposta/conceito',
            type: 'Orbitador e sonda atmosférica',
            objective: 'Estudar Netuno, sua atmosfera, magnetosfera, anéis e a lua Tritão com uma missão dedicada.',
            overview: 'Neptune Odyssey é um conceito de missão para retornar a Netuno com instrumentos modernos. A ideia inclui investigar o gigante de gelo e Tritão, uma lua especialmente interessante.',
            highlights: [
                'Poderia orbitar Netuno por anos.',
                'Estudaria Tritão em detalhes.',
                'Investigaria a estrutura interna e atmosfera do planeta.'
            ],
            results: [
                'Ainda não é uma missão aprovada em operação.',
                'Poderia responder perguntas deixadas pela Voyager 2.',
                'Ajudaria a entender gigantes de gelo e luas capturadas.'
            ],
            whyItMatters: 'Netuno e Tritão estão entre os alvos mais misteriosos do Sistema Solar exterior.',
            funFact: 'Tritão orbita Netuno no sentido oposto à rotação do planeta, sinal de que pode ter sido capturado.',
            imageHint: 'Orbitador futurista perto de Netuno com Tritão ao fundo'
        }
    }
};

export function getMissionDetail(planetKey, missionName, missionFallback = {}) {
    const detail = MISSION_DETAILS_DATA?.[planetKey]?.[missionName];

    if (detail) {
        return {
            ...detail,
            year: missionFallback.year || detail.year || '',
            name: missionName,
            shortDescription: missionFallback.desc || detail.shortDescription || ''
        };
    }

    return {
        name: missionName,
        year: missionFallback.year || '',
        agency: 'Agência espacial',
        target: planetKey || 'Sistema Solar',
        status: 'Registrada na linha do tempo',
        type: 'Missão espacial',
        objective: missionFallback.desc || 'Explorar, observar ou estudar um corpo celeste.',
        overview: 'Esta missão faz parte da história de exploração espacial relacionada a este corpo celeste. Ela ajuda a transformar pontos distantes no céu em mundos conhecidos por dados, imagens e descobertas.',
        highlights: [
            'Contribuiu para a exploração científica do Sistema Solar.',
            'Gerou dados usados por cientistas e educadores.',
            'Ajuda a contar a história da exploração espacial humana e robótica.'
        ],
        results: [
            'Dados científicos sobre o alvo da missão.',
            'Novas perguntas para missões futuras.',
            'Inspiração para estudantes e exploradores.'
        ],
        whyItMatters: 'Cada missão espacial amplia um pouco mais nosso mapa do Universo.',
        funFact: 'Missões espaciais costumam levar anos de planejamento antes de chegar ao destino.',
        imageHint: DEFAULT_IMAGE_HINT,
        shortDescription: missionFallback.desc || ''
    };
}
