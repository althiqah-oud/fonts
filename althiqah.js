/* =============================================================
   ALTHIQAH OUD | INTERACTIVE SHOPPING GUIDE v1.3 (charcoal) - MOBILE UI FIX
   Salla Custom JavaScript - paste without <script> tags.
   Remove the entire custom JS to revert. No dependencies.
   Does not access cart, checkout, prices, accounts, or cookies.
   ============================================================= */
(function () {
  'use strict';

  if (window.__ALTHIQAH_GUIDE_V1__) return;
  window.__ALTHIQAH_GUIDE_V1__ = true;

  const BASE = 'https://althiqah-oud.com';
  const WHATSAPP = '966543896681';
  const POLICY = BASE + '/سياسة-الإستبدال-والإسترجاع/page-1246479696';

  const products = {
    cambodi: {
      name: 'دهن عود كمبودي ملكي معتق',
      type: 'حلو ودافي بلمسة عسلية', age: '10 سنوات', hold: 'حتى 9 أيام على الملابس',
      usage: 'فخم ويعجب أغلب الناس، الأنسب للمناسبات والهدايا',
      link: BASE + '/oud-cambodi-royal-honey-aged/p1069765549'
    },
    siyufi: {
      name: 'دهن عود سيوفي الثقة المعتق',
      type: 'قوي وفوّاح، يوصل قبلك', age: '10 سنوات', hold: 'حتى 11 يومًا على الملابس',
      usage: 'لمحبي العود الواضح والحضور القوي في المناسبات',
      link: BASE + '/oud-siyufi-althiqah-aged/p1552763393'
    },
    trad: {
      name: 'دهن عود تراد معتق',
      type: 'هادي ونظيف وناعم', age: '3 سنوات', hold: 'حتى 72 ساعة على الملابس',
      usage: 'ما يزعج اللي حولك، مثالي للدوام والاستخدام اليومي',
      link: BASE + '/oud-trad/p1379699091'
    },
    hatab: {
      name: 'دهن عود تراد الحطب معتق',
      type: 'بخوري سويتي قوي', age: '3 سنوات', hold: 'حتى 72 ساعة على الملابس',
      usage: 'كأنك توّك متبخّر، لمحبي العود في يومهم',
      link: BASE + '/oud-trad-alhatab/p180817303'
    },
    hindi: {
      name: 'دهن عود سيوفي هندي معتق',
      type: 'عود صريح وثقيل، حاد في بدايته', age: 'قرابة 5 سنوات', hold: 'حتى 72 ساعة على الملابس',
      usage: 'لخبراء العود ومحبي الطابع الرسمي الثقيل',
      link: BASE + '/oud-seufi-hindi/p666077198'
    }
  };

  const packages = {
    one: {
      name: 'بكج التميز',
      includes: 'أوقية بخور كمبودي (30 جرام) + ربع تولة دهن عود معتق من اختيارك',
      who: 'يناسب اللي يبي دهن واحد مع بخوره',
      link: BASE + '/oud-and-bukhoor-tamayuz-package/p1904906924'
    },
    two: {
      name: 'بكج النخبة',
      includes: 'أوقية بخور كمبودي (30 جرام) + عبوتين دهن عود، كل وحدة ربع تولة',
      who: 'يناسب اللي يحب ينوّع، وأجمل خيار للإهداء',
      link: BASE + '/oud-and-bukhoor-nokhba-package/p1814947677'
    }
  };

  const articles = [
    {name: 'أنواع دهن العود', topic: 'الفرق بين الكمبودي والهندي والسيوفي والتراد', link: BASE + '/blog/anwa-dehn-al-oud/a-1579745703'},
    {name: 'تراد أم تراد الحطب؟', topic: 'أيهم يناسبك', link: BASE + '/blog/trad-vs-trad-alhatab/a-1381008070'},
    {name: 'حفظ دهن العود', topic: 'عشان يبقى معك أطول', link: BASE + '/blog/oud-oil-storage-guide/a-2007576003'}
  ];

  const tabs = [
    ['oud', 'اختر دهنك'],
    ['gift', 'البكجات'],
    ['compare', 'قارن'],
    ['guides', 'اقرأ عن العود'],
    ['guarantee', 'الضمان الذهبي']
  ];

  const state = {
    open: false,
    tab: 'oud',
    level: 'new',
    occasion: 'daily',
    scent: 'skip',
    budget: 'any',
    gift: 'one',
    left: 'trad',
    right: 'hatab'
  };

  let root, backdrop, panel, launcher, scrollButton;
  let previousFocus = null;
  let oldBodyOverflow = '';

  const html = (value) => String(value).replace(/[&<>"']/g, function (char) {
    return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char];
  });

  function externalLink(url, label, className) {
    return '<a class="' + (className || 'thq-link') + '" href="' + html(url) + '" target="_blank" rel="noopener noreferrer">' + html(label) + '</a>';
  }

  function currentProduct() {
    const match = location.pathname.match(/\/p(\d+)(?:\/|$)/);
    if (!match) return null;
    return Object.values(products).find(function (p) {
      return p.link.endsWith('/p' + match[1]);
    }) || Object.values(packages).find(function (p) {
      return p.link.endsWith('/p' + match[1]);
    }) || (match[1] === '1885538125' ? {name: 'بخور كمبودي فاخر'} : null);
  }

  function whatsAppUrl() {
    const item = currentProduct();
    const subject = item ? 'المنتج: ' + item.name : 'منتجات الثقة للعود';
    const cleanPage = location.origin + location.pathname;
    const message = 'السلام عليكم، عندي استفسار عن ' + subject + '.\nرابط الصفحة: ' + cleanPage;
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message);
  }

  function chooseButton(key, label, current, attr) {
    const selected = key === current;
    return '<button type="button" class="thq-choice' + (selected ? ' is-active' : '') + '" ' +
      attr + '="' + html(key) + '" aria-pressed="' + selected + '">' + html(label) + '</button>';
  }

  function productSummary(product, note) {
    return '<div class="thq-result">' +
      '<div class="thq-eyebrow">نرشّح لك</div>' +
      '<h3>' + html(product.name) + '</h3>' +
      '<p>' + html(product.usage) + '</p>' +
      '<dl class="thq-facts">' +
        '<div><dt>الريحة</dt><dd>' + html(product.type) + '</dd></div>' +
        '<div><dt>التعتيق</dt><dd>' + html(product.age) + '</dd></div>' +
        '<div><dt>الثبات</dt><dd>' + html(product.hold) + '</dd></div>' +
      '</dl>' +
      (note ? '<p class="thq-note">' + html(note) + '</p>' : '') +
      externalLink(product.link, 'شوف المنتج ←', 'thq-primary thq-inline-action') +
      '</div>';
  }

  // Prices in SAR (update here if prices change). null = not used in budget filtering.
  const PRICES = { trad: 197, hatab: 197, siyufi: 263, cambodi: 413, hindi: null };
  // If the pick is over budget, suggest this alternative instead.
  const FALLBACK = { cambodi: 'trad', siyufi: 'hatab', hindi: 'hatab' };

  function renderOud() {
    const levels = [
      ['new', 'أول مرة أجرب دهن العود'],
      ['pro', 'متعوّد على دهن العود']
    ];
    const occasions = [
      ['daily', 'الدوام واليومي'],
      ['event', 'المناسبات'],
      ['gift', 'هدية']
    ];
    const scents = [
      ['trad', 'هادية وناعمة'],
      ['cambodi', 'حلوة ودافية، فيها عسلية'],
      ['hatab', 'كأنك متبخّر'],
      ['siyufi', 'قوية وفوّاحة'],
      ['hindi', 'عود صريح وثقيل'],
      ['skip', 'مو متأكد، اختار لي']
    ];
    const budgets = [
      ['low', 'أقل من 200'],
      ['mid', 'من 200 إلى 300'],
      ['any', 'ما تفرق']
    ];
    const map = {
      'new-daily': 'trad', 'new-event': 'cambodi', 'new-gift': 'cambodi',
      'pro-daily': 'hatab', 'pro-event': 'siyufi', 'pro-gift': 'cambodi'
    };
    const key = state.level + '-' + state.occasion;
    let pick = state.scent !== 'skip' ? state.scent : map[key];
    let note = '';
    if (state.scent === 'skip') {
      if (key === 'pro-event') note = 'تحب العود الحاد والثقيل؟ جرّب السيوفي الهندي';
      if (key === 'new-daily') note = 'تبي ريحة أقوى شوي؟ جرّب تراد الحطب';
    } else {
      if (state.occasion === 'daily' && (pick === 'siyufi' || pick === 'hindi')) note = 'ريحته قوية، للدوام يكفيك كمية خفيفة';
      if (state.level === 'new' && pick === 'hindi') note = 'الهندي حاد في بدايته، وإذا أول مرة تجرب ممكن تبدأ بالكمبودي';
      if (state.occasion === 'gift' && pick !== 'cambodi') note = 'للهدايا، الكمبودي يعجب أغلب الناس';
    }
    const limit = state.budget === 'low' ? 200 : state.budget === 'mid' ? 300 : Infinity;
    const price = PRICES[pick];
    if (price && price > limit && FALLBACK[pick]) {
      note = 'وإذا تبي الأفخم: ' + products[pick].name + '.';
      pick = FALLBACK[pick];
    }
    return '<div class="thq-intro"><h2>نختار لك دهنك</h2>' +
      '<p>جاوب الأسئلة، ونرشح لك الأنسب</p></div>' +
      '<div class="thq-field"><strong>١. علاقتك بدهن العود؟</strong><div class="thq-choices thq-choices--wide">' +
      levels.map(function (x) { return chooseButton(x[0], x[1], state.level, 'data-thq-level'); }).join('') +
      '</div></div>' +
      '<div class="thq-field"><strong>٢. وين بتستخدمه؟</strong><div class="thq-choices">' +
      occasions.map(function (x) { return chooseButton(x[0], x[1], state.occasion, 'data-thq-occasion'); }).join('') +
      '</div></div>' +
      '<div class="thq-field"><strong>٣. تعرف وش تحب في الريحة؟ <small style="font-weight:400;opacity:.7">(اختياري)</small></strong><div class="thq-choices">' +
      scents.map(function (x) { return chooseButton(x[0], x[1], state.scent, 'data-thq-scent'); }).join('') +
      '</div></div>' +
      '<div class="thq-field"><strong>٤. كم ميزانيتك تقريباً؟</strong><div class="thq-choices">' +
      budgets.map(function (x) { return chooseButton(x[0], x[1], state.budget, 'data-thq-budget'); }).join('') +
      '</div></div>' + productSummary(products[pick], note);
  }

  function renderGift() {
    const chosen = packages[state.gift];
    return '<div class="thq-intro"><h2>هدية تليق، أو لك أنت</h2>' +
      '<p>كل بكج فيه بخور كمبودي مع دهن عود معتق من اختيارك</p></div>' +
      '<div class="thq-field"><strong>كم دهن تبي مع البخور؟</strong>' +
      '<div class="thq-choices thq-choices--wide">' +
      chooseButton('one', 'دهن واحد + بخور', state.gift, 'data-thq-gift') +
      chooseButton('two', 'دهنين + بخور', state.gift, 'data-thq-gift') +
      '</div></div>' +
      '<div class="thq-result"><div class="thq-eyebrow">البكج المناسب</div>' +
      '<h3>' + html(chosen.name) + '</h3>' +
      '<p>' + html(chosen.includes) + '</p><p>' + html(chosen.who) + '</p>' +
      externalLink(chosen.link, 'شوف البكج ←', 'thq-primary thq-inline-action') +
      '</div>';
  }

  function renderCompare() {
    const order = ['trad', 'hatab', 'cambodi', 'siyufi', 'hindi'];
    return '<div class="thq-intro"><h2>كل الأدهان قدامك</h2>' +
      '<p>من الأهدى إلى الأقوى</p></div>' +
      '<div class="thq-guides">' + order.map(function (k) {
        const p = products[k];
        return '<a class="thq-guide-row thq-cmp-row" href="' + html(p.link) + '">' +
          '<span class="thq-guide-copy"><strong>' + html(p.name) + '</strong>' +
          '<small>' + html(p.type) + '</small>' +
          '<small>التعتيق: ' + html(p.age) + ' · الثبات: ' + html(p.hold) + '</small></span>' +
          '<span aria-hidden="true">←</span></a>';
      }).join('') + '</div>';
  }

  function renderGuides() {
    return '<div class="thq-intro"><h2>اقرأ عن العود</h2>' +
      '<p>مقالات قصيرة تساعدك تختار صح</p></div>' +
      '<div class="thq-guides">' + articles.map(function (a, index) {
        return '<a class="thq-guide-row" href="' + html(a.link) + '">' +
          '<span class="thq-guide-num">' + (index + 1) + '</span>' +
          '<span class="thq-guide-copy"><strong>' + html(a.name) + '</strong>' +
          '<small>' + html(a.topic) + '</small></span><span aria-hidden="true">←</span></a>';
      }).join('') + '</div>';
  }

  function renderGuarantee() {
    return '<div class="thq-intro"><h2>جرّب قبل ما تقرر</h2></div>' +
      '<div class="thq-guarantee">' +
      '<h3>ثقتنا بعودنا تخليك تجرب براحتك</h3>' +
      '<p>جرّب الدهن بمسحة خفيفة على قماش أو منديل، والبخور بكسرة وحدة. وإذا ما ناسبك، تقدر تسترجعه حسب سياسة الاسترجاع</p>' +
      '<div class="thq-actions">' + externalLink(POLICY, 'سياسة الاسترجاع ←', 'thq-primary thq-inline-action') +
      externalLink(whatsAppUrl(), 'كلّمنا واتساب', 'thq-secondary thq-inline-action') +
      '</div></div>';
  }

  function renderPanel() {
    if (!panel) return;
    const views = {oud:renderOud, gift:renderGift, compare:renderCompare,
                   guides:renderGuides, guarantee:renderGuarantee};
    const content = panel.querySelector('.thq-body');
    if (!content) return;
    content.innerHTML = views[state.tab]();
    panel.querySelectorAll('[data-thq-tab]').forEach(function (button) {
      const active = button.getAttribute('data-thq-tab') === state.tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
  }

  function openGuide(tab) {
    if (!root) return;
    if (tabs.some(function (x) { return x[0] === tab; })) state.tab = tab;
    previousFocus = document.activeElement;
    renderPanel();
    oldBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    backdrop.hidden = false;
    state.open = true;
    launcher.setAttribute('aria-expanded', 'true');
    const closeButton = panel.querySelector('[data-thq-close]');
    if (closeButton) closeButton.focus({preventScroll:true});
  }

  function closeGuide() {
    if (!state.open) return;
    state.open = false;
    backdrop.hidden = true;
    document.body.style.overflow = oldBodyOverflow;
    launcher.setAttribute('aria-expanded', 'false');
    if (previousFocus && typeof previousFocus.focus === 'function' && previousFocus.isConnected) {
      previousFocus.focus({preventScroll:true});
    } else {
      launcher.focus({preventScroll:true});
    }
  }

  function onKeyDown(event) {
    if (!state.open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeGuide();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(panel.querySelectorAll(
      'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled])'
    )).filter(function (el) { return el.getClientRects().length > 0 && el.tabIndex >= 0; });
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }

  function shouldSkip() {
    const path = location.pathname.toLowerCase();
    // Never run the guide on checkout, payment, account or cart flows.
    return /(?:^|\/)(checkout|cart|payment|pay|account|login|register|orders|order-confirmation|thank-you)(?:\/|$)/.test(path);
  }

  function isHomepage() {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    return path === '/' || path === '/ar' || path === '/en';
  }

  function addHomeSection() {
    if (!isHomepage() || document.getElementById('thq-home-guide')) return;
    const main = document.querySelector('main');
    if (!main) return;
    const home = document.createElement('section');
    home.id = 'thq-home-guide';
    home.setAttribute('aria-label', 'مساعد اختيار العود');
    home.innerHTML =
      '<div class="thq-home-copy"><span class="thq-home-kicker">دليلك من الثقة</span>' +
      '<h2>محتار أي عود يناسبك؟</h2>' +
      '<p>جاوب كم سؤال، ونختار لك الأقرب لذوقك</p>' +
      '<div class="thq-home-actions">' +
      '<button type="button" data-thq-open="oud">اكتشف ذوقك ←</button>' +
      '<button type="button" data-thq-open="gift">اختار هدية</button>' +
      '<button type="button" data-thq-open="compare">قارن الأدهان</button>' +
      '</div></div><div class="thq-home-decoration" aria-hidden="true"><b>الثقة</b><span>للعود</span></div>';
    const hero = main.querySelector('.s-block--photos-slider, .s-block--fixed-banner, .s-block--banners');
    const block = hero ? (hero.closest('.s-block') || hero) : null;
    if (block && block.parentElement) block.insertAdjacentElement('afterend', home);
    else main.insertAdjacentElement('afterbegin', home);
    home.addEventListener('click', function (event) {
      const button = event.target.closest('[data-thq-open]');
      if (button) openGuide(button.getAttribute('data-thq-open'));
    });
  }


  // Paint the "shop by category" section in sand beige (works with any theme markup, incl. shadow DOM).
  const CAT_TITLE = '\u062a\u0633\u0648\u0642 \u062d\u0633\u0628 \u0627\u0644\u062a\u0635\u0646\u064a\u0641';
  function findTitle(rootNode) {
    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT);
    let node = walker.currentNode;
    while (node) {
      if (node.shadowRoot) {
        const inner = findTitle(node.shadowRoot);
        if (inner) return inner;
      }
      if (node.children && node.children.length === 0 && (node.textContent || '').indexOf(CAT_TITLE) !== -1) return node;
      node = walker.nextNode();
    }
    return null;
  }
  function parentOf(el) {
    return el.parentElement || (el.getRootNode && el.getRootNode().host) || null;
  }
  // Change these 3 values to try another color.
  const CAT_BG = '#34322f';      // images area (lighter than title band)
  const CAT_TITLE_BG = '#262523'; // title band (a touch lighter than the gold)
  const CAT_TEXT = '#f3ece0';    // titles
  const CAT_MUTED = '#cbbfa9';   // subtitle
  function paintCategories() {
    // Find the categories section by its content (3 category names + images), not by its title,
    // so it keeps working if the section title is edited.
    const NAMES = ['\u0627\u0644\u0628\u062e\u0648\u0631', '\u062f\u0647\u0646 \u0627\u0644\u0639\u0648\u062f', '\u0627\u0644\u0628\u0643\u062c\u0627\u062a'];
    const imgCount = function (el) {
      let n = el.querySelectorAll ? el.querySelectorAll('img').length : 0;
      if (el.shadowRoot) n += el.shadowRoot.querySelectorAll('img').length;
      return n;
    };
    const textOf = function (el) {
      return (el.textContent || '') + (el.shadowRoot ? el.shadowRoot.textContent || '' : '');
    };
    const main = document.querySelector('main') || document.body;
    const findLeaf = function (rootNode) {
      const w = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT);
      let n = w.currentNode;
      while (n) {
        const skip = n.closest && n.closest('header, nav, footer, #thq-assistant, #thq-home-guide');
        if (!skip) {
          if (n.shadowRoot) { const r = findLeaf(n.shadowRoot); if (r) return r; }
          if (n.children && n.children.length === 0 && (n.textContent || '').trim() === NAMES[2]) return n;
        }
        n = w.nextNode();
      }
      return null;
    };
    const title = findLeaf(main);
    if (!title) return false;
    let sec = title;
    while (sec && sec !== document.body && !(imgCount(sec) >= 3 && NAMES.every(function (n) { return textOf(sec).indexOf(n) !== -1; }))) sec = parentOf(sec);
    if (!sec || sec === document.body || sec.tagName === 'MAIN') return false;
    const gridEl = sec;
    const full = document.documentElement.clientWidth * 0.85;
    while (sec.getBoundingClientRect().width < full) {
      const up = parentOf(sec);
      if (!up || up === document.body || up.tagName === 'MAIN' || imgCount(up) > imgCount(sec)) break;
      sec = up;
    }
    if (sec.dataset.thqPainted) return true;
    // Climb to the whole section so it includes the title too.
    const headingSel = 'h1, h2, h3, [class*="title"]';
    const headingIn = function (root, skip) {
      const list = root.querySelectorAll(headingSel);
      for (let i = 0; i < list.length; i++) {
        const h = list[i];
        if (skip && skip.contains(h)) continue;
        if (h.querySelector('img')) continue;
        const t = (h.textContent || '').trim();
        if (!t || NAMES.indexOf(t) !== -1) continue;
        return h;
      }
      return null;
    };
    let outer = sec, heading = headingIn(sec, null), steps = 0;
    while (!heading && steps < 5) {
      const up = parentOf(outer);
      if (!up || up === document.body || up.tagName === 'MAIN') break;
      outer = up; steps++;
      heading = headingIn(outer, sec);
    }
    outer.dataset.thqPainted = '1';
    if (!document.getElementById('thq-cats')) outer.id = outer.id || 'thq-cats';
    sec.dataset.thqPainted = '1';
    const fullBleed = function (el, color) {
      el.style.setProperty('background', color, 'important');
      el.style.setProperty('box-shadow', '0 0 0 100vmax ' + color, 'important');
      el.style.setProperty('clip-path', 'inset(0 -100vmax)', 'important');
    };
    fullBleed(outer, CAT_BG);
    outer.style.setProperty('padding-bottom', '40px', 'important');
    // Title band
    let band = null;
    if (heading) {
      band = heading;
      while (band && parentOf(band) && parentOf(band) !== outer) band = parentOf(band);
      if (band && band !== sec && !band.contains(sec)) {
        fullBleed(band, CAT_TITLE_BG);
        band.style.setProperty('padding-top', '34px', 'important');
        band.style.setProperty('padding-bottom', '26px', 'important');
        band.style.setProperty('margin-bottom', '30px', 'important');
      } else {
        band = null;
      }
    }
    if (sec !== outer) {
      sec.style.setProperty('background', 'transparent', 'important');
    }
    const all = [];
    const collect = function (node) {
      node.querySelectorAll('*').forEach(function (d) {
        all.push(d);
        if (d.shadowRoot) collect(d.shadowRoot);
      });
    };
    collect(outer);
    // Sharp corners on category images and cards
    all.forEach(function (d) { if (d.tagName === 'IMG' || d.querySelector && d.querySelector('img')) d.style.setProperty('border-radius', '14px', 'important'); });
    all.forEach(function (d) {
      if (d.tagName === 'IMG' || d === band) return;
      const bg = getComputedStyle(d).backgroundColor;
      if ((bg === 'rgb(255, 255, 255)' || bg.indexOf('rgb(25') === 0) && !d.querySelector('img')) {
        d.style.setProperty('background', 'transparent', 'important');
      }
      if (/^(H1|H2|H3|H4|A|SPAN|STRONG|B)$/.test(d.tagName)) d.style.setProperty('color', CAT_TEXT, 'important');
      const KASH = {'\u0627\u0644\u0628\u062e\u0648\u0631': '\u0627\u0644\u0628\u062e\u0640\u0640\u0640\u0640\u0648\u0631', '\u0627\u0644\u0628\u0643\u062c\u0627\u062a': '\u0627\u0644\u0628\u0643\u062c\u0640\u0640\u0640\u0640\u0627\u062a', '\u062f\u0647\u0646 \u0627\u0644\u0639\u0648\u062f': '\u062f\u0647\u0646 \u0627\u0644\u0639\u0640\u0640\u0640\u0640\u0648\u062f'};
      const tx = (d.textContent || '').trim();
      if (KASH[tx] && d.children.length === 0) d.textContent = KASH[tx];
      if (window.innerWidth <= 740 && gridEl && gridEl.contains(d) && (NAMES.indexOf(tx) !== -1) && !d.querySelector('img')) {
        d.style.setProperty('font-size', '16px', 'important');
      }
      if (/^(P|SMALL)$/.test(d.tagName)) d.style.setProperty('color', CAT_MUTED, 'important');
    });

    // Layout option 1: packs big on top, oil + bakhoor below, names over images
    (function () {
      let grid = gridEl;
      while (grid && grid.children.length === 1) grid = grid.children[0];
      if (!grid) return;
      const cards = Array.prototype.filter.call(grid.children, function (c) { return c.querySelector('img'); });
      if (cards.length < 3) return;
      grid.style.setProperty('display', 'grid', 'important');
      grid.style.setProperty('grid-template-columns', 'repeat(2, minmax(0, 1fr))', 'important');
      grid.style.setProperty('gap', '12px', 'important');
      grid.style.setProperty('max-width', '920px', 'important');
      grid.style.setProperty('margin', '0 auto', 'important');
      grid.style.setProperty('padding', '0 16px', 'important');
      grid.style.setProperty('box-sizing', 'border-box', 'important');
      grid.style.setProperty('transform', 'none', 'important');
      cards.forEach(function (c) {
        const t = textOf(c).replace(/ـ/g, '');
        const isPack = t.indexOf(NAMES[2]) !== -1;
        const isOil = t.indexOf(NAMES[1]) !== -1;
        ['width', 'max-width', 'min-width'].forEach(function (k) { c.style.setProperty(k, k === 'width' ? 'auto' : 'none', 'important'); });
        c.style.setProperty('margin', '0', 'important');
        c.style.setProperty('flex', 'none', 'important');
        c.style.setProperty('order', isPack ? '0' : (isOil ? '1' : '2'), 'important');
        c.style.setProperty('grid-column', isPack ? '1 / -1' : 'auto', 'important');
        c.style.setProperty('position', 'relative', 'important');
        c.style.setProperty('overflow', 'hidden', 'important');
        c.style.setProperty('border-radius', '16px', 'important');
        c.style.setProperty('padding', '0', 'important');
        const img = c.querySelector('img');
        let wrap = img.parentElement;
        while (wrap && wrap !== c) {
          ['margin', 'padding'].forEach(function (k) { wrap.style.setProperty(k, '0', 'important'); });
          wrap.style.setProperty('border-radius', '0', 'important');
          wrap.style.setProperty('height', 'auto', 'important');
          wrap.style.setProperty('aspect-ratio', 'auto', 'important');
          wrap = wrap.parentElement;
        }
        img.style.setProperty('display', 'block', 'important');
        img.style.setProperty('width', '100%', 'important');
        img.style.setProperty('height', 'auto', 'important');
        img.style.setProperty('aspect-ratio', isPack ? '16 / 11' : '1 / 1', 'important');
        img.style.setProperty('object-fit', 'cover', 'important');
        img.style.setProperty('border-radius', '0', 'important');
        img.style.setProperty('margin', '0', 'important');
        let label = null;
        c.querySelectorAll('*').forEach(function (el) {
          if (label || el.children.length) return;
          const tx = (el.textContent || '').trim().replace(/ـ/g, '');
          if (NAMES.indexOf(tx) !== -1) label = el;
        });
        if (!label || label.dataset.thqLbl) return;
        label.dataset.thqLbl = '1';
        const box = label.parentElement && label.parentElement !== c && label.parentElement.children.length === 1 ? label.parentElement : label;
        box.style.setProperty('position', 'absolute', 'important');
        box.style.setProperty('inset', 'auto 0 0 0', 'important');
        box.style.setProperty('margin', '0', 'important');
        box.style.setProperty('padding', '46px 16px 14px', 'important');
        box.style.setProperty('background', 'linear-gradient(180deg, rgba(20,16,12,0), rgba(20,16,12,.85))', 'important');
        box.style.setProperty('text-align', 'right', 'important');
        box.style.setProperty('z-index', '2', 'important');
        label.style.setProperty('color', '#f6efe2', 'important');
        label.style.setProperty('margin', '0', 'important');
        label.style.setProperty('font-size', isPack ? '24px' : '18px', 'important');
        label.style.setProperty('font-weight', '700', 'important');
        label.style.setProperty('display', 'block', 'important');
        const hint = document.createElement('span');
        hint.textContent = isPack ? 'هدية تليق ←' : 'تسوّق ←';
        hint.style.cssText = 'position:absolute;left:16px;bottom:16px;font-size:12.5px;color:#dcc7a0;font-weight:500;';
        box.appendChild(hint);
      });
    })();
    return true;
  }

  function onRootClick(event) {
    const target = event.target.closest('[data-thq-close], [data-thq-tab], [data-thq-level], [data-thq-occasion], [data-thq-scent], [data-thq-budget], [data-thq-gift], [data-thq-top]');
    if (!target) {
      if (event.target === backdrop) closeGuide();
      return;
    }
    if (target.hasAttribute('data-thq-close')) return closeGuide();
    if (target.hasAttribute('data-thq-tab')) {
      state.tab = target.getAttribute('data-thq-tab');
      renderPanel();
      panel.querySelector('.thq-content-scroll').scrollTop = 0;
      return;
    }
    if (target.hasAttribute('data-thq-level')) state.level = target.getAttribute('data-thq-level');
    if (target.hasAttribute('data-thq-scent')) state.scent = target.getAttribute('data-thq-scent');
    if (target.hasAttribute('data-thq-budget')) state.budget = target.getAttribute('data-thq-budget');
    if (target.hasAttribute('data-thq-occasion')) state.occasion = target.getAttribute('data-thq-occasion');
    if (target.hasAttribute('data-thq-gift')) state.gift = target.getAttribute('data-thq-gift');
    if (target.hasAttribute('data-thq-top')) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({top:0, behavior:reduced ? 'auto' : 'smooth'});
      return;
    }
    renderPanel();
  }

  function onRootChange(event) {
    const select = event.target.closest('[data-thq-compare]');
    if (!select || !Object.prototype.hasOwnProperty.call(products, select.value)) return;
    const side = select.getAttribute('data-thq-compare');
    if (side === 'left' || side === 'right') {
      state[side] = select.value;
      renderPanel();
      const replacement = panel.querySelector('[data-thq-compare="' + side + '"]');
      if (replacement) replacement.focus({preventScroll:true});
    }
  }

  function installStyles() {
    const css = `
/* Scoped entirely to Althiqah's own elements. */
#thq-assistant, #thq-home-guide { --thq-dark:#2a2a2a; --thq-green:#2b2b2b; --thq-gold:#c4a06d; --thq-cream:#faf7f0; --thq-line:#e7ded0; --thq-text:#262626; font-family:inherit; direction:rtl; }
#thq-assistant *, #thq-home-guide, #thq-home-guide * { box-sizing:border-box; }
#thq-assistant [hidden] { display:none !important; }
#thq-assistant button, #thq-home-guide button { font-family:inherit; cursor:pointer; }
#thq-assistant .thq-launcher { position:fixed; z-index:99998; bottom:22px; left:22px; padding:11px 16px; border:1px solid #d1b584; border-radius:999px; background:var(--thq-dark); color:#fff8eb; font-size:14px; font-weight:700; box-shadow:0 8px 28px rgba(0,0,0,.22); display:flex; align-items:center; gap:9px; line-height:1.5; }
#thq-assistant .thq-launcher:hover { background:#444444; }
#thq-assistant .thq-launcher-mark { color:#efd29b; font-size:17px; }
#thq-assistant .thq-top { position:fixed; bottom:78px; left:25px; z-index:99997; width:39px; height:39px; border-radius:50%; border:1px solid #ded0b9; color:#2b2b2b; background:#fffefa; box-shadow:0 5px 17px rgba(0,0,0,.13); display:none; align-items:center; justify-content:center; font-size:20px; }
#thq-assistant .thq-top, #thq-assistant .thq-top.is-visible { display:none !important; }
#thq-assistant .thq-backdrop { position:fixed; z-index:999999; inset:0; background:rgba(18,18,18,.65); display:flex; align-items:center; justify-content:center; padding:22px; }
#thq-assistant .thq-dialog { width:min(860px,100%); max-height:min(91dvh,850px); background:#fffdf9; color:var(--thq-text); border:1px solid #d2b98e; border-radius:0; box-shadow:0 25px 75px rgba(0,0,0,.32); display:flex; flex-direction:column; overflow:hidden; position:relative; direction:rtl; }
#thq-assistant .thq-header { background:linear-gradient(135deg,#3a3a3a,#1c1c1c); color:#fff6e7; display:flex; align-items:center; justify-content:space-between; padding:18px 23px; gap:15px; }
#thq-assistant .thq-brand { display:flex; flex-direction:column; gap:2px; }
#thq-assistant .thq-brand strong { font-size:20px; color:#f2d49b; }
#thq-assistant .thq-brand small { font-size:12px; color:#f5ede0; opacity:.9; }
#thq-assistant .thq-close { color:#fff; border:1px solid rgba(255,255,255,.28); background:rgba(255,255,255,.09); border-radius:0; width:39px; height:39px; font-size:25px; line-height:1; }
#thq-assistant .thq-close:hover { background:rgba(255,255,255,.17); }
#thq-assistant .thq-tabs { display:flex; gap:7px; overflow-x:auto; border-bottom:1px solid var(--thq-line); padding:11px 15px; background:#fcfaf6; scrollbar-width:thin; }
#thq-assistant .thq-tab { white-space:nowrap; border:1px solid transparent; border-radius:0; background:transparent; color:#504b42; padding:9px 12px; font-size:13px; font-weight:650; flex:0 0 auto; }
#thq-assistant .thq-tab:hover { background:#f4eddf; }
#thq-assistant .thq-tab.is-active { background:#eae0d0; color:#262626; border-color:#d6c4a7; }
#thq-assistant .thq-content-scroll { overflow-y:auto; overscroll-behavior:contain; padding:22px 26px 24px; min-height:160px; }
#thq-assistant .thq-body { max-width:780px; margin:auto; }
#thq-assistant .thq-intro h2 { font-size:23px; margin:0 0 7px; line-height:1.55; color:#262626; font-weight:800; }
#thq-assistant .thq-intro p { margin:0 0 20px; line-height:1.9; color:#686358; font-size:14px; }
#thq-assistant .thq-field { margin:18px 0 23px; }
#thq-assistant .thq-field>strong { display:block; font-size:14px; color:#333333; margin-bottom:11px; }
#thq-assistant .thq-choices { display:flex; flex-wrap:wrap; gap:9px; }
#thq-assistant .thq-choice { border:1px solid #dbcebc; background:#fff; color:#4a4439; padding:11px 15px; border-radius:0; font-size:13px; font-weight:650; transition:background-color .2s, border-color .2s; text-align:right; }
#thq-assistant .thq-choice:hover { border-color:#b29566; background:#faf5e9; }
#thq-assistant .thq-choice.is-active { background:#efe8dc; border-color:#b29566; color:#262626; box-shadow:inset 0 0 0 1px #b29566; }
#thq-assistant .thq-choices--wide .thq-choice { flex:1 1 180px; }
#thq-assistant .thq-result { padding:21px; background:linear-gradient(140deg,#f3eee4,#fcfaf4); border:1px solid #dac5a4; border-radius:0; }
#thq-assistant .thq-eyebrow { font-size:12px; color:#82622e; font-weight:800; margin-bottom:6px; }
#thq-assistant .thq-result h3 { font-size:20px; margin:0 0 8px; color:#262626; font-weight:800; }
#thq-assistant .thq-result p { font-size:14px; line-height:1.9; color:#5b5347; margin:0 0 12px; }
#thq-assistant .thq-facts, #thq-assistant .thq-compare-facts { margin:13px 0 16px; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:9px; }
#thq-assistant .thq-facts>div, #thq-assistant .thq-compare-facts>div { background:rgba(255,255,255,.75); border:1px solid #e6ddce; border-radius:0; padding:10px; }
#thq-assistant dt { font-size:11px; color:#847b6e; margin-bottom:5px; }
#thq-assistant dd { margin:0; font-size:12px; line-height:1.6; font-weight:750; color:#2b2b2b; }
#thq-assistant .thq-note { font-size:12px !important; color:#726d63 !important; line-height:1.8; }
#thq-assistant .thq-primary, #thq-assistant .thq-secondary { display:inline-flex; align-items:center; justify-content:center; text-decoration:none !important; border-radius:0; min-height:41px; padding:10px 15px; font-size:13px; font-weight:750; line-height:1.6; max-width:100%; }
#thq-assistant .thq-primary { background:#2b2b2b; color:#fff !important; border:1px solid #2b2b2b; }
#thq-assistant .thq-primary:hover { background:#444444; }
#thq-assistant .thq-secondary { color:#2b2b2b !important; border:1px solid #c9b692; background:#fffefa; }
#thq-assistant .thq-secondary:hover { background:#f7f1e5; }
#thq-assistant .thq-inline-action { margin-top:4px; }
#thq-assistant .thq-compare-selects { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:13px; margin-bottom:17px; }
#thq-assistant .thq-compare-selects label { display:flex; flex-direction:column; gap:7px; font-weight:750; font-size:13px; }
#thq-assistant .thq-compare-selects select { width:100%; border:1px solid #d9ccb8; border-radius:0; padding:12px; color:#262626; background:#fff; font-size:13px; }
#thq-assistant .thq-compare-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:13px; }
#thq-assistant .thq-compare-card { border:1px solid #e1d4c2; border-radius:0; padding:15px; background:#fcfaf6; min-width:0; }
#thq-assistant .thq-compare-card h3 { margin:0 0 14px; color:#262626; font-size:16px; line-height:1.7; }
#thq-assistant .thq-compare-facts { grid-template-columns:1fr; gap:7px; }
#thq-assistant .thq-guides { display:grid; gap:9px; }
#thq-assistant .thq-guide-row { display:flex; align-items:center; gap:12px; color:#2b2b2b !important; background:#fff; border:1px solid #e7ddcd; border-radius:0; padding:12px 13px; text-decoration:none !important; }
#thq-assistant .thq-guide-row:hover { border-color:#bca173; background:#faf7f1; }
#thq-assistant .thq-guide-num { width:32px; height:32px; border-radius:0; display:grid; place-items:center; background:#efe6d5; color:#735c3b; font-weight:800; flex-shrink:0; }
#thq-assistant .thq-guide-copy { display:flex; flex-direction:column; flex:1; min-width:0; }
#thq-assistant .thq-guide-copy strong { font-size:14px; line-height:1.6; }
#thq-assistant .thq-guide-copy small { font-size:12px; line-height:1.6; color:#7c756a; }
#thq-assistant .thq-cmp-row .thq-guide-copy { gap:2px; }
#thq-assistant .thq-guarantee { border-radius:0; background:#f6f1e6; padding:21px; border:1px solid #dfcba8; }
#thq-assistant .thq-guarantee-icon { display:grid; place-items:center; border-radius:50%; background:#2b2b2b; color:#edd4a3; height:47px; width:47px; font-size:27px; margin-bottom:12px; }
#thq-assistant .thq-guarantee h3 { color:#262626; margin:0 0 12px; font-size:18px; }
#thq-assistant .thq-guarantee p { color:#5b574e; font-size:14px; line-height:1.95; }
#thq-assistant .thq-actions { display:flex; flex-wrap:wrap; gap:9px; }
#thq-assistant .thq-footer { border-top:1px solid #e7dfd2; padding:11px 22px; background:#fcfaf6; display:flex; align-items:center; justify-content:flex-end; gap:10px; color:#6d695e; font-size:12px; }
#thq-assistant .thq-footer a { color:#2b2b2b; font-weight:800; text-decoration:underline; text-underline-offset:3px; }
#thq-assistant :is(button,a,select):focus-visible, #thq-home-guide button:focus-visible { outline:3px solid #c49c59; outline-offset:3px; }
#thq-home-guide { width:min(1160px,calc(100% - 36px)); margin:26px auto 36px; background:linear-gradient(135deg,#3a3a3a 0%,#1c1c1c 100%); border:1px solid #977a4a; border-radius:0; display:flex; align-items:center; justify-content:space-between; padding:29px 34px; color:#fff8eb; position:relative; overflow:hidden; box-shadow:0 12px 30px rgba(33,31,25,.13); }
#thq-home-guide .thq-home-copy { position:relative; z-index:1; max-width:720px; }
#thq-home-guide .thq-home-kicker { font-size:13px; color:#eccf97; letter-spacing:0; font-weight:750; }
#thq-home-guide h2 { color:#fff8ed; font-weight:800; font-size:clamp(20px,2.1vw,29px); line-height:1.65; margin:8px 0 4px; }
#thq-home-guide p { color:#eee5d4; line-height:1.9; font-size:14px; margin:0 0 15px; }
#thq-home-guide .thq-home-actions { display:flex; flex-wrap:wrap; gap:9px; }
#thq-home-guide button { background:#cfaf7b; color:#1c1c1c; border:1px solid #cfaf7b; padding:10px 14px; border-radius:0; font-weight:800; font-size:13px; }
#thq-home-guide button:not(:first-child) { background:transparent; color:#fff3dc; border-color:#9f987f; }
#thq-home-guide button:hover { filter:brightness(1.09); }
#thq-home-guide .thq-home-decoration { opacity:.65; min-width:155px; display:flex; flex-direction:column; text-align:center; position:relative; align-items:center; }
#thq-home-guide .thq-home-decoration b { font-size:46px; color:#e7cb97; line-height:1.4; }
#thq-home-guide .thq-home-decoration span { font-size:19px; color:#fff2db; }
#thq-home-guide .thq-home-decoration i { font-style:normal; position:absolute; font-size:160px; opacity:.12; top:-67px; left:-50px; }
/* Mobile-only UX correction: all selectors remain scoped to the assistant. */
@media (max-width:740px) {
  /* Floating guide button: visually level with the existing Salla WhatsApp widget. */
  #thq-assistant .thq-launcher {
    bottom:calc(17px + env(safe-area-inset-bottom, 0px));
    left:12px;
    min-height:43px;
    max-width:calc(100vw - 100px);
    padding:9px 13px;
    font-size:12px;
    line-height:1.45;
    white-space:nowrap;
  }
  #thq-assistant .thq-top {
    bottom:calc(73px + env(safe-area-inset-bottom, 0px));
    left:14px;
    width:36px;
    height:36px;
  }

  /* Bottom sheet: fixed header/tabs/footer; only the main content scrolls. */
  #thq-assistant .thq-backdrop {
    align-items:flex-end;
    padding:0;
  }
  #thq-assistant .thq-dialog {
    width:100%;
    height:min(89dvh, 780px);
    max-height:calc(100dvh - env(safe-area-inset-top, 0px) - 10px);
    min-height:0;
    border-radius:0;
    border-bottom:0;
    overflow:hidden;
  }
  #thq-assistant .thq-header {
    flex:0 0 auto;
    padding:13px 16px;
    gap:10px;
    min-height:68px;
  }
  #thq-assistant .thq-brand { min-width:0; }
  #thq-assistant .thq-brand strong {
    font-size:18px;
    line-height:1.35;
    overflow-wrap:anywhere;
  }
  #thq-assistant .thq-brand small { font-size:11px; line-height:1.55; }
  #thq-assistant .thq-close {
    flex:0 0 41px;
    width:41px;
    height:41px;
  }

  /* Two-row 3+2 tab arrangement; never squeeze all five into one line. */
  #thq-assistant .thq-tabs {
    display:grid;
    grid-template-columns:repeat(6,minmax(0,1fr));
    flex:0 0 auto;
    gap:7px;
    overflow:visible;
    padding:10px 12px 11px;
    direction:rtl;
    align-items:stretch;
  }
  #thq-assistant .thq-tab {
    appearance:none;
    -webkit-appearance:none;
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    min-width:0;
    min-height:42px;
    grid-column:span 2;
    margin:0;
    padding:6px 5px;
    white-space:normal;
    text-align:center;
    line-height:1.4;
    font-size:12px;
    font-weight:700;
    border:1px solid #e8ddcd;
    border-radius:0;
    background:#fffdf9;
    color:#4b493f;
    box-shadow:none;
    transform:none;
    overflow-wrap:anywhere;
  }
  #thq-assistant .thq-tab:nth-child(n+4) { grid-column:span 3; }
  #thq-assistant .thq-tab::before,
  #thq-assistant .thq-tab::after { content:none !important; display:none !important; }
  #thq-assistant .thq-tab.is-active {
    background:#eae0d0;
    border-color:#bb9967;
    color:#262626;
    box-shadow:inset 0 0 0 1px #d3bb98;
  }

  #thq-assistant .thq-content-scroll {
    flex:1 1 auto;
    min-width:0;
    min-height:0;
    overflow-x:hidden;
    overflow-y:auto;
    -webkit-overflow-scrolling:touch;
    overscroll-behavior:contain;
    padding:16px 14px 22px;
  }
  #thq-assistant .thq-body { width:100%; min-width:0; }
  #thq-assistant .thq-intro h2 {
    font-size:19px;
    line-height:1.5;
    margin-bottom:5px;
    overflow-wrap:anywhere;
  }
  #thq-assistant .thq-intro p {
    font-size:13px;
    line-height:1.75;
    margin-bottom:14px;
  }
  #thq-assistant .thq-field { margin:15px 0 18px; }
  #thq-assistant .thq-field>strong { margin-bottom:9px; }

  /* Simple, touchable, two-column choice buttons. */
  #thq-assistant .thq-choices {
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:8px;
  }
  #thq-assistant .thq-choice {
    width:100%;
    min-width:0;
    min-height:43px;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:9px 8px;
    font-size:12px;
    line-height:1.5;
    text-align:center;
    white-space:normal;
    overflow-wrap:anywhere;
  }
  #thq-assistant .thq-choices:not(.thq-choices--wide) .thq-choice:last-child:nth-child(odd) {
    grid-column:1 / -1;
  }
  #thq-assistant .thq-choices--wide .thq-choice { flex:none; }
  #thq-assistant .thq-result,
  #thq-assistant .thq-guarantee { padding:14px; border-radius:0; }
  #thq-assistant .thq-result h3 { font-size:17px; line-height:1.55; }
  #thq-assistant .thq-result p { font-size:13px; line-height:1.75; }

  /* Compact information rows, instead of tall nested fact boxes. */
  #thq-assistant .thq-facts,
  #thq-assistant .thq-compare-facts {
    display:grid;
    grid-template-columns:1fr;
    gap:0;
    margin:10px 0 12px;
    min-width:0;
  }
  #thq-assistant .thq-facts>div,
  #thq-assistant .thq-compare-facts>div {
    display:grid;
    grid-template-columns:minmax(0,88px) minmax(0,1fr);
    align-items:start;
    gap:9px;
    min-width:0;
    min-height:0;
    padding:8px 0;
    background:transparent;
    border:0;
    border-bottom:1px solid #e7dfd2;
    border-radius:0;
  }
  #thq-assistant .thq-facts>div:last-child,
  #thq-assistant .thq-compare-facts>div:last-child { border-bottom:0; }
  #thq-assistant .thq-facts dt,
  #thq-assistant .thq-compare-facts dt {
    font-size:12px;
    line-height:1.55;
    margin:0;
    color:#817567;
    overflow-wrap:anywhere;
  }
  #thq-assistant .thq-facts dd,
  #thq-assistant .thq-compare-facts dd {
    font-size:13px;
    line-height:1.6;
    min-width:0;
    margin:0;
    overflow-wrap:anywhere;
  }

  /* Comparison selectors and cards - readable and short on a phone. */
  #thq-assistant .thq-compare-selects,
  #thq-assistant .thq-compare-grid {
    grid-template-columns:minmax(0,1fr);
    gap:11px;
  }
  #thq-assistant .thq-compare-selects { margin-bottom:12px; }
  #thq-assistant .thq-compare-selects label {
    min-width:0;
    gap:5px;
    font-size:12px;
  }
  #thq-assistant .thq-compare-selects select {
    display:block;
    max-width:100%;
    min-width:0;
    min-height:44px;
    padding:10px 12px;
    font-size:13px;
    text-overflow:ellipsis;
  }
  #thq-assistant .thq-compare-card {
    min-width:0;
    padding:13px 14px;
    border-radius:0;
  }
  #thq-assistant .thq-compare-card h3 {
    margin:0 0 7px;
    font-size:16px;
    line-height:1.55;
    font-weight:800;
    white-space:normal;
    overflow-wrap:anywhere;
    word-break:normal;
  }
  #thq-assistant .thq-compare-card .thq-inline-action {
    width:100%;
    min-height:42px;
    margin-top:5px;
    text-align:center;
  }
  #thq-assistant .thq-guides { gap:8px; }
  #thq-assistant .thq-guide-row { padding:11px; gap:9px; min-width:0; }
  #thq-assistant .thq-guide-num { width:28px; height:28px; }
  #thq-assistant .thq-guide-copy strong { font-size:13px; overflow-wrap:anywhere; }
  #thq-assistant .thq-guide-copy small { font-size:11px; overflow-wrap:anywhere; }
  #thq-assistant .thq-actions { display:flex; flex-direction:column; gap:8px; }
  #thq-assistant .thq-actions a { width:100%; text-align:center; }

  /* The footer stays aligned; Safari's bottom inset remains usable. */
  #thq-assistant .thq-footer {
    flex:0 0 auto;
    min-height:49px;
    padding:10px 16px calc(10px + env(safe-area-inset-bottom, 0px));
    justify-content:flex-start;
    align-items:center;
    text-align:right;
    line-height:1.5;
  }
  #thq-assistant .thq-footer .thq-whatsapp {
    display:inline-flex;
    align-items:center;
    min-height:30px;
    font-size:13px;
    white-space:normal;
  }

  /* Keep the homepage hero-guide component unchanged in function. */
  #thq-home-guide { margin:18px auto 25px; padding:22px 18px; border-radius:0; }
  #thq-home-guide .thq-home-decoration { display:none; }
  #thq-home-guide button { font-size:12px; padding:9px 11px; }
}
/* More breathing room for long Arabic labels on very narrow devices. */
@media (max-width:360px) {
  #thq-assistant .thq-tabs { grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; padding:9px 10px; }
  #thq-assistant .thq-tab { grid-column:span 1; font-size:11.5px; min-height:43px; }
  #thq-assistant .thq-tab:nth-child(n+4) { grid-column:span 1; }
  #thq-assistant .thq-tab:last-child { grid-column:1 / -1; }
  #thq-assistant .thq-content-scroll { padding:13px 11px 18px; }
  #thq-assistant .thq-compare-card { padding:12px; }
}
/* Short landscape phones: prioritize the scrolling content area. */
@media (max-width:740px) and (max-height:640px) {
  #thq-assistant .thq-dialog { height:96dvh; }
  #thq-assistant .thq-header { min-height:56px; padding:9px 14px; }
  #thq-assistant .thq-tabs { padding-top:6px; padding-bottom:6px; }
  #thq-assistant .thq-tab { min-height:36px; }
}

/* Home guide card - gold to bronze (option 3, text B2) */
#thq-home-guide {
  background: radial-gradient(120% 140% at 100% 0%, #d2bb95 0%, #b59a74 45%, #8f7757 100%);
  border: 0; border-radius: 0; color:#fff8ea; box-shadow:0 14px 34px rgba(90,66,30,.22);
}
#thq-home-guide .thq-home-kicker { color:#1c1a17; }
#thq-home-guide h2 { color:#fff8ea; text-shadow:0 1px 10px rgba(60,40,15,.35); }
#thq-home-guide p { color:#1c1a17; }
#thq-home-guide button { background:#1c1a17; color:#f3ece0; border:1px solid #1c1a17; border-radius:0; }
#thq-home-guide button:not(:first-child) { background:rgba(255,255,255,.2); color:#fffaf0; border-color:rgba(255,255,255,.55); -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px); }
#thq-home-guide .thq-home-decoration b { color:#fff8ea; }
#thq-home-guide .thq-home-decoration span { color:#1c1a17; }
#thq-home-guide .thq-home-decoration i { color:#fff8ea; }
@media (prefers-reduced-motion:reduce) {
 #thq-assistant *, #thq-home-guide * { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
#thq-assistant .thq-launcher { background:#b3915a !important; color:#1c1a17 !important; border:1px solid #9c7a46 !important; border-radius:0 !important; font-weight:700; }
#thq-assistant .thq-launcher:hover { background:#c4a36c !important; }
@media (max-width:740px) {
  #thq-assistant .thq-launcher { width:auto; height:auto; min-height:40px; padding:8px 14px; font-size:13px; }
}
`;
    const style = document.createElement('style');
    style.id = 'thq-assistant-styles-v1';
    style.textContent = css;
    document.head.appendChild(style);
  }


  /* ---------------- TRUST BAR ---------------- */
  const TRUST = ['عود طبيعي معتّق', 'جرّب قبل ما تقرر', 'دفع آمن: مدى · Apple Pay · فيزا', 'خدمة عملاء على واتساب'];
  function addTrustBar() {
    if (document.getElementById('thq-trust')) return;
    const header = document.querySelector('header, .store-header, .main-nav-container');
    const main = document.querySelector('main');
    if (!header && !main) return;
    const bar = document.createElement('div');
    bar.id = 'thq-trust';
    bar.setAttribute('dir', 'rtl');
    bar.innerHTML = TRUST.map(function (t, i) { return '<span' + (i === 0 ? ' class="on"' : '') + '>' + html(t) + '</span>'; }).join('');
    if (header) header.insertAdjacentElement('beforebegin', bar); else main.insertAdjacentElement('afterbegin', bar);
    let i = 0;
    window.setInterval(function () {
      const items = bar.querySelectorAll('span');
      items[i].classList.remove('on');
      i = (i + 1) % items.length;
      items[i].classList.add('on');
    }, 3200);
  }

  /* ---------------- WELCOME WHEEL ----------------
     Edit labels/codes/weights here. Create the same codes in Salla (Marketing > Coupons).
     weight = chance (higher = more likely). */
  const WHEEL_ENABLED = true; // true = show the wheel to new visitors, false = hidden
  // weight = chance %. Retry can happen only once per visitor.
  const WHEEL = [
    { label: 'خصم 10%',        code: 'THIQA10', weight: 0 },
    { label: 'حاول مرة أخرى',  code: null, retry: true, weight: 30 },
    { label: 'خصم 15%',        code: 'THIQA15', weight: 35 },
    { label: 'حظاً أوفر',      code: null, weight: 0 },
    { label: 'خصم 30 ر.س',     code: 'THIQA30', weight: 0 },
    { label: 'خصم 50 ر.س',     code: 'THIQA50', weight: 35 }
  ];
  const WHEEL_KEY = 'thq_welcome_wheel_v2';
  const WHEEL_COLORS = ['#26241f', '#302d28', '#26241f', '#302d28', '#26241f', '#302d28'];
  const WHEEL_TEXT = ['#dcc7a0', '#dcc7a0', '#dcc7a0', '#dcc7a0', '#dcc7a0', '#dcc7a0'];

  function store(get, val) {
    try { if (get) return localStorage.getItem(WHEEL_KEY); localStorage.setItem(WHEEL_KEY, val); } catch (e) { return get ? '1' : null; }
    return null;
  }

  function wheelSvg() {
    const n = WHEEL.length, a = 360 / n, r = 148, c = 150;
    const pt = function (deg, rad) { const t = deg * Math.PI / 180; return [c + rad * Math.sin(t), c - rad * Math.cos(t)]; };
    let out = '<svg viewBox="0 0 300 300" class="thq-wheel-svg" aria-hidden="true">';
    for (let i = 0; i < n; i++) {
      const p1 = pt(i * a, r), p2 = pt((i + 1) * a, r);
      out += '<path d="M150 150 L' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + ' A' + r + ' ' + r + ' 0 0 1 ' + p2[0].toFixed(2) + ' ' + p2[1].toFixed(2) + ' Z" fill="' + WHEEL_COLORS[i % WHEEL_COLORS.length] + '"/>';
    }
    for (let i = 0; i < n; i++) {
      const q = pt(i * a, r);
      out += '<line x1="150" y1="150" x2="' + q[0].toFixed(2) + '" y2="' + q[1].toFixed(2) + '" stroke="#a8875a" stroke-width="0.8"/>';
    }
    out += '<circle cx="150" cy="150" r="147" fill="none" stroke="#b3915a" stroke-width="2"/>';
    out += '<circle cx="150" cy="150" r="141" fill="none" stroke="#b3915a" stroke-width="0.6" opacity=".6"/>';
    out += '<circle cx="150" cy="150" r="20" fill="#1c1b18" stroke="#b3915a" stroke-width="1.5"/>';
    out += '<circle cx="150" cy="150" r="4" fill="#b3915a"/></svg>';
    return out;
  }

  function wheelLabels() {
    const n = WHEEL.length, a = 360 / n;
    let out = '';
    for (let i = 0; i < n; i++) {
      const t = (i * a + a / 2) * Math.PI / 180;
      const x = 50 + 31 * Math.sin(t), y = 50 - 31 * Math.cos(t);
      out += '<span class="thq-wh-label" style="left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%">' + html(WHEEL[i].label) + '</span>';
    }
    return out;
  }


  function getState() {
    try { return JSON.parse(localStorage.getItem(WHEEL_KEY) || 'null'); } catch (e) { return null; }
  }
  function setState(st) {
    try { localStorage.setItem(WHEEL_KEY, JSON.stringify(st)); } catch (e) {}
  }

  function pickIndex(retriedOnce) {
    const ok = function (x) { return !(x.retry && retriedOnce); };
    const total = WHEEL.reduce(function (t, x) { return t + (ok(x) ? x.weight : 0); }, 0);
    let r = Math.random() * total;
    for (let i = 0; i < WHEEL.length; i++) { if (!ok(WHEEL[i])) continue; r -= WHEEL[i].weight; if (r < 0) return i; }
    return 0;
  }

  /* Apply the won discount automatically to the cart (Salla SDK). */
  function whenSalla(fn) {
    let n = 0;
    const t = window.setInterval(function () {
      if (window.salla && salla.cart && typeof salla.cart.addCoupon === 'function') { window.clearInterval(t); fn(); }
      else if (++n > 40) window.clearInterval(t);
    }, 250);
  }
  function applyWonCoupon() {
    const st = getState();
    if (!st || st.status !== 'won' || !st.code) return;
    whenSalla(function () {
      try {
        const pr = salla.cart.addCoupon(st.code);
        if (pr && pr.then) pr.then(function () { st.applied = true; setState(st); }, function () {});
      } catch (e) {}
    });
  }
  function wheelLifecycle() {
    const path = location.pathname.toLowerCase();
    // Order completed: the gift has been used.
    if (/(thank-you|order-confirmation|\/orders?\/\d+\/?(success|thanks)?)/.test(path)) {
      const st = getState();
      if (st && st.status === 'won') { st.status = 'done'; setState(st); }
      return;
    }
    if (/(?:^|\/)cart(?:\/|$)/.test(path)) applyWonCoupon();
    whenSalla(function () {
      try {
        if (salla.cart.event && salla.cart.event.onItemAdded) {
          let once = false;
          salla.cart.event.onItemAdded(function () { if (once) return; once = true; applyWonCoupon(); });
        }
      } catch (e) {}
    });
  }

  function resultHtml(st) {
    return '<div class="thq-wh-won">مبروك! ربحت <b>' + html(st.label) + '</b></div>' +
      '<div class="thq-wh-auto">ينطبق الخصم <b>تلقائياً</b> على سلتك، ما تحتاج تكتب أي كود</div>' +
      '<p class="thq-wh-note">صالح لطلب واحد. وإذا ما ظهر لك، استخدم الكود: <span dir="ltr">' + html(st.code) + '</span></p>' +
      '<button type="button" class="thq-wh-go" data-wh-close>ابدأ التسوق</button>';
  }

  function openWheel() {
    if (document.getElementById('thq-wheel')) return;
    let st = getState() || { status: 'seen' };
    if (st.status === 'done') return;
    setState(st);
    const won = st.status === 'won' || st.status === 'lost';
    const w = document.createElement('div');
    w.id = 'thq-wheel';
    w.setAttribute('dir', 'rtl');
    w.innerHTML =
      '<div class="thq-wh-box" role="dialog" aria-modal="true" aria-label="عجلة الترحيب">' +
        '<button type="button" class="thq-wh-x" data-wh-close aria-label="إغلاق">×</button>' +
        '<div class="thq-wh-kicker">بمناسبة الافتتاح</div>' +
        '<h2>حيّاك في الثقة</h2>' +
        '<p class="thq-wh-sub">' + (won ? 'هديتك محفوظة لك' : 'لف العجلة، واكتشف هديتك على أول طلب') + '</p>' +
        (won ? '' : '<div class="thq-wh-wheel"><div class="thq-wh-pointer"></div><div class="thq-wh-rot">' + wheelSvg() + wheelLabels() + '</div></div>' +
        '<button type="button" class="thq-wh-spin" data-wh-spin>' + (st.retried ? 'لف مرة ثانية' : 'لف العجلة') + '</button>') +
        '<div class="thq-wh-result"' + (won ? '' : ' hidden') + '>' + (st.status === 'won' ? resultHtml(st) : '') + '</div>' +
      '</div>';
    document.body.appendChild(w);
    const close = function () { w.remove(); document.removeEventListener('keydown', esc); refreshGiftButton(); };
    const esc = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc);
    w.addEventListener('click', function (e) {
      if (e.target === w || e.target.closest('[data-wh-close]')) return close();
      const spin = e.target.closest('[data-wh-spin]');
      if (!spin) return;
      spin.disabled = true;
      const rot = w.querySelector('.thq-wh-rot');
      const res = w.querySelector('.thq-wh-result');
      res.hidden = true;
      const i = pickIndex(!!st.retried), n = WHEEL.length, a = 360 / n;
      const jitter = (Math.random() - 0.5) * a * 0.6;
      const prev = parseFloat(rot.dataset.deg || '0');
      const deg = prev - (prev % 360) + 360 * 6 + (360 - (i * a + a / 2)) + jitter;
      rot.dataset.deg = deg;
      rot.style.transform = 'rotate(' + deg + 'deg)';
      w.querySelectorAll('.thq-wh-label').forEach(function (t) {
        t.style.transform = 'translate(-50%, -50%) rotate(' + (-deg) + 'deg)';
      });
      window.setTimeout(function () {
        const win = WHEEL[i];
        res.hidden = false;
        if (win.retry) {
          st.retried = true; setState(st);
          res.innerHTML = '<div class="thq-wh-won">قرّبت! <b>لف مرة ثانية</b></div>';
          spin.disabled = false;
          spin.textContent = 'لف مرة ثانية';
          return;
        }
        spin.hidden = true;
        if (!win.code) {
          st.status = 'lost'; setState(st);
          res.innerHTML = '<div class="thq-wh-won"><b>حظاً أوفر</b> هالمرة</div>' +
            '<p class="thq-wh-note">نتشرف بزيارتك، وعروضنا الجاية لك</p>' +
            '<button type="button" class="thq-wh-go" data-wh-close>ابدأ التسوق</button>';
          return;
        }
        st.status = 'won'; st.code = win.code; st.label = win.label; setState(st);
        res.innerHTML = resultHtml(st);
        applyWonCoupon();
      }, 4700);
    });
  }

  /* Small floating button to reopen the wheel / see the gift */
  function refreshGiftButton() {
    let btn = document.getElementById('thq-gift-btn');
    const st = getState();
    const show = WHEEL_ENABLED && !(st && (st.status === 'done' || st.status === 'lost'));
    if (!show) { if (btn) btn.remove(); return; }
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'thq-gift-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'عجلة الحظ');
      btn.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/></svg><span>عجلة الحظ</span>';
      btn.addEventListener('click', openWheel);
      document.body.appendChild(btn);
    }
  }

  function showWheel() {
    const preview = /[?&#]wheel=1\b/.test(location.search + location.hash) || /#wheel\b/.test(location.hash);
    if (preview) { try { localStorage.removeItem(WHEEL_KEY); } catch (e) {} openWheel(); refreshGiftButton(); return; }
    if (!WHEEL_ENABLED) return;
    refreshGiftButton();
    if (!getState()) openWheel();
  }

  function installExtraStyles() {
    const css = `
#thq-trust { position:relative; z-index:50; background:linear-gradient(90deg,#5c1d16,#80301f 50%,#5c1d16); color:#f6e6c8; display:flex; justify-content:center; gap:0; padding:9px 16px; font-size:13px; font-weight:500; direction:rtl; }
#thq-trust span { white-space:nowrap; padding:0 22px; }
#thq-trust span + span { border-right:1px solid rgba(232,205,160,.45); }
@media (max-width:740px) {
  #thq-trust { display:block; height:36px; padding:0; overflow:hidden; }
  #thq-trust span + span { border:0; }
  #thq-trust span { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .5s; font-size:12.5px; }
  #thq-trust span.on { opacity:1; }
}
#thq-wheel { position:fixed; inset:0; z-index:1000000; background:rgba(12,11,10,.78); display:flex; align-items:center; justify-content:center; padding:16px; direction:rtl; }
#thq-wheel * { box-sizing:border-box; }
#thq-wheel .thq-wh-box { position:relative; width:min(410px,100%); max-height:96dvh; overflow:auto; background:#1c1b18; color:#f3ece0; padding:34px 26px 28px; text-align:center; box-shadow:0 30px 90px rgba(0,0,0,.55); }
#thq-wheel .thq-wh-box::before { content:""; position:absolute; inset:9px; border:1px solid rgba(179,145,90,.45); pointer-events:none; }
#thq-wheel .thq-wh-x { position:absolute; top:16px; left:16px; width:34px; height:34px; border:0; background:transparent; color:#b3915a; font-size:26px; line-height:1; cursor:pointer; z-index:2; }
#thq-wheel .thq-wh-kicker { color:#b3915a; font-size:13px; font-weight:500; }
#thq-wheel h2 { margin:8px 0 6px; font-size:28px; font-weight:500; color:#f3ece0; }
#thq-wheel .thq-wh-sub { margin:0 0 22px; color:#b5aa97; font-size:14px; font-weight:300; }
#thq-wheel .thq-wh-wheel { position:relative; width:min(290px,74vw); margin:0 auto 22px; aspect-ratio:1; }
#thq-wheel .thq-wh-rot { position:relative; width:100%; height:100%; transition:transform 4.6s cubic-bezier(.12,.67,.12,1); }
#thq-wheel .thq-wh-label { position:absolute; transform:translate(-50%,-50%); white-space:normal; max-width:36%; text-align:center; line-height:1.35; color:#dcc7a0; font-size:clamp(12px,3.6vw,14px); font-weight:500; direction:rtl; transition:transform 4.6s cubic-bezier(.12,.67,.12,1); pointer-events:none; }
#thq-wheel .thq-wh-rot svg { width:100%; height:100%; display:block; filter:drop-shadow(0 14px 30px rgba(0,0,0,.5)); }
#thq-wheel .thq-wh-pointer { position:absolute; top:-10px; left:50%; transform:translateX(-50%); width:0; height:0; border-left:8px solid transparent; border-right:8px solid transparent; border-top:20px solid #b3915a; z-index:2; }
#thq-wheel .thq-wh-spin, #thq-wheel .thq-wh-go { width:100%; min-height:48px; border:0; background:#b3915a; color:#1c1b18; font-size:16px; font-weight:500; cursor:pointer; }
#thq-wheel .thq-wh-go { background:transparent; color:#dcc7a0; border:1px solid #b3915a; }
#thq-wheel .thq-wh-spin:disabled { opacity:.55; cursor:default; }
#thq-wheel .thq-wh-won { font-size:17px; font-weight:300; margin-bottom:14px; color:#e9e1d3; }
#thq-wheel .thq-wh-won b { color:#dcc7a0; font-weight:700; }
#thq-wheel .thq-wh-code { display:flex; border:1px solid #b3915a; margin-bottom:10px; }
#thq-wheel .thq-wh-code span { flex:1; display:flex; align-items:center; justify-content:center; font-size:19px; font-weight:500; letter-spacing:3px; direction:ltr; color:#f3ece0; }
#thq-wheel .thq-wh-code button { border:0; background:#b3915a; color:#1c1b18; font-weight:500; padding:0 16px; min-height:46px; cursor:pointer; }

/* Softer corners */
#thq-assistant .thq-dialog { border-radius:18px !important; }
@media (max-width:740px) { #thq-assistant .thq-dialog { border-radius:18px 18px 0 0 !important; } }
#thq-assistant .thq-tab, #thq-assistant .thq-choice, #thq-assistant .thq-primary, #thq-assistant .thq-secondary,
#thq-assistant .thq-close, #thq-assistant .thq-compare-selects select, #thq-assistant .thq-guide-num { border-radius:10px !important; }
#thq-assistant .thq-result, #thq-assistant .thq-guarantee, #thq-assistant .thq-guide-row, #thq-assistant .thq-compare-card { border-radius:14px !important; }
#thq-assistant .thq-launcher { border-radius:999px !important; display:flex; align-items:center; gap:7px; box-shadow:0 8px 24px rgba(120,90,40,.35) !important; }
#thq-assistant .thq-l-star { flex:0 0 auto; }
#thq-home-guide { border-radius:18px !important; overflow:hidden; }
#thq-home-guide button { border-radius:10px !important; }
#thq-wheel .thq-wh-box { border-radius:18px; }
#thq-wheel .thq-wh-box::before { border-radius:12px; }
#thq-wheel .thq-wh-spin, #thq-wheel .thq-wh-go { border-radius:10px; }
#thq-wheel .thq-wh-code { border-radius:10px; overflow:hidden; }
#thq-wheel .thq-wh-auto { background:rgba(179,145,90,.14); border:1px solid rgba(179,145,90,.55); border-radius:10px; padding:12px 14px; font-size:14px; color:#efe6d5; margin-bottom:10px; line-height:1.7; }
#thq-wheel .thq-wh-auto b { color:#dcc7a0; }
#thq-gift-btn { position:fixed; z-index:99998; left:22px; bottom:84px; display:flex; align-items:center; gap:6px; padding:8px 14px; min-height:38px; border-radius:999px; border:1px solid #b3915a; background:#1c1b18; color:#dcc7a0; font:inherit; font-size:13px; font-weight:700; cursor:pointer; box-shadow:0 8px 22px rgba(0,0,0,.25); }
@media (max-width:740px) { #thq-gift-btn { left:12px; bottom:calc(70px + env(safe-area-inset-bottom, 0px)); padding:7px 12px; font-size:12.5px; } }

#thq-hero { position:relative; overflow:hidden; height:clamp(340px, 42vw, 560px); margin:0 0 0; direction:rtl; }
#thq-hero img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:60% 50%; }
#thq-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(0deg, rgba(18,14,10,.92) 0%, rgba(18,14,10,.7) 35%, rgba(18,14,10,0) 80%); }
#thq-hero .thq-hero-tx { position:absolute; z-index:2; right:max(22px, calc((100% - 1160px) / 2)); left:22px; bottom:26px; color:#f6efe2; max-width:620px; }
#thq-hero .k { font-size:13px; color:#dcc7a0; }
#thq-hero h1 { font-size:clamp(30px, 4.2vw, 52px); font-weight:700; line-height:1.3; margin:6px 0 8px; color:#f6efe2; }
#thq-hero p { font-size:clamp(14px, 1.3vw, 17px); color:#e9dfcf; font-weight:300; margin:0 0 14px; }
#thq-hero .thq-hero-b { display:flex; gap:8px; flex-wrap:wrap; }
#thq-hero .thq-hero-b a, #thq-hero .thq-hero-b button { font:inherit; font-size:15px; font-weight:500; padding:11px 22px; border-radius:10px; cursor:pointer; text-decoration:none; }
#thq-hero .thq-hero-b a { background:#b3915a; color:#1c1b18; border:1px solid #b3915a; }
#thq-hero .thq-hero-b button { background:rgba(255,255,255,.16); color:#fff; border:1px solid rgba(255,255,255,.6); -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px); }
#thq-story { display:grid; grid-template-columns:1fr; background:#e7dcc9; margin:0 0 34px; direction:rtl; }
#thq-story .thq-st-img img { width:100%; height:300px; object-fit:cover; display:block; }
#thq-story .thq-st-tx { padding:28px 22px 32px; max-width:620px; }
#thq-story small { color:#8c6f42; font-size:13px; }
#thq-story h2 { font-size:26px; margin:6px 0 10px; color:#262523; font-weight:700; }
#thq-story p { font-size:15px; line-height:1.9; color:#4e463c; font-weight:300; margin:0; }
#thq-story .thq-st-n { display:flex; gap:10px; margin-top:18px; }
#thq-story .thq-st-n div { flex:1; border-top:1px solid #b3915a; padding-top:8px; }
#thq-story .thq-st-n b { display:block; font-size:19px; color:#262523; }
#thq-story .thq-st-n span { font-size:12px; color:#6b6259; }
@media (min-width:900px) {
  #thq-story { grid-template-columns:1fr 1fr; align-items:center; }
  #thq-story .thq-st-img img { height:460px; }
  #thq-story .thq-st-tx { padding:40px 48px; }
}
.thq-rev-k { display:block; text-align:center; color:#9a7b4c; font-size:13px; margin-bottom:2px; }
.thq-av { width:56px; height:56px; border-radius:50%; background:#262523; color:#dcc7a0; display:inline-flex; align-items:center; justify-content:center; font-size:24px; font-weight:700; overflow:hidden; box-shadow:0 0 0 2px #f6f0e6, 0 0 0 3px #b3915a; margin:0 auto; flex:0 0 auto; }
.thq-av img { width:100%; height:100%; object-fit:cover; display:block; }
body.thq-pdp #thq-gift-btn { display:none !important; }
body.thq-pdp #thq-assistant .thq-launcher { bottom:calc(112px + env(safe-area-inset-bottom, 0px)) !important; }
@media (min-width:741px) { body.thq-pdp #thq-assistant .thq-launcher { bottom:22px !important; } }

[data-thq-rev="1"] .swiper, [data-thq-rev="1"] .swiper-wrapper { height:auto !important; transition-property:transform !important; }
[data-thq-rev="1"] .swiper-wrapper { align-items:stretch !important; }
[data-thq-rev="1"] .swiper-slide { height:auto !important; padding:0 !important; box-sizing:border-box !important; }
.thq-nops::before, .thq-nops::after { content:none !important; display:none !important; }
[data-thq-rev="1"] [class*="star"], [data-thq-rev="1"] [class*="star"]::before { color:#c48e12 !important; fill:#c48e12 !important; }
[data-thq-rev="1"] blockquote::before, [data-thq-rev="1"] blockquote::after, [data-thq-rev="1"] q::before, [data-thq-rev="1"] q::after { content:none !important; }
[data-thq-rev="1"] [class*="quote"] { display:none !important; }
.thq-dots { display:flex; justify-content:center; gap:7px; margin:16px 0 6px; direction:ltr; }
.thq-dots button { width:8px; height:8px; padding:0; border:0; border-radius:999px; background:#cbbda5; cursor:pointer; transition:width .25s, background .25s; }
.thq-dots button.on { width:22px; background:#262523; }
#thq-wheel .thq-wh-note { font-size:12.5px; color:#9d9384; margin:0 0 14px; }
/* guide card: gold-bronze, one main button + two equal chips */
#thq-home-guide { border-radius:18px !important; padding:26px 22px !important; }
#thq-home-guide .thq-home-kicker { letter-spacing:0 !important; }
#thq-home-guide .thq-home-actions { display:grid !important; grid-template-columns:1fr 1fr; gap:10px !important; width:100%; max-width:460px; }
#thq-home-guide .thq-home-actions button { border-radius:12px !important; padding:12px 10px !important; font-size:14px !important; text-align:center; }
#thq-home-guide .thq-home-actions button:first-child { grid-column:1 / -1; background:#1c1a17 !important; color:#f3ece0 !important; border:1px solid #1c1a17 !important; padding:14px !important; font-size:15px !important; }
#thq-home-guide .thq-home-actions button:not(:first-child) { background:rgba(255,255,255,.22) !important; color:#1c1a17 !important; border:1px solid rgba(255,255,255,.6) !important; text-decoration:none !important; font-weight:700; }

/* section titles centered with gold lines */
*:has(> .thq-sec-title) { display:flex !important; flex-direction:column !important; align-items:center !important; text-align:center !important; gap:2px !important; }
.thq-sec-title { display:flex !important; align-items:center; justify-content:center; gap:14px; text-align:center !important; width:auto !important; margin-inline:auto !important; }
.thq-sec-title::before, .thq-sec-title::after { content:""; width:34px; height:1px; background:#b3915a; flex:0 0 auto; }
*:has(> .thq-sec-title) > a, *:has(> .thq-sec-title) > div:not(.thq-sec-title) a { font-size:13px !important; color:#8a6a3a !important; }

/* our story removed */
#thq-story { display:none !important; }

/* product cards: small wishlist aligned with badges */
.s-product-card-entry .s-product-card-wishlist-btn, .s-product-card-entry salla-button.s-product-card-wishlist-btn {
  position:absolute !important; top:10px !important; left:10px !important; right:auto !important; bottom:auto !important;
  width:28px !important; height:28px !important; min-width:28px !important; min-height:28px !important; padding:0 !important; margin:0 !important;
  display:flex !important; align-items:center !important; justify-content:center !important; z-index:3; }
.s-product-card-entry .s-product-card-wishlist-btn button, .s-product-card-entry salla-button.s-product-card-wishlist-btn button {
  width:28px !important; height:28px !important; min-width:28px !important; min-height:28px !important; padding:0 !important; border-radius:50% !important; }
.s-product-card-entry .s-product-card-wishlist-btn i, .s-product-card-entry .s-product-card-wishlist-btn svg { font-size:14px !important; width:14px !important; height:14px !important; }
.s-product-card-entry .s-product-card-promotion-title { top:10px !important; height:28px !important; line-height:28px !important; padding:0 10px !important; display:inline-flex !important; align-items:center; font-size:12px !important; }
.s-product-card-image { position:relative; }

/* product titles: always one line, same size on all cards */
.s-product-card-content-title, .s-product-card-content-title a { white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important; display:block !important; }

/* floating buttons: one matched pair */
#thq-assistant .thq-launcher, #thq-gift-btn {
  position:fixed !important; left:18px !important; z-index:99998 !important;
  width:148px !important; height:46px !important; min-height:46px !important; max-width:none !important;
  padding:0 16px !important; box-sizing:border-box !important;
  display:flex !important; align-items:center !important; justify-content:center !important; gap:8px !important;
  background:#262523 !important; color:#f3ece0 !important; border:1px solid #c4a06d !important; border-radius:999px !important;
  font:inherit !important; font-size:14px !important; font-weight:700 !important; line-height:1 !important; letter-spacing:0 !important; white-space:nowrap !important;
  box-shadow:0 6px 18px rgba(28,26,23,.28) !important; filter:none !important;
}
#thq-assistant .thq-launcher { bottom:calc(18px + env(safe-area-inset-bottom, 0px)) !important; }
#thq-gift-btn { bottom:calc(74px + env(safe-area-inset-bottom, 0px)) !important; }
#thq-assistant .thq-launcher svg, #thq-gift-btn svg { width:17px !important; height:17px !important; color:#c4a06d !important; flex:0 0 auto; }
#thq-gift-btn svg * { stroke:#c4a06d !important; }
#thq-assistant .thq-launcher:hover, #thq-gift-btn:hover { background:#34322f !important; }
@media (max-width:740px) {
  #thq-assistant .thq-launcher, #thq-gift-btn { left:12px !important; width:136px !important; height:44px !important; min-height:44px !important; font-size:13px !important; }
  #thq-gift-btn { bottom:calc(70px + env(safe-area-inset-bottom, 0px)) !important; }
}
body.thq-pdp #thq-assistant .thq-launcher { bottom:calc(112px + env(safe-area-inset-bottom, 0px)) !important; }
@media (min-width:741px) { body.thq-pdp #thq-assistant .thq-launcher { bottom:18px !important; } }
`;
    const st = document.createElement('style');
    st.id = 'thq-extra-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }


  /* ---------------- STORE FEATURES: 3 small in one row on mobile ---------------- */
  function compactFeatures() {
    const mob = window.innerWidth <= 740;
    const main = document.querySelector('main');
    if (!main) return false;
    const KEYS = ['جود', 'خدم', 'شحن', 'توصيل', 'دفع', 'ضمان'];
    const leaves = [];
    const walk = function (root) {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
      let n = w.currentNode;
      while (n) {
        if (n.closest && n.closest('#thq-trust, #thq-assistant, #thq-home-guide, #thq-wheel, header, nav, footer, .s-product-card-entry')) { n = w.nextNode(); continue; }
        if (n.shadowRoot) walk(n.shadowRoot);
        if (/^(H2|H3|H4|H5|H6|STRONG|B|P|SPAN|DIV)$/.test(n.tagName) && n.children.length === 0) {
          const t = (n.textContent || '').trim().replace(/\u0640/g, '');
          if (t.length > 1 && t.length < 40 && KEYS.some(function (k) { return t.indexOf(k) !== -1; })) leaves.push(n);
        }
        n = w.nextNode();
      }
    };
    walk(main);
    if (leaves.length < 3) return false;
    const up = function (el) { return el.parentElement || (el.getRootNode && el.getRootNode().host) || null; };
    const chain = function (el) { const c = []; while (el) { c.push(el); el = up(el); } return c; };
    // lowest common ancestor of first three matching leaves
    const c0 = chain(leaves[0]);
    let lca = null;
    for (let i = 0; i < c0.length; i++) {
      if (c0[i].contains(leaves[1]) && c0[i].contains(leaves[2])) { lca = c0[i]; break; }
      const r1 = leaves[1].getRootNode && leaves[1].getRootNode().host, r2 = leaves[2].getRootNode && leaves[2].getRootNode().host;
      if (r1 && r2 && c0[i].contains(r1) && c0[i].contains(r2)) { lca = c0[i]; break; }
    }
    if (!lca || lca === main || lca === document.body) return false;
    // the row = the element whose direct children each hold one feature
    let row = lca;
    const holds = function (el) { return Array.prototype.filter.call(el.children, function (ch) { return leaves.some(function (l) { return ch.contains(l); }); }).length; };
    while (row && holds(row) < 3 && row.children.length === 1) row = row.children[0];
    if (!row || holds(row) < 3) return false;
    if (row.dataset.thqFeat) return true;
    row.dataset.thqFeat = '1';
    beigeFeatures(row);
    if (!mob) return true;
    if (/swiper-wrapper/.test(row.className)) row.style.setProperty('transform', 'none', 'important');
    row.style.setProperty('display', 'grid', 'important');
    row.style.setProperty('grid-template-columns', 'repeat(3, minmax(0, 1fr))', 'important');
    row.style.setProperty('gap', '8px', 'important');
    row.style.setProperty('flex-wrap', 'nowrap', 'important');
    Array.prototype.forEach.call(row.children, function (ch, i) {
      if (i > 2) { ch.style.setProperty('display', 'none', 'important'); return; }
      ['width', 'max-width', 'min-width', 'flex', 'margin'].forEach(function (k) { ch.style.setProperty(k, k === 'flex' ? 'none' : (k === 'margin' ? '0' : 'auto'), 'important'); });
      ch.style.setProperty('grid-column', 'auto', 'important');
      ch.style.setProperty('grid-row', 'auto', 'important');
      ch.style.setProperty('min-height', '0', 'important');
      ch.style.setProperty('padding', '12px 6px', 'important');
      ch.style.setProperty('text-align', 'center', 'important');
      ch.querySelectorAll('h2,h3,h4,h5,strong,b').forEach(function (h) { h.style.setProperty('font-size', '13px', 'important'); h.style.setProperty('line-height', '1.5', 'important'); });
      ch.querySelectorAll('p,small').forEach(function (t) { t.style.setProperty('font-size', '11px', 'important'); t.style.setProperty('line-height', '1.5', 'important'); });
      ch.querySelectorAll('svg,img').forEach(function (ic) {
        ic.style.setProperty('width', '24px', 'important'); ic.style.setProperty('height', '24px', 'important');
        const wrap = ic.parentElement;
        if (wrap && wrap !== ch && wrap.children.length === 1) {
          ['width', 'height', 'min-width', 'min-height'].forEach(function (k) { wrap.style.setProperty(k, '52px', 'important'); });
          wrap.style.setProperty('margin', '0 auto 8px', 'important');
        }
      });
      ch.querySelectorAll('i').forEach(function (ic) { ic.style.setProperty('font-size', '26px', 'important'); });
    });
    return true;
  }


  function beigeFeatures(row) {
    // clear white backgrounds around the row (section box) so it sits on the page beige
    let up = row;
    for (let i = 0; up && i < 6 && up.tagName !== 'MAIN' && up !== document.body; i++, up = up.parentElement) {
      const bg = getComputedStyle(up).backgroundColor;
      const m = bg.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?/);
      if (m && (m[4] === undefined || parseFloat(m[4]) > 0) && +m[1] > 235 && +m[2] > 230 && +m[3] > 220) {
        up.style.setProperty('background', 'transparent', 'important');
        up.style.setProperty('box-shadow', 'none', 'important');
        up.style.setProperty('border-color', 'transparent', 'important');
      }
    }
    Array.prototype.forEach.call(row.children, function (ch) {
      ch.style.setProperty('background', '#ddd0bb', 'important');
      ch.style.setProperty('border', '0', 'important');
      ch.style.setProperty('box-shadow', 'none', 'important');
      ch.style.setProperty('border-radius', '16px', 'important');
      ch.querySelectorAll('*').forEach(function (d) {
        const bg = getComputedStyle(d).backgroundColor;
        const m = bg.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?/);
        if (m && (m[4] === undefined || parseFloat(m[4]) > 0) && +m[1] > 235 && +m[2] > 230 && +m[3] > 220) d.style.setProperty('background', 'transparent', 'important');
      });
    });
    if (!row.style.gap) row.style.setProperty('gap', '10px', 'important');
  }

  /* ---------------- REMOVE FLOATING WHATSAPP ---------------- */
  function killWhatsApp() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp"], [class*="whatsapp" i], [id*="whatsapp" i], img[src*="whatsapp" i], img[alt*="whatsapp" i]').forEach(function (el) {
      if (el.closest('#thq-assistant, #thq-wheel, footer, header, nav')) return;
      let n = el;
      for (let i = 0; n && n !== document.body && i < 8; i++, n = n.parentElement) {
        const pos = getComputedStyle(n).position;
        if (pos === 'fixed' || pos === 'sticky') { n.style.setProperty('display', 'none', 'important'); return; }
      }
    });
  }
  killWhatsApp();
  (function () {
    let k = 0;
    const t = window.setInterval(function () { killWhatsApp(); if (++k > 30) window.clearInterval(t); }, 500);
    try { new MutationObserver(function () { killWhatsApp(); }).observe(document.body || document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  })();

  /* ---------------- PRODUCT TITLES: one line, one shared size ---------------- */
  function fitTitles() {
    const els = Array.prototype.slice.call(document.querySelectorAll('.s-product-card-content-title a, .s-product-card-content-title:not(:has(a))'));
    if (!els.length) return;
    els.forEach(function (e) { e.style.removeProperty('font-size'); });
    let size = parseFloat(getComputedStyle(els[0]).fontSize) || 15;
    const fits = function () { return els.every(function (e) { return e.scrollWidth <= e.clientWidth + 1; }); };
    while (!fits() && size > 11) { size -= 0.5; els.forEach(function (e) { e.style.setProperty('font-size', size + 'px', 'important'); }); }
  }
  (function () {
    let k = 0;
    const t = window.setInterval(function () { fitTitles(); if (++k > 12) window.clearInterval(t); }, 700);
    window.addEventListener('resize', function () { clearTimeout(window._thqFit); window._thqFit = setTimeout(fitTitles, 250); });
  })();

  /* ---------------- HOME UPGRADE ---------------- */
  const IMG_BASE = 'https://cdn.jsdelivr.net/gh/althiqah-oud/fonts@main/';
  function blockOf(el) {
    const main = document.querySelector('main');
    let b = el;
    while (b && b.parentElement && b.parentElement !== main) b = b.parentElement;
    return b && b.parentElement === main ? b : null;
  }
  function findText(txt) {
    const main = document.querySelector('main');
    if (!main) return null;
    const w = document.createTreeWalker(main, NodeFilter.SHOW_ELEMENT);
    let n = w.currentNode;
    while (n) {
      if (!(n.closest && n.closest('#thq-assistant, #thq-home-guide, #thq-hero, #thq-story')) && n.children.length === 0 && (n.textContent || '').trim().replace(/ـ/g, '') === txt) return n;
      n = w.nextNode();
    }
    return null;
  }
  function addHero() {
    if (document.getElementById('thq-hero')) return;
    const main = document.querySelector('main');
    if (!main) return;
    const h = document.createElement('section');
    h.id = 'thq-hero';
    h.setAttribute('dir', 'rtl');
    h.innerHTML = '<img src="' + IMG_BASE + 'hero.jpg" alt="الثقة للعود" loading="eager">' +
      '<div class="thq-hero-tx"><div class="k">الثقة · لأجود أنواع العود</div><h1>طيبٌ يسبقك<br>ويبقى بعدك</h1>' +
      '<p>دهن عود معتّق وبخور طبيعي، مختار بعناية</p>' +
      '<div class="thq-hero-b"><a class="g" href="#thq-shop">تسوّق الآن</a><button type="button" data-thq-open="oud">اختر طيبك</button></div></div>';
    main.insertAdjacentElement('afterbegin', h);
    h.querySelector('[data-thq-open]').addEventListener('click', function () { openGuide('oud'); });
    h.querySelector('a.g').addEventListener('click', function (e) {
      e.preventDefault();
      let t = productsBlock() || document.getElementById('thq-cats');
      if (!t) { const l = findText('\u0627\u0644\u0628\u0643\u062c\u0627\u062a'); t = l ? (blockOf(l) || l) : null; }
      if (!t) t = h.nextElementSibling;
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  function storyHtml() {
    return '<div class="thq-st-img"><img src="' + IMG_BASE + 'story.jpg" alt="" loading="lazy"></div>' +
      '<div class="thq-st-tx"><small>قصتنا</small><h2>ننتقي لك الأجود</h2>' +
      '<p>نختار عودنا بأنفسنا من أجود المصادر، ونعتّقه لين تكمل ريحته. وما نقدّم لك إلا اللي نرضاه لأنفسنا</p>' +
      '<div class="thq-st-n"><div><b>صافي</b><span>بدون خلطات</span></div><div><b>معتّق</b><span>يصل لـ 10 سنوات</span></div><div><b>مُجرَّب</b><span>جرّب قبل ما تقرر</span></div></div></div>';
  }
  function placeSections() {
    const main = document.querySelector('main');
    if (!main) return false;
    const revTitle = findText('آراء العملاء') || findText('بشهادة من جرّبه');
    const revBlock = revTitle ? blockOf(revTitle) : null;
    const guide = document.getElementById('thq-home-guide');
    let story = document.getElementById('thq-story');
    if (!story) {
      story = document.createElement('section');
      story.id = 'thq-story';
      story.setAttribute('dir', 'rtl');
      story.innerHTML = storyHtml();
    }
    if (revBlock) {
      revBlock.insertAdjacentElement('beforebegin', story);
      if (guide) revBlock.insertAdjacentElement('beforebegin', guide);
      upgradeReviews(revBlock, revTitle);
      return true;
    }
    return false;
  }
  function upgradeReviews(block, title) {
    if (block.dataset.thqRev) return;
    block.dataset.thqRev = '1';
    if (title && title.textContent.trim() === 'آراء العملاء') title.textContent = 'بشهادة من جرّبه';
    if (title) title.classList.add('thq-sec-title');
    block.querySelectorAll('.swiper-wrapper').forEach(function (wr) {
      wr.style.setProperty('align-items', 'stretch', 'important');
      wr.style.setProperty('height', 'auto', 'important');
      Array.prototype.forEach.call(wr.children, function (sl) { sl.style.setProperty('height', 'auto', 'important'); });
    });
    const sw = block.querySelector('.swiper');
    if (sw) sw.style.setProperty('height', 'auto', 'important');
    const imgs = Array.prototype.slice.call(block.querySelectorAll('img'));
    imgs.forEach(function (img) {
      // card = highest ancestor that still holds only this one image
      let card = img;
      while (card.parentElement && card.parentElement !== block && card.parentElement.querySelectorAll('img, .thq-av').length === 1) card = card.parentElement;
      let name = '', best = 1e9;
      const w = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
      let tn;
      while ((tn = w.nextNode())) {
        const t = (tn.nodeValue || '').trim();
        if (!t || t.length > 30 || /[★☆]/.test(t) || !/[؀-ۿA-Za-z]/.test(t) || /عرض الكل/.test(t)) continue;
        const el = tn.parentElement;
        const fw = parseFloat(getComputedStyle(el).fontWeight) || 400;
        const score = (fw >= 600 ? 0 : 100) + t.length;
        if (score < best) { best = score; name = t; }
      }
      const src = (img.getAttribute('src') || '') + ' ' + (img.getAttribute('data-src') || '');
      const isDefault = /avatar|default|placeholder|user|profile-|no-image|male|female/i.test(src) || !src.trim();
      const ring = document.createElement('span');
      ring.className = 'thq-av';
      if (isDefault) {
        ring.textContent = (name.replace(/^(ال)/, '') ? name : 'ع').charAt(0);
      } else {
        const im = document.createElement('img');
        im.src = img.getAttribute('data-src') || img.getAttribute('data-lazy') || img.currentSrc || img.src;
        im.alt = name;
        ring.appendChild(im);
      }
      img.replaceWith(ring);
      const holder = ring.parentElement;
      if (holder && holder !== card) {
        holder.style.setProperty('overflow', 'visible', 'important');
        holder.style.setProperty('width', 'auto', 'important');
        holder.style.setProperty('height', 'auto', 'important');
        holder.style.setProperty('border', '0', 'important');
        holder.style.setProperty('background', 'transparent', 'important');
        holder.style.setProperty('clip-path', 'none', 'important');
        holder.style.setProperty('flex', '0 0 auto', 'important');
      }
      // remove quote marks, darken stars
      card.querySelectorAll('*').forEach(function (d) {
        const cls = (d.getAttribute('class') || '');
        const tx = (d.children.length === 0 ? (d.textContent || '').trim() : '');
        if (/quote/i.test(cls) || /^[\u201C\u201D\u201E"\u275D\u275E\u00AB\u00BB]+$/.test(tx)) { d.style.setProperty('display', 'none', 'important'); return; }
        const col = getComputedStyle(d).color;
        const m = col.match(/rgba?\((\d+), (\d+), (\d+)/);
        if (m && +m[1] > 200 && +m[2] > 140 && +m[2] < 220 && +m[3] < 110) {
          d.style.setProperty('color', '#c48e12', 'important');
          d.style.setProperty('fill', '#c48e12', 'important');
        }
        if (d.tagName === 'path' || d.tagName === 'svg') {
          const f = getComputedStyle(d).fill;
          const fm = f && f.match(/rgba?\((\d+), (\d+), (\d+)/);
          if (fm && +fm[1] > 200 && +fm[2] > 140 && +fm[3] < 110) d.style.setProperty('fill', '#c48e12', 'important');
        }
      });
      // frosted card like the product boxes, equal heights
      card.style.setProperty('background', '#ddd0bb', 'important');
      card.classList.add('thq-rcard');
      card.style.setProperty('border', '8px solid transparent', 'important');
      card.style.setProperty('background-clip', 'padding-box', 'important');
      card.style.setProperty('box-shadow', 'none', 'important');
      card.style.setProperty('border-radius', '22px', 'important');
      card.style.setProperty('height', '100%', 'important');
      // stars = groups of 3+ icons; any other lone icon (quote mark) is hidden
      card.querySelectorAll('svg, i, img').forEach(function (ic) {
        if (ic.closest('.thq-av') || !ic.parentElement) return;
        if (ic.parentElement.closest('svg') && ic.tagName.toLowerCase() !== 'svg') return;
        const sibs = Array.prototype.filter.call(ic.parentElement.children, function (x) { return /^(svg|i|img|span)$/i.test(x.tagName); });
        const isStar = /star/i.test(ic.getAttribute('class') || '') || sibs.length >= 3 || (ic.parentElement.parentElement && ic.parentElement.parentElement.children.length >= 5 && /star|rating/i.test(ic.parentElement.parentElement.getAttribute('class') || ''));
        if (isStar) {
          ic.style.setProperty('color', '#c48e12', 'important');
          ic.style.setProperty('fill', '#c48e12', 'important');
          ic.querySelectorAll('path').forEach(function (pt) { pt.style.setProperty('fill', '#c48e12', 'important'); });
        } else {
          ic.style.setProperty('display', 'none', 'important');
        }
      });
      card.querySelectorAll('*').forEach(function (d) {
        if (/star/i.test(d.getAttribute('class') || '')) return;
        ['::before', '::after'].forEach(function (ps) {
          const c = getComputedStyle(d, ps).content;
          if (c && c !== 'none' && c !== 'normal' && c !== '""') d.classList.add('thq-nops');
        });
      });
      card.style.setProperty('box-sizing', 'border-box', 'important');
      card.querySelectorAll('*').forEach(function (d) {
        if (d.classList.contains('thq-av')) return;
        const bg = getComputedStyle(d).backgroundColor;
        const m = bg.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?/);
        if (m && (m[4] === undefined || parseFloat(m[4]) > 0) && +m[1] > 235 && +m[2] > 230 && +m[3] > 220) {
          d.style.setProperty('background', 'transparent', 'important');
          d.style.setProperty('box-shadow', 'none', 'important');
          d.style.setProperty('border-color', 'transparent', 'important');
        }
      });
      let up = card.parentElement;
      for (let i = 0; up && up !== block && i < 3; i++, up = up.parentElement) {
        if (up.classList.contains('swiper-wrapper')) break;
        up.style.setProperty('height', 'auto', 'important');
        up.style.setProperty('align-self', 'stretch', 'important');
      }
    });
    addReviewDots(block);
    const eq = function () {
      const cards = block.querySelectorAll('.thq-rcard');
      let mx = 0;
      cards.forEach(function (c) { c.style.removeProperty('min-height'); });
      cards.forEach(function (c) { mx = Math.max(mx, c.offsetHeight); });
      if (mx) cards.forEach(function (c) { c.style.setProperty('min-height', mx + 'px', 'important'); });
    };
    eq();
    setTimeout(eq, 600); setTimeout(eq, 2000);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(eq);
    window.addEventListener('resize', function () { clearTimeout(block._thqEq); block._thqEq = setTimeout(eq, 200); });
  }
  function addReviewDots(block) {
    const sw = block.querySelector('.swiper');
    const wr = block.querySelector('.swiper-wrapper');
    if (!wr || block.querySelector('.thq-dots')) return;
    const real = Array.prototype.filter.call(wr.children, function (sl) { return !sl.classList.contains('swiper-slide-duplicate'); });
    const n = real.length;
    if (n < 2) return;
    const dots = document.createElement('div');
    dots.className = 'thq-dots';
    for (let i = 0; i < n; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'رأي ' + (i + 1));
      b.addEventListener('click', function () {
        const inst = sw && sw.swiper;
        if (inst) { if (inst.params && inst.params.loop && inst.slideToLoop) inst.slideToLoop(i); else inst.slideTo(i); }
        else if (real[i]) real[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
      dots.appendChild(b);
    }
    block.appendChild(dots);
    const update = function () {
      let idx = 0;
      const act = wr.querySelector('.swiper-slide-active');
      if (act) {
        const di = act.getAttribute('data-swiper-slide-index');
        idx = di !== null ? +di : Math.max(0, real.indexOf(act));
      } else if (sw && sw.swiper) idx = sw.swiper.realIndex || 0;
      Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === idx % n); });
    };
    update();
    new MutationObserver(update).observe(wr, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }
  function productsBlock() {
    const card = document.querySelector('main .s-product-card-entry');
    return card ? blockOf(card) : null;
  }
  function markProductsTitle() {
    const b = productsBlock();
    if (!b || b.dataset.thqT) return !!b;
    b.dataset.thqT = '1';
    const h = b.querySelector('h1, h2, h3, .s-block__title, [class*="title"]');
    if (h && !h.closest('.s-product-card-entry')) {
      const inner = h.querySelector('h2, h3') || h;
      inner.classList.add('thq-sec-title');
    }
    return true;
  }
  function upgradeHome() {
    if (!isHomepage()) return;
    addHero();
    if (!markProductsTitle()) { let m = 0; const mt = window.setInterval(function () { if (markProductsTitle() || ++m > 30) window.clearInterval(mt); }, 500); }
    if (!placeSections()) {
      let n = 0;
      const t = window.setInterval(function () { if (placeSections() || ++n > 30) window.clearInterval(t); }, 500);
    }
  }


  /* ---------------- English digits everywhere ---------------- */
  function latinDigits(root) {
    const AR = /[٠-٩۰-۹]/;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      if (!AR.test(n.nodeValue)) continue;
      const p = n.parentElement;
      if (p && /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(p.tagName)) continue;
      n.nodeValue = n.nodeValue.replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
                               .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); });
    }
  }
  function watchDigits() {
    latinDigits(document.body);
    let pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () { pending = false; latinDigits(document.body); });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function init() {
    try { wheelLifecycle(); } catch (e) {}
    try { watchDigits(); } catch (e) {}
    if (shouldSkip() || !document.body || document.getElementById('thq-assistant')) return;
    installStyles();
    installExtraStyles();
    if (/\/p\d+(?:\/|$)/.test(location.pathname)) document.body.classList.add('thq-pdp');
    addTrustBar();
    window.setTimeout(showWheel, 1200);
    root = document.createElement('div');
    root.id = 'thq-assistant';
    root.setAttribute('dir', 'rtl');
    root.innerHTML =
      '<button class="thq-launcher" type="button" aria-label="افتح دليل العود التفاعلي" aria-controls="thq-guide-dialog" aria-expanded="false"><svg class="thq-l-star" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg><span class="thq-launcher-text">دليلك للعود</span></button>' +
      '<button class="thq-top" type="button" data-thq-top aria-label="العودة إلى أعلى الصفحة">↑</button>' +
      '<div class="thq-backdrop" hidden>' +
        '<section id="thq-guide-dialog" class="thq-dialog" role="dialog" aria-modal="true" aria-label="دليل الثقة للعود التفاعلي">' +
          '<header class="thq-header"><div class="thq-brand"><strong>الثقة للعود</strong><small>دليلك لاختيار العود والبخور</small></div>' +
          '<button class="thq-close" data-thq-close type="button" aria-label="إغلاق النافذة">×</button></header>' +
          '<nav class="thq-tabs" role="tablist" aria-label="أقسام المساعد">' +
            tabs.map(function (t) {
              return '<button type="button" class="thq-tab" role="tab" data-thq-tab="' + t[0] + '" aria-selected="false">' + html(t[1]) + '</button>';
            }).join('') + '</nav>' +
          '<div class="thq-content-scroll" role="tabpanel"><div class="thq-body"></div></div>' +
          '<footer class="thq-footer">' +
            '<a class="thq-whatsapp" href="' + html(whatsAppUrl()) + '" target="_blank" rel="noopener noreferrer">كلّمنا واتساب ↗</a>' +
          '</footer>' +
        '</section></div>';
    document.body.appendChild(root);
    backdrop = root.querySelector('.thq-backdrop');
    panel = root.querySelector('.thq-dialog');
    launcher = root.querySelector('.thq-launcher');
    scrollButton = root.querySelector('.thq-top');
    launcher.addEventListener('click', function () { openGuide('oud'); });
    root.addEventListener('click', onRootClick);
    root.addEventListener('change', onRootChange);
    document.addEventListener('keydown', onKeyDown);
    const refreshScrollButton = function () {
      scrollButton.classList.toggle('is-visible', window.scrollY > 650 && !state.open);
    };
    window.addEventListener('scroll', refreshScrollButton, {passive:true});
    refreshScrollButton();
    addHomeSection();
    upgradeHome();
    window.addEventListener('load', addHomeSection, {once:true});
    // When a delayed slider is inserted after DOM ready, place the homepage block once.
    if (isHomepage() && !document.getElementById('thq-home-guide')) {
      window.setTimeout(addHomeSection, 900);
    }
    renderPanel();
    if (!compactFeatures()) {
      let ft = 0;
      const fti = window.setInterval(function () { if (compactFeatures() || ++ft > 40) window.clearInterval(fti); }, 500);
    }
    if (!paintCategories()) {
      let tries = 0;
      const t = window.setInterval(function () {
        if (paintCategories() || ++tries > 40) window.clearInterval(t);
      }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();