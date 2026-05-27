# Changelog

All notable changes to **CarbonCampus** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [v1.2.0] - Sprint 3 (2026-05-27)

### Added

- **Trip Tracking Core** - novas utilidades em `utils/trip-tracking.ts` e dados de suporte em `utils/gtfs-data.ts`.
- **GTFS Dataset** - ficheiros de dados em `docs/GTFS_data/routes.txt` e `docs/GTFS_data/stops.txt`.
- **Trip Tracking Context** - novo estado partilhado em `contexts/TripTrackingContext.tsx`.
- **Tracking Tests** - novos testes em `__tests__/log-trip-tracking.test.tsx` e `__tests__/trip-tracking.test.ts`.

### Changed

- **Log Trip Flow** - melhorias em `app/(tabs)/LogTripScreen.tsx` e `app/register-trip.tsx`.
- **History Screen** - ajustes em `app/(tabs)/history.tsx`.
- **Test Setup** - atualizações em `jest.setup.ts` e `__tests__/unit.trips-context.test.tsx`.
- **Dependencies** - atualização de `package.json` e `package-lock.json`.

---

## [v1.1.0] - Sprint 2 (2026-05-12)

### Added

- **Firebase Integration** - configuração do Firebase com Firestore e Auth, incluindo suporte a variáveis de ambiente e Emulator Suite.
- **Authentication** - serviços de registo, login, logout e monitorização do estado da sessão com Firebase Auth.
- **Persistence / User Profiles** - persistência de perfis de utilizador no Firestore, com sincronização do perfil público e pesquisa por tag.
- **Persistence / Trips** - gravação e leitura de viagens na cloud, com atualização automática de pontos do utilizador.
- **Persistence / Invites** - envio e registo de friend requests no Firestore.
- **Persistence / Challenges** - criação, listagem e envio de convites para desafios com armazenamento na cloud.
- **Leaderboard** - agregação do ranking a partir dos dados do Firestore, com classificação de estudantes e cursos.
- **Documentation** - adição de `docs/firebase-setup.md` com instruções de configuração local e uso do emulador.
- **Testing & Stability** - reforço dos testes de integração, unitários e acceptance para suportar o novo backend e os fluxos da app.

### Fixed

- **Firebase / Emulator** - suporte melhorado para execução local em web, Android emulator, iOS simulator e dispositivo físico.
- **Auth Session Cleanup** - limpeza da sessão Firebase no web após logout.
- **Leaderboard Consistency** - uso das entradas públicas do leaderboard como fonte de verdade para pontos.

---

## [v1.0.0] - Sprint 1 (2026-04-22)

### Added

- **Features & UI / US11** - Wide Tab Navigation (Side Drawer): implementação de menu lateral deslizante com animações spring para navegação principal.
- **Features & UI** - Manage Accounts & Profile: criação do ecrã de perfil (`app/profile.tsx`) e integração com o `UserContext`.
- **Features & UI** - Authentication Flow: implementação de Log Out com alerta de confirmação e redirecionamento para login.
- **Features & UI** - Leaderboard & Rankings: novo ecrã de classificações (`app/(tabs)/rankings.tsx`) e lógica de visualização de progresso.
- **Features & UI** - CO2 Tracker: implementação inicial da lógica de cálculo de emissões de CO2 baseada no histórico de viagens.
- **Testing (8%)** - Coverage global reportada de 94.6%.
- **Testing (8%)** - Acceptance tests para US11 em `__tests__/SideDrawer.test.tsx` e `__tests__/ProfileButton.test.tsx`, focados em interações de utilizador.
- **Testing (8%)** - Integration tests com fluxos funcionais completos em `__tests__/integration.functional-flows.test.tsx`.
- **Testing (8%)** - Unit tests para requisitos funcionais e gestão de contexto em `__tests__/unit.functional-requirements.test.ts` e `__tests__/unit.trips-context.test.tsx`.
- **DevOps & CI/CD (4%)** - Automated CI com GitHub Actions para Linter e Testes por Pull Request (`.github/workflows/ci.yml`).
- **DevOps & CI/CD (4%)** - Automated Release para geração de APK em cada tag/release (`.github/workflows/build-apk-on-tag.yml`).
- **DevOps & CI/CD (4%)** - Configuração e estabilização do ambiente de desenvolvimento em WSL (Ubuntu) integrado com WebStorm.
- **Documentation & Management** - Atualização de `SprintPlanningRetrospectives.md` com decisões da equipa e análise de WiP.
- **Documentation & Management** - Criação de `docs/testing/UAT.md` e `docs/testing/defect-log.md` para registo de testes, bugs e correções.
- **Documentation & Management** - Tarefas com apoio de IA identificadas através da label MisterAI nas Issues.

### Fixed

- **Test Environment** - Resolvido erro de "out-of-scope variables" no Jest com prefixo `mock` nas variáveis de hoisting.
- **React State Updates** - Corrigido aviso `act(...)` em testes assíncronos de componentes de UI.
- **Visual Repairs** - Correção de erros de renderização em botões do Dashboard e histórico de viagens.

---

## [v0.1.0] - Sprint 0 (2026-03-02)

### Added

- Setup do ambiente de desenvolvimento (React Native + Expo).
- Definição da Product Vision e arquitetura de alto nível.
- Protótipo funcional com Trip Logging e Friend Invite.
- Estrutura base de navegação (expo-router) e ecrãs principais.
- Domain Model e diagramas UML (Class, Package, Deployment).