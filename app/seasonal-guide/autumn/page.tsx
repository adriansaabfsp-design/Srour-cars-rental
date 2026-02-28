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
    home: "Home", guide: "Seasonal Guide", season: "Autumn",
    subtitle: "September to November",
    backToGuide: "← Back to Guide",
    ctaTitle: "Ready to Explore Lebanon This Autumn?",
    ctaSub: "Find a comfortable car for the perfect autumn road trip through wine country and history.",
    ctaBtn: "Browse Sedans",
    sections: [
      {
        title: "",
        paragraphs: [
          "If Lebanon has a best kept secret, it's autumn. While everyone raves about summer beaches and winter skiing, the people who really know this country will tell you that September through November might just be the most magical time to visit. The summer crowds have gone home, the air gets that beautiful golden quality, and the entire Bekaa Valley comes alive with harvest season. It's quieter, it's warmer than you'd expect, and it's incredibly rewarding.",
        ],
      },
      {
        title: "What the Weather is Actually Like",
        paragraphs: [
          "September still feels like summer in many ways. The coast is warm (around 28 to 30°C), the sea is at its warmest for swimming, and everything is still open. But the energy starts to soften. The frantic pace of July and August gives way to something more relaxed and enjoyable.",
          "October is when the real autumn magic kicks in. Temperatures drop to a perfect 22 to 26°C on the coast and 15 to 20°C in the mountains. The light changes too. Everything gets this warm golden glow that photographers absolutely love. It's genuinely one of the most beautiful times to see Lebanon.",
          "November starts to feel like autumn for real. Some rain returns (especially later in the month), temperatures cool further, and you'll start wanting a light jacket for evening walks. But the countryside is still green and the days are mostly sunny and pleasant.",
        ],
      },
      {
        title: "Where to Go",
        paragraphs: [
          "Baalbek is an absolute must in autumn. The Temple of Jupiter and Temple of Bacchus are among the most impressive Roman ruins anywhere in the world. In summer, the heat makes it hard to fully enjoy the site. But in October? The temperature is perfect, the crowds are thin, and you can take your time exploring every corner. The light at sunset here is unreal.",
          "The Bekaa Valley Wineries are at their most exciting during harvest season. Lebanon has been making wine for over 5,000 years (yes, really), and autumn is when the grapes are being picked and pressed. Many wineries welcome visitors for tours and tastings. Château Ksara, Château Musar, and Domaine des Tourelles are all incredible. Driving through the vine covered valley with the Anti Lebanon mountains as a backdrop is one of those drives you won't forget.",
          "Deir el Qamar is a beautifully preserved mountain town that feels like stepping into a history book. The stone architecture, the old souk, the palace overlooking the valley. In autumn, the surrounding hills show touches of orange and gold, and the whole place takes on this incredibly romantic quality.",
          "Anjar is Lebanon's only significant Umayyad site, and it's fascinating. The ruins of this 8th century city are set in grassy fields that are still lush in early autumn. It's peaceful, it's uncrowded, and it tells a completely different story from the more famous Roman and Phoenician sites.",
        ],
      },
      {
        title: "The Best Car for Autumn",
        paragraphs: [
          "Autumn is about road trips. Long, leisurely drives through the countryside with stops wherever something catches your eye. A comfortable sedan is perfect for this. Good air conditioning for those still warm September days, a smooth ride for the highways, and easy parking in the old towns.",
          "If you want to explore some of the more rural wine country roads or mountain villages, an SUV gives you extra confidence on rougher surfaces. But honestly, the roads are generally good and any well maintained car will do. The key in autumn is comfort. You're going to be spending a lot of happy hours behind the wheel, exploring at your own pace.",
        ],
      },
      {
        title: "Why Autumn Feels Different",
        paragraphs: [
          "There's something about the pace of life in Lebanon during autumn that feels exactly right. The summer rush is over but winter hasn't shut things down yet. Restaurants are still buzzing but you can get a table. The popular spots are still operating but you don't have to queue. It's like having the best version of Lebanon with the volume turned down just a notch.",
          "The food is incredible in autumn too. Olive pressing begins, fresh grape molasses appears, and the mountain towns start serving their heartiest dishes. Fig season, pomegranate season, all the best Lebanese produce is peaking right now. If you love food (and who doesn't), this is your season.",
        ],
      },
      {
        title: "Things to Keep in Mind",
        paragraphs: [
          "Some beach clubs and summer spots start closing from mid October onward, so if beaches are important to you, come in September. Late November can get rainy, so have backup plans for those days. Daylight hours get shorter (sunset around 5pm by November), so plan your sightseeing to make the most of the golden hours. And bring layers. The mornings and evenings can be cool while midday is still warm.",
        ],
      },
    ],
  },
  fr: {
    home: "Accueil", guide: "Guide saisonnier", season: "Automne",
    subtitle: "Septembre à Novembre",
    backToGuide: "← Retour au guide",
    ctaTitle: "Prêt à explorer le Liban cet automne ?",
    ctaSub: "Trouvez une voiture confortable pour le road trip automnal parfait à travers le pays du vin et de l'histoire.",
    ctaBtn: "Voir les berlines",
    sections: [
      {
        title: "",
        paragraphs: [
          "Si le Liban a un secret bien gardé, c'est l'automne. Alors que tout le monde parle des plages d'été et du ski d'hiver, ceux qui connaissent vraiment ce pays vous diront que septembre à novembre est peut-être la période la plus magique pour visiter. Les foules estivales sont parties, l'air prend cette magnifique qualité dorée, et toute la vallée de la Bekaa s'anime avec la saison des récoltes. C'est plus calme, plus chaud qu'on ne le pense, et incroyablement gratifiant.",
        ],
      },
      {
        title: "Le temps qu'il fait vraiment",
        paragraphs: [
          "Septembre ressemble encore à l'été à bien des égards. La côte est chaude (autour de 28 à 30°C), la mer est à sa température la plus chaude pour nager, et tout est encore ouvert. Mais l'énergie commence à s'adoucir. Le rythme frénétique de juillet et août laisse place à quelque chose de plus détendu et agréable.",
          "Octobre est quand la vraie magie automnale commence. Les températures baissent à un parfait 22 à 26°C sur la côte et 15 à 20°C en montagne. La lumière change aussi. Tout prend cette lueur dorée et chaleureuse que les photographes adorent absolument. C'est véritablement l'un des plus beaux moments pour voir le Liban.",
          "Novembre commence à sentir vraiment l'automne. Un peu de pluie revient (surtout vers la fin du mois), les températures baissent encore, et vous commencerez à vouloir une veste légère pour les promenades du soir. Mais la campagne est encore verte et les journées sont majoritairement ensoleillées et agréables.",
        ],
      },
      {
        title: "Où aller",
        paragraphs: [
          "Baalbek est un incontournable en automne. Le Temple de Jupiter et le Temple de Bacchus sont parmi les ruines romaines les plus impressionnantes au monde. En été, la chaleur rend difficile d'en profiter pleinement. Mais en octobre ? La température est parfaite, il y a peu de monde, et vous pouvez prendre votre temps pour explorer chaque recoin. La lumière au coucher du soleil ici est irréelle.",
          "Les vignobles de la vallée de la Bekaa sont à leur plus excitant pendant la saison des vendanges. Le Liban produit du vin depuis plus de 5 000 ans (oui, vraiment), et l'automne est quand les raisins sont cueillis et pressés. De nombreux vignobles accueillent les visiteurs pour des visites et des dégustations. Château Ksara, Château Musar et Domaine des Tourelles sont tous incroyables. Conduire à travers la vallée couverte de vignes avec les montagnes de l'Anti-Liban en toile de fond est un de ces trajets que vous n'oublierez pas.",
          "Deir el Qamar est une ville de montagne magnifiquement préservée qui donne l'impression d'entrer dans un livre d'histoire. L'architecture en pierre, le vieux souk, le palais surplombant la vallée. En automne, les collines environnantes montrent des touches d'orange et d'or, et tout l'endroit prend une qualité incroyablement romantique.",
          "Anjar est le seul site omeyyade significatif du Liban, et il est fascinant. Les ruines de cette cité du 8ème siècle sont situées dans des champs herbeux encore luxuriants en début d'automne. C'est paisible, c'est peu fréquenté, et ça raconte une histoire complètement différente des sites romains et phéniciens plus célèbres.",
        ],
      },
      {
        title: "La meilleure voiture pour l'automne",
        paragraphs: [
          "L'automne, c'est les road trips. De longues promenades tranquilles à travers la campagne avec des arrêts partout où quelque chose attire votre attention. Une berline confortable est parfaite pour ça. La climatisation pour les journées encore chaudes de septembre, une conduite douce sur les autoroutes, et un stationnement facile dans les vieilles villes.",
          "Si vous voulez explorer les routes de campagne viticole ou les villages de montagne plus ruraux, un SUV vous donne une confiance supplémentaire sur les surfaces plus rudes. Mais honnêtement, les routes sont généralement bonnes et n'importe quelle voiture bien entretenue fera l'affaire. La clé en automne, c'est le confort. Vous allez passer beaucoup d'heures heureuses au volant, explorant à votre rythme.",
        ],
      },
      {
        title: "Pourquoi l'automne est différent",
        paragraphs: [
          "Il y a quelque chose dans le rythme de vie au Liban en automne qui semble exactement juste. La ruée estivale est terminée mais l'hiver n'a pas encore ralenti les choses. Les restaurants sont encore animés mais vous pouvez avoir une table. Les spots populaires fonctionnent encore mais vous n'avez pas à faire la queue. C'est comme avoir la meilleure version du Liban avec le volume baissé d'un cran.",
          "La nourriture est incroyable en automne aussi. Le pressage des olives commence, de la mélasse de raisin fraîche apparaît, et les villes de montagne commencent à servir leurs plats les plus réconfortants. La saison des figues, la saison des grenades, tous les meilleurs produits libanais sont à leur apogée. Si vous aimez la nourriture (et qui ne l'aime pas), c'est votre saison.",
        ],
      },
      {
        title: "À garder en tête",
        paragraphs: [
          "Certains beach clubs et spots estivaux commencent à fermer à partir de mi-octobre, donc si les plages sont importantes pour vous, venez en septembre. Fin novembre peut être pluvieux, alors ayez des plans B pour ces jours. Les heures de lumière raccourcissent (coucher vers 17h en novembre), alors planifiez vos visites pour profiter au maximum des heures dorées. Et apportez des couches de vêtements. Les matins et les soirées peuvent être frais tandis que le midi est encore chaud.",
        ],
      },
    ],
  },
  ar: {
    home: "الرئيسية", guide: "دليل المواسم", season: "الخريف",
    subtitle: "أيلول إلى تشرين الثاني",
    backToGuide: "← الرجوع للدليل",
    ctaTitle: "جاهز تستكشف لبنان هالخريف؟",
    ctaSub: "لاقي سيارة مريحة لرحلة الخريف المثالية عبر بلد النبيذ والتاريخ.",
    ctaBtn: "تصفح السيدان",
    sections: [
      {
        title: "",
        paragraphs: [
          "إذا لبنان عندو سر محفوظ، فهو الخريف. بينما الكل بيتحمس لشواطئ الصيف وتزلج الشتاء، الناس يلي فعلاً بتعرف هالبلد بتقلك إنو أيلول لتشرين الثاني ممكن يكون أسحر وقت للزيارة. زحمة الصيف راحت، الهوا صار فيه هالنوعية الذهبية الحلوة، وكل البقاع بتنبض بالحياة مع موسم القطاف. أهدى، أدفى مما كنت تتوقع، ومكافئ بشكل ما بينوصف.",
        ],
      },
      {
        title: "الطقس شو بيكون فعلياً",
        paragraphs: [
          "أيلول لسا بيحسسك إنو صيف بأشياء كتيرة. الساحل دافي (حوالي 28 لـ 30 درجة)، البحر بأدفى حالاتو للسباحة، وكل شي لسا فاتح. بس الطاقة بتبلش تهدى. الإيقاع المحموم تبع تموز وآب بيفسح المجال لشي أهدى وأمتع.",
          "تشرين الأول هو لما السحر الخريفي الحقيقي بيبلش. الحرارة بتنزل لمثالية 22 لـ 26 درجة على الساحل و15 لـ 20 درجة بالجبل. الضو كمان بيتغير. كل شي بياخد هالتوهج الذهبي الدافي يلي المصورين بيحبوه كتير. فعلاً من أحلى الأوقات لتشوف لبنان.",
          "تشرين الثاني بيبلش يحسسك بالخريف فعلاً. شوية شتي بترجع (خاصة آخر الشهر)، الحرارة بتنزل أكتر، وبتبلش تحب جاكيت خفيف لتمشيات المسا. بس الريف لسا أخضر والأيام أغلبها مشمسة وحلوة.",
        ],
      },
      {
        title: "لوين تروح",
        paragraphs: [
          "بعلبك لازم تروحلها بالخريف. هيكل جوبيتر وهيكل باخوس من أروع الآثار الرومانية بأي مكان بالعالم. بالصيف، الحر بيصعب عليك تستمتع بالموقع بالكامل. بس بتشرين الأول؟ الحرارة مثالية، الناس قليلة، وفيك تاخد وقتك تستكشف كل زاوية. الضو وقت الغروب هون خيالي.",
          "كروم البقاع بأكتر حالاتها حماساً وقت موسم القطاف. لبنان عم يعمل نبيذ من أكتر من 5,000 سنة (إي فعلاً)، والخريف هو لما العنب عم ينقطف وينعصر. كتير كروم بتستقبل الزوار لجولات وتذوق. شاتو كسارة، شاتو مسعد، ودومين دي توريل كلهم رائعين. تسوق بالوادي المكسي بالكروم مع جبال لبنان الشرقية خلفية هي من هديك المشاوير يلي ما بتنتنساها.",
          "دير القمر بلدة جبلية محفوظة بشكل رائع بتحسسك إنك عم تفتح كتاب تاريخ. العمارة الحجرية، السوق القديم، القصر المطل على الوادي. بالخريف، التلال المحيطة بتبين لمسات من البرتقالي والذهبي، وكل المكان بياخد هالنوعية الرومانسية بشكل ما بيتوصف.",
          "عنجر هو الموقع الأموي الوحيد المهم بلبنان، ورائع. آثار هالمدينة من القرن الثامن موجودة بحقول عشبية لسا خضرا بأول الخريف. هادي، ما فيها زحمة، وبتحكي قصة مختلفة بالكامل عن المواقع الرومانية والفينيقية الأشهر.",
        ],
      },
      {
        title: "أفضل سيارة للخريف",
        paragraphs: [
          "الخريف عن رحلات السيارة. مشاوير طويلة مسترخية عبر الريف مع وقفات كل ما شي يلفت نظرك. سيدان مريحة مثالية لهالشي. تكييف منيح للأيام يلي لسا دافية بأيلول، قيادة ناعمة على الأوتوستراد، ووقوف سهل بالبلدات القديمة.",
          "إذا بدك تستكشف بعض طرقات الريف بمنطقة الكروم أو قرى الجبل، SUV بيعطيك ثقة إضافية على السطوح الأخشن. بس بصراحة، الطرقات بشكل عام منيحة وأي سيارة معتنى فيها بتمشي. المفتاح بالخريف هو الراحة. رح تقضي ساعات كتير سعيدة ورا المقود، عم تستكشف على مهلك.",
        ],
      },
      {
        title: "ليش الخريف بيحسسك بفرق",
        paragraphs: [
          "في شي بإيقاع الحياة بلبنان بالخريف بيحسسك إنو تمام هيك. زحمة الصيف خلصت بس الشتاء لسا ما وقف الأمور. المطاعم لسا نابضة بالحياة بس فيك تلاقي طاولة. الأماكن الشعبية لسا شغالة بس ما بدك تصطف. كأنك عم تعيش أحسن نسخة من لبنان مع الصوت مخفض شوي.",
          "الأكل رهيب بالخريف كمان. عصر الزيتون بيبلش، دبس العنب الطازج بيطلع، والبلدات الجبلية بتبلش تقدم أثقل وأطيب أكلاتها. موسم التين، موسم الرمان، أحسن المنتجات اللبنانية بأوجها هلق. إذا بتحب الأكل (ومين ما بيحبو)، هيدا موسمك.",
        ],
      },
      {
        title: "أشياء خليها ببالك",
        paragraphs: [
          "بعض نوادي البحر والأماكن الصيفية بتبلش تسكر من نص تشرين الأول وبعد، فإذا الشواطئ مهمة إلك، تعال بأيلول. آخر تشرين الثاني ممكن يكون ماطر، فخلي عندك خطط بديلة لهالأيام. ساعات النهار بتقصر (الغروب حوالي الخامسة بتشرين الثاني)، فخطط جولاتك لتستفيد من الساعات الذهبية. وخد طبقات ملابس. الصبحيات والمسائيات ممكن تكون باردة بينما الضهر لسا دافي.",
        ],
      },
    ],
  },
};

function AutumnGuideInner() {
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
        <img src="/season-autumn.jpg" alt={t.season} className="h-full w-full object-cover" />
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
          <div className="mt-12 rounded-2xl bg-orange-50 border border-orange-200 p-8 text-center">
            <p className="font-serif text-2xl font-bold text-gray-900">{t.ctaTitle}</p>
            <p className="mt-2 text-gray-500">{t.ctaSub}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/cars?category=Sedan" className="rounded-lg bg-navy px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white hover:bg-navy/90">
                {t.ctaBtn}
              </Link>
              <Link href={`/seasonal-guide?lang=${lang}`} className="rounded-lg border border-orange-200 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] text-orange-700 hover:bg-orange-100">
                {t.backToGuide}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function AutumnGuidePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-navy" /></div>}>
      <AutumnGuideInner />
    </Suspense>
  );
}
