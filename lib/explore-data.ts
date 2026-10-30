// Content of bento.me/explore (archived Jan 2025): categories, featured Bentos
// and community Figma files. Images are self-hosted under /public/explore.

export interface ExploreBento {
  href: string;
  image: string;
  description: string;
}

interface ExploreCategory {
  label: string;
  icon: string;
  // bento.me's 'Artists & Illustrators' tab label had no class, so it renders larger.
  plainTitle?: boolean;
  items: ExploreBento[];
}

interface CommunityFile {
  href: string;
  thumbnail: string;
  avatar: string;
  title: string;
  author: string;
}

export const exploreCategories: ExploreCategory[] = [
  {
    label: 'Designers',
    icon: '/explore/icons/category-designers.png',
    items: [
      {
        href: 'https://bento.me/richard',
        image: '/explore/bentos/richard.webp',
        description: 'studying industrial design in kiel',
      },
      {
        href: 'https://bento.me/wacho',
        image: '/explore/bentos/wacho.webp',
        description: 'Staff Product Designer at Meta.',
      },
      {
        href: 'http://bento.me/madewithjello',
        image: '/explore/bentos/madewithjello.webp',
        description: 'Designs for everyone.',
      },
      {
        href: 'https://bento.me/rau',
        image: '/explore/bentos/rau.webp',
        description: '⌨️ Product Designer & Software Engineer 🍁 Canadian',
      },
      {
        href: 'https://bento.me/newtmk',
        image: '/explore/bentos/newtmk.webp',
        description:
          '✦ UIUX Designer. ✦ Illustrator and Video creator. ✦ Based in Tokyo 🇯🇵',
      },
      {
        href: 'https://bento.me/jomie1997',
        image: '/explore/bentos/jomie1997.webp',
        description: '🦋 1997年生まれ 🦋 東京都在住 🦋 UIデザイナー',
      },
      {
        href: 'https://bento.me/doubleglitch',
        image: '/explore/bentos/doubleglitch.webp',
        description:
          'I’m a Ukrainian designer. I create unusual stuff with ordinary tools',
      },
      {
        href: 'https://bento.me/rst',
        image: '/explore/bentos/rst.webp',
        description: 'making beautiful things and helping others do the same.',
      },
      {
        href: 'https://bento.me/mathiaslaurvig',
        image: '/explore/bentos/mathiaslaurvig.webp',
        description:
          '👾 Sr. Product Designer 🌁 San Francisco, CA 🇩🇰 From Copenhagen, Denmark',
      },
      {
        href: 'https://bento.me/saurabh',
        image: '/explore/bentos/saurabh.webp',
        description: '🔎 Product designer @rep3gg 📍Bangalore, India',
      },
      {
        href: 'https://bento.me/miyamoto',
        image: '/explore/bentos/miyamoto.webp',
        description: 'Born in Chiba, Japan in 1986. 📐Art director/designer.',
      },
      {
        href: 'https://bento.me/rxmana',
        image: '/explore/bentos/rxmana.webp',
        description:
          '🖍 Product Designer 🗒 Product Owner 🧩 Design Systems ⚡️ Icons',
      },
      {
        href: 'http://bento.me/rogie',
        image: '/explore/bentos/rogie.webp',
        description: 'Chaos animal. Designer Advocate at Figma.',
      },
      {
        href: 'http://bento.me/dh',
        image: '/explore/bentos/dh.webp',
        description:
          'I’m a designer, writer, and investor. Currently at Webflow.',
      },
      {
        href: 'http://bento.me/storm',
        image: '/explore/bentos/storm.webp',
        description: 'Designer & little big detail hunter',
      },
      {
        href: 'https://bento.me/glenn',
        image: '/explore/bentos/glenn.webp',
        description: 'From sigs and avatars → to brand and product.',
      },
      {
        href: 'http://bento.me/discolu',
        image: '/explore/bentos/discolu.webp',
        description:
          'Designer advocate @Figma, newsletter writer, component person ❖',
      },
      {
        href: 'https://bento.me/marcel',
        image: '/explore/bentos/marcel.webp',
        description: 'A builder of digital products.',
      },
      {
        href: 'https://bento.me/uxderrick',
        image: '/explore/bentos/uxderrick.webp',
        description: 'I read docs in Notion and go play in Figma.',
      },
      {
        href: 'https://bento.me/amani',
        image: '/explore/bentos/amani.webp',
        description: 'Quite Idealistic Creative👨🏾‍💻',
      },
      {
        href: 'https://bento.me/yenlai',
        image: '/explore/bentos/yenlai.webp',
        description:
          'UX Designer. I live in the future and build what seems interesting.',
      },
      {
        href: 'https://bento.me/beasty',
        image: '/explore/bentos/beasty.webp',
        description: 'Product Designer 🌈 Creative director 🍑 Design Advisor',
      },
      {
        href: 'https://bento.me/joyceromero',
        image: '/explore/bentos/joyceromero.webp',
        description:
          'A graphic designer dabbling in photography, illustration and motion design.',
      },
      {
        href: 'https://bento.me/shivkehr',
        image: '/explore/bentos/shivkehr.webp',
        description: '🔎 Interaction Designer at Google',
      },
      {
        href: 'https://bento.me/bunin',
        image: '/explore/bentos/bunin.webp',
        description:
          'Designer, author of Frames X — UI system & ebook to help you design better.',
      },
      {
        href: 'http://bento.me/elenamolinariii',
        image: '/explore/bentos/elenamolinariii.webp',
        description:
          'Product designer by day, self-taught doodler and DIY lover by night.',
      },
    ],
  },
  {
    label: 'Content Creators',
    icon: '/explore/icons/category-contentcreator.png',
    items: [
      {
        href: 'http://bento.me/justinbuisson',
        image: '/explore/bentos/justinbuisson.webp',
        description: '→ DESIGN + YOUTUBE',
      },
      {
        href: 'https://bento.me/gaston',
        image: '/explore/bentos/gaston.webp',
        description:
          'Human lvl 42 | Sr. Digital Content & Experience Creator | Early Adopter | Gamer',
      },
      {
        href: 'https://bento.me/warum',
        image: '/explore/bentos/warum.webp',
        description: 'I’m a content creator and student based in Vienna✌🏽',
      },
      {
        href: 'https://bento.me/hustlerani',
        image: '/explore/bentos/hustlerani.webp',
        description: 'aka Ankita Chawla',
      },
      {
        href: 'https://bento.me/daniel',
        image: '/explore/bentos/daniel.webp',
        description:
          'Creo videos sobre tecnología. Reseñas, tendencias, tips y noticias.',
      },
      {
        href: 'https://bento.me/internetjohnny',
        image: '/explore/bentos/internetjohnny.webp',
        description:
          'Writing about how to make tech work for you. Main topics: attention, productivit',
      },
      {
        href: 'https://bento.me/jan',
        image: '/explore/bentos/jan.webp',
        description: 'Yes! ❤️ 🙌🏻 🧠 🚀',
      },
      {
        href: 'https://bento.me/arseniclime',
        image: '/explore/bentos/arseniclime.webp',
        description:
          "I'm a kind soul with a creative mind. Author of Light And Shadow. Food. Culture.",
      },
      {
        href: 'https://bento.me/chethankvs',
        image: '/explore/bentos/chethankvs.webp',
        description: 'Product Designer',
      },
      {
        href: 'https://bento.me/shreya',
        image: '/explore/bentos/shreya.webp',
        description:
          'Data Analyst, I write to help you learn hard concepts of data in half the time',
      },
      {
        href: 'https://bento.me/emre',
        image: '/explore/bentos/emre.webp',
        description:
          'Personal knowledge management, writing, and learning are my passions.',
      },
      {
        href: 'https://bento.me/isabell',
        image: '/explore/bentos/isabell.webp',
        description: 'I write and I can help you organize things.',
      },
      {
        href: 'https://bento.me/burk',
        image: '/explore/bentos/burk.webp',
        description: 'Writer, Notion creator & designer from Germany.',
      },
      {
        href: 'http://bento.me/nicolascoon',
        image: '/explore/bentos/nicolascoon.webp',
        description: 'I’m a freelance content writer for HR tech and SaaS',
      },
      {
        href: 'http://bento.me/robvegas',
        image: '/explore/bentos/robvegas.webp',
        description: 'Social Media Manager from Hamburg',
      },
      {
        href: 'http://bento.me/bastiui',
        image: '/explore/bentos/bastiui.webp',
        description: 'Vulgarisateur Design, Web & Mobile',
      },
      {
        href: 'http://bento.me/flakphoto',
        image: '/explore/bentos/flakphoto.webp',
        description:
          'Andy is a cultural producer and digital director based in Madison, Wisconsin.',
      },
      {
        href: 'https://bento.me/mws',
        image: '/explore/bentos/mws.webp',
        description:
          'Content Creator making content for other Content Creators',
      },
      {
        href: 'https://bento.me/chrislawley',
        image: '/explore/bentos/chrislawley.webp',
        description: 'YouTuber, Photographer, and overall nerd.',
      },
    ],
  },
  {
    label: 'Playful Layouts',
    icon: '/explore/icons/category-playfullayouts.png',
    items: [
      {
        href: 'http://bento.me/none',
        image: '/explore/bentos/none.webp',
        description:
          'Cyrille Jonathan Dadié, Directeur Artistique // Motion Design',
      },
      {
        href: 'https://bento.me/quentin',
        image: '/explore/bentos/quentin.webp',
        description: 'UX/UI - Directeur Artistique',
      },
      {
        href: 'https://bento.me/alldotdesign',
        image: '/explore/bentos/alldotdesign.webp',
        description: 'Digital Product Designer 🛹 Figma Lover 💜',
      },
      {
        href: 'https://bento.me/vl',
        image: '/explore/bentos/vl.webp',
        description: '🌍 Freelance Designer from Bordeaux',
      },
      {
        href: 'https://bento.me/onopko',
        image: '/explore/bentos/onopko.webp',
        description:
          '💻 Web Design and Develop 🏄‍♂️ Pro Web Surfer ≡ adidas SAMBA',
      },
      {
        href: 'https://bento.me/nobgraphica',
        image: '/explore/bentos/nobgraphica.webp',
        description:
          'Digital product designer. Love photos and camping. 👨‍👩‍👦 and 🐈‍⬛',
      },
      {
        href: 'https://bento.me/obrddr',
        image: '/explore/bentos/obrddr.webp',
        description:
          'Apple addict (je crois) mais allergique aux 🍏 (et aux 🍓, 🥝, 🍑…)',
      },
      {
        href: 'http://bento.me/rcb',
        image: '/explore/bentos/rcb.webp',
        description:
          '✻ Multidisciplinary Designer, Amateur Artist ❖ Ex @Google, @Swiggy, @Flipkart',
      },
      {
        href: 'https://bento.me/dayna',
        image: '/explore/bentos/dayna.webp',
        description: 'graphic design student @ mohawk collage.',
      },
      {
        href: 'http://bento.me/paze',
        image: '/explore/bentos/paze.webp',
        description:
          'I’m a logo, UI/UX, product, motion & graphics designer based in Canada.',
      },
      {
        href: 'https://bento.me/katalin',
        image: '/explore/bentos/katalin.webp',
        description:
          'Budapest web designer, when I’m not in front of the screen, you can usually find',
      },
      {
        href: 'https://bento.me/entrpswn',
        image: '/explore/bentos/entrpswn.webp',
        description: 'Lead Product Designer & DesignOps Lead in Edvoy.',
      },
      {
        href: 'https://bento.me/alexallain',
        image: '/explore/bentos/alexallain.webp',
        description:
          'I am a web designer and I explore the web on the radio and in podcasts.',
      },
      {
        href: 'https://bento.me/mrsteven',
        image: '/explore/bentos/mrsteven.webp',
        description:
          'I’m a Steven Houessou-Adin, Product Designer and Design Instructor 🇧🇯',
      },
      {
        href: 'https://bento.me/kushiiiiiiiiya',
        image: '/explore/bentos/kushiiiiiiiiya.webp',
        description:
          'Crafting digital experiences that help customers perform desired actions easily',
      },
      {
        href: 'https://bento.me/deepbear',
        image: '/explore/bentos/deepbear.webp',
        description: 'Branding & design studio',
      },
      {
        href: 'http://bento.me/nic',
        image: '/explore/bentos/nic.webp',
        description: '📱🖥️🎨 Digital Product Designer',
      },
      {
        href: 'https://bento.me/yiyang',
        image: '/explore/bentos/yiyang.webp',
        description: 'どうぞ 🍱',
      },
      {
        href: 'http://bento.me/jmaaloe',
        image: '/explore/bentos/jmaaloe.webp',
        description:
          'UX & play designer with a sweet tooth for fast software and playful apps.',
      },
      {
        href: 'http://bento.me/cedrikea',
        image: '/explore/bentos/cedrikea.webp',
        description:
          'French graphic designer working on some of the biggest YouTube Kids channels 👶',
      },
      {
        href: 'https://bento.me/colorwallies',
        image: '/explore/bentos/colorwallies.webp',
        description: 'Artist/Wallpapers/Icons',
      },
      {
        href: 'https://bento.me/carlos',
        image: '/explore/bentos/carlos.webp',
        description: 'I design and build software',
      },
      {
        href: 'http://bento.me/sarahigbinosa',
        image: '/explore/bentos/sarahigbinosa-1.webp',
        description: 'UI Designer with focus on Designer system',
      },
      {
        href: 'https://bento.me/storchai',
        image: '/explore/bentos/storchai.webp',
        description: 'Here to have a fun life',
      },
      {
        href: 'https://bento.me/mewtru',
        image: '/explore/bentos/mewtru.webp',
        description: 'software engineer at discord and Twitch partner',
      },
      {
        href: 'http://bento.me/akihito',
        image: '/explore/bentos/akihito.webp',
        description:
          'Born in Japan, raised in New Zealand. Design enthusiast who loves tacos',
      },
      {
        href: 'http://bento.me/lochie',
        image: '/explore/bentos/lochie.webp',
        description: 'Design Engineer at Family.co',
      },
      {
        href: 'http://bento.me/rlph',
        image: '/explore/bentos/rlph.webp',
        description: 'Design Director at Vectornator from Aleppo Syria 🇸🇾',
      },
    ],
  },
  {
    label: 'Gamers & Streamers',
    icon: '/explore/icons/category-streamers.png',
    items: [
      {
        href: 'https://bento.me/benjamincode',
        image: '/explore/bentos/benjamincode.webp',
        description: 'YouTuber & Développeur.',
      },
      {
        href: 'http://bento.me/micode',
        image: '/explore/bentos/micode.webp',
        description: 'YouTuber & fondateur @OneClickStudio',
      },
      {
        href: 'http://bento.me/tiqdev',
        image: '/explore/bentos/tiqdev.webp',
        description: '👨🏻‍💻 Frontend Developer 👾 NFT Game Developer',
      },
      {
        href: 'http://bento.me/bellularstudios',
        image: '/explore/bentos/bellularstudios.webp',
        description: 'Indie game development',
      },
      {
        href: 'http://bento.me/pinx',
        image: '/explore/bentos/pinx.webp',
        description:
          "I'm a nature-inspired artist and a creator who loves to make programs.",
      },
      {
        href: 'http://bento.me/cartoonuv',
        image: '/explore/bentos/cartoonuv.webp',
        description:
          'A YouTube channel dedicated to discussing and theorizing about animated series!',
      },
      {
        href: 'https://bento.me/pixel86',
        image: '/explore/bentos/pixel86.webp',
        description: 'Content Creator 🎉 Twitch Affiliate',
      },
      {
        href: 'http://bento.me/elgiz',
        image: '/explore/bentos/elgiz.webp',
        description: 'Снимаю видео и устраиваю клоунаду',
      },
      {
        href: 'http://bento.me/check',
        image: '/explore/bentos/check.webp',
        description: '3D Art, Minecraft Mapmaking, and Programming',
      },
      {
        href: 'https://bento.me/hazem',
        image: '/explore/bentos/hazem.webp',
        description: 'Game Developer',
      },
      {
        href: 'https://bento.me/matafiedgaming',
        image: '/explore/bentos/matafiedgaming.webp',
        description:
          'Bilingual Esports Organization providing entertainment and inspiration',
      },
      {
        href: 'https://bento.me/byeforever',
        image: '/explore/bentos/byeforever.webp',
        description:
          'I’m just a dude, disguised as an artist/designer in the gaming/tech industry',
      },
      {
        href: 'http://bento.me/bellular',
        image: '/explore/bentos/bellular.webp',
        description: 'I make things on the internet.',
      },
      {
        href: 'https://bento.me/creamynyaw',
        image: '/explore/bentos/creamynyaw.webp',
        description:
          "I'm Creamy, an arcane witch who wanders through time, space and antimatter",
      },
      {
        href: 'https://bento.me/veenaviera',
        image: '/explore/bentos/veenaviera.webp',
        description: 'Lead UI/UX Designer @zinnia | TTV Streamer + Stream',
      },
      {
        href: 'https://bento.me/nicovalmont',
        image: '/explore/bentos/nicovalmont.webp',
        description:
          '😃 INFP-T 🏳️‍🌈 Safe Space 🌿 Végétarien 🎮 Streamer #Twitch',
      },
      {
        href: 'https://bento.me/maian',
        image: '/explore/bentos/maian.webp',
        description:
          '💜 Voici mes différents réseaux où tu peux me retrouver ! 💜',
      },
      {
        href: 'https://bento.me/bruises',
        image: '/explore/bentos/bruises.webp',
        description:
          'A former full-time partnered Twitch streamer who now streams for fun.',
      },
      {
        href: 'https://bento.me/snoutup',
        image: '/explore/bentos/snoutup.webp',
        description:
          'Game developer from Lithuania delivering more pig characters to video games.',
      },
      {
        href: 'https://bento.me/mariasoriano',
        image: '/explore/bentos/mariasoriano.webp',
        description: 'Just another YouTuber. I live on the internet.',
      },
      {
        href: 'http://bento.me/lux7701',
        image: '/explore/bentos/lux7701.webp',
        description: 'WordPress Web Designer 🖥️ Playing games 24/7 🎮',
      },
      {
        href: 'https://bento.me/vis',
        image: '/explore/bentos/image.webp',
        description:
          'dm me on discord: viswa#6575 or on twitter @viswagfx to commision.',
      },
    ],
  },
  {
    label: 'Artists & Illustrators',
    icon: '/explore/icons/category-artists.png',
    plainTitle: true,
    items: [
      {
        href: 'https://bento.me/silentrocco',
        image: '/explore/bentos/silentrocco.webp',
        description: 'Modern mime artist and pantomime content creator.',
      },
      {
        href: 'https://bento.me/samarthjajodia',
        image: '/explore/bentos/samarthjajodia.webp',
        description:
          'crafting digital products driven by UX delight, 3d/abstract art & animations',
      },
      {
        href: 'https://bento.me/samcheca',
        image: '/explore/bentos/samcheca.webp',
        description: 'Product Designer and Digital Artist',
      },
      {
        href: 'https://bento.me/noiamgodzilla',
        image: '/explore/bentos/noiamgodzilla.webp',
        description:
          'web3 art and design. Previously Head of Product Design at Unstoppable Domains',
      },
      {
        href: 'https://bento.me/mau',
        image: '/explore/bentos/mau.webp',
        description: 'Motion & Visual Artist',
      },
      {
        href: 'https://bento.me/jackgdesign',
        image: '/explore/bentos/jackgdesign.webp',
        description: '✹ Motion Designer ✹ Graphic Designer ✹ Illustrator',
      },
      {
        href: 'https://bento.me/sergeykoznov',
        image: '/explore/bentos/sergeykoznov.webp',
        description:
          'My work is a mix of video games, 3d, visual effects and films.',
      },
      {
        href: 'http://bento.me/kuashimu',
        image: '/explore/bentos/kuashimu.webp',
        description: 'A Creator & Builder、Crypto Artist、Photographer、',
      },
      {
        href: 'https://bento.me/jethro',
        image: '/explore/bentos/jethro.webp',
        description: 'I believe you can draw 🖍',
      },
      {
        href: 'https://bento.me/cyphrsylph',
        image: '/explore/bentos/cyphrsylph.webp',
        description:
          '☀️ Software Developer | Illustrator 🌙 Anime Addict | Respawn',
      },
      {
        href: 'https://bento.me/renato',
        image: '/explore/bentos/renato.webp',
        description:
          'A UI Designer/Illustrator passionate about art and technology.',
      },
      {
        href: 'https://bento.me/kopoko',
        image: '/explore/bentos/kopoko.webp',
        description: 'aka Oyabun, also the founder of KOPOKO Verse.',
      },
      {
        href: 'https://bento.me/aditshri',
        image: '/explore/bentos/aditshri.webp',
        description:
          '25 y/o artist-designer · dabbling with data + design at sundial',
      },
    ],
  },
  {
    label: 'No‑Code & Notion Lovers',
    icon: '/explore/icons/category-notion.png',
    items: [
      {
        href: 'https://bento.me/sudhanshuyadav',
        image: '/explore/bentos/sudhanshuyadav.webp',
        description: 'I’m a UI/UX Designer and Notion template creator',
      },
      {
        href: 'https://bento.me/lokki',
        image: '/explore/bentos/lokki.webp',
        description:
          'A user-friendly template with customization options, insightful analytics, etc.',
      },
      {
        href: 'https://bento.me/ayeshanotion',
        image: '/explore/bentos/ayeshanotion.webp',
        description: 'All things Notion, mindset and entrepreneurship✍️',
      },
      {
        href: 'https://bento.me/wispy',
        image: '/explore/bentos/wispy.webp',
        description:
          'Learning about audience building + Tweeting about productivity',
      },
      {
        href: 'https://bento.me/math',
        image: '/explore/bentos/math.webp',
        description: 'UI/UX designer & Nocode builder',
      },
      {
        href: 'https://bento.me/shrink',
        image: '/explore/bentos/shrink.webp',
        description:
          'Founder of shrink.agency, Product Manager and no code evangelist',
      },
      {
        href: 'https://bento.me/hannahmilan',
        image: '/explore/bentos/hannahmilan.webp',
        description: 'Product Designer by day and Notion Enthusiast all day',
      },
      {
        href: 'https://bento.me/notionobasan',
        image: '/explore/bentos/notionobasan.webp',
        description: 'Notion Ambassoder in Japan',
      },
      {
        href: 'http://bento.me/michalcreates',
        image: '/explore/bentos/michalcreates.webp',
        description: 'Notion obsessed software developer based in Berlin',
      },
      {
        href: 'http://bento.me/notionhead',
        image: '/explore/bentos/notionhead.webp',
        description: 'Notion Expert building a $1000/mo hustle using No Code',
      },
      {
        href: 'http://bento.me/avern87',
        image: '/explore/bentos/avern87.webp',
        description: 'Total No Code nerd and proud part of the team at Bubble',
      },
      {
        href: 'http://bento.me/maxhaining',
        image: '/explore/bentos/maxhaining.webp',
        description:
          'Founder of 100DaysOfNoCode. I help people bring their ideas to life with no-co',
      },
      {
        href: 'https://bento.me/harshitkhemani',
        image: '/explore/bentos/harshitkhemani.webp',
        description: 'I am a Notion Certified expert',
      },
    ],
  },
  {
    label: 'Collections',
    icon: '/explore/icons/category-collections.png',
    items: [
      {
        href: 'https://bento.me/productmanagement',
        image: '/explore/bentos/productmanagement.webp',
        description:
          '🌈 Product Management 🌟 Product-Led Growth ⚡️ Product Analytics',
      },
      {
        href: 'https://bento.me/backdrops',
        image: '/explore/bentos/backdrops.webp',
        description:
          'Explore my Uniquely crafted wallpaper packs! A whole lot of freebies! 🎉',
      },
      {
        href: 'https://bento.me/map',
        image: '/explore/bentos/map.webp',
        description: 'Stories by Travellers, for Travellers',
      },
      {
        href: 'https://bento.me/icons',
        image: '/explore/bentos/icons.webp',
        description: '30 icon packs. 70,000+ icons.',
      },
      {
        href: 'https://bento.me/walls',
        image: '/explore/bentos/walls.webp',
        description:
          'Explore a selection of of over 120+ A.I generated wallpapers',
      },
      {
        href: 'https://bento.me/headers',
        image: '/explore/bentos/headers.webp',
        description: '300+ seamless, high quality Notion headers.',
      },
      {
        href: 'https://bento.me/backgrounds',
        image: '/explore/bentos/backgrounds.webp',
        description:
          '300+ high-quality gradient backgrounds found across the web.',
      },
      {
        href: 'https://bento.me/data',
        image: '/explore/bentos/data.webp',
        description: "Data resources you'll love using.",
      },
      {
        href: 'https://bento.me/nocode',
        image: '/explore/bentos/nocode.webp',
        description: 'A great resource for No Code Entrepreneurs',
      },
      {
        href: 'https://bento.me/myapps',
        image: '/explore/bentos/myapps.webp',
        description: 'A curated collection of productivity app resources',
      },
      {
        href: 'https://bento.me/peplm',
        image: '/explore/bentos/peplm.webp',
        description: "🎶Anirem per mars i muntanyes i per tot l'univers! 🥾",
      },
    ],
  },
  {
    label: 'Engineers',
    icon: '/explore/icons/category-engineers.png',
    items: [
      {
        href: 'https://bento.me/heysem',
        image: '/explore/bentos/heysem.webp',
        description: 'Senior Mobile Developer | iOS & Android',
      },
      {
        href: 'https://bento.me/nilay18',
        image: '/explore/bentos/nilay18.webp',
        description: '💻 Software Engineer @ Ironclad',
      },
      {
        href: 'https://bento.me/laurilllll',
        image: '/explore/bentos/laurilllll.webp',
        description: 'UX Engineer from Finland',
      },
      {
        href: 'https://bento.me/erencan',
        image: '/explore/bentos/erencan.webp',
        description: 'Love to build with React ⚛️ and React Native📱',
      },
      {
        href: 'https://bento.me/motogram',
        image: '/explore/bentos/motogram.webp',
        description:
          'UI/UX Designer. Front-end Engineer. Programing School Teacher.',
      },
      {
        href: 'https://bento.me/hiloki',
        image: '/explore/bentos/hiloki.webp',
        description: 'I’m a Designer who codes',
      },
      {
        href: 'https://bento.me/facumenzella',
        image: '/explore/bentos/facumenzella.webp',
        description: 'Software engineer & Co-Founder of Swiftable',
      },
      {
        href: 'https://bento.me/snarr',
        image: '/explore/bentos/snarr.webp',
        description: 'Student and Web Developer Temple University',
      },
      {
        href: 'http://bento.me/nash0',
        image: '/explore/bentos/nash0.webp',
        description:
          'I’m Nacho, software engineering student and entrepreneur.',
      },
      {
        href: 'https://bento.me/labct',
        image: '/explore/bentos/labct.webp',
        description: 'iOS Developer & Designer',
      },
      {
        href: 'https://bento.me/evan',
        image: '/explore/bentos/evan.webp',
        description: 'Building things with a keyboard that goes bip boup bip.',
      },
      {
        href: 'https://bento.me/heyjaywilson',
        image: '/explore/bentos/heyjaywilson.webp',
        description:
          'I am an iOS developer that likes to make things with Swift and SwiftUI.',
      },
      {
        href: 'https://bento.me/blvdmitry',
        image: '/explore/bentos/blvdmitry.webp',
        description: 'Principal front-end engineer at Booking.com',
      },
      {
        href: 'https://bento.me/neicore',
        image: '/explore/bentos/neicore.webp',
        description: 'frontend developer',
      },
      {
        href: 'https://bento.me/acbdev',
        image: '/explore/bentos/acbdev.webp',
        description: 'Software Engineer at Spotify and Mad Scientist',
      },
      {
        href: 'https://bento.me/tundsdev',
        image: '/explore/bentos/tundsdev.webp',
        description:
          'I teach SwiftUI and all things related to iOS development on YouTube',
      },
      {
        href: 'http://bento.me/vitormalencar',
        image: '/explore/bentos/vitormalencar.webp',
        description: "I'm a software engineer and content creator.",
      },
      {
        href: 'http://bento.me/ruveyda',
        image: '/explore/bentos/ruveyda.webp',
        description: 'Software Engineer working w/ React and Node.js',
      },
      {
        href: 'https://bento.me/bembenok',
        image: '/explore/bentos/bembenok.webp',
        description:
          '🧑🏼‍💻 Lead Javascript Engineer 🥰 UI/UX Lover 🎮 Avid PS5 Gamer',
      },
      {
        href: 'https://bento.me/pugson',
        image: '/explore/bentos/pugson.webp',
        description: 'ui engineer creating fluid interfaces 🪄✨',
      },
      {
        href: 'https://bento.me/fatih',
        image: '/explore/bentos/fatih.webp',
        description: 'Software Engineer at PlanetScale and creator of vim-go.',
      },
    ],
  },
  {
    label: 'Inspiring Portfolios',
    icon: '/explore/icons/category-portfolios.png',
    items: [
      {
        href: 'https://bento.me/nowe-design',
        image: '/explore/bentos/nowe-design.webp',
        description: 'Noé MEUNIER 🔎 Recherche Stage | Internship Search',
      },
      {
        href: 'https://bento.me/sureworry',
        image: '/explore/bentos/sureworry.webp',
        description: "I'm a Product Designer and Illustrator",
      },
      {
        href: 'https://bento.me/aureliendesert',
        image: '/explore/bentos/aurelien-desert.webp',
        description: 'INTERACTIVE DESIGNER // ART DIRECTION & 3D',
      },
      {
        href: 'https://bento.me/rona',
        image: '/explore/bentos/rona.webp',
        description:
          'I create digital experiences that impact people’s imaginations. Design at Apple.',
      },
      {
        href: 'https://bento.me/duyluong',
        image: '/explore/bentos/duyluong.webp',
        description:
          'Web and mobile app designer. I enjoy creating delightful user experiences',
      },
      {
        href: 'https://bento.me/sai',
        image: '/explore/bentos/sai.webp',
        description:
          'Crafting a better future through design, engineering, and laughter.',
      },
      {
        href: 'https://bento.me/giorgio',
        image: '/explore/bentos/giorgio.webp',
        description: 'was a physicist, now an upcoming data scientist',
      },
      {
        href: 'https://bento.me/hbshih',
        image: '/explore/bentos/hbshih.webp',
        description:
          "Product designer with a passion for creating little things that improve people's",
      },
      {
        href: 'https://bento.me/jonathan',
        image: '/explore/bentos/jonathan.webp',
        description: 'Product Designer & Triathlete',
      },
      {
        href: 'http://bento.me/aloscha',
        image: '/explore/bentos/aloscha.webp',
        description: 'Product designer',
      },
      {
        href: 'https://bento.me/alexis',
        image: '/explore/bentos/alexis.webp',
        description: 'Web Developer',
      },
      {
        href: 'https://bento.me/yashbanka',
        image: '/explore/bentos/yashbanka.webp',
        description: 'Transdisciplinary Innovator',
      },
      {
        href: 'https://bento.me/behnam',
        image: '/explore/bentos/behnam.webp',
        description:
          'Product Designer with +6 years of experience in Product Design',
      },
      {
        href: 'https://bento.me/sebastianmurillonader',
        image: '/explore/bentos/sebastianmurillonader.webp',
        description: 'Self-proclaimed “projects guy”, No Code consultant',
      },
      {
        href: 'https://bento.me/miles',
        image: '/explore/bentos/miles.webp',
        description: 'Maker & Product Designer. Design director in training.',
      },
      {
        href: 'https://bento.me/juliefranca',
        image: '/explore/bentos/juliefranca.webp',
        description: 'Product design intern at Qconcursos',
      },
      {
        href: 'https://bento.me/nicola',
        image: '/explore/bentos/nicola.webp',
        description:
          'Senior iOS Software Engineer at Zalando, WWDC serial attendee and former scholar',
      },
      {
        href: 'https://bento.me/shouldwang',
        image: '/explore/bentos/shouldwang.webp',
        description: 'I’m currently working as a Sr. UI designer at 17LIVE.',
      },
      {
        href: 'https://bento.me/ib',
        image: '/explore/bentos/ib.webp',
        description: 'Developer from Delhi, India 🇮🇳',
      },
    ],
  },
  {
    label: 'Founders & Indie Makers',
    icon: '/explore/icons/category-founders.png',
    items: [
      {
        href: 'https://bento.me/heyjrmoraes',
        image: '/explore/bentos/heyjrmoraes.webp',
        description: 'Senior Product Designer & Solopreneur 👽',
      },
      {
        href: 'https://bento.me/ianw',
        image: '/explore/bentos/ianw.webp',
        description:
          'Building and launching. Owner and Founder of Wine Jobs UK and StockBuddy.',
      },
      {
        href: 'https://bento.me/greg',
        image: '/explore/bentos/greg.webp',
        description: 'CEO of Late Checkout & Host of Where it Happens Podcast',
      },
      {
        href: 'https://bento.me/maciek',
        image: '/explore/bentos/maciek.webp',
        description: 'Fullstack developer building in public with Next.js',
      },
      {
        href: 'https://bento.me/jordi',
        image: '/explore/bentos/jordi.webp',
        description: 'Making nice things and helping others do the same',
      },
      {
        href: 'http://bento.me/abt',
        image: '/explore/bentos/abt.webp',
        description: 'Software Developer & SaaS Indiepreneur',
      },
      {
        href: 'https://bento.me/timo21',
        image: '/explore/bentos/timo21.webp',
        description: 'Developer and founder of Memoly App',
      },
      {
        href: 'https://bento.me/solt',
        image: '/explore/bentos/solt.webp',
        description: 'The Web3 guy 🔥 CEO & Creative Director',
      },
      {
        href: 'http://bento.me/elias',
        image: '/explore/bentos/elias.webp',
        description: 'CEO at Codesphere and Ex-Googler',
      },
      {
        href: 'http://bento.me/reeceatkinson',
        image: '/explore/bentos/reeceatkinson.webp',
        description: 'CEO & Developer at UpMeet',
      },
      {
        href: 'https://bento.me/beard',
        image: '/explore/bentos/beard.webp',
        description:
          'CEO & design at @anydistanceclub. Photographer & product builder.',
      },
      {
        href: 'http://bento.me/pung',
        image: '/explore/bentos/pung.webp',
        description: 'I build stuff',
      },
      {
        href: 'https://bento.me/andy',
        image: '/explore/bentos/andy.webp',
        description: 'Building read.cv',
      },
      {
        href: 'https://bento.me/mk',
        image: '/explore/bentos/mk.webp',
        description: 'Maker of various products',
      },
      {
        href: 'http://bento.me/tibo',
        image: '/explore/bentos/tibo.webp',
        description: 'Building Tweethunter & Taplio',
      },
      {
        href: 'http://bento.me/jim',
        image: '/explore/bentos/jim.webp',
        description: 'Building small SaaS products in public',
      },
      {
        href: 'https://bento.me/chichi',
        image: '/explore/bentos/chichi.webp',
        description: 'Designer. Writer. Founder.',
      },
    ],
  },
  {
    label: 'Teams & Businesses',
    icon: '/explore/icons/category-teams.png',
    items: [
      {
        href: 'http://bento.me/thelittlelabs',
        image: '/explore/bentos/thelittlelabs.webp',
        description: 'Animation and Design Studio.',
      },
      {
        href: 'https://bento.me/curiosity',
        image: '/explore/bentos/curiosity.webp',
        description: 'One search for everything',
      },
      {
        href: 'https://bento.me/queued',
        image: '/explore/bentos/queued.webp',
        description: 'In music we trust.',
      },
      {
        href: 'https://bento.me/butter',
        image: '/explore/bentos/butter.webp',
        description:
          'The most delightful way to prepare, run, and recap your collaborative sessions.',
      },
      {
        href: 'https://bento.me/dimequecomo',
        image: '/explore/bentos/dimequecomo.webp',
        description: 'EDUCA LO QUE COMES // EDUCA LO QUE HACES',
      },
      {
        href: 'https://bento.me/maisontangible',
        image: '/explore/bentos/maisontangible.webp',
        description:
          'Creative studio from Paris Illustration and augmented reality.',
      },
      {
        href: 'https://bento.me/interfacelabs',
        image: '/explore/bentos/interfacelabs.webp',
        description:
          'Mobile block explorer with social features. Currently in Public Beta.',
      },
      {
        href: 'https://bento.me/protopie',
        image: '/explore/bentos/protopie.webp',
        description:
          '#1 Tool for Advanced Prototyping Create no-code, high-fidelity prototypes.',
      },
      {
        href: 'https://bento.me/volum',
        image: '/explore/bentos/volum.webp',
        description: 'Asset, Property & Facility Manager.',
      },
      {
        href: 'https://bento.me/lux',
        image: '/explore/bentos/lux.webp',
        description:
          'A university club dedicated to promoting education and research on healthcare',
      },
      {
        href: 'https://bento.me/welovedevs',
        image: '/explore/bentos/welovedevs.webp',
        description:
          'Every techie can find the company where they will be happy to work.',
      },
      {
        href: 'https://bento.me/dentalfuster',
        image: '/explore/bentos/dentalfuster.webp',
        description: 'A Dental clinic based in Sueca, Spain',
      },
      {
        href: 'http://bento.me/pokebest',
        image: '/explore/bentos/pokebest.webp',
        description: 'Pokébest brings the Pokémon experience to Discord.',
      },
      {
        href: 'https://bento.me/upmeet',
        image: '/explore/bentos/upmeet.webp',
        description: 'Making your meetings effortless',
      },
      {
        href: 'http://bento.me/steady',
        image: '/explore/bentos/steady.webp',
        description: 'Steady is where creators get paid doing what they love.',
      },
      {
        href: 'https://bento.me/edurino',
        image: '/explore/bentos/edurino.webp',
        description: 'Hands on digital learning - Playful school preparation',
      },
      {
        href: 'http://bento.me/designtipstoday',
        image: '/explore/bentos/designtipstoday.webp',
        description: 'Design with better way.',
      },
      {
        href: 'http://bento.me/overdeckapp',
        image: '/explore/bentos/overdeckapp.webp',
        description:
          'The easiest way to build a fully custom digital deck to control your stream.',
      },
      {
        href: 'http://bento.me/browsercompany',
        image: '/explore/bentos/browsercompany.webp',
        description: "We're building Arc – a better way to use the internet.",
      },
      {
        href: 'https://bento.me/floxiescommunity',
        image: '/explore/bentos/floxiescommunity.webp',
        description:
          'International community for women in UX/UI Design & Webflow Development',
      },
    ],
  },
  {
    label: 'Crypto & Web3 Enthusiasts',
    icon: '/explore/icons/category-crypto.png',
    items: [
      {
        href: 'https://bento.me/ted',
        image: '/explore/bentos/ted.webp',
        description: 'Product designer based in the NY Tri-State Area',
      },
      {
        href: 'https://bento.me/glaze',
        image: '/explore/bentos/glaze.webp',
        description: 'Web3 Investor & Builder',
      },
      {
        href: 'https://bento.me/rphgrc',
        image: '/explore/bentos/rphgrc.webp',
        description:
          '💎 Building something new in venture capital, crypto, web3',
      },
      {
        href: 'https://bento.me/aergo',
        image: '/explore/bentos/aergo.webp',
        description:
          'Sharing about Web3, Programming and Random Shower Thoughts 🚿',
      },
      {
        href: 'https://bento.me/jorgegarriazo',
        image: '/explore/bentos/jorgegarriazo.webp',
        description:
          'UI Designer passionate about technology, cryptos, and video games.',
      },
      {
        href: 'https://bento.me/thoth',
        image: '/explore/bentos/thoth.webp',
        description: 'Bitcoiner, Designer, Father, Wheelchair user! 💫',
      },
      {
        href: 'https://bento.me/eliandecrypto',
        image: '/explore/bentos/eliandecrypto.webp',
        description: '🚀Hablo sobre #Bitcoin, #Crypto y #NFTs',
      },
      {
        href: 'https://bento.me/web3guide',
        image: '/explore/bentos/web3guide.webp',
        description:
          'This is an intro to web3. It contains articles, books, podcast episodes',
      },
    ],
  },
  {
    label: 'Clean Layouts',
    icon: '/explore/icons/category-simplelayouts.png',
    items: [
      {
        href: 'https://bento.me/marinou',
        image: '/explore/bentos/marinou.webp',
        description:
          'a biomedical engineer working as a presentation designer @upwork',
      },
      {
        href: 'https://bento.me/quentinmagn',
        image: '/explore/bentos/quentinmagn.webp',
        description: 'Less is more',
      },
      {
        href: 'https://bento.me/designerayse',
        image: '/explore/bentos/designerayse.webp',
        description:
          '🎨 product designer by day. 🏛️ architecture in a past life.',
      },
      {
        href: 'https://bento.me/habib',
        image: '/explore/bentos/habib.webp',
        description: 'Building products and solving user problems.',
      },
      {
        href: 'http://bento.me/ismaelbranco',
        image: '/explore/bentos/ismaelbranco.webp',
        description: 'That designer',
      },
      {
        href: 'http://bento.me/musho',
        image: '/explore/bentos/musho.webp',
        description: 'Michal Simkovic, Digital Design & Startups',
      },
      {
        href: 'https://bento.me/christine',
        image: '/explore/bentos/christine.webp',
        description: 'French Art Director, and Sr. Product Designer.',
      },
      {
        href: 'http://bento.me/julian',
        image: '/explore/bentos/julian.webp',
        description:
          'Building intersubjective realities. Currently at Linear. Previously at Stripe.',
      },
      {
        href: 'http://bento.me/spade',
        image: '/explore/bentos/spade.webp',
        description: 'UI/UX Designer & Branding Master.',
      },
    ],
  },
];

export const communityFiles: CommunityFile[] = [
  {
    href: 'http://twitter.com/joinbento',
    thumbnail: '/explore/files/empty-placeholder-4.webp',
    avatar: '/explore/files/avatar-avatartwitter.png',
    title: 'Want to have your file featured?',
    author: 'Tweet at us with a link & screenshot!',
  },
  {
    href: 'https://www.figma.com/community/file/1230934815723762454/Bento-Widgets-Gameboy-Cartridge',
    thumbnail: '/explore/files/thumbnailllllll.webp',
    avatar: '/explore/files/avatar-yo.jpeg',
    title: 'Gameboy Cartridges',
    author: 'Eduardo Calvo',
  },
  {
    href: 'https://www.figma.com/community/file/1207719189705528381/Play-with-Bento-template',
    thumbnail: '/explore/files/playwithbento.webp',
    avatar: '/explore/files/avatar-4thi6bugtiduduyv-8wzhz5em-400x400.jpeg',
    title: 'Play with Bento',
    author: 'akihito',
  },
  {
    href: 'https://www.figma.com/community/file/1232620929235403629/Bento-%E2%80%94-2.5D-widgets',
    thumbnail: '/explore/files/thumbnailll.webp',
    avatar: '/explore/files/avatar-7b88af62-10a1-452c-9664-7c06644f22d1.jpeg',
    title: '2.5D widgets',
    author: 'Double Glitch 🇺🇦',
  },
  {
    href: 'https://www.figma.com/community/file/1211353149077070779/Bento-Widget-Templates',
    thumbnail: '/explore/files/file-cover---2.webp',
    avatar:
      '/explore/files/avatar-users-clbnvawyh000qmk08cxucg26e-hkxxxold27c4lbqr-facet.gif',
    title: 'Bento Widget Templates',
    author: 'Jello',
  },
  {
    href: 'https://www.figma.com/community/file/1215459503008759467/MBP-Bento-Tiles',
    thumbnail: '/explore/files/8cd9d024-60aa-49da-adfa-946fe63421b7-cover.webp',
    avatar: '/explore/files/avatar-2eafeb55-3ee3-482f-9378-0cd56eefe1a7.png',
    title: 'MBP Bento Tiles',
    author: 'Gavin Atkinson',
  },
  {
    href: 'https://www.figma.com/community/file/1226492784936343161/Free-%7C-Bento-Tiles',
    thumbnail: '/explore/files/here.webp',
    avatar: '/explore/files/avatar-avataaaaar.jpeg',
    title: 'Bento Tiles',
    author: 'David',
  },
  {
    href: 'https://www.figma.com/community/file/1231003136598073212/Bento-Mockup-Widgets-Template',
    thumbnail: '/explore/files/yes.webp',
    avatar: '/explore/files/avatar-this.jpeg',
    title: 'Mockup Widgets Template',
    author: 'Nadav Papay',
  },
  {
    href: 'https://www.figma.com/community/file/1231184483170475120/Simple-Bento-Cards',
    thumbnail: '/explore/files/bentocards.webp',
    avatar: '/explore/files/avatar-ava.jpeg',
    title: 'Media Bento Cards',
    author: 'Dan',
  },
  {
    href: 'https://www.figma.com/community/file/1224776320111027422',
    thumbnail: '/explore/files/bentoicons.webp',
    avatar: '/explore/files/avatar-avataaaar.jpeg',
    title: 'Bento Icons',
    author: 'Nick Souza',
  },
  {
    href: 'https://www.figma.com/community/file/1215640795685444511/Map-Card',
    thumbnail: '/explore/files/1bae2786-ec2f-4f66-a175-86bf5f471dca-cover.webp',
    avatar: '/explore/files/avatar-c88eda4e-1ef7-43ed-9c69-ba0ae74135e7.jpeg',
    title: 'Map Card',
    author: 'Cristian Crețu',
  },
  {
    href: 'https://www.figma.com/community/file/1203240264061811938/Bento-template',
    thumbnail: '/explore/files/41dbf080-b86e-4279-85a9-230018e8d9bc-cover.webp',
    avatar: '/explore/files/avatar-26c7921e-635f-4e52-ba93-dec294510709.jpeg',
    title: 'Bento Template',
    author: 'Maharram Hasanli',
  },
  {
    href: 'https://www.figma.com/community/file/1248522938889734014/%F0%9F%8D%B1-Bento-Widgets',
    thumbnail: '/explore/files/cover.webp',
    avatar: '/explore/files/avatar-8c2bb950-e414-4b99-82e0-f1526a5557be.jpg',
    title: 'Bento Widgets',
    author: 'Harshvardhan Agarwal',
  },
];
