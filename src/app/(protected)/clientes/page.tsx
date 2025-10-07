"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, MapPin, Phone, Plus, Search, Trash2 } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

interface Client {
  _id?: string
  nome: string
  telefone: string
  endereco: string
  createdAt?: string
}

const ClientCardSkeleton = () => (
  <Card className="bg-card border-border">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center justify-between">
        <div className="h-6 bg-muted animate-pulse rounded w-32" />
        <div className="flex gap-1">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-muted-foreground" />
        <div className="h-4 bg-muted animate-pulse rounded w-28" />
      </div>
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
        <div className="h-4 bg-muted animate-pulse rounded w-48" />
      </div>
    </CardContent>
  </Card>
)

const StatCardSkeleton = () => (
  <Card className="bg-card border-border">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-muted animate-pulse rounded w-24 mb-2" />
          <div className="h-8 bg-muted animate-pulse rounded w-16" />
        </div>
        <div className="h-6 bg-muted animate-pulse rounded w-12" />
      </div>
    </CardContent>
  </Card>
)

export default function CRMPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<Client>({
    nome: "",
    telefone: "",
    endereco: "",
  })
  const [phoneExists, setPhoneExists] = useState(false)
  const [isCheckingPhone, setIsCheckingPhone] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Novos estados para a modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)


  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/clients")

      if (response.ok) {
        const data = await response.json()
        setClients(data)
      } else {
        console.error("Erro ao carregar clientes:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // CORREÇÃO DO WARNING: Envolvemos a função em useCallback
  const checkPhoneExists = useCallback(async (phone: string) => {
    if (!phone || phone.length < 10) {
      setPhoneExists(false)
      return
    }

    setIsCheckingPhone(true)
    try {
      const response = await fetch(`/api/clients/check-phone?phone=${encodeURIComponent(phone)}`)

      if (response.ok) {
        const data = await response.json()
        // Verifica se o telefone existe e se NÃO é o cliente que está sendo editado
        const exists = data.exists && (!editingClient || data.clientId !== editingClient._id)
        setPhoneExists(exists)
      } else {
        console.error("Erro ao verificar telefone:", response.status)
      }
    } catch (error) {
      console.error("Erro ao verificar telefone:", error)
    } finally {
      setIsCheckingPhone(false)
    }
  }, [editingClient, setPhoneExists]) // Dependências corretas para useCallback

  // O useEffect agora usa a função checkPhoneExists estável
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.telefone) {
        checkPhoneExists(formData.telefone)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.telefone, checkPhoneExists]) // Removido editingClient, pois já é uma dependência de checkPhoneExists

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (phoneExists) {
      toast.error( "Este número de telefone já está em uso por outro cliente.")
      return
    }

    try {
      const url = editingClient ? `/api/clients/${editingClient._id}` : "/api/clients"
      const method = editingClient ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast(`${editingClient ?'Cliente atualizado' : 'Novo cliente adicionado'} com sucesso!`)
        fetchClients()
        setIsModalOpen(false)
        resetForm()
      } else {
        console.error("Erro ao salvar cliente:", response.status)
        throw new Error("Erro ao salvar cliente")
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      toast.error("Erro ao salvar cliente. Tente novamente.")
    }
  }

  // Função para abrir a modal de confirmação de exclusão
  const openDeleteModal = (client: Client) => {
    setClientToDelete(client)
    setIsDeleteModalOpen(true)
  }

  // Função que executa a exclusão
  const executeDelete = async () => {
    if (!clientToDelete?._id) return

    try {
      const response = await fetch(`/api/clients/${clientToDelete._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.error("Cliente removido com sucesso!")
        fetchClients()
      } else {
        throw new Error("Falha ao excluir")
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir cliente. Tente novamente.")
    } finally {
      setIsDeleteModalOpen(false)
      setClientToDelete(null)
    }
  }

  const resetForm = () => {
    setFormData({ nome: "", telefone: "", endereco: "" })
    setEditingClient(null)
    setPhoneExists(false)
  }

  const openEditModal = (client: Client) => {
    setEditingClient(client)
    setFormData(client)
    setIsModalOpen(true)
  }

  const filteredClients = clients.filter(
    (client) =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefone.includes(searchTerm) ||
      client.endereco.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <div className="h-4 bg-muted animate-pulse rounded w-32" />
            ) : (
              `${clients.length} cliente${clients.length !== 1 ? "s" : ""} cadastrado${clients.length !== 1 ? "s" : ""}`
            )}
          </p>
        </div>

        {/* Modal de Adição/Edição */}
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover border-border">
            <DialogHeader>
              <DialogTitle className="text-popover-foreground">
                {editingClient ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="telefone" className="text-popover-foreground">
                  Telefone *
                </Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="bg-input border-border text-foreground"
                  required
                />
                {isCheckingPhone && <p className="text-sm text-muted-foreground mt-1">Verificando telefone...</p>}
                {phoneExists && <p className="text-sm text-destructive mt-1">Este telefone já está cadastrado!</p>}
              </div>

              <div>
                <Label htmlFor="nome" className="text-popover-foreground">
                  Nome *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                  className="bg-input border-border text-foreground"
                  required
                  disabled={phoneExists}
                />
              </div>

              <div>
                <Label htmlFor="endereco" className="text-popover-foreground">
                  Endereço *
                </Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Endereço completo"
                  className="bg-input border-border text-foreground"
                  required
                  disabled={phoneExists}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={phoneExists || isCheckingPhone}
                >
                  {editingClient ? "Atualizar" : "Cadastrar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-border hover:bg-accent"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar por nome, telefone ou endereço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-input border-border"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Clientes</p>
                    <p className="text-2xl font-bold text-card-foreground">{clients.length}</p>
                  </div>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    Ativo
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resultados da Busca</p>
                    <p className="text-2xl font-bold text-card-foreground">{filteredClients.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? // Mostra 6 skeleton cards durante o loading
          Array.from({ length: 6 }).map((_, index) => <ClientCardSkeleton key={index} />)
          : filteredClients.map((client) => (
            <Card key={client._id} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-card-foreground flex items-center justify-between">
                  {client.nome}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(client)}
                      className="h-8 w-8 p-0 hover:bg-accent"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      // Chamamos a função que abre a modal de confirmação
                      onClick={() => client._id && openDeleteModal(client)} 
                      className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {client.telefone}
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="break-words">{client.endereco}</span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {!isLoading && filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? "Nenhum cliente encontrado para a busca." : "Nenhum cliente cadastrado ainda."}
          </p>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-popover border-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-popover-foreground">Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir o cliente 
              <span className="font-semibold text-destructive"> {clientToDelete?.nome}</span>? 
              Esta ação é irreversível.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-border hover:bg-accent"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={executeDelete}
              className="hover:bg-destructive/80"
            >
              Excluir Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
