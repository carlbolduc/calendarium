export default function Day(props) {

  function selectDay() {
    if (props.day !== null) {
      props.selectDay(props.day);
    }
  }
  const className = props.date.day === props.day ? "table-primary" : "";
  return (
    <td className={className} style={{cursor: "pointer"}} onMouseDown={selectDay} onMouseUp={props.hide}>{props.day}</td>
  )
}
