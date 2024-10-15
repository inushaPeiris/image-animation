'use client';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ImageScrollAnimation() {
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const controlsCurrent = useAnimation();
  const controlsNext = useAnimation();

  const images = ['/assets/cat1.png', '/assets/cat2.png', '/assets/cat3.png'];

  const handleScroll = (event: { deltaY: number }) => {
    if (animating || showContent) return;
    setAnimating(true);

    if (event.deltaY > 0) {
      // Animate the current image out to the left
      controlsCurrent.start({
        x: '-100%', // Move out of view to the left
        opacity: 0, // Fade out
        transition: { duration: 0.7, ease: 'easeInOut' },
      });

      // Animate the next image into view
      controlsNext.start({
        x: '0%', // Bring the next image into view
        opacity: 1, // Fade in
        transition: { duration: 0.7, ease: 'easeInOut' },
      });

      setTimeout(() => {
        if (currentImage + 1 >= images.length) {
          setShowContent(true); // Show content after the last image
        } else {
          setCurrentImage((prev) => prev + 1); // Move to the next image
        }
        setAnimating(false);
      }, 700); // Duration of the animation
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust this to your preferred loading duration

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [animating, currentImage, showContent]);

  return (
    <div className="relative w-full h-screen overflow-hidden p-32">
      {loading && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-4xl"
        >
          Animals
        </motion.div>
      )}

      {!loading && !showContent && (
        <>
          <motion.img
            key={`current-${currentImage}`}
            src={images[currentImage]}
            initial={{ x: '0%', opacity: 1 }} // Start centered
            animate={controlsCurrent} // Controlled animation for the current image
            className="absolute inset-0 w-1/4 h-2/4 object-cover left-0"
          />

          <motion.img
            key={`next-${(currentImage + 1) % images.length}`}
            src={images[(currentImage + 1) % images.length]}
            initial={{ x: '30vw', opacity: 0 }} // Start to the right and hidden
            animate={controlsNext} // Controlled animation for the next image
            className="absolute inset-0 w-1/4 h-2/4 object-cover right-0"
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
                className="w-1/3 h-auto object-cover mx-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger the animation
              />
            ))}
          </div>
          <div className="text-center mt-10 p-10">
            <motion.h1
              className="text-4xl font-bold"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }} // Slight delay for text
            >
              Welcome to the Animal World!
            </motion.h1>
            <motion.p
              className="text-lg mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }} // Slight delay for text
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet...
            </motion.p>
          </div>
        </div>
      )}
    </div>
  );
}
