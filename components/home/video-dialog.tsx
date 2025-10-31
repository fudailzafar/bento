export function VideoDialog() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="hidden sm:block">
        <video
          src="/home/portfoliofy-desktop-demo.mp4"
          autoPlay
          loop
          muted
          className="mx-auto w-[1200px] rounded-3xl shadow-lg"
        />
      </div>
      <div className="block sm:hidden">
        <video
          src="/home/portfoliofy-mobile-demo.mp4"
          autoPlay
          loop
          muted
          className="mx-auto w-11/12 max-w-xl rounded-3xl shadow-lg"
        />
      </div>
    </div>
  );
}
