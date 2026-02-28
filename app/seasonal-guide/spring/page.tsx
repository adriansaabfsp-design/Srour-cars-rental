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
    home: "Home", guide: "Seasonal Guide", season: "Spring",
    subtitle: "March to May",
    backToGuide: "← Back to Guide",
    ctaTitle: "Ready for a Spring Road Trip?",
    ctaSub: "Browse our full collection and find the car that fits your style.",
    ctaBtn: "Browse All Cars",
    sections: [
      {
        title: "",
        paragraphs: [
          "Ask any Lebanese person when the best time to visit is, and most will say spring without hesitation. There's a reason for that. From March through May, this entire country transforms into something that feels almost unreal. Green valleys, wildflowers on every mountainside, perfect temperatures, and a kind of energy in the air that just makes you want to explore.",
        ],
      },
      {
        title: "What the Weather is Actually Like",
        paragraphs: [
          "March can still be a bit rainy, especially in the first half. Think of it as the tail end of winter saying goodbye. But by mid March, the sun starts winning. April is when things really come alive. Temperatures are in the low to mid 20s on the coast, and around 15 to 18°C in the mountains. May is pure perfection. Warm but not hot, with long sunny days and the kind of light that makes everything look like a painting.",
          "What makes spring extra special is that you can still see snow on the highest peaks while wildflowers are blooming in the valleys below. It's this incredible contrast that you really can't find many places in the world.",
        ],
      },
      {
        title: "Where to Go",
        paragraphs: [
          "The Chouf Cedar Reserve is absolutely spectacular in spring. The hiking trails weave through ancient cedar forests and wildflower meadows. It's peaceful, it's stunning, and it's one of those experiences you'll keep thinking about long after you leave. Pack a picnic and spend the whole day.",
          "Qadisha Valley is a UNESCO World Heritage site and one of the most beautiful valleys you'll ever see. In spring, the waterfalls are flowing strong from the snowmelt, the terraced orchards are in bloom, and the whole place feels like stepping back in time. Seriously special.",
          "Byblos (Jbeil) is lovely year round, but spring gives it a particular charm. The old harbor, the crusader castle, the little alleyways. With perfect weather, you can spend hours just wandering and stopping at cafés without it being too hot or too crowded.",
          "Jeita Grotto reopens fully in spring and it's genuinely one of the most incredible natural wonders in the world. The underground river and the stalactite formations are mind blowing. If you haven't been, put it at the top of your list.",
          "Tannourine has a stunning sinkhole (the Baatara Gorge) where spring waterfalls cascade through a natural rock bridge. It's one of those Instagram spots that actually looks even better in person.",
        ],
      },
      {
        title: "The Best Car for Spring",
        paragraphs: [
          "Here's the beautiful thing about spring: any car works. The roads are clear, the weather is cooperative, and you don't need to worry about snow or extreme heat. A comfortable sedan is perfect for couples who want to cruise the coast and visit historical sites. If you're planning mountain hikes, a crossover or compact SUV gives you a bit more flexibility for those rural roads.",
          "Honestly, spring is the season where we tell people to just pick whatever car makes them happy. Convertible? Go for it. Economy hatchback? You'll have a blast. Luxury sedan? Treat yourself. The driving conditions are so good that the car is really just about your personal comfort and style.",
        ],
      },
      {
        title: "Why Spring is Special",
        paragraphs: [
          "Beyond the weather, spring is when Lebanon comes alive culturally. Easter is a big deal here, and whether you're religious or not, the celebrations, the festive atmosphere, and the special foods are worth experiencing. Independence Day events, flower festivals in the mountain towns, and the general sense of renewal after winter. It all adds up to this joyful energy.",
          "The locals are in great spirits too. Everyone's out and about, restaurants open their terraces, and there's this collective exhale after the quiet winter months. It's a great time to connect with people and get those genuine local recommendations.",
        ],
      },
      {
        title: "Things to Keep in Mind",
        paragraphs: [
          "Early March can still be rainy, so if you're visiting then, have a flexible itinerary. Easter week (which moves each year) can get busy at popular spots, so book accommodation early if that's when you're coming. Weekend traffic heading to the mountains is real, so try to leave Beirut early on Saturday mornings or go on weekdays instead. But honestly, these are minor things. Spring in Lebanon is about as close to perfect as it gets.",
        ],
      },
    ],
  },
  fr: {
    home: "Accueil", guide: "Guide saisonnier", season: "Printemps",
    subtitle: "Mars à Mai",
    backToGuide: "← Retour au guide",
    ctaTitle: "Prêt pour un road trip printanier ?",
    ctaSub: "Parcourez notre collection complète et trouvez la voiture qui vous correspond.",
    ctaBtn: "Voir toutes les voitures",
    sections: [
      {
        title: "",
        paragraphs: [
          "Demandez à n'importe quel Libanais quel est le meilleur moment pour visiter, et la plupart diront le printemps sans hésitation. Il y a une raison à ça. De mars à mai, tout le pays se transforme en quelque chose qui semble presque irréel. Des vallées vertes, des fleurs sauvages sur chaque flanc de montagne, des températures parfaites, et une sorte d'énergie dans l'air qui donne simplement envie d'explorer.",
        ],
      },
      {
        title: "Le temps qu'il fait vraiment",
        paragraphs: [
          "Mars peut encore être un peu pluvieux, surtout dans la première moitié. Pensez-y comme la fin de l'hiver qui dit au revoir. Mais vers mi-mars, le soleil commence à gagner. Avril est quand les choses prennent vraiment vie. Les températures sont dans les 20 bas à moyens sur la côte, et autour de 15 à 18°C en montagne. Mai est la perfection pure. Chaud mais pas trop, avec de longues journées ensoleillées et une lumière qui fait ressembler tout à un tableau.",
          "Ce qui rend le printemps encore plus spécial, c'est que vous pouvez encore voir de la neige sur les plus hauts sommets pendant que les fleurs sauvages éclosent dans les vallées en contrebas. C'est un contraste incroyable que vous ne trouverez pas dans beaucoup d'endroits au monde.",
        ],
      },
      {
        title: "Où aller",
        paragraphs: [
          "La Réserve des Cèdres du Chouf est absolument spectaculaire au printemps. Les sentiers de randonnée traversent des forêts de cèdres antiques et des prairies de fleurs sauvages. C'est paisible, c'est magnifique, et c'est une de ces expériences à laquelle vous penserez longtemps après votre départ. Emportez un pique-nique et passez-y la journée.",
          "La vallée de la Qadisha est un site du patrimoine mondial de l'UNESCO et l'une des plus belles vallées que vous verrez jamais. Au printemps, les cascades coulent fort grâce à la fonte des neiges, les vergers en terrasses sont en fleurs, et tout l'endroit donne l'impression de remonter dans le temps. Vraiment spécial.",
          "Byblos (Jbeil) est charmante toute l'année, mais le printemps lui donne un charme particulier. Le vieux port, le château des croisés, les petites ruelles. Avec un temps parfait, vous pouvez passer des heures à flâner et à vous arrêter dans des cafés sans qu'il fasse trop chaud ou trop bondé.",
          "La grotte de Jeita rouvre pleinement au printemps et c'est véritablement l'une des merveilles naturelles les plus incroyables au monde. La rivière souterraine et les formations de stalactites sont époustouflantes. Si vous n'y êtes pas allé, mettez-la en tête de votre liste.",
          "Tannourine possède un gouffre impressionnant (les gorges de Baatara) où des cascades printanières s'écoulent à travers un pont rocheux naturel. C'est un de ces spots Instagram qui est en fait encore plus beau en vrai.",
        ],
      },
      {
        title: "La meilleure voiture pour le printemps",
        paragraphs: [
          "Voici la belle chose avec le printemps : n'importe quelle voiture convient. Les routes sont dégagées, la météo coopère, et vous n'avez pas à vous soucier de la neige ou de la chaleur extrême. Une berline confortable est parfaite pour les couples qui veulent longer la côte et visiter les sites historiques. Si vous prévoyez des randonnées en montagne, un crossover ou SUV compact vous donne un peu plus de flexibilité sur les routes rurales.",
          "Honnêtement, le printemps est la saison où on dit aux gens de choisir la voiture qui les rend heureux. Cabriolet ? Foncez. Citadine économique ? Vous allez adorer. Berline de luxe ? Faites-vous plaisir. Les conditions de conduite sont tellement bonnes que la voiture dépend vraiment de votre confort et style personnel.",
        ],
      },
      {
        title: "Pourquoi le printemps est spécial",
        paragraphs: [
          "Au-delà de la météo, le printemps est le moment où le Liban s'anime culturellement. Pâques est un grand événement ici, et que vous soyez religieux ou non, les célébrations, l'atmosphère festive, et les plats spéciaux valent le détour. Les événements du Jour de l'Indépendance, les festivals de fleurs dans les villages de montagne, et ce sentiment général de renouveau après l'hiver. Tout cela crée une énergie joyeuse.",
          "Les habitants sont de bonne humeur aussi. Tout le monde sort, les restaurants ouvrent leurs terrasses, et il y a ce soupir collectif de soulagement après les mois calmes de l'hiver. C'est un excellent moment pour se connecter avec les gens et obtenir de vraies recommandations locales.",
        ],
      },
      {
        title: "À garder en tête",
        paragraphs: [
          "Début mars peut encore être pluvieux, donc si vous visitez à ce moment, ayez un itinéraire flexible. La semaine de Pâques (qui change chaque année) peut être chargée dans les endroits populaires, donc réservez tôt si c'est votre période. Le trafic du weekend en direction des montagnes est réel, essayez de quitter Beyrouth tôt le samedi matin ou allez-y en semaine. Mais honnêtement, ce sont des détails mineurs. Le printemps au Liban est aussi proche de la perfection que possible.",
        ],
      },
    ],
  },
  ar: {
    home: "الرئيسية", guide: "دليل المواسم", season: "الربيع",
    subtitle: "آذار إلى أيار",
    backToGuide: "← الرجوع للدليل",
    ctaTitle: "جاهز لرحلة ربيعية؟",
    ctaSub: "تصفح مجموعتنا الكاملة ولاقي السيارة يلي بتناسب ذوقك.",
    ctaBtn: "تصفح كل السيارات",
    sections: [
      {
        title: "",
        paragraphs: [
          "اسأل أي لبناني عن أحسن وقت للزيارة، وأغلبهم رح يقولولك الربيع بدون تردد. في سبب لهالشي. من آذار لأيار، البلد كلو بيتحول لشي بيحسسك إنو مش حقيقي. وديان خضرا، ورود برية على كل جبل، حرارة مثالية، وطاقة بالهوا بتخليك تحب تستكشف.",
        ],
      },
      {
        title: "الطقس شو بيكون فعلياً",
        paragraphs: [
          "آذار ممكن يكون شوي ماطر، خاصة أول نصو. فكر فيه كنهاية الشتاء عم بيودع. بس من نص آذار، الشمس بتبلش تربح. نيسان هو لما الأمور فعلاً بتنبض بالحياة. الحرارة بالـ 20 المنخفض لالمتوسط على الساحل، وحوالي 15 لـ 18 درجة بالجبل. أيار هو الكمال بحد ذاتو. دافي بس مش حر، مع أيام شمسية طويلة وضو بيخلي كل شي يبان متل لوحة.",
          "يلي بيخلي الربيع أكتر تميزاً إنك لسا فيك تشوف تلج على أعلى القمم بينما الورود البرية عم تتفتح بالوديان تحت. هيدا تباين ما رح تلاقيه بكتير أماكن بالعالم.",
        ],
      },
      {
        title: "لوين تروح",
        paragraphs: [
          "محمية أرز الشوف رائعة بشكل مذهل بالربيع. مسارات المشي بتمر بين غابات أرز قديمة ومروج ورود برية. هادية، ساحرة، ومن هديك التجارب يلي بتضل تفكر فيها كتير بعد ما تروح. خد معك بيكنيك وقضي كل النهار.",
          "وادي قاديشا موقع تراث عالمي لليونيسكو ومن أحلى الوديان يلي رح تشوفها بحياتك. بالربيع، الشلالات قوية من ذوبان التلج، البساتين المدرجة عم تتفتح، وكل المكان بيحسسك إنك رجعت بالزمن. فعلاً مميز.",
          "جبيل حلوة كل السنة، بس الربيع بيعطيها سحر خاص. المرفأ القديم، قلعة الصليبيين، الأزقة الصغيرة. مع طقس مثالي، فيك تقضي ساعات تتمشى وتوقف بمقاهي بدون ما يكون حر كتير أو زحمة كتير.",
          "مغارة جعيتا بتفتح بالكامل بالربيع وهي فعلاً من أكتر عجائب الطبيعة بالعالم. النهر تحت الأرض وتشكيلات الصواعد مذهلة. إذا ما رحت، حطها أول القائمة.",
          "تنورين فيها حفرة رائعة (شلال بعطارة) وين شلالات الربيع بتنزل عبر جسر صخري طبيعي. من هديك الأماكن يلي عالإنستغرام يلي فعلاً بتكون أحلى بالحقيقة.",
        ],
      },
      {
        title: "أفضل سيارة للربيع",
        paragraphs: [
          "هيدا الشي الحلو بالربيع: أي سيارة بتمشي. الطرقات نظيفة، الطقس متعاون، وما بدك تقلق من تلج أو حر شديد. سيدان مريحة مثالية للأزواج يلي بدهم يتنقلوا على الساحل ويزوروا المواقع التاريخية. إذا ناوي تمشي بالجبل، كروس أوفر أو SUV مدمج بيعطيك مرونة أكتر على الطرقات الريفية.",
          "بصراحة، الربيع هو الموسم يلي منقول فيه للناس اختاروا السيارة يلي بتفرحكم. كشف؟ روحوا فيها. اقتصادية؟ رح تنبسطوا. سيدان فخمة؟ دللوا حالكم. أحوال القيادة هلقد منيحة إنو السيارة فعلاً بتعتمد على راحتكم وذوقكم الشخصي.",
        ],
      },
      {
        title: "ليش الربيع مميز",
        paragraphs: [
          "بعيداً عن الطقس، الربيع هو لما لبنان بينبض بالحياة ثقافياً. عيد الفصح شي كبير هون، وسواء كنت متدين أو لا، الاحتفالات والجو العيدي والأكل الخاص يستاهلوا التجربة. فعاليات عيد الاستقلال، مهرجانات الورود بالقرى الجبلية، والإحساس العام بالتجدد بعد الشتاء. كلو بيخلق طاقة مبهجة.",
          "الناس المحليين كمان بمزاج حلو. الكل طالع ومتنقل، المطاعم فاتحة تراساتها، وفي هالزفير الجماعي بعد شهور الشتاء الهادية. وقت ممتاز تتواصل مع الناس وتاخد نصائح محلية حقيقية.",
        ],
      },
      {
        title: "أشياء خليها ببالك",
        paragraphs: [
          "أول آذار ممكن يكون ماطر، فإذا عم تزور بهالوقت خلي برنامجك مرن. أسبوع الفصح (يلي بيتغير كل سنة) ممكن يكون مزدحم بالأماكن الشعبية، فاحجز بكير إذا هيدا وقت زيارتك. سير الويكإند عالجبل حقيقي، فحاول تطلع من بيروت بكير السبت الصبح أو روح أيام الأسبوع. بس بصراحة، هيدي أشياء صغيرة. الربيع بلبنان أقرب شي للكمال.",
        ],
      },
    ],
  },
};

function SpringGuideInner() {
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
        <img src="/season-spring.jpg" alt={t.season} className="h-full w-full object-cover" />
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
          <div className="mt-12 rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
            <p className="font-serif text-2xl font-bold text-gray-900">{t.ctaTitle}</p>
            <p className="mt-2 text-gray-500">{t.ctaSub}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/cars" className="rounded-lg bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white hover:bg-navy/90">
                {t.ctaBtn}
              </Link>
              <Link href={`/seasonal-guide?lang=${lang}`} className="rounded-lg border border-emerald-200 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-emerald-700 hover:bg-emerald-100">
                {t.backToGuide}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function SpringGuidePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-navy" /></div>}>
      <SpringGuideInner />
    </Suspense>
  );
}
