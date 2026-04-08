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
