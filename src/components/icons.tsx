import { SVGProps } from "react";

const iconsObject = {
    "grip-vertical": {
        viewBox: "0 0 24 24",
        path: (
            <>
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="19" r="1" />
            </>
        ),
    },
    "resize-right": {
        viewBox: "0 0 18 18",
        path: (
            <>
                <path d="m14.228 16.227a1 1 0 0 1 -.707-1.707l1-1a1 1 0 0 1 1.416 1.414l-1 1a1 1 0 0 1 -.707.293zm-5.638 0a1 1 0 0 1 -.707-1.707l6.638-6.638a1 1 0 0 1 1.416 1.414l-6.638 6.638a1 1 0 0 1 -.707.293zm-5.84 0a1 1 0 0 1 -.707-1.707l12.477-12.477a1 1 0 1 1 1.415 1.414l-12.478 12.477a1 1 0 0 1 -.707.293z" />
            </>
        ),
    },
};
export type TIconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export const Icons = ({
    size = 16,
    width,
    height,
    color = "none",
    fill = "none",
    name,
    ...props
}: TIconSvgProps & { name: keyof typeof iconsObject }) => {
    const icon = iconsObject[name];
    return (
        <svg
            height={size || height}
            width={size || width}
            viewBox={icon.viewBox}
            fill={fill}
            color={color}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {icon.path}
        </svg>
    );
};
