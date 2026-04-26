# Configuração do Supabase Auth — T.A.R.D.I.S.

Este projeto já possui a interface de **Cadastro/Login** no botão de perfil da navbar.
Para funcionar de verdade, você precisa conectar um projeto Supabase.

## 1. Criar projeto no Supabase

1. Acesse o Supabase.
2. Crie uma organização/projeto.
3. Guarde a senha do banco com segurança.
4. Espere o projeto terminar de provisionar.

## 2. Pegar as chaves públicas corretas

No dashboard do projeto:

1. Vá em **Project Settings > API**.
2. Copie:
   - **Project URL**
   - **anon public key**
3. Abra este arquivo no projeto:

```txt
js/auth/supabaseConfig.js
```

4. Substitua:

```js
url: 'COLE_AQUI_SUA_SUPABASE_PROJECT_URL',
anonKey: 'COLE_AQUI_SUA_SUPABASE_ANON_PUBLIC_KEY',
```

por seus valores reais.

Nunca cole a `service_role key` no front-end.

## 3. Cadastro com login automático

Para o usuário cadastrar e já entrar automaticamente:

1. Vá em **Authentication > Providers > Email**.
2. Deixe o login por e-mail/senha habilitado.
3. Desative a confirmação obrigatória de e-mail, se quiser login automático imediatamente.

Se a confirmação de e-mail estiver ativa, o Supabase pode criar a conta, mas não entregar uma sessão imediata. Nesse caso, o usuário precisa confirmar o e-mail antes de entrar.

## 4. Anti-spam real com CAPTCHA

O projeto já tem suporte a **Cloudflare Turnstile**.

### No Cloudflare Turnstile

1. Crie um widget Turnstile.
2. Adicione o domínio do seu site/Vercel.
3. Copie:
   - Site Key
   - Secret Key

### No Supabase

1. Vá em **Project Settings > Authentication**.
2. Procure **Bot and Abuse Protection / CAPTCHA protection**.
3. Ative CAPTCHA.
4. Escolha Cloudflare Turnstile.
5. Cole a **Secret Key**.
6. Salve.

### No projeto

Abra:

```txt
js/auth/supabaseConfig.js
```

E cole a **Site Key** aqui:

```js
turnstileSiteKey: 'SUA_SITE_KEY_AQUI',
```

A Secret Key nunca deve ir no código público.

## 5. Sessão: por que o usuário precisa logar de novo depois?

O projeto está configurado para manter a sessão só na aba atual do navegador usando `sessionStorage`.

Isso fica em:

```js
persistOnlyCurrentTab: true
```

Assim:

- cadastrou: entra automaticamente, se o Supabase permitir;
- recarregou a página na mesma aba: continua logado;
- fechou a aba/navegador e voltou depois: precisa logar novamente.

Se no futuro você quiser manter o usuário logado por mais tempo, troque para:

```js
persistOnlyCurrentTab: false
```

## 6. Tabelas futuras para conquistas

Para login/cadastro básico, você não precisa criar tabela manual: o Supabase Auth já cria os usuários internamente.

Para conquistas, ranking e progresso, vamos criar tabelas públicas com RLS em uma próxima etapa, por exemplo:

- `profiles`
- `user_achievements`
- `user_quiz_runs`
- `user_progress`

Deixei um arquivo inicial de SQL aqui:

```txt
docs/SUPABASE_SCHEMA_START.sql
```


## Verificação por continha simples

Nesta versão, o cadastro usa uma continha básica como verificação anti-spam, pensada para crianças e para uma experiência mais leve.

Para manter esse comportamento, deixe no arquivo `js/auth/supabaseConfig.js`:

```js
captchaMode: 'math',
turnstileSiteKey: '',
```

Não ative CAPTCHA obrigatório no painel do Supabase enquanto estiver usando apenas a continha local, porque o Supabase só valida CAPTCHA externo como Turnstile/hCaptcha quando essa proteção está ligada no dashboard.

No futuro, se o projeto crescer e começar a receber spam real, a gente pode combinar a continha com outras proteções, como confirmação de e-mail, limites por IP em uma API intermediária ou Turnstile em modo invisível/menos intrusivo.
