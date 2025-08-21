import { SVGProps } from 'react'

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="2"
        y="17"
        fontSize="16"
        fontWeight="700"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        CVSNAP
      </text>
    </svg>
  )
} 