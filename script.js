(function () {
  var C = window.INVITE;
  /* theme: set in config.js, or preview another with ?theme=maroon / ?theme=ivory in the URL */
  var theme = new URLSearchParams(location.search).get("theme") || C.theme || "ivory";
  document.documentElement.setAttribute("data-theme", theme === "maroon" ? "maroon" : "ivory");
  var $ = function (s) { return document.querySelector(s); };
  var all = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var set = function (sel, text) { all(sel).forEach(function (el) { el.textContent = text || ""; if (!text) el.hidden = true; }); };
  var esc = function (s) { var d = document.createElement("div"); d.textContent = s || ""; return d.innerHTML; };

  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  function parts(d) { var p = d.split("-").map(Number); return { y: p[0], m: p[1], d: p[2], dow: new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay() }; }
  function longDate(d) { var p = parts(d); return DAYS[p.dow] + ", " + p.d + " " + MONTHS[p.m - 1] + " " + p.y; }
  function time12(t) { if (!t) return ""; var a = t.split(":"), h = +a[0]; return ((h % 12) || 12) + ":" + a[1] + " " + (h < 12 ? "AM" : "PM"); }

  var fns = C.functions.slice().sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
  var dates = fns.map(function (f) { return f.date; }).filter(function (d, i, a) { return a.indexOf(d) === i; });

  /* ---- fill text ---- */
  var md = parts(C.mainDate);
  set("[data-groom]", C.groom.name);
  set("[data-bride]", C.bride.name);
  set("[data-monogram]", C.monogram);
  set("[data-maindate]", DAYS[md.dow] + " \u00b7 " + md.d + " " + MONTHS[md.m - 1] + " " + md.y);
  set("[data-city]", C.city);
  set("[data-coverline]", C.coverLine);
  set("[data-host]", C.host);
  set("[data-hostsub]", C.hostSub);
  set("[data-inviteline]", C.inviteLine);
  set("[data-groom-parents]", C.groom.parents);
  set("[data-bride-parents]", C.bride.parents);
  set("[data-nikah]", C.nikahLine);
  $("[data-blessing]").innerHTML = (C.blessing || []).map(esc).join(" ");
  $("[data-awaiting]").innerHTML = (C.awaiting || []).map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("");
  document.title = C.groom.name + " & " + C.bride.name + " \u2014 Wedding Invitation";

  function mapLink(f) { return f.mapUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(f.venue + ", " + f.address); }

  /* ---- functions grouped by day ---- */
  $("#days").innerHTML = dates.map(function (d) {
    var items = fns.filter(function (f) { return f.date === d; }).map(function (f) {
      var i = fns.indexOf(f);
      return '<div class="fn"><h4>' + esc(f.name) + '</h4>' +
        (f.note ? '<p class="note">' + esc(f.note) + '</p>' : '') +
        '<p class="time">' + time12(f.time) + (f.endTime ? '' : ' onwards') + '</p>' +
        '<p class="venue">' + esc(f.venue) + '</p>' +
        (f.address ? '<p class="addr">' + esc(f.address) + '</p>' : '') +
        '<div class="actions">' +
        '<a class="btn" target="_blank" rel="noopener" href="' + esc(mapLink(f)) + '">View on map</a>' +
        '<button class="btn" type="button" data-cal="' + i + '">Add to calendar</button></div></div>';
    }).join("");
    return '<article class="day reveal"><svg class="flora ' + (dates.indexOf(d) % 2 ? 'l flip' : 'r') + '" aria-hidden="true"><use href="#lily"/></svg><div class="day-head">' + longDate(d) + '</div>' +
      '<p class="hijri">' + esc(fns.filter(function (f) { return f.date === d; })[0].hijri || "") + '</p>' + items + '</article>';
  }).join("");

  /* ---- add to calendar (.ics file made in the browser) ---- */
  function stamp(date, time) { return date.replace(/-/g, "") + "T" + (time || "00:00").replace(":", "") + "00"; }
  function icsEsc(s) { return (s || "").replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n"); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cal]"); if (!b) return;
    var f = fns[+b.getAttribute("data-cal")];
    var end = f.endTime || (("0" + Math.min(23, +f.time.split(":")[0] + 3)).slice(-2) + ":" + f.time.split(":")[1]);
    var title = f.name + " – " + C.groom.name + " & " + C.bride.name;
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invite//EN", "BEGIN:VEVENT",
      "UID:" + f.name.replace(/\W/g, "") + "-" + f.date + "@wedding-invite",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      "DTSTART:" + stamp(f.date, f.time), "DTEND:" + stamp(f.date, end),
      "SUMMARY:" + icsEsc(title),
      "LOCATION:" + icsEsc([f.venue, f.address].filter(Boolean).join(", ")),
      "DESCRIPTION:" + icsEsc(mapLink(f)),
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    a.download = f.name.toLowerCase().replace(/\W+/g, "-") + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---- countdown to the first function ---- */
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

  /* ---- WhatsApp RSVP ---- */
  if (C.rsvp && C.rsvp.whatsapp) {
    var msg = C.rsvp.message.replace("{groom}", C.groom.name).replace("{bride}", C.bride.name);
    $("#rsvpBtn").href = "https://wa.me/" + C.rsvp.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(msg);
    $("[data-rsvp-text]").textContent = "Kindly let " + (C.rsvp.contactName || "us") + " know you are coming" +
      (C.rsvp.replyBy ? " by " + C.rsvp.replyBy : "") + ".";
    $("#rsvp").hidden = false;
  }

  /* ---- open the cover ---- */
  $("#openBtn").addEventListener("click", function () {
    var c = $("#cover");
    c.classList.add("open");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    setTimeout(function () { c.classList.add("gone"); }, 1700);
  });

  /* ---- reveal on scroll ---- */
  var els = all(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in"); }); }
})();
