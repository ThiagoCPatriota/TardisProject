// ============================================
// T.A.R.D.I.S. — Catálogo inicial de conquistas
// Dados locais para a primeira versão visual.
// Depois esta estrutura pode ser espelhada no Supabase.
// ============================================

export const ACHIEVEMENT_CATEGORIES = [
    'Todas',
    'Primeiros Passos',
    'Modo Aventura',
    'Exploração Planetária',
    'Conhecimento Espacial',
    'Pontuação'
];

export const RARITY_META = {
    common: {
        label: 'Comum',
        className: 'rarity-common'
    },
    uncommon: {
        label: 'Incomum',
        className: 'rarity-uncommon'
    },
    rare: {
        label: 'Rara',
        className: 'rarity-rare'
    },
    epic: {
        label: 'Épica',
        className: 'rarity-epic'
    },
    legendary: {
        label: 'Lendária',
        className: 'rarity-legendary'
    }
};

export const ACHIEVEMENTS_DATA = [
    {
        id: 'novo-explorador',
        title: 'Novo Explorador',
        description: 'Crie sua conta de explorador.',
        detail: 'Uma conta T.A.R.D.I.S. permite guardar progresso, conquistas e futuras missões personalizadas.',
        category: 'Primeiros Passos',
        rarity: 'common',
        image: 'assets/achievements/novo-explorador.svg',
        maxProgress: 1,
        pointsReward: 10,
        hidden: false
    },
    {
        id: 'primeiro-salto',
        title: 'Primeiro Salto',
        description: 'Entre no T.A.R.D.I.S. pela primeira vez.',
        detail: 'Todo grande explorador começa com um primeiro salto pelo espaço-tempo.',
        category: 'Primeiros Passos',
        rarity: 'common',
        image: 'assets/achievements/primeiro-salto.svg',
        maxProgress: 1,
        pointsReward: 5,
        hidden: false
    },
    {
        id: 'painel-de-bordo',
        title: 'Painel de Bordo',
        description: 'Abra a aba de conquistas pela primeira vez.',
        detail: 'Você encontrou o painel onde suas descobertas ficam registradas.',
        category: 'Primeiros Passos',
        rarity: 'common',
        image: 'assets/achievements/painel-de-bordo.svg',
        maxProgress: 1,
        pointsReward: 5,
        hidden: false
    },
    {
        id: 'chamado-da-galaxia',
        title: 'Chamado da Galáxia',
        description: 'Abra o Modo Aventura pela primeira vez.',
        detail: 'O Doctor chamou, e você aceitou embarcar na missão pelo Sistema Solar.',
        category: 'Modo Aventura',
        rarity: 'common',
        image: 'assets/achievements/chamado-da-galaxia.svg',
        maxProgress: 1,
        pointsReward: 10,
        hidden: false
    },
    {
        id: 'primeira-missao',
        title: 'Primeira Missão',
        description: 'Responda sua primeira pergunta no Modo Aventura.',
        detail: 'Responder uma pergunta já é começar a treinar sua mente de explorador.',
        category: 'Modo Aventura',
        rarity: 'common',
        image: 'assets/achievements/primeira-missao.svg',
        maxProgress: 1,
        pointsReward: 10,
        hidden: false
    },
    {
        id: 'resposta-certeira',
        title: 'Resposta Certeira',
        description: 'Acerte sua primeira pergunta.',
        detail: 'Precisão científica! Você acertou uma pergunta da aventura.',
        category: 'Modo Aventura',
        rarity: 'common',
        image: 'assets/achievements/resposta-certeira.svg',
        maxProgress: 1,
        pointsReward: 10,
        hidden: false
    },
    {
        id: 'aprendiz-do-doutor',
        title: 'Aprendiz do Doutor',
        description: 'Complete uma rodada do Modo Aventura.',
        detail: 'Você foi até o fim de uma missão com o Doctor. Isso merece registro no painel.',
        category: 'Modo Aventura',
        rarity: 'uncommon',
        image: 'assets/achievements/aprendiz-do-doutor.svg',
        maxProgress: 1,
        pointsReward: 20,
        hidden: false
    },
    {
        id: 'primeira-aterrissagem',
        title: 'Primeira Aterrissagem',
        description: 'Visite a superfície de um planeta ou estrela.',
        detail: 'Você saiu da visão geral e pousou em um corpo celeste para observar de perto.',
        category: 'Exploração Planetária',
        rarity: 'common',
        image: 'assets/achievements/primeira-aterrissagem.svg',
        maxProgress: 1,
        pointsReward: 10,
        hidden: false
    },
    {
        id: 'turista-espacial',
        title: 'Turista Espacial',
        description: 'Visite 3 corpos celestes diferentes.',
        detail: 'Continue explorando planetas diferentes para completar seu primeiro roteiro espacial.',
        category: 'Exploração Planetária',
        rarity: 'uncommon',
        image: 'assets/achievements/turista-espacial.svg',
        maxProgress: 3,
        pointsReward: 20,
        hidden: false,
        progressLabel: 'corpos visitados'
    },
    {
        id: 'curioso-do-cosmos',
        title: 'Curioso do Cosmos',
        description: 'Abra os detalhes de um planeta.',
        detail: 'Um bom explorador não só olha: ele investiga dados, curiosidades e missões.',
        category: 'Conhecimento Espacial',
        rarity: 'common',
        image: 'assets/achievements/curioso-do-cosmos.svg',
        maxProgress: 1,
        pointsReward: 10,
        hidden: false
    },
    {
        id: 'imagem-do-dia',
        title: 'Imagem do Dia',
        description: 'Abra o painel da imagem astronômica da NASA.',
        detail: 'A NASA publica uma janela diária para o universo. Você abriu essa janela.',
        category: 'Conhecimento Espacial',
        rarity: 'common',
        image: 'assets/achievements/imagem-do-dia.svg',
        maxProgress: 1,
        pointsReward: 10,
        hidden: false
    },
    {
        id: 'primeiros-10-pontos',
        title: 'Primeiros 10 Pontos',
        description: 'Acumule 10 pontos no Modo Aventura.',
        detail: 'Você começou a pontuar nas missões. Agora é só continuar evoluindo.',
        category: 'Pontuação',
        rarity: 'common',
        image: 'assets/achievements/primeiros-10-pontos.svg',
        maxProgress: 10,
        pointsReward: 10,
        hidden: false,
        progressLabel: 'pontos'
    }
];
