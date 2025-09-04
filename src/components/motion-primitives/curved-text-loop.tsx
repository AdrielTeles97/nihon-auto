"use client"

import { cn } from "@/lib/utils"
import React from "react"

type Props = {
  text: string
  speedSeconds?: number
  className?: string
}

// Lightweight curved text loop using SVG <textPath> with native <animate>.
// No external deps beyond React. Works in modern browsers.
export function CurvedTextLoop({ text, speedSeconds = 20, className }: Props) {
  // Duplicate the text to ensure the path is fully filled.
  const content = (text + " ").repeat(8)

  return (
    <div className={cn("relative mx-auto max-w-5xl", className)}>
      <svg
        viewBox="0 0 1000 200"
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-full text-foreground/80 [mask-image:radial-gradient(white,transparent_75%)]"
        fill="none"
      >
        <defs>
          <path id="nihon-curve" d="M 0 120 Q 250 20 500 120 T 1000 120" />
        </defs>

        <g>
          <text
            fontSize="14"
            letterSpacing="0.2em"
            className="fill-current"
          >
            <textPath href="#nihon-curve" startOffset="0%">
              {content}
              <animate
                attributeName="startOffset"
                from="0%"
                to="100%"
                dur={`${speedSeconds}s`}
                repeatCount="indefinite"
              />
            </textPath>
          </text>

          <text
            fontSize="14"
            letterSpacing="0.2em"
            className="fill-current"
          >
            <textPath href="#nihon-curve" startOffset="-50%">
              {content}
              <animate
                attributeName="startOffset"
                from="-50%"
                to="50%"
                dur={`${speedSeconds}s`}
                repeatCount="indefinite"
              />
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  )
}

