import { Repository, RepositoryProps } from './repository'

export type AccountName = {
  accountName: string
  accountId: string
}

export class AccountNameRepository extends Repository {
  constructor(props: RepositoryProps) {
    super('account-name', props)
  }

  // Adjusted to match the base class 'Repository' return type
  async get(): Promise<string> {
    return super.get()
  }

  // Adjusted to match the base class 'Repository' parameter type
  async set(value: string): Promise<void> {
    return super.set(value)
  }

  // New method to handle the logic previously in `get`
  async getAccountNames(): Promise<AccountName[] | null> {
    try {
      const data = await this.get()
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error fetching account names:", error)
      return null
    }
  }

  // New method to handle the logic previously in `set`
  async setAccountNames(accountNames: AccountName[]): Promise<void> {
    try {
      const data = JSON.stringify(accountNames)
      await this.set(data)
    } catch (error) {
      console.error("Error storing account names:", error)
    }
  }
}
