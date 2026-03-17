import { useAppStore } from '../store/appStore'
import { useCallback, useState } from 'react'
import { MOCK_API_RESPONSES } from '../lib/mock-data'

/**
 * Hook for managing social research data on leads
 * Handles fetching, caching, and managing social profile research
 */
export function useSocialResearch() {
  const setSocialResearch = useAppStore((state) => state.setSocialResearch)
  const getSocialResearch = useAppStore((state) => state.getSocialResearch)
  const [loading, setLoading] = useState({})
  const [errors, setErrors] = useState({})

  /**
   * Fetch social research for a lead
   * Simulates API call to research lead on social networks
   */
  const fetchSocialResearch = useCallback(
    async (leadId) => {
      setLoading((l) => ({ ...l, [leadId]: true }))
      setErrors((e) => ({ ...e, [leadId]: null }))

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock API response
        const response = MOCK_API_RESPONSES.getSocialResearch(leadId)
        if (response.status === 200) {
          setSocialResearch(leadId, response.data)
          return response.data
        } else {
          throw new Error('Failed to fetch social research')
        }
      } catch (error) {
        const errorMsg = error.message || 'Error fetching social research'
        setErrors((e) => ({ ...e, [leadId]: errorMsg }))
        return null
      } finally {
        setLoading((l) => ({ ...l, [leadId]: false }))
      }
    },
    [setSocialResearch]
  )

  /**
   * Get cached social research for a lead
   */
  const getResearch = useCallback(
    (leadId) => {
      return getSocialResearch(leadId)
    },
    [getSocialResearch]
  )

  /**
   * Check if research is cached and valid
   */
  const hasResearch = useCallback(
    (leadId) => {
      const research = getSocialResearch(leadId)
      return !!research
    },
    [getSocialResearch]
  )

  /**
   * Get research insights for a lead
   */
  const getInsights = useCallback(
    (leadId) => {
      const research = getSocialResearch(leadId)
      return research?.insights || []
    },
    [getSocialResearch]
  )

  /**
   * Get buying triggers for a lead
   */
  const getTriggers = useCallback(
    (leadId) => {
      const research = getSocialResearch(leadId)
      return research?.triggers || []
    },
    [getSocialResearch]
  )

  /**
   * Get social media sources for a lead
   */
  const getSources = useCallback(
    (leadId) => {
      const research = getSocialResearch(leadId)
      return research?.sources || []
    },
    [getSocialResearch]
  )

  return {
    fetchSocialResearch,
    getResearch,
    hasResearch,
    getInsights,
    getTriggers,
    getSources,
    loading,
    errors,
    isLoading: (leadId) => loading[leadId] || false,
    getError: (leadId) => errors[leadId] || null,
  }
}
