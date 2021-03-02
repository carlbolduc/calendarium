export default function Day(props) {

  function selectDay() {
    if (props.day !== null) {
      props.selectDay(props.day);
    }
  }
  const className = props.currentDay === props.day ? "table-primary" : "";
  return (
    <td className={className} style={{cursor: "pointer"}} onClick={selectDay}>{props.day}</td>
  )
}