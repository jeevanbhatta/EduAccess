from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential

client = ImageAnalysisClient(
    endpoint=os.getenv("VISION_ENDPOINT"),
    credential=AzureKeyCredential(os.getenv("VISION_KEY"))
)

def process_image_with_sdk(image_url):
    result = client.analyze_from_url(
        image_url=image_url,
        visual_features=[VisualFeatures.CAPTION, VisualFeatures.TAGS],
        gender_neutral_caption=True
    )

    description = result.caption.text if result.caption else "No description available"
    tags = [tag.name for tag in result.tags] if result.tags else []
    return {
        "description": description,
        "tags": tags
    }