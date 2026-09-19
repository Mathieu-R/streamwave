export type UserDisplayInput = {
  email: string
  firstname?: string | null
  image?: string | null
  lastname?: string | null
  name?: string | null
}

export type UserDisplay = {
  avatarUrl: string | null
  fallback: string
  name: string
}

export function getUserDisplay(user: UserDisplayInput): UserDisplay {
  const fullName = [user.firstname, user.lastname]
    .filter(Boolean)
    .join(' ')
    .trim()
  const name = fullName || user.name?.trim() || user.email

  return {
    avatarUrl: user.image ?? null,
    fallback: name,
    name
  }
}
