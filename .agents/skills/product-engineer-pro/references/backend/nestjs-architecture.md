# NestJS Architecture

## Scope

Owns: module/dependency-injection structure, pipes/guards/interceptors/filters, DTO conventions, and NestJS 11+ architecture features.

Defers to: `nodejs-standards.md` for runtime-level conventions; `api-design.md` for REST conventions independent of the framework; `auth-authz.md` for guard-based authentication/authorization specifics; `typescript-standards.md` for general TS typing standards applied to DTOs.

## Version Matrix

> **Verify before relying on "Current" tier**: check `"@nestjs/core"` in `package.json`/lockfile — this matrix reflects known majors at authoring time.

| Version Range | Support Tier | Key Differences |
|---|---|---|
| NestJS 11.x | Current (Latest) | Express 5 default adapter, native SWC compiler (5x faster builds), Vitest default test runner, standalone apps (`NestFactory.create(AppController)`), `@nestjs/telemetry` OpenTelemetry support, ESM by default, JSON `ConsoleLogger` |
| NestJS 10.x | Supported | Standard decorators, stable module federation support, Node.js 16+ baseline, Express 4 / Fastify 4 adapters |
| NestJS 9.x & earlier | Legacy | Missing modern decorator/telemetry APIs — flag for upgrade in audits |

## Detection

Per `references/core/repo-analysis.md`: check `@nestjs/core` version and whether the underlying HTTP platform is Express (`@nestjs/platform-express`, default) or Fastify (`@nestjs/platform-fastify`).

## Standards

### Module Structure & Dependency Injection
- Organize by feature module (`UsersModule`, `OrdersModule`), each encapsulating its own controllers, services, and providers.
- Depend on abstractions (injected interfaces/tokens) when a provider has multiple swappable implementations; use direct class injection for single-implementation services.
- Use `forwardRef()` only to resolve unavoidable circular module dependencies — treat circular dependencies as a signal to refactor module boundaries first.
- Scope providers (`DEFAULT`, `REQUEST`, `TRANSIENT`) deliberately — `REQUEST`-scoped providers re-instantiate per request and carry a performance overhead.

### Controllers
- Keep controllers thin: parse/validate input via DTOs and decorators, delegate all business logic to injected services.
- One controller per resource/feature area, matching route grouping conventions in `api-design.md`.

### DTOs & Validation
- Define a DTO class per distinct input shape using `class-validator` and `class-transformer` decorators.
- Enable a global `ValidationPipe` with `whitelist: true` (strips unknown properties) and `forbidNonWhitelisted: true` (rejects requests containing unknown properties):
  ```ts
  export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
  }
  ```
- Separate DTOs (API contract) from database entities/models (persistence shape).

### Guards, Interceptors, Pipes, Filters Responsibility Split
- **Guards**: Authorization and authentication decisions only (`canActivate`) — return boolean or throw `UnauthorizedException`/`ForbiddenException`. Do not perform data mutation in a Guard.
- **Pipes**: Input validation and transformation (DTO validation, parsing route params like `ParseIntPipe`).
- **Interceptors**: Cross-cutting request/response lifecycle concerns — logging, response serialization/formatting, caching, timeout handling.
- **Exception Filters**: Centralize error-to-HTTP-response mapping:
  ```ts
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = exception.getStatus();
      response.status(status).json({
        error: {
          code: exception.name || 'HTTP_ERROR',
          message: exception.message,
        },
      });
    }
  }
  ```

### Testing Integration
- Use `@nestjs/testing`'s `Test.createTestingModule` to build an isolated testing module per suite, overriding only providers that need mocking.
- In NestJS 11+, leverage Vitest + SWC for fast, parallel unit and integration tests.

### Configuration
- Use `@nestjs/config` (`ConfigModule`/`ConfigService`) with a Zod or Joi validation schema to validate process environment variables at startup.

## Anti-Patterns

```ts
// Business logic embedded directly in the controller
@Post()
async create(@Body() body: any) { // no DTO, no validation!
  const existing = await this.db.query(`SELECT * FROM users WHERE email = '${body.email}'`);
  // ... business logic in controller + SQL injection risk!
}

// Authorization logic in an Interceptor instead of a Guard
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    if (!req.user) throw new UnauthorizedException(); // Belongs in a Guard!
    return next.handle();
  }
}

// Direct process.env access scattered across services
const apiKey = process.env.API_KEY; // Should go through ConfigService!
```

## Related References

- `references/backend/nodejs-standards.md`
- `references/backend/api-design.md`
- `references/backend/auth-authz.md`
- `references/frontend/typescript-standards.md`
- `references/core/security-owasp.md`

## Applies To Modes

- `implement`
- `debug`
- `security`
- `review`
- `refactor`
- `test`