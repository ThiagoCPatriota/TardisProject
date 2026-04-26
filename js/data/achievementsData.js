// ============================================
// T.A.R.D.I.S. — Catálogo expandido de conquistas
// v19: 200 conquistas com gatilhos preparados para conta, aventura, exploração, missões e frequência.
// ============================================

export const ACHIEVEMENT_CATEGORIES = [
    "Todas",
    "Primeiros Passos",
    "Frequência",
    "Modo Aventura",
    "Pontuação",
    "Exploração Planetária",
    "Conhecimento Espacial",
    "Dossiê de Missões",
    "Desafios Especiais"
];

export const RARITY_META = {
    "common": {
        "label": "Comum",
        "className": "rarity-common"
    },
    "uncommon": {
        "label": "Incomum",
        "className": "rarity-uncommon"
    },
    "rare": {
        "label": "Rara",
        "className": "rarity-rare"
    },
    "epic": {
        "label": "Épica",
        "className": "rarity-epic"
    },
    "legendary": {
        "label": "Lendária",
        "className": "rarity-legendary"
    }
};

export const ACHIEVEMENTS_DATA = [
    {
        "id": "novo-explorador",
        "title": "Novo Explorador",
        "description": "Crie sua conta de explorador.",
        "detail": "Sua identidade de explorador foi registrada na T.A.R.D.I.S. Agora suas descobertas podem viajar com você entre sessões.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/novo-explorador.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "account_login"
        }
    },
    {
        "id": "primeiro-salto",
        "title": "Primeiro Salto",
        "description": "Entre no T.A.R.D.I.S. pela primeira vez.",
        "detail": "Todo grande explorador começa com um primeiro salto pelo espaço-tempo.",
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
        "detail": "Você encontrou o painel onde suas descobertas ficam registradas.",
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
        "id": "painel-aberto-3",
        "title": "Checklist 3x",
        "description": "Abra o painel de conquistas 3 vezes.",
        "detail": "Um explorador atento sempre revisa o próprio painel de bordo. Você abriu o painel de conquistas 3 vezes.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/painel-aberto-3.svg",
        "maxProgress": 3,
        "pointsReward": 5,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "achievements_open_count"
        }
    },
    {
        "id": "painel-aberto-5",
        "title": "Checklist 5x",
        "description": "Abra o painel de conquistas 5 vezes.",
        "detail": "Um explorador atento sempre revisa o próprio painel de bordo. Você abriu o painel de conquistas 5 vezes.",
        "category": "Primeiros Passos",
        "rarity": "uncommon",
        "image": "assets/achievements/painel-aberto-5.svg",
        "maxProgress": 5,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "achievements_open_count"
        }
    },
    {
        "id": "painel-aberto-10",
        "title": "Checklist 10x",
        "description": "Abra o painel de conquistas 10 vezes.",
        "detail": "Um explorador atento sempre revisa o próprio painel de bordo. Você abriu o painel de conquistas 10 vezes.",
        "category": "Primeiros Passos",
        "rarity": "uncommon",
        "image": "assets/achievements/painel-aberto-10.svg",
        "maxProgress": 10,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "achievements_open_count"
        }
    },
    {
        "id": "painel-aberto-25",
        "title": "Checklist 25x",
        "description": "Abra o painel de conquistas 25 vezes.",
        "detail": "Um explorador atento sempre revisa o próprio painel de bordo. Você abriu o painel de conquistas 25 vezes.",
        "category": "Primeiros Passos",
        "rarity": "rare",
        "image": "assets/achievements/painel-aberto-25.svg",
        "maxProgress": 25,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "achievements_open_count"
        }
    },
    {
        "id": "painel-aberto-50",
        "title": "Checklist 50x",
        "description": "Abra o painel de conquistas 50 vezes.",
        "detail": "Um explorador atento sempre revisa o próprio painel de bordo. Você abriu o painel de conquistas 50 vezes.",
        "category": "Primeiros Passos",
        "rarity": "epic",
        "image": "assets/achievements/painel-aberto-50.svg",
        "maxProgress": 50,
        "pointsReward": 40,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "achievements_open_count"
        }
    },
    {
        "id": "perfil-em-ordem",
        "title": "Perfil em Ordem",
        "description": "Entre novamente com sua conta de explorador.",
        "detail": "Sua conta voltou a ser reconhecida pela T.A.R.D.I.S., mantendo seu progresso protegido.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/perfil-em-ordem.svg",
        "maxProgress": 1,
        "pointsReward": 5,
        "hidden": false,
        "trigger": {
            "type": "account_login"
        }
    },
    {
        "id": "tripulante-identificado",
        "title": "Tripulante Identificado",
        "description": "Faça login em 3 sessões diferentes.",
        "detail": "A T.A.R.D.I.S. reconheceu sua presença em várias viagens.",
        "category": "Primeiros Passos",
        "rarity": "uncommon",
        "image": "assets/achievements/tripulante-identificado.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "sessões",
        "trigger": {
            "type": "login_session_count"
        }
    },
    {
        "id": "companhia-da-tardis",
        "title": "Companhia da T.A.R.D.I.S.",
        "description": "Faça login em 10 sessões diferentes.",
        "detail": "Você já está virando presença constante nas viagens pelo Sistema Solar.",
        "category": "Primeiros Passos",
        "rarity": "rare",
        "image": "assets/achievements/companhia-da-tardis.svg",
        "maxProgress": 10,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "sessões",
        "trigger": {
            "type": "login_session_count"
        }
    },
    {
        "id": "nome-de-explorador",
        "title": "Nome de Explorador",
        "description": "Use sua conta com Nome de Explorador.",
        "detail": "Seu nome de explorador aparece no painel como sua assinatura espacial.",
        "category": "Primeiros Passos",
        "rarity": "common",
        "image": "assets/achievements/nome-de-explorador.svg",
        "maxProgress": 1,
        "pointsReward": 5,
        "hidden": false,
        "trigger": {
            "type": "account_login"
        }
    },
    {
        "id": "dias-ativos-2",
        "title": "Voltei para a Nave",
        "description": "Acesse o projeto em 2 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 2 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "common",
        "image": "assets/achievements/dias-ativos-2.svg",
        "maxProgress": 2,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "dias-ativos-3",
        "title": "Rota de Retorno",
        "description": "Acesse o projeto em 3 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 3 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "common",
        "image": "assets/achievements/dias-ativos-3.svg",
        "maxProgress": 3,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "dias-ativos-5",
        "title": "Sinal Reencontrado",
        "description": "Acesse o projeto em 5 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 5 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "uncommon",
        "image": "assets/achievements/dias-ativos-5.svg",
        "maxProgress": 5,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "dias-ativos-7",
        "title": "Explorador Frequente",
        "description": "Acesse o projeto em 7 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 7 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "uncommon",
        "image": "assets/achievements/dias-ativos-7.svg",
        "maxProgress": 7,
        "pointsReward": 20,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "dias-ativos-10",
        "title": "Diário de Bordo",
        "description": "Acesse o projeto em 10 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 10 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "rare",
        "image": "assets/achievements/dias-ativos-10.svg",
        "maxProgress": 10,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "dias-ativos-15",
        "title": "Tripulante Oficial",
        "description": "Acesse o projeto em 15 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 15 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "rare",
        "image": "assets/achievements/dias-ativos-15.svg",
        "maxProgress": 15,
        "pointsReward": 30,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "dias-ativos-20",
        "title": "Constância Estelar",
        "description": "Acesse o projeto em 20 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 20 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "epic",
        "image": "assets/achievements/dias-ativos-20.svg",
        "maxProgress": 20,
        "pointsReward": 40,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "dias-ativos-30",
        "title": "Guardião da T.A.R.D.I.S.",
        "description": "Acesse o projeto em 30 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 30 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "legendary",
        "image": "assets/achievements/dias-ativos-30.svg",
        "maxProgress": 30,
        "pointsReward": 60,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "dias-ativos-45",
        "title": "Veterano do Vórtice",
        "description": "Acesse o projeto em 45 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 45 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "legendary",
        "image": "assets/achievements/dias-ativos-45.svg",
        "maxProgress": 45,
        "pointsReward": 75,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "dias-ativos-60",
        "title": "Lenda da Rotina Cósmica",
        "description": "Acesse o projeto em 60 dias diferentes.",
        "detail": "Você manteve sua exploração viva por 60 dias diferentes. O universo recompensa a curiosidade constante.",
        "category": "Frequência",
        "rarity": "legendary",
        "image": "assets/achievements/dias-ativos-60.svg",
        "maxProgress": 60,
        "pointsReward": 100,
        "hidden": false,
        "progressLabel": "dias",
        "trigger": {
            "type": "active_day"
        }
    },
    {
        "id": "chamado-da-galaxia",
        "title": "Chamado da Galáxia",
        "description": "Abra o Modo Aventura pela primeira vez.",
        "detail": "O Doctor chamou, e você aceitou embarcar numa missão pelo Sistema Solar.",
        "category": "Modo Aventura",
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
        "id": "aventuras-iniciadas-3",
        "title": "Chamado Aceito 3x",
        "description": "Inicie o Modo Aventura 3 vezes.",
        "detail": "Você aceitou 3 chamados da galáxia. Cada início é uma nova chance de aprender.",
        "category": "Modo Aventura",
        "rarity": "common",
        "image": "assets/achievements/aventuras-iniciadas-3.svg",
        "maxProgress": 3,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "inícios",
        "trigger": {
            "type": "adventure_started_count"
        }
    },
    {
        "id": "aventuras-iniciadas-5",
        "title": "Chamado Aceito 5x",
        "description": "Inicie o Modo Aventura 5 vezes.",
        "detail": "Você aceitou 5 chamados da galáxia. Cada início é uma nova chance de aprender.",
        "category": "Modo Aventura",
        "rarity": "uncommon",
        "image": "assets/achievements/aventuras-iniciadas-5.svg",
        "maxProgress": 5,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "inícios",
        "trigger": {
            "type": "adventure_started_count"
        }
    },
    {
        "id": "aventuras-iniciadas-10",
        "title": "Chamado Aceito 10x",
        "description": "Inicie o Modo Aventura 10 vezes.",
        "detail": "Você aceitou 10 chamados da galáxia. Cada início é uma nova chance de aprender.",
        "category": "Modo Aventura",
        "rarity": "rare",
        "image": "assets/achievements/aventuras-iniciadas-10.svg",
        "maxProgress": 10,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "inícios",
        "trigger": {
            "type": "adventure_started_count"
        }
    },
    {
        "id": "aventuras-iniciadas-25",
        "title": "Chamado Aceito 25x",
        "description": "Inicie o Modo Aventura 25 vezes.",
        "detail": "Você aceitou 25 chamados da galáxia. Cada início é uma nova chance de aprender.",
        "category": "Modo Aventura",
        "rarity": "epic",
        "image": "assets/achievements/aventuras-iniciadas-25.svg",
        "maxProgress": 25,
        "pointsReward": 45,
        "hidden": false,
        "progressLabel": "inícios",
        "trigger": {
            "type": "adventure_started_count"
        }
    },
    {
        "id": "aventuras-iniciadas-50",
        "title": "Chamado Aceito 50x",
        "description": "Inicie o Modo Aventura 50 vezes.",
        "detail": "Você aceitou 50 chamados da galáxia. Cada início é uma nova chance de aprender.",
        "category": "Modo Aventura",
        "rarity": "legendary",
        "image": "assets/achievements/aventuras-iniciadas-50.svg",
        "maxProgress": 50,
        "pointsReward": 75,
        "hidden": false,
        "progressLabel": "inícios",
        "trigger": {
            "type": "adventure_started_count"
        }
    },
    {
        "id": "primeira-missao",
        "title": "Primeira Missão",
        "description": "Responda sua primeira pergunta no Modo Aventura.",
        "detail": "Responder uma pergunta já é começar a treinar sua mente de explorador.",
        "category": "Modo Aventura",
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
        "id": "perguntas-respondidas-5",
        "title": "Banco de Respostas 5",
        "description": "Responda 5 perguntas no total.",
        "detail": "Você já enfrentou 5 perguntas. Cada resposta ajuda a construir seu mapa mental do espaço.",
        "category": "Modo Aventura",
        "rarity": "common",
        "image": "assets/achievements/perguntas-respondidas-5.svg",
        "maxProgress": 5,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "perguntas",
        "trigger": {
            "type": "question_answered_count"
        }
    },
    {
        "id": "perguntas-respondidas-10",
        "title": "Banco de Respostas 10",
        "description": "Responda 10 perguntas no total.",
        "detail": "Você já enfrentou 10 perguntas. Cada resposta ajuda a construir seu mapa mental do espaço.",
        "category": "Modo Aventura",
        "rarity": "uncommon",
        "image": "assets/achievements/perguntas-respondidas-10.svg",
        "maxProgress": 10,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "perguntas",
        "trigger": {
            "type": "question_answered_count"
        }
    },
    {
        "id": "perguntas-respondidas-25",
        "title": "Banco de Respostas 25",
        "description": "Responda 25 perguntas no total.",
        "detail": "Você já enfrentou 25 perguntas. Cada resposta ajuda a construir seu mapa mental do espaço.",
        "category": "Modo Aventura",
        "rarity": "uncommon",
        "image": "assets/achievements/perguntas-respondidas-25.svg",
        "maxProgress": 25,
        "pointsReward": 20,
        "hidden": false,
        "progressLabel": "perguntas",
        "trigger": {
            "type": "question_answered_count"
        }
    },
    {
        "id": "perguntas-respondidas-50",
        "title": "Banco de Respostas 50",
        "description": "Responda 50 perguntas no total.",
        "detail": "Você já enfrentou 50 perguntas. Cada resposta ajuda a construir seu mapa mental do espaço.",
        "category": "Modo Aventura",
        "rarity": "rare",
        "image": "assets/achievements/perguntas-respondidas-50.svg",
        "maxProgress": 50,
        "pointsReward": 30,
        "hidden": false,
        "progressLabel": "perguntas",
        "trigger": {
            "type": "question_answered_count"
        }
    },
    {
        "id": "perguntas-respondidas-100",
        "title": "Banco de Respostas 100",
        "description": "Responda 100 perguntas no total.",
        "detail": "Você já enfrentou 100 perguntas. Cada resposta ajuda a construir seu mapa mental do espaço.",
        "category": "Modo Aventura",
        "rarity": "rare",
        "image": "assets/achievements/perguntas-respondidas-100.svg",
        "maxProgress": 100,
        "pointsReward": 40,
        "hidden": false,
        "progressLabel": "perguntas",
        "trigger": {
            "type": "question_answered_count"
        }
    },
    {
        "id": "perguntas-respondidas-200",
        "title": "Banco de Respostas 200",
        "description": "Responda 200 perguntas no total.",
        "detail": "Você já enfrentou 200 perguntas. Cada resposta ajuda a construir seu mapa mental do espaço.",
        "category": "Modo Aventura",
        "rarity": "epic",
        "image": "assets/achievements/perguntas-respondidas-200.svg",
        "maxProgress": 200,
        "pointsReward": 60,
        "hidden": false,
        "progressLabel": "perguntas",
        "trigger": {
            "type": "question_answered_count"
        }
    },
    {
        "id": "perguntas-respondidas-300",
        "title": "Banco de Respostas 300",
        "description": "Responda 300 perguntas no total.",
        "detail": "Você já enfrentou 300 perguntas. Cada resposta ajuda a construir seu mapa mental do espaço.",
        "category": "Modo Aventura",
        "rarity": "epic",
        "image": "assets/achievements/perguntas-respondidas-300.svg",
        "maxProgress": 300,
        "pointsReward": 75,
        "hidden": false,
        "progressLabel": "perguntas",
        "trigger": {
            "type": "question_answered_count"
        }
    },
    {
        "id": "perguntas-respondidas-500",
        "title": "Banco de Respostas 500",
        "description": "Responda 500 perguntas no total.",
        "detail": "Você já enfrentou 500 perguntas. Cada resposta ajuda a construir seu mapa mental do espaço.",
        "category": "Modo Aventura",
        "rarity": "legendary",
        "image": "assets/achievements/perguntas-respondidas-500.svg",
        "maxProgress": 500,
        "pointsReward": 100,
        "hidden": false,
        "progressLabel": "perguntas",
        "trigger": {
            "type": "question_answered_count"
        }
    },
    {
        "id": "perguntas-respondidas-1000",
        "title": "Banco de Respostas 1000",
        "description": "Responda 1000 perguntas no total.",
        "detail": "Você já enfrentou 1000 perguntas. Cada resposta ajuda a construir seu mapa mental do espaço.",
        "category": "Modo Aventura",
        "rarity": "legendary",
        "image": "assets/achievements/perguntas-respondidas-1000.svg",
        "maxProgress": 1000,
        "pointsReward": 150,
        "hidden": false,
        "progressLabel": "perguntas",
        "trigger": {
            "type": "question_answered_count"
        }
    },
    {
        "id": "resposta-certeira",
        "title": "Resposta Certeira",
        "description": "Acerte sua primeira pergunta.",
        "detail": "Precisão científica! Você acertou uma pergunta da aventura.",
        "category": "Modo Aventura",
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
        "title": "Mente Cósmica 5",
        "description": "Acerte 5 perguntas no total.",
        "detail": "Seu raciocínio espacial chegou a 5 acertos acumulados.",
        "category": "Modo Aventura",
        "rarity": "common",
        "image": "assets/achievements/acertos-5.svg",
        "maxProgress": 5,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "acertos",
        "trigger": {
            "type": "correct_answer_count"
        }
    },
    {
        "id": "acertos-10",
        "title": "Mente Cósmica 10",
        "description": "Acerte 10 perguntas no total.",
        "detail": "Seu raciocínio espacial chegou a 10 acertos acumulados.",
        "category": "Modo Aventura",
        "rarity": "uncommon",
        "image": "assets/achievements/acertos-10.svg",
        "maxProgress": 10,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "acertos",
        "trigger": {
            "type": "correct_answer_count"
        }
    },
    {
        "id": "acertos-25",
        "title": "Mente Cósmica 25",
        "description": "Acerte 25 perguntas no total.",
        "detail": "Seu raciocínio espacial chegou a 25 acertos acumulados.",
        "category": "Modo Aventura",
        "rarity": "uncommon",
        "image": "assets/achievements/acertos-25.svg",
        "maxProgress": 25,
        "pointsReward": 20,
        "hidden": false,
        "progressLabel": "acertos",
        "trigger": {
            "type": "correct_answer_count"
        }
    },
    {
        "id": "acertos-50",
        "title": "Mente Cósmica 50",
        "description": "Acerte 50 perguntas no total.",
        "detail": "Seu raciocínio espacial chegou a 50 acertos acumulados.",
        "category": "Modo Aventura",
        "rarity": "rare",
        "image": "assets/achievements/acertos-50.svg",
        "maxProgress": 50,
        "pointsReward": 35,
        "hidden": false,
        "progressLabel": "acertos",
        "trigger": {
            "type": "correct_answer_count"
        }
    },
    {
        "id": "acertos-100",
        "title": "Mente Cósmica 100",
        "description": "Acerte 100 perguntas no total.",
        "detail": "Seu raciocínio espacial chegou a 100 acertos acumulados.",
        "category": "Modo Aventura",
        "rarity": "rare",
        "image": "assets/achievements/acertos-100.svg",
        "maxProgress": 100,
        "pointsReward": 50,
        "hidden": false,
        "progressLabel": "acertos",
        "trigger": {
            "type": "correct_answer_count"
        }
    },
    {
        "id": "acertos-200",
        "title": "Mente Cósmica 200",
        "description": "Acerte 200 perguntas no total.",
        "detail": "Seu raciocínio espacial chegou a 200 acertos acumulados.",
        "category": "Modo Aventura",
        "rarity": "epic",
        "image": "assets/achievements/acertos-200.svg",
        "maxProgress": 200,
        "pointsReward": 75,
        "hidden": false,
        "progressLabel": "acertos",
        "trigger": {
            "type": "correct_answer_count"
        }
    },
    {
        "id": "acertos-300",
        "title": "Mente Cósmica 300",
        "description": "Acerte 300 perguntas no total.",
        "detail": "Seu raciocínio espacial chegou a 300 acertos acumulados.",
        "category": "Modo Aventura",
        "rarity": "epic",
        "image": "assets/achievements/acertos-300.svg",
        "maxProgress": 300,
        "pointsReward": 90,
        "hidden": false,
        "progressLabel": "acertos",
        "trigger": {
            "type": "correct_answer_count"
        }
    },
    {
        "id": "acertos-500",
        "title": "Mente Cósmica 500",
        "description": "Acerte 500 perguntas no total.",
        "detail": "Seu raciocínio espacial chegou a 500 acertos acumulados.",
        "category": "Modo Aventura",
        "rarity": "legendary",
        "image": "assets/achievements/acertos-500.svg",
        "maxProgress": 500,
        "pointsReward": 125,
        "hidden": false,
        "progressLabel": "acertos",
        "trigger": {
            "type": "correct_answer_count"
        }
    },
    {
        "id": "acertos-1000",
        "title": "Mente Cósmica 1000",
        "description": "Acerte 1000 perguntas no total.",
        "detail": "Seu raciocínio espacial chegou a 1000 acertos acumulados.",
        "category": "Modo Aventura",
        "rarity": "legendary",
        "image": "assets/achievements/acertos-1000.svg",
        "maxProgress": 1000,
        "pointsReward": 180,
        "hidden": false,
        "progressLabel": "acertos",
        "trigger": {
            "type": "correct_answer_count"
        }
    },
    {
        "id": "erros-1",
        "title": "Erro Também Ensina",
        "description": "Erre 1 respostas e continue tentando.",
        "detail": "Errar faz parte da ciência. Você transformou 1 erros em novas pistas para aprender.",
        "category": "Modo Aventura",
        "rarity": "common",
        "image": "assets/achievements/erros-1.svg",
        "maxProgress": 1,
        "pointsReward": 5,
        "hidden": false,
        "progressLabel": "erros",
        "trigger": {
            "type": "wrong_answer_count"
        }
    },
    {
        "id": "erros-5",
        "title": "Persistência Orbital",
        "description": "Erre 5 respostas e continue tentando.",
        "detail": "Errar faz parte da ciência. Você transformou 5 erros em novas pistas para aprender.",
        "category": "Modo Aventura",
        "rarity": "common",
        "image": "assets/achievements/erros-5.svg",
        "maxProgress": 5,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "erros",
        "trigger": {
            "type": "wrong_answer_count"
        }
    },
    {
        "id": "erros-10",
        "title": "Não Desistiu",
        "description": "Erre 10 respostas e continue tentando.",
        "detail": "Errar faz parte da ciência. Você transformou 10 erros em novas pistas para aprender.",
        "category": "Modo Aventura",
        "rarity": "uncommon",
        "image": "assets/achievements/erros-10.svg",
        "maxProgress": 10,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "erros",
        "trigger": {
            "type": "wrong_answer_count"
        }
    },
    {
        "id": "erros-25",
        "title": "Aprendizagem em Rota",
        "description": "Erre 25 respostas e continue tentando.",
        "detail": "Errar faz parte da ciência. Você transformou 25 erros em novas pistas para aprender.",
        "category": "Modo Aventura",
        "rarity": "rare",
        "image": "assets/achievements/erros-25.svg",
        "maxProgress": 25,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "erros",
        "trigger": {
            "type": "wrong_answer_count"
        }
    },
    {
        "id": "erros-50",
        "title": "Resiliência Cósmica",
        "description": "Erre 50 respostas e continue tentando.",
        "detail": "Errar faz parte da ciência. Você transformou 50 erros em novas pistas para aprender.",
        "category": "Modo Aventura",
        "rarity": "epic",
        "image": "assets/achievements/erros-50.svg",
        "maxProgress": 50,
        "pointsReward": 40,
        "hidden": false,
        "progressLabel": "erros",
        "trigger": {
            "type": "wrong_answer_count"
        }
    },
    {
        "id": "aprendiz-do-doutor",
        "title": "Aprendiz do Doutor",
        "description": "Complete uma rodada do Modo Aventura.",
        "detail": "Você foi até o fim de uma missão com o Doctor. Isso merece registro no painel.",
        "category": "Modo Aventura",
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
        "id": "aventuras-completas-3",
        "title": "Viagens Completas 3",
        "description": "Complete 3 rodadas do Modo Aventura.",
        "detail": "Você completou 3 viagens educativas com a T.A.R.D.I.S.",
        "category": "Modo Aventura",
        "rarity": "uncommon",
        "image": "assets/achievements/aventuras-completas-3.svg",
        "maxProgress": 3,
        "pointsReward": 20,
        "hidden": false,
        "progressLabel": "rodadas",
        "trigger": {
            "type": "adventure_completed_count"
        }
    },
    {
        "id": "aventuras-completas-5",
        "title": "Viagens Completas 5",
        "description": "Complete 5 rodadas do Modo Aventura.",
        "detail": "Você completou 5 viagens educativas com a T.A.R.D.I.S.",
        "category": "Modo Aventura",
        "rarity": "rare",
        "image": "assets/achievements/aventuras-completas-5.svg",
        "maxProgress": 5,
        "pointsReward": 30,
        "hidden": false,
        "progressLabel": "rodadas",
        "trigger": {
            "type": "adventure_completed_count"
        }
    },
    {
        "id": "aventuras-completas-10",
        "title": "Viagens Completas 10",
        "description": "Complete 10 rodadas do Modo Aventura.",
        "detail": "Você completou 10 viagens educativas com a T.A.R.D.I.S.",
        "category": "Modo Aventura",
        "rarity": "rare",
        "image": "assets/achievements/aventuras-completas-10.svg",
        "maxProgress": 10,
        "pointsReward": 45,
        "hidden": false,
        "progressLabel": "rodadas",
        "trigger": {
            "type": "adventure_completed_count"
        }
    },
    {
        "id": "aventuras-completas-25",
        "title": "Viagens Completas 25",
        "description": "Complete 25 rodadas do Modo Aventura.",
        "detail": "Você completou 25 viagens educativas com a T.A.R.D.I.S.",
        "category": "Modo Aventura",
        "rarity": "epic",
        "image": "assets/achievements/aventuras-completas-25.svg",
        "maxProgress": 25,
        "pointsReward": 70,
        "hidden": false,
        "progressLabel": "rodadas",
        "trigger": {
            "type": "adventure_completed_count"
        }
    },
    {
        "id": "aventuras-completas-50",
        "title": "Viagens Completas 50",
        "description": "Complete 50 rodadas do Modo Aventura.",
        "detail": "Você completou 50 viagens educativas com a T.A.R.D.I.S.",
        "category": "Modo Aventura",
        "rarity": "legendary",
        "image": "assets/achievements/aventuras-completas-50.svg",
        "maxProgress": 50,
        "pointsReward": 110,
        "hidden": false,
        "progressLabel": "rodadas",
        "trigger": {
            "type": "adventure_completed_count"
        }
    },
    {
        "id": "aventuras-completas-100",
        "title": "Viagens Completas 100",
        "description": "Complete 100 rodadas do Modo Aventura.",
        "detail": "Você completou 100 viagens educativas com a T.A.R.D.I.S.",
        "category": "Modo Aventura",
        "rarity": "legendary",
        "image": "assets/achievements/aventuras-completas-100.svg",
        "maxProgress": 100,
        "pointsReward": 160,
        "hidden": false,
        "progressLabel": "rodadas",
        "trigger": {
            "type": "adventure_completed_count"
        }
    },
    {
        "id": "rodadas-perfeitas-1",
        "title": "Rota Impecável 1",
        "description": "Termine 1 rodadas sem errar nenhuma pergunta.",
        "detail": "Uma rodada perfeita já é difícil; 1 é coisa de explorador lendário.",
        "category": "Desafios Especiais",
        "rarity": "rare",
        "image": "assets/achievements/rodadas-perfeitas-1.svg",
        "maxProgress": 1,
        "pointsReward": 35,
        "hidden": false,
        "progressLabel": "rodadas perfeitas",
        "trigger": {
            "type": "perfect_adventure_count"
        }
    },
    {
        "id": "rodadas-perfeitas-3",
        "title": "Rota Impecável 3",
        "description": "Termine 3 rodadas sem errar nenhuma pergunta.",
        "detail": "Uma rodada perfeita já é difícil; 3 é coisa de explorador lendário.",
        "category": "Desafios Especiais",
        "rarity": "epic",
        "image": "assets/achievements/rodadas-perfeitas-3.svg",
        "maxProgress": 3,
        "pointsReward": 60,
        "hidden": false,
        "progressLabel": "rodadas perfeitas",
        "trigger": {
            "type": "perfect_adventure_count"
        }
    },
    {
        "id": "rodadas-perfeitas-5",
        "title": "Rota Impecável 5",
        "description": "Termine 5 rodadas sem errar nenhuma pergunta.",
        "detail": "Uma rodada perfeita já é difícil; 5 é coisa de explorador lendário.",
        "category": "Desafios Especiais",
        "rarity": "epic",
        "image": "assets/achievements/rodadas-perfeitas-5.svg",
        "maxProgress": 5,
        "pointsReward": 80,
        "hidden": false,
        "progressLabel": "rodadas perfeitas",
        "trigger": {
            "type": "perfect_adventure_count"
        }
    },
    {
        "id": "rodadas-perfeitas-10",
        "title": "Rota Impecável 10",
        "description": "Termine 10 rodadas sem errar nenhuma pergunta.",
        "detail": "Uma rodada perfeita já é difícil; 10 é coisa de explorador lendário.",
        "category": "Desafios Especiais",
        "rarity": "legendary",
        "image": "assets/achievements/rodadas-perfeitas-10.svg",
        "maxProgress": 10,
        "pointsReward": 130,
        "hidden": false,
        "progressLabel": "rodadas perfeitas",
        "trigger": {
            "type": "perfect_adventure_count"
        }
    },
    {
        "id": "desempenho-50",
        "title": "Desempenho 50%",
        "description": "Termine uma aventura com pelo menos 50% de desempenho.",
        "detail": "Você alcançou pelo menos 50% de desempenho em uma aventura. A T.A.R.D.I.S. registrou seu avanço.",
        "category": "Desafios Especiais",
        "rarity": "common",
        "image": "assets/achievements/desempenho-50.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "adventure_percent",
            "percent": 50
        }
    },
    {
        "id": "desempenho-70",
        "title": "Desempenho 70%",
        "description": "Termine uma aventura com pelo menos 70% de desempenho.",
        "detail": "Você alcançou pelo menos 70% de desempenho em uma aventura. A T.A.R.D.I.S. registrou seu avanço.",
        "category": "Desafios Especiais",
        "rarity": "uncommon",
        "image": "assets/achievements/desempenho-70.svg",
        "maxProgress": 1,
        "pointsReward": 20,
        "hidden": false,
        "trigger": {
            "type": "adventure_percent",
            "percent": 70
        }
    },
    {
        "id": "desempenho-80",
        "title": "Desempenho 80%",
        "description": "Termine uma aventura com pelo menos 80% de desempenho.",
        "detail": "Você alcançou pelo menos 80% de desempenho em uma aventura. A T.A.R.D.I.S. registrou seu avanço.",
        "category": "Desafios Especiais",
        "rarity": "rare",
        "image": "assets/achievements/desempenho-80.svg",
        "maxProgress": 1,
        "pointsReward": 30,
        "hidden": false,
        "trigger": {
            "type": "adventure_percent",
            "percent": 80
        }
    },
    {
        "id": "desempenho-90",
        "title": "Desempenho 90%",
        "description": "Termine uma aventura com pelo menos 90% de desempenho.",
        "detail": "Você alcançou pelo menos 90% de desempenho em uma aventura. A T.A.R.D.I.S. registrou seu avanço.",
        "category": "Desafios Especiais",
        "rarity": "epic",
        "image": "assets/achievements/desempenho-90.svg",
        "maxProgress": 1,
        "pointsReward": 50,
        "hidden": false,
        "trigger": {
            "type": "adventure_percent",
            "percent": 90
        }
    },
    {
        "id": "desempenho-100",
        "title": "Desempenho 100%",
        "description": "Termine uma aventura com pelo menos 100% de desempenho.",
        "detail": "Você alcançou pelo menos 100% de desempenho em uma aventura. A T.A.R.D.I.S. registrou seu avanço.",
        "category": "Desafios Especiais",
        "rarity": "legendary",
        "image": "assets/achievements/desempenho-100.svg",
        "maxProgress": 1,
        "pointsReward": 100,
        "hidden": false,
        "trigger": {
            "type": "adventure_percent",
            "percent": 100
        }
    },
    {
        "id": "primeiros-10-pontos",
        "title": "Primeiros 10 Pontos",
        "description": "Acumule 10 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 10. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "common",
        "image": "assets/achievements/primeiros-10-pontos.svg",
        "maxProgress": 10,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-25",
        "title": "25 Pontos no Radar",
        "description": "Acumule 25 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 25. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "common",
        "image": "assets/achievements/pontos-acumulados-25.svg",
        "maxProgress": 25,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-50",
        "title": "50 Pontos no Radar",
        "description": "Acumule 50 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 50. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "uncommon",
        "image": "assets/achievements/pontos-acumulados-50.svg",
        "maxProgress": 50,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-100",
        "title": "100 Pontos no Radar",
        "description": "Acumule 100 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 100. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "uncommon",
        "image": "assets/achievements/pontos-acumulados-100.svg",
        "maxProgress": 100,
        "pointsReward": 20,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-250",
        "title": "250 Pontos no Radar",
        "description": "Acumule 250 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 250. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "rare",
        "image": "assets/achievements/pontos-acumulados-250.svg",
        "maxProgress": 250,
        "pointsReward": 30,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-500",
        "title": "500 Pontos no Radar",
        "description": "Acumule 500 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 500. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "rare",
        "image": "assets/achievements/pontos-acumulados-500.svg",
        "maxProgress": 500,
        "pointsReward": 40,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-750",
        "title": "750 Pontos no Radar",
        "description": "Acumule 750 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 750. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "rare",
        "image": "assets/achievements/pontos-acumulados-750.svg",
        "maxProgress": 750,
        "pointsReward": 45,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-1000",
        "title": "1000 Pontos no Radar",
        "description": "Acumule 1000 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 1000. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "epic",
        "image": "assets/achievements/pontos-acumulados-1000.svg",
        "maxProgress": 1000,
        "pointsReward": 60,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-1500",
        "title": "1500 Pontos no Radar",
        "description": "Acumule 1500 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 1500. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "epic",
        "image": "assets/achievements/pontos-acumulados-1500.svg",
        "maxProgress": 1500,
        "pointsReward": 70,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-2000",
        "title": "2000 Pontos no Radar",
        "description": "Acumule 2000 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 2000. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "epic",
        "image": "assets/achievements/pontos-acumulados-2000.svg",
        "maxProgress": 2000,
        "pointsReward": 80,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-3000",
        "title": "3000 Pontos no Radar",
        "description": "Acumule 3000 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 3000. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "legendary",
        "image": "assets/achievements/pontos-acumulados-3000.svg",
        "maxProgress": 3000,
        "pointsReward": 100,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-5000",
        "title": "5000 Pontos no Radar",
        "description": "Acumule 5000 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 5000. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "legendary",
        "image": "assets/achievements/pontos-acumulados-5000.svg",
        "maxProgress": 5000,
        "pointsReward": 130,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-7500",
        "title": "7500 Pontos no Radar",
        "description": "Acumule 7500 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 7500. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "legendary",
        "image": "assets/achievements/pontos-acumulados-7500.svg",
        "maxProgress": 7500,
        "pointsReward": 160,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-10000",
        "title": "10000 Pontos no Radar",
        "description": "Acumule 10000 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 10000. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "legendary",
        "image": "assets/achievements/pontos-acumulados-10000.svg",
        "maxProgress": 10000,
        "pointsReward": 200,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "pontos-acumulados-20000",
        "title": "20000 Pontos no Radar",
        "description": "Acumule 20000 pontos no Modo Aventura.",
        "detail": "Sua pontuação acumulada chegou a 20000. Continue respondendo para subir no ranking de exploradores.",
        "category": "Pontuação",
        "rarity": "legendary",
        "image": "assets/achievements/pontos-acumulados-20000.svg",
        "maxProgress": 20000,
        "pointsReward": 300,
        "hidden": false,
        "progressLabel": "pontos",
        "trigger": {
            "type": "score_total"
        }
    },
    {
        "id": "primeira-aterrissagem",
        "title": "Primeira Aterrissagem",
        "description": "Visite a superfície de um planeta ou estrela.",
        "detail": "Você saiu da visão geral e pousou em um corpo celeste para observar de perto.",
        "category": "Exploração Planetária",
        "rarity": "common",
        "image": "assets/achievements/primeira-aterrissagem.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_entered"
        }
    },
    {
        "id": "corpos-visitados-2",
        "title": "Roteiro Celeste 2",
        "description": "Visite 2 corpos celestes diferentes.",
        "detail": "Você visitou 2 destinos diferentes do Sistema Solar. O mapa da T.A.R.D.I.S. está ficando completo.",
        "category": "Exploração Planetária",
        "rarity": "common",
        "image": "assets/achievements/corpos-visitados-2.svg",
        "maxProgress": 2,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "corpos visitados",
        "trigger": {
            "type": "unique_planet_visit"
        }
    },
    {
        "id": "turista-espacial",
        "title": "Turista Espacial",
        "description": "Visite 3 corpos celestes diferentes.",
        "detail": "Você visitou 3 destinos diferentes do Sistema Solar. O mapa da T.A.R.D.I.S. está ficando completo.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/turista-espacial.svg",
        "maxProgress": 3,
        "pointsReward": 20,
        "hidden": false,
        "progressLabel": "corpos visitados",
        "trigger": {
            "type": "unique_planet_visit"
        }
    },
    {
        "id": "corpos-visitados-5",
        "title": "Roteiro Celeste 5",
        "description": "Visite 5 corpos celestes diferentes.",
        "detail": "Você visitou 5 destinos diferentes do Sistema Solar. O mapa da T.A.R.D.I.S. está ficando completo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/corpos-visitados-5.svg",
        "maxProgress": 5,
        "pointsReward": 35,
        "hidden": false,
        "progressLabel": "corpos visitados",
        "trigger": {
            "type": "unique_planet_visit"
        }
    },
    {
        "id": "corpos-visitados-7",
        "title": "Roteiro Celeste 7",
        "description": "Visite 7 corpos celestes diferentes.",
        "detail": "Você visitou 7 destinos diferentes do Sistema Solar. O mapa da T.A.R.D.I.S. está ficando completo.",
        "category": "Exploração Planetária",
        "rarity": "epic",
        "image": "assets/achievements/corpos-visitados-7.svg",
        "maxProgress": 7,
        "pointsReward": 55,
        "hidden": false,
        "progressLabel": "corpos visitados",
        "trigger": {
            "type": "unique_planet_visit"
        }
    },
    {
        "id": "corpos-visitados-9",
        "title": "Roteiro Celeste 9",
        "description": "Visite 9 corpos celestes diferentes.",
        "detail": "Você visitou 9 destinos diferentes do Sistema Solar. O mapa da T.A.R.D.I.S. está ficando completo.",
        "category": "Exploração Planetária",
        "rarity": "legendary",
        "image": "assets/achievements/corpos-visitados-9.svg",
        "maxProgress": 9,
        "pointsReward": 90,
        "hidden": false,
        "progressLabel": "corpos visitados",
        "trigger": {
            "type": "unique_planet_visit"
        }
    },
    {
        "id": "mapa-celeste-completo",
        "title": "Mapa Celeste Completo",
        "description": "Visite todos os corpos principais do projeto.",
        "detail": "Sol, planetas rochosos, gigantes e mundos gelados: você completou o grande roteiro inicial do Sistema Solar.",
        "category": "Exploração Planetária",
        "rarity": "legendary",
        "image": "assets/achievements/mapa-celeste-completo.svg",
        "maxProgress": 9,
        "pointsReward": 100,
        "hidden": false,
        "progressLabel": "corpos visitados",
        "trigger": {
            "type": "unique_planet_visit"
        }
    },
    {
        "id": "visitar-sol",
        "title": "Perto do Sol",
        "description": "Visite Sol pela primeira vez.",
        "detail": "Você entrou na superfície/visualização de Sol e registrou esse destino no diário de bordo.",
        "category": "Exploração Planetária",
        "rarity": "common",
        "image": "assets/achievements/visitar-sol.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Sun"
        }
    },
    {
        "id": "sol-visitante-3",
        "title": "Sol: Visitante 3x",
        "description": "Visite Sol 3 vezes.",
        "detail": "Retornar a Sol ajuda a observar detalhes que passaram despercebidos na primeira visita.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/sol-visitante-3.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Sun"
        }
    },
    {
        "id": "sol-especialista-5",
        "title": "Sol: Especialista 5x",
        "description": "Visite Sol 5 vezes.",
        "detail": "Você já conhece Sol como um verdadeiro especialista de bordo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/sol-especialista-5.svg",
        "maxProgress": 5,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Sun"
        }
    },
    {
        "id": "visitar-mercurio",
        "title": "Mensageiro Veloz",
        "description": "Visite Mercúrio pela primeira vez.",
        "detail": "Você entrou na superfície/visualização de Mercúrio e registrou esse destino no diário de bordo.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-mercurio.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Mercury"
        }
    },
    {
        "id": "mercurio-visitante-3",
        "title": "Mercúrio: Visitante 3x",
        "description": "Visite Mercúrio 3 vezes.",
        "detail": "Retornar a Mercúrio ajuda a observar detalhes que passaram despercebidos na primeira visita.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/mercurio-visitante-3.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Mercury"
        }
    },
    {
        "id": "mercurio-especialista-5",
        "title": "Mercúrio: Especialista 5x",
        "description": "Visite Mercúrio 5 vezes.",
        "detail": "Você já conhece Mercúrio como um verdadeiro especialista de bordo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/mercurio-especialista-5.svg",
        "maxProgress": 5,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Mercury"
        }
    },
    {
        "id": "visitar-venus",
        "title": "Nuvens de Vênus",
        "description": "Visite Vênus pela primeira vez.",
        "detail": "Você entrou na superfície/visualização de Vênus e registrou esse destino no diário de bordo.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-venus.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Venus"
        }
    },
    {
        "id": "venus-visitante-3",
        "title": "Vênus: Visitante 3x",
        "description": "Visite Vênus 3 vezes.",
        "detail": "Retornar a Vênus ajuda a observar detalhes que passaram despercebidos na primeira visita.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/venus-visitante-3.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Venus"
        }
    },
    {
        "id": "venus-especialista-5",
        "title": "Vênus: Especialista 5x",
        "description": "Visite Vênus 5 vezes.",
        "detail": "Você já conhece Vênus como um verdadeiro especialista de bordo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/venus-especialista-5.svg",
        "maxProgress": 5,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Venus"
        }
    },
    {
        "id": "visitar-terra",
        "title": "Planeta Azul",
        "description": "Visite Terra pela primeira vez.",
        "detail": "Você entrou na superfície/visualização de Terra e registrou esse destino no diário de bordo.",
        "category": "Exploração Planetária",
        "rarity": "common",
        "image": "assets/achievements/visitar-terra.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Earth"
        }
    },
    {
        "id": "terra-visitante-3",
        "title": "Terra: Visitante 3x",
        "description": "Visite Terra 3 vezes.",
        "detail": "Retornar a Terra ajuda a observar detalhes que passaram despercebidos na primeira visita.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/terra-visitante-3.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Earth"
        }
    },
    {
        "id": "terra-especialista-5",
        "title": "Terra: Especialista 5x",
        "description": "Visite Terra 5 vezes.",
        "detail": "Você já conhece Terra como um verdadeiro especialista de bordo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/terra-especialista-5.svg",
        "maxProgress": 5,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Earth"
        }
    },
    {
        "id": "visitar-marte",
        "title": "Solo Vermelho",
        "description": "Visite Marte pela primeira vez.",
        "detail": "Você entrou na superfície/visualização de Marte e registrou esse destino no diário de bordo.",
        "category": "Exploração Planetária",
        "rarity": "common",
        "image": "assets/achievements/visitar-marte.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Mars"
        }
    },
    {
        "id": "marte-visitante-3",
        "title": "Marte: Visitante 3x",
        "description": "Visite Marte 3 vezes.",
        "detail": "Retornar a Marte ajuda a observar detalhes que passaram despercebidos na primeira visita.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/marte-visitante-3.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Mars"
        }
    },
    {
        "id": "marte-especialista-5",
        "title": "Marte: Especialista 5x",
        "description": "Visite Marte 5 vezes.",
        "detail": "Você já conhece Marte como um verdadeiro especialista de bordo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/marte-especialista-5.svg",
        "maxProgress": 5,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Mars"
        }
    },
    {
        "id": "visitar-jupiter",
        "title": "Gigante no Horizonte",
        "description": "Visite Júpiter pela primeira vez.",
        "detail": "Você entrou na superfície/visualização de Júpiter e registrou esse destino no diário de bordo.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-jupiter.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Jupiter"
        }
    },
    {
        "id": "jupiter-visitante-3",
        "title": "Júpiter: Visitante 3x",
        "description": "Visite Júpiter 3 vezes.",
        "detail": "Retornar a Júpiter ajuda a observar detalhes que passaram despercebidos na primeira visita.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/jupiter-visitante-3.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Jupiter"
        }
    },
    {
        "id": "jupiter-especialista-5",
        "title": "Júpiter: Especialista 5x",
        "description": "Visite Júpiter 5 vezes.",
        "detail": "Você já conhece Júpiter como um verdadeiro especialista de bordo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/jupiter-especialista-5.svg",
        "maxProgress": 5,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Jupiter"
        }
    },
    {
        "id": "visitar-saturno",
        "title": "Anéis de Saturno",
        "description": "Visite Saturno pela primeira vez.",
        "detail": "Você entrou na superfície/visualização de Saturno e registrou esse destino no diário de bordo.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-saturno.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Saturn"
        }
    },
    {
        "id": "saturno-visitante-3",
        "title": "Saturno: Visitante 3x",
        "description": "Visite Saturno 3 vezes.",
        "detail": "Retornar a Saturno ajuda a observar detalhes que passaram despercebidos na primeira visita.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/saturno-visitante-3.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Saturn"
        }
    },
    {
        "id": "saturno-especialista-5",
        "title": "Saturno: Especialista 5x",
        "description": "Visite Saturno 5 vezes.",
        "detail": "Você já conhece Saturno como um verdadeiro especialista de bordo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/saturno-especialista-5.svg",
        "maxProgress": 5,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Saturn"
        }
    },
    {
        "id": "visitar-urano",
        "title": "Mundo Inclinado",
        "description": "Visite Urano pela primeira vez.",
        "detail": "Você entrou na superfície/visualização de Urano e registrou esse destino no diário de bordo.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-urano.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Uranus"
        }
    },
    {
        "id": "urano-visitante-3",
        "title": "Urano: Visitante 3x",
        "description": "Visite Urano 3 vezes.",
        "detail": "Retornar a Urano ajuda a observar detalhes que passaram despercebidos na primeira visita.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/urano-visitante-3.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Uranus"
        }
    },
    {
        "id": "urano-especialista-5",
        "title": "Urano: Especialista 5x",
        "description": "Visite Urano 5 vezes.",
        "detail": "Você já conhece Urano como um verdadeiro especialista de bordo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/urano-especialista-5.svg",
        "maxProgress": 5,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Uranus"
        }
    },
    {
        "id": "visitar-netuno",
        "title": "Ventos de Netuno",
        "description": "Visite Netuno pela primeira vez.",
        "detail": "Você entrou na superfície/visualização de Netuno e registrou esse destino no diário de bordo.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/visitar-netuno.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_first_visit",
            "planet": "Neptune"
        }
    },
    {
        "id": "netuno-visitante-3",
        "title": "Netuno: Visitante 3x",
        "description": "Visite Netuno 3 vezes.",
        "detail": "Retornar a Netuno ajuda a observar detalhes que passaram despercebidos na primeira visita.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/netuno-visitante-3.svg",
        "maxProgress": 3,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Neptune"
        }
    },
    {
        "id": "netuno-especialista-5",
        "title": "Netuno: Especialista 5x",
        "description": "Visite Netuno 5 vezes.",
        "detail": "Você já conhece Netuno como um verdadeiro especialista de bordo.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/netuno-especialista-5.svg",
        "maxProgress": 5,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "visitas",
        "trigger": {
            "type": "planet_visit_count",
            "planet": "Neptune"
        }
    },
    {
        "id": "mundos-rochosos",
        "title": "Quarteto Rochoso",
        "description": "Visite Mercúrio, Vênus, Terra e Marte.",
        "detail": "Você completou a rota dos mundos rochosos, os planetas mais próximos do Sol.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/mundos-rochosos.svg",
        "maxProgress": 4,
        "pointsReward": 45,
        "hidden": false,
        "progressLabel": "destinos",
        "trigger": {
            "type": "planet_group",
            "planets": [
                "Mercury",
                "Venus",
                "Earth",
                "Mars"
            ]
        }
    },
    {
        "id": "gigantes-classicos",
        "title": "Gigantes do Sistema",
        "description": "Visite Júpiter e Saturno.",
        "detail": "Os dois maiores planetas do Sistema Solar entraram no seu roteiro.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/gigantes-classicos.svg",
        "maxProgress": 2,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "destinos",
        "trigger": {
            "type": "planet_group",
            "planets": [
                "Jupiter",
                "Saturn"
            ]
        }
    },
    {
        "id": "gigantes-gelados",
        "title": "Gigantes Gelados",
        "description": "Visite Urano e Netuno.",
        "detail": "Os mundos azulados e distantes também foram registrados.",
        "category": "Exploração Planetária",
        "rarity": "rare",
        "image": "assets/achievements/gigantes-gelados.svg",
        "maxProgress": 2,
        "pointsReward": 45,
        "hidden": false,
        "progressLabel": "destinos",
        "trigger": {
            "type": "planet_group",
            "planets": [
                "Uranus",
                "Neptune"
            ]
        }
    },
    {
        "id": "rota-extrema",
        "title": "Da Fornalha ao Gelo",
        "description": "Visite o Sol e Netuno.",
        "detail": "Você foi do calor extremo solar ao planeta mais distante do Sol.",
        "category": "Exploração Planetária",
        "rarity": "epic",
        "image": "assets/achievements/rota-extrema.svg",
        "maxProgress": 2,
        "pointsReward": 60,
        "hidden": false,
        "progressLabel": "destinos",
        "trigger": {
            "type": "planet_group",
            "planets": [
                "Sun",
                "Neptune"
            ]
        }
    },
    {
        "id": "terra-marte",
        "title": "Vizinhos da Vida",
        "description": "Visite Terra e Marte.",
        "detail": "Você explorou o mundo da vida conhecida e o planeta vermelho, principal alvo de busca por sinais antigos.",
        "category": "Exploração Planetária",
        "rarity": "uncommon",
        "image": "assets/achievements/terra-marte.svg",
        "maxProgress": 2,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "destinos",
        "trigger": {
            "type": "planet_group",
            "planets": [
                "Earth",
                "Mars"
            ]
        }
    },
    {
        "id": "curioso-do-cosmos",
        "title": "Curioso do Cosmos",
        "description": "Abra os detalhes de um planeta.",
        "detail": "Um bom explorador não só olha: ele investiga dados, curiosidades e missões.",
        "category": "Conhecimento Espacial",
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
        "id": "detalhes-abertos-3",
        "title": "Leitor das Estrelas 3",
        "description": "Abra detalhes de planetas 3 vezes.",
        "detail": "Você consultou o banco de dados planetário 3 vezes.",
        "category": "Conhecimento Espacial",
        "rarity": "common",
        "image": "assets/achievements/detalhes-abertos-3.svg",
        "maxProgress": 3,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "leituras",
        "trigger": {
            "type": "planet_detail_count"
        }
    },
    {
        "id": "detalhes-abertos-5",
        "title": "Leitor das Estrelas 5",
        "description": "Abra detalhes de planetas 5 vezes.",
        "detail": "Você consultou o banco de dados planetário 5 vezes.",
        "category": "Conhecimento Espacial",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-abertos-5.svg",
        "maxProgress": 5,
        "pointsReward": 20,
        "hidden": false,
        "progressLabel": "leituras",
        "trigger": {
            "type": "planet_detail_count"
        }
    },
    {
        "id": "detalhes-abertos-9",
        "title": "Leitor das Estrelas 9",
        "description": "Abra detalhes de planetas 9 vezes.",
        "detail": "Você consultou o banco de dados planetário 9 vezes.",
        "category": "Conhecimento Espacial",
        "rarity": "rare",
        "image": "assets/achievements/detalhes-abertos-9.svg",
        "maxProgress": 9,
        "pointsReward": 40,
        "hidden": false,
        "progressLabel": "leituras",
        "trigger": {
            "type": "planet_detail_count"
        }
    },
    {
        "id": "detalhes-abertos-15",
        "title": "Leitor das Estrelas 15",
        "description": "Abra detalhes de planetas 15 vezes.",
        "detail": "Você consultou o banco de dados planetário 15 vezes.",
        "category": "Conhecimento Espacial",
        "rarity": "epic",
        "image": "assets/achievements/detalhes-abertos-15.svg",
        "maxProgress": 15,
        "pointsReward": 60,
        "hidden": false,
        "progressLabel": "leituras",
        "trigger": {
            "type": "planet_detail_count"
        }
    },
    {
        "id": "detalhes-abertos-30",
        "title": "Leitor das Estrelas 30",
        "description": "Abra detalhes de planetas 30 vezes.",
        "detail": "Você consultou o banco de dados planetário 30 vezes.",
        "category": "Conhecimento Espacial",
        "rarity": "legendary",
        "image": "assets/achievements/detalhes-abertos-30.svg",
        "maxProgress": 30,
        "pointsReward": 90,
        "hidden": false,
        "progressLabel": "leituras",
        "trigger": {
            "type": "planet_detail_count"
        }
    },
    {
        "id": "detalhes-sol",
        "title": "Dossiê de Sol",
        "description": "Abra os detalhes de Sol.",
        "detail": "O dossiê de Sol foi consultado no painel de bordo.",
        "category": "Conhecimento Espacial",
        "rarity": "common",
        "image": "assets/achievements/detalhes-sol.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Sun"
        }
    },
    {
        "id": "detalhes-mercurio",
        "title": "Dossiê de Mercúrio",
        "description": "Abra os detalhes de Mercúrio.",
        "detail": "O dossiê de Mercúrio foi consultado no painel de bordo.",
        "category": "Conhecimento Espacial",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-mercurio.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Mercury"
        }
    },
    {
        "id": "detalhes-venus",
        "title": "Dossiê de Vênus",
        "description": "Abra os detalhes de Vênus.",
        "detail": "O dossiê de Vênus foi consultado no painel de bordo.",
        "category": "Conhecimento Espacial",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-venus.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Venus"
        }
    },
    {
        "id": "detalhes-terra",
        "title": "Dossiê de Terra",
        "description": "Abra os detalhes de Terra.",
        "detail": "O dossiê de Terra foi consultado no painel de bordo.",
        "category": "Conhecimento Espacial",
        "rarity": "common",
        "image": "assets/achievements/detalhes-terra.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Earth"
        }
    },
    {
        "id": "detalhes-marte",
        "title": "Dossiê de Marte",
        "description": "Abra os detalhes de Marte.",
        "detail": "O dossiê de Marte foi consultado no painel de bordo.",
        "category": "Conhecimento Espacial",
        "rarity": "common",
        "image": "assets/achievements/detalhes-marte.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Mars"
        }
    },
    {
        "id": "detalhes-jupiter",
        "title": "Dossiê de Júpiter",
        "description": "Abra os detalhes de Júpiter.",
        "detail": "O dossiê de Júpiter foi consultado no painel de bordo.",
        "category": "Conhecimento Espacial",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-jupiter.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Jupiter"
        }
    },
    {
        "id": "detalhes-saturno",
        "title": "Dossiê de Saturno",
        "description": "Abra os detalhes de Saturno.",
        "detail": "O dossiê de Saturno foi consultado no painel de bordo.",
        "category": "Conhecimento Espacial",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-saturno.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Saturn"
        }
    },
    {
        "id": "detalhes-urano",
        "title": "Dossiê de Urano",
        "description": "Abra os detalhes de Urano.",
        "detail": "O dossiê de Urano foi consultado no painel de bordo.",
        "category": "Conhecimento Espacial",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-urano.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Uranus"
        }
    },
    {
        "id": "detalhes-netuno",
        "title": "Dossiê de Netuno",
        "description": "Abra os detalhes de Netuno.",
        "detail": "O dossiê de Netuno foi consultado no painel de bordo.",
        "category": "Conhecimento Espacial",
        "rarity": "uncommon",
        "image": "assets/achievements/detalhes-netuno.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "planet_detail_specific",
            "planet": "Neptune"
        }
    },
    {
        "id": "bibliotecario-espacial",
        "title": "Bibliotecário Espacial",
        "description": "Abra detalhes de todos os corpos principais.",
        "detail": "Você consultou todos os dossiês principais do Sistema Solar disponíveis na T.A.R.D.I.S.",
        "category": "Conhecimento Espacial",
        "rarity": "legendary",
        "image": "assets/achievements/bibliotecario-espacial.svg",
        "maxProgress": 9,
        "pointsReward": 100,
        "hidden": false,
        "progressLabel": "dossiês",
        "trigger": {
            "type": "unique_planet_detail"
        }
    },
    {
        "id": "imagem-do-dia",
        "title": "Imagem do Dia",
        "description": "Abra o painel da imagem astronômica da NASA.",
        "detail": "A NASA publica uma janela diária para o universo. Você abriu essa janela.",
        "category": "Conhecimento Espacial",
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
        "id": "apod-aberto-3",
        "title": "Janelas da NASA 3",
        "description": "Abra a imagem astronômica do dia 3 vezes.",
        "detail": "Você abriu o painel APOD 3 vezes, acompanhando diferentes janelas para o cosmos.",
        "category": "Conhecimento Espacial",
        "rarity": "common",
        "image": "assets/achievements/apod-aberto-3.svg",
        "maxProgress": 3,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "apod_opened_count"
        }
    },
    {
        "id": "apod-aberto-7",
        "title": "Janelas da NASA 7",
        "description": "Abra a imagem astronômica do dia 7 vezes.",
        "detail": "Você abriu o painel APOD 7 vezes, acompanhando diferentes janelas para o cosmos.",
        "category": "Conhecimento Espacial",
        "rarity": "uncommon",
        "image": "assets/achievements/apod-aberto-7.svg",
        "maxProgress": 7,
        "pointsReward": 20,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "apod_opened_count"
        }
    },
    {
        "id": "apod-aberto-15",
        "title": "Janelas da NASA 15",
        "description": "Abra a imagem astronômica do dia 15 vezes.",
        "detail": "Você abriu o painel APOD 15 vezes, acompanhando diferentes janelas para o cosmos.",
        "category": "Conhecimento Espacial",
        "rarity": "rare",
        "image": "assets/achievements/apod-aberto-15.svg",
        "maxProgress": 15,
        "pointsReward": 35,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "apod_opened_count"
        }
    },
    {
        "id": "apod-aberto-30",
        "title": "Janelas da NASA 30",
        "description": "Abra a imagem astronômica do dia 30 vezes.",
        "detail": "Você abriu o painel APOD 30 vezes, acompanhando diferentes janelas para o cosmos.",
        "category": "Conhecimento Espacial",
        "rarity": "epic",
        "image": "assets/achievements/apod-aberto-30.svg",
        "maxProgress": 30,
        "pointsReward": 60,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "apod_opened_count"
        }
    },
    {
        "id": "apod-aberto-60",
        "title": "Janelas da NASA 60",
        "description": "Abra a imagem astronômica do dia 60 vezes.",
        "detail": "Você abriu o painel APOD 60 vezes, acompanhando diferentes janelas para o cosmos.",
        "category": "Conhecimento Espacial",
        "rarity": "legendary",
        "image": "assets/achievements/apod-aberto-60.svg",
        "maxProgress": 60,
        "pointsReward": 100,
        "hidden": false,
        "progressLabel": "aberturas",
        "trigger": {
            "type": "apod_opened_count"
        }
    },
    {
        "id": "primeiro-dossie-de-missao",
        "title": "Primeiro Dossiê de Missão",
        "description": "Abra o primeiro dossiê detalhado de missão espacial.",
        "detail": "Você começou a investigar missões reais que ajudaram a humanidade a entender o Sistema Solar.",
        "category": "Dossiê de Missões",
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
        "id": "missoes-abertas-3",
        "title": "Arquivo de Missões 3",
        "description": "Abra 3 dossiês de missões.",
        "detail": "Você consultou 3 dossiês de missões espaciais. O arquivo histórico da T.A.R.D.I.S. está cheio de descobertas.",
        "category": "Dossiê de Missões",
        "rarity": "common",
        "image": "assets/achievements/missoes-abertas-3.svg",
        "maxProgress": 3,
        "pointsReward": 10,
        "hidden": false,
        "progressLabel": "dossiês",
        "trigger": {
            "type": "mission_viewed_count"
        }
    },
    {
        "id": "missoes-abertas-5",
        "title": "Arquivo de Missões 5",
        "description": "Abra 5 dossiês de missões.",
        "detail": "Você consultou 5 dossiês de missões espaciais. O arquivo histórico da T.A.R.D.I.S. está cheio de descobertas.",
        "category": "Dossiê de Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/missoes-abertas-5.svg",
        "maxProgress": 5,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "dossiês",
        "trigger": {
            "type": "mission_viewed_count"
        }
    },
    {
        "id": "missoes-abertas-10",
        "title": "Arquivo de Missões 10",
        "description": "Abra 10 dossiês de missões.",
        "detail": "Você consultou 10 dossiês de missões espaciais. O arquivo histórico da T.A.R.D.I.S. está cheio de descobertas.",
        "category": "Dossiê de Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/missoes-abertas-10.svg",
        "maxProgress": 10,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "dossiês",
        "trigger": {
            "type": "mission_viewed_count"
        }
    },
    {
        "id": "missoes-abertas-20",
        "title": "Arquivo de Missões 20",
        "description": "Abra 20 dossiês de missões.",
        "detail": "Você consultou 20 dossiês de missões espaciais. O arquivo histórico da T.A.R.D.I.S. está cheio de descobertas.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missoes-abertas-20.svg",
        "maxProgress": 20,
        "pointsReward": 40,
        "hidden": false,
        "progressLabel": "dossiês",
        "trigger": {
            "type": "mission_viewed_count"
        }
    },
    {
        "id": "missoes-abertas-30",
        "title": "Arquivo de Missões 30",
        "description": "Abra 30 dossiês de missões.",
        "detail": "Você consultou 30 dossiês de missões espaciais. O arquivo histórico da T.A.R.D.I.S. está cheio de descobertas.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missoes-abertas-30.svg",
        "maxProgress": 30,
        "pointsReward": 55,
        "hidden": false,
        "progressLabel": "dossiês",
        "trigger": {
            "type": "mission_viewed_count"
        }
    },
    {
        "id": "missoes-abertas-50",
        "title": "Arquivo de Missões 50",
        "description": "Abra 50 dossiês de missões.",
        "detail": "Você consultou 50 dossiês de missões espaciais. O arquivo histórico da T.A.R.D.I.S. está cheio de descobertas.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/missoes-abertas-50.svg",
        "maxProgress": 50,
        "pointsReward": 75,
        "hidden": false,
        "progressLabel": "dossiês",
        "trigger": {
            "type": "mission_viewed_count"
        }
    },
    {
        "id": "missoes-abertas-75",
        "title": "Arquivo de Missões 75",
        "description": "Abra 75 dossiês de missões.",
        "detail": "Você consultou 75 dossiês de missões espaciais. O arquivo histórico da T.A.R.D.I.S. está cheio de descobertas.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/missoes-abertas-75.svg",
        "maxProgress": 75,
        "pointsReward": 100,
        "hidden": false,
        "progressLabel": "dossiês",
        "trigger": {
            "type": "mission_viewed_count"
        }
    },
    {
        "id": "missoes-abertas-100",
        "title": "Arquivo de Missões 100",
        "description": "Abra 100 dossiês de missões.",
        "detail": "Você consultou 100 dossiês de missões espaciais. O arquivo histórico da T.A.R.D.I.S. está cheio de descobertas.",
        "category": "Dossiê de Missões",
        "rarity": "legendary",
        "image": "assets/achievements/missoes-abertas-100.svg",
        "maxProgress": 100,
        "pointsReward": 140,
        "hidden": false,
        "progressLabel": "dossiês",
        "trigger": {
            "type": "mission_viewed_count"
        }
    },
    {
        "id": "missoes-unicas-5",
        "title": "Colecionador de Missões 5",
        "description": "Abra 5 dossiês de missões diferentes.",
        "detail": "Você explorou 5 missões diferentes, sem ficar preso a um único planeta.",
        "category": "Dossiê de Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/missoes-unicas-5.svg",
        "maxProgress": 5,
        "pointsReward": 15,
        "hidden": false,
        "progressLabel": "missões únicas",
        "trigger": {
            "type": "unique_mission_view"
        }
    },
    {
        "id": "missoes-unicas-10",
        "title": "Colecionador de Missões 10",
        "description": "Abra 10 dossiês de missões diferentes.",
        "detail": "Você explorou 10 missões diferentes, sem ficar preso a um único planeta.",
        "category": "Dossiê de Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/missoes-unicas-10.svg",
        "maxProgress": 10,
        "pointsReward": 25,
        "hidden": false,
        "progressLabel": "missões únicas",
        "trigger": {
            "type": "unique_mission_view"
        }
    },
    {
        "id": "missoes-unicas-20",
        "title": "Colecionador de Missões 20",
        "description": "Abra 20 dossiês de missões diferentes.",
        "detail": "Você explorou 20 missões diferentes, sem ficar preso a um único planeta.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missoes-unicas-20.svg",
        "maxProgress": 20,
        "pointsReward": 45,
        "hidden": false,
        "progressLabel": "missões únicas",
        "trigger": {
            "type": "unique_mission_view"
        }
    },
    {
        "id": "missoes-unicas-30",
        "title": "Colecionador de Missões 30",
        "description": "Abra 30 dossiês de missões diferentes.",
        "detail": "Você explorou 30 missões diferentes, sem ficar preso a um único planeta.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/missoes-unicas-30.svg",
        "maxProgress": 30,
        "pointsReward": 70,
        "hidden": false,
        "progressLabel": "missões únicas",
        "trigger": {
            "type": "unique_mission_view"
        }
    },
    {
        "id": "missoes-unicas-38",
        "title": "Colecionador de Missões 38",
        "description": "Abra 38 dossiês de missões diferentes.",
        "detail": "Você explorou 38 missões diferentes, sem ficar preso a um único planeta.",
        "category": "Dossiê de Missões",
        "rarity": "legendary",
        "image": "assets/achievements/missoes-unicas-38.svg",
        "maxProgress": 38,
        "pointsReward": 120,
        "hidden": false,
        "progressLabel": "missões únicas",
        "trigger": {
            "type": "unique_mission_view"
        }
    },
    {
        "id": "primeira-missao-sol",
        "title": "Sol: Primeira Missão",
        "description": "Abra uma missão relacionada a Sol.",
        "detail": "Você começou a estudar o histórico de exploração de Sol.",
        "category": "Dossiê de Missões",
        "rarity": "common",
        "image": "assets/achievements/primeira-missao-sol.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Sun"
        }
    },
    {
        "id": "arquivo-sol-completo",
        "title": "Sol: Arquivo Completo",
        "description": "Abra todos os dossiês de missão de Sol.",
        "detail": "Todas as missões cadastradas para Sol foram consultadas.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/arquivo-sol-completo.svg",
        "maxProgress": 5,
        "pointsReward": 65,
        "hidden": false,
        "progressLabel": "missões",
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Sun"
        }
    },
    {
        "id": "primeira-missao-mercurio",
        "title": "Mercúrio: Primeira Missão",
        "description": "Abra uma missão relacionada a Mercúrio.",
        "detail": "Você começou a estudar o histórico de exploração de Mercúrio.",
        "category": "Dossiê de Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-mercurio.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Mercury"
        }
    },
    {
        "id": "arquivo-mercurio-completo",
        "title": "Mercúrio: Arquivo Completo",
        "description": "Abra todos os dossiês de missão de Mercúrio.",
        "detail": "Todas as missões cadastradas para Mercúrio foram consultadas.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/arquivo-mercurio-completo.svg",
        "maxProgress": 3,
        "pointsReward": 55,
        "hidden": false,
        "progressLabel": "missões",
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Mercury"
        }
    },
    {
        "id": "primeira-missao-venus",
        "title": "Vênus: Primeira Missão",
        "description": "Abra uma missão relacionada a Vênus.",
        "detail": "Você começou a estudar o histórico de exploração de Vênus.",
        "category": "Dossiê de Missões",
        "rarity": "common",
        "image": "assets/achievements/primeira-missao-venus.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Venus"
        }
    },
    {
        "id": "arquivo-venus-completo",
        "title": "Vênus: Arquivo Completo",
        "description": "Abra todos os dossiês de missão de Vênus.",
        "detail": "Todas as missões cadastradas para Vênus foram consultadas.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/arquivo-venus-completo.svg",
        "maxProgress": 5,
        "pointsReward": 65,
        "hidden": false,
        "progressLabel": "missões",
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Venus"
        }
    },
    {
        "id": "primeira-missao-terra",
        "title": "Terra: Primeira Missão",
        "description": "Abra uma missão relacionada a Terra.",
        "detail": "Você começou a estudar o histórico de exploração de Terra.",
        "category": "Dossiê de Missões",
        "rarity": "common",
        "image": "assets/achievements/primeira-missao-terra.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Earth"
        }
    },
    {
        "id": "arquivo-terra-completo",
        "title": "Terra: Arquivo Completo",
        "description": "Abra todos os dossiês de missão de Terra.",
        "detail": "Todas as missões cadastradas para Terra foram consultadas.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/arquivo-terra-completo.svg",
        "maxProgress": 5,
        "pointsReward": 65,
        "hidden": false,
        "progressLabel": "missões",
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Earth"
        }
    },
    {
        "id": "primeira-missao-marte",
        "title": "Marte: Primeira Missão",
        "description": "Abra uma missão relacionada a Marte.",
        "detail": "Você começou a estudar o histórico de exploração de Marte.",
        "category": "Dossiê de Missões",
        "rarity": "common",
        "image": "assets/achievements/primeira-missao-marte.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Mars"
        }
    },
    {
        "id": "arquivo-marte-completo",
        "title": "Marte: Arquivo Completo",
        "description": "Abra todos os dossiês de missão de Marte.",
        "detail": "Todas as missões cadastradas para Marte foram consultadas.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/arquivo-marte-completo.svg",
        "maxProgress": 5,
        "pointsReward": 65,
        "hidden": false,
        "progressLabel": "missões",
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Mars"
        }
    },
    {
        "id": "primeira-missao-jupiter",
        "title": "Júpiter: Primeira Missão",
        "description": "Abra uma missão relacionada a Júpiter.",
        "detail": "Você começou a estudar o histórico de exploração de Júpiter.",
        "category": "Dossiê de Missões",
        "rarity": "common",
        "image": "assets/achievements/primeira-missao-jupiter.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Jupiter"
        }
    },
    {
        "id": "arquivo-jupiter-completo",
        "title": "Júpiter: Arquivo Completo",
        "description": "Abra todos os dossiês de missão de Júpiter.",
        "detail": "Todas as missões cadastradas para Júpiter foram consultadas.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/arquivo-jupiter-completo.svg",
        "maxProgress": 5,
        "pointsReward": 65,
        "hidden": false,
        "progressLabel": "missões",
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Jupiter"
        }
    },
    {
        "id": "primeira-missao-saturno",
        "title": "Saturno: Primeira Missão",
        "description": "Abra uma missão relacionada a Saturno.",
        "detail": "Você começou a estudar o histórico de exploração de Saturno.",
        "category": "Dossiê de Missões",
        "rarity": "common",
        "image": "assets/achievements/primeira-missao-saturno.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Saturn"
        }
    },
    {
        "id": "arquivo-saturno-completo",
        "title": "Saturno: Arquivo Completo",
        "description": "Abra todos os dossiês de missão de Saturno.",
        "detail": "Todas as missões cadastradas para Saturno foram consultadas.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/arquivo-saturno-completo.svg",
        "maxProgress": 5,
        "pointsReward": 65,
        "hidden": false,
        "progressLabel": "missões",
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Saturn"
        }
    },
    {
        "id": "primeira-missao-urano",
        "title": "Urano: Primeira Missão",
        "description": "Abra uma missão relacionada a Urano.",
        "detail": "Você começou a estudar o histórico de exploração de Urano.",
        "category": "Dossiê de Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-urano.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Uranus"
        }
    },
    {
        "id": "arquivo-urano-completo",
        "title": "Urano: Arquivo Completo",
        "description": "Abra todos os dossiês de missão de Urano.",
        "detail": "Todas as missões cadastradas para Urano foram consultadas.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/arquivo-urano-completo.svg",
        "maxProgress": 2,
        "pointsReward": 50,
        "hidden": false,
        "progressLabel": "missões",
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Uranus"
        }
    },
    {
        "id": "primeira-missao-netuno",
        "title": "Netuno: Primeira Missão",
        "description": "Abra uma missão relacionada a Netuno.",
        "detail": "Você começou a estudar o histórico de exploração de Netuno.",
        "category": "Dossiê de Missões",
        "rarity": "uncommon",
        "image": "assets/achievements/primeira-missao-netuno.svg",
        "maxProgress": 1,
        "pointsReward": 10,
        "hidden": false,
        "trigger": {
            "type": "mission_planet_first",
            "planet": "Neptune"
        }
    },
    {
        "id": "arquivo-netuno-completo",
        "title": "Netuno: Arquivo Completo",
        "description": "Abra todos os dossiês de missão de Netuno.",
        "detail": "Todas as missões cadastradas para Netuno foram consultadas.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/arquivo-netuno-completo.svg",
        "maxProgress": 2,
        "pointsReward": 50,
        "hidden": false,
        "progressLabel": "missões",
        "trigger": {
            "type": "mission_planet_unique",
            "planet": "Neptune"
        }
    },
    {
        "id": "missao-sol-parker-solar-probe",
        "title": "Toque Solar",
        "description": "Abra o dossiê da Parker Solar Probe.",
        "detail": "Você estudou a missão que chegou mais perto do Sol do que qualquer nave anterior.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/missao-sol-parker-solar-probe.svg",
        "maxProgress": 1,
        "pointsReward": 40,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Sun",
            "mission": "Parker Solar Probe"
        }
    },
    {
        "id": "missao-sol-soho",
        "title": "Sentinela Solar",
        "description": "Abra o dossiê da missão SOHO.",
        "detail": "Você investigou um dos observatórios solares mais importantes da história.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-sol-soho.svg",
        "maxProgress": 1,
        "pointsReward": 25,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Sun",
            "mission": "SOHO"
        }
    },
    {
        "id": "missao-mercurio-messenger",
        "title": "Mensageira de Mercúrio",
        "description": "Abra o dossiê da MESSENGER.",
        "detail": "Você estudou a primeira nave a orbitar Mercúrio.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-mercurio-messenger.svg",
        "maxProgress": 1,
        "pointsReward": 25,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Mercury",
            "mission": "MESSENGER"
        }
    },
    {
        "id": "missao-mercurio-bepicolombo",
        "title": "Rota de Bepi",
        "description": "Abra o dossiê da BepiColombo.",
        "detail": "Você conheceu a missão conjunta ESA/JAXA rumo a Mercúrio.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-mercurio-bepicolombo.svg",
        "maxProgress": 1,
        "pointsReward": 25,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Mercury",
            "mission": "BepiColombo"
        }
    },
    {
        "id": "missao-venus-venera-7",
        "title": "Voz de Vênus",
        "description": "Abra o dossiê da Venera 7.",
        "detail": "Você descobriu a missão que transmitiu dados da superfície de outro planeta pela primeira vez.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/missao-venus-venera-7.svg",
        "maxProgress": 1,
        "pointsReward": 40,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Venus",
            "mission": "Venera 7"
        }
    },
    {
        "id": "missao-venus-magellan",
        "title": "Radar Venusiano",
        "description": "Abra o dossiê da Magellan.",
        "detail": "Você viu como radares revelaram Vênus por baixo das nuvens.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-venus-magellan.svg",
        "maxProgress": 1,
        "pointsReward": 25,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Venus",
            "mission": "Magellan"
        }
    },
    {
        "id": "missao-terra-sputnik-1",
        "title": "Primeiro Sinal",
        "description": "Abra o dossiê do Sputnik 1.",
        "detail": "Você estudou o primeiro satélite artificial da história.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-terra-sputnik-1.svg",
        "maxProgress": 1,
        "pointsReward": 25,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Earth",
            "mission": "Sputnik 1"
        }
    },
    {
        "id": "missao-terra-apollo-11",
        "title": "Pegadas na Lua",
        "description": "Abra o dossiê da Apollo 11.",
        "detail": "Você revisitou uma das missões humanas mais famosas da exploração espacial.",
        "category": "Dossiê de Missões",
        "rarity": "legendary",
        "image": "assets/achievements/missao-terra-apollo-11.svg",
        "maxProgress": 1,
        "pointsReward": 70,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Earth",
            "mission": "Apollo 11"
        }
    },
    {
        "id": "missao-terra-iss",
        "title": "Casa em Órbita",
        "description": "Abra o dossiê da ISS.",
        "detail": "Você visitou o arquivo da estação onde humanos vivem e pesquisam em microgravidade.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-terra-iss.svg",
        "maxProgress": 1,
        "pointsReward": 25,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Earth",
            "mission": "ISS"
        }
    },
    {
        "id": "missao-marte-viking-1-2",
        "title": "Laboratórios Marcianos",
        "description": "Abra o dossiê das Viking 1 e 2.",
        "detail": "Você estudou as primeiras missões que pousaram com sucesso em Marte.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-marte-viking-1-2.svg",
        "maxProgress": 1,
        "pointsReward": 30,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Mars",
            "mission": "Viking 1 & 2"
        }
    },
    {
        "id": "missao-marte-curiosity",
        "title": "Curiosidade em Marte",
        "description": "Abra o dossiê do rover Curiosity.",
        "detail": "Você conheceu um laboratório móvel que explora Marte desde 2012.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-marte-curiosity.svg",
        "maxProgress": 1,
        "pointsReward": 25,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Mars",
            "mission": "Curiosity"
        }
    },
    {
        "id": "missao-marte-perseverance-ingenuity",
        "title": "Perseverança e Voo",
        "description": "Abra o dossiê da Perseverance e do Ingenuity.",
        "detail": "Você estudou o rover e o primeiro helicóptero a voar em outro planeta.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/missao-marte-perseverance-ingenuity.svg",
        "maxProgress": 1,
        "pointsReward": 45,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Mars",
            "mission": "Perseverance + Ingenuity"
        }
    },
    {
        "id": "missao-jupiter-galileo",
        "title": "Orbitador de Júpiter",
        "description": "Abra o dossiê da Galileo.",
        "detail": "Você investigou uma das missões mais importantes para entender Júpiter e suas luas.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-jupiter-galileo.svg",
        "maxProgress": 1,
        "pointsReward": 30,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Jupiter",
            "mission": "Galileo"
        }
    },
    {
        "id": "missao-jupiter-juno",
        "title": "Nuvens de Juno",
        "description": "Abra o dossiê da Juno.",
        "detail": "Você estudou a missão que observa Júpiter em detalhes profundos.",
        "category": "Dossiê de Missões",
        "rarity": "rare",
        "image": "assets/achievements/missao-jupiter-juno.svg",
        "maxProgress": 1,
        "pointsReward": 30,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Jupiter",
            "mission": "Juno"
        }
    },
    {
        "id": "missao-jupiter-europa-clipper",
        "title": "Oceano de Europa",
        "description": "Abra o dossiê da Europa Clipper.",
        "detail": "Você conheceu a missão dedicada a investigar a lua Europa e seu oceano oculto.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/missao-jupiter-europa-clipper.svg",
        "maxProgress": 1,
        "pointsReward": 45,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Jupiter",
            "mission": "Europa Clipper"
        }
    },
    {
        "id": "missao-saturno-cassini-huygens",
        "title": "Cassini-Huygens",
        "description": "Abra o dossiê da Cassini-Huygens.",
        "detail": "Você estudou a missão que revelou Saturno, seus anéis e Titã com detalhes incríveis.",
        "category": "Dossiê de Missões",
        "rarity": "legendary",
        "image": "assets/achievements/missao-saturno-cassini-huygens.svg",
        "maxProgress": 1,
        "pointsReward": 70,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Saturn",
            "mission": "Cassini-Huygens"
        }
    },
    {
        "id": "missao-saturno-dragonfly",
        "title": "Libélula de Titã",
        "description": "Abra o dossiê da Dragonfly.",
        "detail": "Você conheceu a missão planejada para voar na atmosfera de Titã.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/missao-saturno-dragonfly.svg",
        "maxProgress": 1,
        "pointsReward": 45,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Saturn",
            "mission": "Dragonfly"
        }
    },
    {
        "id": "missao-urano-voyager-2",
        "title": "Encontro com Urano",
        "description": "Abra o dossiê da Voyager 2 em Urano.",
        "detail": "Você estudou a única missão que visitou Urano de perto.",
        "category": "Dossiê de Missões",
        "rarity": "legendary",
        "image": "assets/achievements/missao-urano-voyager-2.svg",
        "maxProgress": 1,
        "pointsReward": 60,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Uranus",
            "mission": "Voyager 2"
        }
    },
    {
        "id": "missao-netuno-voyager-2",
        "title": "Encontro com Netuno",
        "description": "Abra o dossiê da Voyager 2 em Netuno.",
        "detail": "Você estudou a única missão que visitou Netuno de perto.",
        "category": "Dossiê de Missões",
        "rarity": "legendary",
        "image": "assets/achievements/missao-netuno-voyager-2.svg",
        "maxProgress": 1,
        "pointsReward": 60,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Neptune",
            "mission": "Voyager 2"
        }
    },
    {
        "id": "missao-netuno-neptune-odyssey-proposta",
        "title": "Odisséia Netuniana",
        "description": "Abra o dossiê da Neptune Odyssey.",
        "detail": "Você explorou uma ideia de missão futura para desvendar Netuno e Tritão.",
        "category": "Dossiê de Missões",
        "rarity": "epic",
        "image": "assets/achievements/missao-netuno-neptune-odyssey-proposta.svg",
        "maxProgress": 1,
        "pointsReward": 45,
        "hidden": false,
        "trigger": {
            "type": "mission_specific",
            "planet": "Neptune",
            "mission": "Neptune Odyssey (proposta)"
        }
    },
    {
        "id": "companheiro-da-tardis",
        "title": "Companheiro da T.A.R.D.I.S.",
        "description": "Desbloqueie 25 conquistas.",
        "detail": "Você já acumulou conquistas suficientes para ser considerado um companheiro de viagem oficial.",
        "category": "Desafios Especiais",
        "rarity": "rare",
        "image": "assets/achievements/companheiro-da-tardis.svg",
        "maxProgress": 25,
        "pointsReward": 60,
        "hidden": false,
        "progressLabel": "conquistas",
        "trigger": {
            "type": "achievement_unlocked_total"
        }
    },
    {
        "id": "colecionador-cosmico",
        "title": "Colecionador Cósmico",
        "description": "Desbloqueie 100 conquistas.",
        "detail": "Metade do grande painel já respondeu ao seu esforço. A galáxia está de olho.",
        "category": "Desafios Especiais",
        "rarity": "epic",
        "image": "assets/achievements/colecionador-cosmico.svg",
        "maxProgress": 100,
        "pointsReward": 120,
        "hidden": false,
        "progressLabel": "conquistas",
        "trigger": {
            "type": "achievement_unlocked_total"
        }
    },
    {
        "id": "senhor-do-painel",
        "title": "Senhor do Painel",
        "description": "Desbloqueie 200 conquistas.",
        "detail": "Você completou todo o painel de conquistas da T.A.R.D.I.S. Uma marca verdadeiramente lendária.",
        "category": "Desafios Especiais",
        "rarity": "legendary",
        "image": "assets/achievements/senhor-do-painel.svg",
        "maxProgress": 200,
        "pointsReward": 250,
        "hidden": false,
        "progressLabel": "conquistas",
        "trigger": {
            "type": "achievement_unlocked_total"
        }
    }
];
