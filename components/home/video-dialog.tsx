'use client';

import { motion } from 'framer-motion';
import { bentoVideoEase } from '@/lib';

const FRAME_SHADOW =
  'shadow-[0_-70px_100px_#fff,0_58px_76px_rgba(0,0,0,.03),0_38px_45px_rgba(0,0,0,.02),0_22px_24px_rgba(0,0,0,.02),0_12px_12px_rgba(0,0,0,.02),0_5px_6px_rgba(0,0,0,.01),0_1px_3px_rgba(0,0,0,.01)] max-[479px]:shadow-[0_58px_76px_rgba(0,0,0,.03),0_38px_45px_rgba(0,0,0,.02),0_22px_24px_rgba(0,0,0,.02),0_12px_12px_rgba(0,0,0,.02),0_5px_6px_rgba(0,0,0,.01),0_1px_3px_rgba(0,0,0,.01)]';

function VideoDesktop() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster="/home/video-dialog/desktop-demo-poster.jpg"
      className="block h-[760px] w-[1160px] rounded-3xl object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)] max-[991px]:h-[460px] max-[991px]:w-[700px] max-[767px]:h-[68vw] max-[767px]:w-screen max-[479px]:hidden"
    >
      <source src="/home/video-dialog/desktop-video.mp4" type="video/mp4" />
    </video>
  );
}

function VideoMobile() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      poster="/home/video-dialog/mobile-demo-poster.jpg"
      className="hidden rounded-3xl object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)] max-[479px]:block max-[479px]:h-[169vw] max-[479px]:w-[88vw]"
    >
      <source src="/home/video-dialog/mobile-video.mp4" type="video/mp4" />
    </video>
  );
}

export function VideoDialog() {
  return (
    <motion.div
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      transition={{ delay: 2.4, duration: 1, ease: bentoVideoEase }}
      className="relative z-[2] -mt-[105vh] flex w-full flex-col items-center px-6 max-[479px]:mt-0 max-[479px]:bg-white max-[479px]:pb-[140px]"
    >
      <div
        className={`overflow-hidden rounded-3xl max-[767px]:px-0 ${FRAME_SHADOW}`}
      >
        <VideoDesktop />
        <VideoMobile />
      </div>
    </motion.div>
  );
}
