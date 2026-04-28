// ============================================
// T.A.R.D.I.S. — Auth Service
// Camada isolada para comunicação com Supabase Auth.
// ============================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_CONFIG, isSupabaseConfigured } from './supabaseConfig.js';

const storage = SUPABASE_CONFIG.persistOnlyCurrentTab ? window.sessionStorage : window.localStorage;

const normalizeEmail = (email = '') => email.trim().toLowerCase();

let cachedSession = null;

const SESSION_TIMEOUT_MS = 1800;

const withTimeout = (promise, timeoutMs = SESSION_TIMEOUT_MS, fallback = null) => {
    let timer = null;

    return Promise.race([
        promise,
        new Promise((resolve) => {
            timer = setTimeout(() => resolve(fallback), timeoutMs);
        })
    ]).finally(() => clearTimeout(timer));
};

const rememberSession = (session) => {
    cachedSession = session || null;
    return cachedSession;
};

const getStoredSessionSnapshot = () => {
    try {
        for (let index = 0; index < storage.length; index += 1) {
            const key = storage.key(index);
            if (!key || !key.startsWith('sb-') || !key.includes('auth-token')) continue;

            const parsed = JSON.parse(storage.getItem(key) || 'null');
            const session = parsed?.currentSession || parsed;
            if (session?.access_token && session?.user) {
                return session;
            }
        }
    } catch (_error) {
        // Se o storage estiver indisponível ou em formato inesperado, ignoramos com segurança.
    }

    return null;
};

const getSessionFallback = () => cachedSession || getStoredSessionSnapshot();

const isExistingAccountResponse = (data) => {
    const identities = data?.user?.identities;
    return Boolean(!data?.session && Array.isArray(identities) && identities.length === 0);
};

const isAlreadyRegisteredError = (error) => {
    const message = (error?.message || '').toLowerCase();
    return message.includes('already registered') ||
        message.includes('already exists') ||
        message.includes('user exists');
};

export const supabase = isSupabaseConfigured()
    ? createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            storage
        }
    })
    : null;

const ensureConfigured = () => {
    if (!supabase) {
        throw new Error('Supabase ainda não foi configurado. Preencha js/auth/supabaseConfig.js com Project URL e anon public key.');
    }
};

export const signUpWithEmail = async ({ email, password, explorerName = '', captchaToken = null }) => {
    ensureConfigured();

    const cleanEmail = normalizeEmail(email);
    const cleanExplorerName = explorerName.trim().replace(/\s+/g, ' ');

    const options = {
        emailRedirectTo: SUPABASE_CONFIG.authRedirectTo,
        data: {
            explorer_name: cleanExplorerName,
            display_name: cleanExplorerName
        }
    };

    if (captchaToken) options.captchaToken = captchaToken;

    const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options
    });

    if (error) {
        if (isAlreadyRegisteredError(error)) {
            throw new Error('Essa conta já existe. Use a aba Login para entrar com esse e-mail.');
        }

        throw error;
    }

    // O Supabase pode retornar user sem sessão/identities quando o e-mail já existe.
    // Cadastro não deve logar automaticamente em uma conta existente.
    if (isExistingAccountResponse(data)) {
        throw new Error('Essa conta já existe. Use a aba Login para continuar.');
    }

    rememberSession(data?.session || null);
    return data;
};

export const signInWithEmail = async ({ email, password, captchaToken = null }) => {
    ensureConfigured();

    const credentials = { email: normalizeEmail(email), password };
    if (captchaToken) credentials.options = { captchaToken };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    rememberSession(data?.session || null);
    return data;
};

export const resendSignupConfirmation = async ({ email }) => {
    ensureConfigured();

    const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: normalizeEmail(email),
        options: {
            emailRedirectTo: SUPABASE_CONFIG.authRedirectTo
        }
    });

    if (error) throw error;
    return data;
};

export const signOut = async () => {
    ensureConfigured();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    rememberSession(null);
};

export const getCurrentSession = async ({ timeoutMs = SESSION_TIMEOUT_MS } = {}) => {
    if (!supabase) return null;

    try {
        const result = await withTimeout(
            supabase.auth.getSession(),
            timeoutMs,
            { data: { session: getSessionFallback() }, error: null, timedOut: true }
        );

        if (result?.timedOut) {
            console.warn('[Auth] Recuperação de sessão demorou demais; usando sessão em cache.');
            return rememberSession(getSessionFallback());
        }

        const { data, error } = result || {};
        if (error) {
            console.warn('[Auth] Falha ao recuperar sessão:', error.message);
            return rememberSession(getSessionFallback());
        }

        return rememberSession(data?.session || null);
    } catch (error) {
        console.warn('[Auth] Falha inesperada ao recuperar sessão:', error?.message || error);
        return rememberSession(getSessionFallback());
    }
};

export const onAuthStateChange = (callback) => {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };

    return supabase.auth.onAuthStateChange((event, session) => {
        rememberSession(session || null);
        callback?.(event, session);
    });
};
