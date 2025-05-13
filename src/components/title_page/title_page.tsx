export default function TitlePage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2>{title}</h2>
      <div className="p-4" />
      {description && (
        <>
          <p>{description}</p>
        </>
      )}
    </div>
  );
}
