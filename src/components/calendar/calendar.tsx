import { Calendar, CalendarProps } from "primereact/calendar";
import "./calendar.css"
import { addLocale } from "primereact/api";

export default function ZCalendar(props: CalendarProps) {
    addLocale("pt-br", {
        firstDayOfWeek: 1,
        dayNames: [
            "domingo",
            "segunda",
            "terça",
            "quarta",
            "quinta",
            "sexta",
            "sábado",
        ],
        dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
        dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthNames: [
            "janeiro",
            "fevereiro",
            "março",
            "abril",
            "maio",
            "junho",
            "julho",
            "agosto",
            "setembro",
            "outubro",
            "novembro",
            "dezembro",
        ],
        monthNamesShort: [
            "jan",
            "fev",
            "mar",
            "abr",
            "mai",
            "jun",
            "jul",
            "ago",
            "set",
            "out",
            "nov",
            "dez",
        ],
        today: "Hoje",
        clear: "Limpiar",
    });
    return (
        <Calendar {...props} locale="pt-br"
        />
    )
}