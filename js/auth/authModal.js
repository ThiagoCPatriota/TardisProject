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
let navProfile = null;
let navProfileIcon = null;
let navAuthLabel = null;
let turnstileWidgetId = null;
let captchaToken = null;
let localChallengeAnswer = null;

const SELECTORS = {
    explorerName: '#auth-explorer-name',
    email: '#auth-email',
    password: '#auth-password',
    confirm: '#auth-confirm-password',
    localChallengeInput: '#auth-local-challenge-answer'
};

const cleanExplorerName = (name = '') => name.trim().replace(/\s+/g, ' ');

const normalizeEmail = (email = '') => email.trim().toLowerCase();

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

const setLoading = (isLoading) => {
    if (!submitButton) return;
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading
        ? (mode === 'signup' ? 'CRIANDO CONTA...' : 'ENTRANDO...')
        : (mode === 'signup' ? 'CRIAR CONTA' : 'ENTRAR');
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

    if (title) title.textContent = isSignupMode ? 'Criar conta' : 'Entrar';
    if (subtitle) {
        subtitle.textContent = isSignupMode
            ? 'Escolha seu Nome de Explorador, e-mail, senha e resolva uma continha rápida.'
            : 'Entre com o e-mail e senha da sua conta T.A.R.D.I.S.';
    }

    setLoading(false);
    await renderCaptcha();
};

const validateForm = () => {
    const explorerName = cleanExplorerName(modal.querySelector(SELECTORS.explorerName)?.value || '');
    const email = normalizeEmail(modal.querySelector(SELECTORS.email)?.value || '');
    const password = modal.querySelector(SELECTORS.password)?.value || '';
    const confirm = modal.querySelector(SELECTORS.confirm)?.value || '';
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

        if (isTurnstileConfigured() && !captchaToken) {
            throw new Error('Complete a verificação antes de criar a conta.');
        }

        if (!isTurnstileConfigured()) {
            const challengeValue = Number(modal.querySelector(SELECTORS.localChallengeInput)?.value);
            if (challengeValue !== localChallengeAnswer) {
                throw new Error('A continha está incorreta. Tente novamente.');
            }
        }
    }

    if (mode === 'login' && isTurnstileConfigured() && !captchaToken) {
        throw new Error('Complete a verificação antes de entrar.');
    }

    return { email, password, explorerName };
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
        const { email, password, explorerName } = validateForm();
        setLoading(true);

        const data = mode === 'signup'
            ? await signUpWithEmail({ email, password, explorerName, captchaToken })
            : await signInWithEmail({ email, password, captchaToken });

        const session = data?.session || await getCurrentSession();

        if (mode === 'signup' && !session) {
            setMessage('Conta criada. Se a confirmação de e-mail estiver ativa no Supabase, confirme pelo link enviado antes de entrar.', 'success');
            await setMode('login');
            return;
        }

        updateNavSession(session);
        showAccountView(session);
        const successMessage = data?.existingAccount
            ? 'Essa conta já existia. Entramos com ela usando seu e-mail e senha.'
            : (mode === 'signup' ? 'Conta de explorador criada com sucesso!' : 'Login realizado com sucesso!');

        setMessage(successMessage, 'success');

        window.dispatchEvent(new CustomEvent('tardis:auth-success', {
            detail: { session, mode }
        }));
    } catch (error) {
        setMessage(getAuthFriendlyMessage(error), 'error');
        await resetCaptcha();
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
                    <div class="auth-account-name" id="auth-account-name"></div>
                    <div class="auth-account-email" id="auth-account-email"></div>
                    <button class="auth-logout" id="auth-logout" type="button">SAIR DA CONTA</button>
                </div>

                <div class="auth-form-wrapper" id="auth-form-wrapper">
                    <div class="auth-tabs">
                        <button class="auth-tab active" id="auth-tab-signup" type="button">CADASTRO</button>
                        <button class="auth-tab" id="auth-tab-login" type="button">LOGIN</button>
                    </div>

                    <form class="auth-form" id="auth-form" novalidate>
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

                        <button class="auth-submit" id="auth-submit" type="submit">CRIAR CONTA</button>
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

    modal.querySelector('#auth-close')?.addEventListener('click', closeModal);
    modal.querySelector('#auth-backdrop')?.addEventListener('click', closeModal);
    modal.querySelector('#auth-tab-signup')?.addEventListener('click', () => setMode('signup'));
    modal.querySelector('#auth-tab-login')?.addEventListener('click', () => setMode('login'));
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
