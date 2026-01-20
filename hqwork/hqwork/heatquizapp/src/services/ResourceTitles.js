// Static mapping from resource URL fragments to human-friendly titles
// Used to improve UX on forethought and self-reflection pages without
// changing how data is fetched from the backend.

// Each entry matches if the URL contains the given `match` string.
const RESOURCE_TITLE_RULES = [
  // Thermal resistance of a plane wall
  {
    match: "gvo0apdv.slf.pdf",
    title: "Conduction 04: Conduction in a multilayer plane wall",
    type: "pdf",
  },
  {
    match: "vOjk7M7tmNU",
    title: "Conduction 04: Conduction in a multilayer plane wall",
    type: "video",
  },

  // Thermal resistance of a cylindrical wall
  {
    match: "j2mc0rwg.mk1.pdf",
    title: "Conduction 05: Conduction in a cylindrical coordinate system",
    type: "pdf",
  },
  {
    match: "z-7WyWcGmME",
    title: "Conduction 05: Conduction in a cylindrical coordinate system",
    type: "video",
  },

  // Convective thermal resistance in cylindrical systems
  {
    match: "1iboh335.d40.pdf",
    title: "Conduction 08: Multilayer pipe wall with a convective heat transfer resistance",
    type: "pdf",
  },
  {
    match: "Lyb1_BHQn20",
    title: "Conduction 08: Multilayer pipe wall with a convective heat transfer resistance",
    type: "video",
  },

  // Thermal resistance in a multilayer plane wall with convection
  {
    match: "2zmpch2i.m35.pdf",
    title: "Conduction 07: Multilayer wall with a convective heat transfer resistance",
    type: "pdf",
  },
  {
    match: "reD_HHAYoDs",
    title: "Conduction 07: Multilayer wall with a convective heat transfer resistance",
    type: "video",
  },
];

const findTitleForUrl = (url, type) => {
  if (!url) return null;
  const rule = RESOURCE_TITLE_RULES.find(
    (r) => r.type === type && url.includes(r.match)
  );
  return rule ? rule.title : null;
};

export const getPdfTitle = (url, fallback = "PDF") => {
  return findTitleForUrl(url, "pdf") || fallback;
};

export const getVideoTitle = (url, fallback = "Video") => {
  return findTitleForUrl(url, "video") || fallback;
};

