# Template: NestJS Resource (Controller + Service + DTO)

Implements standards from `references/backend/nestjs-architecture.md` and `references/backend/api-design.md`.

## When to Use

Creating a new feature module or resource in NestJS with DTO validation, thin controller orchestration, and isolated service logic.

## Template

### `create-order.dto.ts`

```ts
import { IsUUID, IsInt, Min } from "class-validator";

export class CreateOrderDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
```

### `orders.service.ts`

```ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./create-order.dto";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class OrdersService {
  constructor(private readonly db: DatabaseService) {}

  async create(userId: string, dto: CreateOrderDto) {
    return this.db.orders.create({ data: { ...dto, userId } });
  }

  async findOneForUser(id: string, userId: string) {
    const order = await this.db.orders.findFirst({ where: { id, userId } });
    if (!order) throw new NotFoundException("Order not found.");
    return order;
  }
}
```

### `orders.controller.ts`

```ts
import { Controller, Post, Get, Param, Body, UseGuards, ParseUUIDPipe } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./create-order.dto";
import { User } from "../users/user.entity";

@Controller("orders")
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get(":id")
  findOne(@CurrentUser() user: User, @Param("id", new ParseUUIDPipe()) id: string) {
    return this.ordersService.findOneForUser(id, user.id);
  }
}
```

## Adaptation Notes

- Confirm global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` is configured in `main.ts` (`nestjs-architecture.md`).
- Keep controllers thin: business logic belongs in the service, not the controller.
- Scope the service query by both order ID and authenticated user ID (or enforce an
  explicit privileged policy) so a valid UUID cannot bypass authorization.
- Replace `DatabaseService`, `AuthGuard`, and `CurrentUser` with the project's actual providers.
