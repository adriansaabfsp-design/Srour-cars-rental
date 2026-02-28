"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

type Lang = "en" | "fr" | "ar";

const T: Record<Lang, {
  home: string; guide: string; season: string; subtitle: string;
  switchLabel: string; backToGuide: string; ctaTitle: string; ctaSub: string; ctaBtn: string;
  sections: { title: string; paragraphs: string[] }[];
}> = {
  en: {
    home: "Home", guide: "Seasonal Guide", season: "Winter",
    subtitle: "December to February",
    switchLabel: "Language",
    backToGuide: "← Back to Guide",
    ctaTitle: "Ready for a Winter Adventure?",
    ctaSub: "Browse our fleet and find the perfect SUV for your mountain escape.",
    ctaBtn: "Browse SUVs",
    sections: [
      {
        title: "",
        paragraphs: [
          "If you think Lebanon is just a summer destination, you're in for a surprise. Winter here is something else entirely. Picture this: you're driving up a mountain road, the cedar trees are dusted with fresh snow, and within an hour of leaving the mild coast, you're in a full on winter wonderland. That's Lebanon for you.",
        ],
      },
      {
        title: "What the Weather is Actually Like",
        paragraphs: [
          "The coast around Beirut stays surprisingly mild through winter. You can still walk around in a light jacket on most days, with temperatures hovering around 12 to 17°C. But head up into the mountains and it's a completely different world. Faraya, Laklouk, and the Cedars get proper snowfall from December through March. We're talking meters of snow, not just a dusting. The Bekaa Valley gets cold too, with frost in the mornings and crisp clear days that are perfect for exploring ancient ruins without the summer crowds.",
        ],
      },
      {
        title: "Where to Go",
        paragraphs: [
          "Faraya and Mzaar are the go to spots for skiing and snowboarding. The resort is modern, well maintained, and way more affordable than European alternatives. After a day on the slopes, the restaurants and chalets nearby have this cozy mountain vibe that's hard to beat.",
          "The Cedars (Arz el Rab) up near Bcharre is where it gets really magical. These are some of the oldest trees on Earth, and seeing them covered in snow feels almost sacred. The town of Bcharre itself is charming, with stone houses and incredible views of the Qadisha Valley below.",
          "Laklouk is the more laid back option. Less crowded than Faraya, equally beautiful, and perfect if you want a quieter mountain experience. There are some great family run guesthouses up there that serve incredible Lebanese mountain food.",
          "And here's the thing most people don't realize: you can ski in the morning and have lunch by the sea in Beirut the same day. That's not a marketing gimmick, that's actually what people do here.",
        ],
      },
      {
        title: "The Best Car for Winter",
        paragraphs: [
          "This is the one season where your car choice really matters. If you're heading to the mountains (and you should), you need an SUV or a 4x4. Mountain roads get icy, snow can pile up fast, and chains are sometimes required. A front wheel drive sedan will struggle on the steeper roads, and honestly it's not worth the stress.",
          "We recommend a compact SUV like a Tucson or RAV4 for couples, or a larger 4x4 for families. All our winter vehicles come with good tires, and we'll walk you through the road conditions before you head out. If you're staying on the coast the whole time, a regular sedan is fine. But trust us, once you see those mountains, you'll want to go up.",
        ],
      },
      {
        title: "Good Things About Winter",
        paragraphs: [
          "The biggest win is the lack of crowds. Popular spots like Baalbek and Byblos that are packed in summer feel completely different in winter. You can actually take your time, sit in a café, and enjoy the place without fighting for space. Rental prices are also lower, hotels give better deals, and the locals have more time to chat and share their favorite spots with you.",
          "The mountain lodge culture is something special too. Imagine sitting by a fireplace after a day of skiing, eating fresh kibbeh and drinking arak, while snow falls outside the window. It doesn't get much better than that.",
        ],
      },
      {
        title: "Things to Keep in Mind",
        paragraphs: [
          "Mountain roads can close during heavy snowfall, so always check conditions before heading out. Daylight hours are shorter (it gets dark around 5pm), so plan your drives accordingly. And while the coast is mild, it does rain, so pack a waterproof layer. But honestly? A little rain just makes the coffee taste better.",
        ],
      },
    ],
  },
  fr: {
    home: "Accueil", guide: "Guide saisonnier", season: "Hiver",
    subtitle: "Décembre à Février",
    switchLabel: "Langue",
    backToGuide: "← Retour au guide",
    ctaTitle: "Prêt pour une aventure hivernale ?",
    ctaSub: "Parcourez notre flotte et trouvez le SUV idéal pour votre escapade en montagne.",
    ctaBtn: "Voir les SUV",
    sections: [
      {
        title: "",
        paragraphs: [
          "Si vous pensez que le Liban n'est qu'une destination estivale, vous allez être surpris. L'hiver ici, c'est tout autre chose. Imaginez : vous roulez sur une route de montagne, les cèdres sont saupoudrés de neige fraîche, et en une heure après avoir quitté la côte douce, vous êtes dans un monde enchanté. C'est ça, le Liban.",
        ],
      },
      {
        title: "Le temps qu'il fait vraiment",
        paragraphs: [
          "La côte autour de Beyrouth reste étonnamment douce en hiver. Vous pouvez vous promener en veste légère la plupart du temps, avec des températures autour de 12 à 17°C. Mais montez dans les montagnes et c'est un monde complètement différent. Faraya, Laklouk et les Cèdres reçoivent de vraies chutes de neige de décembre à mars. On parle de mètres de neige, pas juste un petit saupoudrage. La vallée de la Bekaa se refroidit aussi, avec du gel le matin et des journées claires et fraîches, parfaites pour explorer les ruines antiques sans les foules estivales.",
        ],
      },
      {
        title: "Où aller",
        paragraphs: [
          "Faraya et Mzaar sont les destinations incontournables pour le ski et le snowboard. La station est moderne, bien entretenue, et beaucoup plus abordable que les alternatives européennes. Après une journée sur les pistes, les restaurants et chalets à proximité ont cette ambiance montagnarde chaleureuse qui est difficile à battre.",
          "Les Cèdres (Arz el Rab) près de Bcharré, c'est là que ça devient vraiment magique. Ce sont certains des plus vieux arbres de la Terre, et les voir couverts de neige donne un sentiment presque sacré. La ville de Bcharré elle-même est charmante, avec ses maisons en pierre et des vues incroyables sur la vallée de la Qadisha en contrebas.",
          "Laklouk est l'option plus décontractée. Moins bondée que Faraya, tout aussi belle, et parfaite si vous voulez une expérience montagnarde plus tranquille. Il y a de super maisons d'hôtes familiales là-haut qui servent une cuisine libanaise de montagne incroyable.",
          "Et voilà ce que la plupart des gens ne réalisent pas : vous pouvez skier le matin et déjeuner au bord de la mer à Beyrouth le même jour. Ce n'est pas un argument marketing, c'est vraiment ce que les gens font ici.",
        ],
      },
      {
        title: "La meilleure voiture pour l'hiver",
        paragraphs: [
          "C'est la seule saison où le choix de votre voiture compte vraiment. Si vous allez en montagne (et vous devriez), vous avez besoin d'un SUV ou d'un 4x4. Les routes de montagne deviennent verglacées, la neige peut s'accumuler vite, et les chaînes sont parfois nécessaires. Une berline à traction avant aura du mal sur les routes les plus raides, et honnêtement ça ne vaut pas le stress.",
          "Nous recommandons un SUV compact comme un Tucson ou RAV4 pour les couples, ou un 4x4 plus grand pour les familles. Tous nos véhicules d'hiver sont équipés de bons pneus, et nous vous informerons des conditions routières avant votre départ. Si vous restez sur la côte tout le temps, une berline classique convient. Mais croyez-nous, une fois que vous verrez ces montagnes, vous voudrez y monter.",
        ],
      },
      {
        title: "Les bons côtés de l'hiver",
        paragraphs: [
          "Le plus grand avantage, c'est l'absence de foules. Les endroits populaires comme Baalbek et Byblos, bondés en été, ont une atmosphère complètement différente en hiver. Vous pouvez vraiment prendre votre temps, vous asseoir dans un café, et profiter du lieu sans vous battre pour une place. Les prix de location sont aussi plus bas, les hôtels proposent de meilleures offres, et les locaux ont plus de temps pour discuter et partager leurs endroits préférés avec vous.",
          "La culture des lodges de montagne est quelque chose de spécial aussi. Imaginez être assis près d'une cheminée après une journée de ski, manger du kibbeh frais et boire de l'arak, tandis que la neige tombe dehors. Difficile de faire mieux.",
        ],
      },
      {
        title: "À garder en tête",
        paragraphs: [
          "Les routes de montagne peuvent fermer pendant les fortes chutes de neige, donc vérifiez toujours les conditions avant de partir. Les heures de lumière sont plus courtes (il fait noir vers 17h), alors planifiez vos trajets en conséquence. Et bien que la côte soit douce, il pleut, alors prenez une couche imperméable. Mais honnêtement ? Un peu de pluie rend juste le café meilleur.",
        ],
      },
    ],
  },
  ar: {
    home: "الرئيسية", guide: "دليل المواسم", season: "الشتاء",
    subtitle: "كانون الأول إلى شباط",
    switchLabel: "اللغة",
    backToGuide: "← الرجوع للدليل",
    ctaTitle: "جاهز لمغامرة شتوية؟",
    ctaSub: "تصفح أسطولنا ولاقي الـ SUV المثالي لرحلتك الجبلية.",
    ctaBtn: "تصفح الـ SUV",
    sections: [
      {
        title: "",
        paragraphs: [
          "إذا كنت تعتقد إنو لبنان بس وجهة صيفية، رح تنفاجأ. الشتاء هون شي تاني بالكامل. تخيل: عم تسوق على طريق جبلي، أشجار الأرز مغبرة بالتلج الطازج، وبساعة وحدة من الساحل الدافي، صرت بعالم شتوي ساحر. هيدا لبنان.",
        ],
      },
      {
        title: "الطقس شو بيكون فعلياً",
        paragraphs: [
          "الساحل حوالين بيروت بيضل دافي بشكل مفاجئ بالشتاء. فيك تتمشى بجاكيت خفيف أغلب الأيام، مع حرارة حوالي 12 لـ 17 درجة. بس اطلع عالجبل وهي قصة تانية بالكامل. فاريا ولقلوق والأرز بتيجيهم تلوج حقيقية من كانون لآذار. عم نحكي عن أمتار تلج مش بس شوية. البقاع كمان بيبرد، مع صقيع الصبح وأيام صافية ونقية مثالية لاستكشاف الآثار القديمة بدون زحمة الصيف.",
        ],
      },
      {
        title: "لوين تروح",
        paragraphs: [
          "فاريا ومزار هنّي المحطات الأساسية للتزلج والسنوبورد. المنتجع حديث ومعتنى فيه وأرخص بكتير من البدائل الأوروبية. بعد يوم عالمنحدرات، المطاعم والشاليهات القريبة عندهم جو جبلي دافي صعب ينتغلب.",
          "الأرز (أرز الرب) قرب بشري هون بيصير الشي السحري فعلاً. هيدي من أقدم الأشجار عالأرض، وإنك تشوفها مغطية بالتلج بيحسسك بشي مقدس تقريباً. بشري حالها ساحرة، مع بيوت حجرية ومناظر ما بتنوصف على وادي قاديشا تحت.",
          "لقلوق هي الخيار الأهدى. أقل زحمة من فاريا، بنفس الجمال، ومثالية إذا بدك تجربة جبلية أهدى. في بيوت ضيافة عائلية هنيك بتقدم أكل جبل لبناني رهيب.",
          "وهيدا الشي يلي أكتر الناس ما بتعرفو: فيك تتزلج الصبح وتتغدى عالبحر ببيروت بنفس اليوم. مش حيلة تسويقية، هيدا فعلاً يلي الناس بتعملو هون.",
        ],
      },
      {
        title: "أفضل سيارة للشتاء",
        paragraphs: [
          "هيدا الموسم الوحيد يلي اختيار سيارتك فعلاً بيفرق. إذا رايح عالجبل (ولازم تروح)، بتحتاج SUV أو 4x4. طرقات الجبل بتصير جليدية، التلج بيتكوم بسرعة، والسلاسل أحياناً مطلوبة. سيدان بدفع أمامي رح تعاني على الطرقات الحادة، وبصراحة ما بتستاهل التوتر.",
          "منقترح SUV مدمج متل توسان أو RAV4 للأزواج، أو 4x4 أكبر للعائلات. كل سيارات الشتاء عنا بتيجي بدواليب منيحة، ومنخبرك عن أحوال الطريق قبل ما تطلع. إذا ناوي تضل على الساحل طول الوقت، سيدان عادية بتمشي. بس صدقنا، أول ما تشوف الجبال، رح تحب تطلع.",
        ],
      },
      {
        title: "الأشياء الحلوة بالشتاء",
        paragraphs: [
          "أكبر ميزة هي غياب الزحمة. الأماكن الشعبية متل بعلبك وجبيل يلي بتكون مكتظة بالصيف، جوها مختلف بالكامل بالشتاء. فيك فعلاً تاخد وقتك، تقعد بمقهى، وتستمتع بالمكان بدون ما تتنافس على مكان. أسعار الإيجار كمان أقل، الفنادق بتعطي عروض أحسن، والناس المحليين عندهم وقت أكتر يحكوا معك ويشاركوك أماكنهم المفضلة.",
          "ثقافة نزل الجبل كمان شي مميز. تخيل إنك قاعد حد المدفأة بعد يوم تزلج، عم تاكل كبة طازة وتشرب عرق، والتلج عم ينزل برا الشباك. ما في أحسن من هيك.",
        ],
      },
      {
        title: "أشياء خليها ببالك",
        paragraphs: [
          "طرقات الجبل ممكن تسكر وقت التلج الكتير، فدايماً شيك على الأحوال قبل ما تطلع. ساعات النهار أقصر (بيعتم حوالي الخامسة)، فخطط مشاويرك على هالأساس. ومع إنو الساحل دافي، بيشتي، فخد معك شي ما بيبلل. بس بصراحة؟ شوية مطر بتخلي القهوة أطيب.",
        ],
      },
    ],
  },
};

function WinterGuideInner() {
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
        <img src="/season-winter.jpg" alt={t.season} className="h-full w-full object-cover" />
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
          <div className="mt-12 rounded-2xl bg-sky-50 border border-sky-200 p-8 text-center">
            <p className="font-serif text-2xl font-bold text-gray-900">{t.ctaTitle}</p>
            <p className="mt-2 text-gray-500">{t.ctaSub}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/cars?category=SUV" className="rounded-lg bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white hover:bg-navy/90">
                {t.ctaBtn}
              </Link>
              <Link href={`/seasonal-guide?lang=${lang}`} className="rounded-lg border border-sky-200 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-sky-700 hover:bg-sky-100">
                {t.backToGuide}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function WinterGuidePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-navy" /></div>}>
      <WinterGuideInner />
    </Suspense>
  );
}
