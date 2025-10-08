import React from "react";

const Hero = ({ title, subtitle, image, imageAlt = "Hero image" }) => {
  return (
    <div className="text-center mb-5">
      {image && (
        <img
          src={image}
          alt={imageAlt}
          style={{ width: "220px", marginBottom: "1rem" }}
          className="mx-auto d-block"
        />
      )}
      <h2 className="fw-bold text-dark mb-2">{title}</h2>
      <p className="text-secondary fs-5">{subtitle}</p>
    </div>
  );
};

export default Hero;
