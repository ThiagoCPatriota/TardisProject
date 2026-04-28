// ============================================
// T.A.R.D.I.S. — Auth Modal Controller
// Cadastro, login, validação e anti-spam simples.
// ============================================
import { SUPABASE_CONFIG, isSupabaseConfigured, isTurnstileConfigured } from './supabaseConfig.js';
import {
    signUpWithEmail,
    signInWithEmail,
    signOut,
    resendSignupConfirmation,
    getCurrentSession,
    onAuthStateChange
} from './authService.js';
import { isFPSMonitorVisible, setFPSMonitorVisible } from '../ui/fpsMonitor.js';
import { DEFAULT_AVATAR, AVATAR_OPTIONS, normalizeAvatar, getAvatarOption } from '../avatar/avatarData.js';
import { renderAvatarInto, renderAvatarPreviewHTML } from '../avatar/avatarRenderer.js';

let mode = 'signup';
let modal = null;
let form = null;
let messageBox = null;
let submitButton = null;
let explorerField = null;
let confirmField = null;
let accountCard = null;
let formWrapper = null;
let accountExplorerName = null;
let accountEmail = null;
let accountExplorationPoints = null;
let accountStarFragments = null;
let navProfile = null;
let navProfileIcon = null;
let navAuthLabel = null;
let turnstileWidgetId = null;
let captchaToken = null;
let localChallengeAnswer = null;
let signupStep = 'account';
let selectedAvatar = normalizeAvatar(DEFAULT_AVATAR);
let accountStepValidated = false;
let accountAvatarPreview = null;

const SELECTORS = {
    explorerName: '#auth-explorer-name',
    email: '#auth-email',
    password: '#auth-password',
    confirm: '#auth-confirm-password',
    localChallengeInput: '#auth-local-challenge-answer'
};

const cleanExplorerName = (name = '') => name.trim().replace(/\s+/g, ' ');

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const getSignupAccountData = () => ({
    explorerName: cleanExplorerName(modal?.querySelector(SELECTORS.explorerName)?.value || ''),
    email: normalizeEmail(modal?.querySelector(SELECTORS.email)?.value || ''),
    password: modal?.querySelector(SELECTORS.password)?.value || '',
    confirm: modal?.querySelector(SELECTORS.confirm)?.value || ''
});

const getAvatarLabel = (group, id) => getAvatarOption(group, id)?.label || 'Padrão';

const getAvatarWithCurrentSeed = () => {
    const account = getSignupAccountData();
    const seed = account.explorerName || account.email || selectedAvatar.seed || 'tardis-explorer';
    return normalizeAvatar({
        ...selectedAvatar,
        avatarProvider: 'dicebear',
        dicebearStyle: 'avataaars',
        seed
    });
};

const getAvatarSummary = (avatar = selectedAvatar) => {
    const normalized = normalizeAvatar(avatar);
    const visual = getAvatarLabel('clothing', normalized.clothing);
    const color = getAvatarLabel('clothesColor', normalized.clothesColor);
    const hair = `${getAvatarLabel('top', normalized.top)} · ${getAvatarLabel('hairColor', normalized.hairColor)}`;
    const accessory = normalized.accessories
        ? getAvatarLabel('accessories', normalized.accessories)
        : 'Sem óculos';
    const expression = `${getAvatarLabel('eyes', normalized.eyes)} · ${getAvatarLabel('mouth', normalized.mouth)}`;

    return { visual: `${visual} · ${color}`, hair, accessory, expression };
};

const updateAvatarPreview = () => {
    const preview = modal?.querySelector('#auth-avatar-preview');
    const confirmPreview = modal?.querySelector('#auth-confirm-avatar-preview');
    const previewAvatar = getAvatarWithCurrentSeed();
    selectedAvatar = previewAvatar;

    renderAvatarInto(preview, previewAvatar, { label: 'DiceBear · Avataaars' });
    renderAvatarInto(confirmPreview, previewAvatar, { compact: false, label: 'Avatar inicial' });

    const summaryName = modal?.querySelector('#auth-confirm-name');
    const summaryEmail = modal?.querySelector('#auth-confirm-email');
    const summarySuit = modal?.querySelector('#auth-confirm-suit');
    const summaryHair = modal?.querySelector('#auth-confirm-hair');
    const summaryAccessory = modal?.querySelector('#auth-confirm-accessory');
    const summaryExpression = modal?.querySelector('#auth-confirm-expression');
    const account = getSignupAccountData();
    const summary = getAvatarSummary(previewAvatar);

    if (summaryName) summaryName.textContent = account.explorerName || 'Explorador';
    if (summaryEmail) summaryEmail.textContent = account.email || 'e-mail ainda não informado';
    if (summarySuit) summarySuit.textContent = summary.visual;
    if (summaryHair) summaryHair.textContent = summary.hair;
    if (summaryAccessory) summaryAccessory.textContent = summary.accessory;
    if (summaryExpression) summaryExpression.textContent = summary.expression;
};

const AVATAR_CHOICE_GROUPS = [
    { key: 'preset', title: 'Base do explorador' },
    { key: 'skinColor', title: 'Tom de pele', swatch: true },
    { key: 'top', title: 'Cabelo / cobertura' },
    { key: 'hairColor', title: 'Cor do cabelo', swatch: true },
    { key: 'clothing', title: 'Roupa inicial' },
    { key: 'clothesColor', title: 'Cor da roupa', swatch: true },
    { key: 'accessories', title: 'Óculos / acessório' },
    { key: 'eyes', title: 'Olhar' },
    { key: 'mouth', title: 'Expressão' },
    { key: 'facialHair', title: 'Barba / bigode' }
];

const renderAvatarChoices = () => {
    const container = modal?.querySelector('#auth-avatar-options');
    if (!container) return;

    const renderButton = (group, option, extraClass = '') => {
        const value = option.id ?? 'none';
        const normalizedValue = option.id ?? null;
        const isActive = (selectedAvatar[group] ?? null) === normalizedValue || (option.id === null && selectedAvatar[group] === null);
        const style = option.color ? ` style="--swatch-color:${option.color}"` : '';
        const label = option.label || value;
        const swatchTitle = option.color ? ` title="${label}" aria-label="${label}"` : '';
        const patch = option.patch ? ` data-avatar-patch='${JSON.stringify(option.patch).replaceAll("'", '&apos;')}'` : '';
        return `<button class="avatar-choice ${extraClass} ${option.color ? 'avatar-swatch' : ''} ${isActive ? 'active' : ''}" data-avatar-group="${group}" data-avatar-value="${value}" type="button"${style}${swatchTitle}${patch}>${option.color ? '' : label}</button>`;
    };

    container.innerHTML = AVATAR_CHOICE_GROUPS.map((group) => {
        const options = AVATAR_OPTIONS[group.key] || [];
        if (!options.length) return '';

        return `
            <div class="avatar-option-group avatar-option-group-${group.key}">
                <span>${group.title}</span>
                <div class="avatar-choice-row">${options.map((option) => renderButton(group.key, option, group.swatch ? 'avatar-swatch' : '')).join('')}</div>
            </div>
        `;
    }).join('');
};

const syncSignupStepUI = () => {
    const isSignupMode = mode === 'signup';
    modal?.querySelector('.auth-panel')?.classList.toggle('avatar-flow-active', isSignupMode);
    modal?.querySelector('#auth-signup-steps')?.classList.toggle('auth-hidden', !isSignupMode);

    modal?.querySelectorAll('[data-auth-step-panel]').forEach((panel) => {
        const shouldShow = !isSignupMode
            ? panel.dataset.authStepPanel === 'account'
            : panel.dataset.authStepPanel === signupStep;
        panel.classList.toggle('active', shouldShow);
    });

    modal?.querySelectorAll('[data-signup-step]').forEach((pill) => {
        pill.classList.toggle('active', isSignupMode && pill.dataset.signupStep === signupStep);
    });

    const backButton = modal?.querySelector('#auth-back-step');
    backButton?.classList.toggle('auth-hidden', !isSignupMode || signupStep === 'account');

    updateAvatarPreview();
    setLoading(false);
};

const setSignupStep = (step) => {
    signupStep = step;
    syncSignupStepUI();
};

const resetSignupWizard = () => {
    signupStep = 'account';
    accountStepValidated = false;
    selectedAvatar = normalizeAvatar(DEFAULT_AVATAR);
    renderAvatarChoices();
    syncSignupStepUI();
};

const goBackSignupStep = () => {
    if (mode !== 'signup') return;
    if (signupStep === 'confirm') setSignupStep('avatar');
    else if (signupStep === 'avatar') setSignupStep('account');
};


const getAuthFriendlyMessage = (error, context = {}) => {
    const rawMessage = error?.message || 'Não foi possível concluir a autenticação.';
    const message = rawMessage.toLowerCase();

    if (message.includes('email not confirmed')) {
        return 'Esse e-mail ainda precisa ser confirmado antes do login. Confirme pelo link enviado ou, para MVP/teste, desative Confirm email no Supabase e recrie/confirme esse usuário.';
    }

    if (message.includes('invalid login credentials')) {
        return 'E-mail ou senha incorretos. Confira os dados e tente novamente.';
    }

    if (message.includes('rate limit') || message.includes('too many requests')) {
        return 'Muitas tentativas seguidas. Aguarde um pouco antes de tentar novamente.';
    }

    if (message.includes('user already registered') || message.includes('already registered') || message.includes('already exists')) {
        return 'Essa conta já existe. Use a aba Login para entrar com esse e-mail e senha.';
    }

    if (message.includes('password')) {
        return 'A senha não foi aceita. Use pelo menos 8 caracteres e tente novamente.';
    }

    return context.fallback || rawMessage;
};

const getEmailPreview = (email) => {
    if (!email) return 'Perfil';
    const [name] = email.split('@');
    return name?.slice(0, 16) || 'Perfil';
};

const getExplorerName = (user) => {
    const metadata = user?.user_metadata || {};
    return cleanExplorerName(
        metadata.explorer_name ||
        metadata.display_name ||
        metadata.full_name ||
        ''
    );
};

const getDisplayName = (user) => {
    const explorerName = getExplorerName(user);
    return explorerName || getEmailPreview(user?.email || '');
};

const updateAccountPoints = (points = 0, fragments = 0) => {
    if (accountExplorationPoints) accountExplorationPoints.textContent = Number(points || 0);
    if (accountStarFragments) accountStarFragments.textContent = Number(fragments || 0);
};

const syncFPSPreferenceToggle = () => {
    const fpsToggle = modal?.querySelector('#auth-fps-toggle');
    if (!fpsToggle) return;
    fpsToggle.checked = isFPSMonitorVisible();
};

const setMessage = (text, type = 'warning') => {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.className = `auth-message active ${type}`;

    const resendButton = modal?.querySelector('#auth-resend-confirmation');
    const shouldShowResend = type === 'error' && text.toLowerCase().includes('confirm');
    resendButton?.classList.toggle('auth-hidden', !shouldShowResend);
};

const clearMessage = () => {
    if (!messageBox) return;
    messageBox.textContent = '';
    messageBox.className = 'auth-message';
    modal?.querySelector('#auth-resend-confirmation')?.classList.add('auth-hidden');
};

const getSubmitLabel = () => {
    if (mode !== 'signup') return 'ENTRAR';
    if (signupStep === 'account') return 'CONTINUAR';
    if (signupStep === 'avatar') return 'REVISAR EXPLORADOR';
    return 'COMEÇAR MISSÃO';
};

const setLoading = (isLoading) => {
    if (!submitButton) return;
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading
        ? (mode === 'signup' ? 'CRIANDO EXPLORADOR...' : 'ENTRANDO...')
        : getSubmitLabel();
};

const createLocalChallenge = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    localChallengeAnswer = a + b;

    const question = modal?.querySelector('#auth-local-challenge-question');
    const input = modal?.querySelector(SELECTORS.localChallengeInput);

    if (question) question.innerHTML = `Verificação anti-spam:<strong>${a} + ${b} = ?</strong>`;
    if (input) input.value = '';
};

const ensureTurnstileScript = () => {
    return new Promise((resolve, reject) => {
        if (!isTurnstileConfigured()) return resolve(false);
        if (window.turnstile) return resolve(true);

        const existing = document.querySelector('script[data-turnstile-script="true"]');
        if (existing) {
            existing.addEventListener('load', () => resolve(true), { once: true });
            existing.addEventListener('error', reject, { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.turnstileScript = 'true';
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Não foi possível carregar o Turnstile.'));
        document.head.appendChild(script);
    });
};

const resetCaptcha = async () => {
    captchaToken = null;

    if (isTurnstileConfigured()) {
        await ensureTurnstileScript();
        if (window.turnstile && turnstileWidgetId !== null) {
            window.turnstile.reset(turnstileWidgetId);
        }
    } else {
        createLocalChallenge();
    }
};

const renderCaptcha = async () => {
    const captchaBox = modal?.querySelector('#auth-captcha-box');
    const localChallenge = modal?.querySelector('#auth-local-challenge');

    if (!captchaBox || !localChallenge) return;

    captchaBox.classList.toggle('active', isTurnstileConfigured());
    localChallenge.classList.toggle('active', !isTurnstileConfigured() && mode === 'signup');

    if (!isTurnstileConfigured()) {
        if (mode === 'signup') createLocalChallenge();
        return;
    }

    try {
        await ensureTurnstileScript();
        if (!window.turnstile) return;

        if (turnstileWidgetId !== null) {
            window.turnstile.reset(turnstileWidgetId);
            return;
        }

        turnstileWidgetId = window.turnstile.render(captchaBox, {
            sitekey: SUPABASE_CONFIG.turnstileSiteKey,
            theme: 'dark',
            callback: (token) => {
                captchaToken = token;
            },
            'expired-callback': () => {
                captchaToken = null;
            },
            'error-callback': () => {
                captchaToken = null;
                setMessage('O CAPTCHA falhou. Tente novamente.', 'error');
            }
        });
    } catch (error) {
        console.warn('[Auth] Turnstile indisponível:', error.message);
        setMessage('Não foi possível carregar a verificação anti-spam. Tente novamente.', 'error');
    }
};

const setMode = async (nextMode) => {
    mode = nextMode;
    clearMessage();

    const isSignupMode = mode === 'signup';
    const signupTab = modal?.querySelector('#auth-tab-signup');
    const loginTab = modal?.querySelector('#auth-tab-login');
    const title = modal?.querySelector('#auth-title');
    const subtitle = modal?.querySelector('#auth-subtitle');
    const explorerInput = modal?.querySelector(SELECTORS.explorerName);
    const confirmInput = modal?.querySelector(SELECTORS.confirm);
    const localChallengeInput = modal?.querySelector(SELECTORS.localChallengeInput);

    signupTab?.classList.toggle('active', isSignupMode);
    loginTab?.classList.toggle('active', !isSignupMode);
    explorerField?.classList.toggle('auth-hidden', !isSignupMode);
    confirmField?.classList.toggle('auth-hidden', !isSignupMode);

    // Campo escondido com `required` bloqueava o submit nativo do navegador no Login.
    // Ao mudar de aba, desativamos os campos que não fazem parte daquele fluxo.
    if (explorerInput) {
        explorerInput.required = isSignupMode;
        explorerInput.disabled = !isSignupMode;
    }

    if (confirmInput) {
        confirmInput.disabled = !isSignupMode;
    }

    if (localChallengeInput) {
        localChallengeInput.disabled = !isSignupMode || isTurnstileConfigured();
    }

    const passwordInput = modal?.querySelector(SELECTORS.password);
    if (passwordInput) {
        passwordInput.autocomplete = isSignupMode ? 'new-password' : 'current-password';
    }

    if (title) title.textContent = isSignupMode ? 'Criar Explorador' : 'Entrar';
    if (subtitle) {
        subtitle.textContent = isSignupMode
            ? 'Crie sua conta, monte seu avatar inicial e comece sua missão pelo Sistema Solar.'
            : 'Entre com o e-mail e senha da sua conta T.A.R.D.I.S.';
    }

    if (isSignupMode && signupStep !== 'account') {
        signupStep = 'account';
    }

    syncSignupStepUI();
    await renderCaptcha();
};

const validateForm = ({ skipCaptcha = false } = {}) => {
    const { explorerName, email, password, confirm } = getSignupAccountData();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const explorerNameRegex = /^[\p{L}\p{N} _.-]+$/u;

    if (!isSupabaseConfigured()) {
        throw new Error('Supabase ainda não foi configurado. Abra js/auth/supabaseConfig.js e cole a Project URL e a anon public key.');
    }

    if (mode === 'signup') {
        if (explorerName.length < 2) throw new Error('Escolha um Nome de Explorador com pelo menos 2 caracteres.');
        if (explorerName.length > 18) throw new Error('O Nome de Explorador pode ter no máximo 18 caracteres.');
        if (!explorerNameRegex.test(explorerName)) {
            throw new Error('Use apenas letras, números, espaços, ponto, hífen ou underline no Nome de Explorador.');
        }
    }

    if (!emailRegex.test(email)) throw new Error('Digite um e-mail válido.');
    if (password.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');

    if (mode === 'signup') {
        if (password !== confirm) throw new Error('As senhas não conferem.');

        if (!skipCaptcha) {
            if (isTurnstileConfigured() && !captchaToken) {
                throw new Error('Complete a verificação antes de continuar.');
            }

            if (!isTurnstileConfigured()) {
                const challengeValue = Number(modal.querySelector(SELECTORS.localChallengeInput)?.value);
                if (challengeValue !== localChallengeAnswer) {
                    throw new Error('A continha está incorreta. Tente novamente.');
                }
            }
        }
    }

    if (mode === 'login' && isTurnstileConfigured() && !captchaToken) {
        throw new Error('Complete a verificação antes de entrar.');
    }

    return { email, password, explorerName, avatar: getAvatarWithCurrentSeed() };
};

const updateNavSession = (session) => {
    const user = session?.user || null;
    const displayName = user ? getDisplayName(user) : '';

    if (!navProfile) return;

    navProfile.classList.toggle('auth-logged-in', Boolean(user));
    navProfile.title = user ? `Explorador: ${displayName}` : 'Entrar ou criar conta';
    navProfile.setAttribute('aria-label', user ? `Perfil do explorador ${displayName}` : 'Entrar ou criar conta');

    if (navProfileIcon) navProfileIcon.textContent = user ? '🧑‍🚀' : '👤';
    if (navAuthLabel) navAuthLabel.textContent = user ? displayName : 'Perfil';
};

const showAccountView = (session) => {
    const user = session?.user || null;
    formWrapper?.classList.toggle('auth-hidden', Boolean(user));
    accountCard?.classList.toggle('active', Boolean(user));

    if (accountExplorerName) accountExplorerName.textContent = user ? getDisplayName(user) : '';
    if (accountEmail) accountEmail.textContent = user?.email || '';
    const profileSnapshot = window.TardisProfileProgress?.getSnapshot?.();
    updateAccountPoints(profileSnapshot?.explorationPoints || 0, profileSnapshot?.starFragments || 0);
    const avatar = profileSnapshot?.avatar || user?.user_metadata?.avatar || DEFAULT_AVATAR;
    const equippedCosmetics = profileSnapshot?.equippedCosmetics || {};
    renderAvatarInto(accountAvatarPreview, avatar, { compact: true, cosmetics: equippedCosmetics });
    syncFPSPreferenceToggle();

    const title = modal?.querySelector('#auth-title');
    const subtitle = modal?.querySelector('#auth-subtitle');

    if (user) {
        if (title) title.textContent = 'Perfil';
        if (subtitle) subtitle.textContent = 'Sua sessão de explorador está ativa nesta aba.';
        clearMessage();
    } else {
        formWrapper?.classList.remove('auth-hidden');
        accountCard?.classList.remove('active');
    }
};

const openModal = async (options = {}) => {
    if (options.mode === 'login' || options.mode === 'signup') {
        mode = options.mode;
    }

    modal?.classList.add('active');
    document.body.classList.add('auth-modal-open');

    const session = await getCurrentSession();
    updateNavSession(session);
    showAccountView(session);

    if (!session?.user) {
        await setMode(mode);
        if (options.message) {
            setMessage(options.message, options.messageType || 'warning');
        }
        setTimeout(() => {
            const focusTarget = mode === 'signup'
                ? modal?.querySelector(SELECTORS.explorerName)
                : modal?.querySelector(SELECTORS.email);
            focusTarget?.focus();
        }, 60);
    }
};

const closeModal = () => {
    modal?.classList.remove('active');
    document.body.classList.remove('auth-modal-open');
};

const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessage();

    try {
        if (mode === 'signup' && signupStep === 'account') {
            validateForm({ skipCaptcha: false });
            accountStepValidated = true;
            setSignupStep('avatar');
            return;
        }

        if (mode === 'signup' && signupStep === 'avatar') {
            updateAvatarPreview();
            setSignupStep('confirm');
            return;
        }

        const { email, password, explorerName, avatar } = validateForm({ skipCaptcha: accountStepValidated });
        setLoading(true);

        const data = mode === 'signup'
            ? await signUpWithEmail({ email, password, explorerName, avatar, captchaToken })
            : await signInWithEmail({ email, password, captchaToken });

        const session = data?.session || await getCurrentSession();

        if (mode === 'signup' && !session) {
            setMessage('Explorador criado. Se a confirmação de e-mail estiver ativa no Supabase, confirme pelo link enviado antes de entrar.', 'success');
            await setMode('login');
            return;
        }

        updateNavSession(session);
        showAccountView(session);
        setMessage(mode === 'signup' ? 'Explorador criado com sucesso. Bem-vindo à missão!' : 'Login realizado com sucesso!', 'success');

        window.dispatchEvent(new CustomEvent('tardis:auth-success', {
            detail: { session, mode, avatar }
        }));
    } catch (error) {
        setMessage(getAuthFriendlyMessage(error), 'error');
        if (mode === 'signup' && signupStep === 'account') {
            accountStepValidated = false;
            await resetCaptcha();
        }
    } finally {
        setLoading(false);
    }
};

const createModal = () => {
    modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal';
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="auth-backdrop" id="auth-backdrop"></div>
        <section class="auth-panel" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <header class="auth-header">
                <div>
                    <span class="auth-kicker">EXPLORADOR T.A.R.D.I.S.</span>
                    <h2 class="auth-title" id="auth-title">Criar conta</h2>
                    <p class="auth-subtitle" id="auth-subtitle">Escolha seu Nome de Explorador, e-mail, senha e resolva uma continha rápida.</p>
                </div>
                <button class="auth-close" id="auth-close" type="button" aria-label="Fechar">✕</button>
            </header>

            <div class="auth-body">
                <div class="auth-account-card" id="auth-account-card">
                    <span class="auth-kicker">SESSÃO ATIVA</span>
                    <div class="auth-avatar-mini" id="auth-account-avatar-preview"></div>
                    <div class="auth-account-name" id="auth-account-name"></div>
                    <div class="auth-account-email" id="auth-account-email"></div>

                    <div class="auth-profile-wallet" aria-label="Pontos do explorador">
                        <div>
                            <span>Pontos de Exploração</span>
                            <strong id="auth-exploration-points">0</strong>
                        </div>
                        <div>
                            <span>Fragmentos Estelares</span>
                            <strong id="auth-star-fragments">0</strong>
                        </div>
                    </div>

                    <div class="auth-preferences" aria-label="Preferências do explorador">
                        <label class="auth-pref-row" for="auth-fps-toggle">
                            <span class="auth-pref-copy">
                                <strong>Monitor de FPS</strong>
                                <small>Exibir painel de desempenho na tela.</small>
                            </span>
                            <span class="auth-switch">
                                <input id="auth-fps-toggle" type="checkbox">
                                <span class="auth-switch-track" aria-hidden="true"></span>
                            </span>
                        </label>
                    </div>

                    <button class="auth-logout" id="auth-logout" type="button">SAIR DA CONTA</button>
                </div>

                <div class="auth-form-wrapper" id="auth-form-wrapper">
                    <div class="auth-tabs">
                        <button class="auth-tab active" id="auth-tab-signup" type="button">CADASTRO</button>
                        <button class="auth-tab" id="auth-tab-login" type="button">LOGIN</button>
                    </div>

                    <form class="auth-form" id="auth-form" novalidate>
                        <div class="auth-signup-steps" id="auth-signup-steps" aria-label="Etapas de criação do explorador">
                            <div class="auth-step-pill active" data-signup-step="account"><strong>1</strong><span>Conta</span></div>
                            <div class="auth-step-pill" data-signup-step="avatar"><strong>2</strong><span>Avatar</span></div>
                            <div class="auth-step-pill" data-signup-step="confirm"><strong>3</strong><span>Missão</span></div>
                        </div>

                        <div class="auth-step-panel active" data-auth-step-panel="account">
                            <div class="auth-field" id="auth-explorer-field">
                                <label for="auth-explorer-name">Nome de Explorador</label>
                                <input id="auth-explorer-name" type="text" autocomplete="nickname" maxlength="18" placeholder="Ex: Astro Theo" required>
                            </div>

                            <div class="auth-field">
                                <label for="auth-email">E-mail</label>
                                <input id="auth-email" type="email" autocomplete="email" placeholder="voce@email.com" required>
                            </div>

                            <div class="auth-password-row">
                                <div class="auth-field">
                                    <label for="auth-password">Senha</label>
                                    <input id="auth-password" type="password" autocomplete="new-password" placeholder="mín. 8 caracteres" required>
                                </div>
                                <div class="auth-field" id="auth-confirm-field">
                                    <label for="auth-confirm-password">Confirmar senha</label>
                                    <input id="auth-confirm-password" type="password" autocomplete="new-password" placeholder="repita a senha">
                                </div>
                            </div>

                            <div class="auth-captcha-box" id="auth-captcha-box" aria-label="Verificação anti-spam"></div>

                            <div class="auth-local-challenge" id="auth-local-challenge">
                                <div class="auth-challenge-question" id="auth-local-challenge-question"></div>
                                <div class="auth-field">
                                    <label for="auth-local-challenge-answer">Resposta</label>
                                    <input id="auth-local-challenge-answer" type="number" inputmode="numeric" placeholder="?">
                                </div>
                            </div>
                        </div>

                        <div class="auth-step-panel" data-auth-step-panel="avatar">
                            <div class="avatar-creator-layout">
                                <div class="avatar-preview-wrap">
                                    <span class="avatar-preview-title">Seu explorador</span>
                                    <div id="auth-avatar-preview"></div>
                                    <p class="avatar-preview-subtitle">Esse é o avatar Avataaars inicial. Depois, a Loja Cósmica vai liberar itens e cosméticos melhores.</p>
                                </div>
                                <div class="avatar-options" id="auth-avatar-options"></div>
                            </div>
                        </div>

                        <div class="auth-step-panel" data-auth-step-panel="confirm">
                            <div class="avatar-confirm-card">
                                <div id="auth-confirm-avatar-preview"></div>
                                <div class="avatar-confirm-copy">
                                    <span class="auth-kicker">PRONTO PARA PARTIR</span>
                                    <strong id="auth-confirm-name">Explorador</strong>
                                    <span id="auth-confirm-email">e-mail ainda não informado</span>
                                    <p>Visual: <b id="auth-confirm-suit">Avataaars</b></p>
                                    <p>Cabelo: <b id="auth-confirm-hair">Personalizado</b></p>
                                    <p>Acessório: <b id="auth-confirm-accessory">Sem óculos</b></p>
                                    <p>Expressão: <b id="auth-confirm-expression">Normal</b></p>
                                </div>
                            </div>
                        </div>

                        <div class="auth-form-actions">
                            <button class="auth-back-step auth-hidden" id="auth-back-step" type="button">VOLTAR</button>
                            <button class="auth-submit" id="auth-submit" type="submit">CONTINUAR</button>
                        </div>
                    </form>

                </div>

                <div class="auth-message" id="auth-message"></div>
                <button class="auth-resend-confirmation auth-hidden" id="auth-resend-confirmation" type="button">REENVIAR CONFIRMAÇÃO</button>
            </div>
        </section>
    `;

    document.body.appendChild(modal);

    form = modal.querySelector('#auth-form');
    messageBox = modal.querySelector('#auth-message');
    submitButton = modal.querySelector('#auth-submit');
    explorerField = modal.querySelector('#auth-explorer-field');
    confirmField = modal.querySelector('#auth-confirm-field');
    accountCard = modal.querySelector('#auth-account-card');
    formWrapper = modal.querySelector('#auth-form-wrapper');
    accountExplorerName = modal.querySelector('#auth-account-name');
    accountEmail = modal.querySelector('#auth-account-email');
    accountExplorationPoints = modal.querySelector('#auth-exploration-points');
    accountStarFragments = modal.querySelector('#auth-star-fragments');
    accountAvatarPreview = modal.querySelector('#auth-account-avatar-preview');

    modal.querySelector('#auth-close')?.addEventListener('click', closeModal);
    modal.querySelector('#auth-backdrop')?.addEventListener('click', closeModal);
    modal.querySelector('#auth-tab-signup')?.addEventListener('click', () => { resetSignupWizard(); setMode('signup'); });
    modal.querySelector('#auth-tab-login')?.addEventListener('click', () => setMode('login'));
    modal.querySelector('#auth-back-step')?.addEventListener('click', goBackSignupStep);
    modal.querySelector('#auth-avatar-options')?.addEventListener('click', (event) => {
        const choice = event.target.closest?.('[data-avatar-group]');
        if (!choice) return;
        const group = choice.dataset.avatarGroup;
        const rawValue = choice.dataset.avatarValue;
        const value = rawValue === 'none' ? null : rawValue;
        let patch = {};

        try {
            patch = choice.dataset.avatarPatch ? JSON.parse(choice.dataset.avatarPatch) : {};
        } catch (_error) {
            patch = {};
        }

        selectedAvatar = normalizeAvatar({
            ...selectedAvatar,
            avatarProvider: 'dicebear',
            dicebearStyle: 'avataaars',
            [group]: value,
            ...patch
        });
        renderAvatarChoices();
        updateAvatarPreview();
    });
    modal.querySelector('#auth-logout')?.addEventListener('click', async () => {
        try {
            await signOut();
            updateNavSession(null);
            showAccountView(null);
            await setMode('login');
            setMessage('Você saiu da conta.', 'success');
        } catch (error) {
            setMessage(error.message || 'Não foi possível sair da conta.', 'error');
        }
    });

    modal.querySelector('#auth-fps-toggle')?.addEventListener('change', (event) => {
        setFPSMonitorVisible(event.target.checked);
    });

    window.addEventListener('tardis:fps-visibility-changed', syncFPSPreferenceToggle);
    window.addEventListener('tardis:profile-points-updated', (event) => {
        updateAccountPoints(event.detail?.explorationPoints || 0, event.detail?.starFragments || 0);
        const avatar = event.detail?.avatar;
        const equippedCosmetics = event.detail?.equippedCosmetics;
        if (avatar || equippedCosmetics) {
            const currentAvatar = avatar || window.TardisProfileProgress?.getSnapshot?.()?.avatar || DEFAULT_AVATAR;
            renderAvatarInto(accountAvatarPreview, currentAvatar, { compact: true, cosmetics: equippedCosmetics || {} });
        }
    });

    modal.querySelector('#auth-resend-confirmation')?.addEventListener('click', async () => {
        const email = normalizeEmail(modal.querySelector(SELECTORS.email)?.value || '');

        if (!email) {
            setMessage('Digite o e-mail da conta para reenviar a confirmação.', 'error');
            return;
        }

        try {
            setMessage('Enviando novo link de confirmação...', 'warning');
            await resendSignupConfirmation({ email });
            setMessage('Enviamos um novo link de confirmação. Verifique sua caixa de entrada e spam.', 'success');
        } catch (error) {
            setMessage(getAuthFriendlyMessage(error, { fallback: 'Não foi possível reenviar a confirmação agora.' }), 'error');
        }
    });
    modal.querySelectorAll('#auth-explorer-name, #auth-email, #auth-password, #auth-confirm-password, #auth-local-challenge-answer').forEach((input) => {
        input.addEventListener('input', () => {
            if (mode === 'signup') accountStepValidated = false;
            updateAvatarPreview();
        });
    });

    renderAvatarChoices();
    updateAvatarPreview();
    form?.addEventListener('submit', handleSubmit);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
};

const setupNavButton = () => {
    navProfile = document.getElementById('nav-profile');
    if (!navProfile) return;

    navProfile.setAttribute('role', 'button');
    navProfile.setAttribute('tabindex', '0');
    navProfile.setAttribute('aria-label', 'Entrar ou criar conta');

    navProfileIcon = navProfile.querySelector('.nav-profile-icon');

    if (!navProfile.querySelector('.nav-auth-label')) {
        const label = document.createElement('span');
        label.className = 'nav-auth-label';
        label.textContent = 'Perfil';
        navProfile.appendChild(label);
    }

    navAuthLabel = navProfile.querySelector('.nav-auth-label');
    navProfile.addEventListener('click', () => openModal());
    navProfile.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal();
        }
    });
};

const initAuth = async () => {
    createModal();
    setupNavButton();

    const session = await getCurrentSession();
    updateNavSession(session);

    onAuthStateChange((_event, sessionData) => {
        updateNavSession(sessionData);
    });

    document.addEventListener('tardis:auth-open', (event) => {
        openModal(event.detail || {});
    });

    window.TardisAuth = {
        open: openModal,
        close: closeModal,
        getSession: getCurrentSession
    };

    if (!isSupabaseConfigured()) {
        console.info('[Auth] Supabase não configurado ainda. Preencha js/auth/supabaseConfig.js para ativar login/cadastro.');
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth, { once: true });
} else {
    initAuth();
}
