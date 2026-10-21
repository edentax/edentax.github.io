// 에덴택스 홈페이지 공통: 메뉴, 스크롤 등장 효과, 문구 회전, 패럴랙스, 칼럼 주제 고르기, 읽기 진행 막대
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 첫 화면 제목 올라오기
  requestAnimationFrame(function () {
    setTimeout(function () { document.body.classList.add("is-loaded"); }, 80);
  });

  // 상단 메뉴: 스크롤하면 흰 배경, 모바일 메뉴 열고 닫기
  var gnb = document.getElementById("gnb");
  var toggle = document.getElementById("gnbToggle");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    var y = window.scrollY || doc.scrollTop;
    gnb.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-show", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toggle.addEventListener("click", function () {
    var open = gnb.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });
  document.querySelectorAll("#gnbMenu a").forEach(function (a) {
    a.addEventListener("click", function () { gnb.classList.remove("is-open"); });
  });
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  // 지금 보는 메뉴 표시 (body data-nav)
  var nav = document.body.getAttribute("data-nav");
  if (nav) document.querySelectorAll('#gnbMenu [data-nav="' + nav + '"]').forEach(function (a) { a.classList.add("is-active"); });

  // 탭 줄: 현재 탭이 화면에 보이도록
  var curTab = document.querySelector(".local-tabs [aria-current]");
  if (curTab) curTab.parentElement.scrollLeft = curTab.offsetLeft - 16;

  // 스크롤 등장 효과
  var targets = document.querySelectorAll("[data-anim], .process, .flow");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  }

  // 첫 화면 세목 회전
  var rot = document.querySelector(".rotator");
  var words = document.querySelectorAll(".rotator b");
  function fit(el) { rot.style.width = el.getBoundingClientRect().width + "px"; }
  if (rot && words.length) {
    fit(words[0]);
    window.addEventListener("resize", function () { fit(rot.querySelector(".is-on")); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(rot.querySelector(".is-on")); });
  }
  if (words.length > 1 && !reduce) {
    var i = 0;
    setInterval(function () {
      var cur = words[i];
      i = (i + 1) % words.length;
      cur.classList.remove("is-on");
      cur.classList.add("is-out");
      words[i].classList.remove("is-out");
      words[i].classList.add("is-on");
      fit(words[i]);
      setTimeout(function () { cur.classList.remove("is-out"); }, 700);
    }, 2600);
  }

  // 큰 배경 글자 패럴랙스
  var para = document.querySelectorAll("[data-parallax]");
  if (para.length && !reduce) {
    var ticking = false;
    function move() {
      para.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var shift = (r.top + r.height / 2 - window.innerHeight / 2) * parseFloat(el.dataset.parallax);
        var lim = r.height * 0.2;
        shift = Math.max(-lim, Math.min(lim, shift));
        var base = el.classList.contains("hero-watermark") ? "translateX(-50%) " : "";
        el.style.transform = base + "translate3d(0," + shift.toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(move); ticking = true; }
    }, { passive: true });
    move();
  }
  // 칼럼 목록: 주제 고르기
  var chips = document.querySelectorAll(".chip-btn");
  if (chips.length) {
    var cards = document.querySelectorAll("#colTiles .col-card");
    var empty = document.getElementById("colEmpty");
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var f = c.getAttribute("data-filter"), shown = 0;
        chips.forEach(function (o) { o.classList.toggle("is-on", o === c); });
        cards.forEach(function (card) {
          var hit = f === "all" || card.getAttribute("data-cat") === f;
          card.classList.toggle("is-hidden", !hit);
          if (hit) { shown++; card.classList.add("is-in"); }
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  // 칼럼 글: 읽기 진행 막대
  var bar = document.getElementById("readBar");
  var art = document.querySelector(".article");
  if (bar && art) {
    var onRead = function () {
      var r = art.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var p = Math.min(1, Math.max(0, -r.top / (total > 0 ? total : 1)));
      bar.style.width = (p * 100).toFixed(1) + "%";
    };
    window.addEventListener("scroll", onRead, { passive: true });
    onRead();
  }
})();
