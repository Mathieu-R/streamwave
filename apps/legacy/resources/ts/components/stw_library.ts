import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('stw-library')
export default class STWLibrary extends LitElement {
  connectedCallback() {
    super.connectedCallback()
    this.lazyLoadCovers()
  }

  lazyLoadCovers() {
    const covers = this.querySelectorAll('.lazy')

    covers.forEach((cover) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src!
            img.classList.remove('lazy')
            observer.unobserve(img)
          }
        })
      })

      observer.observe(cover)
    })
  }

  render() {
    return html` <slot></slot>`
  }
}
