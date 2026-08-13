// Groply — design/useBadgeTints.js
// Petit hook pour consommer les teintes de badges avec le THÈME COURANT.
// Séparé de store/badges.js, qui doit rester du JS pur testable sans React.
import { useMemo } from "react";
import { useC } from "./ThemeContext.jsx";
import { buildBadgeTints, buildBadgeRarities } from "../store/badges.js";

export function useBadgeTints() {
  const C = useC();
  return useMemo(() => ({
    tints: buildBadgeTints(C),
    rarities: buildBadgeRarities(C),
  }), [C]);
}
