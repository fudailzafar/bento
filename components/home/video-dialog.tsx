export function VideoDialog() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      {/* Desktop Video */}
      <div className="hidden sm:block">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/home/desktop-demo-poster.jpg"
          className="mx-auto rounded-3xl object-cover shadow-lg md:h-[460px] md:w-[700px] lg:h-[760px] lg:w-[1160px]"
          style={{
            backgroundImage: "url('/home/desktop-demo-poster.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <source src="/home/desktop-video.mp4" type="video/mp4" />
          <source src="/home/desktop-demo.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Mobile Video */}
      <div className="block sm:hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/home/mobile-demo-poster.jpg"
          data-object-fit="cover"
          className="mx-auto w-11/12 max-w-xl rounded-3xl border object-cover shadow-lg"
          style={{
            backgroundImage: "url('/home/mobile-demo-poster.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <source src="/home/mobile-video.mp4" type="video/mp4" />
          <source src="/home/mobile-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
