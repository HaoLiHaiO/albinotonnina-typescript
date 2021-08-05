import React from "react";
import sceneTransitions1 from "./scene/transitions";
import Scene from "./scene";
import Subtitles from "./subtitles";
import "./styles/main.css";

interface throttleProps {
  func: () => void;
  wait: number;
  immediate: boolean;
}

function throttle({ func, wait, immediate }: throttleProps) {
  // eslint-disable-next-line no-undef
  let timeout: number | NodeJS.Timeout | null;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const getDimentions = () => ({
  height: window.innerHeight,
  width: window.innerWidth,
  isPortrait: window.innerHeight > window.innerWidth,
});

export default function App() {
  const [dimensions, setDimensions] = React.useState(getDimentions);

  const screens = Math.round(sceneTransitions1.duration / dimensions.height);
  const arrayScreens = Array.from(Array(screens).keys());

  React.useEffect(() => {
    const debouncedHandleResize = throttle(
      setDimensions.bind(null, getDimentions),
      100,
      true
    );
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  return (
    <>
      {arrayScreens.map((el) => (
        <div
          key={el}
          data-scene-placeholder
          style={{ height: dimensions.height }}
        ></div>
      ))}

      <Scene
        width={dimensions.width}
        height={dimensions.height}
        isPortrait={dimensions.isPortrait}
      />
      <Subtitles isPortrait={dimensions.isPortrait} />
    </>
  );
}
