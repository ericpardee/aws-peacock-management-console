import {
  AccountName,
  AccountNameRepository,
} from './lib/account-name-repository'
import { RepositoryProps } from './lib/repository'

const repositoryProps: RepositoryProps = {
  browser: chrome || browser,
  storageArea: 'local',
}
const accountNameRepository = new AccountNameRepository(repositoryProps)

type OnSubtreeUpdated = (stopObserve: () => void) => void

const observeApp = (onSubtreeUpdated: OnSubtreeUpdated) => {
  const app = document.querySelector<HTMLElement>('app')
  if (!app) {
    console.error('AWS SSO page has no <app>.')
    return
  }
  const mutationCallback = (
    _: MutationRecord[],
    observer: MutationObserver
  ) => {
    onSubtreeUpdated(() => observer.disconnect())
  }
  const config = { attributes: false, childList: true, subtree: true }
  const observer = new MutationObserver(mutationCallback)
  observer.observe(app, config)
}

const isAwsAccountSelected = (): boolean =>
  document
    .querySelector<HTMLElement>('portal-application[title="AWS Account"]')
    ?.classList?.contains('selected') ?? false

const toAccountNameAndId = (
  portalInstanceSection: HTMLDivElement
): AccountName | null => {
  const accountName =
    portalInstanceSection.querySelector<HTMLDivElement>('div.name')?.textContent
  const accountId = portalInstanceSection
    .querySelector<HTMLSpanElement>('span.accountId')
    ?.textContent?.replace('#', '')
  return accountName && accountId ? { accountName, accountId } : null
}

const saveAccountName = async () => {
  const portalInstanceSection = document.querySelectorAll<HTMLDivElement>(
    'div.portal-instance-section'
  )
  if (!portalInstanceSection) {
    console.error('portal-instance-section is not detected.')
    return
  }
  const accountNames = Array.from(portalInstanceSection).map(toAccountNameAndId).filter(Boolean) as AccountName[]
  if (accountNames.length > 0) {
    try {
      await accountNameRepository.setAccountNames(accountNames)
      console.log("Account names saved successfully.")
    } catch (error) {
      console.error("Failed to save account names:", error)
    }
  } else {
    console.log("No account names to save.")
  }
}

const saveAccountNameIfAwsAccountSelected = (callback: () => void) => {
  if (!isAwsAccountSelected()) {
    return
  }
  saveAccountName()
  callback()
}

observeApp(saveAccountNameIfAwsAccountSelected)
