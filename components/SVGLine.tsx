export default function SVGLine({ color = 'gray' }: { color?: string }) {
    return (
        <svg width="50px" height="10" xmlns="http://www.w3.org/2000/svg">
            <line
                x1="0"
                y1="5"
                x2="100%"
                y2="5"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="5, 5"
                strokeDashoffset="10"
            >
                <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
            </line>
        </svg>
    );
}
