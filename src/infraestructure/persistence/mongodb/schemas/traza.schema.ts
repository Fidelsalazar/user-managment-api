import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Traza {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true, enum: ['LOGIN', 'LOGOUT', 'REGISTER'] })
    tipo: string;

    @Prop({ required: true, default: Date.now })
    fecha: Date;

    @Prop({ required: true })
    descripcion: string;
}

export const TrazaSchema = SchemaFactory.createForClass(Traza);
export type TrazaDocument = Traza & Document;
