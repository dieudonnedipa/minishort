import router from '@adonisjs/core/services/router'
import UrlsController from '#controllers/http/urlscontroller'

router.get('/', [UrlsController, 'index'])
router.post('/shorten', [UrlsController, 'store'])
router.get('/:code', [UrlsController, 'redirect'])