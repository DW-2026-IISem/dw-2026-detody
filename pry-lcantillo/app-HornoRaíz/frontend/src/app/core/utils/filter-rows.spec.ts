import { filterRows } from './filter-rows';

describe('filterRows', () => {
  interface MockItem {
    id: number;
    name: string;
    email: string | null;
    phone?: string | null;
  }

  const items: MockItem[] = [
    { id: 1, name: 'Panadería Central', email: 'central@pan.com', phone: '3001112233' },
    { id: 2, name: 'Repostería La Delicia', email: 'delicia@pan.com', phone: null },
    { id: 3, name: 'Café del Norte', email: null, phone: '3009998877' },
  ];

  it('debe devolver una copia independiente sin filtrar cuando el término está vacío', () => {
    const result = filterRows(items, '', (item) => [item.name, item.email]);
    expect(result).toEqual(items);
    expect(result).not.toBe(items);
  });

  it('debe devolver una copia independiente cuando el término solo contiene espacios', () => {
    const result = filterRows(items, '   ', (item) => [item.name, item.email]);
    expect(result).toEqual(items);
  });

  it('debe filtrar ignorando mayúsculas y minúsculas', () => {
    const result = filterRows(items, 'DELICIA', (item) => [item.name, item.email]);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Repostería La Delicia');
  });

  it('debe manejar campos nulos y no definidos sin lanzar error', () => {
    const result = filterRows(items, 'norte', (item) => [item.name, item.email, item.phone]);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Café del Norte');
  });

  it('debe devolver un arreglo vacío cuando no existen coincidencias', () => {
    const result = filterRows(items, 'inexistente', (item) => [item.name, item.email]);
    expect(result.length).toBe(0);
  });
});
