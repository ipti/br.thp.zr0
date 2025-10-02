import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import './input_number.css';

export default function ZInputNumber(props: InputNumberProps) {
    return <InputNumber {...props} pt={{
        buttonGroup: {
            className: 'p-button-group'
        },
    }} />
}