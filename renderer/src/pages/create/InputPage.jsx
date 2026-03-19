import { useParams } from "react-router-dom";
import { renderTemplate } from "../../components/templates/templatesEngine";

export default function InputPage() {
  const { templateId } = useParams();

  if (!templateId) return <div>Missing template</div>;

  return (
    <div>
      {renderTemplate(Number(templateId), {})}
    </div>
  );
}