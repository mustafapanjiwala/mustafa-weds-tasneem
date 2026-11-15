/* ============================================================
   ALL WEDDING DETAILS LIVE HERE.
   Edit this file only - the page updates itself.
   ============================================================ */
window.INVITE = {
  groom: { name: "Mustafa",     parents: "S/o Mulla Murtaza Bhai & Mrs. Raziya Panjiwala" },
  bride: { name: "Dr. Tasneem", parents: "D/o Mr. Habib Bhai & Mrs. Raziya Attar" },
  monogram: "M & T",
  theme: "maroon",                       // "ivory" or "maroon"

  // Lines under the Bismillah
  blessing: [
    "By the grace of Allah Subhanahu, through the wasila of Panjatan Pak (A.S.),",
    "with the blessings of H. H. Dr. Syedna Mohammed Burhanuddin Saheb (R.A.)",
    "& the Dua Mubarak of H. H. Dr. Syedna Aali Qadar Mufaddal Saifuddin Saheb (T.U.S.)",
  ],
  host: "Shk. Gulam Husain Panjiwala",
  hostSub: "(Late Kulsum Bai Panjiwala)",
  inviteLine: "invites you to celebrate the wedding of his grandson. Your presence will make the occasion even more memorable.",
  nikahLine: "Nikah was performed on the pious hands of Aqa Moula (T.U.S.)",

  coverLine: "Panjiwala & Kagzi Families",
  mainDate: "2027-01-11",                // date shown on the cover and under the names
  countdownTo: "Walima (Lunch)",         // name of the function the countdown runs to
  city: "Ujjain, India",
  utcOffset: "+05:30",

  // One entry per function. Same-date functions are grouped on one card.
  // time is 24h "HH:MM". endTime "" shows "onwards".
  // mapUrl "" = the map button searches Google Maps for venue + address. Paste an exact pin link to override.
  functions: [
    { name: "Meethi Shitabi",       date: "2027-01-06", hijri: "29th Rajab ul Asab 1448 H.",   time: "19:30", endTime: "", venue: "Saifee Mohalla Mawaid",   address: "Ujjain",            mapUrl: "https://maps.app.goo.gl/SQ5HisLJy928eFyWA", note: "" ,
      ar: { name: "ميتهي شتابي", venue: "موائد المحلة السيفية", address: "أجين", hijri: "29 رجب الأصب 1448 هـ", note: "" } },
    { name: "Mehendi",              date: "2027-01-09", hijri: "2nd Shaban al Kareem 1448 H.", time: "12:00", endTime: "", venue: "Kadwali Farm House",      address: "Ager Road, Ujjain", mapUrl: "https://maps.app.goo.gl/XX92o6L5hA5jjrEBA", note: "" ,
      ar: { name: "مهندي", venue: "مزرعة كدوالي", address: "طريق أغر، أجين", hijri: "2 شعبان الكريم 1448 هـ", note: "" } },
    { name: "Mama Mosala",          date: "2027-01-09", hijri: "2nd Shaban al Kareem 1448 H.", time: "20:00", endTime: "", venue: "Kadwali Farm House",      address: "Ager Road, Ujjain", mapUrl: "https://maps.app.goo.gl/XX92o6L5hA5jjrEBA", note: "" ,
      ar: { name: "ماما موسالا", venue: "مزرعة كدوالي", address: "طريق أغر، أجين", hijri: "2 شعبان الكريم 1448 هـ", note: "" } },
    { name: "Darees ni Majlis",     date: "2027-01-10", hijri: "3rd Shaban al Kareem 1448 H.", time: "13:30", endTime: "", venue: "Saifee Mohalla Mawaid",   address: "Ujjain",            mapUrl: "https://maps.app.goo.gl/SQ5HisLJy928eFyWA", note: "" ,
      ar: { name: "مجلس الدريس", venue: "موائد المحلة السيفية", address: "أجين", hijri: "3 شعبان الكريم 1448 هـ", note: "" } },
    { name: "Sharbat & Procession", date: "2027-01-10", hijri: "3rd Shaban al Kareem 1448 H.", time: "20:00", endTime: "", venue: "Ibrahimi Mohalla Mawaid", address: "Ujjain",            mapUrl: "https://maps.app.goo.gl/CpCEwVLHZ2MqPQQX8", note: "" ,
      ar: { name: "الشربت والموكب", venue: "موائد المحلة الإبراهيمية", address: "أجين", hijri: "3 شعبان الكريم 1448 هـ", note: "" } },
    { name: "Walima (Lunch)",       date: "2027-01-11", hijri: "4th Shaban ul Kareem 1448 H.", time: "13:30", endTime: "", venue: "Saifee Mohalla Mawaid",   address: "Ujjain",            mapUrl: "https://maps.app.goo.gl/SQ5HisLJy928eFyWA", note: "Insha'Allah" ,
      ar: { name: "الوليمة (غداء)", venue: "موائد المحلة السيفية", address: "أجين", hijri: "4 شعبان الكريم 1448 هـ", note: "إن شاء الله" } },
  ],

  awaiting: [
    "Mulla Murtaza & Mrs. Raziya Panjiwala",
    "Mr. Ismail & Mrs. Fatema Panjiwala",
    "Mr. Abbas & Mrs. Nafisa Kagzi",
    "Panjiwala & Kagzi Families",
    "Relatives & Friends",
  ],

  // Arabic version (shown when the guest taps the "ع" toggle). Same keys as above.
  ar: {
    groom: { name: "مصطفى",    parents: "ابن ملا مرتضى بهائي والسيدة راضية بنجي والا" },
    bride: { name: "د. تسنيم", parents: "ابنة السيد حبيب بهائي والسيدة راضية عطار" },
    blessing: [
      "بفضل الله سبحانه، وبوسيلة الخمسة الأطهار (عليهم السلام)،",
      "وببركات سيدنا الدكتور محمد برهان الدين (رضوان الله عليه)،",
      "وبالدعاء المبارك لسيدنا الدكتور عالي قدر مفضل سيف الدين (طول الله عمره الشريف)",
    ],
    host: "الشيخ غلام حسين بنجي والا",
    hostSub: "(المرحومة كلثوم باي بنجي والا)",
    inviteLine: "يدعوكم للاحتفال بزفاف حفيده، وحضوركم يزيد المناسبة بهجةً وذكرى.",
    nikahLine: "تمّ عقد النكاح على اليد المباركة لآقا مولى (طول الله عمره الشريف)",
    coverLine: "عائلتا بنجي والا وكاغزي",
    city: "أجين، الهند",
    awaiting: [
      "ملا مرتضى والسيدة راضية بنجي والا",
      "السيد إسماعيل والسيدة فاطمة بنجي والا",
      "السيد عباس والسيدة نفيسة كاغزي",
      "عائلتا بنجي والا وكاغزي",
      "الأهل والأصدقاء",
    ],
    rsvpContact: "عائلة بنجي والا",
  },

  rsvp: {
    whatsapp: "917693953153",
    contactName: "the Panjiwala family",
    message: "Assalamu Alaikum! We will be happy to attend the wedding of {groom} & {bride}. Number of guests: ",
    replyBy: "",
  },
};
