# Defect Log and Verification

Track discovered defects, fixes, and verification status for the tested features.

## Legend

- Severity: Critical, High, Medium, Low
- Status: Open, In Progress, Fixed, Verified

## Defects

| ID | Feature | Defect | Severity | Status | Fix | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| DEF-001 | Register | Automated acceptance expected old success message and did not fill confirm password field, causing false failure | Medium | Verified | Updated acceptance test to include confirm password and current alert flow | `__tests__/register.test.tsx` passes |
| DEF-002 | Invites | Test depended on icon text `🔍`, but UI renders icon component without text | Medium | Verified | Added `testID=search-button` and updated acceptance test selector | `__tests__/invites.test.tsx` passes |
| DEF-003 | Challenge | Test depended on icon text `✈️` instead of stable selector | Medium | Verified | Added `testID=invite-btn` and updated acceptance test selector | `__tests__/challenge.test.tsx` passes |
| DEF-004 | Testability | Business rules were embedded in components, limiting unit-test coverage | Medium | Verified | Extracted shared rules to `utils/functional-requirements.ts` and reused in screens | Unit tests in `__tests__/unit.functional-requirements.test.ts` pass |
| DEF-005 | LogTrip tests | LogTrip started requiring `TripsProvider`, breaking tests rendered without context | High | Verified | Wrapped LogTrip acceptance/integration tests with `TripsProvider` | `__tests__/LogTripScreen.test.tsx` and `__tests__/integration.functional-flows.test.tsx` pass |
| DEF-006 | Test stability | Context seeding in tests triggered infinite re-render loops and OOM | High | Verified | Seed effects now run once in history/context unit tests | `__tests__/history.test.tsx` and `__tests__/unit.trips-context.test.tsx` pass |
| DEF-007 | Rankings test warning | `@expo/vector-icons` async update warning appears in ranking test output | Low | Open | Pending: stabilize icon rendering in tests (mock icon or wrap async icon state updates) | Warning still shown while tests pass |

## Improvements

| ID | Improvement | Status | Evidence |
| --- | --- | --- | --- |
| IMP-001 | Added integration flow tests across Register, LogTrip, Invites, and Challenge | Verified | `__tests__/integration.functional-flows.test.tsx` |
| IMP-002 | Added UAT execution checklist for manual acceptance | Verified | `docs/testing/UAT.md` |
| IMP-003 | Added acceptance tests for Login, Home, History, Reward, Register Trip, and bootstrap redirect | Verified | `__tests__/login.test.tsx`, `__tests__/home.test.tsx`, `__tests__/history.test.tsx`, `__tests__/rewardScreen.test.tsx`, `__tests__/register-trip.test.tsx`, `__tests__/index-redirect.test.tsx` |
| IMP-004 | Added unit tests for Trips context state management | Verified | `__tests__/unit.trips-context.test.tsx` |
