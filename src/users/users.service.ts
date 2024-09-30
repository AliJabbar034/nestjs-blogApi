import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { loginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('passw', createUserDto.password);

    const hashedPassword = await hash(createUserDto.password, 10);

    console.log('hasde', hashedPassword);

    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    console.log('users', users);

    if (users.length === 0) {
      throw new NotFoundException('No user  Found');
    }

    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('Invalid Id: No user Found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log('id', id, updateUserDto);

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('No User Found');
    }
    return this.userRepository.delete({ id: id });
  }

  async login(loginDto: loginUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });

    if (!user) {
      throw new NotFoundException('Invalid email  address');
    }

    const matchPassword = await compare(loginDto.password, user.password);
    if (!matchPassword) {
      throw new NotFoundException('Invalid email or password');
    }

    return user;
  }
}
