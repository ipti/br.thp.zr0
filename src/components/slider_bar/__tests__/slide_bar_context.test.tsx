import { render, screen, act, fireEvent } from '@testing-library/react'
import { SlideBarProvider, useSlideBar } from '../slide_bar_context'

function createMatchMediaMock(initialMatches: boolean) {
  let matches = initialMatches
  let listener: ((e: MediaQueryListEvent) => void) | null = null

  const mql = {
    get matches() {
      return matches
    },
    media: '',
    onchange: null,
    addEventListener: jest.fn((event: string, cb: (e: MediaQueryListEvent) => void) => {
      if (event === 'change') listener = cb
    }),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }

  return {
    mql: mql as unknown as MediaQueryList,
    simulateChange: (next: boolean) => {
      matches = next
      act(() => {
        listener?.({ matches: next } as MediaQueryListEvent)
      })
    },
  }
}

function Probe() {
  const { isVisible, isMobile, toggleVisibility, setVisibility } = useSlideBar()
  return (
    <div>
      <span data-testid="visible">{String(isVisible)}</span>
      <span data-testid="mobile">{String(isMobile)}</span>
      <button onClick={toggleVisibility}>toggle</button>
      <button onClick={() => setVisibility(false)}>close</button>
    </div>
  )
}

describe('SlideBarProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('no desktop (matchMedia não corresponde), começa visível e isMobile=false', () => {
    const { mql } = createMatchMediaMock(false)
    jest.spyOn(window, 'matchMedia').mockReturnValue(mql)

    render(
      <SlideBarProvider>
        <Probe />
      </SlideBarProvider>
    )

    expect(screen.getByTestId('visible')).toHaveTextContent('true')
    expect(screen.getByTestId('mobile')).toHaveTextContent('false')
  })

  it('no mobile (matchMedia corresponde), começa fechado e isMobile=true', () => {
    const { mql } = createMatchMediaMock(true)
    jest.spyOn(window, 'matchMedia').mockReturnValue(mql)

    render(
      <SlideBarProvider>
        <Probe />
      </SlideBarProvider>
    )

    expect(screen.getByTestId('visible')).toHaveTextContent('false')
    expect(screen.getByTestId('mobile')).toHaveTextContent('true')
  })

  it('fecha automaticamente ao cruzar para o breakpoint mobile em tempo real', () => {
    const { mql, simulateChange } = createMatchMediaMock(false)
    jest.spyOn(window, 'matchMedia').mockReturnValue(mql)

    render(
      <SlideBarProvider>
        <Probe />
      </SlideBarProvider>
    )
    expect(screen.getByTestId('visible')).toHaveTextContent('true')

    simulateChange(true)

    expect(screen.getByTestId('visible')).toHaveTextContent('false')
    expect(screen.getByTestId('mobile')).toHaveTextContent('true')
  })

  it('toggleVisibility alterna isVisible', () => {
    const { mql } = createMatchMediaMock(false)
    jest.spyOn(window, 'matchMedia').mockReturnValue(mql)

    render(
      <SlideBarProvider>
        <Probe />
      </SlideBarProvider>
    )
    expect(screen.getByTestId('visible')).toHaveTextContent('true')

    fireEvent.click(screen.getByText('toggle'))
    expect(screen.getByTestId('visible')).toHaveTextContent('false')
  })
})
