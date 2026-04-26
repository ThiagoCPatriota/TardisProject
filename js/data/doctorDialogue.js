// ============================================
// T.A.R.D.I.S. — FALAS DO DOUTOR
// ============================================
// Banco de falas curtas para deixar o Modo Aventura mais vivo.
// As frases são inspiradas no clima de exploração do Doctor/T.A.R.D.I.S.,
// sem depender de diálogos longos copiados de séries ou filmes.

const pick = (list) => list[Math.floor(Math.random() * list.length)];

const withFact = (text, fact = '') => {
    const cleanFact = String(fact || '').trim();
    if (!cleanFact) return text;
    return `${text} ${cleanFact}`;
};

export const GENERAL_DOCTOR_LINES = [
    'Olá, explorador! A T.A.R.D.I.S. acabou de abrir as portas. Hora de aprender viajando pelo cosmos.',
    'Allons-y! O Universo é enorme, mas hoje nós vamos atravessar tudo pergunta por pergunta.',
    'Geronimo! Ajustei os controles para uma viagem segura, curiosa e cheia de descobertas.',
    'Bem-vindo a bordo. O tempo, o espaço e o conhecimento estão esperando por você.',
    'Excelente! Um explorador com curiosidade vale mais que qualquer mapa estelar.',
    'A T.A.R.D.I.S. adora mentes curiosas. Vamos ver o que você descobre hoje.',
    'Motores prontos, painéis acesos e coordenadas calculadas. Próxima parada: conhecimento.',
    'Não tenha medo de errar. Todo grande explorador já se perdeu um pouquinho antes de encontrar uma estrela.',
    'Hoje vamos transformar planetas distantes em histórias, dados e descobertas.',
    'Prepare seu olhar de cientista. O Sistema Solar está cheio de pistas brilhando no escuro.'
];

export const CORRECT_DOCTOR_LINES = [
    planet => `Fantástico! Você acertou sobre ${planet}. A T.A.R.D.I.S. aprova essa resposta.`,
    planet => `Brilhante! ${planet} acabou de revelar um segredo para você.`,
    planet => `Allons-y! Resposta correta sobre ${planet}. Vamos seguir viagem.`,
    planet => `Geronimo! Você pilotou essa pergunta como um verdadeiro explorador.`,
    planet => `Muito bem! Seu radar científico funcionou perfeitamente em ${planet}.`,
    planet => `Resposta precisa! Até os sensores da nave ficaram impressionados.`,
    planet => `Excelente! Você leu as pistas de ${planet} como um mapa estelar.`,
    planet => `Corretíssimo! Mais um ponto luminoso no seu diário de bordo.`,
    planet => `Magnífico! O conhecimento orbital está forte por aqui.`,
    planet => `Isso! Você acabou de transformar curiosidade em descoberta.`
];

export const WRONG_DOCTOR_LINES = [
    hint => `Hmm, essa rota não era a correta. Dica: ${hint}`,
    hint => `Quase! A T.A.R.D.I.S. recalculou a rota. Observe: ${hint}`,
    hint => `Não foi dessa vez, mas todo cientista testa hipóteses. Dica: ${hint}`,
    hint => `O painel piscou em vermelho, mas nada de pânico. Dica: ${hint}`,
    hint => `Essa resposta caiu num buraco de minhoca. Tente de novo: ${hint}`,
    hint => `Boa tentativa! Às vezes o Universo responde com enigmas. Dica: ${hint}`,
    hint => `Ainda não. Respire, olhe os dados e tente outra rota. ${hint}`,
    hint => `Ops! Um pequeno desvio temporal. A dica é: ${hint}`,
    hint => `Essa pista era traiçoeira, mas você consegue. ${hint}`,
    hint => `Não exatamente. O segredo está nos detalhes: ${hint}`
];

export const PLANET_DOCTOR_LINES = {
    Sun: [
        (p, f) => withFact(`${p} não é um planeta: é a estrela que mantém tudo funcionando.`, f),
        (p, f) => withFact(`Estamos perto do coração energético do Sistema Solar: ${p}.`, f),
        (p, f) => withFact(`${p} é uma fornalha cósmica de plasma, luz e campos magnéticos.`, f),
        (p, f) => withFact(`Cuidado com os sensores! ${p} transforma matéria em energia o tempo todo.`, f),
        (p, f) => withFact(`Aqui, uma pequena explosão pode ser maior que vários planetas. Bem-vindo ao ${p}.`, f),
        (p, f) => withFact(`${p} parece calmo de longe, mas de perto é uma estrela cheia de tempestades.`, f),
        (p, f) => withFact(`A T.A.R.D.I.S. está usando filtro solar máximo. Estamos estudando ${p}.`, f),
        (p, f) => withFact(`${p} manda luz, calor e vento solar por todo o Sistema Solar.`, f),
        (p, f) => withFact(`Nenhuma viagem espacial começa sem entender o ${p}.`, f),
        (p, f) => withFact(`Atenção, explorador: o ${p} é o motor luminoso da nossa vizinhança cósmica.`, f)
    ],
    Mercury: [
        (p, f) => withFact(`${p} é pequeno, veloz e cheio de crateras. Um mensageiro apressado do Sol.`, f),
        (p, f) => withFact(`Chegamos a ${p}, onde o dia e a noite parecem disputar uma corrida de temperaturas.`, f),
        (p, f) => withFact(`${p} está tão perto do Sol que qualquer nave precisa planejar cada manobra com cuidado.`, f),
        (p, f) => withFact(`Em ${p}, não existe uma atmosfera generosa para suavizar o ambiente.`, f),
        (p, f) => withFact(`${p} parece uma Lua perdida, mas guarda um núcleo metálico enorme.`, f),
        (p, f) => withFact(`A órbita de ${p} é rápida. Pisque duas vezes e ele já mudou de lugar.`, f),
        (p, f) => withFact(`A T.A.R.D.I.S. está em modo sombra: ${p} pode ficar quente demais.`, f),
        (p, f) => withFact(`${p} mostra que tamanho pequeno não significa história simples.`, f),
        (p, f) => withFact(`Este é ${p}: um planeta extremo, silencioso e muito mais misterioso do que parece.`, f),
        (p, f) => withFact(`Hora de investigar ${p}, o planeta que corre mais rápido ao redor do Sol.`, f)
    ],
    Venus: [
        (p, f) => withFact(`${p} é lindo no céu, mas sua superfície é um desafio brutal.`, f),
        (p, f) => withFact(`Bem-vindo a ${p}, o planeta onde o efeito estufa virou superpoder assustador.`, f),
        (p, f) => withFact(`${p} é quase do tamanho da Terra, mas viveu uma história completamente diferente.`, f),
        (p, f) => withFact(`As nuvens de ${p} escondem montanhas, vulcões e uma pressão esmagadora.`, f),
        (p, f) => withFact(`A T.A.R.D.I.S. está reforçando a blindagem. ${p} não brinca em serviço.`, f),
        (p, f) => withFact(`${p} gira de um jeito estranho e desafia nossas expectativas.`, f),
        (p, f) => withFact(`No céu, ${p} brilha como joia. De perto, parece uma fornalha alienígena.`, f),
        (p, f) => withFact(`${p} é uma aula sobre clima, atmosfera e consequências planetárias.`, f),
        (p, f) => withFact(`Vamos estudar ${p} com cuidado: ele é belo, quente e cheio de enigmas.`, f),
        (p, f) => withFact(`Se a Terra tem oceanos, ${p} tem nuvens densas e um segredo vulcânico por baixo.`, f)
    ],
    Earth: [
        (p, f) => withFact(`${p}, nosso lar azul. Pequeno no cosmos, precioso em cada detalhe.`, f),
        (p, f) => withFact(`Chegamos à ${p}. Às vezes o maior mistério é o planeta onde vivemos.`, f),
        (p, f) => withFact(`${p} tem oceanos, atmosfera, campo magnético e uma história viva.`, f),
        (p, f) => withFact(`A T.A.R.D.I.S. sempre faz uma pausa respeitosa quando passa pela ${p}.`, f),
        (p, f) => withFact(`${p} é o único mundo conhecido com vida. Isso já é extraordinário.`, f),
        (p, f) => withFact(`Da órbita, ${p} parece frágil e brilhante. Uma nave natural no espaço.`, f),
        (p, f) => withFact(`${p} ensina que ciência também é cuidado com o lar.`, f),
        (p, f) => withFact(`Aqui na ${p}, cada nuvem, oceano e montanha conta uma parte da história.`, f),
        (p, f) => withFact(`A ${p} é familiar, mas não é simples. Vamos olhar com olhos de explorador.`, f),
        (p, f) => withFact(`Planeta azul detectado. Curiosidade máxima ativada.`, f)
    ],
    Mars: [
        (p, f) => withFact(`${p}, o planeta vermelho. Poeira, cânions, vulcões e muitas perguntas.`, f),
        (p, f) => withFact(`Chegamos a ${p}, onde robôs já viraram exploradores profissionais.`, f),
        (p, f) => withFact(`${p} é frio, seco e cheio de pistas sobre água antiga.`, f),
        (p, f) => withFact(`A T.A.R.D.I.S. estacionou perto de ${p}. Cuidado com a poeira nos controles.`, f),
        (p, f) => withFact(`${p} chama nossa atenção porque parece guardar memórias de um passado mais úmido.`, f),
        (p, f) => withFact(`Em ${p}, cada rocha pode ser uma pista de bilhões de anos.`, f),
        (p, f) => withFact(`${p} tem paisagens gigantescas: vulcões enormes e cânions imensos.`, f),
        (p, f) => withFact(`Robôs, orbitadores e talvez humanos no futuro: ${p} é um alvo de sonhos.`, f),
        (p, f) => withFact(`Vamos decifrar ${p}, um planeta vermelho com alma de mistério.`, f),
        (p, f) => withFact(`Geronimo! ${p} sempre transforma perguntas simples em grandes missões.`, f)
    ],
    Jupiter: [
        (p, f) => withFact(`${p} é um gigante. Quando ele entra na conversa, todos os outros planetas parecem pequenos.`, f),
        (p, f) => withFact(`Estamos diante de ${p}, uma tempestade colossal embrulhada em nuvens.`, f),
        (p, f) => withFact(`${p} tem luas que poderiam ser mundos de aventura por si só.`, f),
        (p, f) => withFact(`A T.A.R.D.I.S. está sentindo a gravidade de ${p}. Segure firme.`, f),
        (p, f) => withFact(`${p} é tão grande que parece um sistema solar em miniatura.`, f),
        (p, f) => withFact(`A Grande Mancha Vermelha de ${p} é uma tempestade com muita história.`, f),
        (p, f) => withFact(`Em ${p}, tudo é enorme: campo magnético, tempestades, luas e mistérios.`, f),
        (p, f) => withFact(`Vamos estudar ${p}, o gigante que ajuda a moldar a vizinhança cósmica.`, f),
        (p, f) => withFact(`${p} parece uma pintura viva feita de nuvens em movimento.`, f),
        (p, f) => withFact(`Allons-y! ${p} é grande demais para uma pergunta pequena.`, f)
    ],
    Saturn: [
        (p, f) => withFact(`${p} chegou com estilo: anéis brilhantes e mistérios por todos os lados.`, f),
        (p, f) => withFact(`Bem-vindo a ${p}, o planeta que parece ter sido desenhado por um artista cósmico.`, f),
        (p, f) => withFact(`${p} é famoso pelos anéis, mas suas luas também roubam a cena.`, f),
        (p, f) => withFact(`A T.A.R.D.I.S. está passando entre partículas de gelo imaginárias. É ${p}!`, f),
        (p, f) => withFact(`${p} flutua na imaginação de todo explorador desde a primeira imagem dos anéis.`, f),
        (p, f) => withFact(`Em ${p}, beleza e ciência viajam juntas.`, f),
        (p, f) => withFact(`Os anéis de ${p} parecem sólidos, mas são feitos de incontáveis fragmentos.`, f),
        (p, f) => withFact(`${p} é uma joia do Sistema Solar, mas também um laboratório gigante.`, f),
        (p, f) => withFact(`Prepare-se: ${p} é elegante, gigantesco e cheio de luas intrigantes.`, f),
        (p, f) => withFact(`Geronimo! ${p} sempre rende uma pergunta bonita e traiçoeira.`, f)
    ],
    Uranus: [
        (p, f) => withFact(`${p} gira quase deitado, como se tivesse escolhido seu próprio estilo.`, f),
        (p, f) => withFact(`Chegamos a ${p}, um gigante de gelo azul-esverdeado e muito diferente.`, f),
        (p, f) => withFact(`${p} é frio, distante e cheio de perguntas ainda sem resposta.`, f),
        (p, f) => withFact(`A T.A.R.D.I.S. inclinou os sensores para acompanhar o eixo estranho de ${p}.`, f),
        (p, f) => withFact(`${p} lembra que planetas também podem ter histórias de colisões gigantescas.`, f),
        (p, f) => withFact(`Poucas naves visitaram ${p}. Isso torna cada dado ainda mais valioso.`, f),
        (p, f) => withFact(`${p} é um gigante de gelo, mas seu mistério é bem quente para a ciência.`, f),
        (p, f) => withFact(`Vamos investigar ${p}, o planeta que parece rolar em torno do Sol.`, f),
        (p, f) => withFact(`${p} está longe, mas não fora do alcance da curiosidade.`, f),
        (p, f) => withFact(`Allons-y! ${p} é perfeito para uma pergunta inesperada.`, f)
    ],
    Neptune: [
        (p, f) => withFact(`${p} é distante, azul e varrido por ventos absurdamente rápidos.`, f),
        (p, f) => withFact(`Chegamos a ${p}, a fronteira azul dos planetas clássicos.`, f),
        (p, f) => withFact(`${p} parece calmo, mas sua atmosfera é uma máquina de ventos extremos.`, f),
        (p, f) => withFact(`A T.A.R.D.I.S. levou um bom salto para alcançar ${p}. Valeu a viagem.`, f),
        (p, f) => withFact(`${p} é um gigante de gelo com luas, anéis tênues e segredos profundos.`, f),
        (p, f) => withFact(`Em ${p}, distância não significa silêncio: a ciência ainda escuta muitas pistas.`, f),
        (p, f) => withFact(`${p} foi previsto pela matemática antes de ser observado diretamente.`, f),
        (p, f) => withFact(`Vamos explorar ${p}, um mundo azul que a Voyager 2 nos mostrou de perto.`, f),
        (p, f) => withFact(`${p} guarda Tritão, uma lua tão estranha que parece história de ficção científica.`, f),
        (p, f) => withFact(`Geronimo! ${p} está longe, mas a pergunta chegou rapidinho.`, f)
    ]
};

export const pickGeneralDoctorLine = () => pick(GENERAL_DOCTOR_LINES);
export const pickCorrectDoctorLine = (planetName) => pick(CORRECT_DOCTOR_LINES)(planetName);
export const pickWrongDoctorLine = (hint) => pick(WRONG_DOCTOR_LINES)(hint);
export const pickPlanetDoctorLine = (planetNameEN, planetName, fact = '') => {
    const list = PLANET_DOCTOR_LINES[planetNameEN] || GENERAL_DOCTOR_LINES.map(line => () => line);
    return pick(list)(planetName, fact);
};
