# Sprint Planning and Retrospectives - Team T5

## Sprint 0 (Start: 23-Feb | End: 02-Mar)

### 1) Sprint Planning

**Goal:** Establish project foundations, define the Product Vision, and release a Vertical Prototype (Increment #0).

**Selected PBIs:**
- Environmental setup (React Native + Expo)
- Definition of Product Vision and high-level architecture
- Implementation of core Eco-Trip Logging (`US2`)

### 2) Sprint Retrospective

**Did well:**
- **Development velocity:** The team was highly motivated, completing the foundational UI and core logging logic much faster than anticipated.
- **Collaboration:** Effective communication regarding the project's vision and domain model.
- **Environment setup:** Successfully configured the development environment for all team members.

**Do differently:**
- **Scope management:** We over-implemented features during Sprint 0. For Sprint 1, we must focus on the Definition of Ready (DoR) and ensure work is distributed across the planned timeline to follow the incremental evaluation model.
- **Git workflow:** We encountered issues with branch management (e.g., stashing specific test files). We need to improve our use of feature branches and commit isolation.

**Puzzles:**
- **Automated GPS tracking:** We are still debating whether to rely on manual user input for trips or implement real-time GPS tracking for CO2 calculations.
- **Leaderboard scalability:** How to effectively rank large numbers of students without affecting app performance.

**Action points / improvements for Sprint 1:**
- **Testing first:** Prioritize writing User Acceptance Tests (UAT) and unit tests for the features already built.
- **Document tracking:** Start formal logging of bugs and defects found during testing.

## Sprint 1 (Start: 02-Mar | End: 19-Apr)

### 1) Sprint Planning

**Goal:** Deliver a working product increment (v1.0.0) with the core social features (Invites, Challenges) and establish a solid DevOps foundation.

**Velocity (Yesterday's Weather):** Sprint 0 over-delivered. Sprint 1 capacity adjusted to ~40 story points.

**Selected PBIs (moved to Sprint Backlog):**

| ID | User Story | Story Points |
|---|---|---|
| US3 | Log a sustainable trip (transport + distance) | 20 |
| US4 | Automatic CO2 calculation & display | 5 |
| US5 | CO2 score dashboard | 3 |
| US6 | Search users by email/tag | 5 |
| US7 | Accept/reject invite | 5 |
| US8 | Create challenge with dates | 5 |
| US9 | Invite contacts to challenge | 5 |
| US10 | Leaderboard (locked until first trip) | 8 |

**Definition of Ready (DoR) checklist per US:**
- [x] Mockup attached (Figma link or screenshot in Issue)
- [x] Acceptance criteria in Gherkin (Given/When/Then) in Issue description
- [x] Who/What/Why description
- [x] Technical tasks decomposed (1–3 days each)
- [x] MisterAI label applied where AI was used

### 2) Sprint Retrospective

**Did well:**
- All planned User Stories delivered and tested.
- CI/CD pipeline fully operational (ESLint + Jest + APK build).
- Acceptance tests written for every US before implementation.
- Feature branches used consistently; no direct pushes to main.

**Do differently:**
- **Earlier PR reviews:** Some PRs waited 2+ days for review. In Sprint 2 we adopt a 24h review SLA.
- **Bug tracking:** Bug issues were created after the fact. In Sprint 2, bugs are logged as GitHub Issues the moment they are found.

**Puzzles:**
- **GPS vs. manual input:** Still debating real-time GPS tracking. Leaning towards manual input for Sprint 2 due to battery/privacy concerns.
- **Backend persistence:** Current data is in-memory only. Sprint 2 must introduce a persistent storage solution.

**Action points for Sprint 2:**
- Add persistent storage (AsyncStorage or lightweight backend).
- Implement real US registration flow (replace mock with actual auth).
- Continue logging all defects as GitHub Issues with `bug` label and screenshots.