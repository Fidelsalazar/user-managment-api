import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { Model } from "mongoose";
import { ITrazaRepository } from "src/domain/repositories/traza.repository.interface";
import { Traza } from "../schemas/traza.schema";

@Injectable()
export class MongoUserTrazaRepository implements ITrazaRepository {
    constructor(
        @InjectModel(Traza.name)
        private readonly trazaModel: Model<UserDocument>
    ) {}


    async updateLastLogout(userId: string): Promise<void> {
        await this.trazaModel.create({
            userId,
            tipo: 'LOGOUT',
            fecha: new Date(),
            descripcion: 'Usuario cerró sesión'
        });
    }
}
