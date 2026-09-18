// ---------------------------------------------------------------------------
// DATE FUNCTIONS
// ---------------------------------------------------------------------------

function date(year, month, day) {
    return new Date(year, month - 1, day);
}

function addDays(d, days) {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
}

function sameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function inRange(d, start, end) {
    return d >= start && d <= end;
}

function nextSundayOnOrAfter(d) {
    const x = new Date(d);
    while (x.getDay() !== 0) x.setDate(x.getDate() + 1);
    return x;
}

function sundayBetweenJan2And8(year) {
    for (let day = 2; day <= 8; day++) {
        const x = date(year, 1, day);
        if (x.getDay() === 0) return x;
    }
}

function firstSundayOfAdvent(year) {
    for (let day = 27; day <= 33; day++) {
        const x = date(year, 11, day);
        if (x.getDay() === 0) return x;
    }
}


// ---------------------------------------------------------------------------
// EASTER
// ---------------------------------------------------------------------------

function easterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return date(year, month, day);
}


// ---------------------------------------------------------------------------
// TODAY
// ---------------------------------------------------------------------------

const today = new Date();
const year = today.getFullYear();

const easter = easterSunday(year);

const ashWednesday = addDays(easter, -46);
const holyThursday = addDays(easter, -3);
const goodFriday = addDays(easter, -2);
const holySaturday = addDays(easter, -1);

const ascensionThursday = addDays(easter, 39);
const ascensionSunday = addDays(easter, 42);
const pentecost = addDays(easter, 49);

const epiphany = date(year, 1, 6);
const epiphanySunday = sundayBetweenJan2And8(year);

const baptismOfTheLord = nextSundayOnOrAfter(date(year, 1, 7));

const adventStart = firstSundayOfAdvent(year);

const maryMotherChurch = addDays(pentecost, 1);
const immaculateHeartMary = addDays(pentecost, 20);


// ---------------------------------------------------------------------------
// FIXED MARIAN CELEBRATIONS
// ---------------------------------------------------------------------------

const MARIAN_FIXED = [
    ["Mary, Mother of God",             1,  1],
    ["Our Lady of Lourdes",             2, 11],
    ["Annunciation",                    3, 25],
    ["Our Lady of Fatima",              5, 13],
    ["Visitation",                      5, 31],
    ["Our Lady of Mount Carmel",        7, 16],
    ["Dedication of Saint Mary Major",  8,  5],
    ["Assumption",                      8, 15],
    ["Queenship of Mary",               8, 22],
    ["Nativity of Mary",                9,  8],
    ["Holy Name of Mary",               9, 12],
    ["Our Lady of Sorrows",             9, 15],
    ["Our Lady of the Rosary",         10,  7],
    ["Presentation of Mary",           11, 21],
    ["Immaculate Conception",          12,  8],
    ["Our Lady of Loreto",             12, 10],
    ["Our Lady of Guadalupe",          12, 12]
];

const todayMarian = MARIAN_FIXED.find(
    ([name, month, day]) => sameDay(today, date(year, month, day))
);

const movableMarian =
    sameDay(today, maryMotherChurch) ? "Mary, Mother of the Church" :
    sameDay(today, immaculateHeartMary) ? "Immaculate Heart of Mary" :
    null;


// ---------------------------------------------------------------------------
// APOSTLE FEASTS
// ---------------------------------------------------------------------------

const APOSTLE_FIXED = [
    ["Conversion of Saint Paul, Apostle",       1, 25],
    ["Saint Peter's Chair",                     2, 22],
    ["Saint Mark, Evangelist",                 4, 25],
    ["Saints Philip and James, Apostles",       5,  3],
    ["Saint Matthias, Apostle",                5, 14],
    ["Saint Barnabas, Apostle",                6, 11],
    ["Saint Thomas, Apostle",                  7,  3],
    ["Saint James, Apostle",                   7, 25],
    ["Saint Bartholomew, Apostle",             8, 24],
    ["Saint Matthew, Apostle and Evangelist",  9, 21],
    ["Saints Simon and Jude, Apostles",       10, 28],
    ["Saint Andrew, Apostle",                  11, 30],
    ["Saint John, Apostle and Evangelist",     12, 27]
];

const todayApostle = APOSTLE_FIXED.find(
    ([name, month, day]) => sameDay(today, date(year, month, day))
);