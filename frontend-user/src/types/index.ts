// TypeScript Type Definitions
// Will be fully implemented in Task 2.1

// Hero Types
export type HeroRole = 'warrior' | 'mage' | 'assassin' | 'marksman' | 'support' | 'tank'

export interface Skill {
  id: number
  name: string
  icon: string
  description: string
  cooldown: number
}

export interface Skin {
  id: number
  name: string
  image: string
  price?: number
}

export interface Hero {
  id: number
  name: string
  title: string
  avatar: string
  role: HeroRole
  difficulty: 1 | 2 | 3
  skills: Skill[]
  skins: Skin[]
  story: string
}

// Equipment Types
export type EquipmentCategory = 'attack' | 'magic' | 'defense' | 'movement' | 'jungle'

export interface Attribute {
  name: string
  value: number | string
}

export interface Equipment {
  id: number
  name: string
  icon: string
  category: EquipmentCategory
  price: number
  description: string
  attributes: Attribute[]
  passive?: string
}

// Event Types
export type EventStatus = 'upcoming' | 'ongoing' | 'completed'

export interface Team {
  name: string
  logo: string
}

export interface GameEvent {
  id: number
  title: string
  date: string
  status: EventStatus
  teams: Team[]
  description: string
  prize?: string
}

// User Types
export interface HistoryItem {
  heroId: number
  timestamp: number
}

export interface UserState {
  favorites: number[]
  history: HistoryItem[]
  username: string
}

// Navigation Types
export interface NavItem {
  path: string
  name: string
  title: string
  icon: string
}

// Banner Types
export interface BannerItem {
  id: number
  image: string
  title: string
  link: string
}

// News Types
export interface NewsItem {
  id: number
  title: string
  summary: string
  image: string
  date: string
  category: string
}

// Version Hub Types
export type VersionStatus = 'active' | 'upcoming' | 'deprecated'
export type UpdateCategory = 'heroes' | 'skins' | 'balance' | 'bugFixes' | 'other'

export interface UpdateContent {
  id: string
  category: UpdateCategory
  title: string
  description: string
  imageUrl?: string
  beforeValue?: any
  afterValue?: any
  order: number
}

export interface Version {
  id: string
  versionNumber: string
  releaseDate: Date
  status: VersionStatus
  summary: string
  majorChanges: string[]
  updateContent: UpdateContent[]
  createdAt: Date
  updatedAt: Date
}

export interface VersionFilter {
  versionNumber?: string
  startDate?: Date
  endDate?: Date
}
