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
import { CacheService } from 'src/cache/cache.service'
import { filterPermissions } from 'src/utils/filterPermissions'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cacheService: CacheService,
  ) {}
  async createMenu(createMenuDto: CreateMenuDto) {
    try {
      await this.menuRepository.save(createMenuDto)
      return '菜单新增成功'
    } catch (error) {
      throw new ApiException('菜单新增失败', 20000)
    }
  }
  async getInfo(req): Promise<any> {
    //user.guard中注入的解析后的JWTtoken的user
    const { user } = req
    //根据关联关系通过user查询user下的菜单和角色
    const userList: User = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.menus', 'menu')
      .where({ id: user.sub })
      .orderBy('menu.order_num', 'ASC')
      .getOne()

    //是否为超级管理员,是的话查询所有菜单和权限
    const isAdmin = userList.roles?.find((item) => item.role_name === 'admin')
    let routers: Menu[] = []
    let permissions: string[] = []
    if (isAdmin) {
      routers = await this.menuRepository.find({
        order: {
          order_num: 'ASC',
        },
        where: {
          status: 1,
        },
      })
      //获取菜单所拥有的权限
      permissions = filterPermissions(routers)
      //存储当前用户的权限
      await this.cacheService.set(`${user.sub}_permissions`, permissions, null)
      return {
        routers: convertToTree(routers),
        permissions: permissions,
      }
    }
    interface MenuMap {
      [key: string]: Menu
    }
    // console.log(userList.roles[0].menus);

    //根据id去重
    const menus: MenuMap = userList?.roles.reduce(
      (mergedMenus: MenuMap, role: Role) => {
        role.menus.forEach((menu: Menu) => {
          mergedMenus[menu.id] = menu
        })
        return mergedMenus
      },
      {},
    )

    routers = Object.values(menus)
    permissions = filterPermissions(routers)
    await this.cacheService.set(`${user.sub}_permissions`, permissions, 7200)

    return {
      routers: convertToTree(routers),
      permissions,
    }
  }
}
