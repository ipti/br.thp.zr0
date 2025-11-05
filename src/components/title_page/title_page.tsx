export default function TitlePage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h1>{title}</h1>
      <div className="p-4" />
      {description && (
        <>
          <p>{description}</p>
        </>
      )}
    </div>
  );
}
