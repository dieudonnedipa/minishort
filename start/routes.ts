import router from '@adonisjs/core/services/router'
import UrlsController from '#controllers/urlscontroller'

router.get('/', [UrlsController, 'index'])
router.post('/shorten', [UrlsController, 'store'])
router.get('/goToUrl', [UrlsController, 'goToUrl'])
router.post('/goto', [UrlsController, 'searchRedirect'])
router.get('/:code', [UrlsController, 'redirect'])
router.post('/urls/:id/update', [UrlsController, 'update'])
router.post('/urls/:id/delete', [UrlsController, 'destroy'])