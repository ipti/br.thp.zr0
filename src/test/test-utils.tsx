import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCartStore } from '@/service/store/cart_store'
import { useCartStepsStore } from '@/app/cart/zustand/zustand'
import { useProductionOrderStore } from '@/app/production-order/zustand/zustand'

function AllProviders({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

/**
 * Reseta as duas stores Zustand (carrinho e encomenda) e o localStorage
 * entre testes, garantindo isolamento total entre os dois fluxos.
 */
export function resetAllStores() {
  localStorage.clear()
  useCartStore.setState({ cart: [] })
  useCartStepsStore.setState({
    cartSteps: { cep: '', address_selected: undefined, product_selected: undefined },
  })
  useProductionOrderStore.setState({ productionOrder: {} })
}

export * from '@testing-library/react'
