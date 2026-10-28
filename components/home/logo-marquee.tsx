const icons = [
  'producthunt',
  'discord',
  'medium',
  'webflow',
  'reddit',
  'buymeacoffee',
  'twitch',
  'behance',
  'pinterest',
  'devto',
  'mastodon',
];

// bento.me's "And many more" strip: 480px window, 64px fades, 18s linear loop.
export function LogoMarquee() {
  return (
    <div className="flex flex-col items-center gap-5 max-[479px]:w-full">
      <h2 className="m-0 flex text-center text-xl font-normal leading-7 text-black">
        And many more
      </h2>
      <div className="relative flex w-[480px] items-center justify-center gap-2 overflow-hidden max-[479px]:w-full">
        <div className="bento-icon-carousel flex items-center justify-center gap-2 py-2">
          {[...icons, ...icons.slice(0, 10)].map((name, i) => (
            <div
              key={i}
              className="w-10 shrink-0 rounded-[13px] shadow-[0_3px_4px_rgba(0,0,0,.06)]"
            >
              <img
                src={`/home/bento/icon-${name}.svg`}
                alt=""
                className="block w-10"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-16 bg-[linear-gradient(90deg,#fff,rgba(255,255,255,0)_100%,#fff)]" />
        <div className="absolute inset-y-0 right-0 w-16 bg-[linear-gradient(270deg,#fff,rgba(255,255,255,0)_100%,#fff)]" />
      </div>
    </div>
  );
}
