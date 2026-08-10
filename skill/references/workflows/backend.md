# Workflow: Backend

## Goal

Plan, build, diagnose, or review Node.js, Express, and NestJS services while
matching the repository's module system, framework conventions, validation
library, transport, persistence layer, and error contract.

## Process

1. Detect Node/framework versions, ESM or CommonJS, HTTP adapter, validation
   convention, auth boundary, persistence layer, and test runner.
2. Define the request/response contract and failure behavior before editing.
3. Validate body, path, query, headers, and environment input at their boundary
   using the repository's established convention. Zod, Joi, express-validator,
   Nest DTO pipes, or another existing validator are all acceptable.
4. Authenticate and authorize independently. Derive ownership from trusted
   server-side identity and scope every resource read/write accordingly.
5. Keep transport/controller code thin and business behavior testable.
6. Preserve the repository's module format. Do not introduce ESM, CommonJS,
   Zod, an ORM, or a framework migration as an incidental change.
7. Verify with available type checks, focused tests, lint, and a representative
   request when the host permits execution. In read-only mode, name the exact
   checks the builder should run.

## References

- Node runtime: `references/backend/nodejs-standards.md`
- Express: `references/backend/express-architecture.md`
- NestJS: `references/backend/nestjs-architecture.md`
- API contracts: `references/backend/api-design.md`
- Authentication/authorization: `references/backend/auth-authz.md`
- Security: `references/core/security-owasp.md`
- PostgreSQL/MongoDB: load only the detected database reference

## Checklist

- [ ] Installed versions, module system, and established conventions detected
- [ ] Every untrusted boundary is parsed and validated
- [ ] Authentication and resource-level authorization are both enforced
- [ ] Error responses match the existing public contract
- [ ] Persistence calls are parameterized/scoped and transactions are deliberate
- [ ] Relevant checks ran, or a read-only verification plan is provided

## Output

Lead with the implemented contract/change in build lifecycle, a decision-complete
file-level plan in plan lifecycle, or evidence-backed findings in review lifecycle.
