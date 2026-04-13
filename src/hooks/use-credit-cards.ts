// use-credit-cards.ts
import { useEffect, useState } from "react"

export function useCreditCards() {
  const [creditCards, setCreditCards] = useState<{ id: number; issuer: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/credit-cards") // endpoint de tu backend
      .then((res) => res.json())
      .then((data) => setCreditCards(data))
      .finally(() => setLoading(false))
  }, [])

  return { creditCards, loading }
}
