import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  console.log(form);
  const comment = form.get("data") as string | null;

  try {
    console.log("##################", comment);
  } catch (error) {
    
  }
}
