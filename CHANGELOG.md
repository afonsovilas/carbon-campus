# Changelog

All notable changes to **CarbonCampus** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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