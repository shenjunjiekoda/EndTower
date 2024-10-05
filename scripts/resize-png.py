from PIL import Image

image_path = 'path/to/your/image.png'  # target image path
image = Image.open(image_path)

target_width = 32
target_height = 32

resized_image = image.resize((target_width, target_height), Image.ANTIALIAS)

output_path = 'path/to/output/resized_image.png'  # dest path for resized image
resized_image.save(output_path)

print(f'Resized image saved to {output_path}.')
