import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('wishlist')
@UseGuards(JwtAuthGuard) // Только авторизованные могут пользоваться избранным
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getMyWishlist(@Req() req) {
    // req.user берется из твоего JwtStrategy
    return this.wishlistService.getMyWishlist(req.user.id);
  }

  @Post(':productId')
  async toggle(@Param('productId') productId: string, @Req() req) {
    return this.wishlistService.toggleWishlist(req.user.id, productId);
  }

  @Delete()
  async clear(@Req() req) {
    return this.wishlistService.clearWishlist(req.user.id);
  }
}
