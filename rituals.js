'use strict';
// ==================== RITUALS ====================

const CONFIG = {
    whatsapp: '919866193066',          // business WhatsApp number (country code, no +)
    email: 'chanakyasahni8@gmail.com',
    phoneDisplay: '+91 98661 93066',
    upiId: '',                         // e.g. 'yourname@upi' -> enables a real payment QR
    upiName: 'Rituals'
};

// -------------------- HELPERS --------------------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inr = n => '₹' + Number(n).toLocaleString('en-IN');

let toastTimer;
function showNotification(message, type = 'success') {
    const n = $('#notification');
    n.className = 'notification ' + type;
    n.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" aria-hidden="true"></i> ${esc(message)}`;
    n.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { n.style.display = 'none'; }, 3200);
}

// -------------------- DATA: FAITHS --------------------
const FAITHS = [
    { id: 'hindu', name: 'Sanātan Dharm', icon: 'fas fa-om', provider: 'Pandit' },
    { id: 'muslim', name: 'Islam', icon: 'fas fa-mosque', provider: 'Imam' },
    { id: 'sikh', name: 'Sikhism', icon: 'fas fa-khanda', provider: 'Granthi' },
    { id: 'christian', name: 'Christianity', icon: 'fas fa-cross', provider: 'Priest / Pastor' },
    { id: 'jain', name: 'Jainism', icon: 'fas fa-dharmachakra', provider: 'Jain Scholar' }
];
const faithById = id => FAITHS.find(f => f.id === id);

// -------------------- DATA: CEREMONIES [name, description, price] --------------------
const EVENTS = {
    hindu: [
        ['Deepawali Puja', 'Lakshmi Puja for prosperity', 1800], ['Satyanarayan Puja', 'Worship of Lord Vishnu', 1500],
        ['Griha Pravesh', 'New home inauguration ceremony', 3000], ['Mundan Ceremony', 'First hair cutting ceremony for a child', 2000],
        ['Vivah (Wedding)', 'Complete wedding ceremony arrangements', 15000], ['Namkaran', 'Baby naming ceremony', 1200],
        ['Annaprashan', 'First rice feeding ceremony', 1500], ['Upanayanam', 'Sacred thread ceremony', 3500],
        ['Shraddha', 'Ancestral rites ceremony', 2800], ['Ganesh Chaturthi Puja', 'Ganesh worship ceremony', 2200],
        ['Navratri Puja', 'Nine nights of Goddess worship', 4000], ['Maha Shivratri Puja', 'Night of Shiva worship', 2500],
        ['Janmashtami Puja', 'Krishna birthday celebration', 2300], ['Raksha Bandhan', 'Brother-sister bonding ceremony', 1000],
        ['Holi Puja', 'Festival of colours ceremony', 1800], ['Durga Puja', 'Goddess Durga worship', 3500],
        ['Saraswati Puja', 'Goddess of knowledge worship', 1800]
    ],
    muslim: [
        ['Nikah (Marriage)', 'Islamic wedding ceremony', 5000], ['Aqiqah', 'Birth ceremony for a newborn', 3000],
        ['Eid Prayers', 'Special Eid congregation prayers', 1500], ['Milad-un-Nabi', "Prophet Muhammad's birthday celebration", 2000],
        ['Khatam Quran', 'Quran completion ceremony', 2500], ['Bismillah', "Child's first Quran reading", 1800],
        ['Walima', 'Post-wedding reception feast', 4000], ['Arz-e-Quran', 'Quran recitation ceremony', 2200],
        ['Shab-e-Barat', 'Night of forgiveness prayers', 1500], ['Shab-e-Qadr', 'Night of power prayers', 1500],
        ['Eid-ul-Fitr', 'Festival of breaking the fast', 2000], ['Eid-ul-Adha', 'Festival of sacrifice', 3000],
        ["Jumu'ah Prayers", 'Friday congregational prayers', 1000], ['Tahneek', 'Newborn blessing ceremony', 1200],
        ['Hajj / Umrah Send-off', 'Pilgrimage prayers and send-off ceremony', 5000], ['Janazah', 'Funeral prayers', 2000]
    ],
    sikh: [
        ['Akhand Path', 'Continuous reading of Guru Granth Sahib', 5000], ['Anand Karaj', 'Sikh wedding ceremony', 8000],
        ['Naam Karan', 'Naming ceremony for a newborn', 2000], ['Amrit Sanchar', 'Sikh initiation ceremony', 3500],
        ['Antam Sanskar', 'Last rites ceremony', 4000], ['Gurpurab', "Guru's birthday celebration", 3000],
        ['Sukhmani Sahib Path', 'Prayer for peace and comfort', 2500], ['Japji Sahib Path', 'Morning prayer ceremony', 1800],
        ['Rehras Sahib', 'Evening prayer ceremony', 1800], ['Kirtan Sohila', 'Night prayer ceremony', 1500],
        ['Dastar Bandi', 'Turban tying ceremony', 2000], ['Bhog Ceremony', 'Completion of religious reading', 2500],
        ['Sadharan Path', 'Regular reading of Guru Granth Sahib', 3000], ['Sampat Path', 'Prosperity prayer ceremony', 2800],
        ['Sunder Gutka', 'Prayer book reading ceremony', 2200], ['Nagar Kirtan', 'Religious procession', 6000],
        ['Langar Seva', 'Community kitchen service', 4000]
    ],
    christian: [
        ['Baptism', 'Infant or adult baptism ceremony', 2500], ['Wedding', 'Christian wedding ceremony', 10000],
        ['Christmas Service', 'Special Christmas mass', 2000], ['Easter Service', 'Easter Sunday celebration', 2000],
        ['First Communion', 'First holy communion ceremony', 3000], ['Confirmation', 'Confirmation of faith ceremony', 2800],
        ['Funeral Service', 'Christian last rites', 4000], ['House Blessing', 'Home dedication ceremony', 2500],
        ['Thanksgiving Service', 'Thanksgiving prayer service', 1800], ['Baby Dedication', 'Child dedication ceremony', 1500],
        ['Anniversary Service', 'Wedding anniversary blessing', 2000], ['Healing Service', 'Prayer for healing', 2200],
        ['Good Friday Service', 'Commemoration of the crucifixion', 1800], ['Pentecost Service', 'Holy Spirit celebration', 2000],
        ['Advent Service', 'Christmas preparation services', 2500], ['Lent Service', 'Pre-Easter observance', 2800],
        ['Renewal of Vows', 'Marriage blessing and renewal of vows', 3000], ['Memorial Service', 'Remembrance ceremony', 2500]
    ],
    jain: [
        ['Pratishtha', 'Idol installation ceremony', 4000], ['Paryushan', 'Festival of forgiveness', 6000],
        ['Snatra Puja', 'Ritual bathing of idols', 2500], ['Antyesti', 'Last rites ceremony', 5000],
        ['Namokar Mantra Jaap', 'Recitation of the primary mantra', 1800], ['Panch Kalyanak Puja', 'Five auspicious events celebration', 3500],
        ['Mahamastakabhisheka', 'Grand head anointing ceremony', 8000], ['Oli Puja', 'Twice-yearly worship ceremony', 2800],
        ['Rohini Vrat', 'Fasting and prayer ceremony', 2200], ['Poshadh Vrat', 'Semi-fasting observance', 2000],
        ['Ayambil Oli', 'Special dietary observance', 2500], ['Diksha', 'Monastic initiation ceremony', 10000],
        ['Gyan Panchami', 'Knowledge day celebration', 2000], ['Varshi Tapa', 'Annual fasting completion', 3000],
        ['Maun Ekadashi', 'Silent observance ceremony', 2200], ['Navpad Oli', 'Nine elements worship', 3500],
        ['Rath Yatra', 'Chariot procession ceremony', 5000]
    ]
};

// -------------------- DATA: KITS --------------------
const KITS = {
    hindu: { name: 'Complete Puja Kit', price: 5000, description: 'Everything needed for a complete Hindu ceremony', includes: ['Puja Thali with all essentials', 'Premium Incense Sticks & Dhoop', 'Brass Diya Set with Ghee', 'Fresh Flower Garland & Petals', 'Assorted Sweets Prasad', 'Coconut & Fruits', 'Sandalwood Paste & Kumkum', 'Haldi & Chandan', 'Akshata (Rice)', 'Betel Leaves & Nuts', 'Camphor & Matchbox', 'Ganga Jal', 'Bell & Conch Shell', 'Sacred Thread', 'Priest Offering Envelope'] },
    muslim: { name: 'Complete Islamic Ceremony Kit', price: 6000, description: 'Complete set for Islamic ceremonies and prayers', includes: ['Premium Prayer Mat & Rug', 'Quality Dates & Fruits', 'Attar & Oudh Set', 'Decorative Quran Stand', 'Tasbih (Prayer Beads)', 'Islamic Calligraphy Art', 'Miswak & Henna', 'Rose Water & Bakhoor', 'Kufi Caps (Set of 5)', 'Islamic Books Collection', 'Ceremony Decoration Set', 'Guest Seating Arrangement'] },
    sikh: { name: 'Complete Gurdwara Kit', price: 7000, description: 'Complete set for Sikh ceremonies and prayers', includes: ['Premium Rumala Sahib', 'Karah Parshad Ingredients', 'Nishan Sahib (Sikh Flag)', 'Gutka Sahib Collection', 'Kirtan Harmonium & Tabla', 'Langar Utensils Set', 'Guru Granth Sahib Stand', 'Community Seating', 'Prasad Distribution Set', 'Dastar (Turbans)', 'Sikh Art & Calendar', 'Ceremony Documentation'] },
    christian: { name: 'Complete Church Ceremony Kit', price: 8000, description: 'Complete set for Christian ceremonies and services', includes: ['Premium Communion Set', 'Leather Bound Bible', 'Decorative Cross & Candles', 'Rosary & Holy Water', 'Chalice & Censer Set', 'Hymnal Books (Multiple)', 'Advent Wreath & Decor', 'Easter Lily Arrangement', 'Baptism Font Setup', 'Wedding Arch & Decor', 'Sound System Setup'] },
    jain: { name: 'Complete Jain Puja Kit', price: 6500, description: 'Complete set for Jain ceremonies and rituals', includes: ['Ashtaprakari Puja Full Set', 'Premium Rice & Grains', 'Decorative Kalash Set', 'Pure Saffron & Spices', 'Prayer Books Collection', 'Incense & Diya Set', 'Fresh Flowers & Fruits', 'Sweets & Dry Fruits', 'Jain Calendar & Art', 'Muhapatti & Ogho Set', 'Meditation Mat & Cushions', 'Ritual Documentation'] }
};

// -------------------- DATA: PROVIDERS --------------------
const PROVIDERS = {
    hindu: [['North Indian Vedic Scholar', 2800], ['South Indian Temple Priest', 3200], ['Sanskrit Scholar & Priest', 3500]],
    muslim: [['North Indian Islamic Scholar', 2800], ['South Indian Mosque Imam', 2400], ['Arabic Language Specialist', 3200]],
    sikh: [['Punjabi Granthi Scholar', 2800], ['Sikh History Specialist', 2400], ['Ragi & Kirtan Expert', 3000]],
    christian: [['North Indian Church Pastor', 2800], ['South Indian Christian Priest', 2600], ['Biblical Studies Scholar', 3200]],
    jain: [['Digambar Jain Scholar', 2800], ['Shwetambar Ritual Expert', 3000], ['Jain Philosophy Teacher', 3500]]
};

// -------------------- DATA: CALENDAR --------------------
// Entry: [month 1-12, day text ('' = varies), name]
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CAL = {
    2024: {
        hindu: [[1, '15', 'Makar Sankranti / Pongal'], [2, '14', 'Basant Panchami'], [3, '8', 'Maha Shivratri'], [3, '25', 'Holi'], [4, '17', 'Ram Navami'], [4, '23', 'Hanuman Jayanti'], [5, '10', 'Akshaya Tritiya'], [7, '7', 'Rath Yatra'], [7, '21', 'Guru Purnima'], [8, '19', 'Raksha Bandhan'], [8, '26', 'Janmashtami'], [9, '7', 'Ganesh Chaturthi'], [10, '3–11', 'Navratri'], [10, '12', 'Dussehra'], [10, '31', 'Deepawali'], [11, '3', 'Bhai Dooj'], [11, '7', 'Chhath Puja']],
        muslim: [[3, '11', 'Ramadan begins (approx.)'], [4, '10', 'Eid al-Fitr (approx.)'], [6, '17', 'Eid al-Adha (approx.)'], [7, '7', 'Islamic New Year (approx.)'], [7, '17', 'Ashura (approx.)'], [9, '16', 'Milad-un-Nabi (approx.)']],
        sikh: [[2, '24', 'Guru Ravidas Jayanti'], [3, '25', 'Hola Mohalla'], [4, '13', 'Vaisakhi'], [11, '15', 'Guru Nanak Jayanti'], [11, '24', 'Guru Tegh Bahadur Martyrdom Day']],
        jain: [[4, '21', 'Mahavir Jayanti'], [5, '10', 'Akshaya Tritiya (Varshi Tap Parana)'], [9, '', 'Paryushan Parva (Aug–Sep, varies by sect)'], [10, '31', 'Diwali / Mahavir Nirvana']]
    },
    2025: {
        hindu: [[1, '14', 'Makar Sankranti / Pongal'], [2, '2', 'Basant Panchami'], [2, '26', 'Maha Shivratri'], [3, '14', 'Holi'], [4, '6', 'Ram Navami'], [4, '12', 'Hanuman Jayanti'], [4, '30', 'Akshaya Tritiya'], [6, '27', 'Rath Yatra'], [7, '10', 'Guru Purnima'], [8, '9', 'Raksha Bandhan'], [8, '16', 'Janmashtami'], [8, '27', 'Ganesh Chaturthi'], [9, '22', 'Navratri begins'], [10, '2', 'Dussehra'], [10, '20', 'Deepawali'], [10, '22', 'Govardhan Puja'], [10, '23', 'Bhai Dooj'], [10, '27', 'Chhath Puja']],
        muslim: [[3, '1', 'Ramadan begins (approx.)'], [3, '31', 'Eid al-Fitr (approx.)'], [6, '7', 'Eid al-Adha (approx.)'], [6, '27', 'Islamic New Year (approx.)'], [7, '6', 'Ashura (approx.)'], [9, '5', 'Milad-un-Nabi (approx.)']],
        sikh: [[2, '12', 'Guru Ravidas Jayanti'], [3, '14', 'Hola Mohalla'], [4, '14', 'Vaisakhi'], [11, '5', 'Guru Nanak Jayanti'], [11, '24', 'Guru Tegh Bahadur Martyrdom Day']],
        jain: [[4, '10', 'Mahavir Jayanti'], [4, '30', 'Akshaya Tritiya (Varshi Tap Parana)'], [8, '', 'Paryushan Parva (Aug–Sep, varies by sect)'], [10, '20', 'Diwali / Mahavir Nirvana']]
    },
    2026: {
        hindu: [[1, '14', 'Makar Sankranti'], [1, '15', 'Pongal'], [2, '15', 'Maha Shivratri'], [3, '4', 'Holi'], [3, '19', 'Chaitra Navratri begins'], [3, '26', 'Ram Navami'], [4, '2', 'Hanuman Jayanti'], [8, '28', 'Raksha Bandhan'], [9, '4', 'Janmashtami'], [9, '14', 'Ganesh Chaturthi'], [10, '11', 'Sharad Navratri begins'], [10, '20', 'Dussehra'], [11, '8', 'Deepawali']],
        muslim: [[2, '~18', 'Ramadan begins (approx.)'], [3, '~20', 'Eid al-Fitr (approx.)'], [5, '~27', 'Eid al-Adha (approx.)'], [6, '~17', 'Islamic New Year (approx.)'], [6, '~26', 'Ashura (approx.)'], [8, '~26', 'Milad-un-Nabi (approx.)']],
        sikh: [[3, '4', 'Hola Mohalla'], [4, '14', 'Vaisakhi'], [11, '24', 'Guru Nanak Jayanti']],
        jain: [[3, '31', 'Mahavir Jayanti'], [8, '', 'Paryushan Parva (Aug–Sep, varies by sect)'], [11, '8', 'Diwali / Mahavir Nirvana']]
    },
    2027: {
        hindu: [[1, '14', 'Makar Sankranti'], [3, '', 'Holi'], [4, '', 'Ram Navami'], [8, '', 'Raksha Bandhan'], [8, '', 'Janmashtami'], [9, '', 'Ganesh Chaturthi'], [10, '', 'Navratri / Dussehra'], [10, '', 'Deepawali']],
        muslim: [[2, '', 'Ramadan begins (moon sighting)'], [3, '', 'Eid al-Fitr (moon sighting)'], [5, '', 'Eid al-Adha (moon sighting)'], [8, '', 'Milad-un-Nabi (moon sighting)']],
        sikh: [[3, '', 'Hola Mohalla'], [4, '14', 'Vaisakhi'], [11, '', 'Guru Nanak Jayanti']],
        jain: [[4, '', 'Mahavir Jayanti'], [8, '', 'Paryushan Parva'], [10, '', 'Diwali / Mahavir Nirvana']]
    },
    2028: {
        hindu: [[1, '14', 'Makar Sankranti'], [3, '', 'Holi'], [4, '', 'Ram Navami'], [8, '', 'Janmashtami'], [10, '', 'Navratri / Dussehra'], [10, '', 'Deepawali']],
        muslim: [[1, '', 'Ramadan begins (moon sighting)'], [2, '', 'Eid al-Fitr (moon sighting)'], [5, '', 'Eid al-Adha (moon sighting)'], [8, '', 'Milad-un-Nabi (moon sighting)']],
        sikh: [[3, '', 'Hola Mohalla'], [4, '14', 'Vaisakhi'], [11, '', 'Guru Nanak Jayanti']],
        jain: [[4, '', 'Mahavir Jayanti'], [8, '', 'Paryushan Parva'], [10, '', 'Diwali / Mahavir Nirvana']]
    }
};
const CAL_YEARS = Object.keys(CAL).map(Number);

// Easter-based Christian dates are computed (Western/Gregorian) so they are always correct.
function easterSunday(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
        f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
        m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31),
        day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(y, mo - 1, day));
}
function christianDates(y) {
    const e = easterSunday(y), at = n => { const d = new Date(e.getTime() + n * 864e5); return [d.getUTCMonth() + 1, String(d.getUTCDate())]; };
    return [[...at(-46), 'Ash Wednesday'], [...at(-2), 'Good Friday'], [...at(0), 'Easter Sunday'], [...at(49), 'Pentecost'], [12, '25', 'Christmas']];
}
function getYearCalendar(year) {
    const base = CAL[year] || {};
    return { hindu: base.hindu || [], muslim: base.muslim || [], sikh: base.sikh || [], christian: christianDates(year), jain: base.jain || [] };
}
const dayNum = d => parseInt(String(d).replace(/[^\d]/g, ''), 10) || 99;
const sortEntries = list => [...list].sort((a, b) => a[0] - b[0] || dayNum(a[1]) - dayNum(b[1]));
const dateLabel = d => d ? d : 'Varies';

// -------------------- DATA: RESOURCES / PDF CONTENT --------------------
const RESOURCES = [
    { id: 'calendar', icon: 'fa-calendar-alt', title: 'Multi-Faith Calendar', blurb: 'Festival calendar for 2024–2028 covering Hindu, Muslim, Sikh, Christian and Jain traditions.', list: ['Major festivals for 5 faiths', 'Month-wise organisation', 'Filter by faith', 'Download any year as PDF'], kind: 'Interactive Calendar', icon2: 'fa-file-alt', btn: 'View Calendar', btnIcon: 'fa-external-link-alt' },
    { id: 'starter-guide', icon: 'fa-book', title: 'Rituals Starter Guide', blurb: "A beginner's guide to using Rituals: booking ceremonies, understanding traditions and choosing providers.", list: ['Platform introduction & features', 'Step-by-step booking process', 'Choosing a service provider', 'Payment & verification process'], btn: 'Download Starter Guide' },
    { id: 'prayer-collection', icon: 'fa-pray', title: 'Multi-Faith Prayer Collection', blurb: 'A short collection of foundational prayers and mantras from the five traditions, with meanings.', list: ['Gayatri Mantra', 'Al-Fatiha (meaning)', 'Mool Mantar', "The Lord's Prayer", 'Namokar Mantra'], btn: 'Download Prayer Book' },
    { id: 'dietary-guide', icon: 'fa-utensils', title: 'Religious Dietary Guide', blurb: 'An overview of dietary principles and festival food customs across faiths.', list: ['Hindu Satvik principles', 'Halal guidelines', 'Sikh Langar tradition', 'Christian fasting customs', 'Jain vegetarianism & fasting'], btn: 'Download Guide' },
    { id: 'interfaith-guide', icon: 'fa-hands-helping', title: 'Interfaith Harmony Guide', blurb: 'Practical etiquette for attending and hosting ceremonies from other traditions.', list: ['Understanding different faiths', 'Common values', 'Interfaith etiquette', 'Celebrating diversity'], btn: 'Download Guide' },
    { id: 'symbols-guide', icon: 'fa-gem', title: 'Sacred Symbols & Meanings', blurb: 'A short guide to well-known sacred symbols and what they mean to each tradition.', list: ['Hindu: Om, Swastika', 'Islamic: Star & Crescent', 'Sikh: Khanda, Ik Onkar', 'Christian: Cross, Fish', 'Jain: Ahimsa Hand, Swastika'], btn: 'Download Guide' }
];

const PDF_CONTENT = {
    'starter-guide': {
        title: 'Rituals Starter Guide', filename: 'Rituals-Starter-Guide.pdf',
        sections: [
            { title: 'Welcome to Rituals', content: "Rituals is a multi-faith platform connecting you with religious services across Hindu, Muslim, Sikh, Christian and Jain traditions. Our aim is to help families organise ceremonies with respect for tradition and the convenience of modern technology." },
            { title: 'Platform Features', content: '- Multi-faith services across five traditions\n- Verified service providers\n- A simple step-by-step booking process\n- UPI payments with WhatsApp confirmation\n- Guides, a festival calendar and educational resources' },
            { title: 'How to Book', content: '1. Open Our Services and choose your tradition.\n2. Select the ceremony you need.\n3. Choose a ceremony kit, or continue without one if you have your own materials.\n4. Pick a service provider.\n5. Enter your address, preferred date and time.\n6. Review your booking and pay by UPI.\n7. Send your payment details on WhatsApp so we can verify and confirm within 24 hours.' },
            { title: 'Choosing a Provider', content: 'Providers are listed by region and specialisation. If you have a family tradition (for example a particular sect or language), pick the provider whose profile best matches it, and mention any specific requirements in the Special Instructions box.' },
            { title: 'Support & Contact', content: `WhatsApp / Phone: ${CONFIG.phoneDisplay}\nEmail: ${CONFIG.email}` }
        ]
    },
    'prayer-collection': {
        title: 'Multi-Faith Prayer Collection', filename: 'Rituals-Prayer-Collection.pdf',
        sections: [
            { title: 'Sanatan Dharm - Gayatri Mantra', content: 'Om Bhur Bhuvah Svah, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat.\n\nMeaning: We meditate on the radiant light of the divine; may it inspire and illuminate our understanding.' },
            { title: 'Islam - Al-Fatiha (meaning)', content: 'The opening chapter of the Quran is recited in every prayer. In meaning: praise belongs to God, Lord of all the worlds, the Most Gracious, the Most Merciful, Master of the Day of Judgement. We worship You alone and seek help from You alone; guide us on the straight path.' },
            { title: 'Sikhism - Mool Mantar', content: 'Ik Onkar, Sat Naam, Karta Purakh, Nirbhau, Nirvair, Akaal Moorat, Ajooni, Saibhang, Gur Prasad.\n\nMeaning: There is One Creator, whose name is Truth, the Creator, without fear, without hatred, timeless in form, beyond birth and death, self-existent, realised by the Guru\'s grace.' },
            { title: "Christianity - The Lord's Prayer", content: 'Our Father, who art in heaven, hallowed be thy name; thy kingdom come, thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.' },
            { title: 'Jainism - Namokar Mantra', content: 'Namo Arihantanam, Namo Siddhanam, Namo Ayariyanam, Namo Uvajjhayanam, Namo Loe Savva-Sahunam.\n\nMeaning: I bow to the Arihants, the Siddhas, the Acharyas, the Upadhyayas and all the monks of the world.' },
            { title: 'A Note', content: 'These are short, widely shared texts offered for reference. For full liturgy and correct recitation, please consult your priest, imam, granthi or religious teacher.' }
        ]
    },
    'dietary-guide': {
        title: 'Religious Dietary Guide', filename: 'Rituals-Dietary-Guide.pdf',
        sections: [
            { title: 'Hindu - Satvik Principles', content: 'Many Hindu families follow vegetarian diets, and festival or fasting days (vrat) often avoid onion, garlic and grains. Satvik food is simple, fresh and freshly cooked. Prasad is offered to the deity before being shared. Practices vary widely by region and community.' },
            { title: 'Islam - Halal Guidelines', content: 'Halal food excludes pork and alcohol, and requires meat to be prepared according to Islamic rules. During Ramadan, Muslims fast from dawn to sunset and break the fast with dates and water (iftar). Eid celebrations commonly include shared meals and sweets.' },
            { title: 'Sikhism - Langar', content: 'Langar is the free community kitchen found in every gurdwara, serving simple vegetarian meals to all visitors seated together regardless of background. It reflects the Sikh principles of equality and service (seva).' },
            { title: 'Christianity - Fasting & Communion', content: 'Many Christians observe Lent before Easter with fasting or abstaining from certain foods, and some avoid meat on Fridays. Communion (Eucharist) with bread and wine or juice is central to many services. Customs differ across denominations.' },
            { title: 'Jainism - Vegetarianism & Fasting', content: 'Jain diet is strictly vegetarian and guided by ahimsa (non-violence). Many Jains avoid root vegetables such as onion, garlic and potato, and avoid eating after sunset. Fasting (tapasya) is observed during Paryushan and on other occasions.' },
            { title: 'Hosting Guests', content: 'When hosting a mixed-faith gathering, ask about dietary needs in advance, label dishes clearly, and consider an inclusive vegetarian menu without onion and garlic as a safe default.' }
        ]
    },
    'interfaith-guide': {
        title: 'Interfaith Harmony Guide', filename: 'Rituals-Interfaith-Guide.pdf',
        sections: [
            { title: 'Understanding Different Faiths', content: 'India is home to many living traditions. Learning the basics of each, such as their key festivals, places of worship and customs, is the first step toward mutual respect.' },
            { title: 'Common Values', content: 'Compassion, charity, honesty, respect for elders and service to others appear across all five traditions, in practices such as dana, zakat, seva, charity and ahimsa.' },
            { title: 'Etiquette When Visiting', content: '- Dress modestly and remove shoes where required.\n- Cover your head in a gurdwara and in many mosques.\n- Ask before taking photographs.\n- Follow the lead of your hosts during prayers; it is fine to stand quietly.\n- Do not touch idols, scriptures or ritual items unless invited.' },
            { title: 'Celebrating Together', content: 'Greet neighbours on their festivals, share sweets, and invite friends from other communities to your celebrations, while being mindful of dietary and prayer-time needs.' }
        ]
    },
    'symbols-guide': {
        title: 'Sacred Symbols & Meanings', filename: 'Rituals-Sacred-Symbols.pdf',
        sections: [
            { title: 'Om (Hindu)', content: 'A sacred syllable representing the sound of the universe and ultimate reality (Brahman). Chanted at the start and end of prayers.' },
            { title: 'Swastika (Hindu, Jain, Buddhist)', content: 'An ancient symbol of good fortune and auspiciousness in Indian traditions. In Jainism its four arms represent the four states of existence. It is unrelated to its later misuse in 20th-century Europe.' },
            { title: 'Star and Crescent (Islam)', content: 'Widely associated with Islam and many Muslim-majority countries. It is a cultural emblem rather than a symbol prescribed in scripture.' },
            { title: 'Khanda and Ik Onkar (Sikhism)', content: 'The Khanda, with its double-edged sword, circle and two swords, represents divine knowledge, unity and justice. Ik Onkar means "One Creator" and opens the Guru Granth Sahib.' },
            { title: 'Cross and Fish (Christianity)', content: 'The cross represents the crucifixion and resurrection of Jesus. The fish (Ichthys) was an early Christian symbol of faith.' },
            { title: 'Ahimsa Hand and Jain Emblem', content: 'The open palm with the word "ahimsa" stands for non-violence. The Jain emblem combines the swastika, three dots (right faith, knowledge and conduct) and the crescent with a dot (liberation).' }
        ]
    }
};

// -------------------- PDF --------------------
// jsPDF's built-in fonts can't draw diacritics or the rupee sign, so text is normalised first.
const pdfSafe = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/₹/g, 'Rs. ').replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

function getJsPDF() { return window.jspdf && window.jspdf.jsPDF; }

function buildPDF(title, subtitle, sections, filename) {
    const JsPDF = getJsPDF();
    if (!JsPDF) { showNotification('PDF library failed to load. Check your internet connection and try again.', 'error'); return false; }
    const doc = new JsPDF(), W = 210, M = 20, maxY = 275;
    let y = 22;
    const ensure = h => { if (y + h > maxY) { doc.addPage(); y = 22; } };
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(74, 20, 140);
    doc.text(pdfSafe(title), W / 2, y, { align: 'center' }); y += 9;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(110, 110, 110);
    doc.text(pdfSafe(subtitle), W / 2, y, { align: 'center' }); y += 12;
    sections.forEach(sec => {
        ensure(20);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(74, 20, 140);
        doc.text(pdfSafe(sec.title), M, y); y += 7;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(30, 30, 30);
        doc.splitTextToSize(pdfSafe(sec.content), W - 2 * M).forEach(line => { ensure(6); doc.text(line, M, y); y += 5.5; });
        y += 6;
    });
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
        doc.setPage(p); doc.setFontSize(8); doc.setTextColor(150, 150, 150);
        doc.text(`(c) ${new Date().getFullYear()} Rituals  |  Page ${p} of ${pages}`, W / 2, 288, { align: 'center' });
    }
    doc.save(filename);
    return true;
}

function downloadResource(id, btn) {
    const c = PDF_CONTENT[id];
    if (!c) return;
    const original = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Preparing...';
    setTimeout(() => {
        const ok = buildPDF(c.title, 'Rituals Resource - ' + new Date().toLocaleDateString('en-IN'), c.sections, c.filename);
        btn.innerHTML = ok ? '<i class="fas fa-check" aria-hidden="true"></i> Downloaded!' : original;
        if (ok) { btn.classList.add('success'); showNotification('PDF downloaded successfully!'); }
        setTimeout(() => { btn.innerHTML = original; btn.classList.remove('success'); btn.disabled = false; }, 1800);
    }, 300);
}

// -------------------- RESOURCES PAGE --------------------
function renderResources() {
    $('#resources-grid').innerHTML = RESOURCES.map(r => `
        <div class="resource-card">
            <h3><i class="fas ${r.icon}" aria-hidden="true"></i> ${esc(r.title)}</h3>
            <p>${esc(r.blurb)}</p>
            <div class="resource-details"><h4>Includes:</h4><ul>${r.list.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
            <div class="file-info"><span><i class="fas ${r.icon2 || 'fa-file-pdf'}" aria-hidden="true"></i> ${r.kind || 'PDF Document'}</span></div>
            <div class="download-section"><button type="button" class="download-btn" ${r.id === 'calendar' ? 'data-open-calendar' : `data-download="${r.id}"`}><i class="fas ${r.btnIcon || 'fa-download'}" aria-hidden="true"></i> ${esc(r.btn)}</button></div>
        </div>`).join('');
}

// -------------------- CALENDAR --------------------
let calYear = new Date().getFullYear();
if (!CAL_YEARS.includes(calYear)) calYear = CAL_YEARS[0];
let calFaith = 'all';

function renderCalendarControls() {
    $('#year-buttons').innerHTML = CAL_YEARS.map(y => `<button type="button" class="year-btn ${y === calYear ? 'active' : ''}" data-year="${y}" aria-pressed="${y === calYear}">${y}</button>`).join('');
    $('#faith-chips').innerHTML = [{ id: 'all', name: 'All faiths' }, ...FAITHS].map(f => `<button type="button" class="chip ${f.id === calFaith ? 'active' : ''}" data-cal-faith="${f.id}" aria-pressed="${f.id === calFaith}">${esc(f.name)}</button>`).join('');
}

function renderCalendar() {
    renderCalendarControls();
    const data = getYearCalendar(calYear);
    const approx = calYear >= 2027;
    $('#cal-note').innerHTML = `<i class="fas fa-info-circle" aria-hidden="true"></i> Dates of lunar festivals vary by region and by moon sighting. Please confirm with your local panchang or religious authority.${approx ? ' Exact dates for ' + calYear + ' will be added once official calendars are published.' : ''}`;
    let html = '';
    FAITHS.filter(f => calFaith === 'all' || f.id === calFaith).forEach(f => {
        const byMonth = {};
        sortEntries(data[f.id]).forEach(e => (byMonth[e[0]] = byMonth[e[0]] || []).push(e));
        html += `<div class="faith-calendar"><div class="faith-header ${f.id}"><div class="faith-icon"><i class="${f.icon}" aria-hidden="true"></i></div><h2 class="faith-title">${esc(f.name)} Festivals ${calYear}</h2></div><div class="months-grid">`;
        const months = Object.keys(byMonth).map(Number);
        if (!months.length) html += '<div class="no-festivals">No festivals listed yet.</div>';
        months.forEach(m => {
            html += `<div class="month-section"><h3 class="month-title">${MONTHS[m - 1]}</h3><div class="festivals-list">`;
            byMonth[m].forEach(e => { html += `<div class="festival-item ${f.id}"><div class="festival-date">${esc(dateLabel(e[1]))}</div><div class="festival-name">${esc(e[2])}</div></div>`; });
            html += '</div></div>';
        });
        html += '</div></div>';
    });
    $('#calendar-view').innerHTML = html;
}

function downloadCalendarPDF() {
    const data = getYearCalendar(calYear), sections = [];
    FAITHS.forEach(f => {
        const lines = sortEntries(data[f.id]).map(e => `${MONTHS[e[0] - 1]} ${e[1] || '(date varies)'}: ${e[2]}`);
        sections.push({ title: f.name + ' Festivals', content: lines.length ? lines.join('\n') : 'No festivals listed yet.' });
    });
    sections.push({ title: 'Note', content: 'Dates of lunar festivals vary by region and by moon sighting. Please confirm with your local panchang or religious authority.' });
    if (buildPDF(`Multi-Faith Calendar ${calYear}`, 'Rituals - Downloaded on ' + new Date().toLocaleDateString('en-IN'), sections, `Rituals-Calendar-${calYear}.pdf`)) showNotification(`Calendar ${calYear} downloaded!`);
}

// -------------------- ROUTING --------------------
const PAGES = ['home', 'services', 'resources', 'calendar-detail', 'contact'];
const NAV_FOR = { 'calendar-detail': 'resources' };
const TITLES = { home: 'Rituals - Multi-Faith Event Services', services: 'Book a Ceremony | Rituals', resources: 'Resources | Rituals', 'calendar-detail': 'Festival Calendar | Rituals', contact: 'Contact Us | Rituals' };

function navigate(page) {
    if (location.hash === '#' + page) route(); else location.hash = page;
}
function route() {
    let page = location.hash.slice(1);
    if (!PAGES.includes(page)) page = 'home';
    $$('.page').forEach(p => p.classList.toggle('active', p.id === page + '-page'));
    const navPage = NAV_FOR[page] || page;
    $$('.nav-link').forEach(l => { const on = l.dataset.page === navPage; l.classList.toggle('active', on); if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current'); });
    document.title = TITLES[page];
    if (page === 'calendar-detail') renderCalendar();
    if (page === 'services' && !booking.faith) goStage('faith');
    window.scrollTo(0, 0);
}

// -------------------- BOOKING FLOW --------------------
const STEPS = [['faith', 'Faith'], ['event', 'Ceremony'], ['kit', 'Kit'], ['provider', 'Provider'], ['address', 'Details'], ['cart', 'Review'], ['payment', 'Pay']];
const newBooking = () => ({ faith: null, event: null, kit: null, provider: null, address: null, id: null });
let booking = newBooking();

function goStage(name) {
    $$('.stage').forEach(s => s.classList.toggle('active', s.dataset.stage === name));
    const idx = STEPS.findIndex(s => s[0] === name);
    $('#stepper').innerHTML = STEPS.map((s, i) => `<li class="${name === 'done' || i < idx ? 'done' : i === idx ? 'current' : ''}" ${i === idx ? 'aria-current="step"' : ''}><span class="step-dot">${name === 'done' || i < idx ? '<i class="fas fa-check" aria-hidden="true"></i>' : i + 1}</span><span class="step-label">${s[1]}</span></li>`).join('');
    const target = $('#stepper');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const heading = $(`.stage.active .stage-title`);
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
}

function startBooking(faith) {
    navigate('services');
    if (faith) chooseFaith(faith); else goStage('faith');
}

function chooseFaith(faith) {
    if (booking.faith !== faith) booking = Object.assign(newBooking(), { faith });
    $('#rashi-field').hidden = faith !== 'hindu';
    $('#t-event').textContent = `Select your ${faithById(faith).name} ceremony`;
    const grid = $('#events-grid');
    grid.innerHTML = '';
    EVENTS[faith].forEach(([name, description, price]) => {
        const card = document.createElement('div');
        card.className = 'event-card'; card.setAttribute('role', 'button'); card.tabIndex = 0;
        card.innerHTML = `<h4>${esc(name)}</h4><p>${esc(description)}</p><div class="event-price">${inr(price)}</div>`;
        card.addEventListener('click', () => chooseEvent({ name, description, price }));
        grid.appendChild(card);
    });
    goStage('event');
}

function chooseEvent(event) {
    booking.event = event;
    const kit = KITS[booking.faith];
    $('#items-grid').innerHTML = `
        <div class="item-card">
            <div class="kit-badge complete">COMPLETE KIT</div>
            <h4>${esc(kit.name)}</h4>
            <div class="item-price">${inr(kit.price)}</div>
            <div class="item-description">${esc(kit.description)}</div>
            <div class="item-includes"><h5>Includes:</h5><ul>${kit.includes.map(i => `<li><i class="fas fa-check" aria-hidden="true"></i> ${esc(i)}</li>`).join('')}</ul></div>
            <button type="button" class="add-to-cart" id="select-kit">Select Complete Kit</button>
        </div>`;
    $('#select-kit').addEventListener('click', () => { booking.kit = kit; showNotification(`${kit.name} added`); showProviders(); });
    goStage('kit');
}

function showProviders() {
    const f = faithById(booking.faith);
    $('#t-provider').textContent = `Select your ${f.provider}`;
    const box = $('#provider-options');
    box.innerHTML = '';
    PROVIDERS[booking.faith].forEach(([name, price]) => {
        const el = document.createElement('div');
        el.className = 'service-option';
        el.innerHTML = `<h4>${esc(name)}</h4><div class="service-price">${inr(price)}</div>`;
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'add-to-cart'; b.textContent = 'Select Provider';
        b.addEventListener('click', () => { booking.provider = { name, price }; showNotification(`${name} selected`); showAddress(); });
        el.appendChild(b); box.appendChild(el);
    });
    goStage('provider');
}

function showAddress() {
    const d = $('#ceremony-date');
    d.min = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    goStage('address');
}

function fieldError(id, msg) {
    const el = $('#' + id);
    el.setAttribute('aria-invalid', 'true');
    showNotification(msg, 'error');
    el.focus();
    return false;
}

function saveAddress() {
    const v = id => $('#' + id).value.trim();
    $$('#address-form [aria-invalid]').forEach(e => e.removeAttribute('aria-invalid'));
    const required = [['full-name', 'full name'], ['phone-number', 'phone number'], ['address-line1', 'address line 1'], ['address-line2', 'address line 2'], ['landmark', 'landmark'], ['city', 'city'], ['state', 'state'], ['pincode', 'PIN code'], ['ceremony-date', 'ceremony date'], ['ceremony-time', 'ceremony time']];
    for (const [id, label] of required) if (!v(id)) return fieldError(id, `Please enter your ${label}`);
    const phone = v('phone-number').replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
    if (!/^[6-9]\d{9}$/.test(phone)) return fieldError('phone-number', 'Enter a valid 10-digit Indian mobile number');
    if (!/^\d{6}$/.test(v('pincode'))) return fieldError('pincode', 'Enter a valid 6-digit PIN code');
    if (v('ceremony-date') < $('#ceremony-date').min) return fieldError('ceremony-date', 'Please choose a date today or later');
    booking.address = {
        fullName: v('full-name'), phone, line1: v('address-line1'), line2: v('address-line2'), landmark: v('landmark'),
        city: v('city'), state: v('state'), pincode: v('pincode'), date: v('ceremony-date'), time: v('ceremony-time'),
        rashi: booking.faith === 'hindu' ? $('#rashi').value : '', notes: v('special-instructions')
    };
    showCart();
}

const bookingTotal = () => (booking.event?.price || 0) + (booking.kit?.price || 0) + (booking.provider?.price || 0);
const fmtDate = iso => new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtTime = t => { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };

function showCart() {
    const rows = [];
    const row = (title, sub, price) => `<div class="cart-item"><div><strong>${esc(title)}</strong><div class="cart-sub">${sub}</div></div><div>${price}</div></div>`;
    rows.push(row(booking.event.name, esc(booking.event.description), inr(booking.event.price)));
    rows.push(booking.kit ? row(booking.kit.name, 'Ceremony kit', inr(booking.kit.price)) : row('No kit', 'You will arrange your own materials', '-'));
    rows.push(row(booking.provider.name, esc(faithById(booking.faith).provider), inr(booking.provider.price)));
    const a = booking.address;
    rows.push(row('Ceremony details', `${esc(a.fullName)} | ${esc(a.phone)}<br>${esc(a.line1)}, ${esc(a.line2)}<br>${esc(a.landmark)}, ${esc(a.city)}, ${esc(a.state)} - ${esc(a.pincode)}<br>${esc(fmtDate(a.date))} at ${esc(fmtTime(a.time))}${a.rashi ? `<br>Rashi: ${esc(a.rashi)}` : ''}${a.notes ? `<br>Notes: ${esc(a.notes)}` : ''}`, 'Included'));
    $('#cart-items').innerHTML = rows.join('');
    $('#cart-total').textContent = `Total: ${inr(bookingTotal())}`;
    goStage('cart');
}

function showPayment() {
    const total = bookingTotal();
    $('#payment-total').textContent = inr(total);
    const box = $('#qr-box'), note = $('#qr-note');
    box.innerHTML = '<i class="fas fa-qrcode" aria-hidden="true"></i>';
    if (CONFIG.upiId && window.QRCode) {
        box.innerHTML = '';
        const upi = `upi://pay?pa=${encodeURIComponent(CONFIG.upiId)}&pn=${encodeURIComponent(CONFIG.upiName)}&am=${total}&cu=INR&tn=${encodeURIComponent('Rituals booking')}`;
        new QRCode(box, { text: upi, width: 180, height: 180 });
        note.textContent = 'Use PhonePe, Google Pay, Paytm or any UPI app.';
    } else {
        note.textContent = 'Payment QR is not set up yet on this demo site. Tap the button below and we will share UPI details with you on WhatsApp.';
    }
    goStage('payment');
}

function orderText() {
    const a = booking.address, f = faithById(booking.faith);
    return [
        '*Rituals Booking Request*', `Booking ID: ${booking.id}`, '',
        `*Faith:* ${f.name}`, `*Ceremony:* ${booking.event.name} (${inr(booking.event.price)})`,
        `*Kit:* ${booking.kit ? `${booking.kit.name} (${inr(booking.kit.price)})` : 'None'}`,
        `*Provider:* ${booking.provider.name} (${inr(booking.provider.price)})`,
        `*Total:* ${inr(bookingTotal())}`, '',
        `*Name:* ${a.fullName}`, `*Phone:* ${a.phone}`,
        `*Address:* ${a.line1}, ${a.line2}, ${a.landmark}, ${a.city}, ${a.state} - ${a.pincode}`,
        `*Date & time:* ${fmtDate(a.date)}, ${fmtTime(a.time)}`,
        a.rashi ? `*Rashi:* ${a.rashi}` : null, a.notes ? `*Notes:* ${a.notes}` : null, '',
        'UPI transaction ID: ____________'
    ].filter(l => l !== null).join('\n');
}
const openWhatsApp = () => window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(orderText())}`, '_blank', 'noopener');

function confirmPayment() {
    booking.id = booking.id || 'R' + Date.now().toString(36).toUpperCase();
    $('#done-id').textContent = booking.id;
    openWhatsApp();
    goStage('done');
}

// -------------------- CHATBOT --------------------
const BOT_RULES = [
    [/\b(hi|hello|hey|namaste)\b/, 'Hello! How can I help with your ceremony today?'],
    [/\b(book|booking|order|schedule)\b/, 'To book: open Our Services, choose your faith, pick a ceremony, add a kit (optional), choose a provider, enter your details and pay by UPI. Then send your payment details on WhatsApp for confirmation.'],
    [/\b(pay|payment|upi|qr)\b/, 'We accept UPI. After paying, tap "I Have Paid" to send your booking and transaction ID on WhatsApp. Confirmation comes within 24 hours.'],
    [/\b(calendar|festival|festivals|date|dates)\b/, 'Our multi-faith calendar for 2024-2028 is under Resources > Multi-Faith Calendar, and you can download any year as a PDF.'],
    [/\b(refund|cancel|cancellation)\b/, 'Full refund if cancelled 48+ hours before the ceremony, 50% for 24-48 hours, and no refund under 24 hours.'],
    [/\b(contact|phone|call|email|whatsapp|support)\b/, `You can reach us on WhatsApp/phone at ${CONFIG.phoneDisplay} or by email at ${CONFIG.email}.`],
    [/\b(price|cost|charges|fees)\b/, 'Prices depend on the ceremony, kit and provider you choose. You will see the full breakdown before paying.'],
    [/\b(thanks|thank)\b/, "You're welcome! Let me know if you need anything else."]
];
function botReply(msg) {
    const m = msg.toLowerCase();
    const hit = BOT_RULES.find(([re]) => re.test(m));
    return hit ? hit[1] : 'I can help with booking, payments, festival calendars, refunds and contact details. What would you like to know?';
}
function addMessage(text, sender) {
    const box = $('#chatbotMessages'), el = document.createElement('div');
    el.className = 'message ' + (sender === 'user' ? 'user-message' : 'bot-message');
    el.textContent = text;
    box.appendChild(el); box.scrollTop = box.scrollHeight;
    return el;
}
function sendMessage(text) {
    const input = $('#chatbotInput');
    const msg = (text ?? input.value).trim();
    if (!msg) return;
    addMessage(msg, 'user'); input.value = '';
    const typing = addMessage('Typing...', 'bot'); typing.classList.add('typing');
    setTimeout(() => { typing.remove(); addMessage(botReply(msg), 'bot'); }, 600);
}
function setChat(open) {
    $('#chatbotContainer').classList.toggle('open', open);
    if (open) $('#chatbotInput').focus(); else $('#chatbotIcon').focus();
}

// -------------------- MODALS --------------------
let lastFocus = null;
function showPolicy(type) {
    const m = $(`#${type}-policy-modal`);
    lastFocus = document.activeElement;
    m.style.display = 'block'; document.body.style.overflow = 'hidden';
    $('.close-modal', m).focus();
}
function closeModals() {
    $$('.policy-modal').forEach(m => { m.style.display = 'none'; });
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
}

// -------------------- EVENTS --------------------
document.addEventListener('click', e => {
    const t = e.target;
    const faithEl = t.closest('[data-faith]');
    if (faithEl) { e.preventDefault(); startBooking(faithEl.dataset.faith); return; }
    const back = t.closest('[data-back]');
    if (back) { goStage(back.dataset.back); return; }
    const dl = t.closest('[data-download]');
    if (dl) { downloadResource(dl.dataset.download, dl); return; }
    if (t.closest('[data-open-calendar]')) { navigate('calendar-detail'); return; }
    const yr = t.closest('[data-year]');
    if (yr) { calYear = Number(yr.dataset.year); renderCalendar(); return; }
    const cf = t.closest('[data-cal-faith]');
    if (cf) { calFaith = cf.dataset.calFaith; renderCalendar(); return; }
    const pol = t.closest('[data-policy]');
    if (pol) { e.preventDefault(); showPolicy(pol.dataset.policy); return; }
    if (t.closest('[data-close]') || t.classList.contains('policy-modal')) { closeModals(); return; }
    const soc = t.closest('[data-social]');
    if (soc) { e.preventDefault(); showNotification(`${soc.dataset.social} page coming soon`); return; }
    const q = t.closest('#chatChips [data-q]');
    if (q) { sendMessage(q.dataset.q); return; }
    if (t.closest('#skip-link')) { e.preventDefault(); $('#main-content').focus(); }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModals(); if ($('#chatbotContainer').classList.contains('open')) setChat(false); }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"]')) { e.preventDefault(); e.target.click(); }
});

document.addEventListener('DOMContentLoaded', () => {
    renderResources();
    window.addEventListener('hashchange', route);
    route();
    $('#skip-kit').addEventListener('click', () => { booking.kit = null; showProviders(); });
    $('#to-cart').addEventListener('click', saveAddress);
    $('#address-form').addEventListener('submit', e => { e.preventDefault(); saveAddress(); });
    $('#to-payment').addEventListener('click', showPayment);
    $('#confirm-payment').addEventListener('click', confirmPayment);
    $('#resend-wa').addEventListener('click', openWhatsApp);
    $('#new-booking').addEventListener('click', () => { booking = newBooking(); $('#address-form').reset(); goStage('faith'); });
    $('#download-cal-btn').addEventListener('click', downloadCalendarPDF);
    $('#chatbotIcon').addEventListener('click', () => setChat(true));
    $('#chatbotToggle').addEventListener('click', () => setChat(false));
    $('#sendMessage').addEventListener('click', () => sendMessage());
    $('#chatbotInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    $$('#address-form input, #address-form select').forEach(el => el.addEventListener('input', () => el.removeAttribute('aria-invalid')));
});
