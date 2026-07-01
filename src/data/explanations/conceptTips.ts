/**
 * Concept-level explanation bank (English, Bengali, Spanish).
 *
 * These are more specific than the per-category tips: each targets one concept
 * (curb colors, the 3-second rule, BAC limits, …) and is matched to a question
 * by keywords in its prompt. `getDetailedExplanation` prefers a matching concept
 * tip over the broad category tip so explanations teach the actual concept.
 *
 * Order matters: more specific concepts come first (first keyword match wins).
 */
export interface ConceptTip {
  id: string;
  keywords: string[];
  en: string;
  bn: string;
  es: string;
}

export const CONCEPT_TIPS: ConceptTip[] = [
  {
    id: "hill-parking",
    keywords: ["uphill", "downhill", "park on a hill", "parking on a hill", "turn your wheels", "turn your front wheels", "wheels toward", "wheels away", "no curb"],
    en: "Parking on a hill: facing downhill (or uphill with no curb) turn your wheels toward the curb or road edge; facing uphill with a curb turn them away from the curb. Always set the parking brake.",
    bn: "ঢালে পার্কিং: নিচের দিকে মুখ করে (বা কার্ব ছাড়া ওপরের দিকে) চাকা কার্ব বা রাস্তার কিনারার দিকে ঘোরান; কার্বসহ ওপরের দিকে হলে চাকা কার্ব থেকে দূরে ঘোরান। সবসময় পার্কিং ব্রেক দিন।",
    es: "Al estacionar en pendiente: cuesta abajo (o cuesta arriba sin bordillo) gire las ruedas hacia el bordillo o el borde; cuesta arriba con bordillo, gírelas hacia afuera. Ponga siempre el freno de mano.",
  },
  {
    id: "curb-colors",
    keywords: ["painted curb", "curb painted", "red curb", "blue curb", "white curb", "yellow curb", "green curb", "curb color", "color curb", "colored curb"],
    en: "Curb colors in California: red = no stopping, yellow = loading only for the posted time, white = a quick passenger or mail stop, green = time-limited parking, blue = disabled placard or plate only.",
    bn: "ক্যালিফোর্নিয়ায় কার্বের রঙ: লাল = থামা নিষেধ, হলুদ = নির্ধারিত সময়ের জন্য শুধু মালামাল ওঠানো-নামানো, সাদা = যাত্রী বা ডাক দ্রুত ওঠানো-নামানো, সবুজ = সীমিত সময়ের পার্কিং, নীল = শুধু প্রতিবন্ধী প্ল্যাকার্ড/প্লেটধারীদের জন্য।",
    es: "Colores de bordillo en California: rojo = no detenerse, amarillo = solo carga por el tiempo indicado, blanco = parada breve de pasajeros o correo, verde = estacionamiento por tiempo limitado, azul = solo con placa de discapacidad.",
  },
  {
    id: "fire-hydrant",
    keywords: ["hydrant"],
    en: "Never park within 15 feet of a fire hydrant, and never block a crosswalk, driveway, or intersection.",
    bn: "ফায়ার হাইড্রেন্টের ১৫ ফুটের মধ্যে কখনো পার্ক করবেন না, এবং ক্রসওয়াক, ড্রাইভওয়ে বা মোড় কখনো আটকাবেন না।",
    es: "Nunca estacione a menos de 15 pies de un hidrante, ni bloquee un cruce peatonal, una entrada o una intersección.",
  },
  {
    id: "school-bus",
    keywords: ["school bus"],
    en: "School bus lights: flashing yellow means it is about to stop, so prepare to stop; flashing red with the stop-arm out means stop in both directions until the lights go off — unless a divider separates the opposing roadway.",
    bn: "স্কুলবাসের আলো: জ্বলা-নেভা হলুদ মানে থামতে যাচ্ছে, তাই থামার প্রস্তুতি নিন; জ্বলা-নেভা লাল ও স্টপ-আর্ম বের করা মানে আলো নেভা পর্যন্ত দুই দিক থেকেই থামুন — যদি না বিভাজক বিপরীত রাস্তা আলাদা করে।",
    es: "Luces del autobús escolar: amarilla intermitente = va a detenerse, prepárese; roja intermitente con el brazo de alto = deténgase en ambos sentidos hasta que se apaguen, salvo que un divisor separe la calzada opuesta.",
  },
  {
    id: "railroad",
    keywords: ["railroad", "crossbuck", "train", "tracks"],
    en: "At railroad crossings the train always has the right-of-way. Stop for flashing lights or lowered gates, never stop on the tracks, and cross only when there is room for your whole vehicle on the far side.",
    bn: "রেল ক্রসিংয়ে ট্রেনের সবসময় অগ্রাধিকার। জ্বলা-নেভা আলো বা নামানো গেটে থামুন, লাইনের ওপর কখনো থামবেন না, এবং ওপারে পুরো গাড়ির জায়গা থাকলে তবেই পার হোন।",
    es: "En los cruces de ferrocarril el tren siempre tiene preferencia. Deténgase ante luces intermitentes o barreras bajadas, nunca se detenga sobre las vías y cruce solo cuando haya espacio para todo su vehículo del otro lado.",
  },
  {
    id: "roundabout",
    keywords: ["roundabout"],
    en: "In a roundabout, yield to traffic already circulating, travel counter-clockwise, don't stop or pass inside, and signal as you exit.",
    bn: "রাউন্ডঅ্যাবাউটে ভেতরে ঘুরতে থাকা যানকে ছেড়ে দিন, ঘড়ির কাঁটার বিপরীতে চলুন, ভেতরে থেমে বা ওভারটেক করবেন না, এবং বের হওয়ার সময় সিগন্যাল দিন।",
    es: "En una glorieta, ceda al tránsito que ya circula, avance en sentido antihorario, no se detenga ni rebase dentro y señale al salir.",
  },
  {
    id: "four-way-stop",
    keywords: ["four-way", "4-way", "all-way", "four way stop", "four-way stop"],
    en: "At a four-way (all-way) stop, the first to arrive goes first; if two arrive together, the driver on the left yields to the driver on the right. Pedestrians always go first.",
    bn: "চার-দিকের স্টপে যে আগে পৌঁছায় সে আগে যায়; দুজন একসাথে এলে বাঁ দিকের চালক ডান দিকের চালককে ছেড়ে দেন। পথচারীরা সবসময় আগে।",
    es: "En un alto de cuatro vías, pasa primero quien llega primero; si llegan juntos, el de la izquierda cede al de la derecha. Los peatones siempre pasan primero.",
  },
  {
    id: "hand-signals",
    keywords: ["hand signal"],
    en: "Hand signals: left arm straight out = left turn; left arm bent up = right turn; left arm bent down = slowing or stopping.",
    bn: "হাতের সংকেত: বাঁ হাত সোজা বাইরে = বাঁ মোড়; বাঁ হাত ওপরে বাঁকানো = ডান মোড়; বাঁ হাত নিচে বাঁকানো = গতি কমানো বা থামা।",
    es: "Señales con la mano: brazo izquierdo extendido = giro a la izquierda; doblado hacia arriba = giro a la derecha; doblado hacia abajo = frenar o detenerse.",
  },
  {
    id: "hov",
    keywords: ["carpool", "hov", "high-occupancy", "high occupancy"],
    en: "Carpool (HOV) lanes require the minimum number of people posted on the sign (often 2 or more); motorcycles are allowed. Enter or exit only where the lane line is broken.",
    bn: "কারপুল (HOV) লেনে সাইনে লেখা সর্বনিম্ন সংখ্যক লোক লাগে (প্রায়ই ২ বা তার বেশি); মোটরসাইকেল অনুমোদিত। শুধু যেখানে লেন-দাগ ভাঙা সেখানেই ঢুকুন বা বের হোন।",
    es: "Los carriles compartidos (HOV) exigen el número mínimo de personas indicado (a menudo 2 o más); las motocicletas están permitidas. Entre o salga solo donde la línea sea discontinua.",
  },
  {
    id: "no-passing-lines",
    keywords: ["double yellow", "solid yellow", "broken yellow", "no-passing", "no passing", "passing zone", "pass another vehicle", "cross a solid", "legal to pass", "when is it legal to drive off"],
    en: "Yellow center lines divide opposite directions: a solid yellow on your side means no passing; a broken yellow means you may pass when the way is clear. Never pass on hills or curves where you can't see far enough ahead.",
    bn: "মাঝের হলুদ দাগ বিপরীত দিক আলাদা করে: আপনার পাশে অখণ্ড হলুদ মানে ওভারটেক নিষেধ; ভাঙা হলুদ মানে পথ পরিষ্কার থাকলে ওভারটেক করা যায়। যেখানে সামনে যথেষ্ট দূর দেখা যায় না (পাহাড়/বাঁক) সেখানে কখনো ওভারটেক করবেন না।",
    es: "Las líneas amarillas centrales separan sentidos opuestos: una amarilla continua de su lado prohíbe rebasar; una discontinua permite rebasar cuando el camino esté despejado. Nunca rebase en cuestas o curvas sin buena visibilidad.",
  },
  {
    id: "headlights",
    keywords: ["high beam", "high-beam", "low beam", "low-beam", "headlight", "dim your"],
    en: "Use headlights from 30 minutes after sunset to 30 minutes before sunrise and whenever visibility is low. Dim high beams within 500 feet of oncoming traffic and within 300 feet when following; use low beams in fog or rain.",
    bn: "সূর্যাস্তের ৩০ মিনিট পর থেকে সূর্যোদয়ের ৩০ মিনিট আগে এবং দৃশ্যমানতা কম হলেই হেডলাইট ব্যবহার করুন। সামনের গাড়ি থেকে ৫০০ ফুট ও পেছনে অনুসরণের সময় ৩০০ ফুটের মধ্যে হাই বিম কমান; কুয়াশা বা বৃষ্টিতে লো বিম ব্যবহার করুন।",
    es: "Use los faros desde 30 minutos después del atardecer hasta 30 minutos antes del amanecer y siempre que haya poca visibilidad. Baje las luces altas a 500 pies del tránsito que viene y a 300 pies al seguir a otro; use luces bajas con niebla o lluvia.",
  },
  {
    id: "child-restraints",
    keywords: ["car seat", "booster", "rear-facing", "rear facing", "child restraint", "children under", "a child under", "child must"],
    en: "Children under 2 ride rear-facing (unless 40 lb or 40 inches). Children under 8 use a car seat or booster in the back seat unless they are 4 feet 9 inches tall. Everyone must buckle up.",
    bn: "২ বছরের কম শিশুরা পেছনমুখী বসবে (৪০ পাউন্ড বা ৪০ ইঞ্চি না হলে)। ৮ বছরের কম শিশুরা পেছনের সিটে কার সিট বা বুস্টারে বসবে, যদি না ৪ ফুট ৯ ইঞ্চি লম্বা হয়। সবাইকে সিট বেল্ট পরতে হবে।",
    es: "Los menores de 2 años van mirando hacia atrás (salvo 40 lb o 40 pulgadas). Los menores de 8 usan asiento o elevador en el asiento trasero salvo que midan 4 pies 9 pulgadas. Todos deben usar el cinturón.",
  },
  {
    id: "move-over",
    keywords: ["move over", "move-over", "hazard light", "warning device", "stopped emergency", "stationary vehicle", "emergency vehicle"],
    en: "The Move Over law: when approaching any stopped vehicle showing hazard lights or warning devices (emergency, tow, or roadside), change lanes away from it if you safely can, or slow to a safe speed.",
    bn: "Move Over আইন: হ্যাজার্ড লাইট বা সতর্কতা-চিহ্ন দেখানো যেকোনো থেমে থাকা গাড়ির (জরুরি, টো বা রাস্তার ধারে) কাছে গেলে নিরাপদে পারলে লেন বদলে দূরে সরুন, নয়তো নিরাপদ গতিতে ধীর হোন।",
    es: "La ley Move Over: al acercarse a cualquier vehículo detenido con luces de emergencia o dispositivos de advertencia (emergencia, grúa o al costado), cámbiese de carril si es seguro, o reduzca a una velocidad segura.",
  },
  {
    id: "hydroplane",
    keywords: ["hydroplan", "skid", "slippery"],
    en: "If you hydroplane or start to skid, ease off the gas (don't brake hard) and steer smoothly where you want to go. Slow down on wet roads — they are most slippery when rain first begins.",
    bn: "হাইড্রোপ্লেন বা স্কিড শুরু হলে গ্যাস ছেড়ে দিন (জোরে ব্রেক নয়) এবং যেদিকে যেতে চান মসৃণভাবে স্টিয়ার করুন। ভেজা রাস্তায় গতি কমান — বৃষ্টি সবে শুরু হলে সবচেয়ে পিচ্ছিল থাকে।",
    es: "Si hidroplanea o empieza a derrapar, suelte el acelerador (no frene bruscamente) y dirija con suavidad hacia donde quiere ir. Reduzca en pavimento mojado: es más resbaladizo cuando empieza a llover.",
  },
  {
    id: "cellphone",
    keywords: ["cell phone", "cellphone", "phone", "text message", "texting", "hands-free", "hands free"],
    en: "You may not hold a phone while driving — adults may use it only hands-free, and drivers under 18 may not use one at all. Texting is illegal for everyone; set things up before you drive or pull over.",
    bn: "গাড়ি চালানোর সময় ফোন হাতে ধরা যাবে না — প্রাপ্তবয়স্করা শুধু হ্যান্ডস-ফ্রি ব্যবহার করতে পারেন, ১৮-এর কম বয়সীরা একেবারেই নয়। টেক্সট করা সবার জন্য নিষিদ্ধ; চালানোর আগেই ঠিক করে নিন বা পাশে থামুন।",
    es: "No puede sostener el teléfono al conducir: los adultos solo con manos libres y los menores de 18 no pueden usarlo en absoluto. Enviar textos es ilegal para todos; prepare todo antes de conducir o deténgase.",
  },
  {
    id: "bac-limits",
    keywords: ["bac", "blood alcohol", "0.08", "0.01", "0.04", "dui", "intoxicat", "alcohol"],
    en: "Blood alcohol limits: 0.08% for drivers 21 and older, 0.04% for commercial drivers, and 0.01% for anyone under 21 or on DUI probation. Only time lowers your level — coffee won't. A DUI brings heavy fines, possible jail, and license suspension.",
    bn: "রক্তে অ্যালকোহলের সীমা: ২১+ চালকের জন্য ০.০৮%, বাণিজ্যিক চালকের ০.০৪%, এবং ২১-এর কম বা DUI প্রোবেশনে থাকলে ০.০১%। কেবল সময়ই মাত্রা কমায় — কফি নয়। DUI-তে বড় জরিমানা, সম্ভাব্য জেল ও লাইসেন্স স্থগিত হয়।",
    es: "Límites de alcohol en sangre: 0.08% para conductores de 21+, 0.04% para comerciales y 0.01% para menores de 21 o en libertad condicional por DUI. Solo el tiempo baja el nivel, no el café. Un DUI conlleva multas fuertes, posible cárcel y suspensión de la licencia.",
  },
  {
    id: "three-second-rule",
    keywords: ["following distance", "3-second", "3 second", "three-second", "three second", "tailgat", "following too close"],
    en: "Keep at least a 3-second following distance: pick a fixed point and make sure you reach it no sooner than 3 seconds after the car ahead. Add more time in rain, fog, or at higher speeds.",
    bn: "সামনের গাড়ি থেকে অন্তত ৩ সেকেন্ডের দূরত্ব রাখুন: একটি স্থির বিন্দু বেছে নিন এবং নিশ্চিত করুন সামনের গাড়ি সেটি পার হওয়ার ৩ সেকেন্ডের আগে আপনি যেন না পৌঁছান। বৃষ্টি, কুয়াশা বা বেশি গতিতে আরও সময় যোগ করুন।",
    es: "Mantenga al menos 3 segundos de distancia: elija un punto fijo y asegúrese de llegar a él no antes de 3 segundos después del auto de adelante. Añada más tiempo con lluvia, niebla o a mayor velocidad.",
  },
  {
    id: "crosswalk-peds",
    keywords: ["crosswalk", "pedestrian"],
    en: "Yield to pedestrians in any crosswalk, marked or unmarked. Stop and let them finish crossing, and don't block the crosswalk when you stop.",
    bn: "যেকোনো ক্রসওয়াকে (দাগযুক্ত হোক বা না হোক) পথচারীদের ছেড়ে দিন। থেমে তাদের পার হতে দিন, এবং থামার সময় ক্রসওয়াক আটকাবেন না।",
    es: "Ceda a los peatones en cualquier cruce, marcado o no. Deténgase y déjelos terminar de cruzar, y no bloquee el cruce al detenerse.",
  },
  {
    id: "speed-zones",
    keywords: ["speed limit", "mph", "basic speed", "how fast", "maximum speed", "too fast"],
    en: "Key speed limits: 15 mph in alleys and blind intersections, 25 mph in business/residential and school zones (when children are present), and 55–65 mph on highways — but the Basic Speed Law means never faster than is safe for conditions.",
    bn: "মূল গতিসীমা: গলি ও অন্ধ মোড়ে ১৫ mph, ব্যবসায়িক/আবাসিক ও স্কুল এলাকায় (শিশু থাকলে) ২৫ mph, হাইওয়েতে ৫৫–৬৫ mph — তবে মূল গতি আইন অনুযায়ী কখনোই পরিস্থিতির চেয়ে বেশি দ্রুত নয়।",
    es: "Límites clave: 15 mph en callejones y cruces ciegos, 25 mph en zonas comerciales/residenciales y escolares (con niños presentes), y 55–65 mph en carreteras, pero la Ley Básica de Velocidad significa nunca más rápido de lo seguro.",
  },
];

/** Find the concept tip whose keywords match the question prompt, if any. */
export function conceptTipFor(prompt: string): ConceptTip | undefined {
  const text = prompt.toLowerCase();
  return CONCEPT_TIPS.find((c) => c.keywords.some((k) => text.includes(k)));
}
