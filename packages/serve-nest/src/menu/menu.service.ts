import { HttpStatus, Injectable } from '@nestjs/common'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Menu } from './entities/menu.entity'
import { Repository } from 'typeorm'
import { User } from '../user/entities/user.entity'
import { Role } from '../role/entities/role.entity'
import { ApiException } from '../common/filter/http-exception/api.exception'
import { convertToTree } from 'src/utils/convertToTree'

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
  async getRouters(req): Promise<Menu[]> {
    //user.guard中注入的解析后的JWToken的user
    const { user } = req
    console.log(user)

    //根据关联关系通过 user 查询 user 下的菜单和角色
    const userList: User = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.menus', 'menu')
      .where({ id: user.sub })
      .orderBy('menu.order_num', 'ASC')
      .getOne()

    console.log(userList)

    //是否为超级管理员,是的话查询所有菜单
    const isAdmin = userList.roles?.find((item) => item.role_name === 'admin')
    let routers: Menu[] = []

    if (isAdmin) {
      routers = await this.menuRepository.find({
        order: {
          order_num: 'ASC',
        },
        where: {
          status: 1,
        },
      })
      console.log(routers)
      return convertToTree(routers)
    }
    interface MenuMap {
      [key: string]: Menu
    }

    //根据id去重
    const menus: MenuMap = userList?.roles.reduce(
      (mergedMenus: MenuMap, role: any) => {
        role.menus.forEach((menu: Menu) => {
          mergedMenus[menu.id] = menu
        })
        return mergedMenus
      },
      {},
    )

    routers = Object.values(menus)

    return convertToTree(routers)
  }
}
