import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Menu } from './entities/menu.entity'
import { Repository } from 'typeorm'
import { User } from '../user/entities/user.entity'
import { ApiException } from '../common/filter/http-exception/api.exception'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async createMenu(createMenuDto: CreateMenuDto) {
    try {
      await this.menuRepository.save(createMenuDto)
      return '菜单新增成功'
    } catch (error) {
      throw new ApiException('菜单新增失败', 20000)
    }
  }
}
