import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body('address') address: string, @Req() req) {
    return this.ordersService.createOrder(req.user.id, address);
  }

  @Get()
  findAll(@Req() req) {
    return this.ordersService.getUserOrders(req.user.id);
  }
}
