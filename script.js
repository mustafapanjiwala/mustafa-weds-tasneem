(function () {
  var C = window.INVITE;
  var $ = function (s) { return document.querySelector(s); };
  var all = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var esc = function (s) { var d = document.createElement("div"); d.textContent = s || ""; return d.innerHTML; };
  var qs = new URLSearchParams(location.search);

  /* theme: set in config.js, or preview another with ?theme=maroon / ?theme=ivory in the URL */
  var theme = qs.get("theme") || C.theme || "ivory";
  document.documentElement.setAttribute("data-theme", theme === "maroon" ? "maroon" : "ivory");

  /* ---------- fixed interface text in both languages ---------- */
  var T = {
    en: { weddingOf: "The Wedding Of", open: "Open Invitation", scroll: "scroll to unfold", weds: "Weds", amp: "&",
      counting: "Counting down", toWalima: "to the Walima", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
      celebrations: "The Celebrations", joinUs: "Join us for every occasion", map: "View on map", cal: "Add to calendar",
      rsvp: "RSVP", willYou: "Will you join us?", confirm: "Confirm on WhatsApp", awaiting: "Awaiting your presence",
      onwards: "onwards", am: "AM", pm: "PM", kindly: "Kindly let {who} know you are coming.",
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      days7: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] },
    ar: { weddingOf: "حفل زفاف", open: "افتح الدعوة", scroll: "مرّر للأسفل", weds: "و", amp: "و",
      counting: "العدّ التنازلي", toWalima: "إلى الوليمة", days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثوانٍ",
      celebrations: "المناسبات", joinUs: "شاركونا كلّ مناسبة", map: "عرض على الخريطة", cal: "أضف إلى التقويم",
      rsvp: "تأكيد الحضور", willYou: "هل ستشاركوننا؟", confirm: "التأكيد عبر واتساب", awaiting: "في انتظار تشريفكم",
      onwards: "فصاعداً", am: "ص", pm: "م", kindly: "نرجو إبلاغ {who} بحضوركم.",
      months: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
      days7: ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"] }
  };

  var lang = "en", t = T.en;
  function parts(d) { var p = d.split("-").map(Number); return { y: p[0], m: p[1], d: p[2], dow: new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay() }; }
  function longDate(d, sep) { var p = parts(d); return t.days7[p.dow] + sep + p.d + " " + t.months[p.m - 1] + " " + p.y; }
  function time12(tm) { var a = tm.split(":"), h = +a[0]; return ((h % 12) || 12) + ":" + a[1] + " " + (h < 12 ? t.am : t.pm); }
  function mapLink(f) { return f.mapUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(f.venue + ", " + f.address); }
  /* value for the current language: Arabic override if present, else English */
  function L(obj, key) { var a = lang === "ar" && obj.ar && obj.ar[key]; return a || obj[key]; }
  function P(who, key) { var a = lang === "ar" && C.ar && C.ar[who] && C.ar[who][key]; return a || C[who][key]; }

  var fns = C.functions.slice().sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
  var dates = fns.map(function (f) { return f.date; }).filter(function (d, i, a) { return a.indexOf(d) === i; });
  function set(sel, text) { all(sel).forEach(function (el) { el.textContent = text || ""; el.hidden = !text; }); }

  /* ---------- draw everything in the chosen language ---------- */
  function render(newLang) {
    lang = newLang === "ar" && C.ar ? "ar" : "en"; t = T[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    all("[data-lang]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-lang") === lang); });
    all("[data-t]").forEach(function (el) { el.textContent = t[el.getAttribute("data-t")]; });

    set("[data-groom]", P("groom", "name"));
    set("[data-bride]", P("bride", "name"));
    set("[data-monogram]", C.monogram);
    set("[data-maindate]", longDate(C.mainDate, " · "));
    set("[data-city]", L(C, "city"));
    set("[data-coverline]", L(C, "coverLine"));
    set("[data-host]", L(C, "host"));
    set("[data-hostsub]", L(C, "hostSub"));
    set("[data-inviteline]", L(C, "inviteLine"));
    set("[data-groom-parents]", P("groom", "parents"));
    set("[data-bride-parents]", P("bride", "parents"));
    set("[data-nikah]", L(C, "nikahLine"));
    $("[data-blessing]").innerHTML = (L(C, "blessing") || []).map(esc).join(" ");
    $("[data-awaiting]").innerHTML = (L(C, "awaiting") || []).map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("");
    document.title = C.groom.name + " & " + C.bride.name + " — Wedding Invitation";

    $("#days").innerHTML = dates.map(function (d, di) {
      var dayFns = fns.filter(function (f) { return f.date === d; });
      var items = dayFns.map(function (f) {
        return '<div class="fn"><h4>' + esc(L(f, "name")) + '</h4>' +
          (L(f, "note") ? '<p class="note">' + esc(L(f, "note")) + '</p>' : '') +
          '<p class="time">' + time12(f.time) + (f.endTime ? '' : ' ' + t.onwards) + '</p>' +
          '<p class="venue">' + esc(L(f, "venue")) + '</p>' +
          (f.address ? '<p class="addr">' + esc(L(f, "address")) + '</p>' : '') +
          '<div class="actions"><a class="btn" target="_blank" rel="noopener" href="' + esc(mapLink(f)) + '">' + t.map + '</a>' +
          '<button class="btn" type="button" data-cal="' + fns.indexOf(f) + '">' + t.cal + '</button></div></div>';
      }).join("");
      return '<article class="day reveal in"><svg class="flora ' + (di % 2 ? 'l flip' : 'r') + '" aria-hidden="true"><use href="#lily"/></svg>' +
        '<div class="day-head">' + longDate(d, lang === "ar" ? "، " : ", ") + '</div>' +
        '<p class="hijri">' + esc(L(dayFns[0], "hijri") || "") + '</p>' + items + '</article>';
    }).join("");

    if (C.rsvp && C.rsvp.whatsapp) {
      var who = (lang === "ar" && C.ar && C.ar.rsvpContact) || C.rsvp.contactName || "us";
      $("[data-rsvp-text]").textContent = t.kindly.replace("{who}", who);
      $("#rsvpBtn").href = "https://wa.me/" + C.rsvp.whatsapp.replace(/\D/g, "") + "?text=" +
        encodeURIComponent(C.rsvp.message.replace("{groom}", C.groom.name).replace("{bride}", C.bride.name));
      $("#rsvp").hidden = false;
    }
    rise();
  }

  /* ---------- language toggle (remembered on this phone; ?lang=ar in a link also works) ---------- */
  var saved = null; try { saved = localStorage.getItem("invite-lang"); } catch (e) {}
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]"); if (!b) return;
    render(b.getAttribute("data-lang"));
    try { localStorage.setItem("invite-lang", lang); } catch (err) {}
  });

  /* ---------- add to calendar (.ics file made in the browser, always in English) ---------- */
  function stamp(date, time) { return date.replace(/-/g, "") + "T" + (time || "00:00").replace(":", "") + "00"; }
  function icsEsc(s) { return (s || "").replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n"); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cal]"); if (!b) return;
    var f = fns[+b.getAttribute("data-cal")];
    var end = f.endTime || (("0" + Math.min(23, +f.time.split(":")[0] + 3)).slice(-2) + ":" + f.time.split(":")[1]);
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invite//EN", "BEGIN:VEVENT",
      "UID:" + f.name.replace(/\W/g, "") + "-" + f.date + "@wedding-invite",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      "DTSTART:" + stamp(f.date, f.time), "DTEND:" + stamp(f.date, end),
      "SUMMARY:" + icsEsc(f.name + " – " + C.groom.name + " & " + C.bride.name),
      "LOCATION:" + icsEsc([f.venue, f.address].filter(Boolean).join(", ")),
      "DESCRIPTION:" + icsEsc(mapLink(f)),
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    a.download = f.name.toLowerCase().replace(/\W+/g, "-") + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---------- countdown ---------- */
  var cdf = fns.filter(function (f) { return f.name === C.countdownTo; })[0] || fns[0];
  var target = new Date(cdf.date + "T" + cdf.time + ":00" + (C.utcOffset || "Z")).getTime();
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    $("#cd-d").textContent = pad(Math.floor(s / 86400));
    $("#cd-h").textContent = pad(Math.floor(s % 86400 / 3600));
    $("#cd-m").textContent = pad(Math.floor(s % 3600 / 60));
    $("#cd-s").textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- background music: starts when the doors open, button turns it off/on ---------- */
  var bgm = $("#bgm"), mBtn = $("#musicBtn"), wanted = false, fade = null;
  if (C.music) { bgm.src = C.music; mBtn.hidden = false; }
  function music(on) {
    if (!C.music) return;
    wanted = on; clearInterval(fade);
    mBtn.classList.toggle("playing", on); mBtn.setAttribute("aria-pressed", on);
    var max = C.musicVolume || 0.35;
    if (on) {
      bgm.volume = 0;
      var pr = bgm.play();
      if (pr && pr.catch) pr.catch(function () { wanted = false; mBtn.classList.remove("playing"); });
      fade = setInterval(function () { bgm.volume = Math.min(max, bgm.volume + max / 20); if (bgm.volume >= max) clearInterval(fade); }, 100);
    } else { bgm.pause(); }
  }
  mBtn.addEventListener("click", function () { music(!wanted); });
  document.addEventListener("visibilitychange", function () {
    if (!C.music || !wanted) return;
    if (document.hidden) bgm.pause(); else bgm.play().catch(function () {});
  });

  /* ---------- open the cover ---------- */
  $("#openBtn").addEventListener("click", function () {
    var c = $("#cover");
    music(true);
    c.classList.add("open");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    setTimeout(function () { c.classList.add("gone"); }, 1700);
  });

  /* ---------- invitation card rises and grows as you scroll to it ---------- */
  var card = $("#riseCard"), still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches, queued = false;
  function rise() {
    queued = false;
    if (still || !card) return;
    var vh = window.innerHeight, top = card.parentNode.getBoundingClientRect().top;
    var p = Math.max(0, Math.min(1, (vh - top) / (vh * 0.8)));
    p = 1 - Math.pow(1 - p, 3);
    card.style.transform = "translateY(" + ((1 - p) * 180).toFixed(1) + "px) scale(" + (0.86 + 0.14 * p).toFixed(3) + ")";
    card.style.opacity = (0.25 + 0.75 * p).toFixed(2);
  }
  window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(rise); } }, { passive: true });
  window.addEventListener("resize", rise);

  render(qs.get("lang") || saved || "en");

  /* ---------- reveal on scroll (static sections) ---------- */
  var els = all(".reveal:not(.day)");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in"); }); }
})();
