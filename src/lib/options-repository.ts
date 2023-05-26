import { Repository, RepositoryProps } from './repository'

export class OptionsRepository extends Repository {
  constructor(props: RepositoryProps) {
    super('options', props)
  }
}