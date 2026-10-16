/* ============================================================
   content 폴더의 .md 파일을 읽어 화면에 그리는 코드입니다.
   글 내용을 바꿀 때는 이 파일을 건드리지 않아도 됩니다.
   ============================================================ */
(function () {
  'use strict';

  var FILES = ['hero', 'facts', 'services', 'now', 'videos', 'career', 'credentials', 'contact'];

  /* ---------- 마크다운 읽기 ----------
     # 제목         → 섹션 제목
     ## 제목        → 항목 하나 시작
     키: 값         → 항목(또는 섹션)의 정보
     - 내용         → 목록
     <!-- ... -->   → 메모 (화면에 안 나옴)            */
  function parse(text) {
    var sec = { title: '', meta: {}, bullets: [], items: [] };
    var cur = null;
    text = String(text).replace(/^﻿/, '').replace(/<!--[\s\S]*?-->/g, '');
    text.split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim();
      if (!line) return;
      var target = cur || sec;
      var m;
      if (/^##\s+/.test(line)) {
        cur = { title: line.replace(/^##\s+/, ''), meta: {}, bullets: [] };
        sec.items.push(cur);
      } else if (/^#\s+/.test(line)) {
        sec.title = line.replace(/^#\s+/, '');
      } else if (/^[-*]\s+/.test(line)) {
        target.bullets.push(line.replace(/^[-*]\s+/, ''));
      } else if ((m = line.match(/^([가-힣A-Za-z0-9]{1,12})\s*[:：]\s*(.*)$/)) && m[2].indexOf('//') !== 0) {
        target.meta[m[1]] = m[2].trim();
      } else {
        target.meta['본문'] = (target.meta['본문'] ? target.meta['본문'] + ' ' : '') + line;
      }
    });
    return sec;
  }

  /* ---------- 글자 처리: <br> 줄바꿈과 **강조**만 허용 ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmt(s) {
    return esc(s)
      .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  function plain(s) { return String(s || '').replace(/<br\s*\/?>/gi, ' ').replace(/\*\*/g, ''); }
  function val(o, k) { return (o && o.meta && o.meta[k]) || ''; }
  function safeUrl(u) {
    u = String(u || '').trim();
    if (/^(https?:\/\/|mailto:|#|assets\/|\.\/|\/)/i.test(u)) return u;
    return '';
  }
  function ext(u) { return /^https?:\/\//i.test(u) ? ' target="_blank" rel="noopener"' : ''; }
  function head(sec, id) {
    return '<div class="sec-head">' +
      (val(sec, '영문') ? '<div class="eyebrow">' + fmt(val(sec, '영문')) + '</div>' : '') +
      '<h2>' + fmt(sec.title) + '</h2></div>';
  }
  function $(id) { return document.getElementById(id); }

  /* ---------- 유튜브 주소에서 영상 ID 꺼내기 ---------- */
  function ytId(url) {
    var m = String(url || '').match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  /* ---------- 각 섹션 그리기 ---------- */
  function renderHero(d) {
    var photo = safeUrl(val(d, '사진'));
    var resume = safeUrl(val(d, '이력서링크'));
    $('hero').innerHTML =
      '<div class="wrap"><div>' +
        '<h1>' + fmt(val(d, '이름')) + '</h1>' +
        '<p class="role">' + fmt(val(d, '직함')) + '</p>' +
        '<p class="tagline">' + fmt(val(d, '소개')) + '</p>' +
        '<div class="cta">' +
          '<a class="btn primary" href="#work">' + fmt(val(d, '영상버튼') || '출연 영상 보기 →') + '</a>' +
          (resume ? '<a class="btn" href="' + esc(resume) + '"' + ext(resume) + '>' + fmt(val(d, '이력서버튼') || '이력서 보기 ↗') + '</a>' : '') +
        '</div>' +
      '</div>' +
      '<div class="pwrap"><div class="portrait"><span>PROFILE PHOTO</span>' +
        (photo ? '<img src="' + esc(photo) + '" alt="' + esc(plain(val(d, '이름'))) + ' 프로필 사진" onerror="this.remove()">' : '') +
      '</div></div></div>';
  }

  function renderFacts(d) {
    $('facts').innerHTML = '<div class="wrap">' + d.items.map(function (it) {
      return '<div class="fact"><b>' + fmt(it.title) + '</b><span>' + fmt(val(it, '설명')) + '</span></div>';
    }).join('') + '</div>';
  }

  function renderServices(d) {
    $('what').innerHTML = '<div class="wrap">' + head(d) + '<div class="services">' + d.items.map(function (it) {
      var cat = val(it, '영상분류'), link = safeUrl(val(it, '링크')), more = '';
      if (cat) more = '<a class="more" href="#work" data-jump="' + esc(cat) + '">' + fmt(val(it, '링크문구') || '관련 영상 →') + '</a>';
      else if (link) more = '<a class="more" href="' + esc(link) + '"' + ext(link) + '>' + fmt(val(it, '링크문구') || '자세히 보기 →') + '</a>';
      return '<article class="svc">' +
        (val(it, '영문') ? '<span class="tag">' + fmt(val(it, '영문')) + '</span>' : '') +
        '<h3>' + fmt(it.title) + '</h3>' +
        (val(it, '설명') ? '<p>' + fmt(val(it, '설명')) + '</p>' : '') +
        (it.bullets.length ? '<ul>' + it.bullets.map(function (b) { return '<li>' + fmt(b) + '</li>'; }).join('') + '</ul>' : '') +
        more + '</article>';
    }).join('') + '</div></div>';
  }

  function renderNow(d) {
    $('now').innerHTML = '<div class="wrap">' + head(d) + '<div class="now-grid">' + d.items.map(function (it) {
      return '<div class="now-card"><span class="since">' + fmt(val(it, '기간')) + '</span>' +
        '<h3>' + fmt(it.title) + '</h3><p>' + fmt(val(it, '설명')) + '</p></div>';
    }).join('') + '</div></div>';
  }

  function renderVideos(d) {
    var cats = [];
    d.items.forEach(function (it) { var c = val(it, '분류'); if (c && cats.indexOf(c) < 0) cats.push(c); });
    var filters = '<div class="filters" role="group" aria-label="영상 분류">' +
      '<button type="button" data-f="" aria-pressed="true">전체</button>' +
      cats.map(function (c) { return '<button type="button" data-f="' + esc(c) + '" aria-pressed="false">' + fmt(c) + '</button>'; }).join('') +
      '</div>';
    var clips = d.items.map(function (it) {
      var url = safeUrl(val(it, '링크')), id = ytId(url);
      var thumb = safeUrl(val(it, '썸네일')) || (id ? 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg' : '');
      var meta = '<span class="meta">' + fmt(val(it, '정보')) + '</span><span class="t">' + fmt(it.title) + '</span>';
      var cat = ' data-c="' + esc(val(it, '분류')) + '"';
      if (!url) {
        return '<li class="clip"' + cat + '><div class="pending"><div class="thumb"><span>영상 링크 추가 예정</span></div>' + meta + '</div></li>';
      }
      return '<li class="clip"' + cat + '><a href="' + esc(url) + '"' + ext(url) + '><div class="thumb">' +
        (thumb ? '<img loading="lazy" alt="" src="' + esc(thumb) + '" onerror="this.remove()">' : '') +
        '<span class="pi" aria-hidden="true">▶</span></div>' + meta + '</a></li>';
    }).join('');
    $('work').innerHTML = '<div class="wrap">' + head(d) + (cats.length > 1 ? filters : '') + '<ul class="clips" id="clips">' + clips + '</ul></div>';
  }

  function renderCareer(d, cr) {
    var rows = d.items.map(function (it) {
      var art = safeUrl(val(it, '기사링크'));
      return '<div class="row"><span class="when">' + fmt(val(it, '기간')) + '</span><div>' +
        '<span class="org">' + fmt(it.title) + '</span>' +
        (val(it, '직책') ? '<span class="pos">' + fmt(val(it, '직책')) + '</span>' : '') +
        (val(it, '내용') ? '<span class="what">' + fmt(val(it, '내용')) + '</span>' : '') +
        '</div>' +
        (art ? '<a class="art" href="' + esc(art) + '"' + ext(art) + '>' + fmt(val(it, '기사버튼') || '기사 보기 ↗') + '</a>' : '') +
        '</div>';
    }).join('');
    var creds = cr && cr.items.length ? '<div class="creds">' + cr.items.map(function (g) {
      return '<div>' + (val(g, '영문') ? '<span class="eyebrow">' + fmt(val(g, '영문')) + '</span>' : '') +
        '<h3>' + fmt(g.title) + '</h3><ul>' + g.bullets.map(function (b) {
          var p = b.split('|');
          return '<li>' + fmt(p[0].trim()) + (p[1] ? '<span>' + fmt(p.slice(1).join('|').trim()) + '</span>' : '') + '</li>';
        }).join('') + '</ul></div>';
    }).join('') + '</div>' : '';
    $('career').innerHTML = '<div class="wrap">' + head(d) + '<div class="timeline">' + rows + '</div>' + creds + '</div>';
  }

  function renderContact(d) {
    var email = val(d, '이메일');
    var links = [];
    if (safeUrl(val(d, '유튜브'))) links.push('<a href="' + esc(val(d, '유튜브')) + '" target="_blank" rel="noopener">' + fmt(val(d, '유튜브이름') || 'YouTube') + ' ↗</a>');
    if (safeUrl(val(d, '인스타그램'))) links.push('<a href="' + esc(val(d, '인스타그램')) + '" target="_blank" rel="noopener">' + fmt(val(d, '인스타그램이름') || 'Instagram') + ' ↗</a>');
    var types = d.bullets.length ? d.bullets : ['방송 출연', '채용 제안', '콘텐츠 협업', '기타'];
    $('contact').innerHTML = '<div class="wrap"><div>' +
        (val(d, '영문') ? '<div class="eyebrow">' + fmt(val(d, '영문')) + '</div>' : '') +
        '<h2>' + fmt(d.title) + '</h2>' +
        '<p class="desc">' + fmt(val(d, '설명')) + '</p>' +
        '<div class="direct">' + (email ? '이메일 <code>' + esc(email) + '</code><br>' : '') + links.join('&nbsp;&nbsp; ') + '</div>' +
      '</div>' +
      '<form id="contactForm" novalidate>' +
        '<div class="two">' +
          '<label for="f-name">이름 / 소속<input id="f-name" name="name" autocomplete="name" placeholder="홍길동 / OO방송 보도국"></label>' +
          '<label for="f-email">회신받을 이메일<input id="f-email" name="email" type="email" autocomplete="email" placeholder="name@company.com"></label>' +
        '</div>' +
        '<label for="f-type">문의 종류<select id="f-type" name="type">' + types.map(function (t) { return '<option>' + esc(plain(t)) + '</option>'; }).join('') + '</select></label>' +
        '<label for="f-msg">문의 내용<textarea id="f-msg" name="message" placeholder="일정, 프로그램 성격, 원하시는 역할을 적어주세요."></textarea></label>' +
        '<span class="err" id="f-err" aria-live="polite"></span>' +
        '<button class="btn submit" type="submit">문의 보내기</button>' +
        '<span class="status" id="f-status" aria-live="polite"></span>' +
      '</form></div>';
    bindForm(val(d, '폼주소'), email);
  }

  /* ---------- 문의 폼 ----------
     contact.md 의 '폼주소'에 Formspree 주소를 넣으면 메일로 바로 전송됩니다.
     비어 있으면 방문자의 메일 앱이 열리도록 합니다.                       */
  function bindForm(endpoint, email) {
    var form = $('contactForm'), err = $('f-err'), st = $('f-status');
    form.addEventListener('input', function () { err.textContent = ''; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var from = form.email.value.trim(), msg = form.message.value.trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(from)) { err.textContent = '회신받을 이메일 주소를 확인해 주세요.'; form.email.focus(); return; }
      if (!msg) { err.textContent = '문의 내용을 입력해 주세요.'; form.message.focus(); return; }
      if (!/^https:\/\//.test(endpoint || '')) {
        var body = '이름/소속: ' + form.name.value.trim() + '\n회신 이메일: ' + from + '\n문의 종류: ' + form.type.value + '\n\n' + msg;
        location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('[홈페이지 문의] ' + form.type.value) + '&body=' + encodeURIComponent(body);
        st.textContent = '메일 앱이 열리지 않으면 ' + email + ' 으로 직접 보내주세요.';
        return;
      }
      st.textContent = '보내는 중…';
      fetch(endpoint, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); st.textContent = '문의가 접수됐습니다. 빠르게 회신드릴게요.'; })
        .catch(function () { st.textContent = '전송하지 못했습니다. ' + email + ' 으로 직접 보내주세요.'; });
    });
  }

  function renderNav(list) {
    $('nav').innerHTML = list.filter(function (x) { return x.label; }).map(function (x) {
      return '<li><a href="#' + x.id + '">' + fmt(x.label) + '</a></li>';
    }).join('');
  }

  /* ---------- 영상 분류 버튼 ---------- */
  function bindFilters() {
    var btns = [].slice.call(document.querySelectorAll('.filters button'));
    var clips = [].slice.call(document.querySelectorAll('#clips .clip'));
    function apply(f) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-f') === f ? 'true' : 'false'); });
      clips.forEach(function (c) { c.classList.toggle('is-hidden', !!f && c.getAttribute('data-c') !== f); });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-f')); }); });
    [].forEach.call(document.querySelectorAll('[data-jump]'), function (a) {
      a.addEventListener('click', function () { apply(a.getAttribute('data-jump')); });
    });
  }

  /* ---------- 실행 ---------- */
  function load(name) {
    return fetch('content/' + name + '.md', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(name + '.md 파일을 찾지 못했습니다');
      return r.text();
    }).then(parse);
  }

  function run(c) {
    var steps = [
      function () { renderHero(c.hero); },
      function () { renderFacts(c.facts); },
      function () { renderServices(c.services); },
      function () { renderNow(c.now); },
      function () { renderVideos(c.videos); },
      function () { renderCareer(c.career, c.credentials); },
      function () { renderContact(c.contact); },
      function () {
        renderNav([
          { id: 'what', label: val(c.services, '메뉴') },
          { id: 'work', label: val(c.videos, '메뉴') },
          { id: 'career', label: val(c.career, '메뉴') },
          { id: 'contact', label: val(c.contact, '메뉴') }
        ]);
      },
      bindFilters,
      function () { $('footer').innerHTML = '© ' + new Date().getFullYear() + ' ' + fmt(plain(val(c.hero, '이름'))) + ' ' + fmt(val(c.hero, '영문이름')); }
    ];
    steps.forEach(function (fn) {
      try { fn(); } catch (e) { if (window.console) console.error(e); }
    });
  }

  Promise.all(FILES.map(load)).then(function (list) {
    var c = {};
    FILES.forEach(function (n, i) { c[n] = list[i]; });
    run(c);
  }).catch(function (e) {
    $('top').innerHTML = '<div class="load-error"><b>내용 파일을 불러오지 못했습니다.</b><br>' + esc(e.message) +
      '<br><br>content 폴더 안에 .md 파일 이름이 바뀌거나 지워지지 않았는지 확인해 주세요.<br>' +
      '내 컴퓨터에서 index.html을 바로 열면 이 화면이 나옵니다. 깃허브에 올린 주소로 확인해 주세요.</div>';
  });
})();
