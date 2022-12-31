import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ type: String, unique: true })
  name: string;

  @Prop()
  age: number;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop([String])
  favoriteUnit: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
