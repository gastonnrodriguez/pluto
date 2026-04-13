import { ExpenseForm } from "@/components/expense-form"

export default function NewExpensePage() {
  return (
    <div className="flex justify-center py-4">
      <div className="w-full max-w-xl">
        <ExpenseForm />
      </div>
    </div>
  )
}
