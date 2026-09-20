import type { User } from '@/components/layout/SideNavInfos'

export type UserDisplayInput = {
  email: string
  firstname?: string
  image?: string
  lastname?: string
  name?: string
}

export function getUserDisplay(user: UserDisplayInput): User {
  const fullName = [user.firstname, user.lastname]
    .filter(Boolean)
    .join(' ')
    .trim()
  const name = fullName || user.name?.trim() || user.email

  return {
    avatarUrl: user.image ?? undefined,
    email: user.email,
    fallback: name,
    name
  }
}
