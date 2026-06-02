export type EventStatus = 'draft' | 'live' | 'completed' | 'archived'

export type RsvpStatus = 'confirmed' | 'waitlisted' | 'cancelled'

export type OpportunityType =
  | 'Sponsor'
  | 'Vendor'
  | 'Speaker'
  | 'Artist'
  | 'Musician / Performer'
  | 'Collaborator'
  | 'Community Partner'
  | 'Referral Partner'
  | 'Volunteer'
  | 'Future Host'

export type OpportunityStatus = 'potential' | 'contacted' | 'confirmed' | 'declined'

export type EmailType =
  | 'confirmation'
  | 'reminder'
  | 'survey'
  | 'invite'
  | 'campaign'
  | 'followup'

export const OPPORTUNITY_TYPES: OpportunityType[] = [
  'Sponsor',
  'Vendor',
  'Speaker',
  'Artist',
  'Musician / Performer',
  'Collaborator',
  'Community Partner',
  'Referral Partner',
  'Volunteer',
  'Future Host',
]

export const SURVEY_QUESTIONS = [
  'What best describes you?',
  'What are you hoping to get out of LINK\'D UP?',
  'How was your event experience?',
  'What did you enjoy most?',
  'What should we change, improve, or add?',
  'Did you make any new connections?',
  'What do you dislike about traditional networking groups?',
  'What would make LINK\'D UP feel different and modern?',
  'What type of events should LINK\'D UP host next?',
  'How often should events happen?',
  'What days/times work best?',
  'Would you be interested in being featured, speaking, sponsoring, vending, performing, displaying art, or collaborating?',
  'What kind of collaborations are you looking for?',
  'What is one idea that would make LINK\'D UP better?',
  'Any extra feedback?',
]
