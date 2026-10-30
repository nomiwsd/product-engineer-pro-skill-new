# Benchmark Tasks

Full coding tasks scored with the weighted [rubric](../rubric.md). Every check in a task's
`case.json` is tagged with the rubric dimension it measures.

| Task | Workflow | Fixture | What it measures |
| --- | --- | --- | --- |
| [task-existing-feature](task-existing-feature/task.md) | `implement` | `orders-service` | A specified feature without changing existing contracts |
| [task-regression-fix](task-regression-fix/task.md) | `debug` | `orders-service` | Root-cause fix plus a regression test that fails on the original code |
| [task-security-repair](task-security-repair/task.md) | `security` | `orders-service` | An IDOR and an input-validation gap, fixed server-side |
| [task-version-adaptation](task-version-adaptation/task.md) | `frontend` | `next14-app`, `next16-app` | The same request on two Next.js majors; the right API for each |
| [task-multi-file-cancel](task-multi-file-cancel/task.md) | `implement` | `orders-service` | A feature across handlers, queries and reports with ownership, conflict and exclusion rules |
| [task-migration-rollback](task-migration-rollback/task.md) | `database` | `db-migrations` | A required column added safely during a rolling deploy, with a rollback |

The last two were added after the first run scored every condition 94–100 on the original four.

Hidden tests were validated before use: each fails on the original fixture (the contract test
passes, because it protects existing behavior) and passes on a reference fix.
