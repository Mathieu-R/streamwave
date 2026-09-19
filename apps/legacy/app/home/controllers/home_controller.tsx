import Home from '#views/pages/home'
import LibraryRepository from '../repositories/library_repository.js'
import { inject } from '@adonisjs/core'

@inject()
export default class HomeController {
  constructor(private repository: LibraryRepository) {}

  async index() {
    const albums = await this.repository.getLibrary()
    return <Home albums={albums} />
  }
}
