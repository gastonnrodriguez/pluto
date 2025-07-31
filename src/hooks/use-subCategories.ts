import { useEffect, useState } from "react"

export function useSubcategories(categoryId: string | null) {
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!categoryId) return

    setLoading(true)
    fetch(`/api/subcategories?categoryId=${categoryId}`)
      .then((res) => res.json())
      .then((data) => setSubcategories(data))
      .finally(() => setLoading(false))
  }, [categoryId])

  return { subcategories, loading }
}
