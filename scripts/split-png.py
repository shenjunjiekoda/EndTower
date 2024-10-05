from PIL import Image
import os

image_path = 'path/to/your/multi-image.png'  # image path to be split

image = Image.open(image_path)

imgs = {
    'jay': 0,
}

img_names = []
i = 0
for name, index in imgs.items():
    if i == index:
        img_names.append(name)
        i += 1

print('split img size:', len(img_names))

# dest directory to save split images
output_dir = 'path/to/your/output/directory'

os.makedirs(output_dir, exist_ok=True)

n_32px_width = 2
single_width = 32 * n_32px_width
single_height = 32

for i, name in enumerate(img_names):
    y = i * single_height

    enemy_image = image.crop((0, y, single_width, y + single_height))

    for j in range(n_32px_width):
        img = enemy_image.crop((j * 32, 0, (j + 1) * 32, 32))
        img.save(os.path.join(output_dir, f"{name}_{j}.png"))

print("finished split")
