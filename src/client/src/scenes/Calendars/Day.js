export default function Day(props) {

  const className = props.currentDay === props.day ? "table-primary" : "";
  return (
    <td className={className}>{props.day}</td>
  )
}