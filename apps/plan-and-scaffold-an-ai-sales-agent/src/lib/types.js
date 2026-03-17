/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} name
 * @property {string} company
 * @property {string} title
 * @property {string} email
 * @property {string} linkedin_url
 * @property {'new'|'contacted'|'replied'|'qualified'|'closed'} status
 * @property {string} created_at
 * @property {string} [last_contacted_at]
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} lead_id
 * @property {'inbound'|'outbound'|'ai_draft'} direction
 * @property {string} content
 * @property {string} created_at
 * @property {boolean} [is_ai_generated]
 */

/**
 * @typedef {Object} Alert
 * @property {string} id
 * @property {'reply'|'mention'|'connection'|'view'} type
 * @property {string} lead_id
 * @property {string} lead_name
 * @property {string} message
 * @property {boolean} read
 * @property {string} created_at
 */

/**
 * @typedef {Object} SocialProfile
 * @property {string} name
 * @property {string} title
 * @property {string} company
 * @property {string} [linkedin_url]
 * @property {string} [twitter_url]
 * @property {string[]} [recent_posts]
 * @property {string[]} [interests]
 * @property {string} [bio]
 */

/**
 * @typedef {Object} ResearchReport
 * @property {string} lead_id
 * @property {SocialProfile} profile
 * @property {string} summary
 * @property {string[]} talking_points
 * @property {string} generated_at
 */

/**
 * @typedef {Object} AgentRun
 * @property {string} run_id
 * @property {'pending'|'running'|'completed'|'failed'} status
 * @property {string} input
 * @property {string} [output]
 * @property {AgentStep[]} steps
 * @property {string} created_at
 */

/**
 * @typedef {Object} AgentStep
 * @property {string} node
 * @property {string} action
 * @property {string} [result]
 * @property {number} duration_ms
 */

/**
 * @typedef {Object} ApiConfig
 * @property {'openai'|'gemini'|'claude'|'deepseek'} provider
 * @property {string} apiKey
 * @property {string} model
 */
