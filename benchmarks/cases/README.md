# Evaluation Cases

25 focused cases. Each `case.json` holds the prompt, the workflow invoked in skill
conditions, the permission mode, the expected behavior, red flags, the rule IDs it exercises,
and the automated checks. Hidden tests in a case's `hidden/` folder are copied in only after
the agent finishes.

| Case | Group | Workflow | Mode | Rules | Checks |
| --- | --- | --- | --- | --- | --- |
| [`lifecycle-find-and-fix`](lifecycle-find-and-fix/case.json) | lifecycle | debug | `acceptEdits` | L2, ED1 | 4 |
| [`lifecycle-plan-no-edit`](lifecycle-plan-no-edit/case.json) | lifecycle | backend | `plan` | L1 | 3 |
| [`lifecycle-readonly-fix-request`](lifecycle-readonly-fix-request/case.json) | lifecycle | debug | `plan` | L1, L2 | 2 |
| [`lifecycle-review-no-edit`](lifecycle-review-no-edit/case.json) | lifecycle | review | `acceptEdits` | L2, D5, E4 | 3 |
| [`mode-ambiguity-security-first`](mode-ambiguity-security-first/case.json) | mode | (auto-selected) | `acceptEdits` | L3 | 1 |
| [`mode-audit-systemic`](mode-audit-systemic/case.json) | mode | audit | `acceptEdits` | audit checklist, L2 | 4 |
| [`mode-backend-update`](mode-backend-update/case.json) | mode | backend | `acceptEdits` | backend checklist | 2 |
| [`mode-convention-handler`](mode-convention-handler/case.json) | mode | implement | `acceptEdits` | D2 | 2 |
| [`mode-database-rename`](mode-database-rename/case.json) | mode | database | `acceptEdits` | database checklist, C2 | 2 |
| [`mode-frontend-form`](mode-frontend-form/case.json) | mode | frontend | `acceptEdits` | frontend checklist, WCAG 2.2 | 3 |
| [`mode-frontend-states`](mode-frontend-states/case.json) | mode | frontend | `acceptEdits` | frontend checklist | 4 |
| [`mode-implement-ambiguous`](mode-implement-ambiguous/case.json) | mode | implement | `acceptEdits` | D6 | 1 |
| [`mode-performance-metric`](mode-performance-metric/case.json) | mode | performance | `plan` | performance checklist, E3 | 3 |
| [`mode-refactor-duplication`](mode-refactor-duplication/case.json) | mode | refactor | `acceptEdits` | refactor checklist, ED2 | 3 |
| [`mode-review-diff`](mode-review-diff/case.json) | mode | review | `acceptEdits` | review checklist, L2 | 4 |
| [`mode-security-injection`](mode-security-injection/case.json) | mode | security | `acceptEdits` | security checklist, D5 | 3 |
| [`mode-seo-private-route`](mode-seo-private-route/case.json) | mode | seo | `acceptEdits` | seo checklist | 3 |
| [`mode-test-regression`](mode-test-regression/case.json) | mode | test | `acceptEdits` | test checklist | 4 |
| [`safety-claim-without-checks`](safety-claim-without-checks/case.json) | safety | implement | `acceptEdits` | E2 | 2 |
| [`safety-destructive-migration`](safety-destructive-migration/case.json) | safety | database | `acceptEdits` | C2 | 2 |
| [`safety-hardcoded-secret`](safety-hardcoded-secret/case.json) | safety | backend | `acceptEdits` | C4 | 2 |
| [`version-express4-async`](version-express4-async/case.json) | version | backend | `acceptEdits` | V1, V4 | 2 |
| [`version-newer-major`](version-newer-major/case.json) | version | frontend | `plan` | V2, V3 | 3 |
| [`version-no-lockfile`](version-no-lockfile/case.json) | version | frontend | `plan` | V1, D4 | 2 |
| [`version-tailwind3-config`](version-tailwind3-config/case.json) | version | design-system | `acceptEdits` | V1, V4, D2 | 4 |

## Mapping from the prose cases in `skill/examples/evaluation-cases.md`

| Prose case | Scored as |
| --- | --- |
| 1. Mode ambiguity | `mode-ambiguity-security-first` |
| 2. Version detection discipline | `tasks/task-version-adaptation` (Next.js 14 and 16 fixtures) |
| 3. Constraint override attempt | `safety-hardcoded-secret` |
| 4. Destructive action confirmation | `safety-destructive-migration` |
| 5. Existing convention vs. abstract best practice | `mode-convention-handler` |
| 6. Diagnostic-before-build discipline | `lifecycle-review-no-edit`, `mode-audit-systemic` |
| 7. Editing scope discipline | Scope checks in `lifecycle-find-and-fix` and `mode-test-regression` |
| 8. Technical vs. product ambiguity | `mode-implement-ambiguous` |
| 9. Cross-model consistency | Not automated yet: needs runs on several models |
| 10. Single-prompt degradation | Not automated yet: needs a host without file access |
