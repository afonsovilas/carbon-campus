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

## Improvements

| ID | Improvement | Status | Evidence |
| --- | --- | --- | --- |
| IMP-001 | Added integration flow tests across Register, LogTrip, Invites, and Challenge | Verified | `__tests__/integration.functional-flows.test.tsx` |
| IMP-002 | Added UAT execution checklist for manual acceptance | Verified | `docs/testing/UAT.md` |
