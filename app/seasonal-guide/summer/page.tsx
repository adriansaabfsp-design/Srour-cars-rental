"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

type Lang = "en" | "fr" | "ar";

const T: Record<Lang, {
  home: string; guide: string; season: string; subtitle: string;
  backToGuide: string; ctaTitle: string; ctaSub: string; ctaBtn: string;
  sections: { title: string; paragraphs: string[] }[];
}> = {
  en: {
    home: "Home", guide: "Seasonal Guide", season: "Summer",
    subtitle: "June to August",
    backToGuide: "← Back to Guide",
    ctaTitle: "Ready for the Best Summer of Your Life?",
    ctaSub: "From convertibles to SUVs, find the car that matches your summer plans.",
    ctaBtn: "Browse Convertibles",
    sections: [
      {
        title: "",
        paragraphs: [
          "Summer is when Lebanon turns the volume all the way up. This is the season everyone talks about, the one that fills Instagram feeds and creates those stories people tell for years. The Mediterranean coast is buzzing, the mountain towns are alive, and there's this incredible energy that makes you feel like anything is possible. It's hot, it's loud, it's beautiful, and it's absolutely unforgettable.",
        ],
      },
      {
        title: "What the Weather is Actually Like",
        paragraphs: [
          "Let's be real. The coast gets hot. Beirut in July and August sits around 30 to 35°C with humidity that makes it feel even warmer. But here's Lebanon's secret weapon: the mountains. Drive 45 minutes from the sweaty coast up to places like Ehden, Bcharre, or the Chouf, and you'll find temperatures around 20 to 25°C with a beautiful breeze. It's why so many Lebanese families head to the mountains on weekends.",
          "The Bekaa Valley is the hottest part of the country in summer, regularly hitting 38 to 40°C. If you're visiting Baalbek, go early in the morning or late afternoon. The light is better for photos at those times anyway.",
          "Rain in summer? Basically zero. You won't need an umbrella from June through September. Just sunscreen, sunglasses, and a good attitude.",
        ],
      },
      {
        title: "Where to Go",
        paragraphs: [
          "Batroun has quietly become one of the coolest beach towns in the Mediterranean. The old stone souk, the incredible seafood restaurants right on the water, the beach bars that go late into the night. It's got this perfect mix of authentic Lebanese charm and modern beach culture. You could easily spend three or four days here and never get bored.",
          "Tyre (Sour) has the best sandy beaches in Lebanon, hands down. The water is crystal clear, the sand is soft, and the whole vibe is more relaxed and local feeling than the busier spots up north. The ancient Roman ruins right by the sea are surreal. Swimming next to 2,000 year old columns is definitely a bucket list experience.",
          "Jounieh Bay is where the party scene lives. The famous Casino du Liban, the rooftop bars, the nightclubs. If you want to experience Lebanon's legendary nightlife, this is your area. Take the Jounieh téléphérique (cable car) up to Harissa for incredible views over the bay.",
          "Ehden in the north is the perfect mountain escape when the coast gets too hot. It's green, it's cool, and the Horsh Ehden Nature Reserve has some of the most beautiful hiking trails in the country. The town itself has amazing restaurants and a laid back atmosphere. Pure relaxation.",
        ],
      },
      {
        title: "The Best Car for Summer",
        paragraphs: [
          "Summer is convertible season. If there's ever a time to treat yourself to a convertible, this is it. Cruising along the coastal highway with the top down, sea breeze in your hair, mountains on one side and Mediterranean blue on the other. It's the definition of living your best life.",
          "For a more practical choice, a comfortable sedan with good air conditioning is perfect for the coast. If you're planning to mix beach time with mountain escapes (which we highly recommend), a crossover SUV gives you the best of both worlds. It handles the mountain roads easily and still looks great pulling up to a beach club.",
          "If you're traveling with a bigger group or family, a full size SUV is the way to go. You'll want the space for beach gear, hiking boots, and all the souvenirs you're inevitably going to buy.",
        ],
      },
      {
        title: "The Summer Vibe",
        paragraphs: [
          "What makes summer in Lebanon truly special isn't just the beaches or the weather. It's the atmosphere. Every restaurant has outdoor seating, every town has some kind of festival or event, and the streets are alive until the early hours of the morning. The Baalbek International Festival brings world class performers to one of history's most incredible venues. The Byblos International Festival does the same in a crusader castle by the sea.",
          "Lebanese people know how to enjoy summer. Long lunches that turn into dinners, spontaneous gatherings, music everywhere. It's infectious. You come for the beach and you leave with friendships and memories that last a lifetime.",
        ],
      },
      {
        title: "Things to Keep in Mind",
        paragraphs: [
          "Traffic is real in summer, especially on weekends. The highway from Beirut heading north gets packed on Friday evenings and Saturday mornings. If you can, travel midweek or leave early in the morning. Prices for everything go up in peak season (July and August), from car rentals to hotels to restaurants. Booking early gets you better rates and more car choices. And don't underestimate the sun. Stay hydrated, use sunscreen, and take advantage of the shade during the hottest part of the day (2pm to 5pm).",
        ],
      },
    ],
  },
  fr: {
    home: "Accueil", guide: "Guide saisonnier", season: "Été",
    subtitle: "Juin à Août",
    backToGuide: "← Retour au guide",
    ctaTitle: "Prêt pour le meilleur été de votre vie ?",
    ctaSub: "Des cabriolets aux SUV, trouvez la voiture qui correspond à vos plans d'été.",
    ctaBtn: "Voir les cabriolets",
    sections: [
      {
        title: "",
        paragraphs: [
          "L'été, c'est quand le Liban met le volume à fond. C'est la saison dont tout le monde parle, celle qui remplit les fils Instagram et crée ces histoires que les gens racontent pendant des années. La côte méditerranéenne vibre, les villages de montagne sont animés, et il y a cette énergie incroyable qui vous donne l'impression que tout est possible. C'est chaud, c'est bruyant, c'est beau, et c'est absolument inoubliable.",
        ],
      },
      {
        title: "Le temps qu'il fait vraiment",
        paragraphs: [
          "Soyons honnêtes. La côte est chaude. Beyrouth en juillet et août tourne autour de 30 à 35°C avec une humidité qui la rend encore plus chaude. Mais voici l'arme secrète du Liban : les montagnes. Conduisez 45 minutes depuis la côte moite jusqu'à des endroits comme Ehden, Bcharré ou le Chouf, et vous trouverez des températures autour de 20 à 25°C avec une belle brise. C'est pourquoi tant de familles libanaises se rendent à la montagne le weekend.",
          "La vallée de la Bekaa est la partie la plus chaude du pays en été, atteignant régulièrement 38 à 40°C. Si vous visitez Baalbek, allez-y tôt le matin ou en fin d'après-midi. La lumière est meilleure pour les photos à ces moments de toute façon.",
          "De la pluie en été ? Pratiquement zéro. Vous n'aurez pas besoin de parapluie de juin à septembre. Juste de la crème solaire, des lunettes de soleil et une bonne attitude.",
        ],
      },
      {
        title: "Où aller",
        paragraphs: [
          "Batroun est devenue discrètement l'une des villes balnéaires les plus branchées de la Méditerranée. Le vieux souk en pierre, les restaurants de fruits de mer incroyables au bord de l'eau, les bars de plage ouverts tard dans la nuit. Il y a ce mélange parfait de charme libanais authentique et de culture balnéaire moderne. Vous pourriez facilement passer trois ou quatre jours ici sans jamais vous ennuyer.",
          "Tyr (Sour) a les meilleures plages de sable du Liban, sans discussion. L'eau est cristalline, le sable est doux, et toute l'ambiance est plus détendue et locale que les spots plus fréquentés au nord. Les ruines romaines antiques juste au bord de la mer sont surréalistes. Nager à côté de colonnes vieilles de 2 000 ans est définitivement une expérience à vivre.",
          "La baie de Jounieh, c'est là que vit la scène festive. Le fameux Casino du Liban, les bars sur les toits, les boîtes de nuit. Si vous voulez vivre la vie nocturne légendaire du Liban, c'est votre quartier. Prenez le téléphérique de Jounieh jusqu'à Harissa pour des vues incroyables sur la baie.",
          "Ehden dans le nord est l'échappée montagnarde parfaite quand la côte devient trop chaude. C'est vert, c'est frais, et la réserve naturelle de Horsh Ehden a certains des plus beaux sentiers de randonnée du pays. La ville elle-même a des restaurants incroyables et une atmosphère décontractée. Détente pure.",
        ],
      },
      {
        title: "La meilleure voiture pour l'été",
        paragraphs: [
          "L'été, c'est la saison du cabriolet. S'il y a un moment pour se faire plaisir avec un cabriolet, c'est celui-ci. Rouler le long de l'autoroute côtière le toit baissé, la brise marine dans les cheveux, les montagnes d'un côté et le bleu méditerranéen de l'autre. C'est la définition de vivre sa meilleure vie.",
          "Pour un choix plus pratique, une berline confortable avec une bonne climatisation est parfaite pour la côte. Si vous prévoyez de mélanger plage et escapades en montagne (ce qu'on recommande fortement), un SUV crossover vous offre le meilleur des deux mondes. Il gère facilement les routes de montagne et a toujours fière allure en arrivant à un beach club.",
          "Si vous voyagez avec un groupe plus grand ou en famille, un SUV grande taille est la solution. Vous apprécierez l'espace pour le matériel de plage, les chaussures de randonnée et tous les souvenirs que vous allez inévitablement acheter.",
        ],
      },
      {
        title: "L'ambiance estivale",
        paragraphs: [
          "Ce qui rend l'été au Liban vraiment spécial, ce ne sont pas seulement les plages ou la météo. C'est l'atmosphère. Chaque restaurant a sa terrasse, chaque ville a un festival ou un événement, et les rues sont animées jusqu'au petit matin. Le Festival International de Baalbek accueille des artistes de classe mondiale dans l'un des lieux les plus incroyables de l'histoire. Le Festival International de Byblos fait de même dans un château de croisés au bord de la mer.",
          "Les Libanais savent profiter de l'été. De longs déjeuners qui se transforment en dîners, des rassemblements spontanés, de la musique partout. C'est contagieux. Vous venez pour la plage et vous repartez avec des amitiés et des souvenirs qui durent toute une vie.",
        ],
      },
      {
        title: "À garder en tête",
        paragraphs: [
          "Le trafic est réel en été, surtout le weekend. L'autoroute de Beyrouth vers le nord est bondée le vendredi soir et le samedi matin. Si possible, voyagez en milieu de semaine ou partez tôt le matin. Les prix de tout augmentent en haute saison (juillet et août), des locations de voiture aux hôtels en passant par les restaurants. Réserver tôt vous donne de meilleurs tarifs et plus de choix de voitures. Et ne sous-estimez pas le soleil. Restez hydraté, utilisez de la crème solaire, et profitez de l'ombre pendant les heures les plus chaudes (14h à 17h).",
        ],
      },
    ],
  },
  ar: {
    home: "الرئيسية", guide: "دليل المواسم", season: "الصيف",
    subtitle: "حزيران إلى آب",
    backToGuide: "← الرجوع للدليل",
    ctaTitle: "جاهز لأحلى صيف بحياتك؟",
    ctaSub: "من الكشف للـ SUV، لاقي السيارة يلي بتمشي مع خطط صيفك.",
    ctaBtn: "تصفح الكشف",
    sections: [
      {
        title: "",
        paragraphs: [
          "الصيف هو لما لبنان بيعلي الصوت لأقصى حد. هيدا الموسم يلي الكل بيحكي عنو، يلي بيملي فيد الإنستغرام وبيخلق هالقصص يلي الناس بتحكيها لسنين. الساحل المتوسطي نابض بالحياة، القرى الجبلية عايشة، وفي طاقة ما بتوصف بتحسسك إنو كل شي ممكن. حر، صاخب، حلو، وما بينتنسى أبداً.",
        ],
      },
      {
        title: "الطقس شو بيكون فعلياً",
        paragraphs: [
          "خلينا نكون صريحين. الساحل بيكون حر. بيروت بتموز وآب بتكون حوالي 30 لـ 35 درجة مع رطوبة بتحسسك بحرارة أكتر. بس هيدا سلاح لبنان السري: الجبال. سوق 45 دقيقة من الساحل الرطب لأماكن متل إهدن وبشري والشوف، وبتلاقي حرارة حوالي 20 لـ 25 درجة مع نسمة حلوة. لهيك كتير عائلات لبنانية بتطلع عالجبل الويكإند.",
          "البقاع هو أحر منطقة بالبلد بالصيف، بيوصل بانتظام لـ 38 لـ 40 درجة. إذا عم تزور بعلبك، روح بكير الصبح أو آخر بعد الضهر. الضو بيكون أحسن للصور بهالأوقات على كل حال.",
          "شتي بالصيف؟ تقريباً صفر. ما رح تحتاج شمسية من حزيران لأيلول. بس واقي شمس، نظارات شمسية، ومزاج منيح.",
        ],
      },
      {
        title: "لوين تروح",
        paragraphs: [
          "البترون صارت بهدوء من أروع المدن الساحلية بالمتوسط. السوق القديم الحجري، مطاعم السمك الرهيبة عالمي مباشرة، بارات البحر يلي بتسهر لالصبح. فيها هالمزيج المثالي بين السحر اللبناني الأصيل وثقافة البحر الحديثة. فيك بسهولة تقضي تلات أو أربع أيام هون بدون ما تملّ.",
          "صور (سور) فيها أحسن شواطئ رملية بلبنان، بلا نقاش. المي صافية، الرمل ناعم، وكل الجو أهدى وأكتر محلي من الأماكن الأكتر ازدحاماً بالشمال. الآثار الرومانية القديمة عالبحر مباشرة شي خيالي. تسبح حد أعمدة عمرها 2,000 سنة هي فعلاً تجربة لازم تعيشها.",
          "خليج جونيه هو وين السهر عايش. كازينو لبنان الشهير، البارات عالسطوح، النوادي الليلية. إذا بدك تعيش حياة الليل الأسطورية تبع لبنان، هيدا مكانك. خد تلفريك جونيه لحريصا لمناظر ما بتنوصف فوق الخليج.",
          "إهدن بالشمال هي الهروب الجبلي المثالي لما الساحل يصير حر كتير. خضرا، باردة، ومحمية حرش إهدن الطبيعية فيها من أحلى مسارات المشي بالبلد. البلدة حالها فيها مطاعم رائعة وجو مسترخي. استرخاء صافي.",
        ],
      },
      {
        title: "أفضل سيارة للصيف",
        paragraphs: [
          "الصيف هو موسم الكشف. إذا في وقت تدلل فيه حالك بسيارة كشف، هيدا هو. تسوق على الأوتوستراد الساحلي والسقف مفتوح، نسمة البحر بشعرك، الجبال من طرف والبحر الأبيض المتوسط من الطرف التاني. هيدا تعريف العيشة الحلوة.",
          "لخيار أكتر عملي، سيدان مريحة مع تكييف منيح مثالية للساحل. إذا ناوي تمزج وقت البحر مع طلعات الجبل (يلي منحبذها كتير)، SUV كروس أوفر بيعطيك أحسن العالمين. بيتعامل مع طرقات الجبل بسهولة ولسا بيطلع حلو لما توصل على بيتش كلوب.",
          "إذا عم تسافر مع مجموعة أكبر أو عيلة، SUV كبير هو الحل. بدك المساحة لأغراض البحر، صباطات المشي، وكل التذكارات يلي حتماً رح تشتريها.",
        ],
      },
      {
        title: "جو الصيف",
        paragraphs: [
          "يلي بيخلي الصيف بلبنان فعلاً مميز مش بس الشواطئ أو الطقس. هو الجو العام. كل مطعم فاتح برا، كل بلدة عندها مهرجان أو حدث، والشوارع عايشة لالصبح. مهرجان بعلبك الدولي بيجيب فنانين عالميين لواحد من أروع الأماكن بالتاريخ. مهرجان جبيل الدولي بيعمل نفس الشي بقلعة صليبية حد البحر.",
          "اللبنانيين بيعرفوا كيف يستمتعوا بالصيف. غداء طويل بيتحول لعشاء، لمات عفوية، موسيقى بكل مكان. معدي. بتيجي للبحر وبتروح بصداقات وذكريات بتدوم العمر.",
        ],
      },
      {
        title: "أشياء خليها ببالك",
        paragraphs: [
          "السير حقيقي بالصيف، خاصة الويكإند. الأوتوستراد من بيروت للشمال بيكون مكبوس الجمعة بالليل والسبت الصبح. إذا فيك، سافر بنص الأسبوع أو اطلع بكير الصبح. الأسعار بترتفع بالموسم (تموز وآب)، من إيجار السيارات للفنادق للمطاعم. الحجز بكير بيعطيك أسعار أحسن وخيارات سيارات أكتر. وما تستهون بالشمس. اشرب مي، حط واقي شمس، واستغل الضل بأحر ساعات اليوم (2 لـ 5 بعد الضهر).",
        ],
      },
    ],
  },
};

function SummerGuideInner() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang") as Lang | null;
  const initialLang: Lang = langParam && ["en", "fr", "ar"].includes(langParam) ? langParam : "en";

  const [lang, setLang] = React.useState<Lang>(initialLang);
  const t = T[lang];
  const isRtl = lang === "ar";

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
      {/* Language Switcher */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2 sm:px-6">
          <Breadcrumb items={[{ label: t.home, href: "/" }, { label: t.guide, href: `/seasonal-guide?lang=${lang}` }, { label: t.season }]} />
          <div className="flex items-center gap-1">
            {([["en", "EN"], ["fr", "FR"], ["ar", "عربي"]] as [Lang, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setLang(key)}
                className={
                  "rounded-full px-3 py-1 text-[11px] font-bold transition-all " +
                  (lang === key ? "bg-navy text-white" : "text-gray-400 hover:text-gray-700")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <img src="/season-summer.jpg" alt={t.season} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-serif text-4xl font-black text-white sm:text-6xl">
              {t.season}
            </h1>
            <p className="mt-3 text-lg text-white/70">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Blog content */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="prose prose-lg prose-gray max-w-none">
          {t.sections.map((section, si) => (
            <div key={si}>
              {si === 0 ? (
                section.paragraphs.map((p, pi) => (
                  <p key={pi} className="text-xl leading-relaxed text-gray-600">{p}</p>
                ))
              ) : (
                <>
                  <h2 className="mt-10 font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
                    {section.title}
                  </h2>
                  {section.paragraphs.map((p, pi) => (
                    <p key={pi} className="mt-4 text-gray-600 leading-relaxed">{p}</p>
                  ))}
                </>
              )}
            </div>
          ))}

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-amber-50 border border-amber-200 p-8 text-center">
            <p className="font-serif text-2xl font-bold text-gray-900">{t.ctaTitle}</p>
            <p className="mt-2 text-gray-500">{t.ctaSub}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/cars?category=Convertible" className="rounded-lg bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white hover:bg-navy/90">
                {t.ctaBtn}
              </Link>
              <Link href={`/seasonal-guide?lang=${lang}`} className="rounded-lg border border-amber-200 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-amber-700 hover:bg-amber-100">
                {t.backToGuide}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function SummerGuidePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-navy" /></div>}>
      <SummerGuideInner />
    </Suspense>
  );
}
