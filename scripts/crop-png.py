from PIL import Image

image_path = 'path/to/your/image.png'
image = Image.open(image_path)

crop_width = 64
crop_height = 32

cropped_image = image.crop((0, 0, crop_width, crop_height))

output_path = 'path/to/save/cropped_image.png'  # cropped image will be saved here
cropped_image.save(output_path)

print(f'cropped image saved as {output_path}')
