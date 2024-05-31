import { Repository, RepositoryProps } from './repository'

export type AccountName = {
  accountName: string
  accountId: string
}

export class AccountNameRepository extends Repository {
  constructor(props: RepositoryProps) {
    super('account-name', props)
  }

  // Ensure reliable fetching and storage of account names or aliases
  async get(): Promise<AccountName[] | null> {
    try {
      const data = await super.get()
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error fetching account names:", error)
      return null
    }
  }

  async set(accountNames: AccountName[]): Promise<void> {
    try {
      const data = JSON.stringify(accountNames)
      await super.set(data)
    } catch (error) {
      console.error("Error storing account names:", error)
    }
  }
}
