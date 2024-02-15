import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';
import { compare } from 'bcrypt';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByEmail) {
      throw new HttpException(
        'Email are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByUsername) {
      throw new HttpException(
        'Username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (createUserDto.role === 'ADMINISTRATOR' && createUserDto.boss) {
      throw new HttpException(
        'ADMINISTRATOR can`t have a boss',
        HttpStatus.CONFLICT,
      );
    }

    if (createUserDto.role === 'BOSS' && createUserDto.boss) {
      throw new HttpException('BOSS can`t have a boss', HttpStatus.CONFLICT);
    }

    if (createUserDto.role === 'REGULAR') {
      const bossChecking = await this.userRepository.findOne({
        where: { id: createUserDto.boss },
      });

      if (!bossChecking) {
        throw new HttpException(
          `User with id - ${createUserDto.boss} is not a boss or does not exist`,
          HttpStatus.CONFLICT,
        );
      }
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['password', 'id', 'username', 'email', 'role'],
    });

    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Wrong password',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    delete user.password;
    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async changeBoss(
    currentUserId: number,
    regularId: number,
    bossId: number,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: regularId },
      relations: ['boss'],
    });

    if (!user) {
      throw new HttpException(
        'Regular with this id does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.boss.id !== currentUserId) {
      throw new HttpException(
        'You are not the boss of this subordinate',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newBoss = await this.userRepository.findOne({
      where: { id: bossId },
    });
    if (!newBoss) {
      throw new HttpException(
        'Boss with id not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    user.boss = newBoss;
    return await this.userRepository.save(user);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  async buildUserAdminResponse(user: UserEntity) {
    const users = await this.userRepository.find();
    return {
      user: {
        ...user,
        usersList: users,
        token: this.generateJwt(user),
      },
    };
  }

  async buildUserBossResponse(user: UserEntity) {
    const users = await this.userRepository.find({
      where: { boss: user },
    });
    return {
      user: {
        ...user,
        subordinates: users,
        token: this.generateJwt(user),
      },
    };
  }

  async buildUserRegularResponse(user: UserEntity) {
    const userRes = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['boss'],
    });
    return {
      user: {
        ...userRes,
        token: this.generateJwt(user),
      },
    };
  }
}
