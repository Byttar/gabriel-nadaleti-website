import { useEffect, useRef, useState } from "react";
import { TypingEffect } from "../components/typeReactNode";

export const useTypingPersistentTitle = (title: string, timeoutAmount: number = 800) => {
    // --- Only render <TypingEffect> for the title ONCE during initial mount
  // Since the TypingEffect uses effects or progressive state, we use useRef to persist the first render flag.
  const hasTypedTitle = useRef(false);
  // We'll use a local state for initial rendering for the typing effect, then replace with plain text.
  const [showTypedTitle, setShowTypedTitle] = useState(true);

  useEffect(() => {
    if (!hasTypedTitle.current) {
      hasTypedTitle.current = true;
      setShowTypedTitle(true);
      // After the typing effect finishes (simulate duration), swap to static.
      // You can adjust the time as needed to match actual typing.
      const timeout = setTimeout(() => {
        setShowTypedTitle(false);
      }, timeoutAmount); // Tune duration to TypingEffect's speed/length.
      return () => clearTimeout(timeout);
    } else {
      setShowTypedTitle(false);
    }
  }, []); // only once on mount

  const textNodeOnly = <span className="font-semibold">{title}</span>;

  const nodeWithTyping = (
    <TypingEffect cursor={false}>
      {textNodeOnly}
    </TypingEffect>
  )

  const exportedNode = showTypedTitle ? nodeWithTyping : textNodeOnly;

  return [exportedNode] as const;
}
