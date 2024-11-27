import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { UserDocument} from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MongoDBUserRepository implements IUserRepository {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    const savedUser = await newUser.save();
    return this.mapToEntity(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user ? this.mapToEntity(user) : null;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { ...userData, updatedAt: new Date() },
      { new: true }
    );
    return this.mapToEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users.map(user => this.mapToEntity(user));
  }

  private mapToEntity(doc: any): User {
    return new User(
      doc._id.toString(),
      doc.email,
      doc.password,
      doc.name,
      doc.createdAt,
      doc.updatedAt
    );
  }
}

