import { TestBed } from '@angular/core/testing';
import { DestroyRef } from '@angular/core';
import { watchMediaQuery } from './media-query';

describe('watchMediaQuery', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('debe crear un signal observable para la media query', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    TestBed.runInInjectionContext(() => {
      const isDesktop = watchMediaQuery('(min-width: 1024px)');
      expect(isDesktop()).toBe(true);
    });
  });

  it('debe registrar y responder a eventos de matchMedia', () => {
    let changeHandler: ((e: any) => void) | null = null;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((event: string, handler: any) => {
        if (event === 'change') changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
    }));

    TestBed.runInInjectionContext(() => {
      const signalMatch = watchMediaQuery('(min-width: 1024px)');
      expect(signalMatch()).toBe(false);

      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
        expect(signalMatch()).toBe(true);
      }
    });
  });

  it('debe remover el event listener al destruirse el contexto', () => {
    const removeListenerSpy = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: removeListenerSpy,
    }));

    let destroyFn: () => void = () => {};
    TestBed.runInInjectionContext(() => {
      const destroyRef = TestBed.inject(DestroyRef);
      vi.spyOn(destroyRef, 'onDestroy').mockImplementation((fn: () => void) => {
        destroyFn = fn;
        return () => {};
      });
      watchMediaQuery('(min-width: 1024px)');
    });

    destroyFn();
    expect(removeListenerSpy).toHaveBeenCalled();
  });
});
