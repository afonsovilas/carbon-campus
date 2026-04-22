# Changelog

All notable changes to **CarbonCampus** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [v1.0.0] - Sprint 1 (2026-04-19)

### Added

- **US3** - Log Trip Screen: utilizador pode selecionar modo de transporte sustentável e inserir distância percorrida para registar uma deslocação.
- **US4** - Cálculo automático de CO2: a app calcula e mostra a quantidade de CO2 poupada ao registar uma viagem.
- **US5** - Dashboard de pontuação: o utilizador visualiza a sua pontuação total de CO2 poupado no ecrã principal.
- **US6 / US7** - Sistema de Invites: pesquisa de utilizadores por tag, envio e receção de pedidos de ligação/amizade.
- **US8 / US9** - Sistema de Desafios: criação de desafios com datas de início e fim, e convite de contactos da rede para participar.
- **US10** - Leaderboard: tabela classificativa ordenada por CO2/pontos acumulados, com modo bloqueado para utilizadores sem viagens registadas.
- **CI/CD Pipeline** (DevOps): workflow GitHub Actions que corre ESLint e todos os testes automaticamente em cada push/PR; build automático do APK Android em cada nova tag/release.
- **Testes de Aceitação (UAT)**: cenários Gherkin/Jest para US3 (LogTrip), US6/7 (Invites), US8/9 (Challenges), US10 (Rankings), e registo de conta.
- **Testes Unitários**: lógica de cálculo de pontos e CO2 poupado por modo de transporte (`co2.test.ts`).

### Fixed

- Botão de pesquisa no ecrã de Invites substituído por emoji `🔍` para compatibilidade com testes automatizados.
- Botão de convite nos Desafios substituído por emoji `✈️` para compatibilidade com testes automatizados.
- Mensagem de sucesso no registo de conta corrigida para `'Bem-vindo ao CarbonCampus!'` e navegação imediata para tabs.

### Changed

- `register.tsx`: navegação pós-registo passa a ser imediata (sem aguardar callback do Alert) para garantir compatibilidade com testes Jest.

---

## [v0.1.0] - Sprint 0 (2026-03-02)

### Added

- Setup do ambiente de desenvolvimento (React Native + Expo).
- Definição da Product Vision e arquitetura de alto nível.
- Protótipo funcional com Trip Logging e Friend Invite.
- Estrutura base de navegação (expo-router) e ecrãs principais.
- Domain Model e diagramas UML (Class, Package, Deployment).