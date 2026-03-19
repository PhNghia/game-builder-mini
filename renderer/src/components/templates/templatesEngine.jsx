import GroupSortTemplate from "./store/GroupSortTemplate";

export const templateRegistry = {
  1: { component: GroupSortTemplate }
};

export function renderTemplate(templateId, props) {
  const template = templateRegistry[templateId];
  if (!template) return <div>Không tìm thấy template</div>;

  const Component = template.component;
  return <Component {...props} />;
}