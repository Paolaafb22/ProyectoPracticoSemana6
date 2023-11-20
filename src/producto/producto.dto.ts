/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
export class ProductoDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
