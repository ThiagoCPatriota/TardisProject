// ============================================
// T.A.R.D.I.S. — Catálogo curado de conquistas
// v24: base menor, mais temática e menos repetitiva.
// ============================================

export const ACHIEVEMENT_CATEGORIES = [
    "Todas",
    "Primeiros Passos",
    "Explorador Planetário",
    "Aprendiz do Doutor",
    "Cientista Cósmico",
    "Mestre das Missões",
    "Pontuação",
    "Viajante do Tempo",
    "Caçador de Segredos",
    "Lenda da T.A.R.D.I.S."
];

export const RARITY_META = {
    common: { label: "Comum", className: "rarity-common" },
    uncommon: { label: "Incomum", className: "rarity-uncommon" },
    rare: { label: "Rara", className: "rarity-rare" },
    epic: { label: "Épica", className: "rarity-epic" },
    legendary: { label: "Lendária", className: "rarity-legendary" }
};

export const ACHIEVEMENTS_DATA = [
    {
        "id": "primeiro-salto",
        "title": "Primeiro Salto",
        "description": "Entre na T.A.R.D.I.S. pela primeira vez.",
        "detail": "Todo viajante começa com um primeiro passo. Esta conquista marca sua primeira entrada real como explorador do Sistema Solar.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/primeiro-salto.svg",
        "maxProgress": 1,
        "pointsReward": 5,
        "hidden": false,
        "trigger": {
            "type": "account_login"
        }
    },
    {
        "id": "painel-de-bordo",
        "title": "Painel de Bordo",
        "description": "Abra a aba de conquistas pela primeira vez.",
        "detail": "Você encontrou o painel onde a T.A.R.D.I.S. registra suas descobertas, missões e marcos de exploração.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/painel-de-bordo.svg",
        "maxProgress": 1,
        "pointsReward": 5,
        "hidden": false,
        "trigger": {
            "type": "achievements_open"
        }
    },
    {
        "id": "chamado-da-galaxia",
        "title": "Chamado da Galáxia",
        "description": "Inicie o Modo Aventura pela primeira vez.",
        "detail": "O Doutor chamou, e você respondeu. Sua primeira aventura começou oficialmente.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/chamado-da-galaxia.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "adventure_started"
        }
    },
    {
        "id": "primeira-missao",
        "title": "Primeira Missão",
        "description": "Responda sua primeira pergunta no Modo Aventura.",
        "detail": "A primeira pergunta respondida é o primeiro teste de atenção, curiosidade e coragem científica.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/primeira-missao.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "question_answered"
        }
    },
    {
        "id": "primeiro-dossie-de-missao",
        "title": "Primeiro Dossiê",
        "description": "Abra seu primeiro dossiê de missão espacial.",
        "detail": "Você deixou de apenas observar os planetas e começou a investigar as missões que revelaram seus segredos.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/primeiro-dossie-de-missao.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_viewed"
        }
    },
    {
        "id": "imagem-do-dia",
        "title": "Imagem do Dia",
        "description": "Veja a imagem astronômica do dia.",
        "detail": "Você abriu uma janela diária para o universo real através da APOD da NASA.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/imagem-do-dia.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "apod_opened"
        }
    },
    {
        "id": "curioso-do-cosmos",
        "title": "Curioso do Cosmos",
        "description": "Abra os detalhes de qualquer planeta ou estrela.",
        "detail": "Você decidiu olhar além da superfície e ler as informações científicas do painel planetário.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/curioso-do-cosmos.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_opened"
        }
    },
    {
        "id": "resposta-certeira",
        "title": "Resposta Certeira",
        "description": "Acerte sua primeira pergunta.",
        "detail": "Uma resposta correta pode parecer pequena, mas é o começo de uma mente científica em expansão.",
        "category": "Aprendiz do Doutor",
        "rarity": "common",
        "image": "assets/achievements/resposta-certeira.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "correct_answer"
        }
    },
    {
        "id": "acertos-5",
        "title": "Memória de Time Lord",
        "description": "Acerte 5 perguntas no total.",
        "detail": "Sua memória começou a guardar fatos de planetas, missões e fenômenos como se viajasse com o Doutor.",
        "category": "Aprendiz do Doutor",
        "rarity": "uncommon",
        "image": "assets/achievements/acertos-5.svg",
        "maxProgress": 5,
        "pointsReward": 15,
        "hidden": false,
        "trigger": {
            "type": "correct_answer_count"
        },
        "progressLabel": "acertos"
    },
    {
        "id": "acertos-10",
        "title": "Mente Cósmica",
        "description": "Acerte 10 perguntas no total.",
        "detail": "Dez respostas corretas mostram que você não está apenas chutando: está aprendendo o mapa do cosmos.",
        "category": "Aprendiz do Doutor",
        "rarity": "uncommon",
        "image": "assets/achievements/acertos-10.svg",
        "maxProgress": 10,
        "pointsReward": 20,
        "hidden": false,
        "trigger": {
            "type": "correct_answer_count"
        },
        "progressLabel": "acertos"
    },
    {
        "id": "acertos-25",
        "title": "Biblioteca Mental",
        "description": "Acerte 25 perguntas no total.",
        "detail": "Sua cabeça já está virando uma pequena biblioteca de astronomia e exploração espacial.",
        "category": "Aprendiz do Doutor",
        "rarity": "rare",
        "image": "assets/achievements/acertos-25.svg",
        "maxProgress": 25,
        "pointsReward": 35,
        "hidden": false,
        "trigger": {
            "type": "correct_answer_count"
        },
        "progressLabel": "acertos"
    },
    {
        "id": "acertos-50",
        "title": "Gênio da Galáxia",
        "description": "Acerte 50 perguntas no total.",
        "detail": "Você já domina muitos detalhes do Sistema Solar e começa a parecer um verdadeiro especialista.",
        "category": "Aprendiz do Doutor",
        "rarity": "epic",
        "image": "assets/achievements/acertos-50.svg",
        "maxProgress": 50,
        "pointsReward": 60,
        "hidden": false,
        "trigger": {
            "type": "correct_answer_count"
        },
        "progressLabel": "acertos"
    },
    {
        "id": "perguntas-respondidas-10",
        "title": "Investigador Atento",
        "description": "Responda 10 perguntas no Modo Aventura.",
        "detail": "Nem toda resposta precisa ser perfeita; o importante é continuar investigando.",
        "category": "Aprendiz do Doutor",
        "rarity": "uncommon",
        "image": "assets/achievements/perguntas-respondidas-10.svg",
        "maxProgress": 10,
        "pointsReward": 20,
        "hidden": false,
        "trigger": {
            "type": "question_answered_count"
        },
        "progressLabel": "perguntas"
    },
    {
        "id": "perguntas-respondidas-50",
        "title": "Tripulante de Perguntas",
        "description": "Responda 50 perguntas no Modo Aventura.",
        "detail": "Você já enfrentou várias rodadas de perguntas e continuou no comando da nave.",
        "category": "Aprendiz do Doutor",
        "rarity": "rare",
        "image": "assets/achievements/perguntas-respondidas-50.svg",
        "maxProgress": 50,
        "pointsReward": 45,
        "hidden": false,
        "trigger": {
            "type": "question_answered_count"
        },
        "progressLabel": "perguntas"
    },
    {
        "id": "questionario-celeste",
        "title": "Questionário Celeste",
        "description": "Responda perguntas sobre todos os astros principais.",
        "detail": "Sol, planetas rochosos e gigantes distantes: você encarou perguntas sobre todo o sistema.",
        "category": "Aprendiz do Doutor",
        "rarity": "rare",
        "image": "assets/achievements/mapa-celeste-completo.svg",
        "maxProgress": 9,
        "pointsReward": 45,
        "hidden": false,
        "trigger": {
            "type": "question_planet_unique"
        },
        "progressLabel": "astros"
    },
    {
        "id": "aprendiz-do-doutor",
        "title": "Aprendiz do Doutor",
        "description": "Complete uma aventura.",
        "detail": "Você chegou ao fim de uma rodada do Modo Aventura, com erros ou acertos, mas sem abandonar a missão.",
        "category": "Aprendiz do Doutor",
        "rarity": "uncommon",
        "image": "assets/achievements/aprendiz-do-doutor.svg",
        "maxProgress": 1,
        "pointsReward": 20,
        "hidden": false,
        "trigger": {
            "type": "adventure_completed"
        }
    },
    {
        "id": "companheiro-da-tardis",
        "title": "Companheiro da T.A.R.D.I.S.",
        "description": "Complete 3 aventuras.",
        "detail": "Três viagens completas mostram que você já sabe acompanhar o ritmo maluco da T.A.R.D.I.S.",
        "category": "Aprendiz do Doutor",
        "rarity": "rare",
        "image": "assets/achievements/companheiro-da-tardis.svg",
        "maxProgress": 3,
        "pointsReward": 45,
        "hidden": false,
        "trigger": {
            "type": "adventure_completed_count"
        },
        "progressLabel": "aventuras"
    },
    {
        "id": "aventuras-completas-10",
        "title": "Veterano do Vórtex",
        "description": "Complete 10 aventuras.",
        "detail": "Você já entrou e saiu do vórtex várias vezes, acumulando conhecimento a cada rodada.",
        "category": "Aprendiz do Doutor",
        "rarity": "epic",
        "image": "assets/achievements/aventuras-completas-10.svg",
        "maxProgress": 10,
        "pointsReward": 80,
        "hidden": false,
        "trigger": {
            "type": "adventure_completed_count"
        },
        "progressLabel": "aventuras"
    },
    {
        "id": "desempenho-80",
        "title": "Rota Estável",
        "description": "Termine uma aventura com 80% ou mais de desempenho.",
        "detail": "Você manteve a nave no curso certo e terminou a missão com ótimo aproveitamento.",
        "category": "Aprendiz do Doutor",
        "rarity": "rare",
        "image": "assets/achievements/desempenho-80.svg",
        "maxProgress": 1,
        "pointsReward": 35,
        "hidden": false,
        "trigger": {
            "type": "adventure_percent",
            "percent": 80
        }
    },
    {
        "id": "desempenho-90",
        "title": "Quase Perfeito",
        "description": "Termine uma aventura com 90% ou mais de desempenho.",
        "detail": "Uma rodada quase impecável. O Doutor provavelmente diria que isso foi brilhante.",
        "category": "Aprendiz do Doutor",
        "rarity": "epic",
        "image": "assets/achievements/desempenho-90.svg",
        "maxProgress": 1,
        "pointsReward": 60,
        "hidden": false,
        "trigger": {
            "type": "adventure_percent",
            "percent": 90
        }
    },
    {
        "id": "rodadas-perfeitas-1",
        "title": "Sem Perder o Pulso",
        "description": "Complete uma aventura sem errar.",
        "detail": "Nenhum desvio, nenhuma penalidade, nenhuma hesitação: uma missão limpa.",
        "category": "Aprendiz do Doutor",
        "rarity": "epic",
        "image": "assets/achievements/rodadas-perfeitas-1.svg",
        "maxProgress": 1,
        "pointsReward": 70,
        "hidden": false,
        "trigger": {
            "type": "perfect_adventure_count"
        }
    },
    {
        "id": "sequencia-5",
        "title": "Raciocínio Regenerado",
        "description": "Acerte 5 perguntas seguidas em uma sessão.",
        "detail": "Cinco respostas corretas em sequência mostram foco, memória e uma pitada de energia Gallifreiana.",
        "category": "Aprendiz do Doutor",
        "rarity": "rare",
        "image": "assets/achievements/acertos-5.svg",
        "maxProgress": 1,
        "pointsReward": 50,
        "hidden": true,
        "trigger": {
            "type": "correct_answer_streak",
            "streak": 5
        }
    },
    {
        "id": "primeiros-10-pontos",
        "title": "Primeiros 10 Pontos",
        "description": "Alcance 10 pontos acumulados no Modo Aventura.",
        "detail": "Sua primeira dezena de pontos marca o início da sua pontuação como explorador.",
        "category": "Pontuação",
        "rarity": "common",
        "image": "assets/achievements/primeiros-10-pontos.svg",
        "maxProgress": 10,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "score_total"
        },
        "progressLabel": "pts"
    },
    {
        "id": "pontos-acumulados-50",
        "title": "Sinal no Radar",
        "description": "Alcance 50 pontos acumulados.",
        "detail": "Sua pontuação começou a aparecer no radar da T.A.R.D.I.S.",
        "category": "Pontuação",
        "rarity": "uncommon",
        "image": "assets/achievements/pontos-acumulados-50.svg",
        "maxProgress": 50,
        "pointsReward": 20,
        "hidden": false,
        "trigger": {
            "type": "score_total"
        },
        "progressLabel": "pts"
    },
    {
        "id": "pontos-acumulados-100",
        "title": "Rota Brilhante",
        "description": "Alcance 100 pontos acumulados.",
        "detail": "Cem pontos mostram que suas aventuras já renderam um histórico respeitável.",
        "category": "Pontuação",
        "rarity": "rare",
        "image": "assets/achievements/pontos-acumulados-100.svg",
        "maxProgress": 100,
        "pointsReward": 40,
        "hidden": false,
        "trigger": {
            "type": "score_total"
        },
        "progressLabel": "pts"
    },
    {
        "id": "pontos-acumulados-250",
        "title": "Combustível Estelar",
        "description": "Alcance 250 pontos acumulados.",
        "detail": "Sua pontuação já parece combustível suficiente para atravessar uma região inteira do espaço.",
        "category": "Pontuação",
        "rarity": "rare",
        "image": "assets/achievements/pontos-acumulados-250.svg",
        "maxProgress": 250,
        "pointsReward": 60,
        "hidden": false,
        "trigger": {
            "type": "score_total"
        },
        "progressLabel": "pts"
    },
    {
        "id": "pontos-acumulados-500",
        "title": "Motor de Dobra",
        "description": "Alcance 500 pontos acumulados.",
        "detail": "Quinhentos pontos indicam consistência, curiosidade e muitas respostas corretas.",
        "category": "Pontuação",
        "rarity": "epic",
        "image": "assets/achievements/pontos-acumulados-500.svg",
        "maxProgress": 500,
        "pointsReward": 90,
        "hidden": false,
        "trigger": {
            "type": "score_total"
        },
        "progressLabel": "pts"
    },
    {
        "id": "pontos-acumulados-1000",
        "title": "Constelação de Pontos",
        "description": "Alcance 1000 pontos acumulados.",
        "detail": "Você transformou perguntas em uma constelação inteira de pontuação.",
        "category": "Pontuação",
        "rarity": "epic",
        "image": "assets/achievements/pontos-acumulados-1000.svg",
        "maxProgress": 1000,
        "pointsReward": 120,
        "hidden": false,
        "trigger": {
            "type": "score_total"
        },
        "progressLabel": "pts"
    },
    {
        "id": "pontos-acumulados-5000",
        "title": "Lenda Numérica",
        "description": "Alcance 5000 pontos acumulados.",
        "detail": "Uma pontuação de longo prazo para quem realmente decidiu dominar a aventura.",
        "category": "Pontuação",
        "rarity": "legendary",
        "image": "assets/achievements/pontos-acumulados-5000.svg",
        "maxProgress": 5000,
        "pointsReward": 220,
        "hidden": false,
        "trigger": {
            "type": "score_total"
        },
        "progressLabel": "pts"
    },
    {
        "id": "visitar-sun",
        "title": "Sol no Radar",
        "description": "Visite Sol pela primeira vez.",
        "detail": "Você fez sua primeira aproximação exploratória em Sol, registrando esse astro no diário da T.A.R.D.I.S.",
        "category": "Explorador Planetário",
        "rarity": "common",
        "image": "assets/achievements/visitar-sol.svg",
        "maxProgress": 1,
        "pointsReward": 12,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Sun"
        }
    },
    {
        "id": "visitar-mercury",
        "title": "Mercúrio no Radar",
        "description": "Visite Mercúrio pela primeira vez.",
        "detail": "Você fez sua primeira aproximação exploratória em Mercúrio, registrando esse astro no diário da T.A.R.D.I.S.",
        "category": "Explorador Planetário",
        "rarity": "common",
        "image": "assets/achievements/visitar-mercurio.svg",
        "maxProgress": 1,
        "pointsReward": 12,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Mercury"
        }
    },
    {
        "id": "visitar-venus",
        "title": "Vênus no Radar",
        "description": "Visite Vênus pela primeira vez.",
        "detail": "Você fez sua primeira aproximação exploratória em Vênus, registrando esse astro no diário da T.A.R.D.I.S.",
        "category": "Explorador Planetário",
        "rarity": "common",
        "image": "assets/achievements/visitar-venus.svg",
        "maxProgress": 1,
        "pointsReward": 12,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Venus"
        }
    },
    {
        "id": "visitar-earth",
        "title": "Terra no Radar",
        "description": "Visite Terra pela primeira vez.",
        "detail": "Você fez sua primeira aproximação exploratória em Terra, registrando esse astro no diário da T.A.R.D.I.S.",
        "category": "Explorador Planetário",
        "rarity": "common",
        "image": "assets/achievements/visitar-terra.svg",
        "maxProgress": 1,
        "pointsReward": 12,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Earth"
        }
    },
    {
        "id": "visitar-mars",
        "title": "Marte no Radar",
        "description": "Visite Marte pela primeira vez.",
        "detail": "Você fez sua primeira aproximação exploratória em Marte, registrando esse astro no diário da T.A.R.D.I.S.",
        "category": "Explorador Planetário",
        "rarity": "common",
        "image": "assets/achievements/visitar-marte.svg",
        "maxProgress": 1,
        "pointsReward": 12,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Mars"
        }
    },
    {
        "id": "visitar-jupiter",
        "title": "Júpiter no Radar",
        "description": "Visite Júpiter pela primeira vez.",
        "detail": "Você fez sua primeira aproximação exploratória em Júpiter, registrando esse astro no diário da T.A.R.D.I.S.",
        "category": "Explorador Planetário",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-jupiter.svg",
        "maxProgress": 1,
        "pointsReward": 12,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Jupiter"
        }
    },
    {
        "id": "visitar-saturn",
        "title": "Saturno no Radar",
        "description": "Visite Saturno pela primeira vez.",
        "detail": "Você fez sua primeira aproximação exploratória em Saturno, registrando esse astro no diário da T.A.R.D.I.S.",
        "category": "Explorador Planetário",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-saturno.svg",
        "maxProgress": 1,
        "pointsReward": 12,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Saturn"
        }
    },
    {
        "id": "visitar-uranus",
        "title": "Urano no Radar",
        "description": "Visite Urano pela primeira vez.",
        "detail": "Você fez sua primeira aproximação exploratória em Urano, registrando esse astro no diário da T.A.R.D.I.S.",
        "category": "Explorador Planetário",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-urano.svg",
        "maxProgress": 1,
        "pointsReward": 12,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Uranus"
        }
    },
    {
        "id": "visitar-neptune",
        "title": "Netuno no Radar",
        "description": "Visite Netuno pela primeira vez.",
        "detail": "Você fez sua primeira aproximação exploratória em Netuno, registrando esse astro no diário da T.A.R.D.I.S.",
        "category": "Explorador Planetário",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-netuno.svg",
        "maxProgress": 1,
        "pointsReward": 12,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Neptune"
        }
    },
    {
        "id": "turista-espacial",
        "title": "Turista Espacial",
        "description": "Visite 3 astros diferentes.",
        "detail": "Você começou a montar seu próprio roteiro pelo Sistema Solar.",
        "category": "Explorador Planetário",
        "rarity": "uncommon",
        "image": "assets/achievements/turista-espacial.svg",
        "maxProgress": 3,
        "pointsReward": 25,
        "hidden": false,
        "trigger": {
            "type": "unique_planet_visit"
        },
        "progressLabel": "astros"
    },
    {
        "id": "colecionador-cosmico",
        "title": "Colecionador Cósmico",
        "description": "Visite 5 astros diferentes.",
        "detail": "Cinco astros visitados já formam uma rota de exploração respeitável.",
        "category": "Explorador Planetário",
        "rarity": "rare",
        "image": "assets/achievements/colecionador-cosmico.svg",
        "maxProgress": 5,
        "pointsReward": 45,
        "hidden": false,
        "trigger": {
            "type": "unique_planet_visit"
        },
        "progressLabel": "astros"
    },
    {
        "id": "mapa-celeste-completo",
        "title": "Mapa Celeste Completo",
        "description": "Visite todos os astros principais.",
        "detail": "Você registrou o Sol e todos os planetas principais no seu mapa celeste.",
        "category": "Explorador Planetário",
        "rarity": "epic",
        "image": "assets/achievements/mapa-celeste-completo.svg",
        "maxProgress": 9,
        "pointsReward": 90,
        "hidden": false,
        "trigger": {
            "type": "unique_planet_visit"
        },
        "progressLabel": "astros"
    },
    {
        "id": "mundos-rochosos",
        "title": "Quatro Mundos Rochosos",
        "description": "Visite Mercúrio, Vênus, Terra e Marte.",
        "detail": "Você completou a trilha dos mundos rochosos, os planetas de superfície sólida mais próximos do Sol.",
        "category": "Explorador Planetário",
        "rarity": "rare",
        "image": "assets/achievements/mundos-rochosos.svg",
        "maxProgress": 4,
        "pointsReward": 55,
        "hidden": false,
        "trigger": {
            "type": "planet_group",
            "planets": [
                "Mercury",
                "Venus",
                "Earth",
                "Mars"
            ]
        },
        "progressLabel": "mundos"
    },
    {
        "id": "gigantes-do-vazio",
        "title": "Gigantes do Vazio",
        "description": "Visite Júpiter, Saturno, Urano e Netuno.",
        "detail": "Você encarou os mundos gigantes que dominam a parte externa do Sistema Solar.",
        "category": "Explorador Planetário",
        "rarity": "epic",
        "image": "assets/achievements/gigantes-classicos.svg",
        "maxProgress": 4,
        "pointsReward": 75,
        "hidden": false,
        "trigger": {
            "type": "planet_group",
            "planets": [
                "Jupiter",
                "Saturn",
                "Uranus",
                "Neptune"
            ]
        },
        "progressLabel": "gigantes"
    },
    {
        "id": "rota-extrema",
        "title": "Rota Extrema",
        "description": "Visite Sol, Mercúrio e Netuno.",
        "detail": "Do calor do Sol à fronteira azul de Netuno: você cruzou extremos do Sistema Solar.",
        "category": "Explorador Planetário",
        "rarity": "legendary",
        "image": "assets/achievements/rota-extrema.svg",
        "maxProgress": 3,
        "pointsReward": 110,
        "hidden": true,
        "trigger": {
            "type": "planet_group",
            "planets": [
                "Sun",
                "Mercury",
                "Neptune"
            ]
        },
        "progressLabel": "extremos"
    },
    {
        "id": "detalhes-sun",
        "title": "Arquivo Sol",
        "description": "Abra os detalhes de Sol.",
        "detail": "Você abriu o arquivo de bordo de Sol e estudou suas características, curiosidades e dados científicos.",
        "category": "Cientista Cósmico",
        "rarity": "common",
        "image": "assets/achievements/detalhes-sol.svg",
        "maxProgress": 1,
        "pointsReward": 14,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Sun"
        }
    },
    {
        "id": "detalhes-mercury",
        "title": "Arquivo Mercúrio",
        "description": "Abra os detalhes de Mercúrio.",
        "detail": "Você abriu o arquivo de bordo de Mercúrio e estudou suas características, curiosidades e dados científicos.",
        "category": "Cientista Cósmico",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-mercurio.svg",
        "maxProgress": 1,
        "pointsReward": 14,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Mercury"
        }
    },
    {
        "id": "detalhes-venus",
        "title": "Arquivo Vênus",
        "description": "Abra os detalhes de Vênus.",
        "detail": "Você abriu o arquivo de bordo de Vênus e estudou suas características, curiosidades e dados científicos.",
        "category": "Cientista Cósmico",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-venus.svg",
        "maxProgress": 1,
        "pointsReward": 14,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Venus"
        }
    },
    {
        "id": "detalhes-earth",
        "title": "Arquivo Terra",
        "description": "Abra os detalhes de Terra.",
        "detail": "Você abriu o arquivo de bordo de Terra e estudou suas características, curiosidades e dados científicos.",
        "category": "Cientista Cósmico",
        "rarity": "common",
        "image": "assets/achievements/detalhes-terra.svg",
        "maxProgress": 1,
        "pointsReward": 14,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Earth"
        }
    },
    {
        "id": "detalhes-mars",
        "title": "Arquivo Marte",
        "description": "Abra os detalhes de Marte.",
        "detail": "Você abriu o arquivo de bordo de Marte e estudou suas características, curiosidades e dados científicos.",
        "category": "Cientista Cósmico",
        "rarity": "common",
        "image": "assets/achievements/detalhes-marte.svg",
        "maxProgress": 1,
        "pointsReward": 14,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Mars"
        }
    },
    {
        "id": "detalhes-jupiter",
        "title": "Arquivo Júpiter",
        "description": "Abra os detalhes de Júpiter.",
        "detail": "Você abriu o arquivo de bordo de Júpiter e estudou suas características, curiosidades e dados científicos.",
        "category": "Cientista Cósmico",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-jupiter.svg",
        "maxProgress": 1,
        "pointsReward": 14,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Jupiter"
        }
    },
    {
        "id": "detalhes-saturn",
        "title": "Arquivo Saturno",
        "description": "Abra os detalhes de Saturno.",
        "detail": "Você abriu o arquivo de bordo de Saturno e estudou suas características, curiosidades e dados científicos.",
        "category": "Cientista Cósmico",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-saturno.svg",
        "maxProgress": 1,
        "pointsReward": 14,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Saturn"
        }
    },
    {
        "id": "detalhes-uranus",
        "title": "Arquivo Urano",
        "description": "Abra os detalhes de Urano.",
        "detail": "Você abriu o arquivo de bordo de Urano e estudou suas características, curiosidades e dados científicos.",
        "category": "Cientista Cósmico",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-urano.svg",
        "maxProgress": 1,
        "pointsReward": 14,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Uranus"
        }
    },
    {
        "id": "detalhes-neptune",
        "title": "Arquivo Netuno",
        "description": "Abra os detalhes de Netuno.",
        "detail": "Você abriu o arquivo de bordo de Netuno e estudou suas características, curiosidades e dados científicos.",
        "category": "Cientista Cósmico",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-netuno.svg",
        "maxProgress": 1,
        "pointsReward": 14,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Neptune"
        }
    },
    {
        "id": "bibliotecario-espacial",
        "title": "Bibliotecário Espacial",
        "description": "Abra detalhes de todos os astros principais.",
        "detail": "Você completou uma rodada de leitura científica por todos os arquivos planetários.",
        "category": "Cientista Cósmico",
        "rarity": "epic",
        "image": "assets/achievements/bibliotecario-espacial.svg",
        "maxProgress": 9,
        "pointsReward": 95,
        "hidden": false,
        "trigger": {
            "type": "unique_planet_detail"
        },
        "progressLabel": "arquivos"
    },
    {
        "id": "atlas-rochoso",
        "title": "Atlas Rochoso",
        "description": "Abra detalhes dos quatro planetas rochosos.",
        "detail": "Mercúrio, Vênus, Terra e Marte agora têm páginas registradas no seu atlas.",
        "category": "Cientista Cósmico",
        "rarity": "rare",
        "image": "assets/achievements/mundos-rochosos.svg",
        "maxProgress": 4,
        "pointsReward": 50,
        "hidden": false,
        "trigger": {
            "type": "detail_group",
            "planets": [
                "Mercury",
                "Venus",
                "Earth",
                "Mars"
            ]
        },
        "progressLabel": "arquivos"
    },
    {
        "id": "primeira-missao-sun",
        "title": "Dossiê de Sol",
        "description": "Abra um dossiê de missão relacionado a Sol.",
        "detail": "Você investigou uma missão espacial conectada a Sol, indo além dos dados básicos do astro.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-sol.svg",
        "maxProgress": 1,
        "pointsReward": 18,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Sun"
        }
    },
    {
        "id": "primeira-missao-mercury",
        "title": "Dossiê de Mercúrio",
        "description": "Abra um dossiê de missão relacionado a Mercúrio.",
        "detail": "Você investigou uma missão espacial conectada a Mercúrio, indo além dos dados básicos do astro.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-mercurio.svg",
        "maxProgress": 1,
        "pointsReward": 18,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Mercury"
        }
    },
    {
        "id": "primeira-missao-venus",
        "title": "Dossiê de Vênus",
        "description": "Abra um dossiê de missão relacionado a Vênus.",
        "detail": "Você investigou uma missão espacial conectada a Vênus, indo além dos dados básicos do astro.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-venus.svg",
        "maxProgress": 1,
        "pointsReward": 18,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Venus"
        }
    },
    {
        "id": "primeira-missao-earth",
        "title": "Dossiê de Terra",
        "description": "Abra um dossiê de missão relacionado a Terra.",
        "detail": "Você investigou uma missão espacial conectada a Terra, indo além dos dados básicos do astro.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-terra.svg",
        "maxProgress": 1,
        "pointsReward": 18,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Earth"
        }
    },
    {
        "id": "primeira-missao-mars",
        "title": "Dossiê de Marte",
        "description": "Abra um dossiê de missão relacionado a Marte.",
        "detail": "Você investigou uma missão espacial conectada a Marte, indo além dos dados básicos do astro.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-marte.svg",
        "maxProgress": 1,
        "pointsReward": 18,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Mars"
        }
    },
    {
        "id": "primeira-missao-jupiter",
        "title": "Dossiê de Júpiter",
        "description": "Abra um dossiê de missão relacionado a Júpiter.",
        "detail": "Você investigou uma missão espacial conectada a Júpiter, indo além dos dados básicos do astro.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-jupiter.svg",
        "maxProgress": 1,
        "pointsReward": 18,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Jupiter"
        }
    },
    {
        "id": "primeira-missao-saturn",
        "title": "Dossiê de Saturno",
        "description": "Abra um dossiê de missão relacionado a Saturno.",
        "detail": "Você investigou uma missão espacial conectada a Saturno, indo além dos dados básicos do astro.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-saturno.svg",
        "maxProgress": 1,
        "pointsReward": 18,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Saturn"
        }
    },
    {
        "id": "primeira-missao-uranus",
        "title": "Dossiê de Urano",
        "description": "Abra um dossiê de missão relacionado a Urano.",
        "detail": "Você investigou uma missão espacial conectada a Urano, indo além dos dados básicos do astro.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-urano.svg",
        "maxProgress": 1,
        "pointsReward": 18,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Uranus"
        }
    },
    {
        "id": "primeira-missao-neptune",
        "title": "Dossiê de Netuno",
        "description": "Abra um dossiê de missão relacionado a Netuno.",
        "detail": "Você investigou uma missão espacial conectada a Netuno, indo além dos dados básicos do astro.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-netuno.svg",
        "maxProgress": 1,
        "pointsReward": 18,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Neptune"
        }
    },
    {
        "id": "missoes-unicas-5",
        "title": "Cinco Dossiês",
        "description": "Abra 5 dossiês de missões diferentes.",
        "detail": "Você começou a montar uma coleção real de missões espaciais estudadas.",
        "category": "Mestre das Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/missoes-unicas-5.svg",
        "maxProgress": 5,
        "pointsReward": 35,
        "hidden": false,
        "trigger": {
            "type": "unique_mission_view"
        },
        "progressLabel": "dossiês"
    },
    {
        "id": "missoes-unicas-10",
        "title": "Mesa de Controle da NASA",
        "description": "Abra 10 dossiês de missões diferentes.",
        "detail": "Dez dossiês mostram que você está conectando planetas às missões que os revelaram.",
        "category": "Mestre das Missões",
        "rarity": "rare",
        "image": "assets/achievements/missoes-unicas-10.svg",
        "maxProgress": 10,
        "pointsReward": 55,
        "hidden": false,
        "trigger": {
            "type": "unique_mission_view"
        },
        "progressLabel": "dossiês"
    },
    {
        "id": "missoes-unicas-20",
        "title": "Arquivo Interplanetário",
        "description": "Abra 20 dossiês de missões diferentes.",
        "detail": "Seu arquivo de missões já cobre uma parte impressionante da exploração espacial.",
        "category": "Mestre das Missões",
        "rarity": "epic",
        "image": "assets/achievements/missoes-unicas-20.svg",
        "maxProgress": 20,
        "pointsReward": 90,
        "hidden": false,
        "trigger": {
            "type": "unique_mission_view"
        },
        "progressLabel": "dossiês"
    },
    {
        "id": "arquivo-sol-completo",
        "title": "Arquivo Solar",
        "description": "Abra todos os dossiês de missão do Sol.",
        "detail": "Você estudou observatórios e sondas que monitoram a estrela que sustenta o Sistema Solar.",
        "category": "Mestre das Missões",
        "rarity": "rare",
        "image": "assets/achievements/arquivo-sol-completo.svg",
        "maxProgress": 5,
        "pointsReward": 65,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Sun"
        },
        "progressLabel": "dossiês"
    },
    {
        "id": "arquivo-marte-completo",
        "title": "O Chamado de Marte",
        "description": "Abra todos os dossiês de missão de Marte.",
        "detail": "De Viking a Perseverance, você acompanhou a longa busca por respostas no planeta vermelho.",
        "category": "Mestre das Missões",
        "rarity": "epic",
        "image": "assets/achievements/arquivo-marte-completo.svg",
        "maxProgress": 5,
        "pointsReward": 85,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Mars"
        },
        "progressLabel": "dossiês"
    },
    {
        "id": "arquivo-saturno-completo",
        "title": "Ecos de Cassini",
        "description": "Abra todos os dossiês de missão de Saturno.",
        "detail": "Você percorreu a história das sondas que revelaram anéis, luas e oceanos escondidos.",
        "category": "Mestre das Missões",
        "rarity": "epic",
        "image": "assets/achievements/arquivo-saturno-completo.svg",
        "maxProgress": 5,
        "pointsReward": 85,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Saturn"
        },
        "progressLabel": "dossiês"
    },
    {
        "id": "rota-voyager",
        "title": "Rota da Voyager",
        "description": "Abra dossiês da Voyager nos gigantes externos.",
        "detail": "Você seguiu uma das rotas mais lendárias da exploração espacial humana.",
        "category": "Mestre das Missões",
        "rarity": "legendary",
        "image": "assets/achievements/rota-extrema.svg",
        "maxProgress": 4,
        "pointsReward": 120,
        "hidden": true,
        "trigger": {
            "type": "mission_group",
            "missions": [
                "Jupiter::Voyager 1 & 2",
                "Saturn::Voyager 2",
                "Uranus::Voyager 2",
                "Neptune::Voyager 2"
            ]
        },
        "progressLabel": "dossiês"
    },
    {
        "id": "missao-terra-apollo-11",
        "title": "Pegadas na Lua",
        "description": "Abra o dossiê Apollo 11.",
        "detail": "A missão que levou seres humanos à Lua ganhou um lugar especial no seu arquivo.",
        "category": "Mestre das Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-terra-apollo-11.svg",
        "maxProgress": 1,
        "pointsReward": 45,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Earth",
            "mission": "Apollo 11"
        }
    },
    {
        "id": "dias-ativos-2",
        "title": "Voltei para a Nave",
        "description": "Acesse o projeto em 2 dias diferentes.",
        "detail": "Você retornou à T.A.R.D.I.S. em outro dia, mostrando que a exploração continua.",
        "category": "Viajante do Tempo",
        "rarity": "common",
        "image": "assets/achievements/dias-ativos-2.svg",
        "maxProgress": 2,
        "pointsReward": 15,
        "hidden": false,
        "trigger": {
            "type": "active_day"
        },
        "progressLabel": "dias"
    },
    {
        "id": "dias-ativos-7",
        "title": "Semana no Vórtex",
        "description": "Acesse o projeto em 7 dias diferentes.",
        "detail": "Uma semana de retornos transforma curiosidade em hábito de exploração.",
        "category": "Viajante do Tempo",
        "rarity": "rare",
        "image": "assets/achievements/dias-ativos-7.svg",
        "maxProgress": 7,
        "pointsReward": 60,
        "hidden": false,
        "trigger": {
            "type": "active_day"
        },
        "progressLabel": "dias"
    },
    {
        "id": "dias-ativos-15",
        "title": "Companheiro Persistente",
        "description": "Acesse o projeto em 15 dias diferentes.",
        "detail": "Você já não é visitante: é parte da tripulação recorrente da T.A.R.D.I.S.",
        "category": "Viajante do Tempo",
        "rarity": "epic",
        "image": "assets/achievements/dias-ativos-15.svg",
        "maxProgress": 15,
        "pointsReward": 100,
        "hidden": false,
        "trigger": {
            "type": "active_day"
        },
        "progressLabel": "dias"
    },
    {
        "id": "dias-ativos-30",
        "title": "Guardião da T.A.R.D.I.S.",
        "description": "Acesse o projeto em 30 dias diferentes.",
        "detail": "Trinta dias de exploração marcam uma jornada longa e dedicada.",
        "category": "Viajante do Tempo",
        "rarity": "legendary",
        "image": "assets/achievements/dias-ativos-30.svg",
        "maxProgress": 30,
        "pointsReward": 200,
        "hidden": false,
        "trigger": {
            "type": "active_day"
        },
        "progressLabel": "dias"
    },
    {
        "id": "companheiro-do-doutor-dias",
        "title": "Companheiro do Doutor",
        "description": "Complete aventuras em 3 dias diferentes.",
        "detail": "Você não apenas joga várias vezes; você volta em dias diferentes para novas viagens.",
        "category": "Viajante do Tempo",
        "rarity": "epic",
        "image": "assets/achievements/companheiro-da-tardis.svg",
        "maxProgress": 3,
        "pointsReward": 100,
        "hidden": true,
        "trigger": {
            "type": "adventure_day_unique"
        },
        "progressLabel": "dias"
    },
    {
        "id": "conquistas-10",
        "title": "Primeira Prateleira",
        "description": "Desbloqueie 10 conquistas.",
        "detail": "Sua coleção começou a tomar forma com dez marcos registrados.",
        "category": "Lenda da T.A.R.D.I.S.",
        "rarity": "uncommon",
        "image": "assets/achievements/colecionador-cosmico.svg",
        "maxProgress": 10,
        "pointsReward": 30,
        "hidden": false,
        "trigger": {
            "type": "achievement_unlocked_total"
        },
        "progressLabel": "conquistas"
    },
    {
        "id": "conquistas-25",
        "title": "Galeria de Insígnias",
        "description": "Desbloqueie 25 conquistas.",
        "detail": "Vinte e cinco conquistas já formam uma galeria digna de explorador.",
        "category": "Lenda da T.A.R.D.I.S.",
        "rarity": "rare",
        "image": "assets/achievements/colecionador-cosmico.svg",
        "maxProgress": 25,
        "pointsReward": 70,
        "hidden": false,
        "trigger": {
            "type": "achievement_unlocked_total"
        },
        "progressLabel": "conquistas"
    },
    {
        "id": "explorador-equilibrado",
        "title": "Explorador Equilibrado",
        "description": "Visite 5 astros, abra 5 dossiês e acerte 10 perguntas.",
        "detail": "Uma conquista secreta para quem não fica preso em uma só parte: explora, lê e responde.",
        "category": "Caçador de Segredos",
        "rarity": "epic",
        "image": "assets/achievements/mapa-celeste-completo.svg",
        "maxProgress": 3,
        "pointsReward": 120,
        "hidden": true,
        "trigger": {
            "type": "balanced_explorer"
        },
        "progressLabel": "etapas"
    }
];
