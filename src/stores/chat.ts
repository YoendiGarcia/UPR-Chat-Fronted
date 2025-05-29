import { defineStore } from 'pinia'
import { Chat } from '@/interfaces/Chats'
import { LLMQuery } from '@/interfaces/LLMQueries'

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: [] as Chat[],
  }),
  actions: {
    addChat(chat: Chat) {
      this.chats.push(chat)
    },
    removeChat(chatId: number) {
      this.chats = this.chats.filter((chat) => chatId !== chatId)
    },
    getCurrentChat(chatId: number): Chat {
      return this.chats[chatId]
    },
    saveLLMQuery(chatId: number, llmquery: LLMQuery): void {
      this.chats[chatId].llmqueries.push(llmquery)
    },
    getAllChats(): Chat[] {
      return this.chats
    },
  },
})

export const useChatIdStore = defineStore('chatId', {
  state: () => ({
    currentChatId: null as number | null,
    usedIds: new Set<number>(),
    lastId: 0,
  }),

  actions: {
    // Genera un nuevo ID único
    generateNewId(): number {
      let newId = this.lastId + 1

      // Asegurarse de que el ID no esté en uso
      while (this.usedIds.has(newId)) {
        newId++
      }

      this.lastId = newId
      this.usedIds.add(newId)
      return newId
    },

    // Establece el chat actual
    setCurrentChat(id: number): void {
      if (!this.usedIds.has(id)) {
        throw new Error(`El ID ${id} no existe en los chats registrados`)
      }
      this.currentChatId = id
    },

    // Libera un ID cuando se elimina un chat
    releaseId(id: number): void {
      this.usedIds.delete(id)
      if (id === this.currentChatId) {
        this.currentChatId = null
      }
    },

    // Verifica si un ID está en uso
    isIdInUse(id: number): boolean {
      return this.usedIds.has(id)
    },
  },

  getters: {
    // Obtiene el ID actual
    getCurrentId(): number | null {
      return this.currentChatId
    },

    // Obtiene todos los IDs en uso
    getAllUsedIds(): number[] {
      return Array.from(this.usedIds)
    },
  },
})
