import ejs from "ejs";
import path from "path";

export const renderTemplate = async (
  templateName: string,
  data: Record<string, any>,
): Promise<string> => {
  const templatePath = path.join(
    __dirname,
    "../templates/emails",
    `${templateName}.ejs`,
  );

  const html = await ejs.renderFile(templatePath, data);
  return html;
};
