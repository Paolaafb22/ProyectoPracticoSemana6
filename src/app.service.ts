import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Prueba practica Diseño y construcción de APIs semana 6!';
  }
}
