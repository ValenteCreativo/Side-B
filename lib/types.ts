/**
 * Type definitions for the application
 * Since SQLite doesn't support enums, we use string literals with TypeScript types
 */

export type UserRole = 'MUSICIAN' | 'CREATOR'

export type ContentType = 'JAM' | 'REHEARSAL' | 'PRODUCED'

// Helper functions for type validation
export function isValidUserRole(role: string): role is UserRole {
  return role === 'MUSICIAN' || role === 'CREATOR'
}

export function isValidContentType(type: string): type is ContentType {
  return type === 'JAM' || type === 'REHEARSAL' || type === 'PRODUCED'
}

// Type guards with runtime validation
export function assertUserRole(role: string): asserts role is UserRole {
  if (!isValidUserRole(role)) {
    throw new Error(`Invalid user role: ${role}. Must be MUSICIAN or CREATOR`)
  }
}

export function assertContentType(type: string): asserts type is ContentType {
  if (!isValidContentType(type)) {
    throw new Error(`Invalid content type: ${type}. Must be JAM, REHEARSAL, or PRODUCED`)
  }
}
