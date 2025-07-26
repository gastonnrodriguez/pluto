"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2 } from "lucide-react"

// Tipos
interface Subcategory {
	id: string
	name: string
	description: string
	category: string	
}

// Datos de ejemplo
const initialSubcategories: Subcategory[] = [
	{
		id: "1",
		name: "Supermercado",
		description: "Compras en supermercados",
		category: "Alimentación"		
	},
	{
		id: "2",
		name: "Restaurantes",
		description: "Comidas en restaurantes",
		category: "Alimentación"
  },
	{
		id: "3",
		name: "Delivery",
		description: "Pedidos a domicilio",
		category: "Alimentación"
	},
	{
		id: "4",
		name: "Combustible",
		description: "Gasolina y diésel",
		category: "Transporte"		
	},
	{
		id: "5",
		name: "Transporte público",
		description: "Bus, metro, taxi",
		category: "Transporte"		
	},
	{
		id: "6",
		name: "Cine",
		description: "Entradas de cine",
		category: "Entretenimiento"
	},
	{
		id: "7",
		name: "Streaming",
		description: "Netflix, Spotify, etc.",
		category: "Entretenimiento"
	},
	{
		id: "8",
		name: "Farmacia",
		description: "Medicamentos y productos",
		category: "Salud"
	},
]

const categoryColors: Record<string, string> = {
	Alimentación: "bg-green-100 text-green-800",
	Transporte: "bg-blue-100 text-blue-800",
	Entretenimiento: "bg-purple-100 text-purple-800",
	Salud: "bg-red-100 text-red-800",
}

export default function SubcategoriesTable() {
	const [search, setSearch] = useState("")
	const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)

	// Filtro simple
	const filtered = subcategories.filter(
		(sub) =>
			sub.name.toLowerCase().includes(search.toLowerCase()) ||
			sub.description.toLowerCase().includes(search.toLowerCase()) ||
			sub.category.toLowerCase().includes(search.toLowerCase())
	)

	const handleAdd = () => {
		setEditingSubcategory(null)
		setDialogOpen(true)
	}

	const handleEdit = (subcategory: Subcategory) => {
		setEditingSubcategory(subcategory)
		setDialogOpen(true)
	}

	const handleSave = (data: { name: string; description: string; category: string }) => {
		if (editingSubcategory) {
			setSubcategories((subs) =>
				subs.map((s) =>
					s.id === editingSubcategory.id ? { ...s, ...data } : s
				)
			)
		} else {
			setSubcategories([
				...subcategories,
				{ id: Date.now().toString(), ...data},
			])
		}
		setEditingSubcategory(null)
		setDialogOpen(false)
	}

	const handleDelete = (id: string) => {
		if (window.confirm("¿Eliminar subcategoría?"))
			setSubcategories((subs) => subs.filter((s) => s.id !== id))
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Subcategorías</h1>
					<p className="text-muted-foreground">
						Gestiona las subcategorías para una mejor organización
					</p>
				</div>
				<Button className="sm:w-auto" onClick={handleAdd}>
					<Plus className="mr-2 h-4 w-4" />
					Nueva Subcategoría
				</Button>
			</div>
			{/* Buscador */}
			<div className="flex items-center gap-3 max-w-sm">
				<Input
					placeholder="Buscar subcategoría..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full"
				/>
			</div>
			{/* Tabla */}
			<div className="overflow-x-auto rounded-lg shadow max-w-full">
				<table className="min-w-full bg-background text-sm border border-muted">
					<thead>
						<tr>
							<th className="px-4 py-3 border-b font-medium text-left">
								Nombre
							</th>
							<th className="px-4 py-3 border-b font-medium text-left hidden sm:table-cell">
								Descripción
							</th>
							<th className="px-4 py-3 border-b font-medium text-left hidden sm:table-cell">
								Categoría
							</th>
							<th className="px-4 py-3 border-b font-medium text-center">
								Acciones
							</th>
						</tr>
					</thead>
					<tbody>
						{filtered.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="px-4 py-8 text-center text-muted-foreground"
								>
									No hay subcategorías que coincidan.
								</td>
							</tr>
						)}
						{filtered.map((sub) => (
							<tr
								key={sub.id}
								className="border-b hover:bg-muted/60"
							>
								<td className="px-4 py-3 truncate max-w-[120px]">
									{sub.name}
								</td>
								<td className="px-4 py-3 hidden sm:table-cell truncate max-w-[200px]">
									{sub.description}
								</td>
								<td className="px-4 py-3 hidden sm:table-cell">
									<span
										className={`rounded px-2 py-1 text-xs font-medium ${
											categoryColors[sub.category] || ""
										}`}
									>
										{sub.category}
									</span>
								</td>
								<td className="px-4 py-3 text-center">
									<div className="flex justify-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
											onClick={() => handleEdit(sub)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-destructive"
											onClick={() => handleDelete(sub.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/* Modal reutilizable (puedes crear un DialogFormSubcategory similar al de categorías) */}
			{/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogFormSubcategory
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            initialData={
              editingSubcategory
                ? { name: editingSubcategory.name, description: editingSubcategory.description, category: editingSubcategory.category }
                : undefined
            }
            onSave={handleSave}
            isEdit={!!editingSubcategory}
          />
        </DialogContent>
      </Dialog> */}
		</div>
	)
}
