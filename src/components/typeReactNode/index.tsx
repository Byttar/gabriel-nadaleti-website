import React, {
  cloneElement,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from "react";
import { useEffect, useState } from "react";

type TypingEffectProps = {
  children: ReactNode;
  speed?: number;
  cursor?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTextLength(node: ReactNode): number {
  if (typeof node === "string" || typeof node === "number") {
    return String(node).length;
  }

  if (Array.isArray(node)) {
    return node.reduce(
      (total, child) => total + getTextLength(child),
      0,
    );
  }

  if (isValidElement(node)) {
    return getTextLength((node.props as PropsWithChildren<typeof node.props>).children);
  }

  return 0;
}

function renderTyped(
  node: ReactNode,
  visibleCharacters: number,
  counter: { value: number },
): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    const text = String(node);

    const remaining = visibleCharacters - counter.value;

    if (remaining <= 0) {
      return "";
    }

    const visibleText = text.slice(0, remaining);

    counter.value += text.length;

    return visibleText;
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>
        {renderTyped(child, visibleCharacters, counter)}
      </React.Fragment>
    ));
  }

  if (isValidElement(node)) {
    const children = (node.props as PropsWithChildren<typeof node.props>).children;

    if (children === undefined) {
      return node;
    }

    return cloneElement(
      node,
      undefined,
      renderTyped(children, visibleCharacters, counter),
    );
  }

  return node;
}

export function TypingEffect({
  children,
  speed = 30,
  cursor = true,
  cursorCharacter = "|",
  cursorClassName
}: TypingEffectProps) {
  const totalCharacters = useMemo(() => getTextLength(children), [children]);

  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    setVisibleCharacters(0);

    if (totalCharacters === 0) {
      return;
    }

    let cancelled = false;

    async function type() {
      for (let i = 1; i <= totalCharacters; i++) {
        if (cancelled) {
          return;
        }

        setVisibleCharacters(i);

        await sleep(speed);
      }
    }

    type();

    return () => {
      cancelled = true;
    };
  }, [children, speed, totalCharacters]);

  // Memoize the rendered typed output. Only recompute if `children` or `visibleCharacters` changes.
  const rendered = useMemo(() => {
    const counter = { value: 0 };
    return renderTyped(children, visibleCharacters, counter);
    // children: can be tree, but TypeScript/React should support this as dependency
    // visibleCharacters: state, triggers update
  }, [children, visibleCharacters]);

  return (
    <>
      {rendered}
      {cursor && (
        <span className={cursorClassName ?? "animate-type"}>
          {cursorCharacter}
        </span>
      )}
    </>
  );
}
