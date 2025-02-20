import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { ApiException } from '../common/filter/http-exception/api.exception'
import { Repository, In } from 'typeorm'
import { Role } from './entities/role.entity'
import { Menu } from 'src/menu/entities/menu.entity'
import { ApiResponseCode } from 'src/common/enums/api-response-code.enum'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<string> {
    const row = await this.roleRepository.findOne({
      where: { role_name: createRoleDto.role_name },
    })
    if (row) {
      throw new ApiException('角色已存在', ApiResponseCode.COMMON_CODE)
    }
    const newRole = new Role()
    if (createRoleDto.menu_ids?.length) {
      //查询包含menu_ids的菜单列表
      const menuList = await this.menuRepository.find({
        where: {
          id: In(createRoleDto.menu_ids),
        },
      })
      //赋值给newRole(插入表中之后就会在关系表中生成对应关系)
      newRole.menus = menuList
    }
    try {
      await this.roleRepository.save({ ...createRoleDto, ...newRole })
      return 'success'
    } catch (error) {
      throw new ApiException('系统异常', ApiResponseCode.FAIL)
    }
  }

  findAll() {
    return `This action returns all role`
  }

  findOne(id: number) {
    return `This action returns a #${id} role`
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`
  }

  remove(id: number) {
    return `This action removes a #${id} role`
  }
}
