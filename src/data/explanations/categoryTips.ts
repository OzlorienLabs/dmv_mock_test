import type { CategoryId } from "@/lib/types";

/**
 * Detailed, topic-level explanations in English, Bengali, and Spanish.
 *
 * Every question gets a detailed explanation in all three languages by combining
 * the question's specific point (English) with the localized topic guidance here
 * (see lib/explanations/detailed.ts). This is fully bundled — no network or
 * server call — so it can be displayed and read aloud offline.
 *
 * To upgrade Bengali/Spanish to per-question translations, run the optional
 * `scripts/translate-explanations.ts` with a Gemini key (build-time).
 */
export interface TopicTip {
  en: string;
  bn: string;
  es: string;
}

export const CATEGORY_TIPS: Record<CategoryId, TopicTip> = {
  "right-of-way": {
    en: "Right-of-way is about yielding, not taking. At a four-way stop the first to arrive goes, and if you arrive together, yield to the driver on your right. Drivers who are turning, or entering a road, must yield to through traffic and to pedestrians in any crosswalk — even an unmarked one.",
    bn: "অগ্রাধিকার (right-of-way) মানে নিজে আগে যাওয়া নয়, বরং অন্যকে ছেড়ে দেওয়া। চার-দিকের স্টপে যে আগে পৌঁছায় সে আগে যায়; একসাথে পৌঁছালে আপনার ডান দিকের গাড়িকে ছেড়ে দিন। যে চালক মোড় নিচ্ছেন বা রাস্তায় ঢুকছেন, তাঁকে সরাসরি চলা যানবাহন ও ক্রসওয়াকে থাকা পথচারীদের — এমনকি দাগহীন ক্রসওয়াকেও — ছেড়ে দিতে হবে।",
    es: "La preferencia de paso se trata de ceder, no de tomar. En un alto de cuatro vías, pasa primero quien llega primero; si llegan juntos, ceda al conductor de su derecha. Quien gira o se incorpora a una vía debe ceder al tránsito que sigue de frente y a los peatones en cualquier cruce, incluso sin marcas.",
  },
  "signs-signals": {
    en: "Read signs by shape and color: red means stop or a prohibition, yellow warns of conditions ahead, orange marks construction, and green gives directions. A flashing red light is treated like a stop sign; a flashing yellow means slow down and proceed with caution; a steady yellow means stop if you can do so safely.",
    bn: "চিহ্ন বুঝুন আকার ও রঙ দেখে: লাল মানে থামা বা নিষেধ, হলুদ মানে সামনের পরিস্থিতির সতর্কতা, কমলা মানে নির্মাণকাজ, আর সবুজ মানে দিকনির্দেশনা। জ্বলতে-নিভতে থাকা লাল আলো স্টপ সাইনের মতো; জ্বলতে-নিভতে থাকা হলুদ মানে গতি কমিয়ে সাবধানে এগোন; স্থির হলুদ মানে নিরাপদে পারলে থামুন।",
    es: "Lea las señales por forma y color: rojo indica alto o prohibición, amarillo advierte de condiciones, naranja señala obras y verde da direcciones. Una luz roja intermitente se trata como un alto; una amarilla intermitente significa reduzca y avance con precaución; una amarilla fija significa deténgase si puede hacerlo con seguridad.",
  },
  "speed-limits": {
    en: "Posted limits are maximums for ideal conditions — the Basic Speed Law still requires a safe speed in rain, traffic, or curves. Know the key numbers: 15 mph at blind intersections and alleys, 25 mph in business, residential, and school zones, and 55–65 mph on highways and freeways.",
    bn: "লেখা গতিসীমা আদর্শ পরিস্থিতির সর্বোচ্চ মাত্র — মূল গতি আইন (Basic Speed Law) অনুযায়ী বৃষ্টি, যানজট বা বাঁকে নিরাপদ গতিই রাখতে হবে। গুরুত্বপূর্ণ সংখ্যাগুলো মনে রাখুন: অন্ধ মোড় ও গলিতে ১৫ mph, ব্যবসায়িক-আবাসিক ও স্কুল এলাকায় ২৫ mph, এবং হাইওয়ে/ফ্রিওয়েতে ৫৫–৬৫ mph।",
    es: "Los límites indicados son máximos para condiciones ideales: la Ley Básica de Velocidad exige una velocidad segura con lluvia, tránsito o curvas. Aprenda las cifras clave: 15 mph en cruces ciegos y callejones, 25 mph en zonas comerciales, residenciales y escolares, y 55–65 mph en carreteras y autopistas.",
  },
  parking: {
    en: "Park within 18 inches of the curb and never block a crosswalk, driveway, or fire hydrant (stay at least 15 feet away). Curb colors matter — red is no stopping, blue is for disabled placards. On a hill, turn your wheels so a vehicle that rolls would stop against the curb or roll away from traffic.",
    bn: "কার্ব থেকে ১৮ ইঞ্চির মধ্যে পার্ক করুন এবং ক্রসওয়াক, ড্রাইভওয়ে বা ফায়ার হাইড্র্যান্ট কখনো আটকাবেন না (অন্তত ১৫ ফুট দূরে থাকুন)। কার্বের রঙ গুরুত্বপূর্ণ — লাল মানে থামা নিষেধ, নীল মানে শুধু প্রতিবন্ধী প্ল্যাকার্ডধারীদের জন্য। ঢালু রাস্তায় চাকা এমনভাবে ঘোরান যাতে গাড়ি গড়ালে কার্বে আটকে যায় বা ট্রাফিক থেকে দূরে সরে যায়।",
    es: "Estaciónese a no más de 18 pulgadas del bordillo y nunca bloquee un cruce, una entrada o un hidrante (manténgase al menos a 15 pies). El color del bordillo importa: rojo es no detenerse, azul es para placas de discapacidad. En una pendiente, gire las ruedas para que, si el auto rueda, se detenga contra el bordillo o se aleje del tránsito.",
  },
  "lanes-passing": {
    en: "Yellow lines separate opposite directions and white lines separate same-direction lanes; never pass over a solid line on your side. Before changing lanes or passing, signal early, check your mirrors, and look over your shoulder for the blind spot — and only pass when you can see far enough ahead.",
    bn: "হলুদ দাগ বিপরীতমুখী যান আলাদা করে, সাদা দাগ একই দিকের লেন আলাদা করে; আপনার পাশের অখণ্ড (solid) দাগ পেরিয়ে কখনো ওভারটেক করবেন না। লেন বদল বা ওভারটেকের আগে আগেভাগে সিগন্যাল দিন, আয়না দেখুন, এবং ব্লাইন্ড স্পটের জন্য কাঁধের ওপর দিয়ে তাকান — আর তখনই পার হোন যখন সামনে যথেষ্ট দূর দেখা যায়।",
    es: "Las líneas amarillas separan sentidos opuestos y las blancas separan carriles del mismo sentido; nunca rebase cruzando una línea continua de su lado. Antes de cambiar de carril o rebasar, señale con anticipación, revise los espejos y mire por encima del hombro el punto ciego, y rebase solo cuando vea lo suficientemente lejos.",
  },
  "dui-alcohol": {
    en: "It is illegal to drive at 0.08% blood alcohol (0.01% if under 21, 0.04% for commercial drivers), and only time — not coffee or a shower — lowers your level. Any impairing drug counts too, including cannabis and some prescriptions, and refusing a chemical test brings an automatic license suspension.",
    bn: "রক্তে অ্যালকোহল ০.০৮% থাকলে গাড়ি চালানো অবৈধ (২১-এর কম হলে ০.০১%, বাণিজ্যিক চালকের ০.০৪%), আর কেবল সময়ই — কফি বা গোসল নয় — মাত্রা কমায়। যেকোনো নেশাজাতীয় ওষুধও এর মধ্যে পড়ে, যেমন গাঁজা ও কিছু প্রেসক্রিপশন, এবং রাসায়নিক পরীক্ষা প্রত্যাখ্যান করলে স্বয়ংক্রিয়ভাবে লাইসেন্স স্থগিত হয়।",
    es: "Es ilegal conducir con 0.08% de alcohol en sangre (0.01% si es menor de 21, 0.04% para conductores comerciales), y solo el tiempo —no el café ni una ducha— reduce el nivel. Cualquier droga que altere las facultades también cuenta, incluido el cannabis y algunos medicamentos, y negarse a una prueba química conlleva la suspensión automática de la licencia.",
  },
  restraints: {
    en: "Everyone in the vehicle must wear a seat belt. Children under 8 ride in a car seat or booster in the back seat unless they are 4 feet 9 inches tall, and children under 2 must ride rear-facing. Wear the lap belt low and snug across the hips, never across the stomach.",
    bn: "গাড়ির সবাইকে সিট বেল্ট পরতে হবে। ৮ বছরের কম বয়সী শিশুরা পেছনের সিটে কার সিট বা বুস্টারে বসবে, যদি না তারা ৪ ফুট ৯ ইঞ্চি লম্বা হয়; আর ২ বছরের কম শিশুদের পেছনমুখী (rear-facing) সিটে বসাতে হবে। ল্যাপ বেল্ট কোমরের ওপর নিচু ও আঁটসাঁট করে পরুন, পেটের ওপর নয়।",
    es: "Todos en el vehículo deben usar el cinturón. Los niños menores de 8 años van en asiento infantil o elevador en el asiento trasero, salvo que midan 4 pies 9 pulgadas, y los menores de 2 años deben ir mirando hacia atrás. Use el cinturón de regazo bajo y ajustado sobre las caderas, nunca sobre el estómago.",
  },
  "sharing-road": {
    en: "Watch carefully for road users who are easy to miss. Give bicyclists at least 3 feet when passing, expect motorcycles to use a full lane, stop for a school bus showing flashing red lights, and always yield to pedestrians in any crosswalk.",
    bn: "যাদের সহজে চোখে পড়ে না, তাদের জন্য সাবধানে লক্ষ রাখুন। সাইকেল আরোহীকে পাশ কাটানোর সময় অন্তত ৩ ফুট জায়গা দিন, মোটরসাইকেলকে পুরো লেন ব্যবহার করতে দিন, লাল আলো জ্বলতে-নিভতে থাকা স্কুলবাসের জন্য থামুন, এবং ক্রসওয়াকে থাকা পথচারীদের সবসময় ছেড়ে দিন।",
    es: "Observe con cuidado a los usuarios de la vía fáciles de pasar por alto. Dé al menos 3 pies a los ciclistas al rebasar, espere que las motocicletas usen todo el carril, deténgase ante un autobús escolar con luces rojas intermitentes y ceda siempre a los peatones en cualquier cruce.",
  },
  freeway: {
    en: "Use the on-ramp to reach traffic speed and merge into a gap — never stop on the ramp. Keep right except to pass, signal about 5 seconds before changing lanes, leave at least a 3-second following gap, and if you miss your exit, simply continue to the next one.",
    bn: "অন-র্যাম্প ব্যবহার করে যানবাহনের গতির সাথে মিলিয়ে নিন এবং ফাঁকা জায়গায় মিশে যান — র্যাম্পে কখনো থামবেন না। ওভারটেক ছাড়া ডান দিকে থাকুন, লেন বদলের আগে প্রায় ৫ সেকেন্ড সিগন্যাল দিন, সামনের গাড়ি থেকে অন্তত ৩ সেকেন্ডের দূরত্ব রাখুন, আর এক্সিট মিস করলে পরের এক্সিট পর্যন্ত এগিয়ে যান।",
    es: "Use la rampa de acceso para alcanzar la velocidad del tránsito e incorpórese en un espacio; nunca se detenga en la rampa. Manténgase a la derecha salvo para rebasar, señale unos 5 segundos antes de cambiar de carril, deje al menos 3 segundos de distancia y, si pasa su salida, continúe hasta la siguiente.",
  },
  railroad: {
    en: "A train always has the right-of-way. Stop for flashing lights or lowered gates, never stop on the tracks, and only start across when there is room for your whole vehicle on the far side. If you ever stall on the tracks with a train coming, get everyone out and move away.",
    bn: "ট্রেনের সবসময় অগ্রাধিকার। জ্বলতে-নিভতে থাকা আলো বা নামানো গেটের জন্য থামুন, রেললাইনের ওপর কখনো থামবেন না, এবং তখনই পার হওয়া শুরু করুন যখন ওপারে আপনার পুরো গাড়ির জায়গা আছে। যদি কখনো লাইনের ওপর গাড়ি বিকল হয় আর ট্রেন আসছে, সবাইকে নামিয়ে দূরে সরে যান।",
    es: "El tren siempre tiene la preferencia. Deténgase ante luces intermitentes o barreras bajadas, nunca se detenga sobre las vías y empiece a cruzar solo cuando haya espacio para todo su vehículo del otro lado. Si alguna vez se queda parado sobre las vías con un tren acercándose, salgan todos y aléjense.",
  },
  emergencies: {
    en: "Stay calm and act. Pull to the right and stop for emergency vehicles, and under the Move Over law change lanes or slow down for stopped responders. If your brakes fail, downshift and use the parking brake; in a skid, ease off the pedals and steer where you want to go.",
    bn: "শান্ত থেকে ব্যবস্থা নিন। জরুরি যানবাহনের জন্য ডান দিকে সরে থামুন, আর Move Over আইন অনুযায়ী থেমে থাকা উদ্ধারকর্মীদের জন্য লেন বদলান বা গতি কমান। ব্রেক বিকল হলে গিয়ার নামিয়ে পার্কিং ব্রেক ব্যবহার করুন; পিছলে গেলে প্যাডেল ছেড়ে দিয়ে যেদিকে যেতে চান সেদিকে স্টিয়ার করুন।",
    es: "Mantenga la calma y actúe. Hágase a la derecha y deténgase ante vehículos de emergencia, y por la ley Move Over cambie de carril o reduzca ante personal detenido. Si fallan los frenos, reduzca la marcha y use el freno de mano; en un derrape, suelte los pedales y dirija el volante hacia donde quiere ir.",
  },
  distracted: {
    en: "Holding a phone while driving is illegal, drivers under 18 may not use one at all, and texting is illegal for everyone. Set your route and music before you start, pull over to handle anything urgent, and remember that even a two-second glance can cause a crash.",
    bn: "গাড়ি চালানোর সময় হাতে ফোন ধরা অবৈধ, ১৮-এর কম বয়সীরা একেবারেই ব্যবহার করতে পারবে না, এবং টেক্সট করা সবার জন্য নিষিদ্ধ। শুরু করার আগেই রুট ও গান ঠিক করে নিন, জরুরি কিছু থাকলে পাশে থামুন, আর মনে রাখুন মাত্র দুই সেকেন্ডের অন্যমনস্কতাও দুর্ঘটনা ঘটাতে পারে।",
    es: "Sostener el teléfono al conducir es ilegal, los menores de 18 no pueden usarlo en absoluto y enviar textos es ilegal para todos. Configure su ruta y su música antes de arrancar, deténgase para atender cualquier urgencia y recuerde que incluso una mirada de dos segundos puede causar un choque.",
  },
  "vehicle-equipment": {
    en: "Your vehicle must be safe and visible. Keep two working headlights (on from 30 minutes after sunset), plus brake lights, signals, wipers, horn, mirrors, and good tires. Dim your high beams within 500 feet of an oncoming vehicle and within 300 feet when following one.",
    bn: "আপনার গাড়ি নিরাপদ ও দৃশ্যমান হতে হবে। দুটি সচল হেডলাইট রাখুন (সূর্যাস্তের ৩০ মিনিট পর থেকে জ্বালান), সাথে ব্রেক লাইট, সিগন্যাল, ওয়াইপার, হর্ন, আয়না ও ভালো টায়ার। সামনের গাড়ি থেকে ৫০০ ফুটের মধ্যে এবং পেছনে অনুসরণ করার সময় ৩০০ ফুটের মধ্যে হাই বিম কমিয়ে দিন।",
    es: "Su vehículo debe ser seguro y visible. Mantenga dos faros funcionando (encendidos desde 30 minutos después del atardecer), además de luces de freno, intermitentes, limpiaparabrisas, claxon, espejos y buenas llantas. Baje las luces altas a 500 pies de un vehículo que viene de frente y a 300 pies cuando sigue a uno.",
  },
  insurance: {
    en: "California requires liability insurance: at least $30,000 per person, $60,000 per accident, and $15,000 for property damage. Carry proof and show it when asked. Driving uninsured can suspend your license and registration, and a serious crash must be reported to DMV (form SR-1) within 10 days.",
    bn: "ক্যালিফোর্নিয়ায় দায় বীমা (liability insurance) বাধ্যতামূলক: প্রতি ব্যক্তির জন্য অন্তত $৩০,০০০, প্রতি দুর্ঘটনায় $৬০,০০০, এবং সম্পত্তির ক্ষতির জন্য $১৫,০০০। প্রমাণ সঙ্গে রাখুন ও চাইলে দেখান। বীমা ছাড়া চালালে লাইসেন্স ও রেজিস্ট্রেশন স্থগিত হতে পারে, আর গুরুতর দুর্ঘটনা ১০ দিনের মধ্যে DMV-কে (SR-1 ফর্ম) জানাতে হবে।",
    es: "California exige seguro de responsabilidad civil: al menos $30,000 por persona, $60,000 por accidente y $15,000 por daños a la propiedad. Lleve el comprobante y muéstrelo cuando se lo pidan. Conducir sin seguro puede suspender su licencia y matrícula, y un accidente grave debe reportarse al DMV (formulario SR-1) en 10 días.",
  },
  weather: {
    en: "Slow down and increase your following distance in rain, fog, or snow. Roads are most slippery when rain first begins; use low beams in fog; if you start to hydroplane, ease off the gas without braking hard; and remember that bridges and overpasses freeze before other roads.",
    bn: "বৃষ্টি, কুয়াশা বা তুষারে গতি কমান ও সামনের দূরত্ব বাড়ান। বৃষ্টি সবে শুরু হলে রাস্তা সবচেয়ে পিচ্ছিল থাকে; কুয়াশায় লো বিম ব্যবহার করুন; হাইড্রোপ্লেন (পানির ওপর পিছলানো) শুরু হলে জোরে ব্রেক না করে গ্যাস ছেড়ে দিন; আর মনে রাখুন সেতু ও ওভারপাস অন্য রাস্তার আগে বরফ জমে।",
    es: "Reduzca la velocidad y aumente la distancia con lluvia, niebla o nieve. El pavimento está más resbaladizo cuando empieza a llover; use luces bajas en la niebla; si empieza a hidroplanear, suelte el acelerador sin frenar bruscamente; y recuerde que los puentes y pasos elevados se congelan antes que el resto.",
  },
  "licensing-misc": {
    en: "Carry your license whenever you drive and report an address change to DMV within 10 days. Make a full stop behind limit lines, and treat a dark (non-working) signal as a four-way stop. A right turn on red is allowed only after a complete stop where it is not prohibited, and too many points can suspend your license.",
    bn: "গাড়ি চালানোর সময় সবসময় লাইসেন্স সঙ্গে রাখুন এবং ঠিকানা বদলালে ১০ দিনের মধ্যে DMV-কে জানান। লিমিট লাইনের পেছনে পুরোপুরি থামুন, আর বন্ধ (অকেজো) সিগন্যালকে চার-দিকের স্টপ হিসেবে ধরুন। যেখানে নিষেধ নেই সেখানে পুরোপুরি থেমে লাল বাতিতে ডান মোড় নেওয়া যায়, আর বেশি পয়েন্ট জমলে লাইসেন্স স্থগিত হতে পারে।",
    es: "Lleve su licencia siempre que conduzca y reporte un cambio de domicilio al DMV en 10 días. Haga un alto completo detrás de las líneas de límite y trate un semáforo apagado (sin funcionar) como un alto de cuatro vías. El giro a la derecha con luz roja se permite solo tras un alto completo donde no esté prohibido, y demasiados puntos pueden suspender su licencia.",
  },
};
