import type { HttpContext } from '@adonisjs/core/http'
import { nanoid } from 'nanoid'
import QRCode from 'qrcode'
import Url from '../models/url.js'

export default class UrlsController {
  public async index({ view }: HttpContext) {
    const urls = await Url.all()
    return view.render('pages/home', { urls })
  }

  public async store({ request, response }: HttpContext) {
    const originalUrl = request.input('originalUrl')
    let shortCode = request.input('shortCode')

    if (!shortCode) {
      shortCode = nanoid(6)
    }

    const baseUrl = `http://localhost:3333`
    const shortLink = `${baseUrl}/${shortCode}`
    const qrCode = await QRCode.toDataURL(shortLink)

    await Url.create({
      originalUrl,
      shortCode,
      clicks: 0,
      qrCode,
    })

    return response.redirect('/goToUrl')
  }

  public async redirect({ params, response }: HttpContext) {
    const url = await Url.findBy('shortCode', params.code)
    if (!url) return response.status(404).send('URL non trouvée')
    url.clicks++
    await url.save()
    return response.redirect(url.originalUrl)
  }

  public async goToUrl({ view }: HttpContext) {
    const urls = await Url.all()
    return view.render('pages/goToUrl', { urls })
  }

  public async searchRedirect({ request, response }: HttpContext) {
    const { code } = request.only(['code'])
    const url = await Url.findBy('shortCode', code)
    if (!url) return response.status(404).send('ShortCode introuvable')
    url.clicks++
    await url.save()
    return response.redirect(url.originalUrl)
  }

  public async update({ params, request, response }: HttpContext) {
    const url = await Url.find(params.id)
    if (!url) return response.status(404).send('URL introuvable')

    const { originalUrl, shortCode } = request.only(['originalUrl', 'shortCode'])
    url.originalUrl = originalUrl ?? url.originalUrl
    url.shortCode = shortCode ?? url.shortCode

    const baseUrl = `http://localhost:3333`
    const shortLink = `${baseUrl}/${url.shortCode}`
    url.qrCode = await QRCode.toDataURL(shortLink)

    await url.save()
    return response.redirect('/goToUrl')
  }

  public async destroy({ params, response }: HttpContext) {
    const url = await Url.find(params.id)
    if (!url) return response.status(404).send('URL introuvable')
    await url.delete()
    return response.redirect('/goToUrl')
  }
}