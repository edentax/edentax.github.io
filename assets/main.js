// 에덴택스 메인페이지: 메뉴, 스크롤 등장 효과, 문구 회전, 패럴랙스
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

  // 스크롤 등장 효과
  var targets = document.querySelectorAll("[data-anim], .process");
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
})();
