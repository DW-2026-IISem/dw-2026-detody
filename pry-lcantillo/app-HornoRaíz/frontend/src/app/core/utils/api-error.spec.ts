import { HttpErrorResponse } from '@angular/common/http';
import { toApiMessage } from './api-error';

describe('toApiMessage', () => {
  it('debe manejar errores nulos o indefinidos', () => {
    expect(toApiMessage(null)).toBe('Error desconocido');
    expect(toApiMessage(undefined)).toBe('Error desconocido');
  });

  it('debe extraer el mensaje cuando viene como arreglo de strings en HttpErrorResponse', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: ['El nombre es requerido', 'El correo no es válido'] },
      status: 400,
      statusText: 'Bad Request',
    });
    expect(toApiMessage(errorResponse)).toBe('El nombre es requerido, El correo no es válido');
  });

  it('debe avisar sobre fallo de conexión cuando status es 0', () => {
    const errorResponse = new HttpErrorResponse({
      error: null,
      status: 0,
      statusText: 'Unknown Error',
    });
    expect(toApiMessage(errorResponse)).toBe('No se pudo conectar con el servidor backend');
  });
});
