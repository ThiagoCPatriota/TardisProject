// ============================================
// T.A.R.D.I.S. — Auth Modal Controller
// Cadastro, login, validação e anti-spam simples.
// ============================================
import { SUPABASE_CONFIG, isSupabaseConfigured, isTurnstileConfigured } from './supabaseConfig.js';
import {
    signUpWithEmail,
    signInWithEmail,
    signOut,
    getCurrentSession,
    onAuthStateChange
} from './authService.js';

let mode = 'signup';
let modal = null;
let form = null;
let messageBox = null;
let submitButton = null;
let confirmField = null;
let accountCard = null;
let formWrapper = null;
let accountEmail = null;
let navProfile = null;
let navProfileIcon = null;
let navAuthLabel = null;
let turnstileWidgetId = null;
let captchaToken = null;
let localChallengeAnswer = null;

const SELECTORS = {
    email: '#auth-email',
    password: '#auth-password',
    confirm: '#auth-confirm-password',
    localChallengeInput: '#auth-local-challenge-answer'
};

const getEmailPreview = (email) => {
    if (!email) return 'Perfil';
    const [name] = email.split('@');
    return name?.slice(0, 16) || 'Perfil';
};

const setMessage = (text, type = 'warning') => {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.className = `auth-message active ${type}`;
};

const clearMessage = () => {
    if (!messageBox) return;
    messageBox.textContent = '';
    messageBox.className = 'auth-message';
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

    const signupTab = modal?.querySelector('#auth-tab-signup');
    const loginTab = modal?.querySelector('#auth-tab-login');
    const title = modal?.querySelector('#auth-title');
    const subtitle = modal?.querySelector('#auth-subtitle');

    signupTab?.classList.toggle('active', mode === 'signup');
    loginTab?.classList.toggle('active', mode === 'login');
    confirmField?.classList.toggle('auth-hidden', mode !== 'signup');

    if (title) title.textContent = mode === 'signup' ? 'Criar conta' : 'Entrar';
    if (subtitle) {
        subtitle.textContent = mode === 'signup'
            ? 'Cadastre seu explorador com e-mail, senha e uma continha rápida.'
            : 'Entre com o e-mail e senha da sua conta T.A.R.D.I.S.';
    }

    setLoading(false);
    await renderCaptcha();
};

const validateForm = () => {
    const email = modal.querySelector(SELECTORS.email)?.value.trim();
    const password = modal.querySelector(SELECTORS.password)?.value || '';
    const confirm = modal.querySelector(SELECTORS.confirm)?.value || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isSupabaseConfigured()) {
        throw new Error('Supabase ainda não foi configurado. Abra js/auth/supabaseConfig.js e cole a Project URL e a anon public key.');
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

    return { email, password };
};

const updateNavSession = (session) => {
    const user = session?.user || null;
    const email = user?.email || '';

    if (!navProfile) return;

    navProfile.classList.toggle('auth-logged-in', Boolean(user));
    navProfile.title = user ? `Logado como ${email}` : 'Entrar ou criar conta';

    if (navProfileIcon) navProfileIcon.textContent = user ? '🧑‍🚀' : '👤';
    if (navAuthLabel) navAuthLabel.textContent = user ? getEmailPreview(email) : 'Login';
};

const showAccountView = (session) => {
    const user = session?.user || null;
    formWrapper?.classList.toggle('auth-hidden', Boolean(user));
    accountCard?.classList.toggle('active', Boolean(user));

    if (accountEmail) accountEmail.textContent = user?.email || '';

    const title = modal?.querySelector('#auth-title');
    const subtitle = modal?.querySelector('#auth-subtitle');

    if (user) {
        if (title) title.textContent = 'Perfil';
        if (subtitle) subtitle.textContent = 'Sua sessão está ativa nesta aba.';
        clearMessage();
    } else {
        formWrapper?.classList.remove('auth-hidden');
        accountCard?.classList.remove('active');
    }
};

const openModal = async () => {
    modal?.classList.add('active');
    document.body.classList.add('auth-modal-open');

    const session = await getCurrentSession();
    updateNavSession(session);
    showAccountView(session);

    if (!session?.user) {
        await setMode(mode);
        setTimeout(() => modal?.querySelector(SELECTORS.email)?.focus(), 60);
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
        const { email, password } = validateForm();
        setLoading(true);

        const data = mode === 'signup'
            ? await signUpWithEmail({ email, password, captchaToken })
            : await signInWithEmail({ email, password, captchaToken });

        const session = data?.session || await getCurrentSession();

        if (mode === 'signup' && !session) {
            setMessage('Conta criada. Se a confirmação de e-mail estiver ativa no Supabase, confirme pelo link enviado antes de entrar.', 'success');
            await setMode('login');
            return;
        }

        updateNavSession(session);
        showAccountView(session);
        setMessage(mode === 'signup' ? 'Conta criada e login realizado com sucesso!' : 'Login realizado com sucesso!', 'success');
    } catch (error) {
        setMessage(error.message || 'Não foi possível concluir a autenticação.', 'error');
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
                    <p class="auth-subtitle" id="auth-subtitle">Cadastre seu explorador com e-mail, senha e uma continha rápida.</p>
                </div>
                <button class="auth-close" id="auth-close" type="button" aria-label="Fechar">✕</button>
            </header>

            <div class="auth-body">
                <div class="auth-account-card" id="auth-account-card">
                    <span class="auth-kicker">SESSÃO ATIVA</span>
                    <div class="auth-account-email" id="auth-account-email"></div>
                    <button class="auth-logout" id="auth-logout" type="button">SAIR DA CONTA</button>
                </div>

                <div class="auth-form-wrapper" id="auth-form-wrapper">
                    <div class="auth-tabs">
                        <button class="auth-tab active" id="auth-tab-signup" type="button">CADASTRO</button>
                        <button class="auth-tab" id="auth-tab-login" type="button">LOGIN</button>
                    </div>

                    <form class="auth-form" id="auth-form">
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
            </div>
        </section>
    `;

    document.body.appendChild(modal);

    form = modal.querySelector('#auth-form');
    messageBox = modal.querySelector('#auth-message');
    submitButton = modal.querySelector('#auth-submit');
    confirmField = modal.querySelector('#auth-confirm-field');
    accountCard = modal.querySelector('#auth-account-card');
    formWrapper = modal.querySelector('#auth-form-wrapper');
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
        label.textContent = 'Login';
        navProfile.appendChild(label);
    }

    navAuthLabel = navProfile.querySelector('.nav-auth-label');
    navProfile.addEventListener('click', openModal);
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

    if (!isSupabaseConfigured()) {
        console.info('[Auth] Supabase não configurado ainda. Preencha js/auth/supabaseConfig.js para ativar login/cadastro.');
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth, { once: true });
} else {
    initAuth();
}
