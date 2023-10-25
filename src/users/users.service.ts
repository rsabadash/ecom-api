import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  GoneException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ICollectionModel } from '../mongo/interfaces/colection-model.interfaces';
import {
  GetUserParameters,
  IUser,
  IUserCreate,
  IUserPublic,
  IUserUpdate,
} from './interfaces/users.interfaces';
import { InjectCollectionModel } from '../mongo/decorators/mongo.decorators';
import { USERS_COLLECTION } from '../common/constants/collections.constants';
import { CompareFieldsService } from '../common/services/compare-fields.service';
import { ERROR } from './constants/message.constants';

@Injectable()
export class UsersService {
  constructor(
    private readonly compareFieldsService: CompareFieldsService,
    @InjectCollectionModel(USERS_COLLECTION)
    private readonly usersCollection: ICollectionModel<IUser>,
  ) {}

  async getUsers(): Promise<IUserPublic[]> {
    return this.usersCollection.find({}, { projection: { password: 0 } });
  }

  async getUser(parameters: GetUserParameters): Promise<IUserPublic> {
    const user = await this.usersCollection.findOne(
      { _id: new ObjectId(parameters.userId) },
      { projection: { password: 0 } },
    );

    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    // No Found did not handle as in different scenarios it handled in a different way
    return this.usersCollection.findOne({ email });
  }

  async createUser(createUser: IUserCreate): Promise<IUserPublic> {
    const isUserWithEmailExist = await this.getUserByEmail(createUser.email);

    if (isUserWithEmailExist) {
      throw new ConflictException(ERROR.EMAIL_EXISTS);
    }

    const newUser = await this.usersCollection.create(createUser);

    if (!newUser) {
      throw new BadRequestException(ERROR.USER_NOT_CREATED);
    }

    return {
      _id: newUser._id,
      roles: newUser.roles,
      email: newUser.email,
    };
  }

  async updateUser(updateUser: IUserUpdate): Promise<void> {
    const user = await this.getUser({ userId: updateUser.id });

    if (updateUser.email) {
      const isUserWithEmailExists = await this.getUserByEmail(updateUser.email);

      if (isUserWithEmailExists) {
        throw new ConflictException(ERROR.EMAIL_EXISTS);
      }
    }

    const { _id, updatedFields } =
      this.compareFieldsService.compare<IUserPublic>(updateUser, user);

    const updateResult = await this.usersCollection.updateOne(
      { _id },
      updatedFields,
    );

    if (!updateResult.isUpdated) {
      throw new GoneException(ERROR.USER_NOT_UPDATED);
    }
  }
}
