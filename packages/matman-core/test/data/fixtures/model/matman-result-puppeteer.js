module.exports = {
  runnerName: 'puppeteer',
  data: [
    {
      titleInfo: { isExist: false },
      formContentInfo: { isExist: false },
      formBtnInfo: { isExist: true, text: '申请验证', isBtnActive: false },
      messageTipsInfo: { isExist: false },
    },
  ],
  dataIndexMap: { init: 0 },
  globalInfo: {
    recorder: {
      queue: [
        {
          eventName: 'network',
          url:
            'https://now.qq.com/h5/personal-center/verify-identity.html?_bid=3683&from=1&now_id=93033660&not_verify_id=0',
          method: 'GET',
          resourceType: 'document',
          request: {
            headers: {
              'upgrade-insecure-requests': '1',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
              'x-mat-from': 'puppeteer',
              'x-mat-timestamp': '1595209902300',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: {
              server: 'whistle',
              'content-type': 'text/html; charset=utf-8',
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              connection: 'keep-alive',
              'transfer-encoding': 'chunked',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url: 'https://now8.gtimg.com/now/h5/personal-center/verify-identity_e523fc6c.js?_bid=152',
          method: 'GET',
          resourceType: 'script',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              origin: 'https://now.qq.com',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: '',
            headers: {
              status: '200',
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              server: 'whistle',
              'access-control-allow-origin': '*',
              'content-type': 'application/javascript; charset=utf-8',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url:
            'https://qvideo.qq.com/polyfill_service/v2/polyfill.min.js?unknown=polyfill&features=Promise,Map,Set',
          method: 'GET',
          resourceType: 'script',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              origin: 'https://now.qq.com',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: {
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              'content-encoding': 'gzip',
              'x-content-type-options': 'nosniff',
              'surrogate-key': 'polyfill-service',
              'x-frame-options': 'sameorigin',
              connection: 'keep-alive',
              'content-type': 'application/javascript;charset=utf-8',
              'access-control-allow-origin': '*',
              'cache-control':
                'public, s-maxage=31536000, max-age=604800, stale-while-revalidate=604800, stale-if-error=604800',
              'transfer-encoding': 'chunked',
              'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
              'timing-allow-origin': '*',
              vary: 'User-Agent, Accept-Encoding',
              'x-xss-protection': '1; mode=block',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url: 'https://aegis.qq.com/badjs/539',
          method: 'GET',
          resourceType: 'image',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 204,
            statusText: 'No Content',
            headers: {
              'access-control-allow-origin': '*',
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              connection: 'keep-alive',
              'x-powered-by': 'Express',
              'content-length': '0',
              'content-type': 'text/plain',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url: 'https://now.qq.com/cgi-bin/now/web/user/is_in_white_list?t=0.9981270661472799',
          method: 'GET',
          resourceType: 'xhr',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer:
                'https://now.qq.com/h5/personal-center/verify-identity.html?_bid=3683&from=1&now_id=93033660&not_verify_id=0',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: {
              pragma: 'no-cache',
              date: 'Mon, 20 Jul 2020 01:51:43 GMT',
              server: 'nginx',
              'x-powered-by': 'Express',
              vary: 'Origin, Accept-Encoding',
              'content-type': 'application/json;charset=utf-8',
              'access-control-allow-origin': 'undefined',
              'cache-control': 'no-cache',
              'access-control-allow-credentials': 'true',
              connection: 'keep-alive',
              'content-length': '49',
              expires: '-1',
            },
            fromCache: false,
            body: { retcode: 0, result: { is_in_white_list: false } },
          },
        },
        {
          eventName: 'network',
          url: 'https://now8.gtimg.com/now/lib/16.2.0/react.min.js?_bid=3123',
          method: 'GET',
          resourceType: 'script',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: '',
            headers: {
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              'content-encoding': 'gzip',
              'x-cache-lookup': 'Hit From Disktank3 Gz',
              'last-modified': 'Sun, 18 Mar 2018 19:55:46 GMT',
              server: 'NWSs',
              status: '200',
              'content-type': 'application/x-javascript',
              'access-control-allow-origin': '*',
              'cache-control': 'max-age=31536000',
              'x-nws-log-uuid': '7d0dab83-18aa-401d-8664-100dad41a770',
              'timing-allow-origin': '*',
              'content-length': '2833',
              expires: 'Tue, 20 Jul 2021 01:51:41 GMT',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url: 'https://now8.gtimg.com/now/lib/16.2.0/react-dom.min.js?_bid=3123',
          method: 'GET',
          resourceType: 'script',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: '',
            headers: {
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              'content-encoding': 'gzip',
              'x-cache-lookup': 'Hit From Disktank3 Gz',
              'last-modified': 'Sun, 18 Mar 2018 19:55:46 GMT',
              server: 'NWSs',
              status: '200',
              'content-type': 'application/x-javascript',
              'access-control-allow-origin': '*',
              'cache-control': 'max-age=31536000',
              'x-nws-log-uuid': 'e3a3afff-7265-44ad-b7ca-6fb8cf1796b5',
              'timing-allow-origin': '*',
              'content-length': '31086',
              expires: 'Tue, 20 Jul 2021 01:51:41 GMT',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'console',
          type: 'warning',
          text:
            '[NOW COMPONENTS WARN] visibility-state component is already initialized, please check your code, make sure only one visibility-state in node_modules',
        },
        {
          eventName: 'network',
          url:
            'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==',
          method: 'GET',
          resourceType: 'image',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer: '',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: { 'content-type': 'image/webp' },
            fromCache: true,
            body: null,
          },
        },
        { eventName: 'console', type: 'log', text: 'tdbank report JSHandle@object' },
        { eventName: 'console', type: 'log', text: '[huatuo] reportPageSpeed _T JSHandle@object' },
        { eventName: 'console', type: 'log', text: '[huatuo] reportParams JSHandle@object' },
        {
          eventName: 'network',
          url:
            'https://report.url.cn/cgi-bin/tdbank?table_id=now_page_quality_statistics&busi_id=b_sng_im_personal_live&fields=%5B%22uin%22%2C%22from%22%2C%22network_type%22%2C%22platform%22%2C%22environment%22%2C%22obj1%22%2C%22obj2%22%2C%22obj3%22%2C%22busi_name%22%2C%22uri%22%2C%22action%22%5D&datas=%5B%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22init_start%22%5D%2C%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22css_load%22%5D%2C%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22js_load%22%5D%2C%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22js_init%22%5D%2C%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22render_succ%22%5D%5D&pr_ip=obj3&pr_t=ts&_=0.7624240857439584',
          method: 'GET',
          resourceType: 'image',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: '',
            headers: {
              status: '200',
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              server: 'tws',
              'content-length': '36',
              'content-type': 'application/json;charset=utf-8',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url: 'https://report.url.cn/report/report_vm?monitors=[33968915]&_=0.5464150204646216',
          method: 'GET',
          resourceType: 'image',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: '',
            headers: {
              status: '200',
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              server: 'tws',
              'content-length': '8',
              'content-type': 'application/json;charset=utf-8',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url:
            'https://report.url.cn/report/report_vm?monitors=%5B33968918%5D&_=0.14665739856094562',
          method: 'GET',
          resourceType: 'image',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: '',
            headers: {
              status: '200',
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              server: 'tws',
              'content-length': '8',
              'content-type': 'application/json;charset=utf-8',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url: 'https://now.qq.com/favicon.ico',
          method: 'GET',
          resourceType: 'other',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer:
                'https://now.qq.com/h5/personal-center/verify-identity.html?_bid=3683&from=1&now_id=93033660&not_verify_id=0',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: {
              date: 'Mon, 20 Jul 2020 01:51:42 GMT',
              'last-modified': 'Wed, 07 Dec 2016 07:30:08 GMT',
              server: 'nginx',
              etag: '"5847ba80-47e"',
              'content-type': 'image/x-icon',
              'x-client-proto-ver': 'HTTP/1.1',
              connection: 'keep-alive',
              'accept-ranges': 'bytes',
              'x-client-proto': 'https',
              'content-length': '1150',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url:
            'https://report.url.cn/cgi-bin/tdbank?table_id=personal_live_base&busi_id=b_sng_im_personal_live&fields=%5B%22uin%22%2C%22userid%22%2C%22uin_type%22%2C%22opername%22%2C%22module%22%2C%22source%22%2C%22networktype%22%2C%22platform%22%2C%22osVersion%22%2C%22clientVersion%22%2C%22timestr%22%2C%22res3%22%2C%22action%22%5D&datas=%5B%5B%22%22%2C%22%22%2C3%2C%22now-h5%22%2C%22annual_hongbao%22%2C%221%22%2C-3%2C%22ios%22%2C%2211.0%22%2C%22%22%2C1595209902%2C%22%22%2C%22identity_verify_view%22%5D%5D&pr_ip=obj3&pr_t=ts&_=0.5506835479109551',
          method: 'GET',
          resourceType: 'image',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: '',
            headers: {
              status: '200',
              date: 'Mon, 20 Jul 2020 01:51:43 GMT',
              server: 'tws',
              'content-length': '36',
              'content-type': 'application/json;charset=utf-8',
            },
            fromCache: false,
            body: null,
          },
        },
        {
          eventName: 'network',
          url:
            'https://report.url.cn/cgi-bin/tdbank?table_id=avweb_speed&busi_id=b_sng_im_personal_live&fields=%5B%22obj2%22%2C%22uin%22%2C%22module%22%2C%22offline%22%2C%22obj1%22%2C%22os%22%2C%22operator%22%2C%22os_version%22%2C%22page%22%2C%22source%22%2C%22action%22%2C%22time%22%2C%22obj3%22%2C%22obj4%22%5D&datas=%5B%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_start%22%2C224%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_css_ready%22%2C226%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_js_ready%22%2C395%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_main_start%22%2C395%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_main_end%22%2C437%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_render_end%22%2C448%2C0%2C0%5D%5D&pr_ip=obj3&pr_t=ts&_=0.6401450988632442',
          method: 'GET',
          resourceType: 'image',
          request: {
            headers: {
              'x-mat-timestamp': '1595209902300',
              'x-mat-from': 'puppeteer',
              referer: 'https://now.qq.com/',
              'user-agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            },
          },
          response: {
            ok: true,
            status: 200,
            statusText: '',
            headers: {
              status: '200',
              date: 'Mon, 20 Jul 2020 01:51:43 GMT',
              server: 'tws',
              'content-length': '36',
              'content-type': 'application/json;charset=utf-8',
            },
            fromCache: false,
            body: null,
          },
        },
      ],
      allRequestUrl: [
        'https://now.qq.com/h5/personal-center/verify-identity.html?_bid=3683&from=1&now_id=93033660&not_verify_id=0',
        'https://qvideo.qq.com/polyfill_service/v2/polyfill.min.js?unknown=polyfill&features=Promise,Map,Set',
        'https://now8.gtimg.com/now/lib/16.2.0/react.min.js?_bid=3123',
        'https://now8.gtimg.com/now/lib/16.2.0/react-dom.min.js?_bid=3123',
        'https://now8.gtimg.com/now/h5/personal-center/verify-identity_e523fc6c.js?_bid=152',
        'https://aegis.qq.com/badjs/539',
        'https://now.qq.com/cgi-bin/now/web/user/is_in_white_list?t=0.9981270661472799',
        'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==',
        'https://report.url.cn/report/report_vm?monitors=[33968915]&_=0.5464150204646216',
        'https://report.url.cn/cgi-bin/tdbank?table_id=now_page_quality_statistics&busi_id=b_sng_im_personal_live&fields=%5B%22uin%22%2C%22from%22%2C%22network_type%22%2C%22platform%22%2C%22environment%22%2C%22obj1%22%2C%22obj2%22%2C%22obj3%22%2C%22busi_name%22%2C%22uri%22%2C%22action%22%5D&datas=%5B%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22init_start%22%5D%2C%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22css_load%22%5D%2C%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22js_load%22%5D%2C%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22js_init%22%5D%2C%5B0%2C%221%22%2C-3%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22IOS%22%2C%22%22%2C%22now%E7%9B%B4%E6%92%ADH5%E7%89%88%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83-%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%22%2C%22https%3A%2F%2Fnow.qq.com%2Fh5%2Fpersonal-center%2Fverify-identity.html%3F_bid%3D3683%40from%3D1%40now_id%3D93033660%40not_verify_id%3D0%22%2C%22render_succ%22%5D%5D&pr_ip=obj3&pr_t=ts&_=0.7624240857439584',
        'https://report.url.cn/report/report_vm?monitors=%5B33968918%5D&_=0.14665739856094562',
        'https://now.qq.com/favicon.ico',
        'https://report.url.cn/cgi-bin/tdbank?table_id=personal_live_base&busi_id=b_sng_im_personal_live&fields=%5B%22uin%22%2C%22userid%22%2C%22uin_type%22%2C%22opername%22%2C%22module%22%2C%22source%22%2C%22networktype%22%2C%22platform%22%2C%22osVersion%22%2C%22clientVersion%22%2C%22timestr%22%2C%22res3%22%2C%22action%22%5D&datas=%5B%5B%22%22%2C%22%22%2C3%2C%22now-h5%22%2C%22annual_hongbao%22%2C%221%22%2C-3%2C%22ios%22%2C%2211.0%22%2C%22%22%2C1595209902%2C%22%22%2C%22identity_verify_view%22%5D%5D&pr_ip=obj3&pr_t=ts&_=0.5506835479109551',
        'https://report.url.cn/cgi-bin/tdbank?table_id=avweb_speed&busi_id=b_sng_im_personal_live&fields=%5B%22obj2%22%2C%22uin%22%2C%22module%22%2C%22offline%22%2C%22obj1%22%2C%22os%22%2C%22operator%22%2C%22os_version%22%2C%22page%22%2C%22source%22%2C%22action%22%2C%22time%22%2C%22obj3%22%2C%22obj4%22%5D&datas=%5B%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_start%22%2C224%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_css_ready%22%2C226%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_js_ready%22%2C395%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_main_start%22%2C395%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_main_end%22%2C437%2C0%2C0%5D%2C%5B%22Unknown%22%2C%22%22%2C%22now-h5-personal-center-verify-identity%22%2C0%2C%22%22%2C%22ios%22%2C%22%22%2C%2211.0%22%2C%22h5%2Fpersonal-center%2Fverify-identity.html%22%2C%221%22%2C%22page_render_end%22%2C448%2C0%2C0%5D%5D&pr_ip=obj3&pr_t=ts&_=0.6401450988632442',
      ],
    },
    isExistCoverageReport: true,
  },
};
