import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getMyCart(req.user.id);
  }

  @Get('total')
  getTotal(@Req() req) {
    return this.cartService.getTotal(req.user.id);
  }

  @Post()
  addToCart(
    @Body()
    body: {
      productId: string;
      quantity?: number;
      color?: string;
      size?: string;
    },
    @Req() req,
  ) {
    return this.cartService.addToCart(
      req.user.id,
      body.productId,
      body.quantity,
      body.color,
      body.size,
    );
  }

  // @Patch(':id')
  // updateQuantity(
  //   @Param('id') id: string,
  //   @Body('quantity') quantity: number,
  //   @Req() req,
  // ) {
  //   return this.cartService.updateQuantity(req.user.id, id, quantity); // Передаем userId
  // }

  @Delete('clear')
  async clear(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.cartService.removeItem(req.user.id, id);
  }

  @Patch(':id')
  updateItem(
    @Param('id') id: string,
    @Body() body: { quantity?: number; color?: string; size?: string },
    @Req() req,
  ) {
    return this.cartService.updateItem(req.user.id, id, body);
  }
}
