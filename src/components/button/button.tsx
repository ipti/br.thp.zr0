import { Button, ButtonProps } from "primereact/button";


export function ZButton(props: ButtonProps) {
        return <Button {...props} pt={{loadingIcon: {style: {marginRight: '0.5rem'}}}} />
}