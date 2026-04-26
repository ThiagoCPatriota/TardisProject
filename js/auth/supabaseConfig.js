// ============================================
// T.A.R.D.I.S. — Supabase Auth Configuration
// ============================================
// COMO CONFIGURAR:
// 1) Crie um projeto no Supabase.
// 2) Vá em Project Settings > API.
// 3) Copie Project URL e anon public key.
// 4) Cole abaixo.
//
// IMPORTANTE:
// - A anon public key pode ficar no front-end quando as regras/RLS estão corretas.
// - NUNCA coloque service_role key em arquivo público do site.
// - A verificação padrão do projeto é uma continha simples, pensada para crianças.

export const SUPABASE_CONFIG = {
    url: 'https://ivdptxkqvawjstprlxlm.supabase.co',
    anonKey: 'sb_publishable_tkwZDIhC0ABw0NwFXxcFNw_0bYI-QWQ',

    // Verificação anti-spam simples para crianças.
    // Use 'math' para manter a continha básica no cadastro.
    // Futuramente, se quiser reativar Turnstile, troque para 'turnstile' e preencha a site key.
    captchaMode: 'math',
    turnstileSiteKey: '',

    // Mantém login só durante a aba/sessão do navegador.
    // Assim, ao fechar e acessar novamente, o usuário precisa logar de novo.
    persistOnlyCurrentTab: true,

    authRedirectTo: `${window.location.origin}${window.location.pathname}`
};

export const isSupabaseConfigured = () => {
    return Boolean(
        SUPABASE_CONFIG.url &&
        SUPABASE_CONFIG.anonKey &&
        !SUPABASE_CONFIG.url.includes('COLE_AQUI') &&
        !SUPABASE_CONFIG.anonKey.includes('COLE_AQUI')
    );
};

export const isMathCaptchaEnabled = () => SUPABASE_CONFIG.captchaMode !== 'turnstile';

export const isTurnstileConfigured = () => {
    return Boolean(
        SUPABASE_CONFIG.captchaMode === 'turnstile' &&
        SUPABASE_CONFIG.turnstileSiteKey &&
        SUPABASE_CONFIG.turnstileSiteKey.trim().length > 0
    );
};
