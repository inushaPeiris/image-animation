"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function ImageScrollAnimation() {
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const controlsCurrent = useAnimation();
  const controlsNext = useAnimation();

  const images = ["/assets/cat1.png", "/assets/cat2.png", "/assets/cat3.png"];

  const handleScroll = (event: { deltaY: number }) => {
    if (animating || showContent) return;
    setAnimating(true);

    if (event.deltaY > 0) {
      controlsCurrent.start({
        x: "-100%",
        opacity: 0,
        transition: { duration: 0.7, ease: "easeInOut" },
      });

      controlsNext.start({
        x: "0%",
        opacity: 1,
        transition: { duration: 0.7, ease: "easeInOut" },
      });

      setTimeout(() => {
        if (currentImage + 1 >= images.length) {
          setShowContent(true);
        } else {
          setCurrentImage((prev) => prev + 1);
        }
        setAnimating(false);
      }, 700);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [animating, currentImage, showContent]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {loading && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-4xl"
        >
          Cats
        </motion.div>
      )}

      {!loading && !showContent && (
        <>
          <motion.img
            key={`current-${currentImage}`}
            src={images[currentImage]}
            initial={{ x: "0%", opacity: 1 }}
            animate={controlsCurrent}
            className="absolute inset-0 w-1/4 h-2/4 object-cover mx-auto rounded-lg"
            style={{ left: "0%", transform: "translateX(-50%)" }}
          />

          <motion.img
            key={`next-${(currentImage + 1) % images.length}`}
            src={images[(currentImage + 1) % images.length]}
            initial={{ x: "100%", opacity: 0 }}
            animate={controlsNext}
            className="absolute inset-0 w-1/4 h-2/4 object-cover mx-auto rounded-lg"
            style={{ left: "0%", transform: "translateX(-50%)" }}
          />
        </>
      )}

      {!loading && showContent && (
        <div className="absolute inset-0 flex flex-col items-center">
          <div className="flex justify-center items-center w-full">
            {images.map((image, index) => (
              <motion.img
                key={`final-${index}`}
                src={image}
                className="w-1/3 h-auto object-cover mx-2 rounded-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            ))}
          </div>
          <div className="text-center mt-10 p-10">
            <motion.h1
              className="text-4xl font-bold"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Welcome to the Animal World!
            </motion.h1>
            <motion.p
              className="text-lg mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </motion.p>
          </div>
        </div>
      )}
    </div>
  );
}
