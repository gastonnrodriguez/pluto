import { ExpenseForm } from "@/components/expense-form"

export default function DashboardPage() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <ExpenseForm />
      </div>
    </div>
  )
}
