import '@testing-library/jest-dom'
import { server } from './src/test/msw/server'

if (typeof window.matchMedia !== 'function') {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

if (typeof window.ResizeObserver !== 'function') {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (typeof window.IntersectionObserver !== 'function') {
  // @ts-expect-error polyfill mínimo, suficiente para os componentes do PrimeReact usados nos testes
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
