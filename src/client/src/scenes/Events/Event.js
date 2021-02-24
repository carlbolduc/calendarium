export default function Event(props) {

  return (
    <div>
      <h2>{props.event.nameEn}</h2>
      <p>{props.event.descriptionEn}</p>
    </div>
  );
}