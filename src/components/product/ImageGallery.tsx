import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <section className="gallery" aria-label={`${title} gallery`}>
      <figure className="gallery-main">
        <img src={activeImage} alt={title} />
      </figure>
      <div className="gallery-thumbs">
        {images.map((image) => (
          <button
            key={image}
            className={`gallery-thumb ${image === activeImage ? 'is-active' : ''}`}
            onClick={() => setActiveImage(image)}
            type="button"
            aria-label={`View ${title} angle`}
          >
            <img src={image} alt={`${title} thumbnail`} />
          </button>
        ))}
      </div>
    </section>
  );
}
