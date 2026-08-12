/* ═══════════════════════════════════════════════════════════════════════
   META PIXEL — Topcoat Media
   ═══════════════════════════════════════════════════════════════════════
   PARA ACTIVARLO: pega tu Pixel ID abajo y vuelve a desplegar. Eso es todo.
   Mientras esté vacío, este archivo no carga nada ni hace ninguna petición
   a Facebook, así que es seguro dejarlo así.

   Lo obtienes en: Meta Events Manager -> Orígenes de datos -> tu pixel.
   Son ~15 dígitos.

   Eventos que dispara solo:
     PageView     todas las páginas donde se incluya este archivo
     ViewContent  /vsl — cuando le dan play al video
     Lead         /vsl — cuando envían la aplicación (parámetro: calificado)
     Schedule     /thank-you — cuando ya agendaron la llamada
   ═══════════════════════════════════════════════════════════════════════ */
var TCM_PIXEL_ID = '';

(function (w, d) {
  'use strict';

  /* Guarda el fbclid del clic del anuncio. Sirve para atribuir la conversión
     más tarde desde el servidor (Conversions API) aunque el navegador bloquee
     el pixel. Se conserva 90 días, que es la ventana que usa Meta. */
  try {
    var fbclid = new URLSearchParams(w.location.search).get('fbclid');
    if (fbclid) {
      d.cookie = '_tcm_fbclid=' + encodeURIComponent(fbclid) +
                 ';max-age=' + (90 * 24 * 60 * 60) + ';path=/;SameSite=Lax';
    }
  } catch (e) { /* URLSearchParams no soportado: seguimos sin fbclid */ }

  w.tcmGetFbclid = function () {
    var m = d.cookie.match(/(?:^|;\s*)_tcm_fbclid=([^;]*)/);
    return m ? decodeURIComponent(m[1]) : '';
  };

  /* Id único por evento. Se manda igual al pixel y a Conversions API para que
     Meta deduplique y no cuente la misma conversión dos veces. */
  w.tcmEventId = function () {
    return 'tcm-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
  };

  if (!TCM_PIXEL_ID) {
    // Sin Pixel ID no cargamos nada. Devuelve '' y no undefined para que el
    // campo fb_event_id siga existiendo en el payload que va a n8n.
    w.tcmTrack = function () { return ''; };
    return;
  }

  /* Snippet oficial de Meta */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(w, d, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  w.fbq('init', TCM_PIXEL_ID);
  w.fbq('track', 'PageView');

  /* Helper que usan las páginas. Devuelve el eventID para poder reenviar el
     mismo evento por Conversions API. */
  w.tcmTrack = function (event, params) {
    if (!w.fbq) return '';
    var id = w.tcmEventId();
    w.fbq('track', event, params || {}, { eventID: id });
    return id;
  };
})(window, document);
