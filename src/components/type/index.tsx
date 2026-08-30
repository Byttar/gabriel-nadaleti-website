import React, { useState, useEffect, useRef } from "react";

type TypeProps = {
  text: string;
  speed?: number; // milliseconds per character
  className?: string;
  loop?: boolean;
  cursor?: boolean;
  delay?: number; // milliseconds before start typing
  persistentCursor?: boolean; // Show blinking cursor after animation is finished
  showCursor?: boolean; // New prop: if false, disables cursor regardless of other settings
};

const Type: React.FC<TypeProps> = ({
  text,
  speed = 50,
  className = "",
  loop = false,
  cursor = true,
  delay = 400,
  persistentCursor = false,
  showCursor: showCursorProp = true, // default true for back-compat
}) => {
  const [displayed, setDisplayed] = useState("");
  const [currIndex, setCurrIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [blink, setBlink] = useState(true);
  const initialTimeoutRef = useRef<number | null>(null);

  const isTyping = currIndex < text.length;
  // showCursor now factors in showCursorProp
  const showCursor = showCursorProp && cursor && (isTyping || persistentCursor);

  useEffect(() => {
    setDisplayed("");
    setCurrIndex(0);
    setStarted(false);
    if (initialTimeoutRef.current !== null) {
      clearTimeout(initialTimeoutRef.current);
    }
    initialTimeoutRef.current = window.setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => {
      if (initialTimeoutRef.current !== null) {
        clearTimeout(initialTimeoutRef.current);
      }
    };
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    if (currIndex < text.length) {
      const timeout = window.setTimeout(() => {
        setDisplayed((prev) => prev + text[currIndex]);
        setCurrIndex((idx) => idx + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (loop) {
      const loopTimeout = window.setTimeout(() => {
        setDisplayed("");
        setCurrIndex(0);
        setStarted(false);
        if (initialTimeoutRef.current !== null) {
          clearTimeout(initialTimeoutRef.current);
        }
        initialTimeoutRef.current = window.setTimeout(() => {
          setStarted(true);
        }, delay);
      }, 1000);
      return () => clearTimeout(loopTimeout);
    }
  }, [currIndex, text, speed, loop, started, delay]);

  // Blinking cursor effect
  useEffect(() => {
    if (showCursor) {
      const interval = window.setInterval(() => setBlink((b) => !b), 500);
      return () => clearInterval(interval);
    }
  }, [showCursor]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          style={{
            display: "inline-block",
            width: "1ch",
            opacity: blink ? 1 : 0,
            transition: "opacity .15s",
          }}
        >
          |
        </span>
      )}
    </span>
  );
};

export default Type;
