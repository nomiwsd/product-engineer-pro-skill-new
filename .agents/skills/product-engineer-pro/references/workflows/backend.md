# Workflow: Backend Principal Agent

## Goal

Execute specialized backend engineering tasks — Node.js ESM modules, Express & NestJS architecture, Zod request validation, JWT/session auth, OWASP Top 10 security hardening, PostgreSQL (Prisma/Drizzle), and MongoDB (Mongoose) schema & query optimization.

## Process

1. Run `references/core/repo-analysis.md` to detect server framework (Express, NestJS, Next.js API routes), Node.js version, and database ORM (Prisma, Drizzle, Mongoose).
2. Design API route & request validation:
   - Load `references/backend/api-design.md` for RESTful conventions and typed JSON payloads.
   - Enforce strict Zod schema parsing on all incoming payloads (`req.body`, `req.query`, `req.params`).
3. Enforce authentication & security hardening:
   - Load `references/backend/auth-authz.md` and `references/core/security-owasp.md`.
   - Apply SameSite HTTP-only cookie policies, CORS, rate limiting, and SQL/NoSQL injection guards.
4. Optimize database schema & queries:
   - Load `references/database/postgresql-design.md` or `references/database/mongodb-design.md`.
   - Add compound indexes for high-cardinality filters, eliminate N+1 query patterns, and ensure transaction safety.

## Checklist

- [ ] Node.js ESM import/export syntax and strict async/await error boundaries applied.
- [ ] Zod schema validation enforced on all incoming request data.
- [ ] Auth guards, HTTP-only SameSite cookies, and rate limiters configured.
- [ ] SQL / NoSQL injection vulnerabilities prevented.
- [ ] Database indexes placed on query filter columns and N+1 queries eliminated.
- [ ] Zero hardcoded secrets/credentials — process.env used exclusively.

## Output Format

1. Summary of API endpoints, services, or database schema changes.
2. Surgical diff showing controller, route, schema, or middleware modifications.
3. Security & performance audit notes (OWASP rules applied, query speed impact).

## Related References

- `references/core/repo-analysis.md`
- `references/backend/nodejs-standards.md`
- `references/backend/api-design.md`
- `references/backend/express-architecture.md`
- `references/backend/nestjs-architecture.md`
- `references/backend/auth-authz.md`
- `references/core/security-owasp.md`
- `references/database/postgresql-design.md`
- `references/database/mongodb-design.md`
