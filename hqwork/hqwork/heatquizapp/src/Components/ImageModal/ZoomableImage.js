import OpenSeaDragon from "openseadragon";
import React, { useEffect, useRef, useState } from "react";


export function ZoomableImage({ image }) {
var hasLoaded = false

const [viewer, setViewer] = useState( null);

useEffect(() => {
    if (image && viewer) {
      viewer.open(image.source);
    }
  }, [image, viewer]);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();

    setViewer(
      OpenSeaDragon({
        id: "openSeaDragon",
        prefixUrl: "openseadragon-images/",
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2
      })
    );
  };

  useEffect(() => {
    if(hasLoaded) return;

    InitOpenseadragon();

    hasLoaded = true

    return () => {
        viewer && viewer.destroy();
    };
  }, []);

return (
  <div 
  id="openSeaDragon" 
  style={{width:'1200px', height:'800px'}}
  >
  </div>
  );
};

