import { Component, type ReactNode } from 'react'

type GatewayErrorBoundaryProps = {
  children: ReactNode
  onError: () => void
}

type GatewayErrorBoundaryState = {
  hasError: boolean
}

export class GatewayErrorBoundary extends Component<GatewayErrorBoundaryProps, GatewayErrorBoundaryState> {
  constructor(props: GatewayErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}