import type { HttpContext } from '@adonisjs/core/http'
import { nanoid } from 'nanoid'
import QRCode from 'qrcode'
import Url from '../../models/url.js'

export default class UrlsController {
  public async index({ view }: HttpContext) {
    return view.render('pages/home')
  }

  public async store({ request, view }: HttpContext) {
    const { url } = request.only(['url'])
    const shortCode = nanoid(6)
    await Url.create({
      originalUrl: url,
      shortCode: shortCode,
      clicks: 0
    })
    const baseUrl = `http://localhost:3333`
    const shortLink = `${baseUrl}/${shortCode}`
    const qrCode = await QRCode.toDataURL(shortLink)
    return view.render('pages/result', {
      shortLink,
      qrCode,
      originalUrl: url
    })
  }

  public async redirect({ params, response }: HttpContext) {
    const url = await Url.findBy('shortCode', params.code)
    if (!url) {
      return response.status(404).send('URL non trouvée')
    }
    url.clicks = (url.clicks ?? 0) + 1
    await url.save()
    return response.redirect(url.originalUrl)
  }
}