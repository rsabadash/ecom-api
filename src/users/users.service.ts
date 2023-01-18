import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  GetUserParameters,
  IUser,
  IUserPublic,
} from './interfaces/users.interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { USERS_COLLECTION } from '../common/constants/collections.constants';
import { CompareFieldsService } from '../common/services/compare-fields.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(USERS_COLLECTION)
    private readonly usersCollection: ICollectionModel<IUser>,
  ) {}

  async getUsers(): Promise<IUserPublic[]> {
    return await this.usersCollection.find({}, { projection: { password: 0 } });
  }

  async getUser(parameters: GetUserParameters): Promise<IUserPublic> {
    const user = await this.usersCollection.findOne(
      { _id: parameters.userId },
      { projection: { password: 0 } },
    );

    if (!user) {
      throw new NotFoundException('The user has not been found');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.usersCollection.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUserPublic> {
    const isUserWithEmailExist = await this.getUserByEmail(createUserDto.email);

    if (isUserWithEmailExist) {
      throw new ConflictException('User with the email already exists');
    }

    const newUser = await this.usersCollection.create(createUserDto);

    if (!newUser) {
      throw new BadRequestException('The user has not been created');
    }

    return {
      _id: newUser._id,
      roles: newUser.roles,
      email: newUser.email,
    };
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<void> {
    const user = this.getUser({ userId: updateUserDto.id });

    if (!user) {
      throw new NotFoundException('The user has not been found');
    }

    const { _id, updatedFields } = this.compareFieldsService.compare<IUser>(
      updateUserDto,
      user,
    );

    const updateResult = await this.usersCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updateResult.isFound) {
      throw new BadRequestException('The user has not been updated');
    }
  }
}
