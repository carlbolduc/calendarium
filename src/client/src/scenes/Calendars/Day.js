export default function Day(props) {

  function setCurrentDay() {
    if (props.day !== null) {
      props.setCurrentDay(props.day);
    }
  }
  const className = props.currentDay === props.day ? "table-primary" : "";
  return (
    <td className={className} style={{cursor: "pointer"}} onClick={setCurrentDay}>{props.day}</td>
  )
}