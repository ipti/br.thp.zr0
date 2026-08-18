"use client";
import { Steps, StepsProps } from "primereact/steps";
import { cloneElement, isValidElement, ReactElement } from "react";

import "./steps.css"

export default function ZSteps(props: StepsProps){
    const model = props.model?.map((item, index) => ({
        ...item,
        template: (_item: typeof item, options: { element: React.ReactNode }) =>
            isValidElement(options.element)
                ? cloneElement(
                    options.element as ReactElement<{
                        'aria-current'?: 'step'
                        'aria-disabled'?: boolean
                    }>,
                    {
                        'aria-current': index === (props.activeIndex ?? 0) ? 'step' : undefined,
                        'aria-disabled': item.disabled || undefined
                    }
                )
                : options.element
    }))

    return(
        <Steps {...props} model={model} />
    )
}
