import { useEffect, useState } from "react"

export function useCategories() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading }
}
