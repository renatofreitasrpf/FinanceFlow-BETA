import type { Account } from '../types/account'

export const initialAccounts: Account[] = [
  { id: 'checking', name: 'Conta corrente', type: 'checking', color: '#16834f' },
  { id: 'card', name: 'Cartao', type: 'credit', color: '#efad66' },
  { id: 'savings', name: 'Reserva', type: 'savings', color: '#69aeda' },
]
