from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import os

def generate_images(prompt: str, output_filename: str = 'gemini-native-image.png'):
  """
  Generate an image using Gemini API with the given prompt and save it to output_filename.
  Returns the relative path to the saved image, or None if no image was generated.
  """
  # Save directly to frontend's public folder
  backend_dir = os.path.dirname(os.path.dirname(__file__))  # Go up from func/
  frontend_public_dir = os.path.join(os.path.dirname(backend_dir), 'frontend', 'public', 'generated_images')
  os.makedirs(frontend_public_dir, exist_ok=True)
  
  base_filename = os.path.basename(output_filename)
  output_path = os.path.join(frontend_public_dir, base_filename)
  
  client = genai.Client(api_key='AIzaSyDK55Fh6nwb6kKQVFP03iZs4uwfvZCz13o')
  try:
    response = client.models.generate_content(
      model="gemini-2.0-flash-preview-image-generation",
      contents=prompt,
      config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE']
      )
    )
  except Exception as e:
    print(f"Error generating content: {e}")
    return None

  # Defensive checks for response structure
  candidates = getattr(response, 'candidates', None)
  if not candidates or not isinstance(candidates, list) or not candidates:
    print("No candidates returned from API.")
    return None
  content = getattr(candidates[0], 'content', None)
  if not content or not hasattr(content, 'parts'):
    print("No content parts in response.")
    return None

  image_saved = False
  for part in content.parts:
    if getattr(part, 'text', None) is not None:
      print(part.text)
    elif getattr(part, 'inline_data', None) is not None:
      data = getattr(part.inline_data, 'data', None)
      if isinstance(data, bytes):
        try:
          image = Image.open(BytesIO(data))
          image.save(output_path)
          print(f"Image saved to: {output_path}")
          image_saved = True
        except Exception as e:
          print(f"Error processing image data: {e}")
      else:
        print("inline_data.data is not bytes or is None.")
  if image_saved:
    # Return just the filename for frontend to use as /generated_images/filename
    return base_filename
  return None