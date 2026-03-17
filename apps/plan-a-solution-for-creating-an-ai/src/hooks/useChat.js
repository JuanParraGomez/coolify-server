import { useAppStore } from '../store/appStore'
import { useCallback, useState } from 'react'
import { MOCK_API_RESPONSES } from '../lib/mock-data'

/**
 * Hook for managing chat messages and AI-generated responses
 * Handles message history, suggestions, and responses for each lead
 */
export function useChat() {
  const getChatMessages = useAppStore((state) => state.getChatMessages)
  const addChatMessage = useAppStore((state) => state.addChatMessage)
  const clearChat = useAppStore((state) => state.clearChat)
  const [generating, setGenerating] = useState({})
  const [errors, setErrors] = useState({})

  /**
   * Get all chat messages for a lead
   */
  const getMessages = useCallback(
    (leadId) => {
      return getChatMessages(leadId)
    },
    [getChatMessages]
  )

  /**
   * Add a message to chat history
   */
  const sendMessage = useCallback(
    (leadId, message, role = 'user') => {
      const newMessage = {
        id: Date.now(),
        role,
        content: message,
        timestamp: new Date().toISOString(),
      }
      addChatMessage(leadId, newMessage)
      return newMessage
    },
    [addChatMessage]
  )

  /**
   * Generate AI suggestion for a lead response
   */
  const generateSuggestion = useCallback(
    async (leadId, provider) => {
      setGenerating((g) => ({ ...g, [leadId]: true }))
      setErrors((e) => ({ ...e, [leadId]: null }))

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock API response
        const response = MOCK_API_RESPONSES.generateSuggestion(leadId, provider)
        if (response.status === 200) {
          return response.data
        } else {
          throw new Error('Failed to generate suggestion')
        }
      } catch (error) {
        const errorMsg = error.message || 'Error generating suggestion'
        setErrors((e) => ({ ...e, [leadId]: errorMsg }))
        return null
      } finally {
        setGenerating((g) => ({ ...g, [leadId]: false }))
      }
    },
    []
  )

  /**
   * Send a response to a lead
   */
  const sendResponse = useCallback(
    async (leadId, message) => {
      setGenerating((g) => ({ ...g, [leadId]: true }))
      setErrors((e) => ({ ...e, [leadId]: null }))

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock API response
        const response = MOCK_API_RESPONSES.createResponse(leadId, message)
        if (response.status === 201) {
          // Add to chat as assistant message
          addChatMessage(leadId, {
            id: response.data.id,
            role: 'assistant',
            content: message,
            timestamp: response.data.sentAt,
            status: response.data.status,
          })
          return response.data
        } else {
          throw new Error('Failed to send response')
        }
      } catch (error) {
        const errorMsg = error.message || 'Error sending response'
        setErrors((e) => ({ ...e, [leadId]: errorMsg }))
        return null
      } finally {
        setGenerating((g) => ({ ...g, [leadId]: false }))
      }
    },
    [addChatMessage]
  )

  /**
   * Clear chat history for a lead
   */
  const clearChatHistory = useCallback(
    (leadId) => {
      clearChat(leadId)
    },
    [clearChat]
  )

  /**
   * Get message count for a lead
   */
  const getMessageCount = useCallback(
    (leadId) => {
      return getMessages(leadId).length
    },
    [getMessages]
  )

  /**
   * Get last message for a lead
   */
  const getLastMessage = useCallback(
    (leadId) => {
      const messages = getMessages(leadId)
      return messages.length > 0 ? messages[messages.length - 1] : null
    },
    [getMessages]
  )

  return {
    getMessages,
    sendMessage,
    generateSuggestion,
    sendResponse,
    clearChatHistory,
    getMessageCount,
    getLastMessage,
    generating,
    errors,
    isGenerating: (leadId) => generating[leadId] || false,
    getError: (leadId) => errors[leadId] || null,
  }
}
