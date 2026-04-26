// ============================================
// T.A.R.D.I.S. — Auth Service
// Camada isolada para comunicação com Supabase Auth.
// ============================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_CONFIG, isSupabaseConfigured } from './supabaseConfig.js';

const storage = SUPABASE_CONFIG.persistOnlyCurrentTab ? window.sessionStorage : window.localStorage;

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
        email,
        password,
        options
    });

    if (error) throw error;
    return data;
};

export const signInWithEmail = async ({ email, password, captchaToken = null }) => {
    ensureConfigured();

    const credentials = { email, password };
    if (captchaToken) credentials.options = { captchaToken };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
};

export const signOut = async () => {
    ensureConfigured();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentSession = async () => {
    if (!supabase) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.warn('[Auth] Falha ao recuperar sessão:', error.message);
        return null;
    }
    return data?.session || null;
};

export const onAuthStateChange = (callback) => {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
};
