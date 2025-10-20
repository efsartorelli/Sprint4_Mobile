# Sprint4_Mobile

# Access Events — React Native (Expo) + Supabase (REST)

Aplicativo mobile para **gestão de eventos de acesso** (pessoa, status, primeira_vez, event_time) com **CRUD completo**, **validações**, **tratamento de interrupções (retry/offline)**, **login com persistência (AsyncStorage)** e **navegação fluída**.

---

## 👥 Integrantes (preencher)
- NICOLAS BONI(R551965)
- ENZO SARTORELLI(RM94618)
- EDUARDO NISTAL(RM94524)
- KAUE PASTORI(RM98501)
- RODRIGO VIANA(551057)


## ✨ Funcionalidades do Aplicativo

- **Autenticação (local) com persistência**  
  - Tela de **Login** (email/senha) com **validação** (Zod).  
  - **Sessão persistida** em `AsyncStorage` (entra direto ao reabrir).  
  - **Logout** limpa a sessão e volta ao Login.  
  - *Observação:* autenticação local (fake) pronta para trocar por **Supabase Auth**.

- **CRUD completo (Supabase REST/PostgREST)**
  - **Listar** eventos com filtro por **pessoa**, ordenado por `event_time desc`.  
  - **Criar** evento (pessoa, status, primeira_vez, data/hora automática).  
  - **Editar** evento (campos principais).  
  - **Excluir** evento (diálogo de confirmação).  

- **Validação e feedback de erro**
  - Campos do formulário validados com **Zod** (ex.: “Pessoa é obrigatório”).  
  - Erros de rede/servidor exibem **mensagens claras** (status + detalhe).  
  - Ações com **“Tentar novamente”** quando algo falha.

- **Navegação e UX**
  - **Stack Navigation** entre Lista e Formulário.  
  - **Header “Sair”** para encerrar sessão.  
  - **Pull-to-refresh** na listagem.

- **Tratamento de interrupções**
  - **Retry automático** (React Query).  
  - **Refetch ao reconectar**.  
  - **Cache/persistência** dos dados com AsyncStorage (melhora uso offline).

---

## ▶️ Como Rodar
**instalar deps**
npm i
npx expo-doctor --fix

**desenvolvimento com Expo Go (online)**
npx expo start -c
**pressione "a" para abrir no Android**

**(alternativa se o Expo Go não abrir) Dev Client:**
npx expo run:android
npx expo start --dev-client -c

---

## 🧪 Testes Manuais (o que o avaliador confere)

Login: abrir app → tela de login → validar e entrar.

Persistência: fechar e reabrir → entra direto (sessão no AsyncStorage).

Listar: tela Eventos exibe dados reais do Supabase.

Buscar: digitar em “Buscar por pessoa” → filtra resultados.

Criar: “Novo” → preencher → “Criar” → volta à lista com novo item.

Editar: “Editar” → alterar → “Salvar alterações”.

Excluir: “Excluir” → confirmar → item removido.

Validação: tentar salvar sem “Pessoa” → mensagem clara.

Interrupções: desligar internet, tentar ação → erro claro + tentar novamente; ao reconectar, volta a funcionar.

Logout: botão Sair no header → volta ao Login.

