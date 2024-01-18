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
};
export type TIconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export const Icons = ({
    size = 16,
    width,
    height,
    color = "none",
    name,
    ...props
}: TIconSvgProps & { name: keyof typeof iconsObject }) => {
    const icon = iconsObject[name];
    return (
        <svg
            height={size || height}
            width={size || width}
            viewBox={icon.viewBox}
            fill={color}
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
